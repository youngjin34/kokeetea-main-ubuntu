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

  // 장바구니 데이터 가져오기
  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    setLoading(true);
    try {
      // 더미데이터 사용
      setCartItems(tableData);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      console.error("장바구니 데이터 로딩 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  // 장바구니 아이템 삭제
  const handleRemove = async () => {
    try {
      const response = await fetch("/kokee/carts", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          itemIds: selectedItems
        }),
      });

      if (!response.ok) {
        throw new Error("상품 삭제에 실패했습니다.");
      }

      // 성공 시 장바구니 새로고침
      fetchCartItems();
      setSelectedItems([]);
    } catch (error) {
      console.error("상품 삭제 실패:", error);
      alert("상품 삭제에 실패했습니다.");
    }
  };

  // 수량 증가
  const handleIncrement = async (id) => {
    try {
      const response = await fetch(`/kokee/carts/${id}/amount`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: (amounts[id] || cartItems.find(item => item.id === id).amount) + 1
        }),
      });

      if (!response.ok) {
        throw new Error("수량 변경에 실패했습니다.");
      }

      fetchCartItems();
    } catch (error) {
      console.error("수량 증가 실패:", error);
      alert("수량 변경에 실패했습니다.");
    }
  };

  // 수량 감소
  const handleDecrement = async (id) => {
    const currentAmount = amounts[id] || cartItems.find(item => item.id === id).amount;
    if (currentAmount <= 1) return;

    try {
      const response = await fetch(`/kokee/carts/${id}/amount`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: currentAmount - 1
        }),
      });

      if (!response.ok) {
        throw new Error("수량 변경에 실패했습니다.");
      }

      fetchCartItems();
    } catch (error) {
      console.error("수량 감소 실패:", error);
      alert("수량 변경에 실패했습니다.");
    }
  };

  // 체크박스 관련 함수들
  const handleCheck = (id) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const handleAllCheck = (e) => {
    if (e.target.checked) {
      setSelectedItems(cartItems.map(item => item.id));
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
      .filter(item => selectedItems.includes(item.id))
      .reduce((acc, curr) => acc + (amounts[curr.id] || curr.amount), 0);
  };

  const calculateTotalSelectedPrice = () => {
    return cartItems
      .filter(item => selectedItems.includes(item.id))
      .reduce((acc, curr) => 
        acc + calculateTotalPrice(amounts[curr.id] || curr.amount, curr.price), 0
      );
  };

  const handleAddToCart = async (product) => {
    try {
      const response = await fetch("/kokee/carts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
            product_name : product.category,
            mount: product.amount,
            price: parseInt(product.price.replace(/,/g, "").replace("원", "")),
            email: "test@example.com" // 임시 이메일
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const result = await response.text();
       if(result === "success"){
            alert("상품이 장바구니에 추가되었습니다.");
        } else {
            alert("상품 추가에 실패했습니다. 다시 시도해주세요.")
        }

      // 장바구니 업데이트 기능은 현재 제공하지 않음
    } catch (error) {
      console.error("상품 추가에 실패했습니다:", error);
      alert("상품 추가에 실패했습니다. 다시 시도해주세요.")
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
    navigate('/order');
  };

  const handleOptionChange = (cartItem) => {
    setSelectedCartItem(cartItem);
    // 기존 옵션값 파싱 및 설정
    const options = cartItem.options.split(', ');
    options.forEach(option => {
      const [key, value] = option.split(': ');
      switch(key.trim()) {
        case '온도':
          setTemp(value.trim());
          break;
        case '크기':
          setSize(value.trim());
          break;
        case '휘핑크림':
          setWhipping(value.trim());
          break;
        case '펄':
          setPearl(value.trim());
          break;
        case '샷':
          setShots(value.trim());
          break;
      }
    });
    setOptionModalOpen(true);
  };

  const saveOptionChanges = async () => {
    try {
      const response = await fetch(`/kokee/carts/${selectedCartItem.id}/options`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          options: {
            temp,
            whipping,
            pearl,
            shots,
            size
          }
        }),
      });

      if (!response.ok) {
        throw new Error("옵션 변경에 실패했습니다.");
      }

      setOptionModalOpen(false);
      fetchCartItems();
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
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOptionModalOpen]);

  if (loading) return <div>로딩중...</div>;
  if (error) return <div>에러: {error}</div>;

  const tableData = [
    {
      id: 1,
      category: "브라운슈가밀크티",
      price: "5,600원",
      options: "ICE / 펄 추가(+500원) / 샷 추가(+500원)",
      amount: 1,
    },
    {
      id: 2,
      category: "타로밀크티",
      price: "5,600원",
      options: "ICE",
      amount: 2,
    },
    {
      id: 3,
      category: "타로밀크티",
      price: "5,600원",
      options: "ICE",
      amount: 2,
    },
    {
      id: 4,
      category: "타로밀크티",
      price: "5,600원",
      options: "ICE",
      amount: 2,
    },
    {
      id: 5,
      category: "타로밀크티",
      price: "5,600원",
      options: "ICE",
      amount: 2,
    },
  ];

  return (
    <div className={style.Container}>
      <div className={style.MainContent}>
        <h1 className={style.cart_title}>장바구니</h1>
        <div className={style.cart_menu_container}>
          <div className={style.cart_items}>
            <div>
              <div className={style.total_select}>
                <div>
                  <label className={style.checkbox_round}>
                    <input
                      className={style.checkbox_round_input}
                      type="checkbox"
                      onChange={handleAllCheck}
                      checked={selectedItems.length === cartItems.length}
                      id="selectAll"
                    />
                    <span className={style.total_select_text}>전체선택</span>
                  </label>
                </div>
                <button className={style.remove_button} onClick={handleRemove}>
                  삭제
                </button>
              </div>
            </div>
            <div className={style.cart_items_scrollable}>
              {tableData.map((row) => (
                <div key={row.id} className={style.cart_item}>
                  <div className={style.checkbox_item}>
                    <label className={style.checkbox_round}>
                      <input
                        className={style.checkbox_round_input}
                        type="checkbox"
                        checked={selectedItems.includes(row.id)}
                        onChange={() => handleCheck(row.id)}
                        id={`checkbox-${row.id}`}
                      />
                      <span className={style.checkbox_round_label}></span>
                    </label>
                  </div>
                  <div className={style.cart_item_image}>
                    {row.category === "브라운슈가밀크티" ? (
                      <img
                        src="../../public/img/Cold Cloud/Brown Sugar Cold Brew.png"
                        alt=""
                      />
                    ) : (
                      <img
                        src="../../public/img/Cold Cloud/Brown Sugar Cold Brew.png"
                        alt=""
                      />
                    )}
                  </div>
                  <div className={style.cart_item_}>
                    <div className={style.cart_item_top}>
                      <div className={style.cart_item_header}>
                        <span className={style.cart_item_name}>
                          {row.category}
                        </span>
                      </div>
                      <div>
                        <div className={style.cart_item_count}>
                          <button
                            className={style.minus_button}
                            onClick={() => handleDecrement(row.id)}
                          >
                            -
                          </button>
                          <input
                            type="text"
                            value={amounts[row.id] || row.amount}
                            className={style.amount_input}
                            readOnly
                          />
                          <button
                            className={style.plus_button}
                            onClick={() => handleIncrement(row.id)}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className={style.cart_item_price}>{row.price}</div>
                    <div className={style.cart_item_bottom}>
                      <div className={style.cart_item_options}>
                        옵션 {row.options}
                        <button className={style.option_change_btn} onClick={() => handleOptionChange(row)}>
                          옵션 변경
                        </button>
                      </div>
                      <div className={style.cart_item_totalPrice}>
                        총 금액{" "}
                        <span className={style.cart_item_totalPrice_money}>
                          {calculateTotalPrice(
                            amounts[row.id] || row.amount,
                            row.price
                          ).toLocaleString()}
                        </span>
                        원
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

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
        </div>
      </div>
      {isOptionModalOpen && selectedCartItem && (
        <div className={style.modal} onClick={(e) => {
          if (e.target === e.currentTarget) closeModal();
        }}>
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
                    className={`${style.option_btn} ${temp === "HOT" ? style.selected : ""}`}
                    onClick={() => setTemp("HOT")}
                  >
                    HOT
                  </button>
                  <button 
                    className={`${style.option_btn} ${temp === "ICE" ? style.selected : ""}`}
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
                    className={`${style.option_btn} ${size === "Regular" ? style.selected : ""}`}
                    onClick={() => setSize("Regular")}
                  >
                    Regular
                  </button>
                  <button 
                    className={`${style.option_btn} ${size === "Large" ? style.selected : ""}`}
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
                    className={`${style.option_btn} ${whipping === "기본" ? style.selected : ""}`}
                    onClick={() => setWhipping("기본")}
                  >
                    기본
                  </button>
                  <button 
                    className={`${style.option_btn} ${whipping === "없음" ? style.selected : ""}`}
                    onClick={() => setWhipping("없음")}
                  >
                    없음
                  </button>
                  <button 
                    className={`${style.option_btn} ${whipping === "많이" ? style.selected : ""}`}
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
                    className={`${style.option_btn} ${pearl === "추가 안함" ? style.selected : ""}`}
                    onClick={() => setPearl("추가 안함")}
                  >
                    추가 안함
                  </button>
                  <button 
                    className={`${style.option_btn} ${pearl === "타피오카 펄" ? style.selected : ""}`}
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
                    className={`${style.option_btn} ${shots === "기본" ? style.selected : ""}`}
                    onClick={() => setShots("기본")}
                  >
                    기본
                  </button>
                  <button 
                    className={`${style.option_btn} ${shots === "1샷 추가" ? style.selected : ""}`}
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