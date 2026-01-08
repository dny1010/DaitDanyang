// src/api/ordersApi.js
import client from "./client";

/**
 * 주문목록 조회
 * GET /api/orders?status=...&from=...&to=...
 *
 * @param {Object} params
 * @param {string} params.status - ALL | PAID | READY | SHIPPING | DELIVERED | CANCELLED | RETURNED
 * @param {string} params.from - YYYY-MM-DD
 * @param {string} params.to - YYYY-MM-DD
 */
export async function getOrders() {
  const res = await client.get("/api/orders");
  return res.data;
}
