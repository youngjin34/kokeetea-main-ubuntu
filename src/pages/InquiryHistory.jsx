import React, { useState } from "react";
import style from "./InquiryHistory.module.css";
import { useNavigate } from "react-router-dom";

const InquiryHistory = () => {
  const navigate = useNavigate();
  const [period, setPeriod] = useState("1개월");
  const [selectedInquiry, setSelectedInquiry] = useState(null);

  const [orders] = useState([
    { 
      id: 1,
      subject: '문의', 
      title: '적립 포인트가 누락된 것 같아요.', 
      date: '2025.01.19', 
      status: '답변완료',
      content: '안녕하세요.\n지난주(1월 10일) 카페 매장에서 총 15,000원 결제했는데, 적립 포인트가 누락된 것 같습니다.\n결제 당시 매장 직원분께 적립 요청을 드렸고, 제 회원 번호도 알려드렸는데 포인트가 반영되지 않았습니다.\n\n제 회원 정보는 아래와 같습니다.\n회원 번호: 987654321\n이름: 홍길동\n\n확인 부탁드리며, 누락된 포인트가 있다면 적립 가능할지 안내 부탁드립니다.\n감사합니다.',
      reply: '안녕하세요, 고객님. 문의 주신 내용을 확인한 결과, 고객님의 적립 요청이 시스템에 반영되지 않은 것을 확인했습니다. 번거로우시겠지만, 누락된 적립을 도와드리기 위해 구매 영수증 사진이나 결제 내역을 추가로 전달해 주시면 더욱 빠르고 정확한 처리가 가능합니다. 영수증이나 내역을 보내주시면 확인 후, 누락된 포인트(150점)를 적립해 드리겠습니다. 불편을 겪게 되어 죄송하며, 앞으로 더 나은 적립 서비스로 보답하겠습니다. 추가 문의 사항이 있으시면 언제든 고객센터로 연락 주세요.\n\n감사합니다.',
      replyDate: '2025.01.20'
    },
    { id: 2, subject: '문의', title: '브라운슈가밀크티 외 1개', date: '2025.01.19', status: '답변완료' },
    { id: 3, subject: '문의', title: '브라운슈가밀크티 외 1개', date: '2025.01.19', status: '미답변' },
    { id: 4, subject: '문의', title: '브라운슈가밀크티 외 1개', date: '2025.01.19', status: '미답변' },
  ]);

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
                        <td colSpan="4">
                          <div className={style.inquiryDetail} style={{ textAlign: 'left' }}>
                            <div className={style.inquiryContent} style={{ 
                              backgroundColor: 'white', 
                              padding: '30px',
                              lineHeight: '1.5'
                            }}>
                              {order.content?.split('\n').map((line, i) => (
                                <p key={i} style={{ margin: '0' }}>{line}</p>
                              ))}
                            </div>
                            {order.reply && (
                              <div className={style.replySection}>
                                <h3>답변 내역</h3>
                                <div className={style.replyContent}>
                                  {order.reply.split('\n').map((line, i) => (
                                    <p key={i} style={{ margin: '0', lineHeight: '1.5' }}>{line}</p>
                                  ))}
                                </div>
                                <div className={style.replyDate}>답변일자 {order.replyDate}</div>
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
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className={style.sideNav}>
          <div 
            className={style.sideNavItem} 
            onClick={() => handleNavigation('/memberinfoupdate')}
          >
            회원정보 확인 · 수정
          </div>
          <div 
            className={style.sideNavItem}
            onClick={() => handleNavigation('/couponstamp')}
          >
            쿠폰 · 스탬프 조회
          </div>
          <div 
            className={style.sideNavItem}
            onClick={() => handleNavigation('/orderhistory')}
          >
            주문내역 조회
          </div>
          <div 
            className={style.sideNavItem}
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
