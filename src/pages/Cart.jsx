import React, { useState, useCallback, useMemo } from "react";
import style from "./Cart.module.css";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState("전체선택"); // 카테고리 기능 삭제

  // 샘플 데이터 삭제

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

  const calculateTotalPrice = (amount, price) => {
    return amount * parseInt(price.replace(/,/g, "").replace("원", ""));
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
                  <span className={style.checkbox_round}>
                    <input
                      className={style.checkbox_round_input}
                      type="checkbox"
                      onChange={handleAllCheck}
                      checked={selectedItems.length === tableData.length}
                    />
                    <label htmlFor="custom-checkbox" className="checkbox-label"></label>
                  </span>
                  <span className={style.total_select_text}>전체선택</span>
                </div>
                <button className={style.remove_button} onClick={handleRemove}>
                  삭제
                </button>
              </div>
            </div>
            <hr className={style.hr} />
            <div className={style.cart_items_scrollable}>
              {tableData.map((row) => (
                <div key={row.id} className={style.cart_item}>
                  <div className={style.checkbox_item}>
                    <span className={style.checkbox_round}>
                      <input
                      className={style.checkbox_round_input}
                        type="checkbox"
                        checked={selectedItems.includes(row.id)}
                        onChange={() => handleCheck(row.id)}
                      />
                    </span>
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
                        <button>옵션 변경</button>
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
              <hr className={style.hr} />
              <div className={style.order_summary_text}>
                *최종금액은 결제화면에서 확인 가능합니다.
              </div>
            </div>
            <button className={style.checkout_button}>결제하기</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
