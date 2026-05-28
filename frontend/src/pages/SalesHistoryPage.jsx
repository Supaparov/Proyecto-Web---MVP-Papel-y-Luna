import { useState, useEffect } from 'react';
import { Layout } from '../components/common/Layout';
import { ventaService } from '../services/ventaService';
import { useNotificationStore } from '../store/notificationStore';
import { Edit2, Trash2, Search } from 'lucide-react';

export const SalesHistoryPage = () => {
  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVenta, setSelectedVenta] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editFormData, setEditFormData] = useState({ estado: '', notas: '' });
  
  const [editProductos, setEditProductos] = useState([]); 

  const notification = useNotificationStore();

  useEffect(() => {
    cargarVentas();
  }, []);

  const cargarVentas = async () => {
    setLoading(true);
    try {
      const data = await ventaService.list();
      setVentas(data);
    } catch (error) {
      notification.error('Error cargando ventas');
    } finally {
      setLoading(false);
    }
  };

  const ventasFiltradas = ventas.filter(venta =>
    venta.id.toString().includes(searchTerm) ||
    (venta.Cliente && venta.Cliente.nombre?.toLowerCase().includes(searchTerm.toLowerCase())) ||
    venta.estado.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditClick = (venta) => {
    setSelectedVenta(venta);
    setEditFormData({
      estado: venta.estado,
      notas: venta.notas || ''
    });
    
    if (venta.Productos) {
      setEditProductos(venta.Productos.map(p => ({
        id: p.id,
        nombre: p.nombre,
        cantidad: p.VentaProducto.cantidad
      })));
    }
    
    setShowEditModal(true);
  };

  const handleDeleteClick = (venta) => {
    setSelectedVenta(venta);
    setShowDeleteModal(true);
  };

  const handleUpdateVenta = async () => {
    if (!selectedVenta) return;

    try {
      await ventaService.update(selectedVenta.id, {
        ...editFormData,
        productos: editProductos.map(p => ({ id: p.id, cantidad: p.cantidad }))
      });
      
      notification.success('Venta y Stock actualizados correctamente');
      setShowEditModal(false);
      cargarVentas();
    } catch (error) {
      notification.error('Error actualizando venta');
    }
  };

  const handleReembolsoVenta = async () => {
    if (!selectedVenta) return;

    try {
      await ventaService.delete(selectedVenta.id);
      notification.success('Reembolso procesado correctamente. Stock y saldo revertidos.');
      setShowDeleteModal(false);
      cargarVentas();
    } catch (error) {
      notification.error('Error procesando reembolso');
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(value);
  };

  const getEstadoBadgeColor = (estado) => {
    const colors = {
      'cerrada': 'bg-green-100 text-green-800',
      'abierta': 'bg-blue-100 text-blue-800',
      'guardada': 'bg-yellow-100 text-yellow-800',
      'anulada': 'bg-red-100 text-red-800'
    };
    return colors[estado] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Layout title="Historial de Ventas">
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Historial de Ventas</h1>
          <p className="text-gray-600">Consulta, edita y procesa reembolsos de ventas registradas[cite: 15]</p>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por ID, cliente o estado..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="text-center py-8">
              <p className="text-gray-600">Cargando ventas...</p>
            </div>
          ) : ventasFiltradas.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No hay ventas registradas</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">ID</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Cliente</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Total</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Método Pago</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Estado</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Fecha</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {ventasFiltradas.map((venta) => (
                  <tr key={venta.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{venta.id}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {venta.Cliente?.nombre || 'Cliente Mostrador'}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-purple-600">
                      {formatCurrency(venta.total)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{venta.metodo_pago}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getEstadoBadgeColor(venta.estado)}`}>
                        {venta.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {new Date(venta.createdAt).toLocaleDateString('es-CO')}
                    </td>
                    <td className="px-6 py-4 text-sm space-x-2 flex">
                      <button
                        onClick={() => handleEditClick(venta)}
                        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-xs font-medium transition"
                      >
                        <Edit2 className="w-4 h-4" />
                        Editar
                      </button>
                      <button
                        onClick={() => handleDeleteClick(venta)}
                        className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-xs font-medium transition"
                      >
                        <Trash2 className="w-4 h-4" />
                        Reembolsar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Edit Modal con Corrección de Cantidades (Punto 5 y 7) */}
      {showEditModal && selectedVenta && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Editar Venta #{selectedVenta.id}</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
                <select
                  value={editFormData.estado}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, estado: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="abierta">Abierta</option>
                  <option value="guardada">Guardada</option>
                  <option value="cerrada">Cerrada</option>
                  <option value="anulada">Anulada</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notas</label>
                <textarea
                  value={editFormData.notas}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, notas: e.target.value })
                  }
                  rows="2"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Agregar notas sobre esta venta..."
                />
              </div>

              {/* Sección de productos para corrección de inventario */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Corregir Cantidades[cite: 16]</label>
                <div className="space-y-2 max-h-32 overflow-y-auto border rounded-lg p-2 bg-gray-50">
                  {editProductos.map((prod, index) => (
                    <div key={prod.id} className="flex justify-between items-center bg-white p-2 rounded shadow-sm">
                      <span className="text-xs font-medium text-gray-600 truncate w-32">{prod.nombre}</span>
                      <input 
                        type="number" 
                        value={prod.cantidad}
                        onChange={(e) => {
                          const newProds = [...editProductos];
                          newProds[index].cantidad = parseInt(e.target.value) || 0;
                          setEditProductos(newProds);
                        }}
                        className="w-16 text-center border rounded text-sm p-1"
                        min="0"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleUpdateVenta}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition"
              >
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete (Reembolso) Modal - Punto 6 */}
      {showDeleteModal && selectedVenta && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Confirmar Reembolso[cite: 16]</h2>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-red-700 mb-3">
                <strong>⚠️ ADVERTENCIA:</strong> Esta acción anulará completamente la venta y revertirá:
              </p>
              <ul className="text-sm text-red-700 list-disc list-inside space-y-1">
                <li>Stock de productos (será restaurado)[cite: 16]</li>
                <li>Saldo del cliente (si aplica)[cite: 16]</li>
              </ul>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleReembolsoVenta}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition"
              >
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};