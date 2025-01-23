import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import style from "./Navigation.module.css";
import Login from "../pages/Login";

function Navigation({ isLogined, setIsLogined, fontColor, currentPage }) {
  const navigate = useNavigate();

  const [headerLogined, setHeaderLogined] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const [isModalOpen, setModalOpen] = useState(false);
  const menuRef = useRef(null);
  const modalRef = useRef(null);
  const loginRef = useRef(null);

  const [activeSubMenu, setActiveSubMenu] = useState(null);

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
    if (localStorage.getItem("realname")) {
      setHeaderLogined(true);
    }
    // 메뉴 영역 외부 클릭 시 메뉴 닫기
    const handleClickOutside = (event) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target) &&
        isModalOpen
      ) {
        setModalOpen(false);
        setActiveSubMenu(null); // 모달 닫을 때 하위 메뉴도 닫기
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isModalOpen]);

  function logoutFunction() {
    toast.success(`${localStorage.getItem("realname")}님 안녕히 가세요.`, {
      position: "top-center",
      autoClose: 3000,
    });
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
            {headerLogined ? (
              <li onClick={logoutFunction}>
                <Link to="#" style={{ color: fontColor }} className={style.user_menu_text}>
                  LOGOUT&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|
                </Link>
              </li>
            ) : (
              <li>
                <Link onClick={toggleLoginModal} style={{ color: fontColor }} className={style.login_join_text}>
                  LOGIN&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|
                </Link>
              </li>
            )}
            {!headerLogined && (
              <li>
                <Link to="/register" style={{ color: fontColor }} className={style.login_join_text}>
                  JOIN
                </Link>
              </li>
            )}
            {headerLogined && (
              <li>
                <Link to="/mypage" style={{ color: fontColor }} className={style.user_menu_text}>
                  MY PAGE
                </Link>
              </li>
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
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Navigation;
