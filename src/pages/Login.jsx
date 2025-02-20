import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import style from "./Login.module.css";
import axios from "axios";
import { toast, Slide } from "react-toastify";

const Login = ({ onClose, setIsLogined, onLoginSuccess }) => {
  const navigate = useNavigate();
  const [isSignUpActive, setIsSignUpActive] = useState(false);
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await axios.get(
        `http://spring.mirae.network:8080/api/members/login?userName=${userName}&password=${encodeURIComponent(
          password
        )}`
      );

      if (result.status === 200) {
        localStorage.setItem("token", result.data.token);
        localStorage.setItem("authority", result.data.authority);

        setIsLogined(true);
        onLoginSuccess?.();

        toast(`${result.data.user_name}님 환영합니다!`, {
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

        navigate("/");
        window.location.reload();
      }
    } catch (error) {
      console.error(error);

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

  const handleAdminSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await axios.post(
        `http://spring.mirae.network:8082/api/branches/login`,
        { email: userName, password: password }
      );

      if (result.status === 200) {
        const token = result.data.token;
        const authority = result.data.authority;
        const branchId = result.data.branch_id;
        const branchName = result.data.branch_name;

        toast(`${result.data.user_name}님 환영합니다!`, {
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

        window.location.href = `http://web4.mirae.network?token=${token}&authority=${authority}&branchId=${branchId}&branchName=${branchName}`;
      }
    } catch (error) {
      console.error(error);

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

  const NAVER_CLIENT_ID = import.meta.env.VITE_NAVER_CLIENT_ID;
  const NAVER_REDIRECT_URI = import.meta.env.VITE_NAVER_REDIRECT_URI;

  const NAVER_AUTH_URL = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${NAVER_CLIENT_ID}&redirect_uri=${NAVER_REDIRECT_URI}`;

  return (
    <div className={style.pageContainer}>
      <div
        className={`${style.container} ${
          isSignUpActive ? style.rightPanelActive : ""
        }`}
      >
        <div className={`${style.formContainer} ${style.signUpContainer}`}>
          <form className={style.form}>
            <h2 className={style.LoginTitle}>관리자 페이지로 이동하기</h2>

            <div className={style.buttonContainer}>
              <button
                className={style.button}
                onClick={() =>
                  (window.location.href = "http://web4.mirae.network/login")
                }
              >
                관리자 페이지
              </button>
            </div>
          </form>
        </div>

        <div className={`${style.formContainer} ${style.signInContainer}`}>
          <form className={style.form}>
            <h2 className={style.LoginTitle}>일반 로그인</h2>
            <div className={style.socialContainer}>
              <a
                href={NAVER_AUTH_URL}
                className={`${style.socialLink} ${style.naver}`}
              >
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
            <div className={style.buttonContainer}>
              <button className={style.button} onClick={handleSubmit}>
                로그인
              </button>
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
