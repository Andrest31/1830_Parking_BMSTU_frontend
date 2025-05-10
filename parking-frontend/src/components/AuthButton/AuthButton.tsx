// components/AuthButton.tsx
import { useDispatch, useSelector } from 'react-redux';
import { logout, selectAuth } from '../../utils/authSlice';
import { useNavigate } from 'react-router-dom';

const AuthButton = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(selectAuth);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('token');
    navigate('/authorize');
  };

  if (user) {
    return (
      <div className="user-menu">
        <span>Привет, {user.username}</span>
        <button onClick={handleLogout}>Выйти</button>
      </div>
    );
  }

  return (
    <button onClick={() => navigate('/authorize')}>Войти</button>
  );
};

export default AuthButton;