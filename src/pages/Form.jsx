import React, { useEffect, useState } from "react";
import style from "./Form.module.css";

const Form = () => {
  const [formData, setFormData] = useState({
    emailId: '',
    emailDomain: '',
    // ... other form fields ...
  });

  const emailDomains = [
    { value: "", label: "직접입력" },
    { value: "naver.com", label: "naver.com" },
    { value: "gmail.com", label: "gmail.com" },
    { value: "daum.net", label: "daum.net" },
    { value: "hanmail.net", label: "hanmail.net" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEmailDomainChange = (e) => {
    setFormData(prev => ({
      ...prev,
      emailDomain: e.target.value
    }));
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className={style.Container}>
      <div className={style.MainContent}>

        <div className={style.FormContainer}>
          <h2 className={style.FormTitle}>회원가입</h2>

          <form className={style.Form}>
            <div className={style.FormGroup}>
              <label>아이디<span className={style.required}>*</span></label>
              <input type="text" placeholder="아이디를 입력해주세요." />
            </div>

            <div className={style.FormGroup}>
              <label>비밀번호<span className={style.required}>*</span></label>
              <input type="password" placeholder="비밀번호를 입력해주세요." />
            </div>

            <div className={style.FormGroup}>
              <label>비밀번호 확인<span className={style.required}>*</span></label>
              <input type="password" placeholder="비밀번호를 다시 입력해주세요." />
            </div>

            <div className={style.FormGroup}>
              <label>이름<span className={style.required}>*</span></label>
              <input type="text" placeholder="이름을 입력해주세요." />
            </div>

            <div className={style.FormGroup}>
              <label>휴대폰 번호<span className={style.required}>*</span></label>
              <div className={style.PhoneInputGroup}>
                <select className={style.PhonePrefix}>
                  <option value="010">010</option>
                  <option value="011">011</option>
                  <option value="016">016</option>
                  <option value="017">017</option>
                  <option value="018">018</option>
                  <option value="019">019</option>
                </select>
                <span className={style.PhoneSeparator}>-</span>
                <input type="text" maxLength="4" className={style.PhoneInput} />
                <span className={style.PhoneSeparator}>-</span>
                <input type="text" maxLength="4" className={style.PhoneInput} />
              </div>
            </div>

            <div className={style.FormGroup}>
              <label>이메일<span className={style.required}>*</span></label>
              <div className={style.EmailGroup}>
                <input
                  type="text"
                  name="emailId"
                  value={formData.emailId}
                  onChange={handleChange}
                  placeholder="이메일"
                />
                <span className={style.EmailAt}>@</span>
                <input
                  type="text"
                  name="emailDomain"
                  value={formData.emailDomain}
                  onChange={handleChange}
                />
                <select
                  value={formData.emailDomain}
                  onChange={handleEmailDomainChange}
                  className={style.EmailSelect}
                >
                  {emailDomains.map((domain) => (
                    <option key={domain.value} value={domain.value}>
                      {domain.label}
                    </option>
                  ))}
                </select>
              </div>
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

export default Form;
