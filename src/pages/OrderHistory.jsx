import React, { useState, useEffect } from "react";
import style from "./OrderHistory.module.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const OrderHistory = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [period, setPeriod] = useState("1개월");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const currentPath = window.location.pathname;
  const [orders, setOrders] = useState([]);

  const filterOrdersByPeriod = (orders, selectedPeriod, start, end) => {
    // 날짜 입력으로 필터링하는 경우
    if (start && end) {
      const startDateTime = new Date(start);
      const endDateTime = new Date(end);
      endDateTime.setHours(23, 59, 59);

      return orders.filter(order => {
        const orderDate = new Date(order.date.replace(/\./g, '-'));
        return orderDate >= startDateTime && orderDate <= endDateTime;
      });
    }

    // 기간별 필터링 로직
    const today = new Date();
    let filterDate = new Date();
    
    switch (selectedPeriod) {
      case "1개월":
        filterDate.setMonth(today.getMonth() - 1);
        break;
      case "3개월":
        filterDate.setMonth(today.getMonth() - 3);
        break;
      case "1년":
        filterDate.setFullYear(today.getFullYear() - 1);
        break;
      default:
        return orders;
    }

    return orders.filter(order => {
      const orderDate = new Date(order.date.replace(/\./g, '-'));
      return orderDate >= filterDate && orderDate <= today;
    });
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/orders/${currentUser?.id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${currentUser?.token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('주문 내역을 불러오는데 실패했습니다.');
      }

      const data = await response.json();
      const filteredOrders = filterOrdersByPeriod(data, period, startDate, endDate);
      setOrders(filteredOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      alert('주문 내역을 불러오는데 실패했습니다.');
    }
  };

  useEffect(() => {
    if (currentUser?.id) {
      fetchOrders();
    }
  }, [period, startDate, endDate, currentUser]);

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleDateSearch = () => {
    if (!startDate || !endDate) {
      alert("시작일과 종료일을 모두 선택해주세요.");
      return;
    }
    if (new Date(startDate) > new Date(endDate)) {
      alert("시작일이 종료일보다 늦을 수 없습니다.");
      return;
    }
    fetchOrders();
  };

  const handlePeriodClick = (newPeriod) => {
    setPeriod(newPeriod);
    setStartDate("");
    setEndDate("");
  };

  const handleDateInput = (e, type) => {
    if (type === 'start') {
      setStartDate(e.target.value);
    } else {
      setEndDate(e.target.value);
    }
    setPeriod("");
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
                  onClick={() => handlePeriodClick(p)}
                >
                  {p}
                </button>
              ))}
              <span style={{marginLeft: '70px'}}>일자별</span>
              <input 
                type="date" 
                className={style.dateInput} 
                value={startDate}
                onChange={(e) => handleDateInput(e, 'start')}
              /> -
              <input 
                type="date" 
                className={style.dateInput} 
                value={endDate}
                onChange={(e) => handleDateInput(e, 'end')}
              />
              <button 
                className={style.searchButton}
                onClick={handleDateSearch}
              >
                조회
              </button>
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
