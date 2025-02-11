import React, { useState, useEffect } from "react";
import style from "./InquiryHistory.module.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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

  // API 호출 함수 추가
  const fetchInquiries = async (selectedPeriod, start, end) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("로그인이 필요합니다.");
      }

      // API 요청 파라미터 설정
      let params = {
        size: 10,
        page: 0
      };

      // 날짜 파라미터 추가
      if (start && end) {
        params.startDate = start;
        params.endDate = end;
      } else if (selectedPeriod) {
        const today = new Date();
        const startDate = new Date();
        
        switch (selectedPeriod) {
          case "1개월":
            startDate.setMonth(today.getMonth() - 1);
            break;
          case "3개월":
            startDate.setMonth(today.getMonth() - 3);
            break;
          case "1년":
            startDate.setFullYear(today.getFullYear() - 1);
            break;
          default:
            break;
        }
        
        params.startDate = startDate.toISOString().split('T')[0];
        params.endDate = today.toISOString().split('T')[0];
      }

      const response = await axios.get("http://localhost:8080/api/questions", {
        params,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // 응답 데이터 매핑
      const mappedInquiries = response.data.questions.map(inquiry => ({
        id: inquiry.id,
        subject: "1:1문의",
        title: inquiry.title,
        content: inquiry.text,
        date: new Date(inquiry.created_date).toLocaleDateString('ko-KR', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        }).replace(/\. /g, '-').slice(0, -1),
        status: inquiry.answered ? "답변완료" : "답변대기",
        reply: null,
        replyDate: null
      }));

      setOrders(mappedInquiries);
      setError(null);
    } catch (err) {
      console.error("문의 내역 조회 실패:", err);
      setError("문의 내역을 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // useEffect 수정
  useEffect(() => {
    fetchInquiries(period, startDate, endDate);
  }, [period, startDate, endDate]);

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleTitleClick = async (order) => {
    try {
      if (selectedInquiry?.id === order.id) {
        setSelectedInquiry(null);
        return;
      }

      const token = localStorage.getItem("token");
      const response = await axios.get(`http://localhost:8080/api/questions/${order.id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // 상세 정보로 업데이트
      const detailData = {
        ...order,
        content: response.data.text,
        reply: response.data.feedback_text,
        replyDate: response.data.feedback_date ?
          new Date(response.data.feedback_date).toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
          }).replace(/\. /g, '-').slice(0, -1) : null
      };

      setSelectedInquiry(detailData);
    } catch (error) {
      console.error("문의 상세 조회 실패:", error);
      alert("문의 상세 내용을 불러오는데 실패했습니다.");
    }
  };

  // handleDateSearch 수정
  const handleDateSearch = () => {
    if (!startDate || !endDate) {
      alert("시작일과 종료일을 모두 선택해주세요.");
      return;
    }
    if (new Date(startDate) > new Date(endDate)) {
      alert("시작일이 종료일보다 늦을 수 없습니다.");
      return;
    }
    fetchInquiries("", startDate, endDate);
  };

  const handlePeriodClick = (newPeriod) => {
    setPeriod(newPeriod);
    setStartDate("");
    setEndDate("");
  };

  // 날짜 입력 시 기간별 선택 해제
  const handleDateInput = (e, type) => {
    if (type === "start") {
      setStartDate(e.target.value);
    } else {
      setEndDate(e.target.value);
    }
    // 날짜 입력 시 기간별 선택 해제
    setPeriod("");
  };

  // handleDelete 수정
  const handleDelete = async (inquiryId) => {
    if (window.confirm("문의를 삭제하시겠습니까?")) {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.delete(
          `http://localhost:8080/api/questions/${inquiryId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        if (response.status === 200) {
          // 삭제 성공 시 목록 새로고침
          fetchInquiries(period, startDate, endDate);
          setSelectedInquiry(null);
        }
      } catch (err) {
        console.error("문의 삭제 실패:", err);
        alert("문의 삭제에 실패했습니다.");
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
                        className={`${style.periodButton} ${
                          period === p ? style.active : ""
                        }`}
                        onClick={() => handlePeriodClick(p)}
                      >
                        {p}
                      </button>
                    ))}
                    <span style={{ marginLeft: "70px" }}>일자별</span>
                    <input
                      type="date"
                      className={style.dateInput}
                      value={startDate}
                      onChange={(e) => handleDateInput(e, "start")}
                    />{" "}
                    -
                    <input
                      type="date"
                      className={style.dateInput}
                      value={endDate}
                      onChange={(e) => handleDateInput(e, "end")}
                    />
                    <button
                      className={style.searchButton}
                      onClick={handleDateSearch}
                    >
                      조회
                    </button>
                  </div>
                )}

                <table
                  className={`${style.orderTable} ${
                    selectedInquiry ? style.selectedTable : ""
                  }`}
                >
                  <thead>
                    <tr>
                      <th>접수구분</th>
                      <th>제목</th>
                      <th>작성일자</th>
                      <th>답변여부</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(selectedInquiry ? [selectedInquiry] : orders).map(
                      (order) => (
                        <React.Fragment key={order.id}>
                          <tr>
                            <td>{order.subject}</td>
                            <td>
                              <span
                                onClick={() => handleTitleClick(order)}
                                style={{ cursor: "pointer" }}
                              >
                                {order.title}
                              </span>
                            </td>
                            <td>{order.date}</td>
                            <td>{order.status}</td>
                          </tr>
                          {selectedInquiry?.id === order.id && (
                            <tr>
                              <td colSpan="4" style={{ borderBottom: "none" }}>
                                <div
                                  className={style.inquiryDetail}
                                  style={{ textAlign: "left" }}
                                >
                                  <div className={style.inquiryContent}>
                                    {order.content
                                      ?.split("\n")
                                      .map((line, i) => (
                                        <p key={i} style={{ margin: "0" }}>
                                          {line}
                                        </p>
                                      ))}
                                  </div>
                                  {order.reply && (
                                    <div className={style.replySection}>
                                      <h3>답변 내용</h3>
                                      <div className={style.replyContent}>
                                        {order.reply
                                          .split("\n")
                                          .map((line, i) => (
                                            <p
                                              key={i}
                                              style={{
                                                margin: "0",
                                                lineHeight: "1.5",
                                              }}
                                            >
                                              {line}
                                            </p>
                                          ))}
                                      </div>
                                      <div className={style.replyDate}>
                                        답변일자 {order.replyDate}
                                      </div>
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
                      )
                    )}
                  </tbody>
                </table>
              </>
            )}
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

export default InquiryHistory;
