import { useEffect, useRef, useState } from 'react';
import Welcome from '../components/Welcome';
import style from './Home.module.css';
import HomeListButton from '../components/HomeListButton';
import PopularMenu from '../components/PopularMenu';
import AboutUs from '../components/AboutUs';
import Franchise from '../components/Franchise';

const items = [
  '/images/Signature/Black Lychee.png',
  '/images/Signature/Dragon and Rose.png',
  '/images/Signature/Dream Of Butterfly.png',
  '/images/Signature/Georgia On My Mind.png',
  '/images/Signature/Mango Passionfruit.png',
  '/images/Signature/Purple Love.png',
  '/images/Signature/Rose From San Francisco.png',
];

function Home({ currentPage, setCurrentPage }) {
  const outerDivRef = useRef();
  const [isScrolling, setIsScrolling] = useState(false);
  const [homeHeight, setHomeHeight] = useState(0); // Home 컴포넌트 전체 높이 상태

  const scrollToSection = (pageIndex) => {
    const pageHeight = window.innerHeight;
    const yOffset = pageIndex * pageHeight;

    if (outerDivRef.current) {
      setIsScrolling(true);
      outerDivRef.current.scrollTo({
        top: yOffset,
        left: 0,
        behavior: 'smooth',
      });
      setCurrentPage(pageIndex);
      setTimeout(() => {
        setIsScrolling(false);
      }, 500); // 스크롤 애니메이션 시간과 동일하게 설정
    }
  };

  useEffect(() => {
      // 컴포넌트 마운트 시 전체 높이 저장
      if (outerDivRef.current) {
        setHomeHeight(outerDivRef.current.scrollHeight);
      }

    const wheelHandler = (e) => {
      if (isScrolling) {
        return; // 스크롤 중이면 이벤트 무시
      }
        const { deltaY } = e;
        const { scrollTop } = outerDivRef.current;
        const pageHeight = window.innerHeight;

         if (deltaY > 0) {
           // 스크롤 내릴 때
          if (scrollTop >= 0 && scrollTop < pageHeight) {
               scrollToSection(1);
           } else if (scrollTop >= pageHeight && scrollTop < pageHeight * 2) {
                scrollToSection(2);
            } else if (scrollTop >= pageHeight * 2 && scrollTop < pageHeight * 3) {
                 scrollToSection(3);
          }
        } else {
             // 스크롤 올릴 때
              if (scrollTop <= 0) {
                   // Home 컴포넌트의 최상단에 도달했을 경우, 상위 컴포넌트로 스크롤 이벤트 전달
                   return; //  상위 컴포넌트에서 스크롤 처리하도록 이벤트를 전달
               } else if (scrollTop >= pageHeight * 3) {
                  scrollToSection(2);
                } else if (scrollTop >= pageHeight * 2 && scrollTop < pageHeight * 3) {
                 scrollToSection(1);
               } else if (scrollTop >= pageHeight && scrollTop < pageHeight * 2) {
                 scrollToSection(0);
             }
         }
      };

    const outerDivRefCurrent = outerDivRef.current;
    outerDivRefCurrent.addEventListener('wheel', wheelHandler);
    return () => {
      outerDivRefCurrent.removeEventListener('wheel', wheelHandler);
    };
  }, [isScrolling, scrollToSection, homeHeight]);


  return (
    <div ref={outerDivRef} className={`${style.Home}`} style={{ overflowY: 'auto' }}>
      <HomeListButton
        currentPage={currentPage}
        scrollToSection={scrollToSection}
      />
      <div id="section-0" className={`${style.one_page}`}>
        <Welcome />
      </div>
      <div id="section-1" className={`${style.one_page}`}>
        <PopularMenu items={items} />
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