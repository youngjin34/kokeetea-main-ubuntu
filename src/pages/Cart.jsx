import React, { useState, useCallback, useMemo, useEffect, useRef } from "react";
import style from "./Cart.module.css";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const modalRef = useRef(null);

  // 페이지 들어왔들 때 제일 위로 이동하게 하는 코드
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [cartItems, setCartItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [amounts, setAmounts] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [isOptionModalOpen, setOptionModalOpen] = useState(false);
  const [selectedCartItem, setSelectedCartItem] = useState(null);
  const [temp, setTemp] = useState("ICE");
  const [topping, setTopping] = useState("기본");
  const [size, setSize] = useState("Regular");
  const [sugar, setSugar] = useState("70%");
  const [iceAmount, setIceAmount] = useState("보통");
  const [currentPrice, setCurrentPrice] = useState(0);
  const [priceChange, setPriceChange] = useState({ size: 0, pearl: 0 });

  const fetchCartData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const email = localStorage.getItem("email");

      if (!token || !email) {
        throw new Error("로그인이 필요합니다");
      }

      const response = await fetch(
        `http://localhost:8080/kokee/carts/${email}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`서버 에러: ${response.status}`);
      }

      const cartData = await response.json();
      const mappedCartData = cartData.map((item) => ({
        id: item.id,
        pdName: item.product_name,
        totalPrice: item.price,
        quantity: item.mount,
        email: item.email,
        size: item.size,
        temperature: item.temp,
        sugar: item.sugar,
        iceAmount: item.iceAmount,
        topping: item.topping,
        image: item.image,
        options: {
          size: item.size,
          temperature: item.temp,
          sugar: item.sugar,
          iceAmount: item.iceAmount,
          topping: item.topping
        }
      }));

      setCartItems(mappedCartData);
      localStorage.setItem('cartCount', mappedCartData.length.toString());
    } catch (error) {
      console.error("장바구니 데이터 로드 실패:", error);
      setError(error.message);
      setCartItems([]);
      localStorage.setItem('cartCount', '0');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartData();
  }, []);

  // 장바구니 아이템 삭제
  const handleRemove = async () => {
    const email = localStorage.getItem("email");
    const token = localStorage.getItem("token");

    if (!token || !email) {
      setError("로그인이 필요합니다");
      return;
    }

    try {
      for (const itemId of selectedItems) {
        await fetch(`http://localhost:8080/kokee/carts/delete_one/${itemId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
      }

      await fetchCartData(); // 이 함수 내에서 cartCount가 업데이트됨
      setSelectedItems([]);
    } catch (error) {
      console.error("상품 삭제 실패:", error);
      alert("상품 삭제에 실패했습니다.");
    }
  };

  // 수량 증가
  const handleIncrement = async (id) => {
    const email = localStorage.getItem("email");
    if (!email) return;

    const item = cartItems.find((item) => item.id === id);
    const newAmount = (amounts[id] || item.amount) + 1;

    try {
      await fetch(`/kokee/carts/update/${email}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: id,
          updateMount: newAmount,
          updatePrice: calculateTotalPrice(newAmount, item.totalPrice),
          temperature: temp,
          sugar: sugar,
          iceAmount: iceAmount,
          topping: topping,
          size: size,
        }),
      });

      fetchCartData();
    } catch (error) {
      console.error("수량 증가 실패:", error);
      alert("수량 변경에 실패했습니다.");
    }
  };

  // 수량 감소
  const handleDecrement = async (id) => {
    const email = localStorage.getItem("email");
    const token = localStorage.getItem("token");
    if (!email || !token) return;

    const item = cartItems.find((item) => item.id === id);
    const currentAmount = amounts[id] || item.quantity;
    if (currentAmount <= 1) return;

    const newAmount = currentAmount - 1;

    try {
      await fetch(`http://localhost:8080/kokee/carts/update/${email}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: id,
          updateMount: newAmount,
          updatePrice: calculateTotalPrice(newAmount, item.totalPrice),
          temperature: temp,
          sugar: sugar,
          iceAmount: iceAmount,
          topping: topping,
          size: size,
        }),
      });

      fetchCartData();
    } catch (error) {
      console.error("수량 감소 실패:", error);
      alert("수량 변경에 실패했습니다.");
    }
  };

  // 체크박스 관련 함수들 수정
  const handleCheck = (id) => {
    setSelectedItems((prev) => {
      const isSelected = prev.includes(id);
      if (isSelected) {
        return prev.filter((itemId) => itemId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleAllCheck = (e) => {
    if (e.target.checked) {
      const allItemIds = cartItems.map((item) => item.id);
      setSelectedItems(allItemIds);
    } else {
      setSelectedItems([]);
    }
  };

  // 계산 관련 함수들
  const calculateTotalPrice = (amount, price) => {
    return amount * parseInt(price.replace(/,/g, "").replace("원", ""));
  };

  const calculateTotalSelectedAmount = () => {
    return cartItems
      .filter((item) => selectedItems.includes(item.id))
      .reduce((acc, curr) => acc + curr.quantity, 0);
  };

  const calculateTotalSelectedPrice = () => {
    return cartItems
      .filter((item) => selectedItems.includes(item.id))
      .reduce((acc, curr) => acc + curr.totalPrice, 0);
  };
  
  const handleCheckout = () => {
    navigate("/order");
  };

  const handleOptionChange = (cartItem) => {
    setSelectedCartItem(cartItem);
    
    // 저장된 옵션 정보를 사용하여 상태 설정
    setTemp(cartItem.temperature);
    setSize(cartItem.size);
    setSugar(cartItem.sugar);
    setIceAmount(cartItem.iceAmount);
    setTopping(cartItem.topping);

    // 초기 가격 설정
    const basePrice = cartItem.totalPrice / cartItem.quantity;
    setCurrentPrice(basePrice);

    // 추가 가격 계산
    const additionalPrice = {
      size: cartItem.size === "Large" ? 1000 : cartItem.size === "Kokee-Large" ? 1500 : 0,
      pearl: ["타피오카 펄", "화이트 펄"].includes(cartItem.topping) ? 500 :
             ["밀크폼", "코코넛", "알로에"].includes(cartItem.topping) ? 1000 : 0
    };
    
    setPriceChange(additionalPrice);
    setOptionModalOpen(true);
  };

  // 사이즈 변경 핸들러
  const handleSizeChange = (newSize) => {
    let sizePrice = 0;
    if (newSize === "Large") sizePrice = 1000;
    if (newSize === "Kokee-Large") sizePrice = 1500;

    setPriceChange((prev) => ({ ...prev, size: sizePrice }));
    setSize(newSize);
  };

  // 펄 변경 핸들러
  const handleToppingChange = (newTopping) => {
    let pearlPrice = 0;
    if (newTopping === "타피오카 펄") pearlPrice = 500;
    if (newTopping === "화이트 펄") pearlPrice = 500;
    if (newTopping === "밀크폼") pearlPrice = 1000;
    if (newTopping === "코코넛") pearlPrice = 1000;
    if (newTopping === "알로에") pearlPrice = 1000;

    setPriceChange((prev) => ({ ...prev, pearl: pearlPrice }));
    setTopping(newTopping);
  };

  // 옵션 가격 계산 함수 추가
  const calculateOptionPrice = (basePrice) => {
    let additionalPrice = 0;

    // 사이즈 옵션 가격
    if (size === "Large") additionalPrice += 1000;
    if (size === "Kokee-Large") additionalPrice += 1500;

    // 펄 옵션 가격
    if (topping === "타피오카 펄") additionalPrice += 500;
    if (topping === "화이트 펄") additionalPrice += 500;
    if (topping === "밀크폼") additionalPrice += 1000;
    if (topping === "코코넛") additionalPrice += 1000;
    if (topping === "알로에") additionalPrice += 1000;

    return basePrice + additionalPrice;
  };

  const saveOptionChanges = async () => {
    try {
      const token = localStorage.getItem("token");
      const basePrice = selectedCartItem.totalPrice / selectedCartItem.quantity; // 기본 단가 계산
      const newUnitPrice = calculateOptionPrice(basePrice); // 새로운 단가 계산
      const newTotalPrice = newUnitPrice * selectedCartItem.quantity; // 새로운 총 가격

      const response = await fetch(
        `http://localhost:8080/kokee/carts/update/${selectedCartItem.email}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            id: selectedCartItem.id,
            updateMount: selectedCartItem.quantity,
            updatePrice: newTotalPrice,
            temperature: temp,
            size: size,
            sugar: sugar,
            iceAmount: iceAmount,
            topping: topping,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("옵션 변경에 실패했습니다.");
      }

      setOptionModalOpen(false);
      fetchCartData();
    } catch (error) {
      console.error("옵션 변경 실패:", error);
      alert("옵션 변경에 실패했습니다.");
    }
  };

  // 옵션 표시 형식 수정
  const formatOptions = (item) => {
    if (!item) return "옵션 없음";

    const options = [];
    if (item.temperature) options.push(item.temperature);
    if (item.size) options.push(item.size);
    if (item.sugar) options.push(item.sugar);
    if (item.iceAmount) options.push(item.iceAmount);
    if (item.topping) options.push(item.topping);

    return options.length > 0 ? options.join(" / ") : "옵션 없음";
  };

  // 이미지 경로를 가져오는 함수 추가
  const getMenuImage = (category) => {
    const imageMap = {
      브라운슈가밀크티: "./img/Cold Cloud/Brown Sugar Cold Brew.png",
      타로밀크티: "./img/Milk Tea/Taro Milk Tea.png",
      얼그레이밀크티: "./img/Milk Tea/Earl Grey Milk Tea.png",
      // 나머지 메뉴들에 대한 이미지 경로도 추가
    };

    // 이미지가 없는 경우 바로 기본 이미지 반환
    return imageMap[category] ?? "/public/img/default-menu.png";
  };

  // 모달 닫을 때 초기화
  const closeModal = () => {
    setOptionModalOpen(false);
    setSelectedCartItem(null);
    // 옵션 상태 초기화
    setTemp("ICE");
    setSugar("70%");
    setIceAmount("보통");
    setTopping("기본");
  };

  const handleModalClick = (e) => {
    if (modalRef.current === e.target) {
      closeModal();
    }
  };

  useEffect(() => {
    if (isOptionModalOpen) {
      document.body.style.overflow = "hidden";
      document.addEventListener("mousedown", handleModalClick);
    } else {
      document.body.style.overflow = "unset";
      document.removeEventListener("mousedown", handleModalClick);
    }

    return () => {
      document.body.style.overflow = "unset";
      document.removeEventListener("mousedown", handleModalClick);
    };
  }, [isOptionModalOpen]);

  if (loading) return <div>로딩중...</div>;
  if (error) return <div>에러: {error}</div>;

  return (
    <div className={style.Container}>
      <div className={style.MainContent}>
        <h1 className={style.cart_title}>장바구니</h1>
        <div className={style.cart_menu_container}>
          <div className={style.cart_items}>
            {cartItems.length === 0 ? (
              <div className={style.empty_cart}>
                <h2>장바구니가 비어있습니다</h2>
                <p>원하는 메뉴를 장바구니에 담아보세요!</p>
                <button
                  className={style.go_to_menu_button}
                  onClick={() => navigate("/menupage")}
                >
                  메뉴 보러가기
                </button>
              </div>
            ) : (
              <>
                <div>
                  <div className={style.total_select}>
                    <div>
                      <label className={style.checkbox_round}>
                        <input
                          type="checkbox"
                          onChange={handleAllCheck}
                          checked={
                            cartItems.length > 0 &&
                            selectedItems.length === cartItems.length
                          }
                          className={style.checkbox_round_input}
                          id="selectAll"
                        />
                        <span className={style.total_select_text}>
                          전체선택
                        </span>
                      </label>
                    </div>
                    <button
                      className={style.remove_button}
                      onClick={handleRemove}
                      disabled={selectedItems.length === 0}
                    >
                      삭제
                    </button>
                  </div>
                </div>
                <div className={style.cart_items_scrollable}>
                  {cartItems.map((item) => (
                    <div key={item.id} className={style.cartItem}>
                      <img src={item.image} alt={item.pdName} className={style.cartImage} />
                      <div className={style.cartDetails}>
                        <h3>{item.pdName}</h3>
                        <p>가격: {item.totalPrice.toLocaleString()}원</p>
                        <p>수량: {item.quantity}개</p>
                        <div className={style.optionDetails}>
                          <p>온도: {item.temperature}</p>
                          <p>사이즈: {item.size}</p>
                          <p>당도: {item.sugar}</p>
                          {item.temperature === 'ICE' && <p>얼음량: {item.iceAmount}</p>}
                          <p>토핑: {item.topping}</p>
                        </div>
                        <button 
                          className={style.editButton} 
                          onClick={() => handleOptionChange(item)}
                        >
                          옵션 변경
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {cartItems.length > 0 && (
            <div className={style.order_summary}>
              <div className={style.order_summary_top}>
                <div className={style.order_summary_title}>주문내역 확인</div>
                <div className={style.order_summary_detail}>
                  <span className={style.order_summary_item}>총 주문수량</span>
                  <span className={style.order_summary_count}>
                    {calculateTotalSelectedAmount()}개
                  </span>
                </div>
                <div className={style.order_summary_detail}>
                  <span className={style.order_summary_item}>결제예정금액</span>
                  <span className={style.order_summary_price}>
                    {calculateTotalSelectedPrice().toLocaleString()}원
                  </span>
                </div>
                <div className={style.order_summary_text}>
                  *최종금액은 결제화면에서 확인 가능합니다.
                </div>
              </div>
              <button
                className={style.checkout_button}
                onClick={handleCheckout}
              >
                결제하기
              </button>
            </div>
          )}
        </div>
      </div>
      {isOptionModalOpen && selectedCartItem && (
        <div className={style.modal} ref={modalRef}>
          <div className={style.modalContent}>
            <div className={style.modal_left}>
              <img
                src={selectedCartItem.image}
                alt={selectedCartItem.pdName}
                className={style.modalImage}
              />
              <div className={style.product_info}>
                <h2 className={style.product_name}>{selectedCartItem.pdName}</h2>
                <p className={style.product_price}>
                  {(currentPrice + calculateOptionPrice()).toLocaleString()}원
                  <br />
                  <span className={style.option_price}>
                    (기본 {currentPrice.toLocaleString()}원 + 옵션 {calculateOptionPrice().toLocaleString()}원)
                  </span>
                </p>
                <p className={style.product_description}>
                  신선한 재료로 만든 프리미엄 음료
                </p>
              </div>
            </div>
            <div className={style.modal_right}>
              <div className={style.option_scroll}>
                <div className={style.option}>
                  <h3>온도</h3>
                  <div className={style.temp_option}>
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
                    <label className={`${style.radio_style} ${style.ice_option}`}>
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
                <div className={style.option}>
                  <h3>사이즈</h3>
                  <div className={style.size_option}>
                    <label className={style.sub_radio_style}>
                      <input
                        type="radio"
                        name="size"
                        value="Regular"
                        checked={size === "Regular"}
                        onChange={() => handleSizeChange("Regular")}
                      />
                      <span>Regular</span>
                    </label>
                    <label className={style.sub_radio_style}>
                      <input
                        type="radio"
                        name="size"
                        value="Large"
                        checked={size === "Large"}
                        onChange={() => handleSizeChange("Large")}
                      />
                      <span>
                        Large
                        <br />
                        (+1,000원)
                      </span>
                    </label>
                    <label className={style.sub_radio_style}>
                      <input
                        type="radio"
                        name="size"
                        value="Kokee-Large"
                        checked={size === "Kokee-Large"}
                        onChange={() => handleSizeChange("Kokee-Large")}
                      />
                      <span>
                        Kokee-Large
                        <br />
                        (+1,500원)
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
                  <h3>얼음량</h3>
                  <div className={style.ice_amount_option}>
                    <label className={style.sub_radio_style}>
                      <input
                        type="radio"
                        name="iceAmount"
                        value="적게"
                        checked={iceAmount === "적게"}
                        onChange={() => setIceAmount("적게")}
                      />
                      <span>적게</span>
                    </label>
                    <label className={style.sub_radio_style}>
                      <input
                        type="radio"
                        name="iceAmount"
                        value="보통"
                        checked={iceAmount === "보통"}
                        onChange={() => setIceAmount("보통")}
                      />
                      <span>보통</span>
                    </label>
                    <label className={style.sub_radio_style}>
                      <input
                        type="radio"
                        name="iceAmount"
                        value="많이"
                        checked={iceAmount === "많이"}
                        onChange={() => setIceAmount("많이")}
                      />
                      <span>많이</span>
                    </label>
                  </div>
                </div>
                <div className={style.option}>
                  <h3>토핑</h3>
                  <div className={style.topping_option}>
                    <label className={style.sub_radio_style}>
                      <input
                        type="radio"
                        name="topping"
                        value="기본"
                        checked={topping === "기본"}
                        onChange={() => handleToppingChange("기본")}
                      />
                      <span>기본</span>
                    </label>
                    {["타피오카 펄", "화이트 펄", "밀크폼", "코코넛", "알로에"].map((item) => (
                      <label key={item} className={style.sub_radio_style}>
                        <input
                          type="radio"
                          name="topping"
                          value={item}
                          checked={topping === item}
                          onChange={() => handleToppingChange(item)}
                        />
                        <span>
                          {item}
                          <br />
                          {(item === "타피오카 펄" || item === "화이트 펄") ? "(+500원)" : "(+1,000원)"}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <div className={style.modal_bottom}>
                <button className={style.confirm_button} onClick={saveOptionChanges}>
                  변경하기
                </button>
              </div>
            </div>
            <div className={style.modalClose} onClick={closeModal}>
              <img src="/img/close.png" alt="Close" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
