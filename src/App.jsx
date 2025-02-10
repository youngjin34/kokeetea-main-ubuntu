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

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();

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

function App() {
  const [isLogined, setIsLogined] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    // 로컬 스토리지에서 로그인 상태 확인
    const email = localStorage.getItem("email");
    if (email) {
      setIsLogined(true);
    }
  }, []);

  return (
    <BrowserRouter>
      <Header
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        isLogined={isLogined}
        setIsLogined={setIsLogined}
      />
      {currentPage !== 0 && <FloatingButtons setCurrentPage={setCurrentPage} />}
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
              <Home currentPage={currentPage} setCurrentPage={setCurrentPage} />
            }
          />
          <Route path="/menupage" element={<MenuPage />} />
          <Route path="/kokeestory" element={<KokeeStory />} />
          <Route path="/affiliated" element={<Affiliated />} />
          <Route path="/notice" element={<NoticePage />} />
          <Route path="/inquiry" element={<Inquiry />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/store" element={<Store />} />
          <Route path="/order" element={<Order />} />
          <Route path="/memberinfoupdate" element={<MemberInfoUpdate />} />
          <Route path="/FranchisePromotion" element={<FranchisePromotion />} />
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
          <Route path="/cart" element={<Cart />} />
          <Route path="/ordercomplete" element={<OrderComplete />} />
        </Routes>
        <AppContent />
      </div>
    </BrowserRouter>
  );
}

export default App;
