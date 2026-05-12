import { useState } from "react";
import { Link } from "react-router-dom";
import useCartStore from "../../../store/cartStore";

export default function Checkout() {
  // Checkout simulado — solo estilos y textos personalizados
  const items = useCartStore((state) => state.items);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);
  const clearCart = useCartStore((state) => state.clearCart);

  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    address: "",
  });

  const total = getTotalPrice();

  const handleChange = (event) => {
    setFormData((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    clearCart();
    setSuccess(true);
  };

  // -----------------------------
  // PANTALLA DE COMPRA EXITOSA
  // -----------------------------
  if (success) {
    return (
      <section className="max-w-3xl mx-auto px-4 py-16">
        <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center shadow-sm">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">¡Compra simulada exitosa!</h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Gracias por completar este flujo.  
            Recuerda: este checkout es solo una demostración para el taller.
          </p>

          <Link
            to="/gallery"
            className="inline-flex px-8 py-3 rounded-lg bg-purple-600 text-white font-semibold hover:opacity-90 transition"
          >
            Volver a la galería
          </Link>
        </div>
      </section>
    );
  }

  // -----------------------------
  // CARRITO VACÍO
  // -----------------------------
  if (items.length === 0) {
    return (
      <section className="max-w-3xl mx-auto px-4 py-16">
        <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">No hay productos para pagar</h2>
          <p className="text-gray-600 mb-8">
            Agrega productos al carrito antes de continuar con el checkout.
          </p>

          <Link
            to="/gallery"
            className="inline-flex px-8 py-3 rounded-lg bg-purple-600 text-white font-semibold hover:opacity-90 transition"
          >
            Ir a productos
          </Link>
        </div>
      </section>
    );
  }

  // -----------------------------
  // CHECKOUT SIMULADO
  // -----------------------------
  return (
    <section className="max-w-6xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Checkout (simulado)</h2>

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8">

        {/* FORMULARIO */}
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm space-y-6"
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Datos del comprador</h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo</label>
            <input
              required
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Ej: Juan Pérez"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-200 focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
            <input
              required
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="tuemail@ejemplo.com"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-200 focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Dirección de entrega</label>
            <input
              required
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Calle 123 #45-67"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-200 focus:border-purple-500"
            />
          </div>

          <button
            type="submit"
            className="w-full mt-4 px-6 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:opacity-90 transition"
          >
            Confirmar compra simulada
          </button>
        </form>

        {/* RESUMEN */}
        <aside className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm h-fit">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Resumen del pedido</h3>

          <div className="space-y-3 mb-4">
            {items.map(({ product, quantity }) => (
              <div key={product.id} className="flex justify-between text-sm">
                <span className="text-gray-700">
                  {product.title} <span className="text-gray-500">x {quantity}</span>
                </span>
                <span className="font-medium text-gray-900">
                  ${(Number(product.price) * Number(quantity)).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-200 pt-4 flex justify-between text-lg font-bold text-gray-900">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </aside>
      </div>
    </section>
  );
}
