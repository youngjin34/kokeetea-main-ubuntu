import { useState } from 'react';
import { Link } from 'react-router-dom';
import style from './Footer.module.css';
import registerStyle from '../pages/Register.module.css';

function Footer() {
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);

  return (
    <div className={`${style.Footer}`}>
      <div className={`${style.content}`}>
        (주)KOKEE TEA 대표 : 김정준 서울특별시 구로구 디지털로 300
        지밸리비즈플라자 11층 <br />
        사업자등록번호 123-45-678901 TEL 02) 1234-5678 / FAX 02) 1234-5678
        이메일 rugo123@cafe100.com <br />© kokee tea Coffee Company. All Rights
        Reserved.
      </div>
      <div className={`${style.footer_link}`}>
        <Link onClick={() => setIsPrivacyModalOpen(true)}>개인정보처리방침</Link>
        <Link onClick={() => setIsTermsModalOpen(true)}>이용약관</Link>
      </div>

      {isTermsModalOpen && (
        <div className={registerStyle.modalOverlay}>
          <div className={registerStyle.modalContent}>
            <h2 className={registerStyle.modalTitle}>이용약관</h2>
            <pre style={{ color: '#000' }} className={registerStyle.modalContent.pre}>
              제1조 (목적) 이 약관은 KOKEE TEA(이하 "회사"라 함)가 제공하는
              서비스의 이용조건 및 절차, 회사와 회원 간의 권리, 의무 및 책임사항
              등을 규정함을 목적으로 합니다.
              <br />
              제2조 (약관의 효력과 변경) 1. 이 약관은 서비스를 통하여 이를
              공지하거나 전자메일 등의 방법으로 회원에게 통지함으로써 효력이
              발생합니다. 2. 회사는 필요한 경우 이 약관을 변경할 수 있으며,
              변경된 약관은 제1항과 같은 방법으로 공지 또는 통지함으로써 효력이
              발생합니다.
            </pre>
            <button onClick={() => setIsTermsModalOpen(false)}>닫기</button>
          </div>
        </div>
      )}

      {isPrivacyModalOpen && (
        <div className={registerStyle.modalOverlay}>
          <div className={registerStyle.modalContent}>
            <h2 className={registerStyle.modalTitle}>개인정보처리방침</h2>
            <pre style={{ color: '#000' }}>
              1. 개인정보의 수집 및 이용 목적 회사는 다음의 목적을 위하여
              개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의
              용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 개인정보
              보호법 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행할
              예정입니다.
              <br />
              2. 개인정보의 처리 및 보유기간 회사는 법령에 따른 개인정보
              보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에 동의받은
              개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.
            </pre>
            <button onClick={() => setIsPrivacyModalOpen(false)}>닫기</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Footer;
