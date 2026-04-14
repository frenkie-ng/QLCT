import React, { useState, useEffect } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Check, AlertCircle, Save, Edit3, AlignLeft } from 'lucide-react';

const JarSettings = () => {
  const { jars, updateJarSettings } = useFinance();
  const [localSettings, setLocalSettings] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState(null);

  useEffect(() => {
    const initial = {};
    jars.forEach(jar => {
      initial[jar.id] = {
        name: jar.name,
        description: jar.description,
        percentage: jar.percentage
      };
    });
    setLocalSettings(initial);
  }, [jars]);

  const total = Object.values(localSettings).reduce((sum, s) => sum + Number(s.percentage || 0), 0);
  const isValid = total === 100;

  const handleFieldChange = (id, field, value) => {
    let finalValue = value;
    if (field === 'percentage') {
      const val = value === '' ? 0 : parseInt(value);
      finalValue = isNaN(val) ? 0 : val;
    }
    
    setLocalSettings(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: finalValue
      }
    }));
  };

  const handleSave = async () => {
    if (!isValid) return;
    setIsSaving(true);
    try {
      await updateJarSettings(localSettings);
      setSaveMessage({ type: 'success', text: 'Đã lưu cấu hình hũ thành công!' });
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (err) {
      setSaveMessage({ type: 'error', text: 'Lỗi khi lưu: ' + err.message });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="jar-settings-container glass-card">
      <div className="settings-header">
        <h3>Cấu hình hệ thống Hũ</h3>
        <p className="text-secondary">Tùy chỉnh tên, mô tả và tỷ lệ phân bổ tự động cho từng hũ.</p>
      </div>

      <div className="jars-list">
        {jars.map(jar => (
          <div key={jar.id} className="jar-setting-card">
            <div className="jar-card-header">
              <div className="jar-title-group">
                <div className="jar-color-badge" style={{ backgroundColor: jar.color }}></div>
                <div className="input-with-icon">
                  <Edit3 size={14} className="input-icon" />
                  <input
                    type="text"
                    value={localSettings[jar.id]?.name ?? ''}
                    onChange={(e) => handleFieldChange(jar.id, 'name', e.target.value)}
                    placeholder="Tên hũ"
                    className="name-input"
                  />
                </div>
              </div>
              <div className="jar-percentage-input">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={localSettings[jar.id]?.percentage ?? ''}
                  onChange={(e) => handleFieldChange(jar.id, 'percentage', e.target.value)}
                  className="percentage-input"
                />
                <span className="unit">%</span>
              </div>
            </div>
            
            <div className="jar-card-body">
              <div className="input-with-icon full-width">
                <AlignLeft size={14} className="input-icon" />
                <textarea
                  value={localSettings[jar.id]?.description ?? ''}
                  onChange={(e) => handleFieldChange(jar.id, 'description', e.target.value)}
                  placeholder="Mô tả mục đích của hũ này..."
                  className="description-input"
                  rows="2"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className={`total-indicator ${isValid ? 'valid' : 'invalid'}`}>
        <div className="total-main">
          <span>Tổng cộng tỷ lệ phân bổ: </span>
          <span className="total-value">{total}%</span>
        </div>
        {!isValid && (
          <div className="error-msg">
            <AlertCircle size={14} />
            <span>Tổng phải bằng 100% (Hiện tại {total > 100 ? 'thừa' : 'thiếu'} {Math.abs(100 - total)}%)</span>
          </div>
        )}
      </div>

      <div className="actions">
        {saveMessage && (
          <div className={`save-status ${saveMessage.type}`}>
            {saveMessage.type === 'success' ? <Check size={16} /> : <AlertCircle size={16} />}
            <span>{saveMessage.text}</span>
          </div>
        )}
        <button
          className="save-btn"
          disabled={!isValid || isSaving}
          onClick={handleSave}
        >
          {isSaving ? 'Đang lưu...' : <><Save size={18} /> Lưu toàn bộ cấu hình</>}
        </button>
      </div>

      <style jsx>{`
        .jar-settings-container {
          padding: 2.5rem;
          margin-top: 1rem;
        }
        .settings-header {
          margin-bottom: 2.5rem;
        }
        .settings-header h3 {
          font-size: 1.5rem;
          margin-bottom: 0.6rem;
          background: linear-gradient(135deg, #fff 0%, #aaa 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .jars-list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 1.5rem;
        }
        .jar-setting-card {
          padding: 1.5rem;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 16px;
          transition: all 0.3s ease;
        }
        .jar-setting-card:hover {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 255, 255, 0.15);
          transform: translateY(-2px);
        }
        .jar-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.2rem;
          gap: 1rem;
        }
        .jar-title-group {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex: 1;
        }
        .jar-color-badge {
          width: 8px;
          height: 24px;
          border-radius: 4px;
          flex-shrink: 0;
        }
        .input-with-icon {
          position: relative;
          display: flex;
          align-items: center;
          flex: 1;
        }
        .input-icon {
          position: absolute;
          left: 0;
          color: var(--text-tertiary);
          opacity: 0.5;
        }
        .name-input {
          width: 100%;
          background: none;
          border: none;
          padding: 0.5rem 0.5rem 0.5rem 1.8rem;
          color: #fff;
          font-weight: 700;
          font-size: 1.1rem;
          outline: none;
          border-bottom: 1px solid transparent;
          transition: border-bottom 0.2s;
        }
        .name-input:focus {
          border-bottom: 1px solid var(--accent-cyan);
        }
        .jar-percentage-input {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          background: rgba(0, 0, 0, 0.2);
          padding: 0.4rem 0.8rem;
          border-radius: 10px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .percentage-input {
          background: none;
          border: none;
          color: var(--accent-cyan);
          width: 45px;
          text-align: right;
          font-size: 1.1rem;
          font-weight: 800;
          outline: none;
        }
        .unit {
          color: var(--text-tertiary);
          font-size: 0.9rem;
          font-weight: 600;
        }
        .jar-card-body {
          margin-top: 0.5rem;
        }
        .full-width {
          width: 100%;
        }
        .description-input {
          width: 100%;
          background: none;
          border: none;
          padding: 0.5rem 0.5rem 0.5rem 1.8rem;
          color: var(--text-tertiary);
          font-size: 0.85rem;
          line-height: 1.5;
          outline: none;
          resize: none;
          transition: color 0.2s;
        }
        .description-input:focus {
          color: #fff;
        }
        .total-indicator {
          margin-top: 2.5rem;
          padding: 1.5rem;
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }
        .total-indicator.valid {
          background: rgba(0, 209, 255, 0.08);
          border: 1px solid rgba(0, 209, 255, 0.15);
        }
        .total-indicator.invalid {
          background: rgba(255, 61, 0, 0.08);
          border: 1px solid rgba(255, 61, 0, 0.15);
        }
        .total-main {
          display: flex;
          justify-content: space-between;
          font-weight: 600;
          font-size: 1.1rem;
        }
        .total-value {
          font-size: 1.4rem;
          font-weight: 900;
          color: var(--accent-cyan);
        }
        .invalid .total-value {
          color: var(--accent-danger);
        }
        .error-msg {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          color: var(--accent-danger);
          font-size: 0.9rem;
        }
        .actions {
          margin-top: 2.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1.5rem;
        }
        .save-btn {
          background: var(--accent-cyan);
          color: #000;
          padding: 1rem 2.5rem;
          border-radius: 40px;
          font-weight: 800;
          display: flex;
          align-items: center;
          gap: 0.8rem;
          transition: all 0.2s;
          box-shadow: 0 4px 15px rgba(0, 209, 255, 0.3);
        }
        .save-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 209, 255, 0.4);
        }
        .save-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          box-shadow: none;
        }
        .save-status {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          font-size: 1rem;
          font-weight: 500;
        }
        .save-status.success { color: var(--accent-success); }
        .save-status.error { color: var(--accent-danger); }

        @media (max-width: 768px) {
          .jar-settings-container {
            padding: 1.5rem;
          }
          .jars-list {
            grid-template-columns: 1fr;
          }
          .actions {
            flex-direction: column-reverse;
            align-items: stretch;
          }
          .save-btn {
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};

export default JarSettings;
