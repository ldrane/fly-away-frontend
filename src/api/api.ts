import axios from 'axios';
import type {
  UserRegisterDTO,
  UserLoginDTO,
  UserCurrentDTO,
  FlightSearchResponse,
  FlightSearchParams,
  BookingDTO,
  NewIdDTO,
  AuthTokenDTO,
} from '../types';

// --- Instancia base de Axios ---
// El interceptor agrega automáticamente el token JWT a cada request protegido

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


// --- Endpoints de Auth ---

export const login = (body: UserLoginDTO) =>
  api.post<AuthTokenDTO>('/auth/login', body).then((r) => r.data);


// --- Endpoints de Usuarios --- 

export const registerUser = (body: UserRegisterDTO) =>
  api.post<NewIdDTO>('/users/register', body).then((r) => r.data);

export const getCurrentUser = () =>
  api.get<UserCurrentDTO>('/users/current').then((r) => r.data);


// --- Endpoints de Vuelos ---

export const searchFlights = (params: FlightSearchParams) =>
  api.get<FlightSearchResponse>('/flights/search', { params }).then((r) => r.data);

export const bookFlight = (flightId: number) =>
  api.post<NewIdDTO>('/flights/book', { flightId }).then((r) => r.data);

export const getBooking = (id: number) =>
  api.get<BookingDTO>(`/flights/book/${id}`).then((r) => r.data);

export default api;
