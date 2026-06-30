import { createContext, useContext, useState, useEffect } from 'react';
import type { UserCurrentDTO } from '../types';
import { getCurrentUser } from '../api/api';

// --- Tipo del contexto --- 

interface AuthContextType {
  token: string | null;
  currentUser: UserCurrentDTO | null;
  saveToken: (token: string) => void;
  logout: () => void;
}

// --- Creación del contexto --- 

const AuthContext = createContext<AuthContextType | null>(null);

// --- Provider --- 

interface Props {
  children: React.ReactNode;
}

function AuthProvider({ children }: Props) {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('token')
  );
  const [currentUser, setCurrentUser] = useState<UserCurrentDTO | null>(null);

  // Carga el usuario actual cuando hay token (Nice to Have: GET /users/current)
  useEffect(() => {
    if (token) {
      getCurrentUser()
        .then((user) => setCurrentUser(user))
        .catch(() => {
          // Token inválido o expirado -> limpiar sesión
          setToken(null);
          setCurrentUser(null);
          localStorage.removeItem('token');
        });
    } else {
      setCurrentUser(null);
    }
  }, [token]);

  function saveToken(newToken: string) {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  }

  function logout() {
    localStorage.removeItem('token');
    // También limpiamos los IDs de reservas guardados
    localStorage.removeItem('bookingIds');
    setToken(null);
    setCurrentUser(null);
  }

  return (
    <AuthContext.Provider value={{ token, currentUser, saveToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// --- Hook personalizado para consumir el contexto ---

function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
}

export { AuthProvider, useAuth };
