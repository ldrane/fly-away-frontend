import { useState, useEffect } from 'react';
import { getBooking } from '../api/api';
import type { BookingDTO } from '../types';

// Nice to Have: Página que lista las reservas guardadas del usuario
// Lee los IDs del localStorage y consulta el detalle de cada uno

function MyBookings() {
  const [bookings, setBookings] = useState<BookingDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadBookings() {
      // Recupera los IDs guardados cuando el usuario hizo reservas
      const stored = localStorage.getItem('bookingIds');
      const ids: number[] = stored ? JSON.parse(stored) : [];

      if (ids.length === 0) {
        setLoading(false);
        return;
      }

      try {
        // Solicita el detalle de cada reserva al backend
        const promises = ids.map((id) => getBooking(id));
        const results = await Promise.all(promises);
        setBookings(results);
      } catch {
        setError('Error al cargar las reservas. Verifica que el backend esté activo.');
      } finally {
        setLoading(false);
      }
    }

    loadBookings();
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center text-gray-500">
        Cargando reservas...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-blue-700 mb-6">Mis Reservas</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 rounded-lg px-4 py-3 mb-4">
          {error}
        </div>
      )}

      {!error && bookings.length === 0 && (
        <div className="bg-white rounded-2xl shadow-md p-8 text-center text-gray-500">
          <p className="text-4xl mb-3">🎫</p>
          <p className="font-medium">Aún no tienes reservas.</p>
          <p className="text-sm mt-1">Busca un vuelo y haz tu primera reserva.</p>
        </div>
      )}

      {bookings.length > 0 && (
        <div className="flex flex-col gap-4">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-white rounded-2xl shadow-md p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
            >
              <div>
                <p className="font-bold text-lg text-blue-700">
                  {booking.flightNumber}
                </p>
                <p className="text-gray-600 text-sm">
                  Reserva #{booking.id} &middot; {booking.customerFirstName} {booking.customerLastName}
                </p>
              </div>

              <div className="text-sm text-gray-600">
                <p>
                  <span className="font-semibold">Salida:</span>{' '}
                  {new Date(booking.estDepartureTime).toLocaleString('es-PE')}
                </p>
                <p>
                  <span className="font-semibold">Llegada:</span>{' '}
                  {new Date(booking.estArrivalTime).toLocaleString('es-PE')}
                </p>
              </div>

              <div>
                <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
                  ✅ Confirmada
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyBookings;
