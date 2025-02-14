import { useState, useEffect } from "react";
import style from "./AboutUs.module.css";

function AboutUs() {
  const [hoverContent, setHoverContent] = useState([
    "KOKEE TEA는 맛있는 차 한 잔으로 시작하여 재미있는 옆집 카페를 만들고 고객에게 다가갑니다.",
    "강력한 운영 파트너와 함께 좋은 비즈니스를 구축하는 것을 중요하게 생각합니다.",
    "KOKEE TEA는 매일 행복한 물결을 퍼뜨리기 위해 최선을 다하고 있습니다.",
  ]);

  const hoverData = {
    cream: [
      "KOKEE TEA는 자연에서 온 순수함을 담아내기 위해 유기농 크림을 사용합니다.",
      "최고 품질의 유기농 인증 크림으로 풍부하고 부드러운 텍스처와 깊은 맛을 완성합니다.",
      "건강과 환경을 생각한 선택으로 더욱 특별한 음료를 선사합니다.",
    ],
    sugar: [
      "KOKEE TEA는 자연 그대로의 황금빛 사탕수수를 사용해 건강하고 균형 잡힌 단맛을 제공합니다.",
      "인공 감미료 대신, 전통 방식으로 정제한 사탕수수 설탕을 통해 풍미를 살리고 몸에도 더 좋은 선택을 지향합니다.",
      "자연이 준 달콤함으로 완벽한 음료를 만나보세요.",
    ],
    tea: [
      "KOKEE TEA는 세계 각지에서 엄선한 신선한 찻잎으로 최고의 풍미를 구현합니다.",
      "직접 손으로 수확한 잎사귀를 사용해 신선한 향과 깊은 맛을 한 잔에 담았습니다.",
      "차 한 잔으로 자연이 선사하는 고유한 맛의 향연을 경험해 보세요.",
    ],
  };

  useEffect(() => {
    // 내용이 바뀔 때마다 애니메이션을 재시작합니다.
    const timeout = setTimeout(() => {
      // 0.5초 뒤에 애니메이션을 리셋
    }, 500);

    return () => clearTimeout(timeout);
  }, [hoverContent]); // hoverContent 변경시마다 실행

  const renderHoverContent = () => {
    return hoverContent.map((line, index) => <p key={index}>{line}</p>);
  };

  return (
    <div className={style.AboutUs}>
      <div className={style.AboutUsContent}>
        <h1 className={`${style.title} ${style.underline}`}>About Us</h1>
        <br />
        <div className={style.imageContainer}>
          <div className={style.imageWrapper}>
            <img
              src="/img/organicCream.png"
              alt="Organic Cream"
              onMouseEnter={() => setHoverContent(hoverData.cream)}
              onMouseLeave={() =>
                setHoverContent([
                  "KOKEE TEA는 맛있는 차 한 잔으로 시작하여 재미있는 옆집 카페를 만들고 고객에게 다가갑니다.",
                  "강력한 운영 파트너와 함께 좋은 비즈니스를 구축하는 것을 중요하게 생각합니다.",
                  "KOKEE TEA는 매일 행복한 물결을 퍼뜨리기 위해 최선을 다하고 있습니다.",
                ])
              }
            />
          </div>

          <div
            className={style.imageWrapper}
            onMouseEnter={() => setHoverContent(hoverData.sugar)}
            onMouseLeave={() =>
              setHoverContent([
                "KOKEE TEA는 맛있는 차 한 잔으로 시작하여 재미있는 옆집 카페를 만들고 고객에게 다가갑니다.",
                "강력한 운영 파트너와 함께 좋은 비즈니스를 구축하는 것을 중요하게 생각합니다.",
                "KOKEE TEA는 매일 행복한 물결을 퍼뜨리기 위해 최선을 다하고 있습니다.",
              ])
            }
          >
            <img src="/img/goldenCaneSugar.png" alt="Golden Cane Sugar" />
          </div>

          <div
            className={style.imageWrapper}
            onMouseEnter={() => setHoverContent(hoverData.tea)}
            onMouseLeave={() =>
              setHoverContent([
                "KOKEE TEA는 맛있는 차 한 잔으로 시작하여 재미있는 옆집 카페를 만들고 고객에게 다가갑니다.",
                "강력한 운영 파트너와 함께 좋은 비즈니스를 구축하는 것을 중요하게 생각합니다.",
                "KOKEE TEA는 매일 행복한 물결을 퍼뜨리기 위해 최선을 다하고 있습니다.",
              ])
            }
          >
            <img src="/img/finestTea.png" alt="Finest Tea" />
          </div>
        </div>

        {/* Render hoverContent */}
        <div className={style.hoverContent}>{renderHoverContent()}</div>
      </div>
    </div>
  );
}

export default AboutUs;
