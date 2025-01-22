import React, { useState, useEffect } from "react";
import axios from "axios";
import style from "./NoticePage.module.css";
import { BiSearch } from "react-icons/bi";
import { useNavigate } from "react-router-dom";

const Notice = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [expandedNotice, setExpandedNotice] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 10;
  
  const navigate = useNavigate();

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
      if (!token) {
        setIsAdmin(false);
        return;
      }
      
      const response = await axios.get('http://localhost:8080/kokee/member/check-admin', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setIsAdmin(response.data.isAdmin);
    } catch (error) {
      console.error('관리자 확인 실패:', error);
      setIsAdmin(false);
    }
  };

  const addNotice = async (noticeData) => {
    try {
      setLoading(true);
      await axios.post("http://localhost:8080/kokee/notice/add", {
        subject: noticeData.title,
        content: noticeData.text,
        email: noticeData.email
      });
      await fetchNotices();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateNotice = async (id, noticeData) => {
    try {
      setLoading(true);
      await axios.put(`http://localhost:8080/kokee/notice/update/${id}`, {
        subject: noticeData.title,
        content: noticeData.text
      });
      await fetchNotices();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteNotice = async (id) => {
    try {
      setLoading(true);
      await axios.delete(`http://localhost:8080/kokee/notice/delete/${id}`);
      await fetchNotices();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredList = notices.filter((notice) =>
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
            {loading ? (
              <div className={style.Loading}>로딩중...☕</div>
            ) : error ? (
              <div className={style.Error}>{error}</div>
            ) : (
              <>
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
                onClick={() => navigate('/notice/write')}
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

export default Notice;
