// src/pages/Login.jsx
import { useState } from "react";
import "./Login.css";

export default function Login({ onLogin }) {
  const [userId, setUserId] = useState("");
  const [pw, setPw] = useState("");
  const [auto, setAuto] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    // TODO: 백엔드 붙일 때 여기서 API 호출
    // 지금은 화면 전환용
    if (onLogin) onLogin();
  };

  return (
    <div className="loginWrap">
      <div className="loginCard">
        {/* 상단 박스 */}
        <div className="brandBox">
          <div className="brandLogo">
            {/* public 폴더에 logo.png 넣으면 됨: front/public/logo.png */}
            <img src="/logo.png" alt="logo" />
          </div>
          <div className="brandTitle">DaitDanyang</div>
        </div>

        <h4 className="sectionLabel">로그인</h4>


        <form onSubmit={handleLogin}>
          <input
            className="input"
            placeholder="아이디"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
          <input
            className="input"
            type="password"
            placeholder="비밀번호"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
          />

          <div className="rowBetween">
            <label className="check">
              <input
                type="checkbox"
                checked={auto}
                onChange={(e) => setAuto(e.target.checked)}
              />
              자동로그인
            </label>

            <button
              type="button"
              className="linkBtn"
              onClick={() => alert("아이디 찾기 / 비밀번호 찾기")}
            >
              아이디 찾기 / 비밀번호 찾기
            </button>
          </div>

          <button type="submit" className="primaryLogin">
            로그인
          </button>
        </form>

        <hr className="line" />

        <h4 className="sectionLabel">회원가입</h4>

        <button
          className="social kakao"
          type="button"
          onClick={() => alert("카카오 로그인")}
        >
          카카오 로그인
        </button>

        <button
          className="social naver"
          type="button"
          onClick={() => alert("네이버 로그인")}
        >
          네이버 로그인
        </button>

        <button
          className="social signup"
          type="button"
          onClick={() => alert("회원가입")}
        >
          회원가입
        </button>
      </div>
    </div>
  );
}
