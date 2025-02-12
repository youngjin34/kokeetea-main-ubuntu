import React, { useEffect, useState } from "react";
import style from "./Register.module.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const IdInput = ({ value, onChangeUserId, validId }) => (
  <div className={style.FormGroup}>
    <label>
      아이디<span className={style.required}>*</span>
    </label>
    <div className={style.IdInputGroup}>
      <div className={style.inputWrapper}>
        <input
          type="text"
          name="userId"
          value={value}
          onChange={onChangeUserId}
          placeholder="아이디를 입력해주세요."
        />
        <span
          className={`${style.guideMessage} ${
            validId ? style.errorMessage : ""
          }`}
        >
          아이디는 영문과 숫자로 이루어진 4자 이상 16자 이하여야 합니다.
        </span>
      </div>
    </div>
  </div>
);

const PasswordInput = ({
  value,
  confirmValue,
  onChangeUserPw,
  onConfirmChange,
  validPw,
}) => (
  <>
    <div className={style.FormGroup}>
      <label>
        비밀번호<span className={style.required}>*</span>
      </label>
      <div className={style.PasswordInputGroup}>
        <div className={style.inputWrapper}>
          <input
            type="password"
            name="password"
            value={value}
            onChange={onChangeUserPw}
            placeholder="비밀번호를 입력해주세요."
          />
          <span
            className={`${style.guideMessage} ${
              validPw ? style.errorMessage : ""
            }`}
          >
            비밀번호는 영문, 숫자, 특수 문자를 포함하며, 8자 이상 16자 이하여야
            합니다.
          </span>
        </div>
      </div>
    </div>
    <div className={style.FormGroup}>
      <label>
        비밀번호 확인<span className={style.required}>*</span>
      </label>
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

const NameInput = ({ value, onChange }) => (
  <div className={style.FormGroup}>
    <label>
      이름<span className={style.required}>*</span>
    </label>
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

const PhoneInput = ({ value, onChange }) => {
  const handleNumberOnly = (e) => {
    const numberOnly = e.target.value.replace(/[^0-9]/g, "");
    if (numberOnly.length <= 11) {
      const phone2 = numberOnly.slice(3, 7);
      const phone3 = numberOnly.slice(7, 11);

      const event = {
        target: {
          name: "phoneNumber",
          value: numberOnly,
          phone2: phone2,
          phone3: phone3,
        },
      };
      onChange(event);
    }
  };

  return (
    <div className={style.FormGroup}>
      <label>
        휴대폰 번호<span className={style.required}>*</span>
      </label>
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
          value={value}
          onChange={handleNumberOnly}
          placeholder="'-' 없이 번호만 입력해주세요."
        />
      </div>
    </div>
  );
};

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
      <label>
        이메일<span className={style.required}>*</span>
      </label>
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

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userId: "",
    password: "",
    passwordConfirm: "",
    name: "",
    phoneNumber: "",
    emailId: "",
    emailDomain: "",
    termsChecked: false,
    privacyChecked: false,
  });

  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);

  const [validId, setValidId] = useState(false);
  const [validPw, setValidPw] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEmailDomainChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      emailDomain: e.target.value,
    }));
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const onChangeUserId = (e) => {
    const userIdRegex = /^[a-zA-Z0-9]{4,16}$/;
    if (!e.target.value || userIdRegex.test(e.target.value)) {
      setValidId(false);
    } else {
      setValidId(true);
    }
    setFormData((prev) => ({
      ...prev,
      userId: e.target.value,
    }));
  };

  const onChangeUserPw = (e) => {
    const userPwRegex =
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[~!@#$%^&*()_+{}|:"<>?]).{8,16}$/;
    if (!e.target.value || userPwRegex.test(e.target.value)) {
      setValidPw(false);
    } else {
      setValidPw(true);
    }
    setFormData((prev) => ({
      ...prev,
      password: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 모든 필수 항목 검사
    if (
      !formData.userId ||
      !formData.password ||
      !formData.passwordConfirm ||
      !formData.name ||
      !formData.phoneNumber ||
      !formData.emailId ||
      !formData.emailDomain
    ) {
      alert("모든 필수 항목을 입력해주세요.");
      return;
    }

    // 비밀번호 일치 여부 확인
    if (formData.password !== formData.passwordConfirm) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    // 약관 동의 체크
    if (!formData.termsChecked || !formData.privacyChecked) {
      alert("필수 약관에 모두 동의해주세요.");
      return;
    }

    // 전화번호 분리
    const phone2 = formData.phoneNumber.slice(3, 7);
    const phone3 = formData.phoneNumber.slice(7, 11);

    try {
      const email = `${formData.emailId}@${formData.emailDomain}`; // 이메일 합치기
      const phone = `010-${phone2}-${phone3}`;

      const response = await axios.post("http://localhost:8080/api/members", {
        user_name: formData.userId,
        password: formData.password,
        real_name: formData.name,
        phone: phone,
        email: email,
      });

      if (response.status === 200) {
        localStorage.setItem("phoneNumber", formData.phoneNumber);
        alert("회원가입을 환영합니다. 메인페이지로 이동합니다.");
        navigate("/");
      }
    } catch (error) {
      alert(
        "입력하신 아이디와 이메일은 이미 가입된 회원 입니다.\n다른 내용으로 가입해주세요."
      );
    }
  };

  return (
    <div className={style.Container}>
      <div className={style.FormContainer}>
        <h2 className={style.FormTitle}>회원가입</h2>

        <div className={style.RequiredFieldNotice}>
          <span className={style.required}>*</span> 표시는 필수 입력 사항입니다.
        </div>

        <form className={style.Form}>
          <IdInput
            value={formData.userId}
            onChangeUserId={onChangeUserId}
            validId={validId}
          />

          <PasswordInput
            value={formData.password}
            confirmValue={formData.passwordConfirm}
            onChangeUserPw={onChangeUserPw}
            onConfirmChange={handleChange}
            validPw={validPw}
          />

          <NameInput value={formData.name} onChange={handleChange} />

          <PhoneInput value={formData.phoneNumber} onChange={handleChange} />

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
                  checked={formData.termsChecked}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      termsChecked: e.target.checked,
                    }))
                  }
                  className={style.checkbox}
                />
                <span className={style.requiredText}>[필수]</span> 이용약관에
                동의합니다.
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
                  checked={formData.privacyChecked}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      privacyChecked: e.target.checked,
                    }))
                  }
                  className={style.checkbox}
                />
                <span className={style.requiredText}>[필수]</span> 개인정보
                처리방침에 동의합니다.
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

          <button
            type="submit"
            onClick={handleSubmit}
            className={style.SubmitButton}
          >
            회원가입
          </button>
        </form>
      </div>

      {isTermsModalOpen && (
        <div className={style.modalOverlay}>
          <div className={style.modalContent}>
            <h2 className={style.modalTitle}>이용약관</h2>
            <pre>
              제1조 (목적) 이 약관은 KOKEE TEA(이하 "회사"라 함)가 제공하는
              서비스의 이용조건 및 절차, 회사와 회원 간의 권리, 의무 및 책임사항
              등을 규정함을 목적으로 합니다.
              <br />
              제2조 (약관의 효력과 변경) 1. 이 약관은 서비스를 통하여 이를
              공지하거나 전자메일 등의 방법으로 회원에게 통지함으로써 효력이
              발생합니다. 2. 회사는 필요한 경우 이 약관을 변경할 수 있으며,
              변경된 약관은 제1항과 같은 방법으로 공지 또는 통지함으로써 효력이
              발생합니다.
            </pre>
            <button onClick={() => setIsTermsModalOpen(false)}>닫기</button>
          </div>
        </div>
      )}

      {isPrivacyModalOpen && (
        <div className={style.modalOverlay}>
          <div className={style.modalContent}>
            <h2 className={style.modalTitle}>개인정보처리방침</h2>
            <pre>
              1. 개인정보의 수집 및 이용 목적 회사는 다음의 목적을 위하여
              개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의
              용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 개인정보
              보호법 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행할
              예정입니다.
              <br />
              2. 개인정보의 처리 및 보유기간 회사는 법령에 따른 개인정보
              보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에 동의받은
              개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.
            </pre>
            <button onClick={() => setIsPrivacyModalOpen(false)}>닫기</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;
