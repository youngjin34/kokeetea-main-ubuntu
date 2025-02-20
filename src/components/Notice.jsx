import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import style from "./Notice.module.css";

const Notice = () => {
  const [index, setIndex] = useState(0);
  const [noticeList, setNoticeList] = useState([]);
  const [notice, setNotice] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function getNotice() {
      try {
        const result = await axios.get(
          `http://spring.mirae.network:8080/api/notices`
        );
        setNoticeList(result.data.notices);
      } catch (error) {
        console.log(error);
      }
    }
    getNotice();
  }, []);

  useEffect(() => {
    if (noticeList.length > 0) {
      setNotice(noticeList[index].title); // index가 변경될 때마다 notice 업데이트
    }
  }, [index, noticeList]);

  function prevNotice() {
    if (index > 0) {
      setIndex(index - 1);
    }
  }

  function nextNotice() {
    if (index < noticeList.length - 1) {
      setIndex(index + 1);
    }
  }

  return (
    <div className={`${style.Notice}`}>
      <span onClick={() => navigate("/notice")} className={style.notice_title}>
        NOTICE
      </span>
      {notice ? (
        <p className={`${style.notice_content}`}>{notice}</p>
      ) : (
        <p className={`${style.notice_content}`}>등록된 공지사항이 없습니다.</p>
      )}

      <div className={`${style.notice_btn}`}>
        <img src="/img/left.png" onClick={() => prevNotice()} />
        <img src="/img/right.png" onClick={() => nextNotice()} />
      </div>
    </div>
  );
};

export default Notice;
