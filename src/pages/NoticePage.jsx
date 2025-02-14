import React, { useState, useEffect } from "react";
import axios from "axios";
import style from "./NoticePage.module.css";
import { BiSearch } from "react-icons/bi";
import { useNavigate } from "react-router-dom";

const Notice = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(0);

  const [currentPage, setCurrentPage] = useState(1);
  const [expandedNotice, setExpandedNotice] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeSearchTerm, setActiveSearchTerm] = useState("");
  const itemsPerPage = 10;

  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchNotices(currentPage - 1);

    // 관리자 권한 확인
    const authority = localStorage.getItem("authority");
    setIsAdmin(authority === "ADMIN");
  }, [currentPage, activeSearchTerm]);

  const fetchNotices = async (page) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://spring.mirae.network:8080/api/notices`,
        {
          params: {
            page: page,
            size: itemsPerPage,
            title: activeSearchTerm,
          },
        }
      );

      const mappedNotices = response.data.notices.map((notice) => ({
        id: notice.id,
        title: notice.title,
        content: notice.text,
        createdAt: new Date(notice.date).toLocaleDateString(),
        views: notice.view,
      }));

      setNotices(mappedNotices);
      setTotalPages(response.data.total_page);
      setError("");
    } catch (error) {
      setError("공지사항이 없습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleTitleClick = async (noticeId) => {
    if (expandedNotice === noticeId) {
      setExpandedNotice(null);
      return;
    }

    try {
      const response = await axios.get(
        `http://spring.mirae.network:8080/api/notices/${noticeId}`
      );

      // 응답 데이터 구조 확인을 위한 로그
      console.log("상세 조회 응답:", response.data);

      // 확장된 공지사항 ID 설정
      setExpandedNotice(noticeId);
      setNotices((prevNotices) =>
        prevNotices.map((notice) =>
          notice.id === noticeId
            ? {
                ...notice,
                content: response.data.text,
                views: response.data.view,
              }
            : notice
        )
      );
    } catch (error) {
      console.error("공지사항 상세 조회 실패:", error);
      if (error.response) {
        console.error("에러 응답:", error.response.data);
      }
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    setExpandedNotice(null);
  };

  const getPageNumbers = () => {
    const pages = [];
    const totalDisplayPages = 5; // 한 번에 보여줄 페이지 번호 개수
    const halfDisplay = Math.floor(totalDisplayPages / 2); // 현재 페이지 기준 좌우로 보여줄 페이지 수

    if (totalPages <= totalDisplayPages) {
      // 전체 페이지가 표시할 페이지 수보다 적으면 모든 페이지 표시
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      let startPage = currentPage - halfDisplay;
      let endPage = currentPage + halfDisplay;

      // 시작 페이지가 1보다 작을 경우 조정
      if (startPage < 1) {
        startPage = 1;
        endPage = totalDisplayPages;
      }

      // 끝 페이지가 총 페이지수보다 클 경우 조정
      if (endPage > totalPages) {
        endPage = totalPages;
        startPage = totalPages - totalDisplayPages + 1;
      }

      // 페이지 번호 배열 생성
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  const handleSearch = () => {
    setActiveSearchTerm(searchTerm);
    setCurrentPage(1);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className={style.Container}>
      <div className={style.MainContent}>
        <div className={style.menu_title}>
          <span className={style.underline}>NOTICE</span>
        </div>
        <p className={style.menu_content}>
          코키티의 최신 공지사항을 확인하시고,
          <br />
          중요한 정보를 놓치지 않도록 주의하세요.
        </p>

        <div className={style.FormContainer}>
          <h2 className={style.FormTitle}>공지사항</h2>

          <div className={style.TopControls}>
            <div className={style.SearchBox}>
              <select className={style.SearchSelect}>
                <option value="title">제목</option>
                <option value="content">내용</option>
                <option value="all">전체</option>
              </select>
              <div className={style.SearchInputWrapper}>
                <input
                  type="text"
                  placeholder="검색어를 입력하세요"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={handleKeyPress}
                  className={style.SearchInput}
                />
                <button className={style.SearchButton} onClick={handleSearch}>
                  <BiSearch size={20} />
                </button>
              </div>
            </div>
          </div>

          <div className={style.NoticeTable}>
            {loading ? (
              <div className={style.Loading}>로딩중...☕</div>
            ) : error ? (
              <div className={style.Error}>{error}</div>
            ) : notices && notices.length > 0 ? (
              <>
                <div className={style.TableHeader}>
                  <div className={style.HeaderNo}>번호</div>
                  <div className={style.HeaderTitle}>제목</div>
                  <div className={style.HeaderDate}>작성일</div>
                  <div className={style.HeaderViews}>조회수</div>
                </div>

                {notices.map((notice) => (
                  <React.Fragment key={notice.id}>
                    <div className={style.TableRow}>
                      <div className={style.RowNo}>{notice.id}</div>
                      <div
                        className={style.RowTitle}
                        onClick={() => handleTitleClick(notice.id)}
                      >
                        {notice.title}
                      </div>
                      <div className={style.RowDate}>{notice.createdAt}</div>
                      <div className={style.RowViews}>{notice.views}</div>
                    </div>
                    {expandedNotice === notice.id && (
                      <div className={style.ContentRow}>
                        <div
                          className={style.Content}
                          style={{
                            whiteSpace: "pre-wrap", // 줄바꿈 보존
                            padding: "20px", // 여백 추가
                            backgroundColor: "#f9f9f9", // 배경색 추가
                            margin: "10px 0", // 상하 여백
                            borderRadius: "5px", // 모서리 둥글게
                          }}
                        >
                          {notice.content}
                        </div>
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </>
            ) : (
              <div className={style.NoData}>등록된 공지사항이 없습니다.</div>
            )}
          </div>

          {notices && notices.length > 0 && (
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
                  disabled={currentPage === totalPages}
                >
                  ›
                </button>
                <button
                  onClick={() => handlePageChange(totalPages)}
                  className={style.PageButton}
                  disabled={currentPage === totalPages}
                >
                  »
                </button>
              </div>
              {isAdmin && (
                <div className={style.ButtonContainer}>
                  <button
                    className={style.InquiryButton}
                    onClick={() => navigate("/notice/write")}
                  >
                    작성하기
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notice;
