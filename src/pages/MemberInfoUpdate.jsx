import React, { useState } from "react";
import style from "./MemberInfoUpdate.module.css";
import { useNavigate } from "react-router-dom";

const MemberInfoUpdate = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "홍길동",
    id: "test123@email.com",
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
    phoneNumber: "010-1234-5678",
    email: "test123@email.com",
    smsReceive: true,
    emailReceive: true,
  });
  const [validPw, setValidPw] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (name === "newPassword") {
      const passwordRegex =
        /^(?=.*[a-zA-Z])(?=.*[0-9!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{10,16}$/;
      setValidPw(!passwordRegex.test(value));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className={style.container}>
      <div className={style.title}>회원정보 확인·수정</div>
      <div className={style.content}>
        <div className={style.formContainer}>
          <div className={style.basicInfo}>
            <h2 className={style.sectionTitle}>기본 정보</h2>
            <div className={style.formGroup}>
              <label htmlFor="name" className={style.label}>
                이름
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`${style.nameInput} ${style.readOnlyInput}`}
                readOnly
              />
            </div>
            <div className={style.formGroup}>
              <label htmlFor="id" className={style.label}>
                아이디
              </label>
              <input
                type="text"
                id="id"
                name="id"
                value={formData.id}
                onChange={handleInputChange}
                className={`${style.idInput} ${style.readOnlyInput}`}
                readOnly
              />
            </div>
            <div className={style.formGroup}>
              <label htmlFor="currentPassword" className={style.label}>
                현재 비밀번호
              </label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleInputChange}
                className={style.input}
              />
              <button className={style.confirmButton}>확인</button>
            </div>
            <div className={style.formGroup}>
              <label htmlFor="newPassword" className={style.label}>
                변경 비밀번호
              </label>
              <div className={style.inputWrapper}>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  className={style.input}
                />
                <span
                  className={`${style.guideMessage} ${
                    validPw ? style.errorMessage : ""
                  }`}
                >
                  * 영문 대소문자/숫자/특수문자 중 2가지 이상 조합, 10자~16자
                </span>
              </div>
            </div>
            <div className={style.formGroup}>
              <label htmlFor="confirmNewPassword" className={style.label}>
                비밀번호 확인
              </label>
              <input
                type="password"
                id="confirmNewPassword"
                name="confirmNewPassword"
                value={formData.confirmNewPassword}
                onChange={handleInputChange}
                className={style.input}
              />
            </div>
          </div>

          <div className={style.additionalInfo}>
            <h2 className={style.sectionTitle}>부가 정보</h2>
            <div className={style.formGroup}>
              <label htmlFor="phoneNumber" className={style.label}>
                휴대폰 번호
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className={style.input}
              />
            </div>
            <div className={style.formGroup}>
              <label htmlFor="email" className={style.label}>
                이메일
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={style.input}
              />
            </div>

            <div className={style.formGroup}>
              <label className={style.label}>SMS 수신</label>
              <div className={style.RadioGroup}>
                <div className={style.RadioItem}>
                  <input
                    type="radio"
                    id="smsReceive"
                    name="smsReceive"
                    value="수신함"
                  />
                  <label htmlFor="smsReceive">수신함</label>
                </div>
                <div className={style.RadioItem}>
                  <input
                    type="radio"
                    id="smsReceive"
                    name="smsReceive"
                    value="수신 안 함"
                  />
                  <label htmlFor="smsReceive">수신 안 함</label>
                </div>
              </div>
              <p className={style.receiveText}>
                * 코키티에서 제공되는 소식을 SMS로 받으실 수 있습니다.
              </p>
            </div>
            <div className={style.formGroup}>
              <label className={style.label}>이메일 수신</label>
              <div className={style.RadioGroup}>
                <div className={style.RadioItem}>
                  <input
                    type="radio"
                    id="emailReceive"
                    name="emailReceive"
                    value="수신함"
                  />
                  <label htmlFor="emailReceive">수신함</label>
                </div>
                <div className={style.RadioItem}>
                  <input
                    type="radio"
                    id="emailReceive"
                    name="emailReceive"
                    value="수신 안 함"
                  />
                  <label htmlFor="emailReceive">수신 안 함</label>
                </div>
              </div>
              <p className={style.receiveText}>
                * 코키티에서 제공되는 소식을 이메일로 받으실 수 있습니다.
              </p>
            </div>
          </div>
          <div className={style.formActions}>
            <button
              type="submit"
              className={style.confirmButton}
              onClick={handleSubmit}
            >
              확인
            </button>
            <button type="button" className={style.cancelButton}>
              취소
            </button>
          </div>
        </div>

        <div className={style.sideNav}>
          <div 
            className={style.sideNavItem} 
            onClick={() => handleNavigation('/memberinfoupdate')}
          >
            회원정보 확인 · 수정
          </div>
          <div 
            className={style.sideNavItem}
            onClick={() => handleNavigation('/couponstamp')}
          >
            쿠폰 · 스탬프 조회
          </div>
          <div 
            className={style.sideNavItem}
            onClick={() => handleNavigation('/orderhistory')}
          >
            주문내역 조회
          </div>
          <div 
            className={style.sideNavItem}
            onClick={() => handleNavigation('/inquiryhistory')}
          >
            1:1 문의 내역
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberInfoUpdate;
