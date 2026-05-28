import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/common/Layout';
import { ProductSearch } from '../components/pos/ProductSearch';
import { PaymentForm } from '../components/pos/PaymentForm';
import { useCartStore } from '../store/cartStore';
import { useNotificationStore } from '../store/notificationStore';
import { ventaService } from '../services/ventaService';

export const POSPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const notification = useNotificationStore();

  const handleSubmitVenta = async (data) => {
    if (items.length === 0) {
      notification.error('El carrito está vacío');
      return;
    }

    setLoading(true);
    try {
      const response = await ventaService.create(data);
      notification.success(`¡Venta registrada! Total: $${response.total}`);
      clearCart();
      // Mostrar recibo
      setTimeout(() => {
        // Aquí iría modal de recibo
      }, 1000);
    } catch (error) {
      notification.error('Error procesando venta');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Sistema de Ventas (POS)">
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Product Search & Cart */}
          <div className="lg:col-span-2">
            <ProductSearch />
          </div>

          {/* Right: Payment Form */}
          <div className="lg:col-span-1">
            <PaymentForm onSubmit={handleSubmitVenta} loading={loading} />
          </div>
        </div>
      </div>
    </Layout>
  );
};
