import React, { useState, useEffect, useCallback } from "react";
import style from "./KokeeStory.module.css";

const KokeeStory = () => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);

  const handleScroll = useCallback(() => {
    if (!isScrolling) {
      window.requestAnimationFrame(() => {
        setScrollPosition(window.scrollY);
        setIsScrolling(false);
      });
      setIsScrolling(true);
    }
  }, [isScrolling]);

  useEffect(() => {
    window.scrollTo(0, 0);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const calculateParallax = (index) => {
    const windowHeight = window.innerHeight;
    const offset = windowHeight * index;
    const relativeScroll = scrollPosition - offset;
    const parallaxFactor = 0.5;
    
    // 부드러운 감속 효과 추가
    const damping = Math.min(1, Math.abs(relativeScroll) / windowHeight);
    return relativeScroll * parallaxFactor * damping;
  };

  return (
    <div className={style.Container}>
      {[...Array(5)].map((_, index) => (
        <div key={index} className={style.ParallaxSection}>
          <div 
            className={style.ParallaxBackground}
            style={{
              backgroundImage: index === 0 
                ? 'none'
                : `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url("${getBackgroundImage(index)}")`,
              backgroundColor: index === 0 ? "#FFFFFF" : undefined,
              transform: `translate3d(0, ${calculateParallax(index)}px, 0)`,
              willChange: 'transform'
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
    "",
    "https://images.unsplash.com/photo-1597318181409-cf64d0b5d8a2?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1523920290228-4f321a939b4c?q=80&w=2067&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1525193612562-0ec53b0e5d7c?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?q=80&w=2070&auto=format&fit=crop"
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
        <span className={style.fade_in_up}>언제 어디서든, 합리적인 가치로</span><br/>
        <span className={style.fade_in_up} style={{ animationDelay: '0.3s' }}>일상에 특별한 영감을 불어넣는 KOKEE TEA입니다.</span>
      </p>
    </div>,
    // 나머지 섹션들
    <div className={style.ParallaxContent}>
      <h2>Special Recipe</h2>
      <p>엄선된 재료와 특별한 레시피로<br/>완성되는 프리미엄 밀크티</p>
    </div>,
    <div className={style.ParallaxContent}>
      <h2>Taste Innovation</h2>
      <p>트렌디한 맛과 새로운 경험으로<br/>즐거움을 전하는 KOKEE TEA</p>
    </div>,
    <div className={style.ParallaxContent}>
      <h2>Sweet Moments</h2>
      <p>달콤한 한 잔으로 채우는<br/>일상 속 작은 행복</p>
    </div>,
    <div className={style.ParallaxContent}>
      <h2>Our Promise</h2>
      <p>변함없는 맛과 품질로<br/>늘 함께하는 밀크티 브랜드</p>
    </div>
  ];
  return contents[index];
};

export default KokeeStory;
