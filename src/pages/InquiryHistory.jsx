import React, { useState, useEffect } from "react";
import style from "./InquiryHistory.module.css";
import { useNavigate } from "react-router-dom";

const InquiryHistory = () => {
  const navigate = useNavigate();
  const [period, setPeriod] = useState("1개월");
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const currentPath = window.location.pathname;

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const dummyData = [
        {
          id: 1,
          subject: '상품문의',
          title: '케이크 커스텀 문의드립니다',
          date: '2024-03-15',
          status: '답변완료',
          content: '생일 케이크 문구를 변경하고 싶은데 가능할까요?\n특별한 날이라 예쁘게 꾸며주셨으면 좋겠어요.',
          reply: '안녕하세요, 고객님\n케이크 문구 변경 가능합니다.\n주문 시 요청사항에 원하시는 문구를 적어주시면 반영해드리도록 하겠습니다.',
          replyDate: '2024-03-16'
        },
        {
          id: 2,
          subject: '배송문의',
          title: '배송 시간 조정 가능한가요?',
          date: '2024-03-14',
          status: '답변대기',
          content: '오후 2시 이후로 배송 가능할까요?\n그 전에는 집에 아무도 없어서요.',
        },
        {
          id: 3,
          subject: '기타문의',
          title: '영수증 발급 문의',
          date: '2024-03-10',
          status: '답변완료',
          content: '지난주 주문건에 대해 영수증 발급이 필요합니다.\n어떻게 발급받을 수 있을까요?',
          reply: '안녕하세요, 고객님\n영수증 발급은 마이페이지 > 주문내역에서 확인하실 수 있습니다.\n추가 도움이 필요하시다면 언제든 문의해주세요.',
          replyDate: '2024-03-11'
        },
        {
          id: 4,
          subject: '상품문의',
          title: '알레르기 성분 문의',
          date: '2024-03-05',
          status: '답변완료',
          content: '크루아상에 들어가는 견과류 종류가 궁금합니다.\n땅콩 알레르기가 있어서요.',
          reply: '안녕하세요, 고객님\n저희 크루아상에는 아몬드만 사용되고 있습니다.\n땅콩은 전혀 사용되지 않으니 안심하고 드셔도 됩니다.',
          replyDate: '2024-03-06'
        },
        {
          id: 5,
          subject: '기타문의',
          title: '단체주문 문의',
          date: '2024-03-01',
          status: '답변완료',
          content: '회사 행사용으로 50개 정도 단체주문하고 싶습니다.\n할인 가능할까요?',
          reply: '안녕하세요, 고객님\n30개 이상 단체주문 시 10% 할인 적용 가능합니다.\n자세한 상담을 위해 매장으로 연락 부탁드립니다.',
          replyDate: '2024-03-02'
        }
      ];

      setOrders(dummyData);
      setLoading(false);

    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleTitleClick = (order) => {
    setSelectedInquiry(selectedInquiry?.id === order.id ? null : order);
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
                                    onClick={() => {
                                      if(window.confirm('문의를 삭제하시겠습니까?')) {
                                        console.log('삭제 처리:', order.id);
                                      }
                                    }}
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
