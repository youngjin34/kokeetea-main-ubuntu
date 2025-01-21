import style from "./AboutUs.module.css";

function AboutUs() {
  return (
    <div className={style.AboutUs}>
      <div className={style.AboutUsContent}>
        <h1 className={`${style.title} ${style.underline}`}>About Us</h1>
        <br />
        <img
          src="/public/img/aboutUsIcon.png"
          className={`${style.about_us_icon}`}
        />
        <p className={`${style.content}`}>
          KOKEE TEA는 맛있는 차 한 잔으로 시작하여 재미있는 옆집 카페를 만들고
          고객에게 다가갑니다. <br />
          강력한 운영 파트너와 함께 좋은 비즈니스를 구축하는 것을 중요하게
          생각합니다. <br />
          KOKEE TEA는 매일 행복한 물결을 퍼뜨리기 위해 최선을 다하고 있습니다.
        </p>
      </div>
    </div>
  );
}

export default AboutUs;
