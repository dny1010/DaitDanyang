// front/src/App.js
import React, { useState } from "react";
import { sendMessage } from "./api/axios";

function App() {
  const [input, setInput] = useState("");
  const [reply, setReply] = useState("");

  const handleSend = async () => {
    if (!input.trim()) return;

    try {
      const data = await sendMessage(input);
      setReply(data.reply);
    } catch (error) {
      console.error(error);
      setReply("서버 요청 중 오류가 발생했습니다.");
    }
  };

  return (
    <div style={{ padding: "40px" }}>
      <h2>React ↔ Flask 연동 테스트</h2>

      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="메시지를 입력하세요"
        style={{ width: "300px", marginRight: "10px" }}
      />

      <button onClick={handleSend}>보내기</button>

      <p style={{ marginTop: "20px" }}>
        <strong>서버 응답:</strong> {reply}
      </p>
    </div>
  );
}

export default App;
