import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './OrderComplete.module.css';

const OrderComplete = ({ orderNumber = "12345", orderItems = [] }) => {
  const navigate = useNavigate();
  const totalAmount = orderItems.reduce((acc, item) => 
    acc + item.price * item.quantity, 0
  );

  const pickupTime = new Date(Date.now() + 20 * 60000);
  const formattedPickupTime = pickupTime.toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });

  return (
    <div className={styles.container}>
      <div className={styles.orderComplete}>
        <div className={styles.successSection}>
          <div className={styles.checkmarkWrapper}>
            <div className={styles.checkmark}>✓</div>
          </div>
          <h1>주문 성공!</h1>
          <p className={styles.orderNumberText}>
            주문번호 <span className={styles.highlight}>#{orderNumber}</span>
          </p>
          <div className={styles.estimateTime}>
            <span className={styles.clockIcon}>⏰</span>
            <span>픽업 예상 시간: {formattedPickupTime}</span>
          </div>
        </div>

        <div className={styles.orderSummary}>
          <h2>주문 요약</h2>
          <div className={styles.itemsList}>
            {orderItems.map((item, index) => (
              <div key={index} className={styles.itemCard}>
                <div className={styles.itemHeader}>
                  <span className={styles.itemQuantity}>{item.quantity}x</span>
                  <h3 className={styles.itemName}>{item.name}</h3>
                  <span className={styles.itemPrice}>
                    {(item.price * item.quantity).toLocaleString()}원
                  </span>
                </div>
                <div className={styles.itemDetails}>
                  <span className={styles.itemSize}>{item.size}</span>
                  {item.toppings && item.toppings.length > 0 && (
                    <div className={styles.toppings}>
                      {item.toppings.map((topping, idx) => (
                        <span key={idx} className={styles.toppingTag}>
                          {topping}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          <div className={styles.paymentInfo}>
            <div className={styles.subtotal}>
              <span>상품 금액</span>
              <span>{totalAmount.toLocaleString()}원</span>
            </div>
            <div className={styles.totalAmount}>
              <span>총 결제금액</span>
              <span className={styles.highlight}>
                {totalAmount.toLocaleString()}원
              </span>
            </div>
          </div>
        </div>

        <div className={styles.actions}>
          <button 
            className={styles.trackButton}
            onClick={() => navigate('/order-status')}
          >
            주문 상태 확인
          </button>
          <button 
            className={styles.homeButton}
            onClick={() => navigate('/')}
          >
            홈으로 돌아가기
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderComplete; 