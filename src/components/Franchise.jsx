import style from './Franchise.module.css';
import { Link } from 'react-router-dom';

function Franchise() {
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
        <h1 className={`${style.franchise_title}`}>FRANCHISE</h1>
        <p className={`${style.franchise_sub_title}`} style={{ textAlign: 'right' }}>
          KOKEE TEA는 가맹점주님과의 협력을 가장 소중히 여깁니다.
        </p>
        <p className={`${style.content}`} style={{ textAlign: 'right' }}>
          성공적인 비즈니스를 구축할 수 있도록 아낌없는 지원을 약속드립니다.{' '}
          <br />
          매일 행복의 물결을 퍼뜨리는 KOKEE TEA와 함께, 즐거운 여정을
          시작해보세요! <br />
          성공적인 한 잔의 이야기를 함께 써 내려가길 기대합니다.
        </p>
        <div className={`${style.franchise_btn}`}>
          <Link to="/store">
            <button
              className={`${style.btn} ${style.btn_primary} ${style.btn_ghost}`}
            >
              매장찾기
            </button>
          </Link>
          <Link to="/affiliated">
            <button
              className={`${style.btn} ${style.btn_primary} ${style.btn_ghost}`}
            >
              가맹문의
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Franchise;
