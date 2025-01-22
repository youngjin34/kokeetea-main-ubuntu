import React, { useEffect } from "react";
import style from "./Store.module.css";

const Store = () => {
  const stores = [
    {
      id: 1,
      name: "구로점",
      address: "서울시 구로구 디지털로 300, 11층 (구로동, 지밸리비즈플라자)",
      phone: "02-123-4567",
    },
    {
      id: 2,
      name: "인천점",
      address: "인천광역시 부평구 경원대로 1373, 2층(북인천우체국)",
      phone: "02-123-4567",
    },
    {
      id: 3,
      name: "판교점",
      address: "경기도 성남시 수정구 창업로 54 (시흥동, 판교제2테크노밸리기업성장센터) 2층",
      phone: "02-123-4567",
    },
    {
      id: 4,
      name: "천안아산점",
      address: "충청남도 아산시 배방읍 희망로46번길 45-17 위너스빌딩 4층",
      phone: "02-123-4567",
    },
    {
      id: 5,
      name: "광주점",
      address: "광주광역시 서구 천변좌로 268 19층",
      phone: "02-123-4567",
    },
    {
      id: 6,
      name: "대구점",
      address: "대구광역시 달서구 장산남로 11(용산동 230-9)",
      phone: "02-123-4567",
    },
    {
      id: 7,
      name: "부산점",
      address: "부산광역시 연제구 중앙대로 1000, 14층, 16층",
      phone: "02-123-4567",
    },
  ];

  // 지도와 마커들의 참조를 저장하기 위한 state 추가
  const [mapInstance, setMapInstance] = React.useState(null);
  const [markers, setMarkers] = React.useState([]);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [filteredStores, setFilteredStores] = React.useState(stores);
  const [distances, setDistances] = React.useState({});
  // 사용자 위치 상태 추가
  const [userLocation, setUserLocation] = React.useState(null);

  // 사용자 위치 가져오기
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error("위치 정보를 가져올 수 없습니다:", error);
          // 위치 정보를 가져올 수 없는 경우 기본값으로 구로디지털단지역 설정
          setUserLocation({
            lat: 37.4851,
            lng: 126.9015
          });
        }
      );
    } else {
      console.log("Geolocation이 지원되지 않습니다.");
      setUserLocation({
        lat: 37.4851,
        lng: 126.9015
      });
    }
  }, []);

  useEffect(() => {
    if (!userLocation) return; // 사용자 위치가 없으면 맵 로딩 스킵

    const loadKakaoMap = () => {
      window.kakao.maps.load(() => {
        const container = document.getElementById('map');
        const options = {
          center: new window.kakao.maps.LatLng(userLocation.lat, userLocation.lng), // 사용자 위치 중심으로 변경
          level: 3
        };

        const map = new window.kakao.maps.Map(container, options);
        setMapInstance(map);
        const geocoder = new window.kakao.maps.services.Geocoder();
        const markersArray = [];

        // 현재 위치 마커 추가
        const userMarker = new window.kakao.maps.Marker({
          position: new window.kakao.maps.LatLng(userLocation.lat, userLocation.lng),
          map: map
        });

        // 현재 위치 인포윈도우 추가
        const userInfowindow = new window.kakao.maps.InfoWindow({
          content: '<div style="padding:5px;font-size:12px;">현재 위치</div>'
        });
        userInfowindow.open(map, userMarker);

        // 매장들의 마커 생성
        stores.forEach(store => {
          geocoder.addressSearch(store.address, function(result, status) {
            if (status === window.kakao.maps.services.Status.OK) {
              const coords = new window.kakao.maps.LatLng(result[0].y, result[0].x);
              
              // 거리 계산
              const distance = calculateDistance(
                userLocation.lat,
                userLocation.lng,
                parseFloat(result[0].y),
                parseFloat(result[0].x)
              );

              setDistances(prev => ({
                ...prev,
                [store.id]: distance
              }));

              // 마커 생성
              const marker = new window.kakao.maps.Marker({
                position: coords,
                map: map
              });

              // 마커 정보를 저장
              markersArray.push({
                marker: marker,
                coords: coords,
                storeId: store.id
              });

              // 인포윈도우 생성
              const infowindow = new window.kakao.maps.InfoWindow({
                content: `<div style="padding:5px;font-size:12px;">${store.name}</div>`
              });

              // 마커에 마우스오버 이벤트 추가
              window.kakao.maps.event.addListener(marker, 'mouseover', function() {
                infowindow.open(map, marker);
              });

              // 마커에 마우스아웃 이벤트 추가
              window.kakao.maps.event.addListener(marker, 'mouseout', function() {
                infowindow.close();
              });
            }
          });
        });
        setMarkers(markersArray);
      });
    };

    // 스크립트 로드
    const loadScript = () => {
      return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=902d4e0f0111b2f8bc5410404332a0ad&autoload=false&libraries=services`;
        script.async = true;
        script.onload = resolve;
        document.head.appendChild(script);
      });
    };

    // 카카오맵 스크립트가 로드되었는지 확인
    if (window.kakao && window.kakao.maps) {
      loadKakaoMap();
    } else {
      loadScript().then(() => loadKakaoMap());
    }

    return () => {
      const script = document.querySelector('script[src*="dapi.kakao.com"]');
      if (script) {
        document.head.removeChild(script);
      }
    };
  }, [stores, userLocation]); // userLocation 의존성 추가

  // 매장 클릭 핸들러 추가
  const handleStoreClick = (storeId) => {
    const markerInfo = markers.find(m => m.storeId === storeId);
    if (markerInfo && mapInstance) {
      mapInstance.setCenter(markerInfo.coords);
      mapInstance.setLevel(3); // 줌 레벨 설정
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

  // 거리 계산 함수 추가
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // 지구의 반지름 (km)
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c; // Distance in km
    return distance.toFixed(1);
  };

  const deg2rad = (deg) => {
    return deg * (Math.PI/180);
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
                  <span className={style.StoreDistance}>
                    {distances[store.id] ? `${distances[store.id]}km` : '거리 계산중...'}
                  </span>
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