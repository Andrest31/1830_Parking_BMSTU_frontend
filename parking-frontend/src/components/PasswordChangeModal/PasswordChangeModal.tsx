import React, { useState } from 'react';
import './PasswordChangeModal.css';

interface PasswordChangeModalProps {
  onClose: () => void;
  onChangePassword: (oldPassword: string, newPassword: string, confirmPassword: string) => Promise<boolean>;
}

const PasswordChangeModal: React.FC<PasswordChangeModalProps> = ({ onClose, onChangePassword }) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState({
    old: false,
    new: false,
    confirm: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!oldPassword || !newPassword || !confirmPassword) {
      setError('Все поля обязательны для заполнения');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Новые пароли не совпадают');
      return;
    }

    if (newPassword.length < 8) {
      setError('Пароль должен содержать минимум 8 символов');
      return;
    }

    try {
      setIsLoading(true);
      await onChangePassword(oldPassword, newPassword, confirmPassword);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка при смене пароля');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleShowPassword = (field: keyof typeof showPassword) => {
    setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <div className="modal-overlay">
      <div className="password-modal">
        <button className="close-button" onClick={onClose}>&times;</button>
        <h3>Смена пароля</h3>
        
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Текущий пароль</label>
            <div className="password-input">
              <input
                type={showPassword.old ? "text" : "password"}
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
              <button 
                type="button" 
                className="toggle-password"
                onClick={() => toggleShowPassword('old')}
              >
                {showPassword.old ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          <div className="input-group">
            <label>Новый пароль</label>
            <div className="password-input">
              <input
                type={showPassword.new ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <button 
                type="button" 
                className="toggle-password"
                onClick={() => toggleShowPassword('new')}
              >
                {showPassword.new ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          <div className="input-group">
            <label>Подтвердите новый пароль</label>
            <div className="password-input">
              <input
                type={showPassword.confirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button 
                type="button" 
                className="toggle-password"
                onClick={() => toggleShowPassword('confirm')}
              >
                {showPassword.confirm ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="modal-actions">
            <button 
              type="button" 
              className="cancel-button" 
              onClick={onClose}
              disabled={isLoading}
            >
              Отмена
            </button>
            <button 
              type="submit" 
              className="submit-button"
              disabled={isLoading}
            >
              {isLoading ? 'Сохранение...' : 'Изменить пароль'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasswordChangeModal;