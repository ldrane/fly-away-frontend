import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../api/api';
import type { UserRegisterDTO } from '../types';
import axios from 'axios';

// ─── Estado inicial del formulario ───────────────────────────────────────────

const emptyForm: UserRegisterDTO = {
  email: '',
  firstName: '',
  lastName: '',
  password: '',
};

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState<UserRegisterDTO>(emptyForm);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Actualiza el campo correspondiente en el estado del formulario
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Limpia errores al editar
    setValidationError(null);
    setApiError(null);
  }

  // Validación local antes de enviar al backend
  function validate(): boolean {
    if (!form.email || !form.firstName || !form.lastName || !form.password) {
      setValidationError('Todos los campos son obligatorios.');
      return false;
    }
    if (!form.email.includes('@')) {
      setValidationError('El email no es válido.');
      return false;
    }
    return true;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setApiError(null);
    setValidationError(null);

    if (!validate()) return;

    setSubmitting(true);
    try {
      await registerUser(form);
      setSuccess(true);
      // Redirige al login tras 2 segundos
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        // El backend retorna ProblemDetail: leemos el campo "detail"
        const detail = err.response?.data?.detail ?? 'Error al registrar. Intenta nuevamente.';
        setApiError(detail);
      } else {
        setApiError('Error inesperado. Intenta nuevamente.');
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-md w-full max-w-md p-8">
        {/* Encabezado */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-blue-700">✈️ Fly Away Travel</h1>
          <p className="text-gray-500 mt-1">Crea tu cuenta</p>
        </div>

        {/* Mensaje de éxito */}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 rounded-lg px-4 py-3 mb-4">
            ¡Registro exitoso! Redirigiendo al inicio de sesión...
          </div>
        )}

        {/* Error de validación local */}
        {validationError && (
          <div className="bg-red-100 border border-red-400 text-red-700 rounded-lg px-4 py-3 mb-4">
            {validationError}
          </div>
        )}

        {/* Error del backend */}
        {apiError && (
          <div className="bg-red-100 border border-red-400 text-red-700 rounded-lg px-4 py-3 mb-4">
            {apiError}
          </div>
        )}

        {/* Formulario de registro */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="alice@ejemplo.com"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre
            </label>
            <input
              type="text"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              placeholder="Alice"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Apellido
            </label>
            <input
              type="text"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              placeholder="Smith"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Mín. 8 caracteres, mayúscula y número"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <button
            type="submit"
            disabled={submitting || success}
            className="bg-blue-700 text-white font-semibold py-2 rounded-lg hover:bg-blue-800 transition-colors disabled:opacity-50"
          >
            {submitting ? 'Registrando...' : 'Crear cuenta'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="text-blue-600 hover:underline">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
