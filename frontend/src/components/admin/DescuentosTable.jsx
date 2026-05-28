import { useState, useEffect } from 'react';
import { Edit2, Trash2, Plus, Search } from 'lucide-react';
import { descuentoService } from '../../services/descuentoService';
import { useNotificationStore } from '../../store/notificationStore';

export const DescuentosTable = ({ onRefresh }) => {
  const [descuentos, setDescuentos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    codigo: '',
    porcentaje: '',
    activo: true
  });

  const addNotification = useNotificationStore((state) => state.addNotification);

  useEffect(() => {
    loadDescuentos();
  }, [onRefresh]);

  const loadDescuentos = async () => {
    setLoading(true);
    try {
      const data = await descuentoService.list();
      setDescuentos(data);
    } catch (error) {
      addNotification('Error cargando descuentos', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.nombre || !formData.codigo || !formData.porcentaje) {
      addNotification('Completa todos los campos', 'warning');
      return;
    }

    try {
      if (editingId) {
        await descuentoService.update(editingId, formData);
        addNotification('Descuento actualizado', 'success');
      } else {
        await descuentoService.create(formData);
        addNotification('Descuento creado', 'success');
      }
      resetForm();
      loadDescuentos();
    } catch (error) {
      addNotification('Error guardando descuento', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro?')) return;
    try {
      await descuentoService.delete(id);
      addNotification('Descuento eliminado', 'success');
      loadDescuentos();
    } catch (error) {
      addNotification('Error eliminando descuento', 'error');
    }
  };

  const handleEdit = (descuento) => {
    setEditingId(descuento.id);
    setFormData(descuento);
    setShowForm(true);
  };

  const toggleActive = async (id, currentState) => {
    try {
      const descuento = descuentos.find(d => d.id === id);
      await descuentoService.update(id, { ...descuento, activo: !currentState });
      addNotification(currentState ? 'Descuento desactivado' : 'Descuento activado', 'success');
      loadDescuentos();
    } catch (error) {
      addNotification('Error actualizando descuento', 'error');
    }
  };

  const resetForm = () => {
    setFormData({ nombre: '', codigo: '', porcentaje: '', activo: true });
    setEditingId(null);
    setShowForm(false);
  };

  const filteredDescuentos = descuentos.filter(d =>
    d.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.codigo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Descuentos</h2>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Nuevo Descuento
        </button>
      </div>

      {/* Search */}
      <div className="mb-4 relative">
        <Search className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
        <input
          type="text"
          placeholder="Buscar por nombre o código..."
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
              {editingId ? 'Editar Descuento' : 'Nuevo Descuento'}
            </h3>

            <div className="space-y-3">
              <input
                type="text"
                placeholder="Nombre"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500"
              />
              <input
                type="text"
                placeholder="Código"
                value={formData.codigo}
                onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500"
              />
              <input
                type="number"
                placeholder="Porcentaje"
                value={formData.porcentaje}
                onChange={(e) => setFormData({ ...formData, porcentaje: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500"
                step="0.01"
              />

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="activo"
                  checked={formData.activo}
                  onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
                  className="w-4 h-4"
                />
                <label htmlFor="activo" className="text-sm font-medium text-gray-700">
                  Activo
                </label>
              </div>
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
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Código</th>
              <th className="px-4 py-3 text-center font-semibold text-gray-700">Porcentaje</th>
              <th className="px-4 py-3 text-center font-semibold text-gray-700">Estado</th>
              <th className="px-4 py-3 text-center font-semibold text-gray-700">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredDescuentos.map((descuento) => (
              <tr key={descuento.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-900 font-medium">{descuento.nombre}</td>
                <td className="px-4 py-3 text-gray-600 font-mono">{descuento.codigo}</td>
                <td className="px-4 py-3 text-center text-gray-900 font-bold">
                  {descuento.porcentaje}%
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => toggleActive(descuento.id, descuento.activo)}
                    className={`px-3 py-1 rounded-full text-sm font-semibold transition ${
                      descuento.activo
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                    }`}
                  >
                    {descuento.activo ? 'Activo' : 'Inactivo'}
                  </button>
                </td>
                <td className="px-4 py-3 text-center space-x-2 flex justify-center">
                  <button
                    onClick={() => handleEdit(descuento)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(descuento.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredDescuentos.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No hay descuentos
          </div>
        )}
      </div>
    </div>
  );
};
