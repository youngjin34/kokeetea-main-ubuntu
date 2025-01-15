import React from "react";
import style from "./Affiliated.module.css";

const Affiliated = () => {
  return (
    <div className={style.Container}>
      <div className={style.MainContent}>
        <div className={style.menu_title}>
          <span className={style.underline}>AFFILIATED</span>
        </div>
        <p className={style.menu_content}>
          코키티 가맹 문의는 '1:1 맞춤' 상담으로 진행됩니다. <br />
          가맹 상담부터 오픈, 사후관리까지 토탈 서비스를 지원합니다.
        </p>

        <div className={style.FormContainer}>
          <h2 className={style.FormTitle}>기본정보</h2>

          <form className={style.Form}>
            <div className={style.FormGroup}>
              <label>상담내용</label>
              <div className={style.RadioGroup}>
                <label className={style.RadioItem}>
                  <input
                    type="radio"
                    name="consultationType"
                    value="가맹상담"
                  />
                  가맹상담
                </label>
                <label className={style.RadioItem}>
                  <input
                    type="radio"
                    name="consultationType"
                    value="입점제안"
                  />
                  입점제안
                </label>
                <label className={style.RadioItem}>
                  <input
                    type="radio"
                    name="consultationType"
                    value="기타문의"
                  />
                  기타문의
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
              <label>희망 지역</label>
              <input type="text" placeholder="희망 지역을 입력해주세요." />
            </div>

            <div className={style.FormGroup}>
              <label>문의 내용</label>
              <textarea
                placeholder="문의 내용을 입력해주세요."
                rows="6"
              ></textarea>
            </div>

            <div className={style.FormFooter}>
              <div className={style.CheckboxGroup}>
                <label>
                  <span style={{ color: "#ba274a" }}>[필수]</span> 이용약관에
                  동의합니다.
                </label>
              </div>
              <div className={style.ButtonGroup}>
                <div className={style.RadioGroup}>
                  <div className={style.RadioItem}>
                    <input
                      type="radio"
                      id="agree"
                      name="agreement"
                      value="동의함"
                    />
                    <label htmlFor="agree">동의함</label>
                  </div>
                  <div className={style.RadioItem}>
                    <input
                      type="radio"
                      id="disagree"
                      name="agreement"
                      value="동의안함"
                    />
                    <label htmlFor="disagree">동의안함</label>
                  </div>
                </div>
              </div>
            </div>
            <div className={style.TermsContainer}>
              <div className={style.TermsContent}>
                제1조 (목적) 본 약관은 [회사명]이 제공하는 서비스의 이용조건 및
                절차, 이용자와 당사의 권리, 의무, 책임사항과 기타 필요한 사항을
                규정함을 목적으로 합니다. 제2조 (용어의 정의)
              </div>
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

export default Affiliated;
