import { useState, useEffect } from 'react';
import { Search, Plus, Minus, Trash2 } from 'lucide-react';
import { productService } from '../../services/productService';
import { useCartStore } from '../../store/cartStore';
import { useNotificationStore } from '../../store/notificationStore';

export const ProductSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const addItem = useCartStore((state) => state.addItem);
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const addNotification = useNotificationStore((state) => state.addNotification);

  useEffect(() => {
    if (query.trim().length === 0) {
      setResults([]);
      setShowResults(false);
      return;
    }

    const search = async () => {
      setLoading(true);
      try {
        const productos = await productService.search(query);
        setResults(productos);
        setShowResults(true);
      } catch (error) {
        addNotification('Error buscando productos', 'error');
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(search, 300);
    return () => clearTimeout(timer);
  }, [query, addNotification]);

  const handleAddProduct = (producto) => {
    if (producto.stock < 1) {
      addNotification(`${producto.nombre} no tiene stock disponible`, 'warning');
      return;
    }
    addItem(producto);
    addNotification(`${producto.nombre} agregado al carrito`, 'success');
    setQuery('');
    setShowResults(false);
  };

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative">
        <div className="flex items-center bg-white border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-purple-500 focus-within:border-transparent">
          <Search className="w-5 h-5 text-gray-400 ml-3" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar producto por nombre o SKU..."
            className="flex-1 px-4 py-3 focus:outline-none"
            autoFocus
          />
        </div>

        {/* Search Results Dropdown */}
        {showResults && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto z-10">
            {loading && (
              <div className="p-4 text-center text-gray-500">Buscando...</div>
            )}
            {!loading && results.length === 0 && (
              <div className="p-4 text-center text-gray-500">
                No se encontraron productos
              </div>
            )}
            {!loading && results.map((producto) => (
              <div
                key={producto.id}
                className="p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer last:border-b-0 flex justify-between items-center"
              >
                <div className="flex-1" onClick={() => handleAddProduct(producto)}>
                  <p className="font-semibold text-gray-900">{producto.nombre}</p>
                  <p className="text-sm text-gray-500">
                    SKU: {producto.sku} | Stock: {producto.stock} | ${producto.precio.toFixed(2)}
                  </p>
                </div>
                <button
                  onClick={() => handleAddProduct(producto)}
                  className="bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-lg ml-2"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Shopping Cart Items */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-4 py-3 border-b border-gray-200">
          <h3 className="font-bold text-gray-900">
            Carrito ({items.length} artículos)
          </h3>
        </div>

        {items.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p>El carrito está vacío. Busca y agrega productos.</p>
          </div>
        ) : (
          <div className="max-h-96 overflow-y-auto">
            {items.map((item) => (
              <div
                key={item.productoId}
                className="p-4 border-b border-gray-100 last:border-b-0 flex items-center justify-between"
              >
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{item.nombre}</p>
                  <p className="text-sm text-gray-500">
                    ${item.precio.toFixed(2)} x {item.cantidad} = ${item.subtotal.toFixed(2)}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.productoId, item.cantidad - 1)}
                    className="bg-gray-200 hover:bg-gray-300 p-1 rounded"
                  >
                    <Minus className="w-4 h-4 text-gray-700" />
                  </button>
                  <input
                    type="number"
                    value={item.cantidad}
                    onChange={(e) => updateQuantity(item.productoId, parseInt(e.target.value) || 1)}
                    className="w-12 text-center border border-gray-300 rounded"
                    min="1"
                  />
                  <button
                    onClick={() => updateQuantity(item.productoId, item.cantidad + 1)}
                    className="bg-gray-200 hover:bg-gray-300 p-1 rounded"
                  >
                    <Plus className="w-4 h-4 text-gray-700" />
                  </button>
                  <button
                    onClick={() => removeItem(item.productoId)}
                    className="bg-red-100 hover:bg-red-200 p-1 rounded text-red-600 ml-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
