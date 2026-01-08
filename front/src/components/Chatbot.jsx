import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // ✅ 라우터 훅 추가
import client from '../api/client'; 
import './Chatbot.css';

const FRAME_COUNT = 97; 
const FRAME_RATE = 100; 

const Chatbot = () => {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation(); // ✅ 현재 위치 감지
  const navigate = useNavigate(); // ✅ 페이지 이동
  
  // ✅ 채팅 상태 관리
  const [messages, setMessages] = useState([
    { text: "안녕하냥! 무엇을 도와줄까냥?", sender: "bot" }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // ✅ 퀵 버튼 상태 관리
  const [quickQuestions, setQuickQuestions] = useState([]);
  
  const messagesEndRef = useRef(null);

  // 고양이 애니메이션
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFrame(prevFrame => (prevFrame + 1) % FRAME_COUNT);
    }, FRAME_RATE);
    return () => clearInterval(interval);
  }, []);

  // 스크롤 자동 이동
  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  // ✅ 페이지 변경 시 퀵 버튼 업데이트 (RAG 연동 준비)
  useEffect(() => {
    async function loadSuggestions() {
      try {
        const res = await client.post('/api/chat/suggestions', { 
          current_path: location.pathname 
        });
        setQuickQuestions(res.data.suggestions || []);
      } catch (e) {
        console.error("퀵 버튼 로드 실패:", e);
      }
    }
    if (isOpen) {
      loadSuggestions();
    }
  }, [location.pathname, isOpen]); // 창이 열리거나 페이지가 바뀔 때 실행

  const handleToggleChat = () => {
    setIsOpen(!isOpen);
  };

  // ✅ 퀵 버튼 클릭 핸들러
  const handleQuickClick = (q) => {
    // 1. 사용자 질문 표시
    setMessages(prev => [...prev, { text: q.label, sender: "user" }]);
    
    // 2. 봇 답변 표시 (0.5초 딜레이로 자연스럽게)
    setTimeout(() => {
      setMessages(prev => [...prev, { text: q.answer, sender: "bot" }]);
      
      // 3. 링크가 있으면 이동
      if (q.link) {
        navigate(q.link);
      }
    }, 500);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMsg = inputValue;
    setInputValue(""); 

    setMessages(prev => [...prev, { text: userMsg, sender: "user" }]);
    setIsLoading(true);

    try {
      const response = await client.post('/api/chat', { message: userMsg });
      const botReply = response.data.reply;
      setMessages(prev => [...prev, { text: botReply, sender: "bot" }]);
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, { text: "오류가 발생했다냥. 다시 말해달라냥!", sender: "bot" }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const frameUrl = `${process.env.PUBLIC_URL}/images/cat_frames/frame_${String(currentFrame).padStart(3, '0')}.png`;

  return (
    <div className="chatbot-container">
      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <span>냥냥 챗봇</span>
            <button onClick={handleToggleChat} className="close-btn">X</button>
          </div>
          <div className="chat-body">
            {messages.map((msg, index) => (
              <div key={index} className={`chat-message ${msg.sender}`}>
                <div className={`message-bubble ${msg.loading ? 'loading' : ''}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="chat-message bot">
                <div className="message-bubble loading">...생각중이다냥...</div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* ✅ 퀵 버튼 영역 (입력창 바로 위) */}
          {quickQuestions.length > 0 && (
            <div className="quick-replies">
              {quickQuestions.map((q, idx) => (
                <button 
                  key={idx} 
                  className="quick-chip" 
                  onClick={() => handleQuickClick(q)}
                >
                  {q.label}
                </button>
              ))}
            </div>
          )}

          <div className="chat-input-area">
            <input 
              type="text" 
              placeholder="메시지 입력..." 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button onClick={handleSendMessage} disabled={isLoading}>전송</button>
          </div>
        </div>
      )}
      
      <div className="cat-character" onClick={handleToggleChat}>
        <img src={frameUrl} alt="Chatbot Cat" />
        {!isOpen && <div className="chat-bubble">궁금한게 있냥?</div>}
      </div>
    </div>
  );
};

export default Chatbot;

// ==============================================================================
// [Gemini 작업 로그] - 26-01-04
// 1. 상태 관리 추가: `messages`, `inputValue`, `isLoading`, `quickQuestions`.
// 2. 메시지 전송 로직 구현: Axios(`client`)를 사용하여 `/api/chat` 호출.
// 3. UI 개선: 테마 적용, 자동 스크롤, 엔터키 이벤트.
// 4. 컨텍스트 인식 퀵 버튼(Context-Aware Quick Actions):
//    - `useLocation`으로 현재 페이지 감지.
//    - `/api/chat/suggestions` 호출하여 페이지별 맞춤 질문 로드.
//    - 버튼 클릭 시 즉답 및 페이지 이동(`useNavigate`) 처리.
// ==============================================================================