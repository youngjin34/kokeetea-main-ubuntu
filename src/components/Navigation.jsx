import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import style from "./Navigation.module.css";
import Login from "../pages/Login";

function Navigation({ isLogined, setIsLogined, fontColor, currentPage, setCurrentPage }) {
  const navigate = useNavigate();

  const [headerLogined, setHeaderLogined] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const [isModalOpen, setModalOpen] = useState(false);
  const menuRef = useRef(null);
  const modalRef = useRef(null);
  const loginRef = useRef(null);

  const [activeSubMenu, setActiveSubMenu] = useState(null);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // 햄버거 아이콘 경로 결정
  const getHamburgerIcon = () => {
    if (isHovered || fontColor === "black" || currentPage % 2 === 1) {
      return "./img/hamberger_black.png";
    }
    return "./img/hamberger_white.png";
  };

  // Facebook 아이콘 경로 결정
  const getFacebookIcon = () => {
    if (isHovered || fontColor === "black") {
      return "./img/facebook_black.png"; // 마우스를 올렸거나 글씨 색상이 검정일 때 검은색 이미지
    }
    return currentPage % 2 === 0
      ? "./img/facebook_white.png"
      : "./img/facebook_black.png";
  };

  // Insta 아이콘 경로 결정
  const getInstaIcon = () => {
    if (isHovered || fontColor === "black") {
      return "./img/insta_black.png"; // 마우스를 올렸거나 글씨 색상이 검정일 때 검은색 이미지
    }
    return currentPage % 2 === 0
      ? "./img/insta_white.png"
      : "./img/insta_black.png";
  };

  // YouTube 아이콘 경로 결정
  const getYoutubeIcon = () => {
    if (isHovered || fontColor === "black") {
      return "./img/yutube_black.png"; // 마우스를 올렸거나 글씨 색상이 검정일 때 검은색 이미지
    }
    return currentPage % 2 === 0
      ? "./img/yutube_white.png"
      : "./img/yutube_black.png";
  };

  useEffect(() => {
    const checkLoginStatus = () => {
      const isLoggedIn = !!localStorage.getItem("realname");
      setHeaderLogined(isLoggedIn);
    };

    checkLoginStatus();

    const handleClickOutside = (event) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target) &&
        isModalOpen
      ) {
        setModalOpen(false);
        setActiveSubMenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("storage", checkLoginStatus);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("storage", checkLoginStatus);
    };
  }, [isModalOpen, isLogined]);

  function logoutFunction() {
    localStorage.clear();
    setIsLogined(!isLogined);
    navigate("/");
    window.location.reload();
  }

  const toggleModal = () => {
    setModalOpen(!isModalOpen);
    setActiveSubMenu(null); // 모달 열 때 하위 메뉴 초기화
  };

  // 모달 열기/닫기 상태
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);

  const toggleLoginModal = () => {
    setLoginModalOpen(!isLoginModalOpen);
  };

  // 로그인 성공 핸들러 수정
  const handleLoginSuccess = async () => {
    toggleLoginModal();
    setHeaderLogined(true);
    setIsLogined(true);
    // 로그인 성공 시 즉시 장바구니 데이터 동기화
    await syncCartData();
  };

  // 바깥쪽 클릭 시 모달 닫기
  const handleOutsideClick = (e) => {
    if (loginRef.current === e.target) {
      setLoginModalOpen(false);
    }
  };

  useEffect(() => {
    if (isLoginModalOpen) {
      // 모달이 열릴 때 스크롤 막기
      document.body.style.overflow = "hidden";
      document.addEventListener("click", handleOutsideClick);
    } else {
      // 모달이 닫힐 때 스크롤 허용
      document.body.style.overflow = "auto";
      document.removeEventListener("click", handleOutsideClick);
    }

    // clean up function: 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [isLoginModalOpen]);

  // 홈으로 이동하는 함수를 단순화
  const handleLogoClick = () => {
    if (window.location.pathname === '/') {
      // 현재 홈페이지에 있을 경우 첫 번째 섹션으로 스크롤
      const homeComponent = document.getElementById('section-0');
      if (homeComponent) {
        homeComponent.scrollIntoView({ behavior: 'smooth' });
        setCurrentPage(0);
      }
    } else {
      // 다른 페이지에 있을 경우 홈페이지로 이동하면서 state 전달
      navigate('/', { state: { currentPage: 0 } });
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Navigation.jsx에서 장바구니 카운트를 상태로 관리
  const [cartCount, setCartCount] = useState(() => {
    // 초기값을 즉시 계산
    return parseInt(localStorage.getItem('cartCount') || '0');
  });

  useEffect(() => {
    // localStorage 변경 감지 - 필수적인 경우만 유지
    const handleStorageChange = (e) => {
      if (e.key === 'cartCount') {
        setCartCount(parseInt(e.newValue || '0'));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // syncCartData 함수 최적화
  const syncCartData = async () => {
    try {
      const response = await fetch('http://localhost:8080/kokee/carts', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) throw new Error('장바구니 데이터를 불러오는데 실패했습니다.');
      
      const data = await response.json();
      localStorage.setItem('cart', JSON.stringify(data));
      // 카트 카운트 직접 업데이트
      const newCount = data.length;
      localStorage.setItem('cartCount', newCount.toString());
      setCartCount(newCount);
      return data;
    } catch (error) {
      console.error("장바구니 동기화 실패:", error);
      return [];
    }
  };

  return (
    <div className={`${style.Navigation}`}>
      <div className={style.nav_container}>
        {/* 이미지 햄버거 버튼 */}
        <div className={style.ham_menu_button}>
          <img
            onClick={toggleModal}
            src={getHamburgerIcon()}
            alt="Hamburger Menu"
            className={`${style.ham_menu_icon}`}
          />

          <Link
            to="/"
            className={style.logo_text}
            style={{
              color: fontColor,
            }}
            onClick={handleLogoClick}
          >
            KOKEE TEA
          </Link>
        </div>

        {/* 상단 네비게이션 메뉴 */}
        <div className={style.main_menu}>
          <ul className={style.main_menu_list}>
            <li className={style.main_menu_item}>
              <Link
                to="/kokeestory"
                className={style.main_menu_link}
                style={{ color: fontColor }}
              >
                KOKEE STORY
              </Link>
              <ul className={style.sub_menu_list}>
                <li className={style.sub_menu_item}>
                  <Link
                    to="/kokeestory"
                    className={style.sub_menu_link}
                    style={{ color: fontColor }}
                  >
                    브랜드 소개
                  </Link>
                </li>
              </ul>
            </li>
            <li className={style.main_menu_item}>
              <Link
                to="/menupage"
                className={style.main_menu_link}
                style={{ color: fontColor }}
              >
                MENU
              </Link>
              <ul className={style.sub_menu_list}>
                <li className={style.sub_menu_item}>
                  <Link
                    to="/menupage"
                    className={style.sub_menu_link}
                    style={{ color: fontColor }}
                  >
                    음료
                  </Link>
                </li>
              </ul>
            </li>
            <li className={style.main_menu_item}>
              <Link
                to="/store"
                className={style.main_menu_link}
                style={{ color: fontColor }}
              >
                STORE
              </Link>
              <ul className={style.sub_menu_list}>
                <li className={style.sub_menu_item}>
                  <Link
                    to="/store"
                    className={style.sub_menu_link}
                    style={{ color: fontColor }}
                  >
                    매장 찾기
                  </Link>
                </li>
              </ul>
            </li>
            <li className={style.main_menu_item}>
              <Link
                to="/affiliated"
                className={style.main_menu_link}
                style={{ color: fontColor }}
              >
                FRANCHISE
              </Link>
              <ul className={style.sub_menu_list}>
                <li className={style.sub_menu_item}>
                  <Link
                    to="/franchisepromotion"
                    className={style.sub_menu_link}
                    style={{ color: fontColor }}
                  >
                    가맹안내
                  </Link>
                </li>
              </ul>
            </li>
            <li className={style.main_menu_item}>
              <Link
                to="/notice"
                className={style.main_menu_link}
                style={{ color: fontColor }}
              >
                NOTICE
              </Link>
              <ul className={style.sub_menu_list}>
                <li className={style.sub_menu_item}>
                  <Link
                    to="/notice"
                    className={style.sub_menu_link}
                    style={{ color: fontColor }}
                  >
                    공지사항
                  </Link>
                </li>
              </ul>
            </li>
            <li className={style.main_menu_item}>
              <Link
                to="/support"
                className={style.main_menu_link}
                style={{ color: fontColor }}
              >
                SUPPORT
              </Link>
              <ul className={style.sub_menu_list}>
                <li className={style.sub_menu_item}>
                  <Link
                    to="/faq"
                    className={style.sub_menu_link}
                    style={{ color: fontColor }}
                  >
                    자주하는 질문
                  </Link>
                </li>
              </ul>
            </li>
          </ul>
        </div>

        {/* 햄버거 버튼 눌렀을 때 모달 창 */}
        <div
          className={`${style.modal_overlay} ${
            isModalOpen ? style.active : ""
          }`}
        >
          <div
            className={`${style.modal_menu} ${isModalOpen ? style.active : ""}`}
            ref={menuRef}
          >
            {/* 모달 닫기 버튼 */}
            <button className={style.modal_close_button} onClick={toggleModal}>
              x
            </button>

            {/* KOKEE STORY 메뉴 */}
            <div
              className={`${style.modal_menu_item} ${
                activeSubMenu === "KOKEE STORY" ? style.active : ""
              }`}
            >
              KOKEE STORY
              <div
                className={`${style.submenu} ${
                  activeSubMenu === "KOKEE STORY" ? style.active : ""
                }`}
              >
                <Link to="/kokeestory" onClick={toggleModal}>
                  브랜드 소개
                </Link>
              </div>
            </div>

            {/* MENU 메뉴 */}
            <div
              className={`${style.modal_menu_item} ${
                activeSubMenu === "MENU" ? style.active : ""
              }`}
            >
              MENU
              <div
                className={`${style.submenu} ${
                  activeSubMenu === "MENU" ? style.active : ""
                }`}
              >
                <Link to="./menupage" onClick={toggleModal}>
                  음료
                </Link>
              </div>
            </div>

            {/* STORE 메뉴 */}
            <div
              className={`${style.modal_menu_item} ${
                activeSubMenu === "STORE" ? style.active : ""
              }`}
            >
              STORE
              <div
                className={`${style.submenu} ${
                  activeSubMenu === "STORE" ? style.active : ""
                }`}
              >
                <Link to="/store" onClick={toggleModal}>
                  매장 찾기
                </Link>
              </div>
            </div>

            {/* AFFILIATED 메뉴 */}
            <div
              className={`${style.modal_menu_item} ${
                activeSubMenu === "AFFILIATED" ? style.active : ""
              }`}
            >
              FRANCHISE
              <div
                className={`${style.submenu} ${
                  activeSubMenu === "AFFILIATED" ? style.active : ""
                }`}
              >
                <Link to="/franchisepromotion" onClick={toggleModal}>
                  가맹안내
                </Link>
              </div>
            </div>

            {/* NOTICE 메뉴 */}
            <div
              className={`${style.modal_menu_item} ${
                activeSubMenu === "NOTICE" ? style.active : ""
              }`}
            >
              NOTICE
              <div
                className={`${style.submenu} ${
                  activeSubMenu === "NOTICE" ? style.active : ""
                }`}
              >
                <Link to="/notice" onClick={toggleModal}>
                  공지사항
                </Link>
              </div>
            </div>

            {/* SUPPORT 메뉴 */}
            <div
              className={`${style.modal_menu_item} ${
                activeSubMenu === "SUPPORT" ? style.active : ""
              }`}
            >
              SUPPORT
              <div
                className={`${style.submenu} ${
                  activeSubMenu === "SUPPORT" ? style.active : ""
                }`}
              >
                <Link to="/faq" onClick={toggleModal}>
                  자주하는 질문
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="inner">
          <ul className={`${style.header_top}`}>
            {headerLogined && (
              <li>
                <Link to="/cart" style={{ color: fontColor }} className={style.cart_icon}>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="20" 
                    height="20" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke={fontColor === "black" ? "#000" : "#fff"}
                    strokeWidth="1.5"
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <circle cx="9" cy="21" r="1"></circle>
                    <circle cx="20" cy="21" r="1"></circle>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                  </svg>
                  <span className={style.cart_count}>
                    {cartCount}
                  </span>
                </Link>
              </li>
            )}
            {headerLogined ? (
              <li onClick={logoutFunction}>
                <Link to="#" style={{ color: fontColor }} className={style.user_menu_text}>
                  LOGOUT
                </Link>
              </li>
            ) : (
              <>
                <li>
                  <Link onClick={toggleLoginModal} style={{ color: fontColor }} className={style.login_join_text}>
                    LOGIN
                  </Link>
                </li>
                <li className={style.menu_divider} style={{ color: fontColor }}>|</li>
                <li>
                  <Link to="/register" style={{ color: fontColor }} className={style.login_join_text}>
                    JOIN
                  </Link>
                </li>
              </>
            )}
            {headerLogined && (
              <>
                <li className={style.menu_divider} style={{ color: fontColor }}>|</li>
                <li>
                  <Link to="/mypage" style={{ color: fontColor }} className={style.user_menu_text}>
                    MY PAGE
                  </Link>
                </li>
              </>
            )}
            <li>
              <Link to="https://ko-kr.facebook.com/luvkokeetea/">
                <img
                  src={getFacebookIcon()}
                  alt="Facebook logo"
                  className={style.sns}
                />
              </Link>
            </li>
            <li>
              <Link to="https://www.instagram.com/kokeetea/">
                <img
                  src={getInstaIcon()}
                  alt="Instagram logo"
                  className={style.sns}
                />
              </Link>
            </li>
            <li>
              <Link to="https://www.youtube.com/@kokeetea2886">
                <img
                  src={getYoutubeIcon()}
                  alt="YouTube logo"
                  className={style.youtube_icon}
                />
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {isLoginModalOpen && (
        <div className={style.modal} ref={loginRef}>
          <div className={style.modalContent}>
            <div className={style.modalClose} onClick={toggleLoginModal}>
              <img src="/public/img/close.png" alt="Close" />
            </div>
            <Login
              onClose={toggleLoginModal}
              setIsLogined={setIsLogined}
              setHeaderLogined={setHeaderLogined}
              onLoginSuccess={handleLoginSuccess}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Navigation;
