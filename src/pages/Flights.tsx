import { useState } from 'react';
import { searchFlights, bookFlight } from '../api/api';
import type { FlightItem, FlightSearchParams } from '../types';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import BookingDetail from '../components/BookingDetail';

function Flights() {
  const { token } = useAuth();
  const navigate = useNavigate();

  // --- Estado del formulario de búsqueda ---
  const [flightNumber, setFlightNumber] = useState<string>('');
  const [airlineName, setAirlineName] = useState<string>('');
  // Nice to Have: filtro por rango de fechas
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');

  // --- Estado de resultados y UI --- 
  const [results, setResults] = useState<FlightItem[]>([]);
  const [searched, setSearched] = useState<boolean>(false);
  const [searchLoading, setSearchLoading] = useState<boolean>(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  // --- Estado de reserva --- 
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState<string | null>(null);
  const [bookingLoading, setBookingLoading] = useState<number | null>(null);
  // Nice to Have: mostrar detalle de reserva
  const [detailBookingId, setDetailBookingId] = useState<number | null>(null);

  // --- Búsqueda de vuelos --- 

  async function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSearchError(null);
    setBookingError(null);
    setBookingSuccess(null);
    setSearchLoading(true);

    const params: FlightSearchParams = {};
    if (flightNumber.trim()) params.flightNumber = flightNumber.trim();
    if (airlineName.trim()) params.airlineName = airlineName.trim();
    // Convierte datetime-local a ISO-8601 con zona horaria (según STUDENT_README)
    if (dateFrom) params.estDepartureTimeFrom = new Date(dateFrom).toISOString();
    if (dateTo) params.estDepartureTimeTo = new Date(dateTo).toISOString();

    try {
      const data = await searchFlights(params);
      setResults(data.items);
      setSearched(true);
    } catch {
      setSearchError('Error al buscar vuelos. Verifica que el backend esté activo.');
    } finally {
      setSearchLoading(false);
    }
  }

  // --- Reservar un vuelo --- 

  async function handleBook(flightId: number) {
    if (!token) {
      navigate('/login');
      return;
    }

    setBookingError(null);
    setBookingSuccess(null);
    setBookingLoading(flightId);

    try {
      const data = await bookFlight(flightId);

      // Guarda el ID de la reserva en localStorage (para "Mis Reservas")
      const stored = localStorage.getItem('bookingIds');
      const ids: number[] = stored ? JSON.parse(stored) : [];
      ids.push(data.id);
      localStorage.setItem('bookingIds', JSON.stringify(ids));

      setBookingSuccess(`¡Reserva exitosa! ID de reserva: #${data.id}`);
      // Muestra el detalle de la reserva (Nice to Have)
      setDetailBookingId(data.id);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const detail = err.response?.data?.detail ?? 'No se pudo completar la reserva.';
        setBookingError(detail);
      } else {
        setBookingError('Error inesperado al reservar.');
      }
    } finally {
      setBookingLoading(null);
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-blue-700 mb-6">Buscar Vuelos</h1>

      {/* --- Formulario de búsqueda --- */}
      <form
        onSubmit={handleSearch}
        className="bg-white rounded-2xl shadow-md p-6 mb-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Número de vuelo
            </label>
            <input
              type="text"
              value={flightNumber}
              onChange={(e) => setFlightNumber(e.target.value)}
              placeholder="Ej: LA123"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Aerolínea
            </label>
            <input
              type="text"
              value={airlineName}
              onChange={(e) => setAirlineName(e.target.value)}
              placeholder="Ej: LATAM"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Nice to Have: filtro por rango de fechas */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Salida desde (opcional)
            </label>
            <input
              type="datetime-local"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Salida hasta (opcional)
            </label>
            <input
              type="datetime-local"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={searchLoading}
          className="mt-4 bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg hover:bg-blue-800 transition-colors disabled:opacity-50"
        >
          {searchLoading ? 'Buscando...' : '🔍 Buscar'}
        </button>
      </form>

      {/* --- Mensajes de estado de reserva --- */}
      {bookingSuccess && (
        <div className="bg-green-100 border border-green-400 text-green-700 rounded-lg px-4 py-3 mb-4">
          ✅ {bookingSuccess}
        </div>
      )}
      {bookingError && (
        <div className="bg-red-100 border border-red-400 text-red-700 rounded-lg px-4 py-3 mb-4">
          ❌ {bookingError}
        </div>
      )}
      {searchError && (
        <div className="bg-red-100 border border-red-400 text-red-700 rounded-lg px-4 py-3 mb-4">
          {searchError}
        </div>
      )}

      {/* --- Tabla de resultados --- */}
      {searched && (
        results.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md p-8 text-center text-gray-500">
            <p className="text-4xl mb-3">🛫</p>
            <p className="font-medium">No se encontraron vuelos con esos criterios.</p>
            <p className="text-sm mt-1">Intenta con otros filtros o deja los campos vacíos para ver todos los vuelos.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-blue-700 text-white">
                  <tr>
                    <th className="px-4 py-3 text-left">Vuelo</th>
                    <th className="px-4 py-3 text-left">Aerolínea</th>
                    <th className="px-4 py-3 text-left">Salida</th>
                    <th className="px-4 py-3 text-left">Llegada</th>
                    <th className="px-4 py-3 text-center">Asientos</th>
                    <th className="px-4 py-3 text-center">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((flight, index) => (
                    <tr
                      key={flight.id}
                      className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                    >
                      <td className="px-4 py-3 font-semibold">{flight.flightNumber}</td>
                      <td className="px-4 py-3">{flight.airlineName}</td>
                      <td className="px-4 py-3">
                        {new Date(flight.estDepartureTime).toLocaleString('es-PE')}
                      </td>
                      <td className="px-4 py-3">
                        {new Date(flight.estArrivalTime).toLocaleString('es-PE')}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            flight.availableSeats > 10
                              ? 'bg-green-100 text-green-700'
                              : flight.availableSeats > 0
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {flight.availableSeats} disponibles
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {token ? (
                          <button
                            onClick={() => handleBook(flight.id)}
                            disabled={
                              bookingLoading === flight.id || flight.availableSeats === 0
                            }
                            className="bg-blue-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                          >
                            {bookingLoading === flight.id ? 'Reservando...' : 'Reservar'}
                          </button>
                        ) : (
                          <button
                            onClick={() => navigate('/login')}
                            className="border border-blue-600 text-blue-600 text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors"
                          >
                            Inicia sesión
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      )}

      {/* Hint cuando aún no se ha buscado */}
      {!searched && !searchLoading && (
        <div className="text-center text-gray-400 mt-8">
          <p className="text-4xl mb-2">✈️</p>
          <p>Usa el formulario para buscar vuelos disponibles.</p>
        </div>
      )}

      {/* Nice to Have: Modal de detalle de reserva */}
      {detailBookingId !== null && (
        <BookingDetail
          bookingId={detailBookingId}
          onClose={() => setDetailBookingId(null)}
        />
      )}
    </div>
  );
}

export default Flights;
