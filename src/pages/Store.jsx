import React, { useEffect } from "react";
import style from "./Store.module.css";

const Store = () => {

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  const stores = [
    {
      id: 1,
      name: "구로점",
      address: "서울시 구로구 디지털로 300, 11층 (구로동, 지밸리비즈플라자)",
      phone: "02-2345-6789",
    },
    {
      id: 2,
      name: "인천점",
      address: "인천광역시 부평구 경원대로 1373, 2층(북인천우체국)",
      phone: "032-567-8901",
    },
    {
      id: 3,
      name: "판교점",
      address: "경기도 성남시 수정구 창업로 54 (시흥동, 판교제2테크노밸리기업성장센터) 2층",
      phone: "031-789-0123",
    },
    {
      id: 4,
      name: "천안아산점",
      address: "충청남도 아산시 배방읍 희망로46번길 45-17 위너스빌딩 4층",
      phone: "041-234-5678",
    },
    {
      id: 5,
      name: "광주점",
      address: "광주광역시 서구 천변좌로 268 19층",
      phone: "062-345-6789",
    },
    {
      id: 6,
      name: "대구점",
      address: "대구광역시 달서구 장산남로 11(용산동 230-9)",
      phone: "053-456-7890",
    },
    {
      id: 7,
      name: "부산점",
      address: "부산광역시 연제구 중앙대로 1000, 14층, 16층",
      phone: "051-567-8901",
    },
  ];

  // 사용자 위치 상태 제거
  const [mapInstance, setMapInstance] = React.useState(null);
  const [markers, setMarkers] = React.useState([]);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [filteredStores, setFilteredStores] = React.useState(stores);

  useEffect(() => {
    const loadKakaoMap = () => {
      window.kakao.maps.load(() => {
        const container = document.getElementById('map');
        const geocoder = new window.kakao.maps.services.Geocoder();

        // 구로점 주소로 초기 좌표 설정
        geocoder.addressSearch(stores[0].address, function(result, status) {
          if (status === window.kakao.maps.services.Status.OK) {
            const initialCoords = new window.kakao.maps.LatLng(result[0].y, result[0].x);
            
            const options = {
              center: initialCoords,
              level: 2
            };

            const map = new window.kakao.maps.Map(container, options);
            setMapInstance(map);
            const markersArray = [];

            // 매장 마커 이미지 생성
            const storeMarkerImage = new window.kakao.maps.MarkerImage(
              'https://cdn-icons-png.flaticon.com/512/1673/1673221.png',
              new window.kakao.maps.Size(35, 35),
              { 
                offset: new window.kakao.maps.Point(17, 17)
              }
            );

            // 매장들의 마커 생성
            stores.forEach(store => {
              geocoder.addressSearch(store.address, function(result, status) {
                if (status === window.kakao.maps.services.Status.OK) {
                  const coords = new window.kakao.maps.LatLng(result[0].y, result[0].x);

                  // 마커 생성
                  const marker = new window.kakao.maps.Marker({
                    position: coords,
                    map: map,
                    image: storeMarkerImage,
                  });

                  // 마커 정보를 저장
                  markersArray.push({
                    marker: marker,
                    coords: coords,
                    storeId: store.id
                  });

                  // 커스텀 오버레이 생성
                  const content = document.createElement('div');
                  content.className = style.markerLabel;
                  content.innerHTML = store.name;

                  const customOverlay = new window.kakao.maps.CustomOverlay({
                    position: coords,
                    content: content,
                    yAnchor: 2.5
                  });

                  // 항상 커스텀 오버레이 표시
                  customOverlay.setMap(map);
                }
              });
            });
            setMarkers(markersArray);
          }
        });
      });
    };

    // 카카오맵 API가 로드되었는지 확인하고 실행
    if (window.kakao && window.kakao.maps) {
      loadKakaoMap();
    }

    // cleanup 함수
    return () => {
      if (markers.length > 0) {
        markers.forEach(markerInfo => {
          if (markerInfo.marker) {
            markerInfo.marker.setMap(null);
          }
        });
      }
    };
  }, []);

  // 매장 클릭 핸들러 수정
  const handleStoreClick = (storeId) => {
    const markerInfo = markers.find(m => m.storeId === storeId);
    if (markerInfo && mapInstance) {
      mapInstance.panTo(markerInfo.coords);
      mapInstance.setLevel(2, {animate: true});
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    const filtered = stores.filter((store) => 
      store.name.toLowerCase().includes(term.toLowerCase()) ||
      store.address.toLowerCase().includes(term.toLowerCase())
    );
    
    setFilteredStores(filtered);
  };

  return (
    <div className={style.Container}>
      <div className={style.MainContent}>
        <div className={style.SearchContainer}>
          <input
            type="text"
            placeholder="매장명 또는 주소를 입력하세요"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <div className={style.StoreList}>
          {filteredStores.map((store) => (
            <div 
              key={store.id} 
              className={style.StoreItem}
              onClick={() => handleStoreClick(store.id)}
            >
              <div className={style.StoreContent}>
                <div className={style.StoreHeader}>
                  <h3 className={style.StoreName}>{store.name}</h3>
                </div>
                <p className={style.StoreAddress}>
                  <i className="fas fa-map-marker-alt"></i> {store.address}
                </p>
                <p className={style.StorePhone}>
                  <i className="fas fa-phone"></i> {store.phone}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div id="map" className={style.map}></div>
    </div>
  );
};

export default Store;