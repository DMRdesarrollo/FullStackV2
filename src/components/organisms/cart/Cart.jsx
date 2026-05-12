import { Link } from "react-router-dom";
import useCartStore from "../../../store/cartStore";
import { imageMap } from "../../../assets/imageMap";
import { useState, useMemo } from "react";

export default function Cart() {
  const items = useCartStore((state) => state.items);
  const incrementItem = useCartStore((state) => state.incrementItem);
  const decrementItem = useCartStore((state) => state.decrementItem);
  const removeItem = useCartStore((state) => state.removeItem);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);

  // -----------------------------
  // NUEVO: cupones, envío, impuestos
  // -----------------------------
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(null);
  const [shippingMethod, setShippingMethod] = useState("standard");

  const subtotal = getTotalPrice();

  // Impuestos (IVA 19%)
  const taxRate = 0.19;
  const taxes = subtotal * taxRate;

  // Envío
  const shippingCost = shippingMethod === "express" ? 19.99 : 9.99;

  // Cupones disponibles
  const validCoupons = {
    DESCUENTO10: 0.10,
    DESCUENTO20: 0.20,
    ENVIOGRATIS: "free-shipping",
  };

  const applyCoupon = () => {
    const code = coupon.trim().toUpperCase();
    if (!validCoupons[code]) {
      setCouponApplied("invalid");
      return;
    }
    setCouponApplied(code);
  };

  // Cálculo final
  const discount = useMemo(() => {
    if (!couponApplied) return 0;

    if (couponApplied === "ENVIOGRATIS") return 0;

    const rate = validCoupons[couponApplied];
    return subtotal * rate;
  }, [couponApplied, subtotal]);

  const finalShipping =
    couponApplied === "ENVIOGRATIS" ? 0 : shippingCost;

  const total = subtotal + taxes + finalShipping - discount;

  // -----------------------------
  // Carrito vacío
  // -----------------------------
  if (items.length === 0) {
    return (
      <section className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Tu carrito está vacío</h2>
          <p className="text-gray-500 mb-6">
            Agrega productos desde la galería para iniciar la compra.
          </p>
          <Link
            to="/gallery"
            className="inline-flex px-6 py-3 rounded-lg bg-purple-600 text-white font-medium hover:opacity-90"
          >
            Ir a productos
          </Link>
        </div>
      </section>
    );
  }

  // -----------------------------
  // Carrito con productos
  // -----------------------------
  return (
    <section className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Carrito de compras</h2>

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">

        {/* LISTA DE PRODUCTOS */}
        <div className="bg-white rounded-2xl border border-gray-200 divide-y divide-gray-100">
          {items.map(({ product, quantity }) => {
            const resolvedImage = imageMap[product.image] ?? product.image;
            const itemSubtotal = Number(product.price) * Number(quantity);

            return (
              <article key={product.id} className="p-4 flex gap-4 items-center">
                <img
                  src={resolvedImage}
                  alt={product.title}
                  className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                />

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">{product.title}</h3>
                  <p className="text-sm text-gray-500">${Number(product.price).toFixed(2)} c/u</p>
                  <p className="text-sm font-semibold text-gray-800 mt-1">
                    Subtotal: ${itemSubtotal.toFixed(2)}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => decrementItem(product.id)}
                    className="w-8 h-8 rounded-lg border border-gray-300 hover:bg-gray-50"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-sm font-semibold">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => incrementItem(product.id)}
                    className="w-8 h-8 rounded-lg border border-gray-300 hover:bg-gray-50"
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => removeItem(product.id)}
                  className="text-sm text-red-600 hover:text-red-700"
                >
                  Quitar
                </button>
              </article>
            );
          })}
        </div>

        {/* RESUMEN */}
        <aside className="bg-white rounded-2xl border border-gray-200 p-6 h-fit">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Resumen</h3>

          <div className="flex justify-between text-gray-600 mb-2">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>

          <div className="flex justify-between text-gray-600 mb-2">
            <span>Impuestos (19%)</span>
            <span>${taxes.toFixed(2)}</span>
          </div>

          <div className="flex justify-between text-gray-600 mb-2">
            <span>Envío</span>
            <span>${finalShipping.toFixed(2)}</span>
          </div>

          {discount > 0 && (
            <div className="flex justify-between text-green-600 font-semibold mb-2">
              <span>Descuento ({couponApplied})</span>
              <span>- ${discount.toFixed(2)}</span>
            </div>
          )}

          {/* CUPÓN */}
          <div className="mt-4">
            <label className="text-sm font-medium text-gray-700">Cupón</label>
            <div className="flex gap-2 mt-1">
              <input
                type="text"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                placeholder="DESCUENTO10"
                className="flex-1 px-3 py-2 border rounded-lg"
              />
              <button
                type="button"
                onClick={applyCoupon}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:opacity-90"
              >
                Aplicar
              </button>
            </div>

            {couponApplied === "invalid" && (
              <p className="text-red-600 text-sm mt-1">Cupón inválido</p>
            )}
            {couponApplied && couponApplied !== "invalid" && (
              <p className="text-green-600 text-sm mt-1">Cupón aplicado</p>
            )}
          </div>

          {/* ENVÍO */}
          <div className="mt-6">
            <label className="text-sm font-medium text-gray-700">Método de envío</label>
            <select
              value={shippingMethod}
              onChange={(e) => setShippingMethod(e.target.value)}
              className="w-full mt-1 px-3 py-2 border rounded-lg"
            >
              <option value="standard">Estándar - $9.99</option>
              <option value="express">Express - $19.99</option>
            </select>
          </div>

          {/* TOTAL */}
          <div className="flex justify-between text-lg font-bold text-gray-900 mt-6 mb-6">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>

          <Link
            to="/checkout"
            className="w-full inline-flex justify-center px-4 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:opacity-90"
          >
            Ir a checkout
          </Link>
        </aside>
      </div>
    </section>
  );
}
