import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import style from "./Navigation.module.css";

function Navigation({ isLogined, setIsLogined, fontColor, currentPage }) {
  const navigate = useNavigate();

  const [userName, setUserName] = useState("");
  const [pass, setPass] = useState("");
  const [headerLogined, setHeaderLogined] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const menuRef = useRef(null);
  const modalRef = useRef(null);
  const [activeSubMenu, setActiveSubMenu] = useState(null);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  // 로고 아이콘 경로 결정
  const getLogoIcon = () => {
    if (isHovered || fontColor === "black") {
      return "./img/logo_black.png";
    }
    return currentPage % 2 === 0
      ? "./img/logo_white.png"
      : "./img/logo_black.png";
  };

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

  async function fn_login() {
    const regExp = /[ㄱ-ㅎㅏ-ㅣ가-힣]/g;

    if (!userName.trim()) {
      alert("아이디가 공백입니다.");
      return;
    }
    if (!pass.trim()) {
      alert("비밀번호가 공백입니다.");
      return;
    }
    if (regExp.test(userName)) {
      alert("아이디에 한글을 입력하실 수 없습니다.");
      return;
    }

    try {
      const result = await axios.post("http://localhost:8080/kokee/login", {
        userName: userName,
        password: pass,
      });

      console.log(result);
      if (result.status === 200) {
        setIsLogined(!isLogined);
        setHeaderLogined(!headerLogined);
        document.querySelector(".sec_modal").classList.remove("active");
        localStorage.setItem("userName", userName);
        localStorage.setItem("realname", result.data.name);
        localStorage.setItem("email", result.data.email);
        alert(`${localStorage.getItem("realname")}님 환영합니다!`);
        navigate("/");
        console.log("userName:", localStorage.getItem("userName"));
        console.log("realname:", localStorage.getItem("realname"));
        console.log("email:", localStorage.getItem("email"));
      }
    } catch (error) {
      alert("아이디과 비밀번호를 확인해보세요");
    }
  }

  function logoutFunction() {
    alert(
      `로그아웃 합니다. ${localStorage.getItem("realname")}님 안녕히 가세요.`
    );
    localStorage.clear();
    setIsLogined(!isLogined);
    navigate("/");
    window.location.reload();
  }

  const toggleModal = () => {
    setModalOpen(!isModalOpen);
    setLoginModalOpen(false);

    setActiveSubMenu(null); // 모달 열 때 하위 메뉴 초기화
  };

  // 모달 열기/닫기 상태
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);

  // 회원가입 이동
  const toForm = () => {
    setLoginModalOpen(false);
    navigate("/form");
  };

  const toggleLoginModal = () => {
    setLoginModalOpen(!isLoginModalOpen);
  };

  return (
    <div className={`${style.Navigation}`}>
      <div className={style.nav_container}>
        {/* 이미지 햄버거 버튼 */}
        <div className={style.ham_menu_button} onClick={toggleModal}>
          <img
            src={getHamburgerIcon()}
            alt="Hamburger Menu"
            className={`${style.ham_menu_icon}`}
          />
        </div>

        <Link
          to="/"
          className={style.logo_text}
          style={{ marginRight: "30vw", marginLeft: "30vw", color:fontColor}}
        >
          KOKEE TEA
        </Link>

        {/* 모달 창 */}
        <div
          className={`${style.modal_overlay} ${
            isModalOpen ? style.active : ""
          }`}
          ref={modalRef}
        >
          <div
            className={`${style.modal_menu} ${isModalOpen ? style.active : ""}`}
            ref={menuRef}
          >
            {/* 모달 닫기 버튼 */}
            <button className={style.modal_close_button} onClick={toggleModal}>
              ❌
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
                  Brand
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
                  Drink
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
                <Link to="./store" onClick={toggleModal}>
                  The way to find
                </Link>
              </div>
            </div>
            {/* AFFILIATED 메뉴 */}
            <div
              className={`${style.modal_menu_item} ${
                activeSubMenu === "AFFILIATED" ? style.active : ""
              }`}
            >
              AFFILIATED
              <div
                className={`${style.submenu} ${
                  activeSubMenu === "AFFILIATED" ? style.active : ""
                }`}
              >
                <Link to="/affiliated" onClick={toggleModal}>
                  Inquire
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
                <Link to="./faq" onClick={toggleModal}>
                  FAQ
                </Link>
                <Link to="./oneonone" onClick={toggleModal}>
                  1:1 Inquire
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="inner">
        <ul className={`${style.header_top}`}>
          {headerLogined ? (
            <li onClick={logoutFunction}>
              <Link to="#" style={{ color: fontColor }}>
                {localStorage.getItem("realname")}님 LOGOUT |
              </Link>
            </li>
          ) : (
            <li>
              <Link onClick={toggleLoginModal} style={{ color: fontColor }}>
                LOGIN&nbsp;&nbsp;&nbsp;&nbsp;|
              </Link>
            </li>
          )}
          {!headerLogined && (
            <li>
              <Link to="/form" style={{ color: fontColor }}>
                JOIN
              </Link>
            </li>
          )}
          {headerLogined && (
            <li>
              <Link to="/mypage" style={{ color: fontColor }}>
                MY PAGE
              </Link>
            </li>
          )}
          <li>
            <Link
              to="https://ko-kr.facebook.com/luvkokeetea/"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <img
                src={getFacebookIcon()}
                alt="Facebook logo"
                className={style.sns}
              />
            </Link>
          </li>
          <li>
            <Link
              to="https://www.instagram.com/kokeetea/"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <img
                src={getInstaIcon()}
                alt="Facebook logo"
                className={style.sns}
              />
            </Link>
          </li>
          <li>
            <Link
              to="https://www.youtube.com/@kokeetea2886"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <img
                src={getYoutubeIcon()}
                alt="YouTube logo"
                className={style.youtube_icon}
              />
            </Link>
          </li>
        </ul>
      </div>

      {isModalOpen && (
        <div className={style.modal}>
          <div className={style.modalContent}>
            <h2>로그인</h2>
            <input
              type="text"
              placeholder="아이디"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
            <input
              type="password"
              placeholder="비밀번호"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && fn_login()}
            />
            <label className={style.checkboxWrap}>
              <input type="checkbox" />
              <p>로그인 상태 유지</p>
            </label>
            <button
              type="button"
              className={`${style.login_btn}`}
              onClick={fn_login}
            >
              로그인
            </button>
            <div className={style.join} onClick={toForm}>
              회원가입
            </div>
            <div className={style.modalClose} onClick={toggleModal}>
              <img src="/public/img/close.png" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Navigation;
