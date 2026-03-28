import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePlanner } from '../context/PlannerContext';
import { useFinance } from '../context/FinanceContext';
import { ArrowLeft, Save, Trash2, Link as LinkIcon, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { projects, updateProject, deleteProject, isLoading } = usePlanner();
  const { jars } = useFinance();
  
  const [project, setProject] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isLoading && projects.length > 0) {
      const found = projects.find(p => p.id === id);
      if (found) {
        setProject(found);
      } else {
        navigate('/planner');
      }
    }
  }, [id, projects, isLoading, navigate]);

  if (isLoading || !project) return <div className="planning-loading">Đang tải dữ liệu...</div>;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProject({ ...project, [name]: value });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateProject(id, project);
      // alert('Lưu thành công');
    } catch (err) {
      alert('Lỗi lưu dữ liệu: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Bạn có chắc muốn xóa dự án này? Thao tác không thể hoàn tác.')) {
      await deleteProject(id);
      navigate('/planner');
    }
  };

  return (
    <div className="project-detail">
      <header className="detail-header">
        <Link to="/planner" className="back-link">
          <ArrowLeft size={20} /> Quay lại Kế hoạch
        </Link>
        <div className="detail-actions">
          <button className="del-btn" onClick={handleDelete}>
            <Trash2 size={16} /> Xóa
          </button>
          <button className="btn-primary" onClick={handleSave} disabled={isSaving}>
            <Save size={16} /> {isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
          </button>
        </div>
      </header>

      <div className="detail-layout">
        <div className="detail-sidebar planner-glass-card">
          <h3>Thông tin Dự án</h3>
          
          <div className="form-group">
            <label>Tên dự án</label>
            <input type="text" name="name" value={project.name || ''} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Trạng thái</label>
            <select name="status" value={project.status || 'idea'} onChange={handleChange}>
              <option value="idea">💡 Ý tưởng</option>
              <option value="researching">🔍 Đang nghiên cứu</option>
              <option value="executing">⚙️ Đang triển khai</option>
              <option value="active">💸 Đang tạo dòng tiền</option>
              <option value="paused">⏸️ Tạm dừng</option>
            </select>
          </div>

          <div className="form-group">
            <label>Mức độ ưu tiên</label>
            <select name="priority" value={project.priority || 'medium'} onChange={handleChange}>
              <option value="high">🔴 Cao (Làm ngay)</option>
              <option value="medium">🟡 Trung bình</option>
              <option value="low">🟢 Thấp (Để sau)</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>Phân loại</label>
            <input type="text" name="category" value={project.category || ''} placeholder="VD: Đầu tư, Freelance..." onChange={handleChange} />
          </div>

          <hr className="divider" />
          <h3>Chi phí & Lộ trình</h3>

          <div className="form-group">
            <label>Vốn cần thiết (VNĐ)</label>
            <input type="number" name="capital_required" value={project.capital_required || ''} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Rút vốn từ hũ (Nguồn)</label>
            <select name="capital_jar_id" value={project.capital_jar_id || ''} onChange={handleChange}>
              <option value="">-- Chọn hũ nguồn --</option>
              {jars.map(jar => (
                <option key={jar.jar_id} value={jar.jar_id}>{jar.name} ({jar.percentage}%)</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Sinh lời chảy vào hũ (Đích)</label>
            <select name="target_jar_id" value={project.target_jar_id || ''} onChange={handleChange}>
              <option value="">-- Chọn hũ đích --</option>
              {jars.map(jar => (
                <option key={jar.jar_id} value={jar.jar_id}>{jar.name} ({jar.percentage}%)</option>
              ))}
            </select>
            <small className="help-text">Khi có giao dịch thu nhập từ dự án này, hệ thống sẽ ưu tiên rót vào hũ này.</small>
          </div>

        </div>

        <div className="detail-main planner-glass-card">
          <div className="editor-header">
            <h3>Ghi chú / Kế hoạch chi tiết</h3>
            <span className="info-badge"><AlertCircle size={14}/> Hỗ trợ Markdown</span>
          </div>
          <textarea 
            className="markdown-editor"
            name="markdown_notes"
            value={project.markdown_notes || ''}
            onChange={handleChange}
            placeholder="# Viết kế hoạch, checklist công việc và thả link tài liệu vào đây..."
          ></textarea>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
