import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Home() {
  const { token, currentUser } = useAuth();

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-4xl font-bold text-blue-700 mb-3">
        ✈️ Fly Away Travel
      </h1>
      <p className="text-gray-500 text-lg mb-8 max-w-md">
        Encuentra y reserva tu próximo vuelo de forma rápida y sencilla.
      </p>

      {token && currentUser ? (
        <div className="flex flex-col items-center gap-4">
          <p className="text-gray-600">
            Bienvenido de vuelta, <span className="font-semibold text-blue-700">{currentUser.firstName}</span>
          </p>
          <div className="flex gap-3">
            <Link
              to="/flights"
              className="bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg hover:bg-blue-800 transition-colors"
            >
              Buscar Vuelos
            </Link>
            <Link
              to="/my-bookings"
              className="border border-blue-700 text-blue-700 font-semibold px-6 py-2 rounded-lg hover:bg-blue-50 transition-colors"
            >
              Mis Reservas
            </Link>
          </div>
        </div>
      ) : (
        <div className="flex gap-3">
          <Link
            to="/flights"
            className="bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg hover:bg-blue-800 transition-colors"
          >
            Buscar Vuelos
          </Link>
          <Link
            to="/register"
            className="border border-blue-700 text-blue-700 font-semibold px-6 py-2 rounded-lg hover:bg-blue-50 transition-colors"
          >
            Crear Cuenta
          </Link>
        </div>
      )}
    </div>
  );
}

export default Home;
