import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navigation from './Navigation';
import style from './Header.module.css';

const Header = () => {
  const [isHovered, setIsHovered] = useState(false); // 마우스 오버 상태 관리

  const handleMouseEnter = () => {
    setIsHovered(true); // 마우스가 올라오면 true로 설정
  };

  const handleMouseLeave = () => {
    setIsHovered(false); // 마우스가 벗어나면 false로 설정
  };

  return (
    <div className={`${style.Header} `}>
      <Link to="/">
        <img src="./images/logo.png" alt="logo" className={`${style.logo}`} />
      </Link>
      <Navigation
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        isHovered={isHovered} // 상태를 자식 컴포넌트에 전달
      />
    </div>
  );
};

export default Header;
