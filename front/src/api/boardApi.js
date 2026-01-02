// src/api/boardApi.js
import client from "./client";

// page/perPage 파라미터는 나중에 페이지 버튼 만들 때 그대로 씀
export function fetchBoard(page = 1, perPage = 10) {
  return client.get("/api/board/", {
    params: { page, per_page: perPage },
  });
}