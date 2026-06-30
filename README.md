# Fly Away Travel — Frontend 

Aplicación web SPA construida con **React 18 + TypeScript + Vite + Tailwind CSS** para el sistema de reserva de vuelos Fly Away.

## Stack tecnológico

| Tecnología | Uso |
|---|---|
| React 18 | Framework de UI con componentes funcionales |
| TypeScript | Tipado estático |
| Vite | Build tool y servidor de desarrollo |
| Tailwind CSS | Estilos utilitarios |
| Axios | Consumo de la API REST |
| React Router v6 | Enrutamiento SPA |

## Estructura del proyecto

```
src/
├── types.ts                    # Interfaces TypeScript (DTOs)
├── main.tsx                    # Punto de entrada
├── App.tsx                     # Componente raíz + configuración de rutas
├── index.css                   # Tailwind CSS
├── api/
│   └── api.ts                  # Instancia Axios + todas las funciones de API
├── context/
│   └── AuthContext.tsx         # Contexto de autenticación (useContext)
├── components/
│   ├── Navbar.tsx              # Barra de navegación con logout
│   ├── ProtectedRoute.tsx      # HOC para rutas protegidas
│   └── BookingDetail.tsx       # Modal de detalle de reserva
└── pages/
    ├── Home.tsx                # Página principal
    ├── Register.tsx            # Registro de usuario
    ├── Login.tsx               # Inicio de sesión
    ├── Flights.tsx             # Búsqueda y reserva de vuelos
    └── MyBookings.tsx          # Mis reservas
```

## Requisitos previos

- Node.js 18 o superior
- El backend (`cs2031-week14-fly-away-backend`) corriendo en `http://localhost:8080`

## Cómo correr

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar en modo desarrollo
npm run dev
```

La app estará disponible en `http://localhost:5173`.

## Funcionalidades implementadas

### Must Have
- **Registro** (`POST /users/register`): formulario con validación local y manejo de errores del backend
- **Login** (`POST /auth/login`): guarda JWT en `localStorage`, redirige al buscador
- **Búsqueda de vuelos** (`GET /flights/search`): por número y aerolínea, tabla de resultados
- **Reservar vuelo** (`POST /flights/book`): botón por fila, requiere autenticación, manejo de errores
- **Cerrar sesión**: limpia `localStorage`, rutas protegidas redirigen al login

### Nice to Have
- **Nombre del usuario** en el Navbar (`GET /users/current` via `useContext`)
- **Filtro de fechas** en búsqueda (`estDepartureTimeFrom` / `estDepartureTimeTo`)
- **Detalle de reserva** modal tras reservar (`GET /flights/book/{id}`)
- **Mis Reservas**: lee IDs de `localStorage` y muestra detalles completos

## Notas importantes

- El backend usa base de datos H2 en memoria: los datos se pierden al reiniciar.
- Las contraseñas deben tener mínimo 8 caracteres, una mayúscula y un dígito.
- Los nombres (`firstName`, `lastName`) deben iniciar con mayúscula.
