import { useState } from 'react';
import { Layout } from '../components/common/Layout';
import { ProductsTable } from '../components/inventory/ProductsTable';
import { CategoriesTable } from '../components/inventory/CategoriesTable';
import { Package, List } from 'lucide-react';

export const InventoryPage = () => {
  const [activeTab, setActiveTab] = useState('products');
  const [refresh, setRefresh] = useState(0);

  const handleRefresh = () => {
    setRefresh(prev => prev + 1);
  };

  return (
    <Layout title="Inventario">
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Gestión de Inventario</h1>
          <p className="text-gray-600">Administra productos y categorías del sistema</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition ${
              activeTab === 'products'
                ? 'bg-purple-600 text-white'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            <Package className="w-5 h-5" />
            Productos
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition ${
              activeTab === 'categories'
                ? 'bg-purple-600 text-white'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            <List className="w-5 h-5" />
            Categorías
          </button>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {activeTab === 'products' && <ProductsTable onRefresh={refresh} />}
          {activeTab === 'categories' && <CategoriesTable onRefresh={refresh} />}
        </div>
      </div>
    </Layout>
  );
};
