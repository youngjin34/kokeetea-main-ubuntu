import React, { useEffect } from "react";
import style from "./Store.module.css";

const Store = () => {
  const stores = [
    {
      id: 1,
      name: "구로점",
      address: "서울시 구로구 디지털로 300 (구로동)",
      phone: "02-123-4567",
    },
    {
      id: 2,
      name: "구로점",
      address: "서울시 구로구 디지털로 300 (구로동)",
      phone: "02-123-4567",
    },
    {
      id: 3,
      name: "구로점",
      address: "서울시 구로구 디지털로 300 (구로동)",
      phone: "02-123-4567",
    },
    {
      id: 4,
      name: "구로점",
      address: "서울시 구로구 디지털로 300 (구로동)",
      phone: "02-123-4567",
    },
    {
      id: 5,
      name: "구로점",
      address: "서울시 구로구 디지털로 300 (구로동)",
      phone: "02-123-4567",
    },
    {
      id: 6,
      name: "구로점",
      address: "서울시 구로구 디지털로 300 (구로동)",
      phone: "02-123-4567",
    },
  ];

  useEffect(() => {
    const loadKakaoMap = () => {
      window.kakao.maps.load(() => {
        const container = document.getElementById('map');
        const options = {
          center: new window.kakao.maps.LatLng(37.5013, 126.8765),
          level: 3
        };

        const map = new window.kakao.maps.Map(container, options);

        // 매장들의 마커 생성
        stores.forEach(store => {
          const marker = new window.kakao.maps.Marker({
            position: new window.kakao.maps.LatLng(37.5013, 126.8765),
            map: map
          });
        });
      });
    };

    // 카카오맵 스크립트가 로드되었는지 확인
    if (window.kakao && window.kakao.maps) {
      loadKakaoMap();
    } else {
      const script = document.createElement('script');
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=902d4e0f0111b2f8bc5410404332a0ad&autoload=false`;
      script.async = true;
      
      script.onload = () => {
        loadKakaoMap();
      };

      document.head.appendChild(script);
      
      return () => {
        document.head.removeChild(script);
      };
    }
  }, []);

  return (
    <div className={style.Container}>
      {/* 검색창 영역 */}
      <div className={style.MainContent}>
        <div className={style.SearchContainer}>
          <input
            className={style.SearchBar}
            type="text"
            placeholder="매장명 또는 주소를 입력하세요."
          />
          <button className={style.SearchButton}>◎</button>
        </div>
        {/* 상점 목록 영역 */}
        <div className={style.StoreList}>
          {stores.map((store) => (
            <div key={store.id} className={style.StoreItem}>
              <h3 className={style.StoreName}>{store.name}</h3>
              <p className={style.StoreAddress}>{store.address}</p>
              <p className={style.StorePhone}>
                <i className="fas fa-phone"></i> {store.phone}
              </p>
            </div>
          ))}
        </div>
      </div>
      <div id="map" className={style.map}></div>
    </div>
  );
};

export default Store;