import React, { useEffect, useState } from "react";
import style from "./Order.module.css"; // Import the CSS module
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Order() {
  const navigate = useNavigate();
  const [selectedPickupMethod, setSelectedPickupMethod] =
    useState("매장(다회용컵)");
  const [selectedCoupon, setSelectedCoupon] = useState("");
  const pickupMethods = [
    "매장(다회용컵)",
    "테이크아웃(일회용컵)",
    "테이크아웃(텀블러)",
  ];

  const [cartItems, setCartItems] = useState([]);
  const [availableCoupons, setAvailableCoupons] = useState(["5000"]);
  const [membershipInfo, setMembershipInfo] = useState({
    stamps: 0,
    level: "",
  });

  const [totalPrice, setTotalPrice] = useState(0);

  // 상태 추가
  const [points, setPoints] = useState(0);
  const [usePoints, setUsePoints] = useState(0);

  //  브랜치
  const [branchName, setBranchName] = useState(0);

  // 데이터 페치 추가
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("로그인이 필요합니다");
        }

        // 장바구니 데이터 가져오기
        const cartResponse = await axios.get(
          `http://localhost:8080/api/carts`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setCartItems(cartResponse.data.items);
        setBranchName(cartResponse.data.branch_name);
        setTotalPrice(cartResponse.data.total_price);

        localStorage.setItem("totalPrice", cartResponse.data.total_price);

        if (!cartResponse) {
          throw new Error("장바구니 데이터 로딩 실패");
        }

        // 사용 가능한 쿠폰 가져오기
        const couponsResponse = await axios.get(
          `http://localhost:8080/api/members/about/coupon`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log(couponsResponse.data);

        setAvailableCoupons([...couponsResponse.data.coupons]);

        // 멤버십 정보 가져오기
        const membershipResponse = await axios.get(
          `http://localhost:8080/api/members/about/membership`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setMembershipInfo(membershipResponse.data);

        // 적립금 정보 가져오기
        const memberResponse = await axios.get(
          `http://localhost:8080/api/members/current-point`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        setPoints(memberResponse.data.current_point || 0);
      } catch (error) {
        console.error("데이터 로딩 실패:", error);
        alert("데이터 로딩에 실패했습니다.");
        // 에러 발생 시 기본값 설정
        setCartItems([]);

        setMembershipInfo({ stamps: 0, level: "BASIC" });
        setPoints(0);
      }
    };

    fetchData();
  }, []);

  // calculateTotalAmount 수정
  const calculateTotalAmount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  // calculateTotalPrice 수정
  const calculateTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price, 0);
  };

  const handlePickupMethodClick = (method) => {
    setSelectedPickupMethod(method);
  };

  const handleCouponChange = (event) => {
    setSelectedCoupon(event.target.value);
  };

  const calculateDiscount = (couponId) => {
    return usePoints;
  };

  const [selectedMethod, setSelectedMethod] = useState("신용카드");

  const paymentMethods = ["신용카드", "계좌이체", "간편결제"];

  // 결제 방식 매핑
  const methodMapping = {
    신용카드: "CREDIT_CARD",
    계좌이체: "ACCOUNT_TRANSFER",
    간편결제: "SIMPLE_PAY",
  };

  const handleMethodClick = (method) => {
    setSelectedMethod(method);
  };

  const handlePayment = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("로그인이 필요합니다.");
        return;
      }

      // 주문 데이터 전송
      const response = await axios.post(
        `http://localhost:8080/api/orders`,
        {
          payment_method: methodMapping[selectedMethod],
          point: usePoints,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response.data);

      localStorage.setItem("orderId", response.data.id);
      localStorage.setItem("branchName", response.data.branch_name);

      const finalPrice = totalPrice - calculateDiscount();

      localStorage.setItem("finalPrice", finalPrice);
      alert("주문이 완료되었습니다.");
      navigate("/ordercomplete"); // 주문 완료 후 이동할 페이지
      window.location.reload();
    } catch (error) {
      console.error("주문 처리 실패:", error);
      alert("주문 처리에 실패했습니다.");
    }
  };

  const handleCancel = () => {
    navigate("/cart");
  };

  // 적립금 입력 핸들러
  const handlePointsChange = (e) => {
    const value = parseInt(e.target.value) || 0;
    const totalPrice = calculateTotalPrice();

    if (value > points) {
      alert("보유 적립금을 초과할 수 없습니다.");
      setUsePoints(points);
    } else if (value > totalPrice) {
      alert("결제 금액을 초과할 수 없습니다.");
      setUsePoints(totalPrice);
    } else {
      setUsePoints(value);
    }
  };

  // 적립금 전액 사용 핸들러
  const handleUseAllPoints = () => {
    const totalPrice = calculateTotalPrice();
    if (points >= totalPrice) {
      setUsePoints(totalPrice);
    } else {
      setUsePoints(points);
    }
  };

  const OrderMethods = () => {
    return (
      <div className={style.order_methods}>
        {/* 주문 매장 섹션 */}
        <div>
          <h3 className={style.branch}>주문 매장</h3>
          <div className={style.checkout_store_title}>
            <span className={style.store_button}>{branchName}</span>
          </div>
        </div>

        {/* 픽업 방법 섹션 */}
        <div>
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
        </div>

        {/* 쿠폰 적용 섹션 */}
        <div>
          <h2 className={style.checkout_coupon}>쿠폰 적용</h2>
          <div className={style.select_coupon}>
            <select onChange={handleCouponChange} value={selectedCoupon}>
              <option value="">적용할 쿠폰을 선택하세요</option>
              {availableCoupons.map((coupon, index) => (
                <option key={index} value={coupon}>
                  {coupon.product_name}
                </option>
              ))}
            </select>
          </div>
          <div className={style.discount_price}>
            <div className={style.coupon}>
              <img
                src="https://cdn-icons-png.flaticon.com/512/879/879757.png"
                alt="쿠폰 아이콘"
                className={style.coupon_img}
              />
              <span>쿠폰 할인 금액</span>
            </div>
            {/* <span className={style.discount_price_money}>
              {availableCoupons[0]} 원
            </span> */}
          </div>
        </div>

        {/* 적립금 섹션 */}
        <div className={style.points_section}>
          <h3 className={style.section_title}>적립금</h3>
          <div className={style.points_container}>
            <div className={style.points_info}>
              <span>보유 적립금</span>
              <span className={style.available_points}>{points} P</span>
            </div>
            <div className={style.points_input_wrapper}>
              <input
                type="number"
                value={usePoints}
                onChange={handlePointsChange}
                min="0"
                max={points}
                className={style.points_input}
              />
              <span className={style.points_unit}>P</span>
              <button
                onClick={handleUseAllPoints}
                className={style.use_all_points_btn}
              >
                전액사용
              </button>
            </div>
          </div>
        </div>

        {/* 결제수단 섹션 */}
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
    );
  };

  return (
    <div className={style.Container}>
      <div className={style.MainContent}>
        <h1 className={style.title}>결제하기</h1>
        <div className={style.checkout_menu_container}>
          <div className={style.checkout_items}>
            <h2 className={style.checkout_order_title}>
              주문 내역
              <span className={style.checkout_order_title_span}>
                {cartItems.length}개
              </span>
            </h2>
            <div className={style.order_items}>
              {cartItems.map((item) => (
                <div key={item.cart_id} className={style.order_item}>
                  <div className={style.order_item_image}>
                    <img src={item.image_url} alt={item.name} />
                  </div>
                  <div className={style.order_item_details}>
                    <h3 className={style.order_item_name}>{item.name}</h3>
                    <div className={style.order_item_options}>
                      <p>온도: {item.options[0].name}</p>
                      <p>사이즈: {item.options[1].name}</p>
                      <p>당도: {item.options[2].name}</p>
                      {item.options[3] && (
                        <p>얼음량: {item.options[3]?.name}</p>
                      )}
                      <div>
                        <span>토핑: </span>
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
                    <div className={style.order_item_price_info}>
                      <span className={style.order_item_quantity}>
                        {item.quantity}개
                      </span>
                      <span className={style.order_item_price}>
                        {item.price * item.quantity}원
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <OrderMethods />
            <hr />
          </div>

          <div>
            <div className={style.checkout_summary}>
              <h3 className={style.order_summary_title}>총 주문금액</h3>
              <div className={style.order_summary_detail}>
                <span className={style.order_summary_item}>총 주문수량</span>
                <span className={style.order_summary_count}>
                  {calculateTotalAmount()} 개
                </span>
              </div>
              <div className={style.order_summary_detail}>
                <span className={style.order_summary_item}>총 주문금액</span>
                <span className={style.order_summary_price}>
                  {calculateTotalPrice().toLocaleString()} 원
                </span>
              </div>
              {selectedCoupon !== "사용 안 함" && ( // 쿠폰을 사용했을 경우에만 쿠폰할인 표시
                <div className={style.order_summary_detail}>
                  <span className={style.order_summary_item}>쿠폰 할인</span>
                  <span className={style.order_summary_discount}>원</span>
                </div>
              )}
              <div className={style.order_summary_detail}>
                <span className={style.order_summary_item}>적립금 할인</span>
                <span className={style.order_summary_discount}>
                  {usePoints} 원
                </span>
              </div>
              <div className={style.order_summary_detail}>
                <span className={style.order_summary_item}>총 할인 금액</span>
                <span className={style.order_summary_discount}>
                  {calculateDiscount().toLocaleString()} 원
                </span>
              </div>
              <div className={style.order_summary_line}></div> {/*구분선 추가*/}
              <div className={style.order_summary_detail}>
                <span className={style.order_summary_item}>최종 결제금액</span>

                <span className={style.order_summary_finalPrice}>
                  {(
                    calculateTotalPrice() - calculateDiscount()
                  ).toLocaleString()}
                  원
                </span>
              </div>
              <div className={style.payment}>
                <button
                  className={style.payment_cancel_button}
                  onClick={handleCancel}
                >
                  취소
                </button>
                <button
                  className={`${style.payment_button} ${style.primary_button}`}
                  onClick={handlePayment}
                >
                  결제하기
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Order;
