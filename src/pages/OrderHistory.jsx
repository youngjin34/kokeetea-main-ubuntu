import React, { useState, useEffect } from "react";
import style from "./OrderHistory.module.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const OrderHistory = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const navigate = useNavigate();
  const [period, setPeriod] = useState("1개월");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const currentPath = window.location.pathname;
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchOrders = async (start, end) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("로그인이 필요합니다.");
      }

      const startDate = new Date(start);
      const endDate = new Date(end);
      
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        throw new Error("유효하지 않은 날짜 형식입니다.");
      }

      const response = await axios.get(
        `http://localhost:8080/api/orders/history`,
        {
          params: {
            startDate: start,
            endDate: end,
            size: 10,
            page: currentPage,
            sort: "date,desc"
          },
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data) {
        const mappedOrders = response.data.orders.map(order => ({
          ...order,
          total_amount: parseInt(order.subtotal || order.total_amount || order.total_price || 0)
        }));
        setOrders(mappedOrders);
        setTotalPages(response.data.total_page || 1);
        console.log('응답 데이터:', response.data);
      } else {
        setError("주문 내역 데이터를 불러올 수 없습니다.");
      }
    } catch (error) {
      console.error("주문 내역 조회 실패:", error);
      if (error.response?.status === 400) {
        setError("잘못된 날짜 범위입니다.");
      } else {
        setError("주문 내역을 불러오는데 실패했습니다.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePeriodClick = (newPeriod) => {
    setPeriod(newPeriod);
    setStartDate("");
    setEndDate("");
    
    const end = new Date();
    let start = new Date();
    
    switch(newPeriod) {
      case "1개월":
        start.setMonth(end.getMonth() - 1);
        break;
      case "3개월":
        start.setMonth(end.getMonth() - 3);
        break;
      case "1년":
        start.setFullYear(end.getFullYear() - 1);
        break;
      default:
        return;
    }
    
    const formatDate = (date) => {
      return date.toISOString().split('T')[0];
    };
    
    fetchOrders(formatDate(start), formatDate(end));
  };

  const handleDateSearch = () => {
    if (!startDate || !endDate) {
      alert("시작일과 종료일을 모두 선택해주세요.");
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();

    if (start > end) {
      alert("시작일이 종료일보다 늦을 수 없습니다.");
      return;
    }

    if (end > today) {
      alert("종료일은 오늘 이후로 설정할 수 없습니다.");
      return;
    }

    fetchOrders(startDate, endDate);
  };

  const handleDateInput = (e, type) => {
    if (type === 'start') {
      setStartDate(e.target.value);
    } else {
      setEndDate(e.target.value);
    }
    setPeriod("");
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    const end = new Date();
    const start = new Date();
    start.setMonth(end.getMonth() - 1);
    
    fetchOrders(
      start.toISOString().split('T')[0],
      end.toISOString().split('T')[0]
    );
  }, [currentPage]);

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

            {loading && <div className={style.loading}>로딩 중...</div>}
            {error && <div className={style.error}>{error}</div>}
            {!loading && !error && (
              <>
                <table className={style.orderTable}>
                  <thead>
                    <tr>
                      <th>주문번호</th>
                      <th>주문일자</th>
                      <th>매장명</th>
                      <th>주문내역</th>
                      <th>결제금액</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id}>
                        <td>{order.id}</td>
                        <td>{new Date(order.date).toLocaleDateString()}</td>
                        <td>{order.branch_name}</td>
                        <td>{order.first_product_name}</td>
                        <td>
                          {order.subtotal ? 
                            parseInt(order.subtotal).toLocaleString() : 
                            (order.total_amount ? 
                              order.total_amount.toLocaleString() : '0')}원
                        </td>
                      </tr>
                    ))}
                    {orders.length === 0 && (
                      <tr>
                        <td colSpan="5" className={style.noOrders}>
                          주문 내역이 없습니다.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
                
                {totalPages > 0 && (
                  <div className={style.PaginationContainer}>
                    <button
                      onClick={() => handlePageChange(0)}
                      className={style.PageButton}
                      disabled={currentPage === 0}
                    >
                      «
                    </button>
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      className={style.PageButton}
                      disabled={currentPage === 0}
                    >
                      ‹
                    </button>
                    
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => handlePageChange(i)}
                        className={`${style.PageButton} ${currentPage === i ? style.Active : ''}`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      className={style.PageButton}
                      disabled={currentPage === totalPages - 1}
                    >
                      ›
                    </button>
                    <button
                      onClick={() => handlePageChange(totalPages - 1)}
                      className={style.PageButton}
                      disabled={currentPage === totalPages - 1}
                    >
                      »
                    </button>
                  </div>
                )}
              </>
            )}
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
