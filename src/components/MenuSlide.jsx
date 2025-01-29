import { useState } from "react";
import style from "./MenuSlide.module.css";
import Slider from "./Slider";

const coldCloud = [
  {
    name: "브라운 슈가 콜드 브루",
    image: "/img/Cold Cloud/Brown Sugar Cold Brew.png",
  },
  {
    name: "브라운 슈가 달고나떼",
    image: "/img/Cold Cloud/Brown Sugar Dalgonatte.png",
  },
  {
    name: "오레오 브라운 슈가",
    image: "/img/Cold Cloud/Oreo Brown Sugar.png",
  },
  {
    name: "오레오 C&C 브라운 슈가",
    image: "/img/Cold Cloud/Oreo C&C Brown Sugar.png",
  },
  {
    name: "스위트 클라우드 콜드 브루",
    image: "/img/Cold Cloud/Sweet Cloud Cold Brew.png",
  },
  {
    name: "스위트 클라우드 그린 브루",
    image: "/img/Cold Cloud/Sweet Cloud Green Brew.png",
  },
];

const fruitTea = [
  { name: "청포도차", image: "/img/Fruit Tea/Green Grape Tea.png" },
  {
    name: "허니 자몽 블랙티",
    image: "/img/Fruit Tea/Honey Grapefruit Black Tea.png",
  },
  {
    name: "오렌지 상그리아",
    image: "/img/Fruit Tea/Orange Sangria.png",
  },
  {
    name: "스트로베리 버진 모히또",
    image: "/img/Fruit Tea/Strawberry Virgin mojito.png",
  },
];

const iceBlended = [
  { name: "드래곤푸르츠", image: "/img/Ice Blended/Dragonfruit.png" },
  {
    name: "아이스 망고 패션프루트",
    image: "/img/Ice Blended/Ice Mango Passionfruit.png",
  },
  {
    name: "리치",
    image: "/img/Ice Blended/Lychee.png",
  },
  {
    name: "망고 패션프루트",
    image: "/img/Ice Blended/Mango  Passionfruit.png",
  },
  {
    name: "망고",
    image: "/img/Ice Blended/Mango.png",
  },
  { name: "말차", image: "/img/Ice Blended/Matcha.png" },
  {
    name: "오레오",
    image: "/img/Ice Blended/Oreo.png",
  },
  {
    name: "피나 콜라다",
    image: "/img/Ice Blended/Pina Colada.png",
  },
  {
    name: "스트로베리",
    image: "/img/Ice Blended/Strawberry.png",
  },
  {
    name: "타로",
    image: "/img/Ice Blended/Taro.png",
  },
];

const milkTea = [
  {
    name: "브라운 슈가 밀크티",
    image: "/img/Milk Tea/Brown Sugar Milk Tea.png",
  },
  { name: "클래식 타이 티", image: "/img/Milk Tea/Classic Thai Tea.png" },
  {
    name: "코코넛 밀크티",
    image: "/img/Milk Tea/Coconut Milk Tea.png",
  },
  {
    name: "커피 밀크티",
    image: "/img/Milk Tea/Coffee Milk Tea.png",
  },
  {
    name: "허니 밀크티",
    image: "/img/Milk Tea/Honey Milk Tea.png",
  },
  { name: "하우스 밀크티", image: "/img/Milk Tea/House Milk Tea.png" },
  {
    name: "코키 밀크티",
    image: "/img/Milk Tea/KOKEE Milk Tea.png",
  },
  {
    name: "말차 라떼",
    image: "/img/Milk Tea/Matcha Latte.png",
  },
  {
    name: "오레오 밀크티",
    image: "/img/Milk Tea/Oreo Milk Tea.png",
  },
  {
    name: "스트로베리 밀크티",
    image: "/img/Milk Tea/Strawberry Milk Tea.png",
  },
];

const signature = [
  { name: "블랙 리치", image: "/img/Signature/Black Lychee.png" },
  { name: "드래곤과 장미", image: "/img/Signature/Dragon and Rose.png" },
  {
    name: "버터플라이의 꿈",
    image: "/img/Signature/Dream Of Butterfly.png",
  },
  {
    name: "마음속의 조지아",
    image: "/img/Signature/Georgia On My Mind.png",
  },
  {
    name: "망고 패션프루트",
    image: "/img/Signature/Mango Passionfruit.png",
  },
  { name: "퍼플 러브", image: "/img/Signature/Purple Love.png" },
  {
    name: "샌프란시스코의 장미",
    image: "/img/Signature/Rose From San Francisco.png",
  },
];

function MenuSlide() {
  const [selectedMenu, setSelectedMenu] = useState(coldCloud);

  const selectedMenuClick = (menu) => {
    // 선택된 메뉴의 데이터를 상태로 설정
    switch (menu) {
      case "Cold Cloud":
        setSelectedMenu(coldCloud);
        break;
      case "Fruit Tea":
        setSelectedMenu(fruitTea);
        break;
      case "Ice Blended":
        setSelectedMenu(iceBlended);
        break;
      case "Milk Tea":
        setSelectedMenu(milkTea);
        break;
      case "Signature":
        setSelectedMenu(signature);
        break;
      default:
        setSelectedMenu([]);
    }
  };

  return (
    <div className={style.MenuSlide}>
      <h1 className={`${style.title} ${style.underline}`}>MENU</h1>
      <div className={style.MenuTabs}>
        <span
          className={`${style.menu} ${
            selectedMenu === coldCloud ? style.active : ""
          }`}
          onClick={() => selectedMenuClick("Cold Cloud")}
        >
          Cold Cloud
        </span>
        <span
          className={`${style.menu} ${
            selectedMenu === fruitTea ? style.active : ""
          }`}
          onClick={() => selectedMenuClick("Fruit Tea")}
        >
          Fruit Tea
        </span>
        <span
          className={`${style.menu} ${
            selectedMenu === iceBlended ? style.active : ""
          }`}
          onClick={() => selectedMenuClick("Ice Blended")}
        >
          Ice Blended
        </span>
        <span
          className={`${style.menu} ${
            selectedMenu === milkTea ? style.active : ""
          }`}
          onClick={() => selectedMenuClick("Milk Tea")}
        >
          Milk Tea
        </span>
        <span
          className={`${style.menu} ${
            selectedMenu === signature ? style.active : ""
          }`}
          onClick={() => selectedMenuClick("Signature")}
        >
          Signature
        </span>
      </div>
      <Slider selectedMenu={selectedMenu} />
    </div>
  );
}

export default MenuSlide;
