import { useState } from "react";
import { useLocation } from "react-router-dom";
import Navigation from "./Navigation";
import style from "./Header.module.css";

const Header = ({ currentPage, isLogined, setIsLogined, setCurrentPage }) => {
  const [isHovered, setIsHovered] = useState(false); // 헤더 배경색을 하얗게 할지 여부
  const [isNavHovered, setIsNavHovered] = useState(false); // Navigation에 마우스가 올렸는지 여부

  const location = useLocation();

  // Home 페이지 여부 확인
  const isHomePage = location.pathname === "/";

  // 헤더 배경색 결정
  const getHeaderColor = () => {
    if (isHovered || isNavHovered) {
      return "white"; // 마우스를 올렸을 때 헤더 배경색을 하얗게
    }
    if (!isHomePage) {
      return "white"; // Home 페이지가 아닐 경우 배경색은 하얗게
    }
    // Home 페이지일 경우 currentPage가 undefined거나 0일때는 투명하게 설정
    if (currentPage === undefined || currentPage === 0) {
      return "transparent";
    }
    // Home 페이지일 경우 currentPage에 따라 배경색 결정
    switch (currentPage) {
      case 0:
        return "transparent";
      case 1:
        return "white";
      case 2:
        return "transparent";
      case 3:
        return "white";
      case 4:
        return "white";
      default:
        return "transparent";
    }
  };

  // 네비게이션 글씨 색상 결정
  const getFontColor = () => {
    if (isHovered) {
      return "black"; // 배경이 하얗게 될 때 네비게이션 글씨 색을 검정색으로 변경
    }
    if (!isHomePage) {
      return "black"; // Home이 아닐 때 글씨 색은 검은색
    }
    switch (currentPage) {
      case 0:
        return "white";
      case 1:
        return "black";
      case 2:
        return "white";
      case 3:
        return "black";
      case 4:
        return "black";
      default:
        return "white";
    }
  };

  return (
    <div
      className={`${style.Header}`}
      style={{ backgroundColor: getHeaderColor() }} // 헤더 배경색 설정
    >
      <div>
        <Navigation
          fontColor={getFontColor()}
          currentPage={currentPage}
          isLogined={isLogined} // 네비게이션에 로그인 상태 전달
          setIsLogined={setIsLogined} // 네비게이션에서 로그인 상태 변경 함수 사용
          setCurrentPage={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default Header;
