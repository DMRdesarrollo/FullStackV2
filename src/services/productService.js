import MOCK_PRODUCTS from "../mockdata/mock_products";

export const getProducts = async () => {
  // TODO ESTUDIANTE:
  // Reemplaza este retorno local por FakeStore API.
  // Ejemplo esperado: GET https://fakestoreapi.com/products
  return [...MOCK_PRODUCTS].sort((a, b) => Number(a.id) - Number(b.id));
};

export const getProductById = async (id) => {
  // TODO ESTUDIANTE:
  // Reemplaza esta busqueda local por FakeStore API.
  // Ejemplo esperado: GET https://fakestoreapi.com/products/{id}
  const product = MOCK_PRODUCTS.find(
    (item) => Number(item.id) === Number(id),
  );
  return product ?? null;
};
