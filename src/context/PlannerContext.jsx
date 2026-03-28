import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from './AuthContext';

const PlannerContext = createContext();

export const usePlanner = () => {
  return useContext(PlannerContext);
};

export const PlannerProvider = ({ children }) => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchProjects();
    } else {
      setProjects([]);
      setIsLoading(false);
    }
  }, [user]);

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      if (!navigator.onLine) {
        // Simple fallback
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('income_projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (err) {
      console.error('Error fetching projects:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const addProject = async (projectData) => {
    if (!user) return null;

    try {
      const newProject = {
        ...projectData,
        user_id: user.id,
      };

      const { data, error } = await supabase
        .from('income_projects')
        .insert([newProject])
        .select()
        .single();

      if (error) throw error;
      
      setProjects([data, ...projects]);
      return data;
    } catch (err) {
      console.error('Error adding project:', err);
      throw err;
    }
  };

  const updateProject = async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('income_projects')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setProjects(projects.map(p => p.id === id ? data : p));
      return data;
    } catch (err) {
      console.error('Error updating project:', err);
      throw err;
    }
  };

  const deleteProject = async (id) => {
    try {
      const { error } = await supabase
        .from('income_projects')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setProjects(projects.filter(p => p.id !== id));
      return true;
    } catch (err) {
      console.error('Error deleting project:', err);
      throw err;
    }
  };

  const value = {
    projects,
    isLoading,
    addProject,
    updateProject,
    deleteProject,
    refreshProjects: fetchProjects
  };

  return (
    <PlannerContext.Provider value={value}>
      {children}
    </PlannerContext.Provider>
  );
};
