import React, { useState } from "react";
import styles from "./CustomerCenterPage.module.css";
import TopInfoBar from "../components/CustomerCenter/TopInfoBar";
import CategoryTabs from "../components/CustomerCenter/CategoryTabs";
import BoardSection from "../components/CustomerCenter/BoardSection";

/**
 * CustomerCenterPage
 * - Composed of TopInfoBar, CategoryTabs, and BoardSection components.
 */

export default function CustomerCenterPage() {
  const [activeCategory, setActiveCategory] = useState("배송");

  // Categories
  const categories = ["배송", "결제", "제품", "사이트이용"];

  // Dummy Data (In real app, fetch from API)
  const allPosts = Array.from({ length: 40 }, (_, i) => {
    const catIndex = i % 4;
    const catName = categories[catIndex];
    return {
      id: i + 1,
      category: catName,
      title: `[${catName}] 관련 문의사항입니다. ${i + 1}`,
      date: "2025-12-26",
      author: `User${i + 1}`
    };
  });

  return (
    <div className={styles.page}>
      <div className={styles.pageInner}>
        {/* Gap below Navbar */}
        <div className={styles.topSpacer} />

        {/* 1. Top Info Bar */}
        <TopInfoBar />

        {/* 2. Category Tabs */}
        <CategoryTabs 
          categories={categories} 
          activeCategory={activeCategory} 
          onSelect={setActiveCategory} 
        />

        {/* 3. Board Section (Search & List) */}
        <BoardSection 
          activeCategory={activeCategory} 
          allPosts={allPosts} 
        />

        <div className={styles.bottomSpacer} />
      </div>
    </div>
  );
}
// (하단 로그 주석 유지)