import React from 'react';

/**
 * [Base Version] Footer Component
 */
function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-col">
          <div className="footer-title">COMPANY INFO</div>
          <div className="footer-line">회사명: (주)다잇다냥 | 대표자: danayang3</div>
        </div>
        <div className="footer-col">
          <div className="footer-title">SOCIAL</div>
          <div className="social-icons">
            <span>📸 Instagram</span> <span>📺 YouTube</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

/* =========================================================================
 *  2025-12-24: 수정 및 추가 내역 (Team History)
 * -------------------------------------------------------------------------
 * - 작성자: danayang3
 * - 내용: 전역 공통 Footer 복구. 1200px 규격 및 소셜 섹션 포함.
 * ========================================================================= */
