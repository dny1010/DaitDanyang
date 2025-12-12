// src/App.js
import React, { useState } from "react";
import { sendMessage } from "./api/axios";  // <- 상대 경로 주의

function App() {
  const [input, setInput] = useState("");
  const [reply, setReply] = useState("");

  const handleSend = async () => {
    try {
      const data = await sendMessage(input);
      setReply(data.reply);   // 서버에서 온 reply 표시
    } catch (err) {
      console.error(err);
      setReply("요청 중 에러가 발생했습니다.");
    }
  };

  return (
    <div>
      <h1>Flask 연동 테스트</h1>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="메시지를 입력하세요"
      />
      <button onClick={handleSend}>보내기</button>
      <p>서버 응답: {reply}</p>
    </div>
  );
}

export default App;
