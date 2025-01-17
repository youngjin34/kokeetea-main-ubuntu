import { Link } from 'react-router-dom';
import style from './Footer.module.css';

function Footer() {
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
        <Link>개인정보처리방침</Link>
        <Link>이용약관</Link>
      </div>
    </div>
  );
}

export default Footer;
