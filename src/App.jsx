import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useState } from "react";
import Home from "./pages/Home";
import style from "./App.module.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import KokeeStory from "./pages/KokeeStory";

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
          <Route
            path="/kokeestory"
            element={
              <KokeeStory />
            }
          />
        </Routes>
      </div>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
