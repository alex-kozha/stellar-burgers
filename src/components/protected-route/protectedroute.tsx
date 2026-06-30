// src/components/protected-route/protected-route.tsx
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { Preloader } from '@ui';

type ProtectedRouteProps = {
  children: React.ReactElement;
  onlyUnAuth?: boolean;
};

export const ProtectedRoute = ({
  children,
  onlyUnAuth = false
}: ProtectedRouteProps) => {
  // ✅ Берем реальные данные из store
  const { isAuthenticated, isLoading } = useSelector((state) => state.user);
  const location = useLocation();

  // ✅ Показываем прелоадер пока проверяется авторизация
  if (isLoading) {
    return <Preloader />;
  }

  // ✅ Если пользователь не авторизован, а страница требует авторизации
  if (!onlyUnAuth && !isAuthenticated) {
    return <Navigate to='/login' state={{ from: location.pathname }} replace />;
  }

  // ✅ Если пользователь авторизован, а страница только для неавторизованных
  if (onlyUnAuth && isAuthenticated) {
    const from = location.state?.from || '/';
    return <Navigate to={from} replace />;
  }

  return children;
};
