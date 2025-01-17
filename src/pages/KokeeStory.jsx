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
            backgroundImage: `url("https://images.unsplash.com/photo-1461023058943-07fcbe16d735?q=80&w=2069&auto=format&fit=crop")`,
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
            backgroundImage: `url("https://images.unsplash.com/photo-1507133750040-4a8f57021571?q=80&w=2067&auto=format&fit=crop")`,
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
            backgroundImage: `url("https://images.unsplash.com/photo-1445116572660-236099ec97a0?q=80&w=2071&auto=format&fit=crop")`,
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

      <div className={style.ParallaxSection}>
        <div 
          className={style.ParallaxBackground}
          style={{
            backgroundImage: `url("https://images.unsplash.com/photo-1511537190424-bbbab87ac5eb?q=80&w=2070&auto=format&fit=crop")`,
            transform: `translateY(${(scrollPosition - window.innerHeight * 4) * 0.5}px)`
          }}
        >
          <div className={style.ParallaxContent}>
            <h2>Brand Value</h2>
            <p>건강한 라이프스타일을 추구하는<br/>
               당신의 일상 속 특별한 순간</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KokeeStory;
