import { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import style from "./Navigation.module.css";
import Login from "../pages/Login";
import { CartContext } from "./CartContext";
import axios from "axios";

function Navigation({
  isLogined,
  setIsLogined,
  fontColor,
  currentPage,
  setCurrentPage,
}) {
  const navigate = useNavigate();

  const [isHovered, setIsHovered] = useState(false);

  const [isModalOpen, setModalOpen] = useState(false);
  const menuRef = useRef(null);
  const modalRef = useRef(null);
  const loginRef = useRef(null);

  const [activeSubMenu, setActiveSubMenu] = useState(null);

  const { cartCount } = useContext(CartContext); // cartCount 가져오기

  // 햄버거 아이콘 경로 결정
  const getHamburgerIcon = () => {
    if (isHovered || fontColor === "black" || currentPage % 2 === 1) {
      return "/img/hamberger_black.png";
    }
    return "/img/hamberger_white.png";
  };

  // Facebook 아이콘 경로 결정
  const getFacebookIcon = () => {
    if (isHovered || fontColor === "black") {
      return "/img/facebook_black.png";
    }
    return currentPage % 2 === 0
      ? "/img/facebook_white.png"
      : "/img/facebook_black.png";
  };

  // Insta 아이콘 경로 결정
  const getInstaIcon = () => {
    if (isHovered || fontColor === "black") {
      return "/img/insta_black.png";
    }
    return currentPage % 2 === 0
      ? "/img/insta_white.png"
      : "/img/insta_black.png";
  };

  // YouTube 아이콘 경로 결정
  const getYoutubeIcon = () => {
    if (isHovered || fontColor === "black") {
      return "/img/yutube_black.png";
    }
    return currentPage % 2 === 0
      ? "/img/yutube_white.png"
      : "/img/yutube_black.png";
  };

  const [notificationContent, setNotificationContent] = useState([]);
  // 알림 관련 state 추가
  const [notificationCount, setNotificationCount] = useState(0);

  // 알림 모달 상태 추가 (상단 state 선언부에 추가)
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);

  // 알림 모달 토글 함수 추가
  const toggleNotificationModal = (e) => {
    setIsNotificationModalOpen(!isNotificationModalOpen);
  };

  const fetchAlert = async () => {
    const token = localStorage.getItem("token");

    const response = await axios.get(
      "http://spring.mirae.network:8080/api/alerts",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setNotificationContent(response.data);
    setNotificationCount(response.data.length);
  };

  const onDeleteAlert = async (id) => {
    const token = localStorage.getItem("token");

    const response = await axios.delete(
      `http://spring.mirae.network:8080/api/alerts/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  };

  const resetNotificationCount = () => {
    setNotificationCount(0); // 알림 카운트 초기화
  };

  // state 선언부에 isAdmin 상태 추가
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem("token");
      const authority = localStorage.getItem("authority");
      if (token) {
        setIsLogined(true);
        setIsAdmin(authority === "ADMIN");
      } else {
        setIsLogined(false);
        setIsAdmin(false);
      }
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
  }, [setIsLogined, isModalOpen]);

  function logoutFunction() {
    if (window.confirm("로그아웃 하시겠겠습니까?")) {
      localStorage.clear();
      setIsLogined(false);
      navigate("/");
      window.location.reload();
    }
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
    setIsLogined(true);
    // 로그인 성공 시 즉시 장바구니 데이터 동기화
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
    if (window.location.pathname === "/") {
      // 현재 홈페이지에 있을 경우 첫 번째 섹션으로 스크롤
      const homeComponent = document.getElementById("section-0");
      if (homeComponent) {
        homeComponent.scrollIntoView({ behavior: "smooth" });
        setCurrentPage(0);
      }
    } else {
      // 다른 페이지에 있을 경우 홈페이지로 이동하면서 state 전달
      navigate("/", { state: { currentPage: 0 } });
    }
  };

  // 기존 state 선언부 근처에 ref 추가
  const notificationRef = useRef(null);

  // 새로운 useEffect 추가
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target) &&
        isNotificationModalOpen
      ) {
        setIsNotificationModalOpen(false);
      }
    };

    if (isNotificationModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isNotificationModalOpen]);

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
        {isAdmin ? (
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
        ) : (
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
        )}

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
            {isLogined &&
              (isAdmin ? (
                ""
              ) : (
                <>
                  <li>
                    <Link
                      to="/cart"
                      style={{ color: fontColor }}
                      className={style.cart_icon}
                    >
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
                      <span className={style.cart_count}>{cartCount}</span>
                    </Link>
                  </li>
                  <li>
                    <div
                      onClick={() => {
                        toggleNotificationModal();
                        fetchAlert();
                        resetNotificationCount();
                      }}
                      style={{ color: fontColor, cursor: "pointer" }}
                      className={style.notification_icon}
                      ref={notificationRef}
                    >
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
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                        <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                      </svg>
                      {notificationCount > 0 && (
                        <span className={style.notification_count}>
                          {notificationCount}
                        </span>
                      )}
                      {isNotificationModalOpen && (
                        <div className={style.notification_dropdown}>
                          {notificationContent.length > 0 ? (
                            <div>
                              {notificationContent.map((content) => (
                                <div key={content.id} className={style.alert}>
                                  {content.content}
                                  <img
                                    src="/img/content_x.png"
                                    className={style.content_x}
                                    onClick={() => {
                                      onDeleteAlert(content.id);
                                    }}
                                  />
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div>새로운 알림이 없습니다.</div>
                          )}
                        </div>
                      )}
                    </div>
                  </li>
                </>
              ))}

            {isLogined ? (
              <li onClick={logoutFunction}>
                <Link
                  to="#"
                  style={{ color: fontColor }}
                  className={style.user_menu_text}
                >
                  LOGOUT
                </Link>
              </li>
            ) : (
              <>
                <li>
                  <Link
                    onClick={toggleLoginModal}
                    style={{ color: fontColor }}
                    className={style.login_join_text}
                  >
                    LOGIN
                  </Link>
                </li>
                <li className={style.menu_divider} style={{ color: fontColor }}>
                  |
                </li>
                <li>
                  <Link
                    to="/register"
                    style={{ color: fontColor }}
                    className={style.login_join_text}
                  >
                    JOIN
                  </Link>
                </li>
              </>
            )}

            {isLogined && (
              <>
                <li className={style.menu_divider} style={{ color: fontColor }}>
                  |
                </li>
                <li>
                  <Link
                    to="/mypage"
                    style={{ color: fontColor }}
                    className={style.user_menu_text}
                  >
                    {isAdmin ? "ADMIN PAGE" : "MY PAGE"}
                  </Link>
                </li>
              </>
            )}

            {isAdmin ? (
              ""
            ) : (
              <>
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
              </>
            )}
          </ul>
        </div>
      </div>

      {isLoginModalOpen && (
        <div className={style.modal} ref={loginRef}>
          <div className={style.modalContent}>
            <div className={style.modalClose} onClick={toggleLoginModal}>
              <img src="/img/close.png" alt="Close" />
            </div>
            <Login
              onClose={toggleLoginModal}
              setIsLogined={setIsLogined}
              onLoginSuccess={handleLoginSuccess}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Navigation;
