import React from "react";
import style from "./Inquiry.module.css";

const Inquiry = () => {
  return (
    <div className={style.Container}>
      <div className={style.MainContent}>
        <div className={style.menu_title}>
          <span className={style.underline}>1:1 문의하기</span>
        </div>
        <p className={style.menu_content}>
          코키티는 접수해 주신 의견에 대해<br />
          신속하게 처리할 수 있도록 최선을 다하겠습니다.
        </p>

        <div className={style.FormContainer}>

          <form className={style.Form}>
            <div className={style.FormGroup}>
              <label>접수 구분</label>
              <div className={style.RadioGroup}>
                <label className={style.RadioItem}>
                  <input
                    type="radio"
                    id="inquiry"
                    name="consultationType"
                    value="문의"
                  />
                  문의
                </label>
                <label className={style.RadioItem}>
                  <input
                    type="radio"
                    id="praise"
                    name="consultationType"
                    value="칭찬"
                  />
                  칭찬
                </label>
                <label className={style.RadioItem}>
                  <input
                    type="radio"
                    id="complaint"
                    name="consultationType"
                    value="불만"
                  />
                  불만
                </label>
              </div>
            </div>

            <div className={style.FormGroup}>
              <label>이름</label>
              <input type="text" placeholder="이름을 입력해주세요." />
            </div>

            <div className={style.FormGroup}>
              <label>연락처</label>
              <input type="tel" placeholder="연락처를 입력해주세요." />
            </div>

            <div className={style.FormGroup}>
              <label>이메일</label>
              <input type="email" placeholder="이메일을 입력해주세요." />
            </div>

            <div className={style.FormGroup}>
              <label>제목</label>
              <input type="text" placeholder="제목을 입력해주세요." />
            </div>

            <div className={style.FormGroup}>
              <label>문의 내용</label>
              <textarea
                placeholder="문의 내용을 입력해주세요."
                rows="6"
              ></textarea>
            </div>

            <button type="submit" className={style.SubmitButton}>
              접수하기
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Inquiry;
