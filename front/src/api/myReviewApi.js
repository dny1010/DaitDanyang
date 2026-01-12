// src/api/myReviewApi.js
import client from "./client";

export async function getMyReviews({page, limit, sort}) {
  const res = await client.get("/api/me/reviews", { params: { page, limit, sort }});
  return res.data;
}
