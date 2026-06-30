import { useState, useEffect } from 'react';
import { getBooking } from '../api/api';
import type { BookingDTO } from '../types';

interface Props {
  bookingId: number;
  onClose: () => void;
}

// Componente que muestra el detalle de una reserva (GET /flights/book/{id})
function BookingDetail({ bookingId, onClose }: Props) {
  const [booking, setBooking] = useState<BookingDTO | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getBooking(bookingId)
      .then((data) => setBooking(data))
      .catch(() => setError('No se pudo cargar el detalle de la reserva.'))
      .finally(() => setLoading(false));
  }, [bookingId]);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-blue-700">Detalle de Reserva</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl font-bold"
          >
            ✕
          </button>
        </div>

        {loading && <p className="text-gray-500 text-center py-4">Cargando...</p>}

        {error && (
          <p className="text-red-600 text-center py-4">{error}</p>
        )}

        {booking && (
          <div className="flex flex-col gap-3 text-sm">
            <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3">
              <p className="font-semibold text-green-700">✅ Reserva confirmada</p>
              <p className="text-green-600">ID: #{booking.id}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-gray-500 text-xs uppercase tracking-wide">Vuelo</p>
                <p className="font-semibold">{booking.flightNumber}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs uppercase tracking-wide">Pasajero</p>
                <p className="font-semibold">{booking.customerFirstName} {booking.customerLastName}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs uppercase tracking-wide">Salida</p>
                <p className="font-semibold">{new Date(booking.estDepartureTime).toLocaleString('es-PE')}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs uppercase tracking-wide">Llegada</p>
                <p className="font-semibold">{new Date(booking.estArrivalTime).toLocaleString('es-PE')}</p>
              </div>
              <div className="col-span-2">
                <p className="text-gray-500 text-xs uppercase tracking-wide">Fecha de reserva</p>
                <p className="font-semibold">{new Date(booking.bookingDate).toLocaleString('es-PE')}</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="mt-2 bg-blue-700 text-white font-semibold py-2 rounded-lg hover:bg-blue-800 transition-colors"
            >
              Cerrar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default BookingDetail;
