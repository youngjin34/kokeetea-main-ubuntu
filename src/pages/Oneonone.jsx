import React, { useState } from "react";
import style from "./Oneonone.module.css";

const Oneonone = () => {
  const [] = useState();
  return (
    <div className={style.Container}>
      <div className={style.MainContent}>
        <div className={style.menu_title}>
          <span className={style.underline}>1:1 INQUIRY</span>
        </div>
        <p className={style.menu_content}>
          코키티는 접수해주신 의견에 대해
          <br />
          신속하게 처리할 수 있도록 최선을 다하겠습니다.
        </p>

        <div className={style.FormContainer}>
          <h2 className={style.FormTitle}>
            ※ 정상업무시간 09:00 ~ 18:00(주말, 공휴일, 국경일 휴무)
          </h2>
          <div className={style.Form}>
            <div className={style.FormGroup}>
              <label>접수 구분</label>
              <div className={style.RadioGroup}>
                <label className={style.RadioItem}>
                  <input type="radio" name="receptionType" value="문의" />
                  문의
                </label>
                <label className={style.RadioItem}>
                  <input type="radio" name="receptionType" value="칭찬" />
                  칭찬
                </label>
                <label className={style.RadioItem}>
                  <input type="radio" name="receptionType" value="불편" />
                  불편
                </label>
              </div>
            </div>

            <div className={style.FormGroup}>
              <label>이름</label>
              <input type="text" placeholder="이름을 입력해주세요." />
            </div>

            <div className={style.FormGroup}>
              <label>연락처</label>
              <input type="number" placeholder="연락처를 입력해주세요." />
            </div>

            <div className={style.FormGroup}>
              <label>이메일</label>
              <div className={style.EmailGroup}>
                <input
                  type="text"
                  placeholder="이메일 주소"
                  className={style.EmailInput}
                />
                <span className={style.EmailAt}>@</span>
                <input
                  type="text"
                  placeholder="직접 입력"
                  className={style.EmailInput}
                />
              </div>
            </div>

            <div className={style.FormGroup}>
              <label>제목</label>
              <input type="text" placeholder="제목을 입력해주세요." />
            </div>

            <div className={style.FormGroup}>
              <label>상세내용</label>
              <textarea placeholder="내용을 입력해주세요." rows="6"></textarea>
            </div>
          </div>
          <button type="submit" className={style.SubmitButton}>
            접수하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default Oneonone;
