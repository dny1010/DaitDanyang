import React, { useState } from "react";
import Navbar from './components/Navbar';
import Footer from './components/Footer'; // 2025-12-24: 공통 푸터 임포트
import PostForm from './components/PostForm';
import Category from './components/Category';

import './App.css'; 
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import FindAccount from "./pages/FindAccount";
import CartPage from "./pages/Cart";
import OrderComplete from "./pages/OrderComplete/OrderComplete";
import Wishlist from "./components/Wishlist"; // 2025-12-26: 찜목록 컴포넌트 연결
import MainPage from "./pages/MainPage"; // 2025-12-24: 메인 페이지 복구
import EventPage from "./pages/EventPage"; // 2025-12-24: 이벤트 페이지 복구
import CustomerCenterPage from "./pages/CustomerCenterPage"; // 2025-12-24: 고객센터 페이지 복구
import { Route, Routes } from "react-router-dom";
import Product from "./components/Product";
import Chatbot from "./components/Chatbot"; // 2025-12-24: 챗봇 복구


function MainLayout() {

  const products = [];

  return (
    <div className="MainLayout">
      <Navbar />
      <Routes>
        {/* 2025-12-24: Navbar 링크 주소와 App.jsx 경로 일치화 작업 */}
        <Route path="/" element={<MainPage />} />
        
        {/* 카테고리 (단축 경로 및 전체 경로 대응) */}
        <Route path="/dog" element={<Category pet="dog" />} />
        <Route path="/cat" element={<Category pet="cat" />} />
        <Route path="/small" element={<Category pet="small" />} />
        <Route path="/category/:pet/:sub?" element={<Category />} />
        
        <Route path="/product/:id" element={<Product />} />
        <Route path="/events" element={<EventPage />} /> {/* Navbar의 /events와 매핑 */}
        <Route path="/support" element={<CustomerCenterPage />} /> {/* Navbar의 /support와 매핑 */}
        
        <Route path="/cart" element={<CartPage />} />
        <Route path="/wishlist" element={<Wishlist />} /> {/* 찜목록 */}
        <Route path="/order/complete" element={<OrderComplete />} />
        <Route path="/form" element={<PostForm />} />
        <Route path="/find-account" element={<FindAccount />} />
      </Routes>
      <Footer /> {/* 2025-12-24: 하단 공통 푸터 배치 */}
    </div>
  );
}

function App() {

  return (
    <div className="App">
      
      <Routes>
      {/* 로그인 / 회원가입 (네비바, 푸터 없음) */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* 로그인 이후 메인 페이지 */}
      <Route path="/*" element={<MainLayout />} />

      <Route path="*" element={<div>페이지를 찾을 수 없습니다.</div>} />
    </Routes>
    <Chatbot />
    </div>
  );
}

export default App;

// ==============================================================================
// [Gemini 작업 로그] - 2025.12.26
// 1. 라우팅 추가: /wishlist (찜목록/마이페이지) 경로 등록 및 컴포넌트 임포트.
// 2. 레이아웃 유지: MainLayout 내부에 배치하여 Navbar/Footer 공통 적용.
// ==============================================================================