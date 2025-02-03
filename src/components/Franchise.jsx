import { useState } from "react";
import style from "./Franchise.module.css";
import { Link } from "react-router-dom";

function Franchise() {
  const [location, setLocation] = useState("서울");
  const [size, setSize] = useState(10);
  const [interiorGrade, setInteriorGrade] = useState("기본");
  const [parkingSpace, setParkingSpace] = useState(0);
  const [staffCount, setStaffCount] = useState(2);
  const [isCorner, setIsCorner] = useState(false);

  // 예시 가격 계산
  const calculateCost = () => {
    const baseCost = 30000000; // 기본 가맹비
    const locationMultiplier = {
      서울: 1.3,
      경기: 1.2,
      인천: 1.2,
      부산: 1.1,
      기타: 1.0,
    };

    // 인테리어 등급별 비용
    const interiorCost = {
      기본: 500000,
      고급: 800000,
      프리미엄: 1200000,
    };

    // 기본 계산
    let totalCost = baseCost * locationMultiplier[location];

    // 평수 계산
    totalCost += size * 1000000;

    // 인테리어 비용
    totalCost += size * interiorCost[interiorGrade];

    // 주차공간 비용
    totalCost += parkingSpace * 5000000;

    // 코너 매장 할증
    if (isCorner) {
      totalCost *= 1.1;
    }

    // 직원 수에 따른 예상 월 인건비
    const monthlyLaborCost = staffCount * 2200000;

    return {
      initialCost: Math.round(totalCost / 10000) * 10000,
      monthlyLaborCost: monthlyLaborCost,
    };
  };

  const costs = calculateCost();

  return (
    <div className={style.Franchise}>
      <div className={style.img_container}>
        <img
          src="/public/img/franchise.png"
          alt="Franchise"
          className={style.franchise_img}
        />
      </div>
      <div className={`${style.franchise_content}`}>
        <p className={`${style.franchise_title}`}>
          KOKEE TEA
          <br />
          가맹 비용 시뮬레이션
        </p>
        <p className={`${style.franchise_sub_title}`}>
          예상 창업 비용을 계산해보세요!
        </p>

        <div className={style.simulation_form}>
          <div className={style.form_group}>
            <label className={style.form_label}>지역 선택:</label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className={style.select_input}
            >
              <option value="서울">서울</option>
              <option value="경기">경기</option>
              <option value="인천">인천</option>
              <option value="부산">부산</option>
              <option value="기타">기타 지역</option>
            </select>
          </div>

          <div className={style.form_group}>
            <label className={style.form_label}>매장 평수:</label>
            <input
              type="number"
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              min="5"
              max="100"
              className={style.number_input}
            />{" "}
            <span className={style.unit}>㎡</span>
          </div>

          <div className={style.form_group}>
            <label className={style.form_label}>인테리어 등급:</label>
            <select
              value={interiorGrade}
              onChange={(e) => setInteriorGrade(e.target.value)}
              className={style.select_input}
            >
              <option value="기본">기본</option>
              <option value="고급">고급</option>
              <option value="프리미엄">프리미엄</option>
            </select>
          </div>

          <div className={style.form_group}>
            <label className={style.form_label}>주차공간:</label>
            <input
              type="number"
              value={parkingSpace}
              onChange={(e) => setParkingSpace(Number(e.target.value))}
              min="0"
              max="20"
              className={style.number_input}
            />{" "}
            <span className={style.unit}>대</span>
          </div>

          <div className={style.form_group}>
            <label className={style.form_label}>예상 직원 수:</label>
            <input
              type="number"
              value={staffCount}
              onChange={(e) => setStaffCount(Number(e.target.value))}
              min="1"
              max="10"
              className={style.number_input}
            />{" "}
            <span className={style.unit}>명</span>
          </div>

          <div className={style.form_group}>
            <label className={style.form_label}>코너 매장:</label>
            <input
              type="checkbox"
              checked={isCorner}
              onChange={(e) => setIsCorner(e.target.checked)}
              className={style.checkbox_input}
            />
            <span className={style.checkbox_label}>코너 위치 (10% 할증)</span>
          </div>

          <div className={style.cost_result}>
            <h3>예상 창업 비용</h3>
            <p className={style.cost}>
              초기 비용: 약 {costs.initialCost.toLocaleString()}원
            </p>
            <p className={style.monthly_cost}>
              예상 월 인건비: 약 {costs.monthlyLaborCost.toLocaleString()}원
            </p>
            <small>* 위 금액은 예상 비용으로, 실제와 다를 수 있습니다.</small>
            
            <div className={`${style.franchise_btn}`}>
              <button className={`${style.btn} ${style.btn_primary} ${style.btn_ghost}`}>
                <Link to="/store">매장찾기</Link>
              </button>
              <button className={`${style.btn} ${style.btn_primary} ${style.btn_ghost}`}>
                <Link to="/affiliated">가맹문의</Link>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Franchise;
