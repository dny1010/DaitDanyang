import React from "react";
import styles from "./EventPage.module.css";
import EventBanner3D from "../components/EventBanner3D";
import EventGrid from "../components/Event/EventGrid";

/**
 * EventPage
 * - Composed of EventBanner3D and EventGrid components.
 */

export default function EventPage() {
  const items = Array.from({ length: 8 }, (_, i) => ({
    id: i + 1,
    title: `특별한 이벤트 ${i + 1}`,
    date: "2025.12.01 - 2025.12.31",
  }));

  return (
    <div className={styles.page}>
      <div className={styles.pageInner}>
        <div className={styles.topSpacer} />
        
        {/* 3D Banner */}
        <EventBanner3D />
        
        <div style={{ height: '80px' }}></div>
        
        {/* Grid List */}
        <EventGrid items={items} />
        
        <div className={styles.bottomSpacer} />
      </div>
    </div>
  );
}
// (하단 Grid 함수 삭제)
