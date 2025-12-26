import client from "./client";

/**
 * 로그인
 * - email/password를 서버로 보내고
 * - 서버가 accessToken 같은 걸 주면 저장
 */
export async function login({ email, password }) {
  const res = await client.post("/auth/login", { email, password });
  // res.data = 서버가 준 JSON

  // 예시: 서버가 { accessToken: "...", user: {...} } 준다고 가정
  const accessToken = res.data?.accessToken;
  if (accessToken) localStorage.setItem("accessToken", accessToken);

  return res.data;
}

/**
 * 로그아웃(프론트 기준)
 * - 토큰 지우기
 */
export function logout() {
  localStorage.removeItem("accessToken");
}
