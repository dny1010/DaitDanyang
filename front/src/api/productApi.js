import client from "./client";

export async function fetchProducts(params = {}) {
  const res = await client.get("/api/product", { params });
  return res.data;
}

export async function fetchProductDetail(productId) {
  const res = await client.get(`/api/product/${productId}`);
  return res.data;
}
