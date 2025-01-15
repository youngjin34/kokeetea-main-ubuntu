import React from 'react';
import style from './KokeeStory.module.css'

const KokeeStory = () => {
  return (
    <div className={style.Container}>
      <div className={style.MainContent}>
        <h1 className={style.Title}>KOKEE STORY</h1>
        <p className={style.SubTitle}>
          언제 어디서나, 부담스럽지 않은 가격과 대용량으로
          사람들에게 긍정적인 에너지를 주는 KOKEE TEA입니다.
        </p>
        <div className={style.FeaturesGrid}> 
          <div className={style.FeatureBox}>
            <h3 className={style.FeatureTitle}>BIG</h3>
            <p className={style.FeatureText}>기본보다 많은 양의 빅사이즈 버블티</p>
          </div>
          <div className={style.FeatureBox}>
            <h3 className={style.FeatureTitle}>DELICIOUS</h3>
            <p className={style.FeatureText}>상큼하고 산뜻한 음료수와 매일 끓여 만드는 달콤하고 쫄깃한 타피오카 펄</p>
          </div>
          <div className={style.FeatureBox}>
            <h3 className={style.FeatureTitle}>RATIONAL</h3>
            <p className={style.FeatureText}>유통과정을 최소화하여 최대한 저렴하고 합리적인 가격에 제공</p>
          </div>
          <div className={style.FeatureBox}>
            <h3 className={style.FeatureTitle}>DIFFERENTIATION</h3>
            <p className={style.FeatureText}>재미있는 비주얼과 콘셉트, 시즌마다 출시되는 트렌디한 음료</p>
          </div>
        </div>
        <div className={style.ImageGallery}>
          <img src="/img/Fruit Tea/Green Grape Tea.png" className={style.GalleryImage} alt="Kokee Drink" />
          <img src="/img/Fruit Tea/Honey Grapefruit Black Tea.png" className={style.GalleryImage} alt="Kokee Drink" />
          <img src="/img/Fruit Tea/Orange Sangria.png" className={style.GalleryImage} alt="Kokee Drink" />
          <img src="/img/Fruit Tea/Strawberry Virgin mojito.png" className={style.GalleryImage} alt="Kokee Drink" />
        </div>
      </div>
    </div>
  );
};

export default KokeeStory; 