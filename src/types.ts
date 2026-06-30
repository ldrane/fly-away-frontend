// --- Interfaces de Usuario --- 

export interface UserRegisterDTO {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

export interface UserLoginDTO {
  email: string;
  password: string;
}

export interface UserCurrentDTO {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}


// --- Interfaces de Vuelos ---

export interface FlightItem {
  id: number;
  airlineName: string;
  flightNumber: string;
  estDepartureTime: string;
  estArrivalTime: string;
  availableSeats: number;
}

export interface FlightSearchResponse {
  items: FlightItem[];
}

export interface FlightSearchParams {
  flightNumber?: string;
  airlineName?: string;
  estDepartureTimeFrom?: string;
  estDepartureTimeTo?: string;
}


// --- Interfaces de Reservas ---

export interface BookingDTO {
  id: number;
  bookingDate: string;
  flightId: number;
  flightNumber: string;
  estDepartureTime: string;
  estArrivalTime: string;
  customerId: number;
  customerFirstName: string;
  customerLastName: string;
}

export interface NewIdDTO {
  id: number;
}


// --- Interfaces de Auth ---
export interface AuthTokenDTO {
  token: string;
}
