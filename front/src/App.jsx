
import React, { useState } from "react";
import Navbar from './components/Navbar';
import PostForm from './components/PostForm';
import Category from './components/Category';
import { sendMessage } from "./api/axios";
import './App.css'; // 기존 App.css를 유지하여 전체적인 스타일링 가능
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { Route, Routes } from "react-router-dom";


function MainLayout() {
  return (
    <div className="MainLayout">
      <Navbar />
      <PostForm />
      <Routes>
        {/* <Route path="/category/:pet/:sub?" element={<Category items={products} />} /> */}
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
      <Route path="/main" element={<MainLayout />} />

      <Route path="*" element={<div>페이지를 찾을 수 없습니다.</div>} />
    </Routes>
    </div>
  );
}

export default App;
