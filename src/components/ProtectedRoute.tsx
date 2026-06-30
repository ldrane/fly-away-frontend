import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Componente que protege rutas: redirige al login si no hay token

interface Props {
  children: React.ReactNode;
}

function ProtectedRoute({ children }: Props) {
  const { token } = useAuth();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;
