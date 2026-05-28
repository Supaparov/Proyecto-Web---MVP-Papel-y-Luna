import { useState, useEffect } from 'react';
import { useCartStore } from '../../store/cartStore';
import { useNotificationStore } from '../../store/notificationStore';
import { descuentoService } from '../../services/descuentoService';
import { Ticket } from 'lucide-react';

export const PaymentForm = ({ onSubmit, loading }) => {
  const [metodoPago, setMetodoPago] = useState('Efectivo');
  const [recibido, setRecibido] = useState('');
  const [codigoDescuento, setCodigoDescuento] = useState('');
  const [descuentos, setDescuentos] = useState([]);
  const [loadingDescuentos, setLoadingDescuentos] = useState(false);

  const items = useCartStore((state) => state.items);
  const cliente = useCartStore((state) => state.cliente);
  const descuento = useCartStore((state) => state.descuento);
  const setDescuento = useCartStore((state) => state.setDescuento);
  const setCliente = useCartStore((state) => state.setCliente);
  const getTotal = useCartStore((state) => state.getTotal);
  const addNotification = useNotificationStore((state) => state.addNotification);

  const { subtotal, descuentoMonto, total } = getTotal();
  const cambio = Math.max(0, parseFloat(recibido || 0) - total);

  useEffect(() => {
    const cargarDescuentos = async () => {
      setLoadingDescuentos(true);
      try {
        const data = await descuentoService.list();
        setDescuentos(data);
      } catch (error) {
        addNotification('Error cargando descuentos', 'error');
      } finally {
        setLoadingDescuentos(false);
      }
    };

    cargarDescuentos();
  }, []);

  const handleAplicarDescuento = async () => {
    if (!codigoDescuento.trim()) {
      setDescuento(null);
      return;
    }

    const desc = await descuentoService.getByCode(codigoDescuento);
    if (desc) {
      setDescuento(desc);
      addNotification(`Descuento aplicado: ${desc.porcentaje}%`, 'success');
    } else {
      addNotification('Código de descuento inválido o no disponible', 'error');
      setDescuento(null);
    }
  };

  const isFormValid = items.length > 0 && 
                      metodoPago &&
                      (metodoPago !== 'Debe' || cliente) &&
                      (metodoPago !== 'Efectivo' || recibido >= total);

  const handleSubmit = () => {
    if (!isFormValid) {
      addNotification('Por favor completa todos los campos requeridos', 'warning');
      return;
    }

    onSubmit({
      metodo_pago: metodoPago,
      items: items.map(item => ({
        productoId: item.productoId,
        cantidad: item.cantidad
      })),
      recibido: parseFloat(recibido),
      clienteId: cliente?.id || null,
      descuentoId: descuento?.id || null
    });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
      {/* Totals */}
      <div className="space-y-3 pb-6 border-b border-gray-200">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal:</span>
          <span className="font-semibold">${subtotal.toFixed(2)}</span>
        </div>
        {descuento && (
          <div className="flex justify-between text-red-600">
            <span>Descuento ({descuento.porcentaje}%):</span>
            <span>-${descuentoMonto.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between text-lg font-bold bg-purple-50 p-3 rounded-lg">
          <span>Total:</span>
          <span className="text-purple-600">${total.toFixed(2)}</span>
        </div>
      </div>

      {/* Descuento */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Código de Descuento
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={codigoDescuento}
            onChange={(e) => setCodigoDescuento(e.target.value)}
            placeholder="Ingresa código de descuento"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            disabled={loadingDescuentos}
          />
          <button
            onClick={handleAplicarDescuento}
            disabled={loadingDescuentos}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50"
          >
            Aplicar
          </button>
        </div>
        {descuento && (
          <p className="text-sm text-green-600">
            ✓ Descuento {descuento.porcentaje}% aplicado
          </p>
        )}
      </div>

      {/* Método de Pago */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">
          Método de Pago *
        </label>
        <div className="grid grid-cols-3 gap-2">
          {['Efectivo', 'Nequi', 'Debe'].map((metodo) => (
            <button
              key={metodo}
              onClick={() => {
                setMetodoPago(metodo);
                if (metodo !== 'Debe') setCliente(null);
              }}
              className={`py-3 rounded-lg font-semibold transition ${
                metodoPago === metodo
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {metodo}
            </button>
          ))}
        </div>
      </div>

      {/* Cliente (si es a Debe) */}
      {metodoPago === 'Debe' && (
        <div className="space-y-2 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            {cliente 
              ? `Cliente: ${cliente.nombre}` 
              : 'Debes seleccionar un cliente para venta a Debe'}
          </p>
          {!cliente && (
            <button className="text-sm text-blue-600 hover:text-blue-700 font-semibold">
              + Seleccionar cliente
            </button>
          )}
        </div>
      )}

      {/* Monto Recibido (si es Efectivo) */}
      {metodoPago === 'Efectivo' && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Monto Recibido *
          </label>
          <input
            type="number"
            value={recibido}
            onChange={(e) => setRecibido(e.target.value)}
            placeholder="0.00"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            step="0.01"
            min="0"
          />
          {recibido && (
            <div className="flex justify-between text-sm pt-2">
              <span className="text-gray-600">Cambio:</span>
              <span className={`font-semibold ${cambio >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${cambio.toFixed(2)}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={!isFormValid || loading}
        className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-lg flex items-center justify-center gap-2 transition"
      >
        <Ticket className="w-6 h-6" />
        {loading ? 'Procesando venta...' : 'Cobrar $' + total.toFixed(2)}
      </button>
    </div>
  );
};
