import { useState, useEffect } from 'react';
import { Edit2, Trash2, Plus, Search } from 'lucide-react';
import { clienteService } from '../../services/clienteService';
import { useNotificationStore } from '../../store/notificationStore';

export const ClientesTable = ({ onRefresh }) => {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    saldo_pendiente: ''
  });

  const addNotification = useNotificationStore((state) => state.addNotification);

  useEffect(() => {
    loadClientes();
  }, [onRefresh]);

  const loadClientes = async () => {
    setLoading(true);
    try {
      const data = await clienteService.list();
      setClientes(data);
    } catch (error) {
      addNotification('Error cargando clientes', 'error');
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
        await clienteService.update(editingId, formData);
        addNotification('Cliente actualizado', 'success');
      } else {
        await clienteService.create(formData);
        addNotification('Cliente creado', 'success');
      }
      resetForm();
      loadClientes();
    } catch (error) {
      addNotification('Error guardando cliente', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro?')) return;
    try {
      await clienteService.delete(id);
      addNotification('Cliente eliminado', 'success');
      loadClientes();
    } catch (error) {
      addNotification('Error eliminando cliente', 'error');
    }
  };

  const handleEdit = (cliente) => {
    setEditingId(cliente.id);
    setFormData(cliente);
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({ nombre: '', saldo_pendiente: '' });
    setEditingId(null);
    setShowForm(false);
  };

  const filteredClientes = clientes.filter(c =>
    c.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Clientes</h2>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Nuevo Cliente
        </button>
      </div>

      {/* Search */}
      <div className="mb-4 relative">
        <Search className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
        <input
          type="text"
          placeholder="Buscar cliente..."
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
              {editingId ? 'Editar Cliente' : 'Nuevo Cliente'}
            </h3>

            <div className="space-y-3">
              <input
                type="text"
                placeholder="Nombre del cliente"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500"
              />
              <input
                type="number"
                placeholder="Saldo pendiente"
                value={formData.saldo_pendiente}
                onChange={(e) => setFormData({ ...formData, saldo_pendiente: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500"
                step="0.01"
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
              <th className="px-4 py-3 text-right font-semibold text-gray-700">Saldo Pendiente</th>
              <th className="px-4 py-3 text-center font-semibold text-gray-700">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredClientes.map((cliente) => (
              <tr key={cliente.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-900 font-medium">{cliente.nombre}</td>
                <td className="px-4 py-3 text-right">
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                    parseFloat(cliente.saldo_pendiente || 0) > 0
                      ? 'bg-red-100 text-red-700'
                      : 'bg-green-100 text-green-700'
                  }`}>
                    ${parseFloat(cliente.saldo_pendiente || 0).toFixed(2)}
                  </span>
                </td>
                <td className="px-4 py-3 text-center space-x-2 flex justify-center">
                  <button
                    onClick={() => handleEdit(cliente)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(cliente.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredClientes.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No hay clientes
          </div>
        )}
      </div>
    </div>
  );
};
