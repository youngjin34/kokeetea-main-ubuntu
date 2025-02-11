import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./OrderComplete.module.css";

const OrderComplete = ({ orderItems = [] }) => {
  const navigate = useNavigate();

  const pickupTime = new Date(Date.now() + 5 * 60000);
  const formattedPickupTime = pickupTime.toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const orderId = localStorage.getItem("orderId");
  const branchName = localStorage.getItem("branchName");
  const finalPrice = localStorage.getItem("finalPrice");
  const totalPrice = localStorage.getItem("totalPrice");

  return (
    <div className={styles.container}>
      <div className={styles.orderComplete}>
        <div className={styles.successSection}>
          <div className={styles.checkmarkWrapper}>
            <div className={styles.checkmark}>✓</div>
          </div>
          <h1>주문 성공!</h1>
          <p className={styles.orderNumberText}>
            주문번호 <span className={styles.highlight}># {orderId}</span>
          </p>
          <p className={styles.orderNumberText}>
            지점명: <span className={styles.highlight}>{branchName}</span>
          </p>
          <div className={styles.estimateTime}>
            <span className={styles.clockIcon}>⏰</span>
            <span>픽업 예상 시간: {formattedPickupTime}</span>
          </div>
        </div>

        <div className={styles.orderSummary}>
          <div className={styles.paymentInfo}>
            <div className={styles.subtotal}>
              <span>상품 금액</span>
              <span>{totalPrice} 원</span>
            </div>
            <div className={styles.totalAmount}>
              <span>총 결제금액</span>
              <span className={styles.highlight}>{finalPrice} 원</span>
            </div>
          </div>
        </div>

        <div className={styles.actions}>
          <button className={styles.trackButton} onClick={() => navigate("/")}>
            홈으로 돌아가기
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderComplete;
