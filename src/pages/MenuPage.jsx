import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import style from "./MenuPage.module.css";

function MenuPage() {
  const [products, setProducts] = useState([]);
  const [filteredMenu, setFilteredMenu] = useState([]);
  const [selectedMenu, setSelectedMenu] = useState("Cold Cloud"); // 탭에서 메뉴 선택
  const [selectedProduct, setSelectedProduct] = useState(null); // 메뉴 리스트에서 선택한 상품
  const [isModalOpen, setModalOpen] = useState(false);
  const modalRef = useRef(null);

  // 각 옵션에 대한 상태 관리
  const [temp, setTemp] = useState("ICE");
  const [size, setSize] = useState("Regular");
  const [iceAmount, setIceAmount] = useState("보통");
  const [sugar, setSugar] = useState("70%");
  const [quantity, setQuantity] = useState(0);

  const [totalPrice, setTotalPrice] = useState(0);
  const [topping, setTopping] = useState(["기본"]);

  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email");
    setIsLoggedIn(token && email);
  }, []);

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
    filterByCategory(menu);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8080/selecttea");
        setProducts(response.data);
        filterByCategory("Cold Cloud");
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const toggleModal = (product = null) => {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email");

    if (!token || !email) {
      alert("로그인이 필요한 서비스입니다.");
      return;
    }

    if (product) {
      setQuantity(1);
      setSelectedProduct(product);
      setModalOpen(true);
      if (product.pdCategory.includes("Ice Blended") || product.pdCategory.includes("Cold Cloud")) {
        setTemp("ICE");
      } else {
        setTemp("ICE");
      }
      // 모달 열 때 기본값으로 초기화
      setSize("Regular");
      setSugar("70%");
      setIceAmount("보통");
      setTopping(["기본"]);

    } else {
      setModalOpen(false);
      setSize("Regular");
      setTemp("ICE");
      setSugar("70%");
      setIceAmount("보통");
      setTopping(["기본"]);
      setQuantity(0);
      setTotalPrice(0);
      setSelectedProduct(null);
    }
  };

  // temp가 변경될 때 실행될 useEffect 수정
  useEffect(() => {
    if (temp === "HOT") {
      setIceAmount("없음"); // HOT 선택 시 얼음 없음으로 설정
    } else {
      setIceAmount("보통"); // ICE 선택 시 기본값으로 설정
    }
  }, [temp]);

  useEffect(() => {
    if (products.length > 0) {
      filterByCategory(selectedMenu);
    }
  }, [products, selectedMenu]);

  // 바깥쪽 클릭 시 모달 닫기
  const handleOutsideClick = (e) => {
    if (modalRef.current === e.target) {
      setModalOpen(false);
    }
  };

  useEffect(() => {
    if (isModalOpen) {
      // 모달이 열릴 때 스크롤 막기
      document.body.style.overflow = "hidden";
      document.addEventListener("click", handleOutsideClick);
    } else {
      // 모달이 닫힐 때 스크롤 허용
      document.body.style.overflow = "auto";
      document.removeEventListener("click", handleOutsideClick);
    }

    // clean up function: 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [isModalOpen]);

  // 옵션 검증 함수 추가
  const validateOptions = () => {
    if (!temp) {
      alert("온도를 선택해주세요.");
      return false;
    }
    if (!size) {
      alert("사이즈를 선택해주세요.");
      return false;
    }
    if (!sugar) {
      alert("당도를 선택해주세요.");
      return false;
    }
    if (temp === "ICE" && !iceAmount) {
      alert("얼음량을 선택해주세요.");
      return false;
    }
    if (quantity === 0) {
      alert("수량을 선택해주세요.");
      return false;
    }
    return true;
  };

  // addToCart 함수 수정
  const addToCart = async () => {
    if (!validateOptions()) {
      return;
    }

    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email");

    const cartItem = {
      product_name: selectedProduct.pdName,
      price: totalPrice,
      mount: quantity,
      email: email,
      temp: temp,
      size: size,
      sugar: sugar,
      iceAmount: iceAmount,
      topping: topping.join(","),
      image: selectedProduct.image,
    };

    if (token && email) {
      try {
        const response = await fetch("http://localhost:8080/kokee/carts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(cartItem),
        });

        if (!response.ok) {
          throw new Error("장바구니 추가 실패");
        }

        const result = await response.text();
        if (result === "success") {
          alert("장바구니에 추가되었습니다.");
          toggleModal();
        } else {
          alert("장바구니 추가에 실패했습니다.");
        }
      } catch (error) {
        console.error("장바구니 추가 실패:", error);
        alert("장바구니 추가에 실패했습니다.");
      }
    }
  };

  // orderNow 함수 수정
  const orderNow = () => {
    if (!validateOptions()) {
      return;
    }

    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email");

    if (!token || !email) {
      alert("로그인이 필요한 서비스입니다.");
      return;
    }

    const orderItem = {
      product: selectedProduct,
      quantity: quantity,
      options: {
        image: selectedProduct.image,
        name: selectedProduct.pdName,
        size: size,
        temp: temp,
        sugar: sugar,
        iceAmount: iceAmount,
        topping: topping.join(","),
        price: totalPrice,
        email: email,
      },
    };

    localStorage.setItem("currentOrder", JSON.stringify([orderItem]));
    navigate("/order");
  };

  const calculateOptionPrice = () => {
    let optionPrice = 0;

    // 사이즈 옵션 가격
    if (size === "Large") {
      optionPrice += 1000;
    } else if (size === "Kokee-Large") {
      optionPrice += 1500;
    }

    // 토핑 옵션 가격 계산 수정
    if (!topping.includes("기본")) {
      topping.forEach(item => {
        if (item === "타피오카 펄" || item === "화이트 펄") {
          optionPrice += 500;
        } else if (item === "밀크폼" || item === "코코넛" || item === "알로에") {
          optionPrice += 1000;
        }
      });
    }

    return optionPrice;
  };

  useEffect(() => {
    if (selectedProduct) {
      const basePrice = selectedProduct.pdPrice;
      const optionPrice = calculateOptionPrice();
      const total = (basePrice + optionPrice) * quantity;
      setTotalPrice(total);
    }
  }, [size, temp, sugar, iceAmount, topping, quantity, selectedProduct]);

  const handleDirectOrder = (product) => {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email");

    if (!token || !email) {
      alert("로그인이 필요한 서비스입니다.");
      return;
    }

    const orderItem = {
      product: product,
      quantity: 1,
      options: {
        size: "Regular",
        temp: "ICE",
        sugar: "70%",
        iceAmount: "보통",
        topping: "기본",
        price: totalPrice,
        email: email,
      },
    };

    localStorage.setItem("currentOrder", JSON.stringify([orderItem]));
    navigate("/order");
  };

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
        {filteredMenu.map((product, index) => (
          <div key={index}>
            <div
              key={product.pdId}
              className={`${style.MenuItem} ${
                !isLoggedIn ? style.disabled : ""
              }`}
            >
              <img src={product.image} alt={product.pdName} />
              <h3>{product.pdName}</h3>
              <p>{product.pdPrice.toLocaleString()} 원</p>

              {/* 영양정보 오버레이 추가 */}
              <div className={style.nutrition_overlay}>
                <div className={style.nutrition_info}>
                  <h4>영양정보</h4>
                  <p>칼로리: {product.calories || "300"} kcal</p>
                  <p>당류: {product.sugar || "30"}g</p>
                  <p>카페인: {product.caffeine || "150"}mg</p>
                  <p>나트륨: {product.sodium || "120"}mg</p>
                </div>
              </div>
            </div>
            <div className={style.button_container}>
              <button
                className={style.menu_order_btn}
                onClick={() => toggleModal(product)}
              >
                <img src="/public/img/cart.png" /> 옵션선택
              </button>
              <button
                className={`${style.menu_order_btn} ${style.direct_order_btn}`}
                onClick={() => handleDirectOrder(product)}
              >
                바로주문
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && selectedProduct && (
        <div className={style.modal} ref={modalRef}>
          <div className={style.modalContent}>
            <div className={style.modal_left}>
              <div className={style.product_image_container}>
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.pdName}
                  className={style.modalImage}
                />
              </div>
              <div className={style.product_info}>
                <h2 className={style.product_name}>{selectedProduct.pdName}</h2>
                <p className={style.product_price}>
                  {(selectedProduct.pdPrice + calculateOptionPrice()).toLocaleString()}원
                  <br />
                  <span className={style.option_price}>
                    (기본 {selectedProduct.pdPrice.toLocaleString()}원 + 옵션 {calculateOptionPrice().toLocaleString()}원)
                  </span>
                </p>
                <p className={style.product_description}>
                  {selectedProduct.pdDescription || "신선한 재료로 만든 프리미엄 음료"}
                </p>
              </div>
            </div>
            <div className={style.modal_right}>
              <div className={style.option_scroll}>
                <div className={style.option}>
                  <h3>온도</h3>
                  <div className={style.temp_option}>
                    {(!selectedProduct.pdCategory.includes("Ice Blended") &&
                  !selectedProduct.pdCategory.includes("Cold Cloud")) && (
                    <label className={`${style.radio_style} ${style.hot_option}`}>
                      <input
                        type="radio"
                        name="temp"
                        value="HOT"
                        checked={temp === "HOT"}
                        onChange={() => setTemp("HOT")}
                      />
                      <span>HOT 🔥</span>
                    </label>
                    )}
                    <label className={`${style.radio_style} ${style.ice_option}`}
                    style={{
                      width: (selectedProduct.pdCategory.includes("Ice Blended") ||
                      selectedProduct.pdCategory.includes("Cold Cloud")) ? "100%" : "50%",
                    }}>
                      <input
                        type="radio"
                        name="temp"
                        value="ICE"
                        checked={temp === "ICE"}
                        onChange={() => setTemp("ICE")}
                      />
                      <span>ICE ❄️</span>
                    </label>
                  </div>
                </div>
                <div className={style.rest_option}>
                  <div className={style.option}>
                    <h3>사이즈</h3>
                    <div className={style.size_option}>
                      <label className={style.sub_radio_style}>
                        <input
                          type="radio"
                          name="size"
                          value="Regular"
                          checked={size === "Regular"}
                          onChange={() => setSize("Regular")}
                        />
                        <span>Regular</span>
                      </label>
                      <label className={style.sub_radio_style}>
                        <input
                          type="radio"
                          name="size"
                          value="Large"
                          checked={size === "Large"}
                          onChange={() => setSize("Large")}
                        />
                        <span>
                          Large
                          <br />
                          (+1000원)
                        </span>
                      </label>
                      <label className={style.sub_radio_style}>
                        <input
                          type="radio"
                          name="size"
                          value="Kokee-Large"
                          checked={size === "Kokee-Large"}
                          onChange={() => setSize("Kokee-Large")}
                        />
                        <span>
                          Kokee-Large
                          <br />
                          (+1500원)
                        </span>
                      </label>
                    </div>
                  </div>
                  <div className={style.option}>
                    <h3>당도</h3>
                    <div className={style.sugar_option}>
                      <label className={style.sub_radio_style}>
                        <input
                          type="radio"
                          name="sugar"
                          value="0%"
                          checked={sugar === "0%"}
                          onChange={() => setSugar("0%")}
                        />
                        <span>0%</span>
                      </label>
                      <label className={style.sub_radio_style}>
                        <input
                          type="radio"
                          name="sugar"
                          value="30%"
                          checked={sugar === "30%"}
                          onChange={() => setSugar("30%")}
                        />
                        <span>30%</span>
                      </label>
                      <label className={style.sub_radio_style}>
                        <input
                          type="radio"
                          name="sugar"
                          value="50%"
                          checked={sugar === "50%"}
                          onChange={() => setSugar("50%")}
                        />
                        <span>50%</span>
                      </label>
                      <label className={style.sub_radio_style}>
                        <input
                          type="radio"
                          name="sugar"
                          value="70%"
                          checked={sugar === "70%"}
                          onChange={() => setSugar("70%")}
                        />
                        <span>70%</span>
                      </label>
                      <label className={style.sub_radio_style}>
                        <input
                          type="radio"
                          name="sugar"
                          value="100%"
                          checked={sugar === "100%"}
                          onChange={() => setSugar("100%")}
                        />
                        <span>100%</span>
                      </label>
                    </div>
                  </div>
                  <div className={style.option}>
                    <h3>얼음</h3>
                    <div className={style.ice_amount_option}>
                      <label className={style.sub_radio_style}>
                        <input
                          type="radio"
                          name="iceAmount"
                          value="없음"
                          checked={iceAmount === "없음"}
                          onChange={() => setIceAmount("없음")}
                        />
                        <span>없음</span>
                      </label>
                      <label className={`${style.sub_radio_style} ${temp === "HOT" ? style.disabled : ""}`}>
                        <input
                          type="radio"
                          name="iceAmount"
                          value="적게"
                          checked={iceAmount === "적게"}
                          onChange={() => setIceAmount("적게")}
                          disabled={temp === "HOT"}
                        />
                        <span>적게</span>
                      </label>
                      <label className={`${style.sub_radio_style} ${temp === "HOT" ? style.disabled : ""}`}>
                        <input
                          type="radio"
                          name="iceAmount"
                          value="보통"
                          checked={iceAmount === "보통"}
                          onChange={() => setIceAmount("보통")}
                          disabled={temp === "HOT"}
                        />
                        <span>보통</span>
                      </label>
                      <label className={`${style.sub_radio_style} ${temp === "HOT" ? style.disabled : ""}`}>
                        <input
                          type="radio"
                          name="iceAmount"
                          value="많이"
                          checked={iceAmount === "많이"}
                          onChange={() => setIceAmount("많이")}
                          disabled={temp === "HOT"}
                        />
                        <span>많이</span>
                      </label>
                    </div>
                  </div>
                  <div className={style.option}>
                    <h3>토핑 추가</h3>
                    <div className={style.topping_option}>
                      <label className={style.sub_radio_style}>
                        <input
                          type="checkbox"
                          name="topping"
                          value="기본"
                          checked={topping.includes("기본")}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setTopping(["기본"]); // 추가안함 선택시 다른 모든 토핑 해제
                            }
                          }}
                        />
                        <span>
                          추가 안 함
                          <br />
                          (+0원)
                        </span>
                      </label>
                      {["타피오카 펄", "화이트 펄", "밀크폼", "코코넛", "알로에"].map((item) => (
                        <label key={item} className={style.sub_radio_style}>
                          <input
                            type="checkbox"
                            name="topping"
                            value={item}
                            checked={topping.includes(item)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setTopping((prev) => 
                                  prev.includes("기본") ? [item] : [...prev.filter(t => t !== "기본"), item]
                                );
                              } else {
                                setTopping((prev) => {
                                  const newToppings = prev.filter(t => t !== item);
                                  return newToppings.length === 0 ? ["기본"] : newToppings;
                                });
                              }
                            }}
                          />
                          <span>
                            {item}
                            <br />
                            {(item === "타피오카 펄" || item === "화이트 펄") ? "(+500원)" : "(+1000원)"}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className={style.modal_bottom}>
                <div className={style.quantity_container}>
                  <h3>수량</h3>
                  <div className={style.quantity_btn}>
                    <button onClick={() => setQuantity(Math.max(quantity - 1, 1))}>-</button>
                    <span>{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)}>+</button>
                  </div>
                </div>
                <div className={style.button_group}>
                  <button className={`${style.modal_button} ${style.cart_button}`} onClick={addToCart}>
                    담기
                  </button>
                  <button className={`${style.modal_button} ${style.order_button}`} onClick={orderNow}>
                    주문하기
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MenuPage;
