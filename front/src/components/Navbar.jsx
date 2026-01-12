import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Navbar.module.css";

// ✅ me 조회 API (너희 프로젝트 경로에 맞춰 import만 조정해줘)
import { fetchMe } from "../api/authApi"; // 예: "../api/postApi" 또는 "../api/authApi"

function Navbar() {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // ✅ 토큰 상태(초기값은 localStorage에서)
  const [token, setToken] = useState(() => localStorage.getItem("accessToken"));

  // ✅ ADMIN 여부
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const t = localStorage.getItem("accessToken");
    setToken(t);

    // 토큰 없으면 admin도 무조건 false
    if (!t) {
      setIsAdmin(false);
      return;
    }

    // 토큰 있으면 내 정보 조회해서 role 확인
    (async () => {
      try {
        const me = await fetchMe(); // ✅ { role: "ADMIN" | "USER", ... } 기대
        setIsAdmin(me?.role === "admin");
      } catch (err) {
        // 토큰이 만료/오류면 admin false 처리 (필요하면 여기서 로그아웃 처리도 가능)
        setIsAdmin(false);
      }
    })();
  }, []);

  const handleSearch = () => {
    console.log("검색어:", searchTerm);
    // navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    setToken(null);
    setIsAdmin(false); // ✅ 로그아웃하면 admin도 초기화
    navigate("/login");
  };

  return (
    <header className={styles.headerWrap}>
      <div className={styles.navbar}>
        {/* ===== 상단 영역 ===== */}
        <div className={styles.topRow}>
          {/* 로고 */}
          <Link to="/" className={styles.logoBox}>
            <img
              src="/images/daitdanyang-logo.png"
              alt="대잇다냥 로고"
              className={styles.logoImage}
            />
          </Link>

          {/* 검색 */}
          <div className={styles.searchBox}>
            <input
              type="text"
              placeholder="검색"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
            <button onClick={handleSearch} className={styles.searchButton}>
              검색
            </button>
          </div>

          {/* ✅ 로그인 영역 */}
          <div className={styles.memberBox}>
            {token ? (
              <>
                <Link to="/mypage">마이페이지</Link>
                <Link to="/cart">장바구니</Link>

                {/* ✅ ADMIN 전용 버튼/링크 (원하는 곳에 배치 가능) */}
                {isAdmin && <Link to="/AdminPostForm">관리자</Link>}

                <button type="button" onClick={handleLogout}>
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <Link to="/login">로그인</Link>
                <Link to="/signup">회원가입</Link>
              </>
            )}
          </div>
        </div>

        {/* ===== 하단 카테고리 ===== */}
        <nav className={styles.categoryRow}>
          <ul className={styles.navbarLinks}>
            <li>
              <Link to="/category/dog">강아지</Link>
            </li>
            <li>
              <Link to="/category/cat">고양이</Link>
            </li>

            <li className={styles.divider}></li>

            <li>
              <Link to="/events">EVENT</Link>
            </li>
            <li>
              <Link to="/view">최근 본 상품</Link>
            </li>
            <li>
              <Link to="/Noticeboard">입점문의</Link>
            </li>
            <li>
              <Link to="/support">고객센터</Link>
            </li>

            
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
