import React from "react";
import styles from "./EventPage.module.css";

/**
 * EventPage
 * - Layout based on provided wireframe specifications.
 * - Header and Footer are provided by MainLayout (App.jsx).
 */

export default function EventPage() {
  const items = Array.from({ length: 8 }, (_, i) => ({
    id: i + 1,
    title: `Event ${i + 1}`,
  }));

  return (
    <div className={styles.page}>
      <div className={styles.pageInner}>
        {/* Wireframe GAP_190: Navbar is above this page, so this adds spacing below Navbar */}
        <div className={styles.topSpacer} />
        
        <Banner title="진행중 / 종료 이벤트" />
        
        {/* GAP_80 is handled by banner's margin-bottom in CSS */}
        
        <EventGrid items={items} />
        
        <div className={styles.bottomSpacer} />
      </div>
    </div>
  );
}

function Banner({ title }) {
  return (
    <section className={styles.banner}>
      <div className={styles.bannerInner}>
        <div className={styles.bannerTitle}>{title}</div>
      </div>
    </section>
  );
}

// ==============================================================================
// [Gemini 작업 로그] - 2025.12.26
// 1. UI 구현: 와이어프레임(WIDTH 1600) 기반 이벤트 페이지 레이아웃 적용.
// 2. 통합: MainLayout의 공통 Navbar/Footer를 사용하도록 기존 중복 헤더 제거.
// 3. 구성: 상단 Banner 섹션 및 2열 그리드(EventGrid) 상품 배치.
// ==============================================================================
function EventGrid({ items }) {
  return (
    <section className={styles.gridSection}>
      <div className={styles.grid}>
        {items.map((item) => (
          <div key={item.id} className={styles.card}>
            {item.title}
          </div>
        ))}
      </div>
    </section>
  );
}
