import { useEffect, useRef } from "react";
import Welcome from "../components/Welcome";
import style from "./Home.module.css";
import HomeListButton from "../components/HomeListButton";
import PopularMenu from "../components/PopularMenu";
import AboutUs from "../components/AboutUs";
import Franchise from "../components/Franchise";

function Home({ currentPage, setCurrentPage }) {
  const outerDivRef = useRef();

  const scrollToSection = (pageIndex) => {
    const pageHeight = window.innerHeight;
    const yOffset = pageIndex * pageHeight;

    if (outerDivRef.current) {
      outerDivRef.current.scrollTo({
        top: yOffset,
        left: 0,
        behavior: "smooth",
      });
      setCurrentPage(pageIndex);
    }
  };

  useEffect(() => {
    const wheelHandler = (e) => {
      e.preventDefault();
      const { deltaY } = e;
      const { scrollTop } = outerDivRef.current;
      const pageHeight = window.innerHeight;

      const totalSections = 4; // 4개의 섹션 + 푸터

      if (deltaY > 0) {
        // 스크롤 내릴 때
        const nextSectionIndex = Math.ceil(scrollTop / pageHeight);
        if (nextSectionIndex < totalSections - 1) {
          scrollToSection(nextSectionIndex + 1);
          setCurrentPage(nextSectionIndex + 1);
        }
      } else {
        // 스크롤 올릴 때
        const prevSectionIndex = Math.floor(scrollTop / pageHeight);
        if (prevSectionIndex > 0) {
          scrollToSection(prevSectionIndex - 1);
          setCurrentPage(prevSectionIndex - 1);
        }
      }
    };

    const outerDivRefCurrent = outerDivRef.current;
    outerDivRefCurrent.addEventListener("wheel", wheelHandler);
    return () => {
      outerDivRefCurrent.removeEventListener("wheel", wheelHandler);
    };
  }, []);

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
        <PopularMenu />
      </div>
      <div id="section-2" className={`${style.one_page}`}>
        <AboutUs />
      </div>
      <div id="section-3" className={`${style.one_page}`}>
        <Franchise />
      </div>
    </div>
  );
}

export default Home;
