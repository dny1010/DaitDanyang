import React, { useState } from 'react';

function Navbar() {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = () => {
    console.log('검색어:', searchTerm);
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <h1 className="navbar-logo">로고</h1>
      </div>
      
      <div className="navbar-center">
        <ul className="navbar-links">
          <li><a href="#이벤트">이벤트</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#입점문의">입점문의</a></li>
          <li><a href="#고객센터">고객센터</a></li>
          <li><a href="#게시판">게시판</a></li>
        </ul>
      </div>

      <div className="navbar-right">
        <input
          type="text"
          placeholder="검색"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <button onClick={handleSearch} className="search-button">
          검색
        </button>
      </div>
    </nav>
  );
}

export default Navbar;