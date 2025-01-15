import React, { useState } from "react";
import style from "./KokeeStory.module.css";

const KokeeStory = () => {
  const [activeImage, setActiveImage] = useState(null);

  return (
    <div className={style.Container}>
      <div className={style.MainContent}>
        <div className={style.menu_title}>
          <span className={style.underline}>KOKEE STORY</span>
        </div>
        <p className={style.menu_content}>
          언제 어디서나, 부담스럽지 않은 가격과 대용량으로 <br />
          사람들에게 긍정적인 에너지를 주는 KOKEE TEA입니다.
        </p>
        <div className={style.FeaturesGrid}>
          <div className={style.FeatureBox}>
            <h3 className={style.FeatureTitle}>BIG</h3>
            <p className={style.FeatureText}>
              <span className={style.FeatureTextBold}>크다</span> <br />
              기본 사이즈보다 더 큰 빅사이즈 버블티
            </p>
          </div>

          <div className={style.FeatureBox}>
            <h3 className={style.FeatureTitle}>DELICIOUS</h3>
            <p className={style.FeatureText}>
              <span className={style.FeatureTextBold}>맛있다</span> <br />
              상큼하고 산뜻한 음료수와 매일 끓여 만드는 달콤하고 쫄깃한 타피오카
              펄
            </p>
          </div>

          <div className={style.FeatureBox}>
            <h3 className={style.FeatureTitle}>RATIONAL</h3>
            <p className={style.FeatureText}>
              <span className={style.FeatureTextBold}>합리적이다</span> <br />
              유통과정을 최소화하여 저렴하고 합리적인 가격에 제공
            </p>
          </div>

          <div className={style.FeatureBox}>
            <h3 className={style.FeatureTitle}>DIFFERENTIATION</h3>
            <p className={style.FeatureText}>
              <span className={style.FeatureTextBold}>다양하다</span> <br />
              재미있는 비주얼과 콘셉트, 시즌마다 출시되는 트렌디한 음료
            </p>
          </div>
        </div>
        <div className={style.ImageGallery}>
          <div
            className={`${style.GalleryImageContainer} ${
              activeImage === 0 ? style.active : ""
            }`}
            onClick={() => setActiveImage(activeImage === 0 ? null : 0)}
          >
            <img
              src="/img/Fruit Tea/Green Grape Tea.png"
              className={style.GalleryImage}
              alt="Kokee Drink"
            />
            <div className={style.ImageOverlay}>
              <div className={style.ImageText}>
                한 잔의 여유
                <br />
                <span style={{ fontSize: "0.9rem", fontWeight: "normal" }}>
                오늘은 저희와 함께<br />향기로운 커피로 하루를 채워보세요!
                </span>
              </div>
            </div>
          </div>

          <div
            className={`${style.GalleryImageContainer} ${
              activeImage === 1 ? style.active : ""
            }`}
            onClick={() => setActiveImage(activeImage === 1 ? null : 1)}
          >
            <img
              src="/img/Fruit Tea/Honey Grapefruit Black Tea.png"
              className={style.GalleryImage}
              alt="Kokee Drink"
            />
            <div className={style.ImageOverlay}>
              <div className={style.ImageText}>
              특별한 순간, 특별한 커피
                <br />
                <span style={{ fontSize: "0.9rem", fontWeight: "normal" }}>
                당신만을 위한 향긋한 커피와<br />따뜻한 공간이 기다립니다.
                </span>
              </div>
            </div>
          </div>

          <div 
            className={`${style.GalleryImageContainer} ${
              activeImage === 2 ? style.active : ""
            }`}
            onClick={() => setActiveImage(activeImage === 2 ? null : 2)}
          >
            <img
              src="/img/Fruit Tea/Orange Sangria.png"
              className={style.GalleryImage}
              alt="Kokee Drink"
            />
            <div className={style.ImageOverlay}>
              <div className={style.ImageText}>
              달콤한 휴식의 시간
                <br />
                <span style={{ fontSize: "0.9rem", fontWeight: "normal" }}>
                커피와 디저트가 만드는<br />완벽한 조화를 만나보세요.
                </span>
              </div>
            </div>
          </div>

          <div
            className={`${style.GalleryImageContainer} ${
              activeImage === 3 ? style.active : ""
            }`}
            onClick={() => setActiveImage(activeImage === 3 ? null : 3)}
          >
            <img
              src="/img/Fruit Tea/Strawberry Virgin mojito.png"
              className={style.GalleryImage}
              alt="Kokee Drink"
            />
            <div className={style.ImageOverlay}>
              <div className={style.ImageText}>
              하루의 시작은 여기서!
                <br />
                <span style={{ fontSize: "0.9rem", fontWeight: "normal" }}>
                신선한 커피 한 잔으로<br />활기찬 하루를 시작해 보세요!
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KokeeStory;
