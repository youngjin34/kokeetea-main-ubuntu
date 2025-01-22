import { useEffect, useRef, useState } from "react";
import style from "./Slider.module.css";

function Slider({ selectedMenu = "coldCloud" }) {
  const sliderRef = useRef(null); // 슬라이더 컨테이너 참조
  const [isSliding, setIsSliding] = useState(true); // 슬라이드 실행 상태

  // 랜덤 파스텔톤 색상을 생성하는 함수
  const generatePastelColor = () => {
    const r = Math.floor(Math.random() * 100 + 50); // 50~150 (어두운 빨강)
    const g = Math.floor(Math.random() * 100 + 50); // 50~150 (어두운 초록)
    const b = Math.floor(Math.random() * 100 + 50); // 50~150 (어두운 파랑)
    return `rgba(${r}, ${g}, ${b}, 0.1)`; // 투명도 90% 추가
  };

  useEffect(() => {
    if (!selectedMenu || selectedMenu.length === 0) return;

    const slider = sliderRef.current;
    let translateX = 0;

    // 0.1초마다 슬라이더를 부드럽게 이동
    const interval = setInterval(() => {
      if (isSliding && slider) {
        translateX -= 1; // 1px씩 이동
        if (Math.abs(translateX) >= slider.scrollWidth / 2) {
          translateX = 0; // 무한 루프: 처음으로 복귀
        }
        slider.style.transform = `translateX(${translateX}px)`;
      }
    }, 20); // 0.01초마다 실행

    return () => clearInterval(interval); // 언마운트 시 정리
  }, [selectedMenu, isSliding]);

  if (!selectedMenu || selectedMenu.length === 0) {
    return <div className={style.Empty}>메뉴를 선택해주세요!</div>;
  }

  return (
    <div className={style.SliderContainer}>
      <div className={style.SliderWrapper} ref={sliderRef}>
        {selectedMenu.concat(selectedMenu).map((item, index) => (
          <div key={index}>
            <div
              className={style.SlideItem}
              key={index}
              style={{ backgroundColor: generatePastelColor() }} // 파스텔톤 배경색 추가
            >
              <img src={item.image} alt={item.name} />
            </div>
            <p className={style.menu_name}>{item.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Slider;
