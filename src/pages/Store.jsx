import React, { useState } from "react";
import style from "./Store.module.css"; // Import your CSS module if you have it

const Store = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [stores, setStores] = useState([
    {
      id: 1,
      name: "구로점",
      address: "서울시 구로구 디지털로 300 (구로동)",
      phone: "02-123-4567",
    },
    {
      id: 2,
      name: "소세지 빵점",
      address: "서울시 구로구 디지털로 300 (구로동)",
      phone: "02-123-4567",
    },
    {
      id: 3,
      name: "문익점",
      address: "서울시 구로구 디지털로 300 (구로동)",
      phone: "02-123-4567",
    },
    {
      id: 4,
      name: "점점",
      address: "서울시 구로구 디지털로 300 (구로동)",
      phone: "02-123-4567",
    },
    {
      id: 5,
      name: "돈점...",
      address: "서울시 구로구 디지털로 300 (구로동)",
      phone: "02-123-4567",
    },
    {
      id: 6,
      name: "아점",
      address: "서울시 구로구 디지털로 300 (구로동)",
      phone: "02-123-4567",
    },
  ]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredStores = stores.filter(
    (store) =>
      store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      store.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={style.Container}>
      <div className={style.MainContent}>
        <div className={style.SearchBar}>
          <input
            type="text"
            placeholder="매장명 또는 주소를 입력하세요."
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <button className={style.SearchButton}>
            ⨀
          </button>
        </div>
        <div className={style.StoreList}>
          {filteredStores.map((store) => (
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
    </div>
  );
};

export default Store;
