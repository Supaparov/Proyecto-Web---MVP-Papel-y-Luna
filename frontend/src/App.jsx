import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './components/auth/LoginPage';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { AlertNotification } from './components/common/AlertNotification';
import { useAuth } from './hooks/useAuth';

// Pages
import { DashboardPage } from './pages/DashboardPage';
import { POSPage } from './pages/POSPage';
import { InventoryPage } from './pages/InventoryPage';
import { PurchasesPage } from './pages/PurchasesPage';
import { ShortagesPage } from './pages/ShortagesPage';
import { AdminPage } from './pages/AdminPage';
import { SalesHistoryPage } from './pages/SalesHistoryPage';

const UnauthorizedPage = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-red-600 mb-4">Acceso Denegado</h1>
      <p className="text-gray-600 mb-6">No tienes permisos para acceder a esta página</p>
      <a href="/dashboard" className="text-blue-600 hover:text-blue-700 font-semibold">
        Volver al dashboard
      </a>
    </div>
  </div>
);

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      <AlertNotification />
      <Routes>
        {/* Public routes */}
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />} 
        />

        {/* Protected routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/pos" 
          element={
            <ProtectedRoute>
              <POSPage />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/inventory" 
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <InventoryPage />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/purchases" 
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <PurchasesPage />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/shortages" 
          element={
            <ProtectedRoute>
              <ShortagesPage />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/admin" 
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <AdminPage />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/sales-history" 
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <SalesHistoryPage />
            </ProtectedRoute>
          } 
        />

        {/* Error routes */}
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        {/* Catch all */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
