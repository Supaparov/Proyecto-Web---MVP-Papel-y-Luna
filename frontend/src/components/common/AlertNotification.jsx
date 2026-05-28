import { useNotificationStore } from '../../store/notificationStore';
import { AlertCircle, CheckCircle, AlertTriangle, Info, X } from 'lucide-react';

const Alert = ({ notification, onClose }) => {
  const typeConfig = {
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      icon: <AlertCircle className="w-5 h-5 text-red-600" />,
      text: 'text-red-800',
      bar: 'bg-red-500'
    },
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      icon: <CheckCircle className="w-5 h-5 text-green-600" />,
      text: 'text-green-800',
      bar: 'bg-green-500'
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      icon: <AlertTriangle className="w-5 h-5 text-yellow-600" />,
      text: 'text-yellow-800',
      bar: 'bg-yellow-500'
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      icon: <Info className="w-5 h-5 text-blue-600" />,
      text: 'text-blue-800',
      bar: 'bg-blue-500'
    }
  };

  const config = typeConfig[notification.type] || typeConfig.info;

  return (
    <div className={`${config.bg} border ${config.border} rounded-lg p-4 mb-3 flex items-start gap-3 shadow-sm`}>
      <div className="flex-shrink-0 pt-0.5">{config.icon}</div>
      <div className="flex-1">
        <p className={`text-sm font-medium ${config.text}`}>{notification.message}</p>
      </div>
      <button
        onClick={() => onClose(notification.id)}
        className="flex-shrink-0 text-gray-400 hover:text-gray-500"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export const AlertNotification = () => {
  const notifications = useNotificationStore((state) => state.notifications);
  const removeNotification = useNotificationStore((state) => state.removeNotification);

  return (
    <div className="fixed top-4 right-4 z-50 max-w-md w-full">
      {notifications.map((notification) => (
        <Alert
          key={notification.id}
          notification={notification}
          onClose={removeNotification}
        />
      ))}
    </div>
  );
};
