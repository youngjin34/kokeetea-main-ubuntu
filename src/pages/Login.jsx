import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css';
import axios from 'axios';

const Login = ({ onClose, setIsLogined, setHeaderLogined }) => {
  const navigate = useNavigate();
  const [isSignUpActive, setIsSignUpActive] = useState(false);
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUpClick = () => {
    setIsSignUpActive(true);
  };

  const handleSignInClick = () => {
    setIsSignUpActive(false);
  };

  const handleRegisterClick = () => {
    navigate('/register');
    onClose();
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const result = await axios.post("http://localhost:8080/kokee/login", {
        userName: userName,
        password: password,
      });

      if (result.status === 200) {
        localStorage.setItem("userName", userName);
        localStorage.setItem("realname", result.data.name);
        localStorage.setItem("email", result.data.email);
        alert(`${result.data.name}님 환영합니다!`);
        setIsLogined(true);
        setHeaderLogined(true);
        onClose();
      }
    } catch (error) {
      alert("아이디와 비밀번호를 확인해주세요");
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={`${styles.container} ${isSignUpActive ? styles.rightPanelActive : ''}`}>
        <div className={`${styles.formContainer} ${styles.signUpContainer}`}>
          <form className={styles.form} onSubmit={handleLogin}>
            <h2 className={styles.LoginTitle}>점주 로그인</h2>
            <input 
              className={styles.input} 
              type="text" 
              placeholder="아이디" 
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
            <input 
              className={styles.input} 
              type="password" 
              placeholder="비밀번호" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <a href="#" className={styles.link}>비밀번호를 잊으셨나요?</a>
            <div className={styles.buttonContainer}>
              <button className={styles.button}>로그인</button>
            </div>
          </form>
        </div>
        <div className={`${styles.formContainer} ${styles.signInContainer}`}>
          <form className={styles.form} onSubmit={handleLogin}>
            <h2 className={styles.LoginTitle}>일반 로그인</h2>
            <div className={styles.socialContainer}>
              <a href="#" className={`${styles.socialLink} ${styles.kakao}`}>
                <span className={styles.socialText}>Kakao</span>
              </a>
              <a href="#" className={`${styles.socialLink} ${styles.naver}`}>
                <span className={styles.socialText}>Naver</span>
              </a>
            </div>
            <span className={styles.socialText}>또는, 계정으로 로그인해주세요</span>
            <input 
              className={styles.input} 
              type="text" 
              placeholder="아이디" 
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
            <input 
              className={styles.input} 
              type="password" 
              placeholder="비밀번호" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <a href="#" className={styles.link}>비밀번호를 잊으셨나요?</a>
            <div className={styles.buttonContainer}>
              <button className={styles.button}>로그인</button>
              <button 
                type="button"
                className={styles.button}
                onClick={handleRegisterClick}
              >
                회원가입
              </button>
            </div>
          </form>
        </div>
        <div className={styles.overlayContainer}>
          <div className={styles.overlay}>
            <div className={`${styles.overlayPanel} ${styles.overlayLeft}`}>
              <h1>일반 로그인</h1>
              <p>일반 계정으로 로그인하시려면 아래를 클릭해주세요</p>
              <button className={styles.ownerButton} onClick={handleSignInClick}>일반 로그인</button>
            </div>
            <div className={`${styles.overlayPanel} ${styles.overlayRight}`}>
              <h1>혹시 점주님이신가요?</h1>
              <p>점주님 계정으로 로그인하시려면 아래를 클릭해주세요</p>
              <button className={styles.ownerButton} onClick={handleSignUpClick}>점주 로그인</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
