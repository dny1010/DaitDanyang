import React, { useState, useEffect } from "react";
import styles from "./Customer.module.css";

export default function BoardSection({ activeCategory, allPosts }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // 카테고리가 변경되면 검색어와 페이지 초기화
  useEffect(() => {
    setSearchQuery("");
    setCurrentPage(1);
  }, [activeCategory]);

  // Filter Logic
  const filteredPosts = allPosts.filter(p => {
    const matchCategory = p.category === activeCategory;
    const matchSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  // Pagination Calculation
  const totalPages = Math.ceil(filteredPosts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentPosts = filteredPosts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <>
      {/* Search Bar */}
      <div className={styles.boardSearchBar}>
        <input 
          type="text" 
          className={styles.searchInput}
          placeholder={`"${activeCategory}" 관련 검색어를 입력하세요`}
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
        />
        <button className={styles.searchBtn}>검색</button>
      </div>

      {/* Board List */}
      <section className={styles.boardWrap}>
        {/* Hidden Header for accessibility or layout if needed */}
        <div className={styles.boardHeader} style={{display:'none'}}>{activeCategory} 게시판</div>

        <div className={styles.boardBody}>
          {/* Card List Rows */}
          <div className={styles.boardTableRows}>
            {currentPosts.length > 0 ? (
              currentPosts.map((r, idx) => {
                const globalIndex = (idx + 1) + startIndex; 
                return (
                  <div key={r.id} className={styles.boardRow}>
                    <div className={styles.rowNo}>No. {globalIndex}</div>
                    <div className={styles.rowCategory}>{r.category}</div>
                    <div className={styles.rowTitle}>{r.title}</div>
                    <div className={styles.rowDate}>{r.date}</div>
                  </div>
                );
              })
            ) : (
              <div style={{ padding: "50px", textAlign: "center", color: "#999", fontSize: "1.1rem" }}>
                게시글이 없습니다.
              </div>
            )}
          </div>

          {/* Pagination Controls */}
          {totalPages > 0 && (
            <div className={styles.pagination}>
              <button 
                className={styles.pageBtn} 
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                &lt;
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  className={`${styles.pageBtn} ${currentPage === page ? styles.activePageBtn : ""}`}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </button>
              ))}
              <button 
                className={styles.pageBtn} 
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                &gt;
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

// ==============================================================================
// [Gemini 작업 로그] - 2025.12.26
// 1. 컴포넌트 분리: CustomerCenterPage에서 게시판 영역(검색 + 리스트 + 페이지네이션) 추출.
// 2. 기능 구현:
//    - 검색: 제목 기준 필터링 (searchQuery 상태 관리).
//    - 필터링: activeCategory prop에 따른 데이터 필터링.
//    - 페이지네이션: 10개 단위 데이터 슬라이싱 및 페이지 이동 로직.
// 3. UI: 
//    - 검색바 (SearchBar)
//    - 게시글 테이블 (Table Layout -> 추후 Card Layout으로 개선 예정)
//    - 페이지네이션 버튼
// ==============================================================================
