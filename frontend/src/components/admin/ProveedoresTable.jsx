import { useState, useEffect } from 'react';
import { Edit2, Trash2, Plus, Search } from 'lucide-react';
import { proveedorService } from '../../services/proveedorService';
import { useNotificationStore } from '../../store/notificationStore';

export const ProveedoresTable = ({ onRefresh }) => {
  const [proveedores, setProveedores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    nit: '',
    contacto: ''
  });

  const addNotification = useNotificationStore((state) => state.addNotification);

  useEffect(() => {
    loadProveedores();
  }, [onRefresh]);

  const loadProveedores = async () => {
    setLoading(true);
    try {
      const data = await proveedorService.list();
      setProveedores(data);
    } catch (error) {
      addNotification('Error cargando proveedores', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.nombre) {
      addNotification('El nombre es requerido', 'warning');
      return;
    }

    try {
      if (editingId) {
        await proveedorService.update(editingId, formData);
        addNotification('Proveedor actualizado', 'success');
      } else {
        await proveedorService.create(formData);
        addNotification('Proveedor creado', 'success');
      }
      resetForm();
      loadProveedores();
    } catch (error) {
      addNotification('Error guardando proveedor', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro?')) return;
    try {
      await proveedorService.delete(id);
      addNotification('Proveedor eliminado', 'success');
      loadProveedores();
    } catch (error) {
      addNotification('Error eliminando proveedor', 'error');
    }
  };

  const handleEdit = (proveedor) => {
    setEditingId(proveedor.id);
    setFormData(proveedor);
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({ nombre: '', nit: '', contacto: '' });
    setEditingId(null);
    setShowForm(false);
  };

  const filteredProveedores = proveedores.filter(p =>
    p.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Proveedores</h2>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Nuevo Proveedor
        </button>
      </div>

      {/* Search */}
      <div className="mb-4 relative">
        <Search className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
        <input
          type="text"
          placeholder="Buscar proveedor..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
        />
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-bold mb-4">
              {editingId ? 'Editar Proveedor' : 'Nuevo Proveedor'}
            </h3>

            <div className="space-y-3">
              <input
                type="text"
                placeholder="Nombre del proveedor"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500"
              />
              <input
                type="text"
                placeholder="NIT"
                value={formData.nit || ''}
                onChange={(e) => setFormData({ ...formData, nit: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500"
              />
              <input
                type="text"
                placeholder="Contacto"
                value={formData.contacto || ''}
                onChange={(e) => setFormData({ ...formData, contacto: e.target.value })}
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
              <th className="px-4 py-3 text-left font-semibold text-gray-700">NIT</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Contacto</th>
              <th className="px-4 py-3 text-center font-semibold text-gray-700">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredProveedores.map((proveedor) => (
              <tr key={proveedor.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-900 font-medium">{proveedor.nombre}</td>
                <td className="px-4 py-3 text-gray-600">{proveedor.nit || '-'}</td>
                <td className="px-4 py-3 text-gray-600">{proveedor.contacto || '-'}</td>
                <td className="px-4 py-3 text-center space-x-2 flex justify-center">
                  <button
                    onClick={() => handleEdit(proveedor)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(proveedor.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredProveedores.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No hay proveedores
          </div>
        )}
      </div>
    </div>
  );
};
