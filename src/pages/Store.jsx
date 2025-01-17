import React from "react";
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
  ];

  return (
    <div className={style.Container}>
      <div className={style.MainContent}>
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
    </div>
  );
};

export default Store;