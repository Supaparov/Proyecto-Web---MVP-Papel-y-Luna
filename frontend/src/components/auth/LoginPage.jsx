import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { authService } from '../../services/authService';
import { useNotificationStore } from '../../store/notificationStore';
import { LogIn } from 'lucide-react';

export const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();
  const { login } = useAuth();
  const notification = useNotificationStore();

  const validateForm = () => {
    const newErrors = {};
    if (!username.trim()) newErrors.username = 'El usuario es requerido';
    if (!password) newErrors.password = 'La contraseña es requerida';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await authService.login(username, password);
      login(response.token);
      notification.success(`¡Bienvenido ${response.user.username}!`);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error de login:', error);
      // El error ya se maneja en el interceptor
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-full p-3">
                <LogIn className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Papel y Luna</h1>
            <p className="text-gray-600 mt-2">Sistema de Punto de Venta</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Usuario
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (errors.username) setErrors({ ...errors, username: '' });
                }}
                placeholder="Ingresa tu usuario"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  errors.username ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={loading}
              />
              {errors.username && (
                <p className="text-red-500 text-sm mt-1">{errors.username}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors({ ...errors, password: '' });
                }}
                placeholder="Ingresa tu contraseña"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={loading}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center mb-2">Credenciales de prueba:</p>
            <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-700 space-y-1">
              <p><strong>Admin:</strong> admin / admin123</p>
              <p><strong>Cajero:</strong> cashier / cashier123</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-white text-center mt-6 text-sm">
          Sistema de Gestión para Papelería Papel y Luna © 2026
        </p>
      </div>
    </div>
  );
};
