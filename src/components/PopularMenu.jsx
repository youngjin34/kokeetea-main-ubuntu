import Carousel from "./Carousel";

import style from "./PopularMenu.module.css";

function PopularMenu({ items }) {
  return (
    <div className={style.PopularMenu}>
      <div className={style.menu_introduce}>
        <h2 className={style.menu_title} aria-label="KOKEE TEA 인기 메뉴">
          KOKEE TEA 인기 메뉴
        </h2>
        <div className={style.menu_content}>
          오로지 <span className={style.underline}>천연 황금</span> <br />
          <span className={style.underline}>사탕수수</span>로만 제조합니다
        </div>
        <p className={style.content}>
          자연 그대로의 풍미를 선사하는 맛의 비밀은 천연 황금 사탕수수입니다.
          <br />
          매일 우리는 최상급 재료를 사용하여 최고의 맛을 살려내며
          <br />
          여러분께 특별한 순간을 전해드릴 수 있도록 최선을 다하고 있습니다.
          <br />
        </p>
      </div>
      <div className={`${style.carousel}`}>
        <Carousel items={items} className={style.Carousel} />
      </div>
    </div>
  );
}

export default PopularMenu;
