import React, { useState, useEffect } from "react";
import style from "./InquiryHistory.module.css";
import { useNavigate } from "react-router-dom";

const InquiryHistory = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const navigate = useNavigate();
  const [period, setPeriod] = useState("1개월");
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const currentPath = window.location.pathname;
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const filterInquiriesByPeriod = (inquiries, selectedPeriod, start, end) => {
    if (start && end) {
      const startDateTime = new Date(start);
      const endDateTime = new Date(end);
      endDateTime.setHours(23, 59, 59);

      return inquiries.filter(inquiry => {
        const inquiryDate = new Date(inquiry.date);
        return inquiryDate >= startDateTime && inquiryDate <= endDateTime;
      });
    }

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
        return inquiries;
    }

    return inquiries.filter(inquiry => {
      const inquiryDate = new Date(inquiry.date);
      return inquiryDate >= filterDate && inquiryDate <= today;
    });
  };

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8080/kokee/inquiries', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('문의 내역을 불러오는데 실패했습니다.');
      }

      const data = await response.json();
      const filteredData = filterInquiriesByPeriod(data, period, startDate, endDate);
      setOrders(filteredData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, [period, startDate, endDate]);

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleTitleClick = (order) => {
    setSelectedInquiry(selectedInquiry?.id === order.id ? null : order);
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
    fetchInquiries();
  };

  const handlePeriodClick = (newPeriod) => {
    setPeriod(newPeriod);
    setStartDate("");
    setEndDate("");
  };

  // 날짜 입력 시 기간별 선택 해제
  const handleDateInput = (e, type) => {
    if (type === 'start') {
      setStartDate(e.target.value);
    } else {
      setEndDate(e.target.value);
    }
    // 날짜 입력 시 기간별 선택 해제
    setPeriod("");
  };

  // 삭제 기능도 백엔드 연동으로 수정
  const handleDelete = async (inquiryId) => {
    if (window.confirm('문의를 삭제하시겠습니까?')) {
      try {
        const response = await fetch(`/api/inquiries/${inquiryId}`, {
          method: 'DELETE',
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('문의 삭제에 실패했습니다.');
        }

        // 삭제 성공 시 목록 새로고침
        fetchInquiries();
        setSelectedInquiry(null);
      } catch (err) {
        alert(err.message);
      }
    }
  };

  return (
    <div className={style.container}>
      <div className={style.title}>1:1 문의 내역</div>
      <div className={style.content}>
        <div className={style.formContainer}>
          <div className={style.orderHistory}>
            {loading && <div>로딩 중...</div>}
            {error && <div className={style.error}>{error}</div>}
            {!loading && !error && (
              <>
                {!selectedInquiry && (
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
                )}

                <table className={`${style.orderTable} ${selectedInquiry ? style.selectedTable : ''}`}>
                  <thead>
                    <tr>
                      <th>접수구분</th>
                      <th>제목</th>
                      <th>작성일자</th>
                      <th>답변여부</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(selectedInquiry ? [selectedInquiry] : orders).map((order) => (
                      <React.Fragment key={order.id}>
                        <tr>
                          <td>{order.subject}</td>
                          <td>
                            <span 
                              onClick={() => handleTitleClick(order)}
                              style={{ cursor: 'pointer' }}
                            >
                              {order.title}
                            </span>
                          </td>
                          <td>{order.date}</td>
                          <td>{order.status}</td>
                        </tr>
                        {selectedInquiry?.id === order.id && (
                          <tr>
                            <td colSpan="4" style={{ borderBottom: 'none' }}>
                              <div className={style.inquiryDetail} style={{ textAlign: 'left' }}>
                                <div className={style.inquiryContent}>
                                  {order.content?.split('\n').map((line, i) => (
                                    <p key={i} style={{ margin: '0' }}>{line}</p>
                                  ))}
                                </div>
                                {order.reply && (
                                  <div className={style.replySection}>
                                    <h3>답변 내용</h3>
                                    <div className={style.replyContent}>
                                      {order.reply.split('\n').map((line, i) => (
                                        <p key={i} style={{ margin: '0', lineHeight: '1.5' }}>{line}</p>
                                      ))}
                                    </div>
                                    <div className={style.replyDate}>답변일자 {order.replyDate}</div>
                                  </div>
                                )}
                                <div className={style.buttonContainer}>
                                  <button 
                                    className={style.backButton}
                                    onClick={() => setSelectedInquiry(null)}
                                  >
                                    뒤로
                                  </button>
                                  <button 
                                    className={style.deleteButton}
                                    onClick={() => handleDelete(order.id)}
                                  >
                                    삭제
                                  </button>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
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

export default InquiryHistory;
