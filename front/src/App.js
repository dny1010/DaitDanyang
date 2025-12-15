import React from 'react';
import Navbar from './components/Navbar';
import PostForm from './components/PostForm';
import './App.css'; // 기존 App.css를 유지하여 전체적인 스타일링 가능

function App() {
  return (
    <div className="App">
      <Navbar />
      <PostForm />
    </div>
  );
}

export default App;
