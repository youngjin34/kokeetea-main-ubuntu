import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { useState } from "react";
import Home from "./pages/Home";
import style from "./App.module.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import MenuPage from "./pages/MenuPage";

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
  const [currentPage, setCurrentPage] = useState(0); // 현재 페이지 상태
  const [isLogined, setIsLogined] = useState(false);

  return (
    <BrowserRouter>
      <Header
        currentPage={currentPage}
        isLogined={isLogined}
        setIsLogined={setIsLogined}
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
        </Routes>
        <AppContent />
      </div>
    </BrowserRouter>
  );
}

export default App;
