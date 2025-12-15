
import React, { useState } from "react";
import Navbar from './components/Navbar';
import PostForm from './components/PostForm';
import { sendMessage } from "./api/axios";
import './App.css'; // 기존 App.css를 유지하여 전체적인 스타일링 가능

function App() {
  const [isLogin, setIsLogin] = useState(false);
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

  if (!isLogin) return <Login onLogin={() => setIsLogin(true)} />;


  return (
    <div className="App">
      <Navbar />
      <PostForm />
    </div>
  );
}

export default App;
