import create from 'zustand';

export const useCartStore = create((set, get) => ({
  items: [],
  descuento: null,
  cliente: null,

  addItem: (producto) => {
    const state = get();
    const existingItem = state.items.find(item => item.id === producto.id);

    if (existingItem) {
      set({
        items: state.items.map(item =>
          item.id === producto.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        )
      });
    } else {
      set({
        items: [...state.items, {
          productoId: producto.id,
          nombre: producto.nombre,
          precio: producto.precio,
          cantidad: 1,
          subtotal: producto.precio
        }]
      });
    }
  },

  removeItem: (productoId) => {
    set((state) => ({
      items: state.items.filter(item => item.productoId !== productoId)
    }));
  },

  updateQuantity: (productoId, cantidad) => {
    if (cantidad <= 0) {
      get().removeItem(productoId);
      return;
    }
    set((state) => ({
      items: state.items.map(item =>
        item.productoId === productoId
          ? { ...item, cantidad, subtotal: item.precio * cantidad }
          : item
      )
    }));
  },

  setDescuento: (descuento) => {
    set({ descuento });
  },

  setCliente: (cliente) => {
    set({ cliente });
  },

  clearCart: () => {
    set({ items: [], descuento: null, cliente: null });
  },

  getTotal: () => {
    const state = get();
    const subtotal = state.items.reduce((sum, item) => sum + item.subtotal, 0);
    const descuentoMonto = state.descuento 
      ? (subtotal * state.descuento.porcentaje) / 100 
      : 0;
    return {
      subtotal,
      descuentoMonto,
      total: subtotal - descuentoMonto
    };
  }
}));
