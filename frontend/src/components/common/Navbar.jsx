import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { LogOut, User } from 'lucide-react';

export const Navbar = ({ title = 'Papel y Luna' }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left side - Logo/Title */}
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg p-2">
            <span className="text-white font-bold text-lg">PL</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900">{title}</h1>
        </div>

        {/* Right side - User info */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-gray-100 rounded-full p-2">
              <User className="w-5 h-5 text-gray-600" />
            </div>
            <div className="text-sm">
              <p className="font-semibold text-gray-900">{user?.username}</p>
              <p className="text-xs text-gray-500">
                {user?.role === 'ADMIN' ? 'Administrador' : 'Cajero'}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition duration-200"
            title="Cerrar sesión"
          >
            <LogOut className="w-5 h-5" />
            <span className="hidden sm:inline text-sm font-medium">Salir</span>
          </button>
        </div>
      </div>
    </nav>
  );
};
