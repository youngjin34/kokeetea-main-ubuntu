import React, { useState, useEffect } from "react";
import axios from "axios";
import style from "./Faq.module.css";

const FAQ = ({ isLogined }) => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [expandedNotice, setExpandedNotice] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const itemsPerPage = 10;
  const [totalPages, setTotalPages] = useState(1);

  const categories = [
    "전체",
    "이벤트 및 프로모션",
    "회원문의",
    "결제/환불",
    "매장문의",
    "딜리버리",
    "기타",
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
    const authority = localStorage.getItem("authority");
    setIsAdmin(authority === "ADMIN");
  }, []);

  useEffect(() => {
    fetchNotices(); // 카테고리나 페이지가 변경될 때마다 호출
  }, [currentPage, selectedCategory]);

  const fetchNotices = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://spring.mirae.network:8080/api/faqs",
        {
          params: {
            page: currentPage - 1,
            size: itemsPerPage,
            category: selectedCategory === "전체" ? null : selectedCategory, // 전체 카테고리일 때 null로 보내기
          },
        }
      );

      // 응답 데이터 매핑
      const mappedFaqs = response.data.faqs.map((faq) => ({
        id: faq.id,
        title: faq.title,
        category: faq.category,
        content: faq.content,
        date: new Date(faq.date).toLocaleDateString(),
        view: faq.view,
      }));

      setNotices(mappedFaqs);
      setTotalPages(response.data.total_pages);
    } catch (error) {
      setError(error.message);
      console.error("FAQ 조회 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredList = notices.filter((notice) => {
    const matchesSearch = notice.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "전체" || notice.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredList.slice(indexOfFirstItem, indexOfLastItem);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1); // 페이지를 첫 번째 페이지로 초기화
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchNotices(); // 선택한 페이지에 맞는 데이터 가져오기
  };

  const getPageNumbers = () => {
    const pages = [];
    const totalDisplayPages = 5;
    const halfDisplay = Math.floor(totalDisplayPages / 2);

    let startPage = Math.max(1, currentPage - halfDisplay);
    let endPage = Math.min(totalPages, startPage + totalDisplayPages - 1);

    if (endPage - startPage + 1 < totalDisplayPages) {
      startPage = Math.max(1, endPage - totalDisplayPages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    console.log(pages);
    console.log(totalPages);

    return pages;
  };

  const handleTitleClick = (noticeId) => {
    setExpandedNotice(expandedNotice === noticeId ? null : noticeId);
  };

  return (
    <div className={style.Container}>
      <div className={style.MainContent}>
        <div className={style.menu_title}>
          <span className={style.underline}>FAQ</span>
        </div>
        <p className={style.menu_content}>궁금하신 내용을 확인해보세요.</p>

        <div className={style.FormContainer}>
          <div className={style.CategoryContainer}>
            {categories.map((category) => (
              <button
                key={category}
                className={`${style.CategoryButton} ${
                  selectedCategory === category
                    ? style.CategoryButtonActive
                    : ""
                }`}
                onClick={() => handleCategoryChange(category)} // 여기서 사용
              >
                {category}
              </button>
            ))}
          </div>

          <div className={style.NoticeTable}>
            {loading ? (
              <div className={style.Loading}>로딩중...☕</div>
            ) : error ? (
              <div className={style.Error}>{error}</div>
            ) : (
              <>
                <div className={style.TableHeader}>
                  <div className={style.HeaderNo}>번호</div>
                  <div className={style.HeaderCategory}>카테고리</div>
                  <div className={style.HeaderSubject}>제목</div>
                  <div className={style.HeaderDate}>작성일</div>
                </div>

                {(selectedCategory === "전체" ? notices : currentItems).map(
                  (notice) => (
                    <React.Fragment key={notice.id}>
                      <div className={style.TableRow}>
                        <div className={style.RowNo}>{notice.id}</div>
                        <div className={style.RowCategory}>
                          {notice.category}
                        </div>
                        <div
                          className={style.RowTitle}
                          onClick={() => handleTitleClick(notice.id)}
                        >
                          {notice.title}
                        </div>
                        <div className={style.RowDate}>{notice.date}</div>
                      </div>
                      {expandedNotice === notice.id && (
                        <div className={style.ContentRow}>
                          <div className={style.Content}>{notice.content}</div>
                        </div>
                      )}
                    </React.Fragment>
                  )
                )}
              </>
            )}
          </div>

          <div className={style.PaginationContainer}>
            <div className={style.Pagination}>
              <button
                onClick={() => handlePageChange(1)}
                className={style.PageButton}
                disabled={currentPage === 1}
              >
                «
              </button>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                className={style.PageButton}
                disabled={currentPage === 1}
              >
                ‹
              </button>

              {getPageNumbers().map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={
                    currentPage === pageNum
                      ? style.ActivePage
                      : style.PageButton
                  }
                >
                  {pageNum}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                className={style.PageButton}
                disabled={
                  currentPage === Math.ceil(filteredList.length / itemsPerPage)
                }
              >
                ›
              </button>
              <button
                onClick={() =>
                  handlePageChange(
                    Math.ceil(filteredList.length / itemsPerPage)
                  )
                }
                className={style.PageButton}
                disabled={
                  currentPage === Math.ceil(filteredList.length / itemsPerPage)
                }
              >
                »
              </button>
            </div>
            <div className={style.ButtonContainer}>
              {isLogined && !isAdmin && (
                <button
                  className={style.InquiryButton}
                  onClick={() => {
                    window.location.href = "/inquiry";
                  }}
                >
                  1:1 문의하기
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
