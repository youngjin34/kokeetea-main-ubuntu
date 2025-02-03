import { useEffect, useRef, useState } from "react";
import Welcome from "../components/Welcome";
import style from "./Home.module.css";
import HomeListButton from "../components/HomeListButton";
import MenuSlide from "../components/MenuSlide";
import AboutUs from "../components/AboutUs";
import Franchise from "../components/Franchise";
import Footer from "../components/Footer";

function Home({ currentPage, setCurrentPage }) {
  const outerDivRef = useRef();
  const [isScrolling, setIsScrolling] = useState(false); // 스크롤 중 여부 상태 관리
  const footerHeight = 140; // 푸터 높이 설정

  useEffect(() => {
    // 컴포넌트 마운트 시 항상 첫 번째 섹션으로 스크롤
    if (outerDivRef.current) {
      outerDivRef.current.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
      setCurrentPage(0);
    }
  }, []); // 빈 의존성 배열로 마운트 시에만 실행

  const scrollToSection = (pageIndex) => {
    const pageHeight = window.innerHeight;
    const totalHeight = outerDivRef.current.scrollHeight;
    const yOffset =
      pageIndex === 4
        ? totalHeight - footerHeight // 푸터 섹션 위치 계산
        : pageIndex * pageHeight;

    if (outerDivRef.current) {
      outerDivRef.current.scrollTo({
        top: yOffset,
        left: 0,
        behavior: "smooth",
      });
      setCurrentPage(pageIndex);

      // 스크롤 제한 해제
      setTimeout(() => {
        setIsScrolling(false);
      }, 800); // 스크롤 동작 완료 후 약간의 딜레이 추가
    }
  };

  useEffect(() => {
    const wheelHandler = (e) => {
      if (isScrolling) return; // 스크롤 중일 때 이벤트 차단
      setIsScrolling(true); // 스크롤 중 상태 설정

      e.preventDefault();
      const { deltaY } = e;
      const { scrollTop, scrollHeight } = outerDivRef.current;
      const pageHeight = window.innerHeight;
      const totalSections = 5; // 4개의 섹션 + 푸터

      const maxScrollPosition = scrollHeight - footerHeight;

      if (deltaY > 0) {
        // 스크롤 내릴 때
        const nextSectionIndex = Math.ceil(scrollTop / pageHeight);
        if (nextSectionIndex < totalSections - 1) {
          scrollToSection(nextSectionIndex + 1);
        } else if (scrollTop + pageHeight < maxScrollPosition) {
          scrollToSection(totalSections - 1);
        } else {
          setIsScrolling(false); // 마지막 섹션 이후에는 제한 해제
        }
      } else {
        // 스크롤 올릴 때
        if (scrollTop >= maxScrollPosition - footerHeight) {
          // 푸터만 가려지도록 정확한 위치로 스크롤 조정
          outerDivRef.current.scrollTo({
            top: maxScrollPosition - footerHeight, // 푸터 높이만큼 위로 스크롤
            left: 0,
            behavior: "smooth",
          });
          setTimeout(() => setIsScrolling(false), 800); // 동작 완료 후 제한 해제
          setCurrentPage(totalSections - 2); // 마지막 섹션 인덱스로 설정
        } else {
          const prevSectionIndex = Math.floor(scrollTop / pageHeight);
          if (prevSectionIndex > 0) {
            scrollToSection(prevSectionIndex - 1);
          } else {
            setIsScrolling(false); // 첫 섹션 이후에는 제한 해제
          }
        }
      }
    };

    const outerDivRefCurrent = outerDivRef.current;
    outerDivRefCurrent.addEventListener("wheel", wheelHandler);
    return () => {
      outerDivRefCurrent.removeEventListener("wheel", wheelHandler);
    };
  }, [isScrolling]);

  return (
    <div ref={outerDivRef} className={`${style.Home}`}>
      <HomeListButton
        currentPage={currentPage}
        scrollToSection={scrollToSection}
      />

      <div id="section-0" className={`${style.one_page}`}>
        <Welcome />
      </div>
      <div id="section-1" className={`${style.one_page}`}>
        <MenuSlide />
      </div>
      <div id="section-2" className={`${style.one_page}`}>
        <AboutUs />
      </div>
      <div id="section-3" className={`${style.one_page}`}>
        <Franchise />
      </div>
      {/* 푸터 섹션 */}
      <div style={{ height: `${footerHeight}px` }}>
        <Footer />
      </div>
    </div>
  );
}

export default Home;
