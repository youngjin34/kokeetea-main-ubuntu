import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import style from "./Login.module.css";
import axios from "axios";
import { toast, Slide } from "react-toastify";

const Login = ({ onClose, setIsLogined, setHeaderLogined, onLoginSuccess }) => {
  const navigate = useNavigate();
  const [isSignUpActive, setIsSignUpActive] = useState(false);
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const handleSignUpClick = () => {
    setIsSignUpActive(true);
  };

  const handleSignInClick = () => {
    setIsSignUpActive(false);
  };

  const handleRegisterClick = () => {
    navigate("/register");
    onClose();
  };

  const handleForgotPassword = () => {
    navigate("/forgot-password");
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await axios.get(
        `http://localhost:8080/api/members/login?userName=${userName}&password=${encodeURIComponent(
          password
        )}`
      );

      if (result.status === 200) {
        localStorage.setItem("token", result.data.token);

        toast(`${result.data.name}님 환영합니다!`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          transition: Slide,
        });

        window.location.reload();
        handleLoginSuccess();
      }
    } catch (error) {
      toast("아이디와 비밀번호를 확인해주세요", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Slide,
      });
    }
  };

  const checkAdminStatus = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsAdmin(false);
        return;
      }

      const response = await axios.get(
        "http://localhost:8080/kokee/member/check-admin",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setIsAdmin(response.data.isAdmin);
      localStorage.setItem("isAdmin", response.data.isAdmin);
    } catch (error) {
      console.error("관리자 확인 실패:", error);
      setIsAdmin(false);
    }
  };

  const handleLoginSuccess = () => {
    setIsLogined(true);
    setHeaderLogined(true);
    onLoginSuccess?.();
  };

  return (
    <div className={style.pageContainer}>
      <div
        className={`${style.container} ${
          isSignUpActive ? style.rightPanelActive : ""
        }`}
      >
        <div className={`${style.formContainer} ${style.signUpContainer}`}>
          <form className={style.form} onSubmit={handleSubmit}>
            <h2 className={style.LoginTitle}>점주 로그인</h2>
            <input
              className={style.input}
              type="text"
              placeholder="아이디"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
            <input
              className={style.input}
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={handleForgotPassword}
              className={style.link}
            >
              비밀번호를 잊으셨나요?
            </button>
            <div className={style.buttonContainer}>
              <button className={style.button}>로그인</button>
            </div>
          </form>
        </div>
        <div className={`${style.formContainer} ${style.signInContainer}`}>
          <form className={style.form} onSubmit={handleSubmit}>
            <h2 className={style.LoginTitle}>일반 로그인</h2>
            <div className={style.socialContainer}>
              <a href="#" className={`${style.socialLink} ${style.kakao}`}>
                <span className={style.socialText}>Kakao</span>
              </a>
              <a href="#" className={`${style.socialLink} ${style.naver}`}>
                <span className={style.socialText}>Naver</span>
              </a>
            </div>
            <span className={style.socialText}>
              또는, 계정으로 로그인해주세요
            </span>
            <input
              className={style.input}
              type="text"
              placeholder="아이디"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
            <input
              className={style.input}
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={handleForgotPassword}
              className={style.link}
            >
              비밀번호를 잊으셨나요?
            </button>
            <div className={style.buttonContainer}>
              <button className={style.button}>로그인</button>
              <button
                type="button"
                className={style.button}
                onClick={handleRegisterClick}
              >
                회원가입
              </button>
            </div>
          </form>
        </div>
        <div className={style.overlayContainer}>
          <div className={style.overlay}>
            <div className={`${style.overlayPanel} ${style.overlayLeft}`}>
              <h1>일반 로그인</h1>
              <p>일반 계정으로 로그인하시려면 아래를 클릭해주세요</p>
              <button className={style.ownerButton} onClick={handleSignInClick}>
                일반 로그인
              </button>
            </div>
            <div className={`${style.overlayPanel} ${style.overlayRight}`}>
              <h1>혹시 점주님이신가요?</h1>
              <p>점주님 계정으로 로그인하시려면 아래를 클릭해주세요</p>
              <button className={style.ownerButton} onClick={handleSignUpClick}>
                점주 로그인
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
