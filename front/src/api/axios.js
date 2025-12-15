// front/src/api/axios.js
import axios from "axios";

// 개발 단계 기준 백엔드 주소
const API_BASE_URL = "http://localhost:5000";

export const sendMessage = async (message) => {
  const response = await axios.post(
    `${API_BASE_URL}/api/chat`,
    { message }
  );

  return response.data; // { reply: "..." }
};
