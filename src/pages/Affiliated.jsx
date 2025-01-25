import React, { useEffect } from "react";
import style from "./Affiliated.module.css";

const Affiliated = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
                    defaultChecked
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
              <div className={style.PhoneInputGroup}>
                <select className={style.PhonePrefix}>
                  <option value="SKT">SKT</option>
                  <option value="KT">KT</option>
                  <option value="LG">LG</option>
                </select>
                <span className={style.PhoneSeparator}></span>
                <input
                  type="text"
                  maxLength="11"
                  className={style.PhoneInput}
                  onChange={(e) =>
                    (e.target.value = e.target.value.replace(/[^0-9]/g, ""))
                  }
                />
              </div>
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
                      defaultChecked
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
                제1조 (목적) 이 약관은 KOKEE TEA(이하 "회사"라 함)가 제공하는
                서비스의 이용조건 및 절차, 회사와 회원 간의 권리, 의무 및
                책임사항 등을 규정함을 목적으로 합니다.<br/>제2조 (약관의 효력과
                변경) 1. 이 약관은 서비스를 통하여 이를 공지하거나 전자메일 등의
                방법으로 회원에게 통지함으로써 효력이 발생합니다. 2. 회사는
                필요한 경우 이 약관을 변경할 수 있으며, 변경된 약관은 제1항과
                같은 방법으로 공지 또는 통지함으로써 효력이 발생합니다.
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
