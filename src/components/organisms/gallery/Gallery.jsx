import { useEffect, useMemo, useState } from "react";
import ProductCard from "../../molecules/ProductCard";
import { getProducts } from "../../../services/productService";

const ITEMS_PER_PAGE = 4;
// TODO ESTUDIANTE: ajusta items por pagina y mejora UX de filtros/categorias.

export default function Gallery() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    getProducts().then((data) => {
      setProducts(data);
      setLoading(false);
    });
  }, []);

  const filteredProducts = useMemo(() => {
    // TODO ESTUDIANTE: extender busqueda por categoria y precio.
    const normalized = searchTerm.trim().toLowerCase();
    if (!normalized) return products;

    return products.filter((product) => {
      return (
        product.title.toLowerCase().includes(normalized) ||
        product.description.toLowerCase().includes(normalized)
      );
    });
  }, [products, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const visibleProducts = filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const goToPage = (page) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <section className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold">Nuestros Productos</h2>
          <p className="text-sm text-gray-500 mt-1">
            {filteredProducts.length} resultado(s)
          </p>
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Buscar por nombre o descripción..."
          className="w-full sm:w-80 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-500"
        />
      </div>

      {filteredProducts.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-8 text-center text-gray-500">
          No se encontraron productos para esa búsqueda.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
            {visibleProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="flex justify-center items-center gap-2 mt-8 flex-wrap">
            <button
              type="button"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-2 rounded-lg border border-gray-300 text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Anterior
            </button>
            {Array.from({ length: totalPages }, (_, index) => {
              const page = index + 1;
              return (
                <button
                  key={page}
                  type="button"
                  onClick={() => goToPage(page)}
                  className={`w-9 h-9 rounded-lg text-sm font-medium border ${
                    page === currentPage
                      ? "border-purple-600 bg-purple-600 text-white"
                      : "border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {page}
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-2 rounded-lg border border-gray-300 text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Siguiente
            </button>
          </div>
        </>
      )}
    </section>
  );
}
