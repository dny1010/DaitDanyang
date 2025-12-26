import React from "react";

/**
 * [Base Version] MainPage Component
 * - 2025-12-24: 1920px/1200px 레이아웃 규격 복구 및 메인 섹션 구성.
 */
function MainPage() {
  const bestItems = Array.from({ length: 5 }, (_, i) => ({ id: i + 1, title: `BEST 상품 ${i + 1}` }));

  return (
    <div className="main-page">
      <div className="main-page-inner">
        {/* 상단 슬라이더 */}
        <section className="slider-container">
          <h2>Main Slider (1200px)</h2>
        </section>

        {/* 베스트 상품 그리드 */}
        <section className="product-grid-container" style={{ marginTop: '40px' }}>
          <h3>BEST ITEMS</h3>
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
            {bestItems.map(item => (
              <div key={item.id} className="product-card">
                <div className="product-image-placeholder">IMG</div>
                <p>{item.title}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default MainPage;

/* =========================================================================
 *  2025-12-24: 수정 및 추가 내역 (Team History)
 * -------------------------------------------------------------------------
 * - 작성자: danayang3
 * - 내용: 메인 페이지 기본 레이아웃 복구. 
 * - 상세: App.css에 정의된 전역 규격(1200px 중앙 정렬)을 사용하도록 구조화함.
 * ========================================================================= */
