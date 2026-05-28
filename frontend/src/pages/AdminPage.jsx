import { useState } from 'react';
import { Layout } from '../components/common/Layout';
import { Users, ShoppingCart, Tag } from 'lucide-react';
import { ClientesTable } from '../components/admin/ClientesTable';
import { ProveedoresTable } from '../components/admin/ProveedoresTable';
import { DescuentosTable } from '../components/admin/DescuentosTable';

export const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('clientes');
  const [refresh, setRefresh] = useState(0);

  const handleRefresh = () => {
    setRefresh(prev => prev + 1);
  };

  return (
    <Layout title="Administración">
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Gestión Administrativa</h1>
          <p className="text-gray-600">Administra clientes, proveedores y descuentos</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 flex-wrap">
          <button
            onClick={() => setActiveTab('clientes')}
            className={`px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition ${
              activeTab === 'clientes'
                ? 'bg-purple-600 text-white'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            <Users className="w-5 h-5" />
            Clientes
          </button>
          <button
            onClick={() => setActiveTab('proveedores')}
            className={`px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition ${
              activeTab === 'proveedores'
                ? 'bg-purple-600 text-white'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            <ShoppingCart className="w-5 h-5" />
            Proveedores
          </button>
          <button
            onClick={() => setActiveTab('descuentos')}
            className={`px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition ${
              activeTab === 'descuentos'
                ? 'bg-purple-600 text-white'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            <Tag className="w-5 h-5" />
            Descuentos
          </button>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {activeTab === 'clientes' && <ClientesTable onRefresh={refresh} />}
          {activeTab === 'proveedores' && <ProveedoresTable onRefresh={refresh} />}
          {activeTab === 'descuentos' && <DescuentosTable onRefresh={refresh} />}
        </div>
      </div>
    </Layout>
  );
};
