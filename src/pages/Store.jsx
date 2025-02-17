import React, { useEffect, useState } from "react";
import style from "./Store.module.css";
import axios from "axios";

const Store = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [mapInstance, setMapInstance] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [stores, setStores] = useState([]);
  const [filteredStores, setFilteredStores] = useState([]);

  useEffect(() => {
    const fetchBranchData = async () => {
      try {
        const response = await axios.get(
          "http://spring.mirae.network:8080/api/branches"
        );
        setStores(response.data);
      } catch (error) {
        console.error("매장 데이터를 불러오는 중 오류 발생:", error);
      }
    };

    fetchBranchData();
  }, []);

  useEffect(() => {
    setFilteredStores(stores);
  }, [stores]);

  useEffect(() => {
    const loadKakaoMap = () => {
      window.kakao.maps.load(() => {
        const container = document.getElementById("map");
        const geocoder = new window.kakao.maps.services.Geocoder();

        // stores가 비어있지 않을 때만 실행하도록 조건 추가
        if (stores.length === 0) return;

        geocoder.addressSearch(stores[0].address, function (result, status) {
          if (status === window.kakao.maps.services.Status.OK) {
            const initialCoords = new window.kakao.maps.LatLng(
              result[0].y,
              result[0].x
            );

            const options = {
              center: initialCoords,
              level: 2,
            };

            const map = new window.kakao.maps.Map(container, options);
            setMapInstance(map);

            const markersArray = [];

            // 매장 마커 이미지 생성
            const storeMarkerImage = new window.kakao.maps.MarkerImage(
              "https://cdn-icons-png.flaticon.com/512/1673/1673221.png",
              new window.kakao.maps.Size(35, 35),
              {
                offset: new window.kakao.maps.Point(17, 17),
              }
            );

            // 매장들의 마커 생성
            stores.forEach((store) => {
              geocoder.addressSearch(store.address, function (result, status) {
                if (status === window.kakao.maps.services.Status.OK) {
                  const coords = new window.kakao.maps.LatLng(
                    result[0].y,
                    result[0].x
                  );

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
                    storeId: store.id,
                  });

                  // 커스텀 오버레이 생성
                  const content = document.createElement("div");
                  content.className = style.markerLabel;
                  content.innerHTML = store.name;

                  const customOverlay = new window.kakao.maps.CustomOverlay({
                    position: coords,
                    content: content,
                    yAnchor: 2.5,
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

    if (window.kakao && window.kakao.maps) {
      loadKakaoMap();
    }

    return () => {
      if (markers.length > 0) {
        markers.forEach((markerInfo) => {
          if (markerInfo.marker) {
            markerInfo.marker.setMap(null);
          }
        });
      }
    };
  }, [stores]); // stores가 업데이트될 때마다 실행되도록 수정

  const handleStoreClick = (storeId) => {
    const markerInfo = markers.find((m) => m.storeId === storeId);
    if (markerInfo && mapInstance) {
      mapInstance.panTo(markerInfo.coords);
      mapInstance.setLevel(2, { animate: true });
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    const filtered = stores.filter(
      (store) =>
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
