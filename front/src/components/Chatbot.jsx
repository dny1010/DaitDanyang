import React, { useState, useEffect } from 'react';
import './Chatbot.css';

const FRAME_COUNT = 97; // public/images/cat_frames에 있는 프레임 수
const FRAME_RATE = 100; // 100ms 마다 프레임 변경

const Chatbot = () => {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  // 고양이 애니메이션을 위한 useEffect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFrame(prevFrame => (prevFrame + 1) % FRAME_COUNT);
    }, FRAME_RATE);

    return () => clearInterval(interval);
  }, []);

  const handleToggleChat = () => {
    setIsOpen(!isOpen);
  };

  const frameUrl = `${process.env.PUBLIC_URL}/images/cat_frames/frame_${String(currentFrame).padStart(3, '0')}.png`;

  return (
    <div className="chatbot-container">
      {/* 챗봇 대화창 */}
      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <span>냥냥 챗봇</span>
            <button onClick={handleToggleChat} className="close-btn">X</button>
          </div>
          <div className="chat-body">
            {/* 퀵 답변 및 대화 내용이 들어갈 자리 */}
            <p>무엇을 도와드릴까요?</p>
          </div>
          <div className="chat-input-area">
            <input type="text" placeholder="메시지 입력..." />
            <button>전송</button>
          </div>
        </div>
      )}
      
      {/* 고양이 캐릭터 */}
      <div className="cat-character" onClick={handleToggleChat}>
        <img src={frameUrl} alt="Chatbot Cat" />
        {!isOpen && <div className="chat-bubble">궁금한게 있냥?</div>}
      </div>
    </div>
  );
};

export default Chatbot;
