import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import style from './NoticeWrite.module.css';

const NoticeWrite = () => {
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // 관리자 권한 확인
    const authority = localStorage.getItem('authority');
    if (authority !== 'ADMIN') {
      alert('관리자만 접근할 수 있습니다.');
      navigate('/');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim() || !text.trim()) {
      alert('제목과 내용을 모두 입력해주세요.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:8080/api/notices',
        {
          title: title.trim(),
          text: text.trim()
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.status === 200) {
        alert('공지사항이 성공적으로 등록되었습니다.');
        navigate('/notice');
      }
    } catch (error) {
      console.error('공지사항 등록 실패:', error);
      alert('공지사항 등록에 실패했습니다.');
    }
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className={style.container}>
      <div className={style.menu_title}>
        <h1 className={style.title}>공지사항 작성</h1>
      </div>
      
      <div className={style.contentWrapper}>
        <div className={style.content}>
          <form onSubmit={handleSubmit} className={style.form}>
            <div className={style.inputGroup}>
              <label htmlFor="title">
                제목
                <span className={style.required}>*</span>
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="공지사항 제목을 입력하세요"
                maxLength={100}
              />
            </div>
            
            <div className={style.inputGroup}>
              <label htmlFor="content">
                내용
                <span className={style.required}>*</span>
              </label>
              <textarea
                id="content"
                value={text}
                onChange={(e) => setText(e.target.value)}
                required
                placeholder="공지사항 내용을 입력하세요"
                rows={15}
              />
              <span className={style.charCount}>{text.length} / 2000</span>
            </div>
            
            <div className={style.buttonGroup}>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className={style.cancelButton}
              >
                취소
              </button>
              <button type="submit" className={style.submitButton}>
                등록하기
              </button>
            </div>
          </form>
        </div>

        <div className={style.sideNav}>
          <div
            className={`${style.sideNavItem} ${
              location.pathname === "/inquiryhistory" ? style.active : ""
            }`}
            onClick={() => handleNavigation("/inquiryhistory")}
          >
            1:1 문의 관리
          </div>
          <div
            className={`${style.sideNavItem} ${
              location.pathname === "/notice/write" ? style.active : ""
            }`}
            onClick={() => handleNavigation("/notice/write")}
          >
            공지사항 작성
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoticeWrite; 