import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import style from "./Navigation.module.css";

function Navigation({ isLogined, setIsLogined, fontColor, currentPage }) {
  const navigate = useNavigate();
  const [userName, setUserName] = useState(""); //아이디 입력란 처음공백
  const [pass, setPass] = useState(""); //이메일 입력란 처음공백
  const [headerLogined, setHeaderLogined] = useState(false);

  const [isHovered, setIsHovered] = useState(false); // 마우스 오버 상태 관리

  const handleMouseEnter = () => {
    setIsHovered(true); // 마우스 오버시 상태 true로 설정
  };

  const handleMouseLeave = () => {
    setIsHovered(false); // 마우스 떠날 때 상태 false로 설정
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
  }, []);

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

  // 모달 열기/닫기 상태
  const [isModalOpen, setModalOpen] = useState(false);
  const modalRef = useRef(null);

  const toggleModal = () => {
    setModalOpen(!isModalOpen);
  };

  // 바깥쪽 클릭 시 모달 닫기
  const handleOutsideClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      setModalOpen(false);
    }
  };

  useEffect(() => {
    // 모달이 열릴 때 스크롤 막기
    if (isModalOpen) {
      document.body.style.overflow = "hidden"; // 스크롤 막기
      document.addEventListener("click", handleOutsideClick); // 외부 클릭 이벤트 리스너 추가
    } else {
      document.body.style.overflow = "auto"; // 스크롤 다시 허용
      document.removeEventListener("click", handleOutsideClick); // 외부 클릭 이벤트 리스너 제거
    }
  }, [isModalOpen]);

  // 회원가입 이동
  const toForm = () => {
    setModalOpen(false);
    navigate("/form");
  };

  return (
    <div className={`${style.Navigation}`}>
      <div className={style.dropdown} style={{ transition: "0.3s" }}>
        {/* KOKEE STORY 메뉴 */}
        <div style={{ color: fontColor }}>
          KOKEE STORY
          <div>
            <Link to="/kokeestory" style={{ color: fontColor }}>
              Brand
            </Link>
          </div>
        </div>

        {/* MENU 메뉴 */}
        <div style={{ color: fontColor }}>
          MENU
          <div>
            <Link to="/menupage" style={{ color: fontColor }}>
              Drink
            </Link>
          </div>
        </div>

        {/* STORE 메뉴 */}
        <div style={{ color: fontColor }}>
          STORE
          <div>
            <Link to="./waytocome" style={{ color: fontColor }}>
              The way to find
            </Link>
          </div>
        </div>

        {/* AFFILIATED 메뉴 */}
        <div style={{ color: fontColor }}>
          AFFILIATED
          <div>
            <Link to="/affiliated" style={{ color: fontColor }}>
              Inquire
            </Link>
          </div>
        </div>

        {/* SUPPORT 메뉴 */}
        <div style={{ color: fontColor }}>
          SUPPORT
          <div>
            <Link to="./faq" style={{ color: fontColor }}>
              FAQ
            </Link>
            <Link to="/inquiry" style={{ color: fontColor }}>
              1:1 Inquire
            </Link>
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
              <Link onClick={toggleModal} style={{ color: fontColor }}>
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
