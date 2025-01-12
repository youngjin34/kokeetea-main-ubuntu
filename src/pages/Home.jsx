import { useEffect, useRef, useState } from 'react';
import Banner from '../components/Banner';
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

function Home() {
  const outerDivRef = useRef();
  const [currentPage, setCurrentPage] = useState(1);

  const scrollToSection = (pageIndex) => {
    const pageHeight = window.innerHeight;
    const yOffset = pageIndex * pageHeight;

    if (outerDivRef.current) {
      outerDivRef.current.scrollTo({
        top: yOffset,
        left: 0,
        behavior: 'smooth',
      });
      setCurrentPage(pageIndex + 1);
    }
  };

  useEffect(() => {
    const wheelHandler = (e) => {
      e.preventDefault();
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
        if (scrollTop >= pageHeight * 3) {
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
  }, []);

  return (
    <div ref={outerDivRef} className={`${style.Home}`}>
      <HomeListButton
        currentPage={currentPage}
        scrollToSection={scrollToSection}
      />
      <div id="section-0" className={`${style.one_page}`}>
        <Banner />
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
