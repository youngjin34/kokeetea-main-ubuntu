import React, { useState, useEffect } from "react";
import style from "./KokeeStory.module.css";

const KokeeStory = () => {
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
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
              언제 어디서나, 부담스럽지 않은 가격과 대용량으로<br/>
              사람들에게 긍정적인 에너지를 주는 KOKEE TEA입니다.
            </p>
          </div>
        </div>
      </div>

      <div className={style.ParallaxSection}>
        <div 
          className={style.ParallaxBackground}
          style={{
            backgroundImage: `url("/images/succulent-8909520.jpg")`,
            transform: `translateY(${(scrollPosition - window.innerHeight) * 0.5}px)`
          }}
        >
          <div className={style.ParallaxContent}>
            <h2>Our Story</h2>
            <p>최고의 재료와 정성으로 만드는<br/>
               코키티의 특별한 이야기를 만나보세요</p>
          </div>
        </div>
      </div>

      <div className={style.ParallaxSection}>
        <div 
          className={style.ParallaxBackground}
          style={{
            backgroundImage: `url("/images/tulips-5104497.jpg")`,
            transform: `translateY(${(scrollPosition - window.innerHeight * 2) * 0.5}px)`
          }}
        >
          <div className={style.ParallaxContent}>
            <h2>Innovation</h2>
            <p>새로운 맛과 경험을 향한<br/>
               코키티의 끊임없는 도전</p>
          </div>
        </div>
      </div>
      
      <div className={style.ParallaxSection}>
        <div 
          className={style.ParallaxBackground}
          style={{
            backgroundImage: `url("/images/milky-way-6337038.jpg")`,
            transform: `translateY(${(scrollPosition - window.innerHeight * 3) * 0.5}px)`
          }}
        >
          <div className={style.ParallaxContent}>
            <h2>Our Vision</h2>
            <p>더 나은 미래를 향한<br/>
               코키티의 비전</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KokeeStory;
