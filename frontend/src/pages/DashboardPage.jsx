import { Layout } from '../components/common/Layout';

export const DashboardPage = () => {
  return (
    <Layout title="Dashboard">
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Bienvenido a Papel y Luna
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Quick Access Cards */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Sistema Listo</p>
                <p className="text-2xl font-bold text-green-600">✓</p>
              </div>
              <div className="bg-green-100 rounded-full p-3">
                <span className="text-2xl">🎉</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
            <div>
              <p className="text-gray-600 text-sm">Backend</p>
              <p className="text-xl font-bold text-blue-600">Conectado</p>
              <p className="text-xs text-gray-500 mt-2">API en http://localhost:3000</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
            <div>
              <p className="text-gray-600 text-sm">Frontend</p>
              <p className="text-xl font-bold text-purple-600">En Desarrollo</p>
              <p className="text-xs text-gray-500 mt-2">Versión 1.0.0</p>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-xl font-bold text-blue-900 mb-4">
            Próximas Mejoras
          </h2>
          <ul className="space-y-2 text-blue-800">
            <li>✓ Módulo de Ventas/POS (en construcción)</li>
            <li>⏳ Módulo de Inventario</li>
            <li>⏳ Módulo de Compras</li>
            <li>⏳ Módulo de Faltantes</li>
            <li>⏳ Gestión Administrativa</li>
          </ul>
        </div>
      </div>
    </Layout>
  );
};
