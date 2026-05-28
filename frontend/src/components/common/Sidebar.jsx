import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
  ShoppingCart,
  Package,
  ShoppingBag,
  AlertCircle,
  Users,
  Tag,
  BarChart3,
  Menu,
  X,
  History
} from 'lucide-react';
import { useState } from 'react';

export const Sidebar = () => {
  const location = useLocation();
  const { isAdmin } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    {
      label: 'Ventas (POS)',
      path: '/pos',
      icon: ShoppingCart,
      roles: ['ADMIN', 'CAJERO']
    },
    {
      label: 'Historial de Ventas',
      path: '/sales-history',
      icon: History,
      roles: ['ADMIN']
    },
    {
      label: 'Inventario',
      path: '/inventory',
      icon: Package,
      roles: ['ADMIN']
    },
    {
      label: 'Compras',
      path: '/purchases',
      icon: ShoppingBag,
      roles: ['ADMIN']
    },
    {
      label: 'Faltantes',
      path: '/shortages',
      icon: AlertCircle,
      roles: ['ADMIN', 'CAJERO']
    },
    {
      label: 'Administración',
      path: '/admin',
      icon: BarChart3,
      roles: ['ADMIN']
    }
  ];

  const visibleMenuItems = menuItems.filter(item => 
    isAdmin || item.roles.includes('CAJERO')
  );

  const MenuItem = ({ item }) => {
    const isActive = location.pathname === item.path;
    const Icon = item.icon;

    return (
      <Link
        to={item.path}
        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition duration-200 ${
          isActive
            ? 'bg-purple-100 text-purple-700 border-l-4 border-purple-700'
            : 'text-gray-600 hover:bg-gray-100'
        }`}
      >
        <Icon className="w-5 h-5" />
        <span className="font-medium text-sm">{item.label}</span>
      </Link>
    );
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed bottom-4 right-4 bg-purple-600 text-white p-3 rounded-full shadow-lg z-50"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 fixed md:relative w-64 h-screen bg-white border-r border-gray-200 shadow-lg md:shadow-none overflow-y-auto transition-transform duration-300 z-40`}
      >
        {/* Menu Items */}
        <nav className="p-4 space-y-2">
          {visibleMenuItems.map((item) => (
            <MenuItem key={item.path} item={item} />
          ))}
        </nav>

        {/* Footer Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-gray-50">
          <p className="text-xs text-gray-500 text-center">
            Papel y Luna © 2026
          </p>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};
