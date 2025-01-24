import React from "react";
import style from "./Order.module.css"; // Import the CSS module
import { useState } from "react";

function Order() {
  const [selectedPickupMethod, setSelectedPickupMethod] =
    useState("매장(다회용컵)");
  const [selectedCoupon, setSelectedCoupon] = useState("");
  const [stamps, setStamps] = useState(0);
  const pickupMethods = [
    "매장(다회용컵)",
    "테이크아웃(일회용컵)",
    "딜리버리(직원에게 전달)",
  ];
  const coupons = ["적용할 쿠폰을 선택하세요.", "10% 할인", "20% 할인"];
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
  ];
  const calculateTotalPrice = () => {
    return tableData.reduce(
      (acc, curr) =>
        acc +
        curr.amount * parseInt(curr.price.replace(/,/g, "").replace("원", "")),
      0
    );
  };
  const calculateTotalAmount = () => {
    return tableData.reduce((acc, curr) => acc + curr.amount, 0);
  };
  const handlePickupMethodClick = (method) => {
    setSelectedPickupMethod(method);
  };

  const handleCouponChange = (event) => {
    setSelectedCoupon(event.target.value);
  };

  const handleStampClick = (number) => {
    if (number <= 10) setStamps(number);
  };

  const calculateDiscount = () => {
    if (selectedCoupon === "10% 할인") {
      return calculateTotalPrice() * 0.1;
    } else if (selectedCoupon === "20% 할인") {
      return calculateTotalPrice() * 0.2;
    }
    return 0;
  };

  const [selectedMethod, setSelectedMethod] = useState("신용카드");

  const paymentMethods = ["신용카드", "계좌이체", "간편결제"];

  const handleMethodClick = (method) => {
    setSelectedMethod(method);
  };

  return (
    <div className={style.Container}>
      <div className={style.MainContent}>
        <h1 className={style.checkout_title}>결제하기</h1>
        <div className={style.checkout_menu_container}>
          <div className={style.checkout_items}>
            <h2 className={style.checkout_order_title}>
              주문내역
              <span className={style.checkout_order_title_span}>
                {tableData.length}
              </span>
              건
            </h2>
            <hr className={style.hr} />
            {tableData.map((row) => (
              <div key={row.id} className={style.checkout_item}>
                <div className={style.checkout_item_image}>
                  {row.category === "브라운슈가밀크티" ? (
                    <img
                      src="https://user-images.githubusercontent.com/65029974/296408085-b7efb704-587e-4311-b7e4-9a64699cb317.png"
                      alt=""
                    />
                  ) : (
                    <img
                      src="https://user-images.githubusercontent.com/65029974/296408080-6a54c8ae-5c63-487d-8b95-a94717f68b0b.png"
                      alt=""
                    />
                  )}
                </div>
                <div className={style.checkout_item_description}>
                  <div className={style.checkout_item_header}>
                    <span className={style.checkout_item_name}>
                      {row.category}
                    </span>
                  </div>
                  <div className={style.checkout_item_price}>{row.price}</div>

                  <div className={style.order_content_bottom}>
                    <div className={style.checkout_item_options}>
                      옵션 {row.options}
                    </div>
                    <div className={style.checkout_item_totalPrice}>
                      총 금액{" "}
                      <span className={style.checkout_item_totalPrice_money}>
                        {(
                          row.amount *
                          parseInt(
                            row.price.replace(/,/g, "").replace("원", "")
                          )
                        ).toLocaleString()}
                      </span>
                      원
                    </div>

                    {/* <div className={style.cart_item_options}>
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
                            </div> */}
                  </div>
                </div>
              </div>
            ))}

            <h3 className={style.branch}>주문 매장</h3>
            <div className={style.checkout_order_title}>
              <span className={style.store_button}>구로점</span>
              <button className={style.branch_change}>변경</button>
            </div>

            <div className={style.checkout_pickup}>
              <h2 className={style.checkout_choice}>픽업 방법</h2>
              <span className={style.checkout_message}>
                * 주문 완료 후 컵 변경이 불가합니다.
              </span>
            </div>
            <div className={style.pickup_method}>
              {pickupMethods.map((method) => (
                <button
                  key={method}
                  className={`${style.pickup_button} ${
                    selectedPickupMethod === method ? style.active : ""
                  }`}
                  onClick={() => handlePickupMethodClick(method)}
                >
                  {method}
                </button>
              ))}
            </div>

            <h2 className={style.checkout_coupon}>쿠폰 적용</h2>
            <div className={style.select_coupon}>
              <select onChange={handleCouponChange} value={selectedCoupon}>
                {coupons.map((coupon, index) => (
                  <option key={index} value={coupon}>
                    {coupon}
                  </option>
                ))}
              </select>
            </div>
            <div className={style.discount_price}>
              <div className={style}>
                <img
                  className={style.coupon_img}
                  src="/public/img/coupon.png"
                  alt="쿠폰이미지"
                />
                쿠폰 할인 금액
              </div>
              <span className={style.discount_price_money}>
                - {calculateDiscount().toLocaleString()}원
              </span>
            </div>

            <h2 className={style.checkout_stamp}>멤버쉽 적립</h2>

            <hr />
            <div className={style.payment_methods_container}>
              <div className={style.payment_methods_title}>결제수단</div>
              <div className={style.payment_methods}>
                {paymentMethods.map((method) => (
                  <button
                    key={method}
                    className={`${style.payment_method_button} ${
                      selectedMethod === method ? style.active : ""
                    }`}
                    onClick={() => handleMethodClick(method)}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div>
            <div className={style.checkout_summary}>
              <h3 className={style.order_summary_title}>총 주문금액</h3>
              <div className={style.order_summary_detail}>
                <span className={style.order_summary_item}>총 주문수량</span>
                <span className={style.order_summary_count}>
                  {calculateTotalAmount()}
                </span>
              </div>
              <div className={style.order_summary_detail}>
                <span className={style.order_summary_item}>총 주문금액</span>
                <span className={style.order_summary_price}>
                  {calculateTotalPrice().toLocaleString()}
                </span>
              </div>
              <div className={style.order_summary_detail}>
                <span className={style.order_summary_item}>할인 금액</span>
                <span className={style.order_summary_discount}>
                  {calculateDiscount().toLocaleString()}
                </span>
              </div>
              {selectedCoupon !== "사용 안 함" && ( // 쿠폰을 사용했을 경우에만 쿠폰할인 표시
                <div className={style.order_summary_detail}>
                  <span className={style.order_summary_item}>쿠폰할인</span>
                  <span className={style.order_summary_discount}>
                    - {calculateDiscount().toLocaleString()}
                  </span>
                </div>
              )}
              <div className={style.order_summary_line}></div> {/*구분선 추가*/}
              <div className={style.order_summary_detail}>
                <span className={style.order_summary_item}>결제금액</span>
                <span className={style.order_summary_finalPrice}>
                  {(
                    calculateTotalPrice() - calculateDiscount()
                  ).toLocaleString()}
                  원
                </span>
              </div>
            </div>
            <div className={style.payment}>
              <button className={style.payment_cancel_button}>취소</button>
              <button className={style.payment_button}>결제하기</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Order;
