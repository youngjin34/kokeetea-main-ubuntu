import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import style from "./MyPage.module.css";
import axios from "axios";

const MyPage = () => {
  const [membershipInfo, setMembershipInfo] = useState({
    grade: "",
    couponCount: 0,
    stampCount: 0,
  });
  const [isAdmin, setIsAdmin] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    // 컴포넌트 마운트 시 인증 상태와 권한 확인
    const token = localStorage.getItem("token");
    const authority = localStorage.getItem("authority");
    
    if (!token) {
      navigate("/login");
      return;
    }

    setIsAdmin(authority === "ADMIN");
    window.scrollTo(0, 0);
    
    if (authority !== "ADMIN") {
      fetchMembershipInfo();
    }
  }, [navigate]);

  const fetchMembershipInfo = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("토큰이 없습니다.");
        navigate("/login");
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      // 멤버십 정보 가져오기
      const membershipResponse = await axios.get(
        "http://localhost:8080/api/members/about/membership",
        { headers }
      );

      // 쿠폰/스탬프 정보 가져오기
      const couponResponse = await axios.get(
        "http://localhost:8080/api/members/about/gaeggul",
        { headers }
      );

      if (membershipResponse.status !== 200 || couponResponse.status !== 200) {
        throw new Error("데이터를 불러오는데 실패했습니다.");
      }

      const membershipData = membershipResponse.data;
      const couponData = couponResponse.data;

      // 등급 계산 로직 추가
      const calculateMembershipLevel = (totalAmount) => {
        if (totalAmount >= 400000) return "DIAMOND";
        if (totalAmount >= 300000) return "RED";
        if (totalAmount >= 200000) return "GOLD";
        return "SILVER";
      };

      const currentLevel = calculateMembershipLevel(
        membershipData.total_payment_amount
      );

      setMembershipInfo({
        grade: currentLevel, // 계산된 등급 사용
        couponCount: couponData.coupons?.length || 0,
        stampCount: couponData.stamp || 0,
      });
    } catch (error) {
      console.error("멤버십 정보를 불러오는데 실패했습니다:", error);
      setMembershipInfo({
        grade: "SILVER", // 기본 등급을 SILVER로 설정
        couponCount: 0,
        stampCount: 0,
      });
    }
  };

  const userInfo = {
    name: localStorage.getItem("realname") || "고객",
    email: localStorage.getItem("email") || "example@email.com",
  };

  return (
    <div className={style.container}>
      <div className={style.content}>
        <h1 className={style.title}>{isAdmin ? "관리자 페이지" : "마이 페이지"}</h1>

        {!isAdmin && (
          <>
            <div className={style.summarySection}>
              <div className={style.summaryItem}>
                <span className={style.label}>멤버십 등급</span>
                <span className={style.value}>{membershipInfo.grade || "-"}</span>
              </div>
              <div className={style.divider}></div>
              <div className={style.summaryItem}>
                <span className={style.label}>보유 쿠폰</span>
                <span className={style.value}>{membershipInfo.couponCount}장</span>
              </div>
              <div className={style.divider}></div>
              <div className={style.summaryItem}>
                <span className={style.label}>적립 스탬프</span>
                <span className={style.value}>{membershipInfo.stampCount}개</span>
              </div>
            </div>

            <div className={`${style.menuGrid} ${style.userGrid}`}>
              <Link to="/memberinfoupdate" className={style.menuItem}>
                <div className={style.iconWrapper}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
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

              <Link to="/couponstamp" className={style.menuItem}>
                <div className={style.iconWrapper}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
                <h3>멤버십 · 쿠폰 조회</h3>
                <p>보유한 멤버십과 쿠폰을 조회할 수 있는 공간입니다.</p>
              </Link>

              <Link to="/orderhistory" className={style.menuItem}>
                <div className={style.iconWrapper}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
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
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M3 18v-6a9 9 0 0 1 18 0v6"></path>
                    <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path>
                  </svg>
                </div>
                <h3>1:1 문의 내역</h3>
                <p>고객님의 문의 내역을 확인할 수 있는 공간입니다.</p>
              </Link>

              <Link to="/mymenu" className={style.menuItem}>
                <div className={style.iconWrapper}>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2"
                  >
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                </div>
                <h3>나만의 메뉴</h3>
                <p>
                  자주 마시는 음료를 저장하고 편리하게 주문할 수 있는 공간입니다.
                </p>
              </Link>
            </div>
          </>
        )}

        {isAdmin && (
          <div className={`${style.menuGrid} ${style.adminGrid}`}>
            <Link to="/inquiryhistory" className={style.menuItem}>
              <div className={style.iconWrapper}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M3 18v-6a9 9 0 0 1 18 0v6"></path>
                  <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path>
                </svg>
              </div>
              <h3>1:1 문의 관리</h3>
              <p>고객님들의 문의 내역을 관리할 수 있는 공간입니다.</p>
            </Link>

            <Link to="/notice/write" className={style.menuItem}>
              <div className={style.iconWrapper}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
              </div>
              <h3>공지사항 작성</h3>
              <p>새로운 공지사항을 작성할 수 있는 공간입니다.</p>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPage;
