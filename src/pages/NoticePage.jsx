import React, { useState, useEffect } from "react";
import style from "./NoticePage.module.css";
import { BiSearch } from "react-icons/bi";

const Notice = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [currentPage, setCurrentPage] = useState(1);
  const [expandedNotice, setExpandedNotice] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 10;

  const noticeList = [
    {
      id: 1,
      title: "공지사항 1",
      date: "2024-01-01",
      views: 100,
      content: "내용",
    },
    {
      id: 2,
      title: "공지사항 2",
      date: "2024-01-02",
      views: 70,
      content: "내용",
    },
    {
      id: 3,
      title: "공지사항 3",
      date: "2024-01-03",
      views: 100,
      content: "내용",
    },
    {
      id: 4,
      title: "공지사항 4",
      date: "2024-01-04",
      views: 150,
      content: "내용",
    },
    {
      id: 5,
      title: "공지사항 5",
      date: "2024-01-05",
      views: 250,
      content: "내용",
    },
    {
      id: 6,
      title: "공지사항 6",
      date: "2024-01-06",
      views: 54,
      content: "내용",
    },
    {
      id: 7,
      title: "공지사항 7",
      date: "2024-01-07",
      views: 12,
      content: "내용",
    },
    {
      id: 8,
      title: "공지사항 8",
      date: "2024-01-08",
      views: 1,
      content: "내용",
    },
    {
      id: 9,
      title: "공지사항 9",
      date: "2024-01-09",
      views: 45,
      content: "내용",
    },
    {
      id: 10,
      title: "공지사항 10",
      date: "2024-01-10",
      views: 34,
      content: "내용",
    },
    {
      id: 11,
      title: "공지사항 11",
      date: "2024-01-11",
      views: 78,
      content: "내용",
    },
    {
      id: 12,
      title: "공지사항 12",
      date: "2024-01-12",
      views: 67,
      content: "내용",
    },
    {
      id: 13,
      title: "공지사항 13",
      date: "2024-01-13",
      views: 56,
      content: "내용",
    },
    {
      id: 14,
      title: "공지사항 14",
      date: "2024-01-14",
      views: 34,
      content: "내용",
    },
    {
      id: 15,
      title: "공지사항 15",
      date: "2024-01-15",
      views: 89,
      content: "내용",
    },
  ];

  // 검색만 적용한 리스트 필터링
  const filteredList = noticeList.filter((notice) =>
    notice.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                  className={style.SearchInput}
                />
                <button className={style.SearchButton}>
                  <BiSearch size={20} />
                </button>
              </div>
            </div>
          </div>

          <div className={style.NoticeTable}>
            <div className={style.TableHeader}>
              <div className={style.HeaderNo}>번호</div>
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
                  <div className={style.RowViews}>{notice.views}</div>
                </div>
                {expandedNotice === notice.id && (
                  <div className={style.ContentRow}>
                    <div className={style.Content}>{notice.content}</div>
                  </div>
                )}
              </React.Fragment>
            ))}
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
        </div>
      </div>
    </div>
  );
};

export default Notice;
