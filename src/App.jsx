import {
  BrowserRouter,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./pages/Home";
import style from "./App.module.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import MenuPage from "./pages/MenuPage";
import NoticePage from "./pages/NoticePage";
import Inquiry from "./pages/Inquiry";
import FranchisePromotion from "./pages/FranchisePromotion";
import Register from "./pages/Register";
import Store from "./pages/Store";
import KokeeStory from "./pages/KokeeStory";
import Affiliated from "./pages/Affiliated";
import Faq from "./pages/Faq";
import Order from "./pages/Order";
import MemberInfoUpdate from "./pages/MemberInfoUpdate";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import MyPage from "./pages/MyPage";
import OrderHistory from "./pages/OrderHistory";
import InquiryHistory from "./pages/InquiryHistory";
import CouponStamp from "./pages/CouponStamp";
import Cart from "./pages/Cart";
import OrderComplete from "./pages/OrderComplete";
import FloatingButtons from "./components/FloatingButtons";
import { CartProvider } from "./components/CartContext";
import MyMenu from "./pages/MyMenu";
import NoticeWrite from "./pages/NoticeWrite";
import axios from "axios";

function AppContent() {
  const location = useLocation();

  useEffect(() => {
    if (location.state?.currentPage !== undefined) {
      const homeComponent = document.getElementById("section-0");
      if (homeComponent) {
        homeComponent.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);

  return (
    <>
      {/* 현재 경로가 '/'(Home)일 때 Footer 숨김 */}
      {/* 이거 안 하면 Home에서는 Footer가 두 번 생깁니다... */}
      {location.pathname !== "/" && <Footer />}
    </>
  );
}

function FlotingButtonsContent() {
  const location = useLocation();

  return <>{location.pathname === "/" && <FloatingButtons />}</>;
}

function App() {
  const [isLogined, setIsLogined] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    // 로컬 스토리지에서 로그인 상태 확인
    const token = localStorage.getItem("token");
    if (token) {
      setIsLogined(true);
    }
  }, []);

  const url = new URL(window.location.href);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  const getNaverToken = async (code) => {
    try {
      // 서버로 코드를 보내는 POST 요청
      const response = await axios.get(
        `http://spring.mirae.network:8080/api/members/naver-login?code=${code}&state=${state}`
      );

      console.log(response.data);

      const token = response.data.token;

      localStorage.setItem("token", token);
      if (response.status === 200) {
        // 토큰을 로컬 스토리지에 저장
        setIsLogined(true);
      }
    } catch (error) {
      console.error("서버에 코드를 전송하는 데 실패:", error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (code && !token) {
      getNaverToken(code);
    } else if (token) {
      setIsLogined(true);
    }
  }, []);

  return (
    <CartProvider>
      <BrowserRouter>
        <Header
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          isLogined={isLogined}
          setIsLogined={setIsLogined}
        />
        {currentPage !== 0 && (
          <FlotingButtonsContent setCurrentPage={setCurrentPage} />
        )}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
        <div className={`${style.App}`}>
          <Routes>
            <Route
              path="/"
              element={
                <Home
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                />
              }
            />
            <Route
              path="/menupage"
              element={<MenuPage isLogined={isLogined} />}
            />
            <Route path="/kokeestory" element={<KokeeStory />} />
            <Route path="/affiliated" element={<Affiliated />} />
            <Route path="/notice" element={<NoticePage />} />
            <Route path="/notice/write" element={<NoticeWrite />} />
            <Route path="/inquiry" element={<Inquiry />} />
            <Route path="/faq" element={<Faq isLogined={isLogined} />} />
            <Route path="/store" element={<Store />} />
            <Route path="/order" element={<Order />} />
            <Route
              path="/memberinfoupdate"
              element={
                <MemberInfoUpdate
                  isLogined={isLogined}
                  setIsLogined={setIsLogined}
                />
              }
            />
            <Route
              path="/FranchisePromotion"
              element={<FranchisePromotion />}
            />
            <Route path="/register" element={<Register />} />
            <Route
              path="/login"
              element={<Login setIsLogined={setIsLogined} />}
            />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/mypage" element={<MyPage />} />
            <Route path="/orderhistory" element={<OrderHistory />} />
            <Route path="/inquiryhistory" element={<InquiryHistory />} />
            <Route path="/couponstamp" element={<CouponStamp />} />
            <Route path="/mymenu" element={<MyMenu />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/ordercomplete" element={<OrderComplete />} />
          </Routes>
          <AppContent />
        </div>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
