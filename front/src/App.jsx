
import React, { useState } from "react";
import Navbar from './components/Navbar';
import PostForm from './components/PostForm';
import Category from './components/Category';

import './App.css'; // 기존 App.css를 유지하여 전체적인 스타일링 가능
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { Route, Routes } from "react-router-dom";


function MainLayout() {

  const products = [];

  return (
    <div className="MainLayout">
      <Navbar />
      <Routes>
        <Route path="/category/:pet/:sub?" element={<Category items={products} />} />
        <Route path="/form" element={<PostForm />} />
      </Routes>
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
    </div>
  );
}

export default App;
