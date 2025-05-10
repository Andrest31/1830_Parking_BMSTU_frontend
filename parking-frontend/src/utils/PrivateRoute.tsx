// components/PrivateRoute.tsx
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { selectAuth } from './authSlice';

const PrivateRoute = () => {
  const { token } = useSelector(selectAuth);
  return token ? <Outlet /> : <Navigate to="/authorize" replace />;
};

export default PrivateRoute;