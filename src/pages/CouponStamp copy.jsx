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
  const [stamps, setStamps] = useState(7); // 서버에서 받아올 스탬프 수
  const [coupons, setCoupons] = useState([
    {
      id: 1,
      couponNumber: "c00000001",
      type: "아메리카노 R 무료 증정",
      expireDate: "2025.12.31",
    },
    {
      id: 2,
      couponNumber: "c00000002",
      type: "아메리카노 R 무료 증정",
      expireDate: "2025.12.31",
    },
    {
      id: 3,
      couponNumber: "c00000003",
      type: "아메리카노 R 무료 증정",
      expireDate: "2025.12.31",
    },
    {
      id: 4,
      couponNumber: "c00000004",
      type: "아메리카노 R 무료 증정",
      expireDate: "2025.12.31",
    },
  ]);

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
          className={`${style.stamp} ${index < stamps ? style.active : ""}`}
        >
          {index < stamps ? (
            <img src="/public/img/coupon.png" alt="Active stamp" />
          ) : (
            <img src="/public/img/coupon.png" alt="Inactive stamp" />
          )}
        </div>
      ));
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className={style.container}>
      <div className={style.title}>쿠폰 · 스탬프 조회</div>
      <div className={style.content}>
        <div className={style.mainContent}>
          <div className={style.membershipInfo}>
            <div className={style.topSection}>
              <div className={style.membershipLevel}>
                <div className={style.levelIcon}>S</div>
                <div className={style.levelDetails}>
                  <div className={style.levelTitle}>홍길동님의 등급</div>
                  <div className={style.levelName}>SILVER</div>
                </div>
              </div>
              <div className={style.levelProgress}>
                <div className={style.progressText}>
                  <span className={style.progressAmount}>32,000원</span> 추가 결제 시<br />
                  <span className={style.nextLevel}>GOLD</span> 등급이 될 수 있어요.
                </div>
                <ProgressBar progress={30} />
              </div>
            </div>
            <div className={style.membershipStats}>
              <div className={style.stat}>
                <div className={style.statLabel}>적립금</div>
                <div className={style.statValue}>1,230원</div>
              </div>
              <div className={style.stat}>
                <div className={style.statLabel}>주문 횟수</div>
                <div className={style.statValue}>3회</div>
              </div>
              <div className={style.stat}>
                <div className={style.statLabel}>누적 주문 금액</div>
                <div className={style.statValue}>12,340원</div>
              </div>
            </div>
          </div>

          <div className={style.stampSection}>
            <h3>스탬프 <span className={style.countHighlight}>1</span></h3>
            <div className={style.stampGrid}>{renderStamps()}</div>
            <div className={style.stampNote}>
              * 스탬프 10개 적립시 등급별 무료 쿠폰 증정 주문 제품 증정
            </div>
          </div>

          <div className={style.couponSection}>
            <h3>쿠폰 <span className={style.countHighlight}>1</span></h3>
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
                  {coupons.map((coupon) => (
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
