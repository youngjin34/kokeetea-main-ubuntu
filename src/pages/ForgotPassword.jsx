import React, { useState } from "react";
import axios from "axios";
import style from "./ForgotPassword.module.css";

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [userId, setUserId] = useState("");
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSendVerification = async (e) => {
    e.preventDefault();
    try {
      setMessage("");
      const response = await axios.post(
        "http://spring.mirae.network:8080/kokee/password/request",
        {
          userId: userId,
          email: email,
        }
      );
      if (response.data && response.data.success) {
        setMessage("인증번호가 이메일로 전송되었습니다.");
        setStep(2);
      } else {
        setMessage(response.data.message || "인증번호 전송에 실패했습니다.");
      }
    } catch (error) {
      setMessage(
        error.response?.data?.message || "사용자 정보를 찾을 수 없습니다."
      );
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    try {
      setMessage("");
      const response = await axios.post(
        "http://spring.mirae.network:8080/kokee/password/verify",
        {
          userId: userId,
          code: verificationCode,
        }
      );
      if (response.data && response.data.success) {
        setStep(3);
        setMessage("인증이 완료되었습니다.");
      } else {
        setMessage(response.data.message || "인증번호 확인에 실패했습니다.");
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "잘못된 인증번호입니다.");
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) {
      setMessage("비밀번호를 입력해주세요.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage("비밀번호가 일치하지 않습니다.");
      return;
    }
    if (newPassword.length < 8) {
      setMessage("비밀번호는 8자 이상이어야 합니다.");
      return;
    }
    try {
      setMessage("");
      const response = await axios.post(
        "http://spring.mirae.network:8080/kokee/password/reset",
        {
          userId: userId,
          newPassword: newPassword,
          code: verificationCode,
        }
      );
      if (response.data && response.data.success) {
        setMessage(
          "비밀번호가 성공적으로 변경되었습니다. 잠시 후 로그인 페이지로 이동합니다."
        );
        setTimeout(() => {
          window.location.href = "/login";
        }, 3000);
      } else {
        setMessage(response.data.message || "비밀번호 변경에 실패했습니다.");
      }
    } catch (error) {
      setMessage(
        error.response?.data?.message || "비밀번호 변경에 실패했습니다."
      );
    }
  };

  return (
    <div className={style.container}>
      <div className={style.formContainer}>
        <h2>비밀번호 찾기</h2>
        {message && <p className={style.message}>{message}</p>}

        {step === 1 && (
          <form onSubmit={handleSendVerification}>
            <div className={style.inputGroup}>
              <input
                type="text"
                placeholder="아이디를 입력해주세요."
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                required
              />
            </div>
            <div className={style.inputGroup}>
              <input
                type="email"
                placeholder="이메일을 입력해주세요."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button type="submit" className={style.button}>
              인증번호 받기
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyCode}>
            <div className={style.inputGroup}>
              <input
                type="text"
                placeholder="인증번호 입력"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                required
              />
            </div>
            <button type="submit" className={style.button}>
              인증번호 확인
            </button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handlePasswordReset}>
            <div className={style.inputGroup}>
              <input
                type="password"
                placeholder="새 비밀번호"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <div className={style.inputGroup}>
              <input
                type="password"
                placeholder="새 비밀번호 확인"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className={style.button}>
              비밀번호 변경
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
