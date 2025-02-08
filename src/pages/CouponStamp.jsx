import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import style from "./CouponStamp.module.css";

const levelData = [
  { level: "silver", text: "Silver" },
  { level: "gold", text: "Gold" },
  { level: "red", text: "Red" },
  { level: "diamond", text: "Diamond" },
];

const ProgressBar = ({ progress }) => {
  return (
    <div className={style.progressBar}>
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
  const [activeTab, setActiveTab] = useState("membership");
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
  const [coupons, setCoupons] = useState([]);
  const [stamps, setStamps] = useState(0);

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

  const fetchCouponStampData = async () => {
    try {
      const response = await fetch('http://localhost:8080/kokee/coupon_stamp', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('쿠폰/스탬프 정보를 불러오는데 실패했습니다.');
      }
      
      const data = await response.json();
      setCoupons(data.coupons);
      setStamps(data.stamps);
    } catch (error) {
      console.error('쿠폰/스탬프 데이터 로딩 실패:', error);
    }
  };

  const calculateProgress = (totalAmount) => {
    const silverToGold = 50000;
    const goldToRed = 100000;
    const redToDiamond = 200000;

    const progress = (totalAmount / userData.nextLevelAmount) * 100;
    return Math.min(progress, 100);
  };

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      const email = localStorage.getItem("email");

      const response = await fetch(
        `http://localhost:8080/kokee/get_member/${email}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("사용자 정보를 불러오는데 실패했습니다");
      }

      const userData = await response.json();
      
      setUserData({
        realName: userData.realName || "고객",
        memberLevel: userData.memberLevel || "silver",
        nextLevelAmount: userData.nextLevelAmount || 0,
        nextLevel: userData.nextLevel || "GOLD",
        points: userData.points || 0,
        orderCount: userData.orderCount || 0,
        totalOrderAmount: userData.totalOrderAmount || 0,
        stamps: userData.stamps || 0,
        coupons: userData.coupons || []
      });

    } catch (error) {
      console.error('사용자 정보를 불러오는데 실패했습니다:', error);
      // 기본 값 설정
      setUserData({
        realName: '고객',
        memberLevel: 'silver',
        nextLevelAmount: 0,
        nextLevel: 'GOLD',
        points: 0,
        orderCount: 0,
        totalOrderAmount: 0,
        stamps: 0,
        coupons: []
      });
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchUserData();
  }, []);

  useEffect(() => {
    fetchCouponStampData();
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
                <div className={style.statValue}>{userData.orderCount}회</div>
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
