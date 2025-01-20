import { useEffect } from "react";
import style from "./FranchisePromotion.module.css";

const FranchisePromotion = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className={style.Container}>
      <div className={style.MainContent}>
        <div className={style.menu_title}>
          <span className={style.underline}>FRANCHISE</span>
        </div>
        <p className={style.menu_content}>
          KOKEE TEA와 함께 성공적인 비즈니스를 시작하세요. <br />
          차별화된 브랜드 가치와 안정적인 운영 시스템을 제공합니다.
        </p>

        <div className={style.BenefitSection}>
          <h2>가맹점 개설 혜택</h2>
          <div className={style.BenefitGrid}>
            <div className={style.BenefitCard}>
              <img src="/public/img/benefit1.png" alt="교육 지원" />
              <h3>체계적인 교육 지원</h3>
              <p>전문 바리스타의 체계적인 교육으로 완벽한 맛 구현</p>
            </div>
            <div className={style.BenefitCard}>
              <img src="/public/img/benefit2.png" alt="운영 지원" />
              <h3>운영 관리 지원</h3>
              <p>매장 운영에 필요한 모든 노하우와 관리 시스템 제공</p>
            </div>
            <div className={style.BenefitCard}>
              <img src="/public/img/benefit3.png" alt="마케팅 지원" />
              <h3>마케팅 지원</h3>
              <p>효과적인 홍보 전략과 마케팅 자료 지원</p>
            </div>
            <div className={style.BenefitCard}>
              <img src="/public/img/benefit4.png" alt="품질 관리" />
              <h3>품질 관리 시스템</h3>
              <p>최상의 품질 유지를 위한 체계적인 관리 시스템</p>
            </div>
          </div>
        </div>

        <div className={style.ProcessSection}>
          <h2>개설 절차</h2>
          <div className={style.ProcessSteps}>
            <div className={style.Step}>
              <div className={style.StepNumber}>01</div>
              <h3>상담 신청</h3>
              <p>가맹 문의 및 상담</p>
            </div>
            <div className={style.Step}>
              <div className={style.StepNumber}>02</div>
              <h3>상권 분석</h3>
              <p>입지 선정 및 상권 분석</p>
            </div>
            <div className={style.Step}>
              <div className={style.StepNumber}>03</div>
              <h3>계약 체결</h3>
              <p>가맹 계약 진행</p>
            </div>
            <div className={style.Step}>
              <div className={style.StepNumber}>04</div>
              <h3>인테리어</h3>
              <p>매장 설계 및 시공</p>
            </div>
            <div className={style.Step}>
              <div className={style.StepNumber}>05</div>
              <h3>교육 진행</h3>
              <p>운영 교육 및 레시피 전수</p>
            </div>
            <div className={style.Step}>
              <div className={style.StepNumber}>06</div>
              <h3>매장 오픈</h3>
              <p>그랜드 오픈</p>
            </div>
          </div>
        </div>

        <div className={style.ContactSection}>
          <h2>가맹 문의</h2>
          <div className={style.ContactInfo}>
            <div className={style.ContactItem}>
              <h3>상담 문의</h3>
              <p>1234-5678</p>
            </div>
            <div className={style.ContactItem}>
              <h3>이메일</h3>
              <p>franchise@kokeetea.com</p>
            </div>
          </div>
          <button className={style.ConsultButton} onClick={() => window.location.href='/affiliated'}>
            가맹 상담 신청하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default FranchisePromotion; 