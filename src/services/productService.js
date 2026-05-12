//import MOCK_PRODUCTS from "../mockdata/mock_products";
const API_URL = "https://fakestoreapi.com/products";

export const getProducts = async () => {
  // TODO ESTUDIANTE:
  // Reemplaza este retorno local por FakeStore API.
  // Ejemplo esperado: GET https://fakestoreapi.com/products
  //return [...MOCK_PRODUCTS].sort((a, b) => Number(a.id) - Number(b.id));
 try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Error al obtener productos");
    return await res.json();
  } catch (err) {
    console.error("getProducts error:", err);
    return [];
  }  
};

export const getProductById = async (id) => {
  // TODO ESTUDIANTE:
  // Reemplaza esta busqueda local por FakeStore API.
  // Ejemplo esperado: GET https://fakestoreapi.com/products/{id}
  /*const product = MOCK_PRODUCTS.find(
    (item) => Number(item.id) === Number(id),
  );
  return product ?? null;*/
try {
    const res = await fetch(`${API_URL}/${id}`);
    if (!res.ok) throw new Error("Producto no encontrado");
    return await res.json();
  } catch (err) {
    console.error("getProductById error:", err);
    return null;
  }  
};
