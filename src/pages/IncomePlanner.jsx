import React, { useState } from 'react';
import { usePlanner } from '../context/PlannerContext';
import { useAuth } from '../context/AuthContext';
import { Plus, LayoutGrid, List, BarChart2, Calendar, Target, TrendingUp, Lightbulb } from 'lucide-react';
import { Link } from 'react-router-dom';

const IncomePlanner = () => {
  const { projects, isLoading, addProject } = usePlanner();
  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' or 'list'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;
    
    await addProject({
      name: newProjectName,
      status: 'idea',
      priority: 'medium',
      category: 'other',
      created_at: new Date().toISOString()
    });
    
    setNewProjectName('');
    setIsModalOpen(false);
  };

  const getStatusColumn = (status, title, icon) => {
    const columnProjects = projects.filter(p => (p.status || 'idea') === status);
    
    return (
      <div className="kanban-column">
        <div className={`column-header status-${status}`}>
          <div className="status-badge">{icon} {title}</div>
          <span className="count">{columnProjects.length}</span>
        </div>
        <div className="column-content">
          {columnProjects.map(project => (
            <Link to={`/planner/${project.id}`} key={project.id} className="project-card planner-glass-card">
              <div className="card-header">
                <span className={`priority-indicator priority-${project.priority || 'medium'}`}></span>
                <span className="category-tag">{project.category || 'Idea'}</span>
              </div>
              <h3>{project.name}</h3>
              <div className="card-footer">
                {project.capital_required > 0 && (
                  <span className="meta-item"><Target size={12}/> {project.capital_required.toLocaleString()}đ</span>
                )}
                {project.setup_time && (
                  <span className="meta-item"><Calendar size={12}/> {project.setup_time}</span>
                )}
              </div>
            </Link>
          ))}
          {columnProjects.length === 0 && (
            <div className="empty-slot">Thả vào đây</div>
          )}
        </div>
      </div>
    );
  };

  if (isLoading) return <div className="planning-loading">Loading projects...</div>;

  return (
    <div className="income-planner">
      <header className="planner-header">
        <div className="header-title">
          <h1>Hoạch Định Thu Nhập</h1>
          <p className="text-secondary">Quản lý các ý tưởng và dự án kiếm tiền (Income Streams)</p>
        </div>
        
        <div className="header-actions">
          <div className="view-toggles">
            <button 
              className={`toggle-btn ${viewMode === 'kanban' ? 'active' : ''}`}
              onClick={() => setViewMode('kanban')}
            >
              <LayoutGrid size={18} />
            </button>
            <button 
              className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              <List size={18} />
            </button>
          </div>
          <button className="planner-new-btn" onClick={() => setIsModalOpen(true)}>
            <Plus size={18} /> <span>Dự án mới</span>
          </button>
        </div>
      </header>

      {viewMode === 'kanban' ? (
        <div className="kanban-board">
          {getStatusColumn('idea', 'Ý tưởng', <Lightbulb size={14}/>)}
          {getStatusColumn('researching', 'Nghiên cứu', <BarChart2 size={14}/>)}
          {getStatusColumn('executing', 'Đang triển khai', <Target size={14}/>)}
          {getStatusColumn('active', 'Đang tạo dòng tiền', <TrendingUp size={14}/>)}
        </div>
      ) : (
        <div className="list-view">
          <table className="planner-table">
            <thead>
              <tr>
                <th>Tên dự án</th>
                <th>Trạng thái</th>
                <th>Ưu tiên</th>
                <th>Vốn yêu cầu</th>
              </tr>
            </thead>
            <tbody>
              {projects.map(p => (
                <tr key={p.id}>
                  <td>
                    <Link to={`/planner/${p.id}`} className="project-link">{p.name}</Link>
                  </td>
                  <td><span className={`status-tag status-${p.status}`}>{p.status}</span></td>
                  <td><span className={`priority-tag priority-${p.priority}`}>{p.priority}</span></td>
                  <td>{p.capital_required ? `${p.capital_required.toLocaleString()}đ` : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content planner-glass-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Ý tưởng Thu nhập mới</h2>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}>&times;</button>
            </div>
            <form onSubmit={handleCreateProject} className="planner-form">
              <div className="form-group">
                <label>Tên dự án / Nguồn thu</label>
                <input 
                  type="text" 
                  autoFocus
                  placeholder="VD: Kênh YouTube Code Bot"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  required 
                />
              </div>
              <div className="form-actions">
                <button type="button" className="planner-btn-secondary" onClick={() => setIsModalOpen(false)}>Hủy</button>
                <button type="submit" className="planner-new-btn">Tạo dự án</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default IncomePlanner;
