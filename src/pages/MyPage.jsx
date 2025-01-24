import React from 'react';
import { Link } from 'react-router-dom';
import style from './MyPage.module.css';

const MyPage = () => {
  const userInfo = {
    name: localStorage.getItem("realname") || "고객",
    email: localStorage.getItem("email") || "example@email.com"
  };

  return (
    <div className={style.container}>
      <div className={style.content}>
        <h1 className={style.title}>마이 페이지</h1>
        
        <div className={style.menuGrid}>
          <Link to="/memberinfoupdate" className={style.menuItem}>
            <div className={style.iconWrapper}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
            </div>
            <h3>회원정보 확인 · 수정</h3>
            <p>회원정보를 확인하거나 수정할 수 있습니다.</p>
          </Link>

          <Link to="/mypage" className={style.menuItem}>
            <div className={style.iconWrapper}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <h3>멤버십 · 쿠폰 조회</h3>
            <p>보유한 멤버십과 쿠폰을 조회할 수 있는 공간입니다.</p>
          </Link>

          <Link to="/orderhistory" className={style.menuItem}>
            <div className={style.iconWrapper}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
            </div>
            <h3>주문내역 조회</h3>
            <p>주문한 상품의 내역을 확인할 수 있습니다.</p>
          </Link>

          <Link to="/inquiryhistory" className={style.menuItem}>
            <div className={style.iconWrapper}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 18v-6a9 9 0 0 1 18 0v6"></path>
                <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path>
              </svg>
            </div>
            <h3>1:1 문의 내역</h3>
            <p>고객님의 문의 내역을 확인할 수 있는 공간입니다.</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MyPage; 