import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Navbar.module.css";

function Navbar() {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // ✅ 토큰 상태(초기값은 localStorage에서)
  const [token, setToken] = useState(() => localStorage.getItem("accessToken"));

  // ✅ (중요) 로그인/로그아웃이 다른 컴포넌트에서 일어나도 Navbar가 갱신되게
  // 같은 탭에서는 storage 이벤트가 안 뜨는 경우가 많아서,
  // 가장 단순한 방법은 "로그인/로그아웃 시 navigate"로 화면 이동하면서 Navbar가 재렌더되는 구조를 쓰거나,
  // 아래처럼 한 번 mount 때만 읽는 방식으로 시작해도 됨.
  useEffect(() => {
    setToken(localStorage.getItem("accessToken"));
  }, []);

  const handleSearch = () => {
    // 원하면 검색 페이지로 이동
    console.log("검색어:", searchTerm);
    // navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    setToken(null);
    navigate("/login");
  };

  return (
    <header className={styles.headerWrap}>
      <div className={styles.navbar}>
        {/* ===== 상단 영역 ===== */}
        <div className={styles.topRow}>
          {/* 로고 (홈으로 이동 권장) */}
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

          {/* ✅ 로그인 영역 (토큰 유무로 분기) */}
          <div className={styles.memberBox}>
            {token ? (
              <>
                <Link to="/mypage">마이페이지</Link> 
                <Link to="/cart">장바구니</Link> 
                <button
                  type="button"
                  onClick={handleLogout}
                  
                >로그아웃
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
            <li><Link to="/category/dog">강아지</Link></li>
            <li><Link to="/category/cat">고양이</Link></li>
           
            <li className={styles.divider}>|</li>
            <li><Link to="/events">EVENT</Link></li>
            <li><Link to="/about">ABOUT</Link></li>
            <li><Link to="/contact">입점문의</Link></li>
            <li><Link to="/support">고객센터</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
