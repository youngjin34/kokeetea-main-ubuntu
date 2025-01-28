import React, { useState, useCallback, useMemo, useEffect } from "react";
import style from "./Cart.module.css";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  // 페이지 들어왔들 때 제일 위로 이동하게 하는 코드
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [cartItems, setCartItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [amounts, setAmounts] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState("전체선택"); // 카테고리 기능 삭제
  const navigate = useNavigate();
  const [isOptionModalOpen, setOptionModalOpen] = useState(false);
  const [selectedCartItem, setSelectedCartItem] = useState(null);
  const [temp, setTemp] = useState("HOT");
  const [whipping, setWhipping] = useState("기본");
  const [pearl, setPearl] = useState("추가 안함");
  const [shots, setShots] = useState("기본");
  const [size, setSize] = useState("Regular"); // 사이즈 옵션 추가

  const fetchCartData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const email = localStorage.getItem("email");
      let cartData = [];

      if (token && email) {
        // 로그인 상태: 서버에서 데이터 가져오기
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

        cartData = await response.json();
        cartData = cartData.map((item) => ({
          id: item.id,
          pdName: item.product_name,
          quantity: item.mount,
          totalPrice: item.price,
          date: item.date,
          order_whether: item.order_whether,
        }));
      } else {
        // 비로그인 상태: 로컬스토리지에서 데이터 가져오기
        const localCartData = localStorage.getItem("cart");
        cartData = localCartData ? JSON.parse(localCartData) : [];
      }

      setCartItems(cartData);
    } catch (error) {
      console.error("장바구니 데이터 로드 실패:", error);
      setError(error.message);
      // 에러 발생시 빈 배열로 초기화하여 UI 렌더링은 가능하도록 함
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartData();
  }, []);

  useEffect(() => {
    if (cartItems.length > 0) {
      localStorage.setItem("cart", JSON.stringify(cartItems));
    }
  }, [cartItems]);

  // 장바구니 아이템 삭제
  const handleRemove = async () => {
    const email = localStorage.getItem("email");
    const token = localStorage.getItem("token");

    if (token && email) {
      try {
        for (const itemId of selectedItems) {
          await fetch(
            `http://localhost:8080/kokee/carts/delete_one/${itemId}`,
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );
        }

        fetchCartData();
        setSelectedItems([]);
      } catch (error) {
        console.error("상품 삭제 실패:", error);
        alert("상품 삭제에 실패했습니다.");
      }
    } else {
      const currentCart = JSON.parse(localStorage.getItem("cart")) || [];
      const updatedCart = currentCart.filter(
        (item) => !selectedItems.includes(item.id)
      );
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      setCartItems(updatedCart);
      setSelectedItems([]);
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
          updatePrice: calculateTotalPrice(newAmount, item.price),
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
    if (!email) return;

    const item = cartItems.find((item) => item.id === id);
    const currentAmount = amounts[id] || item.amount;
    if (currentAmount <= 1) return;

    const newAmount = currentAmount - 1;

    try {
      await fetch(`/kokee/carts/update/${email}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: id,
          updateMount: newAmount,
          updatePrice: calculateTotalPrice(newAmount, item.price),
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
      .reduce((acc, curr) => acc + (amounts[curr.id] || curr.amount), 0);
  };

  const calculateTotalSelectedPrice = () => {
    return cartItems
      .filter((item) => selectedItems.includes(item.id))
      .reduce(
        (acc, curr) =>
          acc +
          calculateTotalPrice(amounts[curr.id] || curr.amount, curr.price),
        0
      );
  };

  const handleAddToCart = async (product) => {
    try {
      const response = await fetch("http://localhost:8080/kokee/carts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product_name: product.category,
          mount: product.amount,
          price: parseInt(product.price.replace(/,/g, "").replace("원", "")),
          email: "test@example.com", // 임시 이메일
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const result = await response.text();
      if (result === "success") {
        alert("상품이 장바구니에 추가되었습니다.");
      } else {
        alert("상품 추가에 실패했습니다. 다시 시도해주세요.");
      }

      // 장바구니 업데이트 기능은 현재 제공하지 않음
    } catch (error) {
      console.error("상품 추가에 실패했습니다:", error);
      alert("상품 추가에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
  };

  const calculateTotalCartPrice = () => {
    return cartItems.reduce(
      (acc, curr) => acc + calculateTotalPrice(curr.amount, curr.price),
      0
    );
  };
  const calculateTotalCartAmount = () => {
    return cartItems.reduce((acc, curr) => acc + curr.amount, 0);
  };

  const handleCheckout = () => {
    navigate("/order");
  };

  const handleOptionChange = (cartItem) => {
    setSelectedCartItem(cartItem);
    // 기존 옵션값 파싱 및 설정
    const options = cartItem.options.split(", ");
    options.forEach((option) => {
      const [key, value] = option.split(": ");
      switch (key.trim()) {
        case "온도":
          setTemp(value.trim());
          break;
        case "크기":
          setSize(value.trim());
          break;
        case "휘핑크림":
          setWhipping(value.trim());
          break;
        case "펄":
          setPearl(value.trim());
          break;
        case "샷":
          setShots(value.trim());
          break;
      }
    });
    setOptionModalOpen(true);
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

  // 옵션 표시 형식 수정
  const formatOptions = (options) => {
    if (!options) return "옵션 없음";

    try {
      // options가 문자열인 경우, 쉼표로 분리하여 배열로 변환
      if (typeof options === "string") {
        return options
          .split(",")
          .map((opt) => opt.trim())
          .join(" / ");
      }

      // options가 객체인 경우
      if (typeof options === "object") {
        return Object.entries(options)
          .filter(([_, value]) => value) // 값이 있는 옵션만 필터링
          .map(([key, value]) => {
            // 키값을 한글로 변환
            const koreanKey =
              {
                temp: "온도",
                size: "크기",
                whipping: "휘핑",
                pearl: "펄",
                shots: "샷",
              }[key] || key;

            return `${value}`; // 키 레이블은 제외하고 값만 표시
          })
          .join(" / ");
      }

      return "옵션 없음";
    } catch (error) {
      console.error("옵션 형식화 오류:", error);
      return "옵션 없음";
    }
  };

  const saveOptionChanges = async () => {
    try {
      const formattedOptions = `${temp}, ${size}, ${whipping}, ${pearl}, ${shots}`;

      const response = await fetch(
        `http://localhost:8080/kokee/carts/${selectedCartItem.id}/options`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            options: formattedOptions,
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

  // 모달 닫을 때 초기화
  const closeModal = () => {
    setOptionModalOpen(false);
    setSelectedCartItem(null);
    // 옵션 상태 초기화
    setTemp("HOT");
    setWhipping("기본");
    setPearl("추가 안함");
    setShots("기본");
    setSize("Regular");
  };

  // 모달 열릴 때 body 스크롤 막기
  useEffect(() => {
    if (isOptionModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
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
                    <div key={item.id} className={style.cart_item}>
                      <div className={style.checkbox_item}>
                        <label className={style.checkbox_round}>
                          <input
                            type="checkbox"
                            checked={selectedItems.includes(item.id)}
                            onChange={() => handleCheck(item.id)}
                            className={style.checkbox_round_input}
                            id={`checkbox-${item.id}`}
                          />
                          <span className={style.checkbox_round_label}></span>
                        </label>
                      </div>
                      <div className={style.cart_item_image}>
                        <img
                          src={item.image || "/img/default-menu.png"}
                          alt={item.pdName}
                          className={style.menu_image}
                        />
                      </div>
                      <div className={style.cart_item_}>
                        <div className={style.cart_item_top}>
                          <div className={style.cart_item_header}>
                            <span className={style.cart_item_name}>
                              {item.pdName}
                            </span>
                          </div>
                          <div>
                            <div className={style.cart_item_count}>
                              <button
                                className={style.minus_button}
                                onClick={() => handleDecrement(item.id)}
                              >
                                -
                              </button>
                              <input
                                type="text"
                                value={item.quantity}
                                className={style.amount_input}
                                readOnly
                              />
                              <button
                                className={style.plus_button}
                                onClick={() => handleIncrement(item.id)}
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className={style.cart_item_price}>
                          {typeof item.totalPrice === "number"
                            ? item.totalPrice.toLocaleString()
                            : parseInt(item.totalPrice).toLocaleString()}
                          원
                        </div>
                        <div className={style.cart_item_options}>
                          {formatOptions(item.options)}
                          <button
                            className={style.option_change_btn}
                            onClick={() => handleOptionChange(item)}
                          >
                            옵션변경
                          </button>
                        </div>
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
        <div
          className={style.modal}
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div className={style.modalContent}>
            <div className={style.modal_header}>
              <h2>{selectedCartItem.category}</h2>
              <button className={style.closeButton} onClick={closeModal}>
                <img src="/public/img/close.png" alt="Close" />
              </button>
            </div>

            <div className={style.options_section}>
              <div className={style.option_group}>
                <h3>온도</h3>
                <div className={style.option_buttons}>
                  <button
                    className={`${style.option_btn} ${
                      temp === "HOT" ? style.selected : ""
                    }`}
                    onClick={() => setTemp("HOT")}
                  >
                    HOT
                  </button>
                  <button
                    className={`${style.option_btn} ${
                      temp === "ICE" ? style.selected : ""
                    }`}
                    onClick={() => setTemp("ICE")}
                  >
                    ICE
                  </button>
                </div>
              </div>

              <div className={style.option_group}>
                <h3>크기</h3>
                <div className={style.option_buttons}>
                  <button
                    className={`${style.option_btn} ${
                      size === "Regular" ? style.selected : ""
                    }`}
                    onClick={() => setSize("Regular")}
                  >
                    Regular
                  </button>
                  <button
                    className={`${style.option_btn} ${
                      size === "Large" ? style.selected : ""
                    }`}
                    onClick={() => setSize("Large")}
                  >
                    Large (+500원)
                  </button>
                </div>
              </div>

              <div className={style.option_group}>
                <h3>휘핑크림</h3>
                <div className={style.option_buttons}>
                  <button
                    className={`${style.option_btn} ${
                      whipping === "기본" ? style.selected : ""
                    }`}
                    onClick={() => setWhipping("기본")}
                  >
                    기본
                  </button>
                  <button
                    className={`${style.option_btn} ${
                      whipping === "없음" ? style.selected : ""
                    }`}
                    onClick={() => setWhipping("없음")}
                  >
                    없음
                  </button>
                  <button
                    className={`${style.option_btn} ${
                      whipping === "많이" ? style.selected : ""
                    }`}
                    onClick={() => setWhipping("많이")}
                  >
                    많이
                  </button>
                </div>
              </div>

              <div className={style.option_group}>
                <h3>펄</h3>
                <div className={style.option_buttons}>
                  <button
                    className={`${style.option_btn} ${
                      pearl === "추가 안함" ? style.selected : ""
                    }`}
                    onClick={() => setPearl("추가 안함")}
                  >
                    추가 안함
                  </button>
                  <button
                    className={`${style.option_btn} ${
                      pearl === "타피오카 펄" ? style.selected : ""
                    }`}
                    onClick={() => setPearl("타피오카 펄")}
                  >
                    타피오카 펄 (+500원)
                  </button>
                </div>
              </div>

              <div className={style.option_group}>
                <h3>샷</h3>
                <div className={style.option_buttons}>
                  <button
                    className={`${style.option_btn} ${
                      shots === "기본" ? style.selected : ""
                    }`}
                    onClick={() => setShots("기본")}
                  >
                    기본
                  </button>
                  <button
                    className={`${style.option_btn} ${
                      shots === "1샷 추가" ? style.selected : ""
                    }`}
                    onClick={() => setShots("1샷 추가")}
                  >
                    1샷 추가 (+500원)
                  </button>
                </div>
              </div>
            </div>

            <div className={style.modal_footer}>
              <button
                className={style.confirm_button}
                onClick={saveOptionChanges}
              >
                변경하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
