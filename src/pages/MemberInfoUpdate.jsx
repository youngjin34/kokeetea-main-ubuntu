import React, { useState, useEffect } from "react";
import style from "./MemberInfoUpdate.module.css";
import { useNavigate } from "react-router-dom";

const MemberInfoUpdate = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const navigate = useNavigate();
  const currentPath = window.location.pathname;
  const [formData, setFormData] = useState({
    name: "",
    id: "",
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
    phoneNumber: "",
    email: "",
    smsReceive: true,
    emailReceive: true,
  });
  const [validPw, setValidPw] = useState(false);
  const [isPasswordVerified, setIsPasswordVerified] = useState(false);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("토큰이 없습니다");
          return;
        }

        const response = await fetch(
          "http://localhost:8080/kokee/member_info",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error("서버 응답 실패");
        }

        const userData = await response.json();

        setFormData((prev) => ({
          ...prev,
          name: userData.realName || "",
          id: userData.userName || "",
          email: userData.email || "",
          phoneNumber: userData.phoneNumber || "",
        }));
      } catch (error) {
        console.error("사용자 정보를 불러오는데 실패했습니다:", error);
      }
    };

    fetchUserInfo();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]:
        type === "checkbox"
          ? checked
          : type === "radio"
          ? value === "true"
          : value,
    }));

    if (name === "newPassword") {
      const passwordRegex =
        /^(?=.*[a-zA-Z])(?=.*[0-9!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{10,16}$/;
      setValidPw(!passwordRegex.test(value));
    }
  };

  const verifyCurrentPassword = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("토큰이 없습니다");
        return;
      }

      const response = await fetch(
        "http://localhost:8080/kokee/verify-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
          body: JSON.stringify({
            currentPassword: formData.currentPassword,
          }),
        }
      );

      if (response.ok) {
        alert("현재 비밀번호가 확인되었습니다.");
        setIsPasswordVerified(true);
      } else {
        alert("현재 비밀번호가 일치하지 않습니다.");
        setIsPasswordVerified(false);
        setFormData((prev) => ({
          ...prev,
          currentPassword: "",
        }));
      }
    } catch (error) {
      console.error("비밀번호 확인 중 오류 발생:", error);
      alert("비밀번호 확인 중 오류가 발생했습니다.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 비밀번호 변경 시 유효성 검사
    if (formData.newPassword || formData.confirmNewPassword) {
      if (!isPasswordVerified) {
        alert("현재 비밀번호를 먼저 확인해주세요.");
        return;
      }

      if (validPw) {
        alert("새 비밀번호가 형식에 맞지 않습니다.");
        return;
      }

      if (formData.newPassword !== formData.confirmNewPassword) {
        alert("새 비밀번호와 확인 비밀번호가 일치하지 않습니다.");
        return;
      }
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:8080/kokee/update-member",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
          body: JSON.stringify({
            ...formData,
            password: formData.newPassword || undefined,
          }),
        }
      );

      if (response.ok) {
        alert("회원정보가 성공적으로 수정되었습니다.");
        navigate("/memberinfoupdate");
      } else {
        const errorData = await response.json();
        alert(errorData.message || "회원정보 수정에 실패했습니다.");
      }
    } catch (error) {
      console.error("회원정보 수정 중 오류 발생:", error);
      alert("회원정보 수정 중 오류가 발생했습니다.");
    }
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  const formatPhoneNumber = (phoneNumber) => {
    if (!phoneNumber) return "";

    // 숫자만 추출
    const numbers = phoneNumber.replace(/[^0-9]/g, "");

    // 11자리 번호인 경우
    if (numbers.length === 11) {
      return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(
        7
      )}`;
    }
    return numbers;
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
                disabled={isPasswordVerified}
              />
              <button
                className={style.confirmButton}
                onClick={verifyCurrentPassword}
                disabled={isPasswordVerified}
              >
                확인
              </button>
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
                  disabled={!isPasswordVerified}
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
            <div className={style.formGroup} style={{ marginBottom: "0" }}>
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
                disabled={!isPasswordVerified}
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
                value={formatPhoneNumber(formData.phoneNumber)}
                onChange={(e) => {
                  const numbers = e.target.value.replace(/[^0-9]/g, "");
                  setFormData((prev) => ({
                    ...prev,
                    phoneNumber: numbers,
                  }));
                }}
                className={style.input}
                maxLength="13"
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

            <div className={style.formGroup} style={{ marginBottom: "0" }}>
              <label className={style.label}>SMS 수신</label>
              <div className={style.RadioGroup}>
                <div className={style.RadioItem}>
                  <input
                    type="radio"
                    id="smsReceiveYes"
                    name="smsReceive"
                    checked={formData.smsReceive}
                    onChange={handleInputChange}
                    value="true"
                  />
                  <label htmlFor="smsReceiveYes">수신함</label>
                </div>
                <div className={style.RadioItem}>
                  <input
                    type="radio"
                    id="smsReceiveNo"
                    name="smsReceive"
                    checked={!formData.smsReceive}
                    onChange={handleInputChange}
                    value="false"
                  />
                  <label htmlFor="smsReceiveNo">수신 안 함</label>
                </div>
              </div>
              <p className={style.receiveText}>
                * 코키티에서 제공되는 소식을 SMS로 받으실 수 있습니다.
              </p>
            </div>
            <div className={style.formGroup} style={{ marginBottom: "0" }}>
              <label className={style.label}>이메일 수신</label>
              <div className={style.RadioGroup}>
                <div className={style.RadioItem}>
                  <input
                    type="radio"
                    id="emailReceiveYes"
                    name="emailReceive"
                    checked={formData.emailReceive}
                    onChange={handleInputChange}
                    value="true"
                  />
                  <label htmlFor="emailReceiveYes">수신함</label>
                </div>
                <div className={style.RadioItem}>
                  <input
                    type="radio"
                    id="emailReceiveNo"
                    name="emailReceive"
                    checked={!formData.emailReceive}
                    onChange={handleInputChange}
                    value="false"
                  />
                  <label htmlFor="emailReceiveNo">수신 안 함</label>
                </div>
              </div>
              <p className={style.receiveText}>
                * 코키티에서 제공되는 소식을 이메일로 받으실 수 있습니다.
              </p>
            </div>
          </div>
          <div className={style.formActions}>
            <button type="button" className={style.cancelButton}>
              취소
            </button>
            <button
              type="submit"
              className={style.confirmButton}
              onClick={handleSubmit}
            >
              확인
            </button>
          </div>
        </div>

        <div className={style.sideNav}>
          <div
            className={`${style.sideNavItem} ${
              currentPath === "/memberinfoupdate" ? style.active : ""
            }`}
            onClick={() => handleNavigation("/memberinfoupdate")}
          >
            회원정보 확인 · 수정
          </div>
          <div
            className={`${style.sideNavItem} ${
              currentPath === "/couponstamp" ? style.active : ""
            }`}
            onClick={() => handleNavigation("/couponstamp")}
          >
            쿠폰 · 스탬프 조회
          </div>
          <div
            className={`${style.sideNavItem} ${
              currentPath === "/orderhistory" ? style.active : ""
            }`}
            onClick={() => handleNavigation("/orderhistory")}
          >
            주문내역 조회
          </div>
          <div
            className={`${style.sideNavItem} ${
              currentPath === "/inquiryhistory" ? style.active : ""
            }`}
            onClick={() => handleNavigation("/inquiryhistory")}
          >
            1:1 문의 내역
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberInfoUpdate;
