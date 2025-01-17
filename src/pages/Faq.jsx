import React from "react";
import style from "./Faq.module.css";
import { useState } from "react";

const Faq = () => {
  const categories = [
    "이벤트/프로모션",
    "회원문의",
    "결제/환불",
    "매장문의",
    "딜리버리",
    "기타",
  ];
  const [activeCategory, setActiveCategory] = useState("이벤트/프로모션");

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
  };

  const tableData = [
    {
      id: 10,
      category: "이벤트/프로모션",
      title: "베스트 리뷰 이벤트 당첨자는 매일 언제쯤에 발표하나요?",
      date: "2024.01.12",
      views: 134,
    },
    {
      id: 9,
      category: "회원문의",
      title: "실명확인 오류 시 어떻게 하나요?",
      date: "2024.01.12",
      views: 134,
    },
    {
      id: 8,
      category: "회원문의",
      title: "회원 아이디와 비밀번호를 잊어버렸어요.",
      date: "2024.01.12",
      views: 11,
    },
    
    {
      id: 7,
      category: "결제/환불",
      title: "환불은 어떻게 하나요?",
      date: "2024.01.12",
      views: 134,
    },
    {
      id: 6,
      category: "매장문의",
      title: "매장정보(위치, 전화번호)를 알고싶어요.",
      date: "2024.01.12",
      views: 11,
    },
    {
      id: 5,
      category: "딜리버리",
      title: "코키티 매장과 동일한 메뉴를 판매하나요?",
      date: "2024.01.12",
      views: 134,
    },
    {
      id: 4,
      category: "딜리버리",
      title: "이용가능한 결제수단은 어떻게 되나요?",
      date: "2024.01.12",
      views: 11,
    },
    {
      id: 3,
      category: "결제/환불",
      title: "어떤 결제방법이 있나요?",
      date: "2024.01.12",
      views: 134,
    },
    {
      id: 2,
      category: "기타",
      title: "대량 구매를 하고싶어요.",
      date: "2024.01.12",
      views: 11,
    },
    {
      id: 1,
      category: "기타",
      title: "고객센터 번호는 어떻게 되나요?",
      date: "2024.01.12",
      views: 11,
    },
  ];

  return (
    <div className={style.Container}>
      <div className={style.MainContent}>
        <div className={style.menu_title}>
          <span className={style.underline}>FAQ</span>
        </div>
        <p className={style.menu_content}>궁금하신 내용을 확인해보세요.</p>

        <div className={style.TabMenu}>
          {categories.map((category) => (
            <button
              key={category}
              className={`${style.TabButton} ${
                activeCategory === category ? style.active : ""
              }`}
              onClick={() => handleCategoryClick(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <hr className={style.hr} />

        <div className={style.TableContainer}>
          <table className={style.Table}>
            <thead>
              <tr>
                <th>번호</th>
                <th>주제</th>
                <th>제목</th>
                <th>작성일</th>
                <th>조회수</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((row) => (
                <tr key={row.id}>
                  <td>{row.id}</td>
                  <td>{row.category}</td>
                  <td>{row.title}</td>
                  <td>{row.date}</td>
                  <td>{row.views}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className={style.Pagination}>
            <span>{"<<"}</span>
            <span>{"<"}</span>
            <span className={style.CurrentPage}>1</span>
            <span>{">"}</span>
            <span>{">>"}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Faq;
