// src/pages/Login.jsx
import { useState } from "react";
import styles from "./Login.module.css";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";


export default function Login() {
  const [userId, setUserId] = useState("");
  const [pw, setPw] = useState("");
  const [auto, setAuto] = useState(false);
  const navigate = useNavigate();


  const handleLogin = async (e) => {
  e.preventDefault();
//e.preventDefault() ← 이거 왜 필요? “폼 제출하고 아이디/비번 틀려도 그대로 입력창에 남아있음 / 이거 쓰는 이유는 새로고침 하지말라는 말” 
  
// const handleLogout = () => {
//   localStorage.removeItem("access_token");
//   localStorage.removeItem("refresh_token");

//   // 로그인 페이지로 이동
//   navigate("/login");
// };
  try {
    const res = await axios.post(
      "http://localhost:5000/api/login",
      {
        userId,
        password: pw,
      }
    );

    console.log(res.data);

    // 성공 시만 이동
    navigate("/");
  } catch (err) {
    alert("로그인 실패");
  }
};


  return (
    <div className={`${styles.lpoginWrap} d-flex min-vh-100 align-items-center justify-content-center py-4`}>
      {/* card + shadow + rounded는 부트스트랩, 크기/배경/보더는 Login.css에서 */}
      <div className={`${styles.loginCard} card shadow rounded-4 p-4`}>
        {/* 상단 브랜드 박스(기존 디자인 유지) */}
        <div
          className={styles.brandBox}
          onClick={() => navigate("/")}
          style={{ cursor: "pointer" }}
        >
          <img
            src={`${process.env.PUBLIC_URL}/images/daitdanyang-logo.png` }
            alt="DaitDanyang"
            className={styles.brandImage}
          />
        </div>


        <h4 className={styles.login_sectionLabel}>로그인</h4>


        <form onSubmit={handleLogin}>
          <div className={styles.formInner}>
            <input
              className={`${styles.form_control} form-control mb-3`}
              placeholder="아이디"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              autoComplete="username"
            />

            <input
              className={`${styles.form_control} form-control mb-3`}
              type="password"
              placeholder="비밀번호"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              autoComplete="current-password"
            />

            {/* ✅ 자동로그인 / 아이디찾기: 부트스트랩 유틸 */}
            <div className="d-flex align-items-center justify-content-between gap-2 mb-3">
              <label className="d-flex align-items-center gap-2 m-0 small">
                <input
                  type="checkbox"
                  checked={auto}
                  onChange={(e) => setAuto(e.target.checked)}
                />
                자동로그인
              </label>

              <div className="d-flex align-items-center gap-1 small">
                <Link
                  to="/find-account"
                  className="btn btn-link p-0 text-decoration-none"
                >
                  아이디/비밀번호 찾기
                </Link>

              </div>
            </div>

            {/* ✅ 빨간 동그라미: 로그인 버튼 블록 */}
            <div className="d-grid gap-2">
              <button type="submit" className={styles.btn_login}>
                로그인
              </button>
            </div>
          </div>
        </form>

        {/* ✅ 구분선: 부트스트랩 hr */}
        <hr className="my-4" />

        <h4 className={styles.login_sectionLabel}>회원가입</h4>

        {/* ✅ 빨간 동그라미: 소셜/회원가입 버튼 블록 */}
        <div className="d-grid gap-3 mt-3">
          <button
            className={styles.btn_kakao}
            type="button"
            onClick={() => alert("카카오 로그인")}
          >
            카카오 로그인
          </button>

          <button
            className={styles.btn_naver}
            type="button"
            onClick={() => alert("네이버 로그인")}
          >
            네이버 로그인
          </button>

          <button
            className={styles.btn_signup}
            type="button"
            onClick={() => navigate("/signup")}
          >
            회원가입
          </button>
        </div>
      </div>
    </div>
  );
}
