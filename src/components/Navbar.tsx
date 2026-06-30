import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { token, currentUser, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <nav className="bg-blue-700 text-white shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo / Título */}
        <Link to="/" className="text-xl font-bold tracking-wide hover:text-blue-200">
          ✈️ Fly Away Travel
        </Link>

        {/* Links de navegación */}
        <div className="flex items-center gap-4">
          <Link to="/flights" className="hover:text-blue-200 transition-colors">
            Buscar Vuelos
          </Link>

          {token ? (
            <>
              <Link to="/my-bookings" className="hover:text-blue-200 transition-colors">
                Mis Reservas
              </Link>

              {/* Muestra el nombre del usuario autenticado (Nice to Have) */}
              {currentUser && (
                <span className="text-blue-200 text-sm">
                  Hola, {currentUser.firstName}
                </span>
              )}

              <button
                onClick={handleLogout}
                className="bg-white text-blue-700 font-semibold px-3 py-1 rounded hover:bg-blue-100 transition-colors"
              >
                Cerrar Sesión
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-blue-200 transition-colors">
                Iniciar Sesión
              </Link>
              <Link
                to="/register"
                className="bg-white text-blue-700 font-semibold px-3 py-1 rounded hover:bg-blue-100 transition-colors"
              >
                Registrarse
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
