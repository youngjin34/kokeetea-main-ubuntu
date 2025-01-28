import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import style from './Login.module.css';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';


const Login = ({ onClose, setIsLogined, setHeaderLogined }) => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isSignUpActive, setIsSignUpActive] = useState(false);
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

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

  const handleForgotPassword = () => {
    navigate('/forgot-password');
    onClose();
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(userName, password);
      
      // localStorage의 장바구니 데이터 확인
      const localCart = JSON.parse(localStorage.getItem("cart")) || [];
      
      if (localCart.length > 0) {
        // 서버에 장바구니 데이터 전송
        const token = localStorage.getItem('token');
        
        for (const item of localCart) {
          try {
            await fetch('http://localhost:8080/kokee/carts', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({
                productId: item.product.pdId,
                quantity: item.quantity,
                options: `${item.options.temp}, ${item.options.whipping}, ${item.options.pearl}, ${item.options.shots}`,
                price: item.product.pdPrice
              })
            });
          } catch (error) {
            console.error("장바구니 동기화 실패:", error);
          }
        }
        
        // localStorage의 장바구니 데이터 삭제
        localStorage.removeItem("cart");
      }

      setIsLogined(true);
      setHeaderLogined(true);
      onClose();
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const checkAdminStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsAdmin(false);
        return;
      }
      
      const response = await axios.get('http://localhost:8080/kokee/member/check-admin', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setIsAdmin(response.data.isAdmin);
      localStorage.setItem("isAdmin", response.data.isAdmin);
    } catch (error) {
      console.error('관리자 확인 실패:', error);
      setIsAdmin(false);
    }
  };

  return (
    <div className={style.pageContainer}>
      <div className={`${style.container} ${isSignUpActive ? style.rightPanelActive : ''}`}>
        <div className={`${style.formContainer} ${style.signUpContainer}`}>
          <form className={style.form} onSubmit={handleLogin}>
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
          <form className={style.form} onSubmit={handleLogin}>
            <h2 className={style.LoginTitle}>일반 로그인</h2>
            <div className={style.socialContainer}>
              <a href="#" className={`${style.socialLink} ${style.kakao}`}>
                <span className={style.socialText}>Kakao</span>
              </a>
              <a href="#" className={`${style.socialLink} ${style.naver}`}>
                <span className={style.socialText}>Naver</span>
              </a>
            </div>
            <span className={style.socialText}>또는, 계정으로 로그인해주세요</span>
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
              <button className={style.ownerButton} onClick={handleSignInClick}>일반 로그인</button>
            </div>
            <div className={`${style.overlayPanel} ${style.overlayRight}`}>
              <h1>혹시 점주님이신가요?</h1>
              <p>점주님 계정으로 로그인하시려면 아래를 클릭해주세요</p>
              <button className={style.ownerButton} onClick={handleSignUpClick}>점주 로그인</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
