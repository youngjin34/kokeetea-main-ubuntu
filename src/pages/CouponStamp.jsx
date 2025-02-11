import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import style from "./CouponStamp.module.css";
import axios from "axios";

const levelData = [
  { level: "silver", text: "Silver" },
  { level: "gold", text: "Gold" },
  { level: "red", text: "Red" },
  { level: "diamond", text: "Diamond" },
];

const ProgressBar = ({ progress }) => {
  return (
    <div className={style.progressBar}>
      <div 
        className={style.progressFill} 
        style={{ width: `${progress}%` }}
      />
      <div className={style.levelMarkers}>
        {levelData.map((level) => (
          <span
            key={level.level}
            className={`${style.levelMarker} ${style[level.level]}`}
          >
            {level.text}
          </span>
        ))}
      </div>
    </div>
  );
};

const CouponStamp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  const [userData, setUserData] = useState({
    realName: '',
    memberLevel: '',
    nextLevelAmount: 0,
    nextLevel: '',
    points: 0,
    orderCount: 0,
    totalOrderAmount: 0,
    stamps: 0,
    coupons: []
  });

  const handleNavigation = (path) => {
    navigate(path);
  };

  const renderStamps = () => {
    const totalStamps = 10;
    return Array(totalStamps)
      .fill(null)
      .map((_, index) => (
        <div
          key={index}
          className={`${style.stamp} ${index < userData.stamps ? style.active : ""}`}
        >
          {index < userData.stamps ? (
            <img src="/public/img/coupon.png" alt="Active stamp" />
          ) : (
            <img src="/public/img/coupon.png" alt="Inactive stamp" />
          )}
        </div>
      ));
  };

  const getLevelInfo = (level) => {
    switch (level.toLowerCase()) {
      case 'silver':
        return { class: style.silver, letter: 'S' };
      case 'gold':
        return { class: style.gold, letter: 'G' };
      case 'red':
        return { class: style.red, letter: 'R' };
      case 'diamond':
        return { class: style.diamond, letter: 'D' };
      default:
        return { class: style.silver, letter: 'S' };
    }
  };

  const levelInfo = getLevelInfo(userData.memberLevel);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        console.error("토큰이 없습니다");
        navigate('/login');
        return;
      }

      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };

      // 멤버십 정보 가져오기
      const membershipResponse = await axios.get(
        'http://localhost:8080/api/members/about/membership',
        config
      );

      // 쿠폰/스탬프 정보 가져오기
      const couponResponse = await axios.get(
        'http://localhost:8080/api/members/about/gaeggul',
        config
      );

      // 멤버 정보 가져오기
      const memberResponse = await axios.get(
        'http://localhost:8080/api/members/about',
        config
      );

      // 포인트 정보 가져오기
      const pointResponse = await axios.get(
        'http://localhost:8080/api/members/current-point',
        config
      );

      const membershipData = membershipResponse.data;
      const couponData = couponResponse.data;
      const memberData = memberResponse.data;
      const pointData = pointResponse.data;

      const getNextLevelInfo = (currentLevel, totalAmount) => {
        const levels = {
          'SILVER': { next: 'GOLD', required: 200000 },
          'GOLD': { next: 'RED', required: 300000 },
          'RED': { next: 'DIAMOND', required: 400000 },
          'DIAMOND': { next: 'DIAMOND', required: 400000 }
        };

        const currentLevelInfo = levels[currentLevel.toUpperCase()];
        if (!currentLevelInfo) return { nextLevel: 'GOLD', remaining: 200000 };

        const required = currentLevelInfo.required;
        const remaining = Math.max(required - totalAmount, 0);

        return {
          nextLevel: currentLevelInfo.next,
          remaining: remaining
        };
      };

      const nextLevelInfo = getNextLevelInfo(
        membershipData.membership_name,
        membershipData.total_payment_amount
      );

      setUserData({
        realName: memberData.realName || "고객",
        memberLevel: membershipData.membership_name || "SILVER",
        nextLevelAmount: nextLevelInfo.remaining,
        nextLevel: nextLevelInfo.nextLevel,
        points: pointData.current_point || 0,
        orderCount: membershipData.total_purchase_count || 0,
        totalOrderAmount: membershipData.total_payment_amount || 0,
        stamps: couponData.stamp || 0,
        coupons: couponData.coupons || []
      });

    } catch (error) {
      console.error('사용자 정보를 불러오는데 실패했습니다:', error);
      setUserData({
        realName: '고객',
        memberLevel: 'SILVER',
        nextLevelAmount: 50000,
        nextLevel: 'GOLD',
        points: 0,
        orderCount: 0,
        totalOrderAmount: 0,
        stamps: 0,
        coupons: []
      });
    }
  };

  const calculateProgress = (totalAmount) => {
    const getLevelThreshold = (level) => {
      switch (level.toUpperCase()) {
        case 'SILVER': return 200000;
        case 'GOLD': return 300000;
        case 'RED': return 400000;
        case 'DIAMOND': return 400000;
        default: return 200000;
      }
    };

    const threshold = getLevelThreshold(userData.memberLevel);
    const progress = (totalAmount / threshold) * 100;
    return Math.min(progress, 100);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchUserData();
  }, []);

  return (
    <div className={style.container}>
      <div className={style.title}>쿠폰 · 스탬프 조회</div>
      <div className={style.content}>
        <div className={style.mainContent}>
          <div className={style.membershipInfo}>
            <div className={style.topSection}>
              <div className={style.membershipLevel}>
                <div className={`${style.levelIcon} ${levelInfo.class}`}>
                  {levelInfo.letter}
                </div>
                <div className={style.levelDetails}>
                  <div className={style.levelTitle}>
                    {userData.realName}님의 등급
                  </div>
                  <div className={style.levelName}>{userData.memberLevel.toUpperCase()}</div>
                </div>
              </div>
              <div className={style.levelProgress}>
                <div className={style.progressText}>
                  <span className={style.progressAmount}>{userData.nextLevelAmount.toLocaleString()}원</span> 추가 결제 시<br />
                  <span className={style.nextLevel}>{userData.nextLevel}</span> 등급이 될 수 있어요.
                </div>
                <ProgressBar progress={calculateProgress(userData.totalOrderAmount)} />
              </div>
            </div>
            <div className={style.membershipStats}>
              <div className={style.stat}>
                <div className={style.statLabel}>적립금</div>
                <div className={style.statValue}>{userData.points.toLocaleString()}원</div>
              </div>
              <div className={style.stat}>
                <div className={style.statLabel}>주문 횟수</div>
                <div className={style.statValue}>{userData.orderCount.toLocaleString()}회</div>
              </div>
              <div className={style.stat}>
                <div className={style.statLabel}>누적 주문 금액</div>
                <div className={style.statValue}>{userData.totalOrderAmount.toLocaleString()}원</div>
              </div>
            </div>
          </div>

          <div className={style.stampSection}>
            <h3>스탬프 <span className={style.countHighlight}>{userData.stamps}</span></h3>
            <div className={style.stampGrid}>{renderStamps()}</div>
            <div className={style.stampNote}>
              * 스탬프 10개 적립시 등급별 무료 쿠폰 증정 주문 제품 증정
            </div>
          </div>

          <div className={style.couponSection}>
            <h3>쿠폰 <span className={style.countHighlight}>{userData.coupons.length}</span></h3>
            <div className={style.couponList}>
              <table>
                <thead>
                  <tr>
                    <th>쿠폰번호</th>
                    <th>쿠폰혜택</th>
                    <th>사용기한</th>
                  </tr>
                </thead>
                <tbody>
                  {userData.coupons.map((coupon) => (
                    <tr key={coupon.id}>
                      <td>{coupon.couponNumber}</td>
                      <td>{coupon.type}</td>
                      <td>{coupon.expireDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className={style.sideNav}>
          <div
            className={`${style.sideNavItem} ${
              currentPath === "/memberinfoupdate" ? style.active : ""
            }`}
            onClick={() => handleNavigation("/memberinfoupdate")}
          >
            회원정보 확인 · 수정
          </div>
          <div
            className={`${style.sideNavItem} ${
              currentPath === "/couponstamp" ? style.active : ""
            }`}
            onClick={() => handleNavigation("/couponstamp")}
          >
            쿠폰 · 스탬프 조회
          </div>
          <div
            className={`${style.sideNavItem} ${
              currentPath === "/orderhistory" ? style.active : ""
            }`}
            onClick={() => handleNavigation("/orderhistory")}
          >
            주문내역 조회
          </div>
          <div
            className={`${style.sideNavItem} ${
              currentPath === "/inquiryhistory" ? style.active : ""
            }`}
            onClick={() => handleNavigation("/inquiryhistory")}
          >
            1:1 문의 내역
          </div>
        </div>
      </div>
    </div>
  );
};

export default CouponStamp;
