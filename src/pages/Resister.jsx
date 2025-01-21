import React, { useEffect, useState } from "react";
import style from "./Resister.module.css";

// ID 입력 컴포넌트
const IdInput = ({ value, onChange }) => (
  <div className={style.FormGroup}>
    <label>아이디<span className={style.required}>*</span></label>
    <div className={style.IdInputGroup}>
      <input 
        type="text" 
        name="userId"
        value={value}
        onChange={onChange}
        placeholder="아이디를 입력해주세요." 
      />
    </div>
  </div>
);

// 비밀번호 입력 컴포넌트
const PasswordInput = ({ value, onChange, confirmValue, onConfirmChange }) => (
  <>
    <div className={style.FormGroup}>
      <label>비밀번호<span className={style.required}>*</span></label>
      <div className={style.PasswordInputGroup}>
        <input 
          type="password" 
          name="password"
          value={value}
          onChange={onChange}
          placeholder="비밀번호를 입력해주세요." 
        />
      </div>
    </div>
    <div className={style.FormGroup}>
      <label>비밀번호 확인<span className={style.required}></span></label>
      <div className={style.PasswordInputGroup}>
        <input 
          type="password"
          name="passwordConfirm"
          value={confirmValue}
          onChange={onConfirmChange}
          placeholder="비밀번호를 다시 입력해주세요." 
        />
      </div>
    </div>
  </>
);

// 이름 입력 컴포넌트
const NameInput = ({ value, onChange }) => (
  <div className={style.FormGroup}>
    <label>이름<span className={style.required}>*</span></label>
    <div className={style.NameInputGroup}>
      <input 
        type="text" 
        name="name"
        value={value}
        onChange={onChange}
        placeholder="이름을 입력해주세요." 
      />
    </div>
  </div>
);

// 전화번호 입력 컴포넌트
const PhoneInput = ({ prefix, middle, last, onChange }) => (
  <div className={style.FormGroup}>
    <label>휴대폰 번호<span className={style.required}>*</span></label>
    <div className={style.PhoneInputGroup}>
      <select 
        className={style.PhonePrefix}
        name="phonePrefix"
        value={prefix}
        onChange={onChange}
      >
        <option value="010">010</option>
        <option value="011">011</option>
        <option value="016">016</option>
        <option value="017">017</option>
        <option value="018">018</option>
        <option value="019">019</option>
      </select>
      <span className={style.PhoneSeparator}>-</span>
      <input 
        type="text" 
        maxLength="4" 
        name="phoneMiddle"
        value={middle}
        onChange={onChange}
        className={style.PhoneInput} 
      />
      <span className={style.PhoneSeparator}>-</span>
      <input 
        type="text" 
        maxLength="4" 
        name="phoneLast"
        value={last}
        onChange={onChange}
        className={style.PhoneInput} 
      />
    </div>
  </div>
);

// 이메일 입력 컴포넌트
const EmailInput = ({ emailId, emailDomain, onChange, onDomainChange }) => {
  const emailDomains = [
    { value: "", label: "직접입력" },
    { value: "naver.com", label: "naver.com" },
    { value: "gmail.com", label: "gmail.com" },
    { value: "daum.net", label: "daum.net" },
    { value: "hanmail.net", label: "hanmail.net" },
  ];

  return (
    <div className={style.FormGroup}>
      <label>이메일<span className={style.required}>*</span></label>
      <div className={style.EmailInputGroup}>
        <div className={style.EmailGroup}>
          <input
            type="text"
            name="emailId"
            value={emailId}
            onChange={onChange}
            placeholder="이메일"
          />
          <span className={style.EmailAt}>@</span>
          <input
            type="text"
            name="emailDomain"
            value={emailDomain}
            onChange={onChange}
          />
          <select
            value={emailDomain}
            onChange={onDomainChange}
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
    </div>
  );
};

// 메인 Form 컴포넌트
const Resister = () => {
  const [formData, setFormData] = useState({
    userId: '',
    password: '',
    passwordConfirm: '',
    name: '',
    phonePrefix: '010',
    phoneMiddle: '',
    phoneLast: '',
    emailId: '',
    emailDomain: '',
  });

  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [termsChecked, setTermsChecked] = useState(false);
  const [privacyChecked, setPrivacyChecked] = useState(false);

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
          
          <div className={style.RequiredFieldNotice}>
            <span className={style.required}>*</span> 표시는 필수 입력 사항입니다.
          </div>

          <form className={style.Form}>
            <IdInput 
              value={formData.userId}
              onChange={handleChange}
            />
            
            <PasswordInput 
              value={formData.password}
              confirmValue={formData.passwordConfirm}
              onChange={handleChange}
              onConfirmChange={handleChange}
            />
            
            <NameInput 
              value={formData.name}
              onChange={handleChange}
            />
            
            <PhoneInput 
              prefix={formData.phonePrefix}
              middle={formData.phoneMiddle}
              last={formData.phoneLast}
              onChange={handleChange}
            />
            
            <EmailInput 
              emailId={formData.emailId}
              emailDomain={formData.emailDomain}
              onChange={handleChange}
              onDomainChange={handleEmailDomainChange}
            />

            <div>
              <h3 className={style.AgreementTitle}>약관동의</h3>
              <div className={style.FormFooter}>
                <div className={style.AgreementItem}>
                  <input 
                    type="checkbox" 
                    id="terms" 
                    checked={termsChecked}
                    onChange={(e) => setTermsChecked(e.target.checked)}
                    className={style.checkbox}
                  />
                  <span className={style.requiredText}>[필수]</span> 이용약관에 동의합니다.
                  <button 
                    type="button" 
                    className={style.ViewTermsButton} 
                    onClick={() => setIsTermsModalOpen(true)}
                  >
                    이용약관 보기
                  </button>
                </div>
                <div className={style.AgreementItem}>
                  <input 
                    type="checkbox" 
                    id="privacy" 
                    checked={privacyChecked}
                    onChange={(e) => setPrivacyChecked(e.target.checked)}
                    className={style.checkbox}
                  />
                  <span className={style.requiredText}>[필수]</span> 개인정보 처리방침에 동의합니다.
                  <button 
                    type="button" 
                    className={style.ViewTermsButton} 
                    onClick={() => setIsPrivacyModalOpen(true)}
                  >
                    개인정보처리방침 보기
                  </button>
                </div>
              </div>
            </div>

            <button type="submit" className={style.SubmitButton}>
              회원가입
            </button>
          </form>
        </div>
      </div>

      {/* 이용약관 모달 */}
      {isTermsModalOpen && (
        <div className={style.modalOverlay}>
          <div className={style.modalContent}>
            <h2 className={style.modalTitle}>이용약관</h2>
            <pre>
              제1조 (목적)
              이 약관은 KOKEE TEA(이하 "회사"라 함)가 제공하는 서비스의 이용조건 및 절차, 
              회사와 회원 간의 권리, 의무 및 책임사항 등을 규정함을 목적으로 합니다.
              <br />
              제2조 (약관의 효력과 변경)
              1. 이 약관은 서비스를 통하여 이를 공지하거나 전자메일 등의 방법으로 회원에게 통지함으로써 효력이 발생합니다.
              2. 회사는 필요한 경우 이 약관을 변경할 수 있으며, 변경된 약관은 제1항과 같은 방법으로 공지 또는 통지함으로써 효력이 발생합니다.
              {/* 추가 약관 내용 */}
            </pre>
            <button onClick={() => setIsTermsModalOpen(false)}>닫기</button>
          </div>
        </div>
      )}

      {/* 개인정보처리방침 모달 */}
      {isPrivacyModalOpen && (
        <div className={style.modalOverlay}>
          <div className={style.modalContent}>
            <h2 className={style.modalTitle}>개인정보처리방침</h2>
            <pre>
              1. 개인정보의 수집 및 이용 목적
              회사는 다음의 목적을 위하여 개인정보를 처리합니다. 
              처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 
              이용 목적이 변경되는 경우에는 개인정보 보호법 제18조에 따라 별도의 동의를 받는 등 
              필요한 조치를 이행할 예정입니다.
              <br />
              2. 개인정보의 처리 및 보유기간
              회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 
              개인정보를 수집 시에 동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.
              {/* 추가 개인정보처리방침 내용 */}
            </pre>
            <button onClick={() => setIsPrivacyModalOpen(false)}>닫기</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Resister;
