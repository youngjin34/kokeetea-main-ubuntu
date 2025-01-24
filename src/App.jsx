import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { useState } from "react";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
import Cart from "./pages/Cart";
import MemberInfoUpdate from "./pages/MemberInfoUpdate";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import MyPage from "./pages/MyPage";
import OrderHistory from "./pages/OrderHistory";
import InquiryHistory from "./pages/InquiryHistory";

function AppContent() {
  const location = useLocation(); // 현재 경로 확인

  return (
    <>
      {/* 현재 경로가 '/'(Home)일 때 Footer 숨김 */}
      {/* 이거 안 하면 Home에서는 Footer가 두 번 생깁니다... */}
      {location.pathname !== "/" && <Footer />}
    </>
  );
}

function App() {
  const [currentPage, setCurrentPage] = useState(0); // 현재 페이지 상태 (원페이지 스크롤)
  const [isLogined, setIsLogined] = useState(false);

  return (
    <BrowserRouter>
      <Header
        currentPage={currentPage}
        isLogined={isLogined}
        setIsLogined={setIsLogined}
      />
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
          <Route path="/cart" element={<Cart />} />
          <Route path="/memberinfoupdate" element={<MemberInfoUpdate />} />
          <Route path="/FranchisePromotion" element={<FranchisePromotion />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/orderhistory" element={<OrderHistory />} />
          <Route path="/inquiryhistory" element={<InquiryHistory />} />
        </Routes>
        <AppContent />
      </div>
    </BrowserRouter>
  );
}

export default App;
