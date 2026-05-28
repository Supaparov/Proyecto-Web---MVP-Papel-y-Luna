import { useState, useEffect } from 'react';
import { Edit2, Trash2, Plus, Search } from 'lucide-react';
import { productService } from '../../services/productService';
import { useNotificationStore } from '../../store/notificationStore';

export const ProductsTable = ({ onRefresh }) => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    sku: '',
    precio: '',
    costo: '',
    stock: '',
    categoriaId: ''
  });

  const addNotification = useNotificationStore((state) => state.addNotification);

  // Cargar productos
  useEffect(() => {
    loadProductos();
  }, [onRefresh]);

  const loadProductos = async () => {
    setLoading(true);
    try {
      const data = await productService.list();
      setProductos(data);
    } catch (error) {
      addNotification('Error cargando productos', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.nombre || !formData.sku || !formData.precio) {
      addNotification('Completa todos los campos requeridos', 'warning');
      return;
    }

    try {
      if (editingId) {
        await productService.update(editingId, formData);
        addNotification('Producto actualizado', 'success');
      } else {
        await productService.create(formData);
        addNotification('Producto creado', 'success');
      }
      resetForm();
      loadProductos();
    } catch (error) {
      addNotification('Error guardando producto', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro?')) return;
    try {
      await productService.delete(id);
      addNotification('Producto eliminado', 'success');
      loadProductos();
    } catch (error) {
      addNotification('Error eliminando producto', 'error');
    }
  };

  const handleEdit = (producto) => {
    setEditingId(producto.id);
    setFormData(producto);
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({ nombre: '', sku: '', precio: '', costo: '', stock: '', categoriaId: '' });
    setEditingId(null);
    setShowForm(false);
  };

  const filteredProductos = productos.filter(p =>
    p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Productos</h2>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Nuevo Producto
        </button>
      </div>

      {/* Search */}
      <div className="mb-4 relative">
        <Search className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
        <input
          type="text"
          placeholder="Buscar por nombre o SKU..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-h-96 overflow-y-auto">
            <h3 className="text-lg font-bold mb-4">
              {editingId ? 'Editar Producto' : 'Nuevo Producto'}
            </h3>

            <div className="space-y-3">
              <input
                type="text"
                placeholder="Nombre del producto"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500"
              />
              <input
                type="text"
                placeholder="SKU"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Precio"
                  value={formData.precio}
                  onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500"
                  step="0.01"
                />
                <input
                  type="number"
                  placeholder="Costo"
                  value={formData.costo}
                  onChange={(e) => setFormData({ ...formData, costo: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500"
                  step="0.01"
                />
              </div>
              <input
                type="number"
                placeholder="Stock"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSave}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg"
              >
                Guardar
              </button>
              <button
                onClick={resetForm}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 rounded-lg"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Nombre</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">SKU</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-700">Precio</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-700">Stock</th>
              <th className="px-4 py-3 text-center font-semibold text-gray-700">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredProductos.map((producto) => (
              <tr key={producto.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-900 font-medium">{producto.nombre}</td>
                <td className="px-4 py-3 text-gray-600">{producto.sku}</td>
                <td className="px-4 py-3 text-right text-gray-900">
                  ${parseFloat(producto.precio).toFixed(2)}
                </td>
                <td className="px-4 py-3 text-right">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    producto.stock < 5
                      ? 'bg-red-100 text-red-700'
                      : 'bg-green-100 text-green-700'
                  }`}>
                    {producto.stock}
                  </span>
                </td>
                <td className="px-4 py-3 text-center space-x-2 flex justify-center">
                  <button
                    onClick={() => handleEdit(producto)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(producto.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredProductos.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No hay productos
          </div>
        )}
      </div>
    </div>
  );
};
