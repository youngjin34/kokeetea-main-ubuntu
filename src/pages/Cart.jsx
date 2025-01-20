import React from "react";
import style from "./Cart.module.css";
import { useState } from "react";

const Cart = () => {
  const categories = ["전체선택", "브라운슈가밀크티", "타로밀크티"];
  const [activeCategory, setActiveCategory] = useState("전체선택");

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
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
      id: 2,
      category: "타로밀크티",
      price: "5,600원",
      options: "ICE",
      amount: 2,
    },
    {
      id: 2,
      category: "타로밀크티",
      price: "5,600원",
      options: "ICE",
      amount: 2,
    },
    {
      id: 2,
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
            <div className={style.total_select}>
              <span className={style.checkbox_round}>
                <input type="checkbox" />
              </span>
              <span className={style.total_select_text}>전체선택</span>
            </div>
            <hr className={style.hr}/>
            {tableData.map((row) => (
              <div key={row.id} className={style.cart_item}>
                <div className={style.checkbox_item}>
                  <span className={style.checkbox_round}>
                    <input type="checkbox" />
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
                <div className={style.cart_item_description}>
                  <div className={style.cart_item_header}>
                    <span className={style.cart_item_name}>{row.category}</span>
                  </div>
                  <div className={style.cart_item_price}>{row.price}</div>
                  <div className={style.cart_item_options}>{row.options}</div>
                  <div className={style.cart_item_count}>
                    <button className={style.minus_button}>-</button>
                    <span className={style.amount}>{row.amount}</span>
                    <button className={style.plus_button}>+</button>
                  </div>
                  <div className={style.cart_item_totalPrice}>
                    종금액{" "}
                    <span className={style.cart_item_totalPrice_money}>
                      {row.amount *
                        parseInt(row.price.replace(/,/g, "").replace("원", ""))}
                    </span>
                    원
                  </div>
                </div>
              </div>
            ))}

            <button className={style.remove_button}>삭제</button>
          </div>

          <div className={style.order_summary}>
            <div className={style.order_summary_top}>
              <div className={style.order_summary_title}>주문내역 확인</div>
              <div className={style.order_summary_detail}>
                <span className={style.order_summary_item}>총 주문수량</span>
                <span className={style.order_summary_count}>
                  {tableData.reduce((acc, curr) => acc + curr.amount, 0)}개
                </span>
              </div>
              <div className={style.order_summary_detail}>
                <span className={style.order_summary_item}>결제예정금액</span>
                <span className={style.order_summary_price}>
                  {tableData
                    .reduce(
                      (acc, curr) =>
                        acc +
                        curr.amount *
                          parseInt(
                            curr.price.replace(/,/g, "").replace("원", "")
                          ),
                      0
                    )
                    .toLocaleString()}
                  원
                </span>
              </div>
              <hr />
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
