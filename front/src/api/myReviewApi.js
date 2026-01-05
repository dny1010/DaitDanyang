// src/api/myReviewApi.js
import client from "./client";

export async function getMyReviews() {
  const res = await client.get("/api/me/reviews");
  return res.data;
}
