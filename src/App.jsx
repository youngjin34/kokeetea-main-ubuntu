import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useState } from 'react';
import Home from './pages/Home';
import style from './App.module.css';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  const [currentPage, setCurrentPage] = useState(0); // 현재 페이지 상태

  return (
    <BrowserRouter>
      <Header currentPage={currentPage} />
      <div className={`${style.App}`}>
        <Routes>
          <Route
            path="/"
            element={
              <Home currentPage={currentPage} setCurrentPage={setCurrentPage} />
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
