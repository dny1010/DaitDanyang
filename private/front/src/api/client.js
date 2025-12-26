import axios from "axios";

// axios가 어디로 요청을 보낼지 정하는 설정
const client = axios.create({
  // CRA 환경에서는 import.meta.env 대신 process.env.REACT_APP_... 사용
  // .env 파일에 REACT_APP_API_BASE_URL이 있으면 그 값을 쓰고,
  // 없으면 기본값으로 http://127.0.0.1:5000 사용
  baseURL: process.env.REACT_APP_API_BASE_URL || "http://127.0.0.1:5000",

  // withCredentials는 axios 요청에 쿠키/인증정보를 같이 보내도 된다고
  // 브라우저에 허용하는 옵션
  // 쿠키 기반으로 상품정보/로그인 상태 등을 저장해야 하는 경우 true
  withCredentials: false,

  // 요청이 10초 넘으면 끊어버림 (무한 대기 방지)
  timeout: 10000,
});

/**
 * ✅ 요청 인터셉터
 * 요청 보내기 "직전"에 공통 작업
 * 예) 토큰이 있으면 Authorization 헤더 붙이기
 */
client.interceptors.request.use(
  (config) => {
    // localStorage: 브라우저에 값 저장하는 공간 (새로고침/재시작해도 유지)
    const token = localStorage.getItem("accessToken");

    if (token) {
      // Bearer 방식: "이 토큰은 Bearer 인증 방식이다"라는 관례적인 표현
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * ✅ 응답 인터셉터
 * 응답 받기 "직후"에 공통 처리
 * 예) 에러 메시지를 공통 포맷으로 정리해서 던지기
 */
client.interceptors.response.use(
  (response) => response,
  (error) => {
    // 서버가 응답을 준 에러(400/401/500 등)
    if (error.response) {
      const { status, data } = error.response;

      return Promise.reject({
        status,
        message: data?.message || "요청 처리 중 오류가 발생했습니다.",
        data,
      });
    }

    // 서버 응답 자체가 없던 에러(네트워크/서버 다운/CORS 등)
    return Promise.reject({
      status: null,
      message: "네트워크 오류 또는 서버 응답 없음",
      data: null,
    });
  }
);

export default client;
