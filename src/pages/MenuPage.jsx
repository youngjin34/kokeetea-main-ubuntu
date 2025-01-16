import axios from "axios";
import { useEffect, useRef, useState } from "react";

import style from "./MenuPage.module.css";

function MenuPage() {
  const [products, setProducts] = useState([]);
  const [filteredMenu, setFilteredMenu] = useState([]); // 선택된 카테고리의 제품 상태
  const [selectedMenu, setSelectedMenu] = useState("Cold Cloud"); // 기본 선택 카테고리

  const [selectedProduct, setSelectedProduct] = useState(null); // 선택된 제품 상태
  const [isModalOpen, setModalOpen] = useState(false); // 모달 열기/닫기 상태
  const modalRef = useRef(null);

  // 각 옵션에 대한 상태 관리
  const [temp, setTemp] = useState("HOT");
  const [whipping, setWhipping] = useState("기본");
  const [pearl, setPearl] = useState("추가 안함");
  const [shots, setShots] = useState("기본");

  const [quantity, setQuantity] = useState(0);

  // 카테고리별 제품을 필터링하는 함수
  const filterByCategory = (category) => {
    const filtered = products.filter(
      (product) => product.pdCategory === category
    );
    setFilteredMenu(filtered);
  };

  // 메뉴 클릭 시 카테고리별 필터링
  const selectedMenuClick = (menu) => {
    setSelectedMenu(menu);
    filterByCategory(menu); // 카테고리 필터링
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8080/selecttea");
        console.log(response.data);

        setProducts(response.data); // 전체 데이터를 상태로 설정
        filterByCategory("Cold Cloud"); // 기본적으로 Cold Cloud 메뉴를 필터링
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const toggleModal = (product = null) => {
    setSelectedProduct(product); // 선택된 제품 상태 업데이트
    setModalOpen(!isModalOpen);
  };

  useEffect(() => {
    if (products.length > 0) {
      filterByCategory(selectedMenu); // `products`가 업데이트된 후 필터링 실행
    }
  }, [products, selectedMenu]); // products나 selectedMenu가 변경될 때마다 실행

  // 바깥쪽 클릭 시 모달 닫기
  const handleOutsideClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      setModalOpen(false);
    }
  };

  useEffect(() => {
    // 모달이 열릴 때 스크롤 막기
    if (isModalOpen) {
      document.body.style.overflow = "hidden"; // 스크롤 막기
      document.addEventListener("click", handleOutsideClick); // 외부 클릭 이벤트 리스너 추가
    } else {
      document.body.style.overflow = "auto"; // 스크롤 다시 허용
      document.removeEventListener("click", handleOutsideClick); // 외부 클릭 이벤트 리스너 제거
    }
  }, [isModalOpen]);

  return (
    <div className={`${style.MenuPage}`}>
      <div className={style.menu_introduce}>
        <div className={style.menu_title}>
          <span className={style.underline}>MENU</span>
        </div>
        <p className={style.menu_content}>
          행복을 선사하는 음료 <br />입 안에서 콕 터지는 버블티
        </p>
      </div>
      <div className={style.MenuTabs}>
        {/* 메뉴 버튼들 */}
        <span
          className={`${style.menu} ${
            selectedMenu === "Cold Cloud" ? style.active : ""
          }`}
          onClick={() => selectedMenuClick("Cold Cloud")}
        >
          Cold Cloud
        </span>
        <span
          className={`${style.menu} ${
            selectedMenu === "KOKEE Fruit Tea" ? style.active : ""
          }`}
          onClick={() => selectedMenuClick("KOKEE Fruit Tea")}
        >
          Fruit Tea
        </span>
        <span
          className={`${style.menu} ${
            selectedMenu === "Ice Blended" ? style.active : ""
          }`}
          onClick={() => selectedMenuClick("Ice Blended")}
        >
          Ice Blended
        </span>
        <span
          className={`${style.menu} ${
            selectedMenu === "Milk Tea" ? style.active : ""
          }`}
          onClick={() => selectedMenuClick("Milk Tea")}
        >
          Milk Tea
        </span>
        <span
          className={`${style.menu} ${
            selectedMenu === "Signature" ? style.active : ""
          }`}
          onClick={() => selectedMenuClick("Signature")}
        >
          Signature
        </span>
      </div>
      <div className={style.MenuItems}>
        {filteredMenu.map((product) => (
          <div
            key={product.pdId}
            className={style.MenuItem}
            onClick={() => toggleModal(product)} // 클릭 시 선택된 제품을 모달에 전달
          >
            <img src={product.image} alt={product.pdName} />
            <h3>{product.pdName}</h3>
            <p>{product.pdPrice} 원</p>
          </div>
        ))}
      </div>

      {isModalOpen && selectedMenu && (
        <div className={style.modal}>
          <div className={style.modalContent}>
            <div className={style.modal_first}>
              <img
                src={selectedProduct.image}
                alt={selectedProduct.pdName}
                className={style.modalImage}
              />
              <div className={style.modal_info}>
                <h2>{selectedProduct.pdName}</h2>
                <div className={style.descript}>{selectedProduct.desc}</div>
                <div className={style.price}>{selectedProduct.pdPrice} 원</div>
              </div>
            </div>

            <div className={style.option_container}>
              <div className={style.temp_option}>
                <label className={style.radio_style}>
                  <input
                    type="radio"
                    name="temp"
                    value="HOT"
                    checked={temp === "HOT"}
                    onChange={() => setTemp("HOT")}
                  />
                  <span>HOT</span>
                </label>
                <label className={style.radio_style}>
                  <input
                    type="radio"
                    name="temp"
                    value="ICE"
                    checked={temp === "ICE"}
                    onChange={() => setTemp("ICE")}
                  />
                  <span>ICE</span>
                </label>
              </div>

              <div className={style.rest_option}>
                {/* 휘핑 옵션 */}
                <div className={style.option}>
                  <h3>휘핑 추가</h3>
                  <div className={style.whipping_option}>
                    <label className={style.sub_radio_style}>
                      <input
                        type="radio"
                        name="whipping"
                        value="기본"
                        checked={whipping === "기본"}
                        onChange={() => setWhipping("기본")}
                      />
                      <span>기본</span>
                    </label>
                    <label className={style.sub_radio_style}>
                      <input
                        type="radio"
                        name="whipping"
                        value="휘핑추가"
                        checked={whipping === "휘핑추가"}
                        onChange={() => setWhipping("휘핑추가")}
                      />
                      <span>
                        휘핑추가
                        <br />
                        (+500원)
                      </span>
                    </label>
                  </div>
                </div>

                {/* 펄 추가 옵션 */}
                <div className={style.option}>
                  <h3>펄 추가</h3>
                  <div className={style.pearl_option}>
                    <label className={style.sub_radio_style}>
                      <input
                        type="radio"
                        name="pearl"
                        value="추가 안함"
                        checked={pearl === "추가 안함"}
                        onChange={() => setPearl("추가 안함")}
                      />
                      <span>추가 안함</span>
                    </label>
                    <label className={style.sub_radio_style}>
                      <input
                        type="radio"
                        name="pearl"
                        value="블랙 펄"
                        checked={pearl === "블랙 펄"}
                        onChange={() => setPearl("블랙 펄")}
                      />
                      <span>
                        블랙 펄
                        <br />
                        (+500원)
                      </span>
                    </label>
                    <label className={style.sub_radio_style}>
                      <input
                        type="radio"
                        name="pearl"
                        value="화이트 펄"
                        checked={pearl === "화이트 펄"}
                        onChange={() => setPearl("화이트 펄")}
                      />
                      <span>
                        화이트 펄
                        <br />
                        (+500원)
                      </span>
                    </label>
                  </div>
                </div>

                {/* 샷 양 옵션 */}
                <div className={style.option}>
                  <h3>샷 양</h3>
                  <div className={style.shots_option}>
                    <label className={style.sub_radio_style}>
                      <input
                        type="radio"
                        name="shots"
                        value="기본"
                        checked={shots === "기본"}
                        onChange={() => setShots("기본")}
                      />
                      <span>기본</span>
                    </label>
                    <label className={style.sub_radio_style}>
                      <input
                        type="radio"
                        name="shots"
                        value="연하게"
                        checked={shots === "연하게"}
                        onChange={() => setShots("연하게")}
                      />
                      <span>연하게</span>
                    </label>
                    <label className={style.sub_radio_style}>
                      <input
                        type="radio"
                        name="shots"
                        value="샷 추가"
                        checked={shots === "샷 추가"}
                        onChange={() => setShots("샷 추가")}
                      />
                      <span>
                        샷 추가
                        <br />
                        (+500원)
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              <div className={style.modalClose} onClick={toggleModal}>
                <img src="/public/img/close.png" />
              </div>
            </div>

            <div className={`${style.order_btn_container}`}>
              <hr />
              <div className={style.quantity}>
                <h3>수량</h3>
                <div className={style.quantity_btn}>
                  <button
                    // 0 로 안 떨어지게 하기
                    onClick={() =>
                      setQuantity((prevQuantity) =>
                        Math.max(prevQuantity - 1, 0)
                      )
                    }
                  >
                    -
                  </button>
                  <span>{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)}>+</button>
                </div>
              </div>
              <div className={style.order_btn}>
                <button className={`${style.btn} ${style.now_btn}`}>
                  바로 주문하기
                </button>
                <button className={`${style.btn} ${style.cart_btn}`}>
                  담기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MenuPage;
