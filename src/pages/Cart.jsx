import React, { useState, useEffect, useRef } from "react";
import style from "./Cart.module.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const token = localStorage.getItem("token");

const Cart = () => {
  // 페이지 들어왔들 때 제일 위로 이동하게 하는 코드
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [cartItems, setCartItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const fetchCartData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:8080/api/carts`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const items = response.data.items || [];
      setCartItems(items);

      if (items.length === 0) {
        setError(""); // 404가 아닌 정상 응답일 때는 에러 메시지 X
      }
    } catch (error) {
      console.error("장바구니 데이터 로드 실패:", error);

      // 🔥 404 에러일 경우 빈 배열로 처리해서 오류 방지
      if (error.response && error.response.status === 404) {
        setCartItems([]);
        setError(""); // 404일 때는 오류 메시지를 보여주지 않음
      } else {
        setError("장바구니 데이터를 불러오는 데 실패했습니다.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartData();
  }, []);

  // 장바구니 아이템 삭제
  const handleRemove = async () => {
    if (!window.confirm("정말 삭제하시겠습니까?")) {
      return; // 취소하면 삭제하지 않음
    }

    try {
      for (const itemId of selectedItems) {
        await axios.delete(`http://localhost:8080/api/carts`, {
          data: { cart_ids: [itemId] },
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

  // 수량 변경
  const handleChangeQuantity = async (id, newQuantity) => {
    if (newQuantity < 1) {
      alert("수량은 최소 1이어야 합니다.");
      return;
    }

    try {
      await axios.patch(
        `http://localhost:8080/api/carts/${id}/quantity/${newQuantity}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchCartData();
    } catch (error) {
      console.error("수량 증가 실패:", error);
      alert("수량 변경에 실패했습니다.");
    }
  };

  // 장바구니 데이터 로드 후 전체 선택 적용
  useEffect(() => {
    if (cartItems.length > 0) {
      const allItemIds = cartItems.map((item) => item.cart_id);
      setSelectedItems(allItemIds);
    }
  }, [cartItems]);

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
      const allItemIds = cartItems.map((item) => item.cart_id);
      setSelectedItems(allItemIds);
    } else {
      setSelectedItems([]);
    }
  };

  const calculateTotalSelectedAmount = () => {
    return cartItems
      .filter((item) => selectedItems.includes(item.cart_id))
      .reduce((acc, curr) => acc + curr.quantity, 0);
  };

  const calculateTotalSelectedPrice = () => {
    return cartItems
      .filter((item) => selectedItems.includes(item.cart_id))
      .reduce((acc, curr) => acc + curr.total_item_price, 0);
  };

  const handleCheckout = () => {
    navigate("/order");
  };

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
                    <div key={item.cart_id} className={style.cart_item}>
                      <label className={style.checkbox_round}>
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(item.cart_id)}
                          onChange={() => handleCheck(item.cart_id)}
                          className={style.checkbox_round_input}
                        />
                      </label>
                      <div className={style.cart_item_image}>
                        <img src={item.image_url} alt={item.name} />
                      </div>
                      <div className={style.cart_item_details}>
                        <div className={style.cart_item_header}>
                          <h3 className={style.cart_item_name}>{item.name}</h3>
                        </div>
                        <div className={style.cart_item_options}>
                          <p>온도: {item.options[0].name}</p>
                          <p>사이즈: {item.options[1].name}</p>
                          <p>당도: {item.options[2].name}</p>
                          {item.options[3] && (
                            <p>얼음량: {item.options[3]?.name}</p>
                          )}
                          <div>
                            <p>토핑:</p>
                            {item.options
                              .filter(
                                (option) =>
                                  option.id >= 15 &&
                                  option.id <= 20 &&
                                  option.name !== "추가 안 함"
                              ) // '추가 안 함'은 제외
                              .map((option) => option.name)
                              .join(", ")}
                          </div>
                        </div>
                        <div className={style.cart_item_bottom}>
                          <div className={style.cart_item_count}>
                            <button
                              className={style.minus_button}
                              onClick={() =>
                                handleChangeQuantity(
                                  item.cart_id,
                                  item.quantity - 1
                                )
                              }
                            >
                              -
                            </button>
                            <span className={style.amount_input}>
                              {item.quantity}
                            </span>
                            <button
                              className={style.plus_button}
                              onClick={() =>
                                handleChangeQuantity(
                                  item.cart_id,
                                  item.quantity + 1
                                )
                              }
                            >
                              +
                            </button>
                          </div>
                          <div className={style.cart_item_price}>
                            {item.total_item_price}원
                          </div>
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
    </div>
  );
};

export default Cart;
