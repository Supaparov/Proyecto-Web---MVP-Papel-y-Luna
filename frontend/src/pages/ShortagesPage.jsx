import { useState, useEffect } from 'react';
import { Layout } from '../components/common/Layout';
import { faltanteService } from '../services/faltanteService';
import { useNotificationStore } from '../store/notificationStore';
import { useAuth } from '../hooks/useAuth';
import { AlertCircle, TrendingUp, Plus } from 'lucide-react';

export const ShortagesPage = () => {
  const { isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState(isAdmin ? 'form' : 'report');
  const [faltantes, setFaltantes] = useState([]);
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    nombre_producto: '',
    tipo: 'agotado'
  });

  const addNotification = useNotificationStore((state) => state.addNotification);

  // Cargar faltantes
  useEffect(() => {
    loadFaltantes();
  }, []);

  const loadFaltantes = async () => {
    setLoading(true);
    try {
      const data = await faltanteService.list();
      setFaltantes(data);
      // Generar reporte
      const consolidated = consolidateReport(data);
      setReportData(consolidated);
    } catch (error) {
      addNotification('Error cargando faltantes', 'error');
    } finally {
      setLoading(false);
    }
  };

  const consolidateReport = (data) => {
    const map = {};
    data.forEach(item => {
      const key = item.nombre_producto.toLowerCase();
      if (!map[key]) {
        map[key] = {
          nombre_producto: item.nombre_producto,
          veces_solicitado: 0,
          ultima_solicitud: item.createdAt
        };
      }
      map[key].veces_solicitado++;
      if (new Date(item.createdAt) > new Date(map[key].ultima_solicitud)) {
        map[key].ultima_solicitud = item.createdAt;
      }
    });

    return Object.values(map).sort((a, b) => b.veces_solicitado - a.veces_solicitado);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nombre_producto.trim()) {
      addNotification('Ingresa el nombre del producto', 'warning');
      return;
    }

    setLoading(true);
    try {
      await faltanteService.create(formData);
      addNotification('Faltante registrado', 'success');
      setFormData({ nombre_producto: '', tipo: 'agotado' });
      loadFaltantes();
    } catch (error) {
      addNotification('Error registrando faltante', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Faltantes">
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Gestión de Faltantes</h1>

        {/* Tabs - Solo mostrar opción de reporte si es admin */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('form')}
            className={`px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition ${
              activeTab === 'form'
                ? 'bg-purple-600 text-white'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            <Plus className="w-5 h-5" />
            Registrar Faltante
          </button>
          {isAdmin && (
            <button
              onClick={() => setActiveTab('report')}
              className={`px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition ${
                activeTab === 'report'
                  ? 'bg-purple-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              <TrendingUp className="w-5 h-5" />
              Reporte Consolidado
            </button>
          )}
        </div>

        {/* Tab Content */}
        {activeTab === 'form' && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 max-w-2xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Registrar Producto Faltante</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del Producto *
                </label>
                <input
                  type="text"
                  value={formData.nombre_producto}
                  onChange={(e) => setFormData({ ...formData, nombre_producto: e.target.value })}
                  placeholder="Ej: Cuaderno A4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Faltante *
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { value: 'agotado', label: 'Agotado en stock' },
                    { value: 'no registrado', label: 'No está registrado' }
                  ].map(option => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, tipo: option.value })}
                      className={`py-3 px-4 rounded-lg font-semibold border-2 transition ${
                        formData.tipo === option.value
                          ? 'border-purple-600 bg-purple-50 text-purple-700'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-semibold transition"
              >
                Registrar Faltante
              </button>
            </form>
          </div>
        )}

        {activeTab === 'report' && isAdmin && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Reporte Consolidado</h2>

            {reportData.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                No hay faltantes registrados
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">Producto</th>
                      <th className="px-4 py-3 text-center font-semibold text-gray-700">
                        <div className="flex items-center justify-center gap-2">
                          <AlertCircle className="w-4 h-4" />
                          Solicitudes
                        </div>
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">Última Solicitud</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.map((item, index) => (
                      <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-4 py-3 text-gray-900 font-medium">{item.nombre_producto}</td>
                        <td className="px-4 py-3 text-center">
                          <span className="inline-flex items-center justify-center w-8 h-8 bg-red-100 text-red-700 rounded-full font-bold">
                            {item.veces_solicitado}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-600 text-sm">
                          {new Date(item.ultima_solicitud).toLocaleDateString('es-ES')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};
