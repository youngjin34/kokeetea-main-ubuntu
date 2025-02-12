import React, { useState, useEffect } from "react";
import style from "./MemberInfoUpdate.module.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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

  const [withdrawalPaassword, setWithdrawalPaassword] = useState("");

  console.log(formData);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          console.error("토큰이 없습니다");
          navigate("/login");
          return;
        }

        const response = await axios.get(
          `http://localhost:8080/api/members/about`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const userData = response.data;
        console.log("받아온 사용자 데이터:", userData);

        setFormData((prev) => ({
          ...prev,
          name: userData.realName || "",
          id: userData.userName || "",
          phoneNumber: userData.phone || "",
          email: userData.email || "",
          smsReceive: userData.smsReceive || false,
          emailReceive: userData.emailReceive || false,
        }));
      } catch (error) {
        console.error("사용자 정보를 불러오는데 실패했습니다:", error);
        if (error.response) {
          console.error("에러 응답:", error.response.data);
        }
      }
    };

    fetchUserInfo();
  }, [navigate]);

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
      const response = await axios.get(
        `http://localhost:8080/api/members/verify?password=${encodeURIComponent(
          formData.currentPassword
        )}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setIsPasswordVerified(true);
        setWithdrawalPaassword(formData.currentPassword);
        alert("비밀번호가 확인되었습니다.");
      }
    } catch (error) {
      console.error("비밀번호 확인 중 오류 발생:", error);
      alert("현재 비밀번호가 일치하지 않습니다.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.newPassword) {
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
      const response = await axios.patch(
        "http://localhost:8080/api/members",
        {
          real_name: formData.realName,
          password: formData.newPassword || undefined,
          phone: formData.phoneNumber,
          email: formData.email,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        alert("회원정보가 성공적으로 수정되었습니다.");
        navigate("/mypage");
      }
    } catch (error) {
      console.error("회원정보 수정 중 오류 발생:", error);
      const errorMessage =
        error.response?.data?.message || "회원정보 수정에 실패했습니다.";
      alert(errorMessage);
    }
  };

  const handleWithdrawal = async () => {
    if (!isPasswordVerified) {
      alert("비밀번호 확인을 먼저 해주세요.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await axios.delete(
        `http://localhost:8080/api/members/${
          formData.id
        }?password=${encodeURIComponent(withdrawalPaassword)}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);

      if (response.status === 200) {
        alert("회원 탈퇴가 완료되었습니다.");
        localStorage.clear();
        navigate("/");
      } else {
        alert("회원 탈퇴에 실패했습니다.");
      }
    } catch (error) {
      console.error("회원 탈퇴 중 오류 발생:", error);
      alert("회원 탈퇴 중 오류가 발생했습니다.");
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

            <button
              type="button"
              className={style.withdrawalButton}
              onClick={() => {
                if (
                  window.confirm(
                    "정말 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다."
                  )
                ) {
                  handleWithdrawal();
                }
              }}
            >
              회원 탈퇴
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
