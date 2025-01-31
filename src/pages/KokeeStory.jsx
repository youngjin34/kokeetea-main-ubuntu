import React, { useState, useEffect } from "react";
import style from "./KokeeStory.module.css";

const KokeeStory = () => {
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);

    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className={style.Container}>
      <div className={style.ParallaxSection}>
        <div 
          className={style.ParallaxBackground}
          style={{
            backgroundColor: "#FFFFFF",
            transform: `translateY(${scrollPosition * 0.5}px)`
          }}
        >
          <div className={style.ParallaxContent}>
            <div className={style.menu_title}>
              <span className={style.underline}>Kokee Story</span>
            </div>
            <p className={style.menu_content}>
              <span className={style.fade_in_up}>언제 어디서든, 합리적인 가치로</span><br/>
              <span className={style.fade_in_up} style={{ animationDelay: '0.3s' }}>일상에 특별한 영감을 불어넣는 KOKEE TEA입니다.</span>
            </p>
          </div>
          <div className={style.scrollDown}>
            <div className={style.scrollDownText}>Scroll Down</div>
            <div className={style.scrollDownArrow}></div>
          </div>
        </div>
      </div>

      <div className={style.ParallaxSection}>
        <div 
          className={style.ParallaxBackground}
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url("https://images.unsplash.com/photo-1597318181409-cf64d0b5d8a2?q=80&w=2070&auto=format&fit=crop")`,
            transform: `translateY(${(scrollPosition - window.innerHeight) * 0.5}px)`
          }}
        >
          <div className={style.ParallaxContent}>
            <h2>Special Recipe</h2>
            <p>엄선된 재료와 특별한 레시피로<br/>
               완성되는 프리미엄 밀크티</p>
          </div>
        </div>
      </div>

      <div className={style.ParallaxSection}>
        <div 
          className={style.ParallaxBackground}
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url("https://images.unsplash.com/photo-1523920290228-4f321a939b4c?q=80&w=2067&auto=format&fit=crop")`,
            transform: `translateY(${(scrollPosition - window.innerHeight * 2) * 0.5}px)`
          }}
        >
          <div className={style.ParallaxContent}>
            <h2>Taste Innovation</h2>
            <p>트렌디한 맛과 새로운 경험으로<br/>
               즐거움을 전하는 KOKEE TEA</p>
          </div>
        </div>
      </div>

      <div className={style.ParallaxSection}>
        <div 
          className={style.ParallaxBackground}
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url("https://images.unsplash.com/photo-1525193612562-0ec53b0e5d7c?q=80&w=2070&auto=format&fit=crop")`,
            transform: `translateY(${(scrollPosition - window.innerHeight * 3) * 0.5}px)`
          }}
        >
          <div className={style.ParallaxContent}>
            <h2>Sweet Moments</h2>
            <p>달콤한 한 잔으로 채우는<br/>
               일상 속 작은 행복</p>
          </div>
        </div>
      </div>

      <div className={style.ParallaxSection}>
        <div 
          className={style.ParallaxBackground}
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url("https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?q=80&w=2070&auto=format&fit=crop")`,
            transform: `translateY(${(scrollPosition - window.innerHeight * 4) * 0.5}px)`
          }}
        >
          <div className={style.ParallaxContent}>
            <h2>Our Promise</h2>
            <p>변함없는 맛과 품질로<br/>
               늘 함께하는 밀크티 브랜드</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KokeeStory;
