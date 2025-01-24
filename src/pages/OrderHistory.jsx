import React, { useState } from "react";
import style from "./OrderHistory.module.css";
import { useNavigate } from "react-router-dom";

const OrderHistory = () => {
  const navigate = useNavigate();
  const [period, setPeriod] = useState("1개월");
  const currentPath = window.location.pathname;

  const [orders] = useState([
    { id: 'k00000001', date: '2025.01.19', status: '구로점', details: '브라운슈가밀크티 외 1개' },
    { id: 'k00000002', date: '2025.01.19', status: '구로점', details: '브라운슈가밀크티 외 1개' },
    { id: 'k00000003', date: '2025.01.19', status: '구로점', details: '브라운슈가밀크티 외 1개' },
    { id: 'k00000004', date: '2025.01.19', status: '구로점', details: '브라운슈가밀크티 외 1개' },
  ]);

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className={style.container}>
      <div className={style.title}>주문내역 조회</div>
      <div className={style.content}>
        <div className={style.formContainer}>
          <div className={style.orderHistory}>
            
            <div className={style.periodFilter}>
              <span>기간별</span>
              {["1개월", "3개월", "1년"].map((p) => (
                <button
                  key={p}
                  className={`${style.periodButton} ${period === p ? style.active : ''}`}
                  onClick={() => setPeriod(p)}
                >
                  {p}
                </button>
              ))}
              <span style={{marginLeft: '70px'}}>일자별</span>
              <input type="date" className={style.dateInput} /> -
              <input type="date" className={style.dateInput} />
              <button className={style.searchButton}>조회</button>
            </div>

            <table className={style.orderTable}>
              <thead>
                <tr>
                  <th>주문번호</th>
                  <th>주문일자</th>
                  <th>매장명</th>
                  <th>내역</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>{order.date}</td>
                    <td>{order.status}</td>
                    <td>{order.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className={style.sideNav}>
          <div 
            className={`${style.sideNavItem} ${currentPath === '/memberinfoupdate' ? style.active : ''}`}
            onClick={() => handleNavigation('/memberinfoupdate')}
          >
            회원정보 확인 · 수정
          </div>
          <div 
            className={`${style.sideNavItem} ${currentPath === '/couponstamp' ? style.active : ''}`}
            onClick={() => handleNavigation('/couponstamp')}
          >
            쿠폰 · 스탬프 조회
          </div>
          <div 
            className={`${style.sideNavItem} ${currentPath === '/orderhistory' ? style.active : ''}`}
            onClick={() => handleNavigation('/orderhistory')}
          >
            주문내역 조회
          </div>
          <div 
            className={`${style.sideNavItem} ${currentPath === '/inquiryhistory' ? style.active : ''}`}
            onClick={() => handleNavigation('/inquiryhistory')}
          >
            1:1 문의 내역
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;
