import React, { useRef, useState, useEffect } from "react";
import style from "./KokeeStory.module.css";
import Footer from "../components/Footer";

const KokeeStory = () => {
  const outerDivRef = useRef();
  const [isScrolling, setIsScrolling] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  const footerHeight = 140; // 푸터 높이 설정

  useEffect(() => {
    // 컴포넌트 마운트 시 항상 첫 번째 섹션으로 스크롤
    if (outerDivRef.current) {
      outerDivRef.current.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
    }
  }, []);

  const scrollToSection = (sectionIndex) => {
    const pageHeight = window.innerHeight;
    const totalSections = 6; // 총 섹션 개수 (푸터 포함 고려)
    const lastSectionIndex = totalSections - 1;
    let yOffset = sectionIndex * pageHeight;

    // 마지막 섹션일 경우 푸터 높이까지 추가 고려
    if (sectionIndex === lastSectionIndex) {
      yOffset += footerHeight;
    }

    if (outerDivRef.current) {
      outerDivRef.current.scrollTo({
        top: yOffset,
        left: 0,
        behavior: "smooth",
      });

      setCurrentSection(sectionIndex);

      // 정확한 위치 고정을 위해 스크롤이 끝난 후 실행
      setTimeout(() => {
        outerDivRef.current.scrollTop = yOffset;
        setIsScrolling(false);
      }, 600); // 부드러운 스크롤 후 정확한 위치 조정
    }
  };

  useEffect(() => {
    const wheelHandler = (e) => {
      if (isScrolling) return;

      e.preventDefault();
      const { deltaY } = e;
      const { scrollTop } = outerDivRef.current;
      const pageHeight = window.innerHeight;
      const totalSections = 5; // 총 섹션 개수
      const lastSectionIndex = totalSections - 1;

      let currentScrollSection = Math.round(scrollTop / pageHeight);

      setIsScrolling(true);

      if (deltaY > 0 && currentScrollSection < lastSectionIndex) {
        // 스크롤 다운
        scrollToSection(currentScrollSection + 1);
      } else if (deltaY < 0 && currentScrollSection > 0) {
        // 스크롤 업
        scrollToSection(currentScrollSection - 1);
      } else {
        setIsScrolling(false);
      }
    };

    const outerDivRefCurrent = outerDivRef.current;
    outerDivRefCurrent.addEventListener("wheel", wheelHandler, {
      passive: false,
    });

    return () => {
      outerDivRefCurrent.removeEventListener("wheel", wheelHandler);
    };
  }, [isScrolling]);
  const calculateParallax = (index) => {
    if (index === 0) return 0;

    const windowHeight = window.innerHeight;
    const offset = windowHeight * index;
    const relativeScroll = currentSection * windowHeight - offset;
    const parallaxFactor = 0.4;

    // `ease-in-out` 효과 추가
    const damping =
      1 - Math.pow(1 - Math.min(1, Math.abs(relativeScroll) / windowHeight), 2);
    return relativeScroll * parallaxFactor * damping;
  };

  // 네비게이션 바 투명도 조절을 위한 useEffect 수정
  useEffect(() => {
    const header = document.querySelector("header");
    if (!header) return;

    const handleScroll = () => {
      if (!outerDivRef.current) return;

      const scrollTop = outerDivRef.current.scrollTop;
      const pageHeight = window.innerHeight;
      const currentSection = Math.round(scrollTop / pageHeight);

      if (currentSection === 0) {
        // 첫 번째 섹션에서는 원래 스타일 유지
        header.style.backgroundColor = "#ffffff";
        header.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.1)";
        header.style.color = "#000000";
        const links = header.getElementsByTagName("a");
        for (let link of links) {
          link.style.color = "#000000";
        }

        // 로고 이미지가 있다면 기본 버전으로 변경
        const logo = header.querySelector('img[alt="logo"]');
        if (logo) {
          logo.src = "/path/to/default-logo.png";
        }
      } else {
        // 두 번째 섹션부터는 투명 스타일 적용
        header.style.backgroundColor = "transparent";
        header.style.boxShadow = "none";
        header.style.color = "#ffffff";
        const links = header.getElementsByTagName("a");
        for (let link of links) {
          link.style.color = "#ffffff";
        }

        // 로고 이미지가 있다면 흰색 버전으로 변경
        const logo = header.querySelector('img[alt="logo"]');
        if (logo) {
          logo.src = "/path/to/white-logo.png";
        }
      }
    };

    const container = outerDivRef.current;
    container.addEventListener("scroll", handleScroll);

    // 초기 상태 설정
    handleScroll();

    return () => {
      container.removeEventListener("scroll", handleScroll);
      // 컴포넌트 언마운트 시 원래 스타일로 복구
      if (header) {
        header.style.backgroundColor = "#ffffff";
        header.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.1)";
        header.style.color = "#000000";
        const links = header.getElementsByTagName("a");
        for (let link of links) {
          link.style.color = "#000000";
        }

        // 로고 이미지 원래대로 복구
        const logo = header.querySelector('img[alt="logo"]');
        if (logo) {
          logo.src = "/path/to/default-logo.png";
        }
      }
    };
  }, []);

  return (
    <div ref={outerDivRef} className={style.Container}>
      {[...Array(5)].map((_, index) => (
        <div
          key={index}
          className={`${style.ParallaxSection} ${
            index === 0 ? style.FirstSection : ""
          }`}
        >
          <div
            className={style.ParallaxBackground}
            style={{
              backgroundImage:
                index === 0
                  ? "none"
                  : `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url("${getBackgroundImage(
                      index
                    )}")`,
              backgroundColor: index === 0 ? "#FFFFFF" : undefined,
              transform: `translate3d(0, ${calculateParallax(index)}px, 0)`,
              willChange: "transform",
            }}
          >
            {renderContent(index)}
            {index === 0 && (
              <div className={style.scrollDown}>
                <div className={style.scrollDownText}>Scroll Down</div>
                <div className={style.scrollDownArrow}></div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

// 배경 이미지 URL을 반환하는 헬퍼 함수
const getBackgroundImage = (index) => {
  const images = [
    "", // 첫 번째 섹션은 흰 배경
    "https://images.unsplash.com/photo-1597318181409-cf64d0b5d8a2?q=80&w=2070&auto=format&fit=crop&w=1920&h=1080",
    "https://images.unsplash.com/photo-1523920290228-4f321a939b4c?q=80&w=2067&auto=format&fit=crop&w=1920&h=1080",
    "https://images.unsplash.com/photo-1525193612562-0ec53b0e5d7c?q=80&w=2070&auto=format&fit=crop&w=1920&h=1080",
    "https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?q=80&w=2070&auto=format&fit=crop&w=1920&h=1080",
  ];
  return images[index];
};

// 각 섹션의 내용을 렌더링하는 헬퍼 함수
const renderContent = (index) => {
  const contents = [
    // 첫 번째 섹션 (기존 내용)
    <div className={style.ParallaxContent}>
      <div className={style.menu_title}>
        <span className={style.underline}>Kokee Story</span>
      </div>
      <p className={style.menu_content}>
        <span className={style.fade_in_up}>언제 어디서든, 합리적인 가치로</span>
        <br />
        <span className={style.fade_in_up} style={{ animationDelay: "0.3s" }}>
          일상에 특별한 영감을 불어넣는 KOKEE TEA입니다.
        </span>
      </p>
    </div>,
    // 나머지 섹션들
    <div className={style.ParallaxContent}>
      <h2>Special Recipe</h2>
      <p>
        엄선된 재료와 특별한 레시피로
        <br />
        완성되는 프리미엄 밀크티
      </p>
    </div>,
    <div className={style.ParallaxContent}>
      <h2>Taste Innovation</h2>
      <p>
        트렌디한 맛과 새로운 경험으로
        <br />
        즐거움을 전하는 KOKEE TEA
      </p>
    </div>,
    <div className={style.ParallaxContent}>
      <h2>Sweet Moments</h2>
      <p>
        달콤한 한 잔으로 채우는
        <br />
        일상 속 작은 행복
      </p>
    </div>,
    <div className={style.ParallaxContent}>
      <h2>Our Promise</h2>
      <p>
        변함없는 맛과 품질로
        <br />늘 함께하는 밀크티 브랜드
      </p>
    </div>,
  ];
  return contents[index];
};

export default KokeeStory;
