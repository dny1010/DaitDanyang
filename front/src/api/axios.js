// src/api/axios.js
import axios from "axios";

const API = "http://localhost:5000/api/chat";  // Flask 엔드포인트

export const sendMessage = async (message) => {
  const res = await axios.post(API, { message });
  return res.data;   // { reply: "..."} 형태가 돌아옴
};
