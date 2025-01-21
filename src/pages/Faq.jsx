import React, { useState, useEffect } from "react";
import axios from "axios";
import style from "./Faq.module.css";

const FAQ = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [expandedNotice, setExpandedNotice] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const itemsPerPage = 10;
  
  const categories = [
    "전체",
    "이벤트/프로모션",
    "회원문의",
    "결제/환불",
    "매장문의",
    "딜리버리",
    "기타"
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchNotices();
    checkAdminStatus();
  }, []);

  const fetchNotices = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:8080/kokee/notice/list");
      setNotices(response.data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const checkAdminStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await axios.get('http://localhost:8080/kokee/member/check-admin', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setIsAdmin(response.data.isAdmin);
      }
    } catch (error) {
      console.error('Admin check failed:', error);
    }
  };

  const filteredList = notices.filter((notice) => {
    const matchesSearch = notice.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "전체" || notice.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredList.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    setExpandedNotice(null);
  };

  const getPageNumbers = () => {
    const totalPages = Math.ceil(filteredList.length / itemsPerPage);
    const current = currentPage;
    const pages = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (current <= 3) {
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
      } else if (current >= totalPages - 2) {
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        for (let i = current - 2; i <= current + 2; i++) {
          pages.push(i);
        }
      }
    }

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
        <p className={style.menu_content}>
          궁금하신 내용을 확인해보세요.
        </p>

        <div className={style.FormContainer}>
          <div className={style.CategoryContainer}>
            {categories.map((category) => (
              <button
                key={category}
                className={`${style.CategoryButton} ${
                  selectedCategory === category ? style.CategoryButtonActive : ""
                }`}
                onClick={() => setSelectedCategory(category)}
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
                  <div className={style.HeaderSubject}>주제</div>
                  <div className={style.HeaderTitle}>제목</div>
                  <div className={style.HeaderDate}>작성일</div>
                  <div className={style.HeaderViews}>조회수</div>
                </div>

                {currentItems.map((notice) => (
                  <React.Fragment key={notice.id}>
                    <div className={style.TableRow}>
                      <div className={style.RowNo}>{notice.id}</div>
                      <div
                        className={style.RowTitle}
                        onClick={() => handleTitleClick(notice.id)}
                      >
                        {notice.title}
                      </div>
                      <div className={style.RowDate}>{notice.date}</div>
                      <div className={style.RowEmail}>{notice.email}</div>
                    </div>
                    {expandedNotice === notice.id && (
                      <div className={style.ContentRow}>
                        <div className={style.Content}>{notice.text}</div>
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </>
            )}
          </div>

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
                  currentPage === pageNum ? style.ActivePage : style.PageButton
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
                handlePageChange(Math.ceil(filteredList.length / itemsPerPage))
              }
              className={style.PageButton}
              disabled={
                currentPage === Math.ceil(filteredList.length / itemsPerPage)
              }
            >
              »
            </button>
          </div>

          {isAdmin && (
            <div className={style.WriteButtonContainer}>
              <button 
                className={style.WriteButton}
                onClick={() => {/* 글쓰기 페이지로 이동하는 로직 */}}
              >
                작성하기
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FAQ;