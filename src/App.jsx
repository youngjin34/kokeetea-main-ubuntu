import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import style from './App.module.css';
import Header from './components/Header';

function App() {
  return (
    <BrowserRouter>
      <Header className />
      <div className={`${style.App}`}>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
