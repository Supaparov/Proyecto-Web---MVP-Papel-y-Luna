import { useState, useEffect } from 'react';
import { Layout } from '../components/common/Layout';
import { compraService } from '../services/compraService';
import { productService } from '../services/productService';
import { proveedorService } from '../services/proveedorService';
import { useNotificationStore } from '../store/notificationStore';
import { Send } from 'lucide-react';

export const PurchasesPage = () => {
  const [productos, setProductos] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    proveedorId: '',
    productoId: '',
    cantidad: '',
    costo_unitario: '',
    metodo_pago: 'Efectivo'
  });

  const [purchaseItems, setPurchaseItems] = useState([]);
  const addNotification = useNotificationStore((state) => state.addNotification);

  // Cargar datos iniciales
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [prods, provs] = await Promise.all([
        productService.list(),
        proveedorService.list()
      ]);
      setProductos(prods);
      setProveedores(provs);
    } catch (error) {
      addNotification('Error cargando datos', 'error');
    }
  };

  const handleAddItem = () => {
    if (!formData.productoId || !formData.cantidad || !formData.costo_unitario) {
      addNotification('Completa todos los campos', 'warning');
      return;
    }

    const producto = productos.find(p => p.id == formData.productoId);
    if (!producto) {
      addNotification('Producto no encontrado', 'error');
      return;
    }

    const newItem = {
      productoId: parseInt(formData.productoId),
      nombre: producto.nombre,
      cantidad: parseInt(formData.cantidad),
      costo_unitario: parseFloat(formData.costo_unitario),
      subtotal: parseInt(formData.cantidad) * parseFloat(formData.costo_unitario)
    };

    setPurchaseItems([...purchaseItems, newItem]);
    setFormData({ ...formData, productoId: '', cantidad: '', costo_unitario: '' });
    addNotification('Producto agregado', 'success');
  };

  const handleRemoveItem = (index) => {
    setPurchaseItems(purchaseItems.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!formData.proveedorId || purchaseItems.length === 0) {
      addNotification('Selecciona proveedor y agrega productos', 'warning');
      return;
    }

    setLoading(true);
    try {
      const total = purchaseItems.reduce((sum, item) => sum + item.subtotal, 0);
      
      await compraService.create({
        proveedorId: parseInt(formData.proveedorId),
        metodo_pago: formData.metodo_pago,
        total: total,
        items: purchaseItems
      });

      addNotification('Compra registrada exitosamente', 'success');
      setFormData({ proveedorId: '', metodo_pago: 'Efectivo', productoId: '', cantidad: '', costo_unitario: '' });
      setPurchaseItems([]);
    } catch (error) {
      addNotification('Error registrando compra', 'error');
    } finally {
      setLoading(false);
    }
  };

  const total = purchaseItems.reduce((sum, item) => sum + item.subtotal, 0);

  return (
    <Layout title="Compras">
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Registro de Compras</h1>

        <div className="grid grid-cols-3 gap-6">
          {/* Formulario */}
          <div className="col-span-2 bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Nueva Compra</h2>

            <div className="space-y-4">
              {/* Proveedor */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Proveedor *
                </label>
                <select
                  value={formData.proveedorId}
                  onChange={(e) => setFormData({ ...formData, proveedorId: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Selecciona un proveedor</option>
                  {proveedores.map(p => (
                    <option key={p.id} value={p.id}>{p.nombre}</option>
                  ))}
                </select>
              </div>

              {/* Producto */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Producto *
                </label>
                <select
                  value={formData.productoId}
                  onChange={(e) => setFormData({ ...formData, productoId: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Selecciona un producto</option>
                  {productos.map(p => (
                    <option key={p.id} value={p.id}>{p.nombre} (${p.precio})</option>
                  ))}
                </select>
              </div>

              {/* Cantidad y Costo */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cantidad *
                  </label>
                  <input
                    type="number"
                    value={formData.cantidad}
                    onChange={(e) => setFormData({ ...formData, cantidad: e.target.value })}
                    placeholder="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Costo Unitario *
                  </label>
                  <input
                    type="number"
                    value={formData.costo_unitario}
                    onChange={(e) => setFormData({ ...formData, costo_unitario: e.target.value })}
                    placeholder="0.00"
                    step="0.01"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              {/* Método de Pago */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Método de Pago
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['Efectivo', 'Nequi', 'En Consignación'].map(method => (
                    <button
                      key={method}
                      onClick={() => setFormData({ ...formData, metodo_pago: method })}
                      className={`py-2 rounded-lg font-semibold transition ${
                        formData.metodo_pago === method
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleAddItem}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold"
              >
                Agregar Producto
              </button>
            </div>
          </div>

          {/* Resumen */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 h-fit">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Resumen</h2>

            <div className="space-y-3 mb-6 max-h-96 overflow-y-auto">
              {purchaseItems.map((item, index) => (
                <div
                  key={index}
                  className="flex items-start justify-between p-3 bg-gray-50 rounded border border-gray-200"
                >
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 text-sm">{item.nombre}</p>
                    <p className="text-xs text-gray-600">
                      {item.cantidad} × ${item.costo_unitario.toFixed(2)}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRemoveItem(index)}
                    className="text-red-600 hover:text-red-700 ml-2"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 pt-4 mb-4">
              <div className="flex justify-between text-lg font-bold text-gray-900">
                <span>Total:</span>
                <span className="text-purple-600">${total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading || purchaseItems.length === 0}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white py-2 rounded-lg font-semibold flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              Registrar Compra
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};
