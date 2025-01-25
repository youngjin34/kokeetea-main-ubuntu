import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast, Slide } from 'react-toastify';

// AuthContext 생성
const AuthContext = createContext();

// AuthContext Provider 컴포넌트
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // 로그인 함수
  const login = async (userName, password) => {
    try {
      const result = await axios.post("http://localhost:8080/kokee/login", {
        userName: userName,
        password: password,
      });

      if (result.status === 200) {
        // 전화번호 형식 통일
        const phoneNumber = `${result.data.phone01}-${result.data.phone02}-${result.data.phone03}`;

        const userData = {
          userName: userName,
          name: result.data.name,
          email: result.data.email,
          phoneNumber: phoneNumber,
        };

        // localStorage에 저장
        localStorage.setItem("userName", userName);
        localStorage.setItem("realname", result.data.name);
        localStorage.setItem("email", result.data.email);
        localStorage.setItem("phoneNumber", phoneNumber);
        localStorage.setItem("token", result.data.token);

        setCurrentUser(userData);
        await checkAdminStatus();

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

        return userData;
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
      throw error;
    }
  };

  // 로그아웃 함수
  const logout = async () => {
    try {
      localStorage.removeItem("userName");
      localStorage.removeItem("realname");
      localStorage.removeItem("email");
      localStorage.removeItem("token");
      localStorage.removeItem("isAdmin");
      localStorage.removeItem("phoneNumber");
      setCurrentUser(null);
      setIsAdmin(false);
    } catch (error) {
      console.error("로그아웃 중 오류 발생:", error);
      throw error;
    }
  };

  // 회원가입 함수
  const signup = async (formData) => {
    try {
      const response = await axios.post("http://localhost:8080/kokee/join", {
        userId: formData.userId,
        userPw: formData.password,
        userPwCheck: formData.passwordConfirm,
        userName: formData.name,
        phone01: formData.phone01,
        phone02: formData.phone02,
        phone03: formData.phone03,
        email01: formData.emailId,
        email02: formData.emailDomain,
        role: "user",
      });

      if (response.data === "success") {
        return { success: true, message: "회원가입을 환영합니다. 메인페이지로 이동합니다." };
      }
    } catch (error) {
      if (error.response?.data === "failed") {
        throw new Error("입력하신 아이디와 이메일은 이미 가입된 회원 입니다.\n다른 내용으로 가입해주세요.");
      }
      throw new Error("알수 없는 에러가 발생했습니다. 관리자에게 문의하세요.");
    }
  };

  // 관리자 상태 확인
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

  // 초기 인증 상태 확인
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userName = localStorage.getItem('userName');
    const realname = localStorage.getItem('realname');
    const email = localStorage.getItem('email');
    const phoneNumber = localStorage.getItem('phoneNumber');
    const isAdminStored = localStorage.getItem('isAdmin');

    if (token && userName) {
      setCurrentUser({
        userName: userName,
        name: realname,
        email: email,
        phoneNumber: phoneNumber
      });
      setIsAdmin(isAdminStored === 'true');
    }
    setLoading(false);
  }, []);

  const value = {
    currentUser,
    isAdmin,
    login,
    logout,
    signup
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// useAuth 커스텀 훅
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};