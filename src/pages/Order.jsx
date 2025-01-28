import React, { useEffect, useState } from "react";
import style from "./Order.module.css"; // Import the CSS module
import { useNavigate } from "react-router-dom";

function Order() {
  // 페이지 들어왔들 때 제일 위로 이동하게 하는 코드
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const navigate = useNavigate();
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

  // 하드코딩된 데이터 대신 상태 추가
  const [cartItems, setCartItems] = useState([]);
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [membershipInfo, setMembershipInfo] = useState({
    stamps: 0,
    level: ''
  });

  // 데이터 페치 추가
  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        // 장바구니 데이터 가져오기
        const cartResponse = await fetch('http://localhost:8080/kokee/carts', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const cartData = await cartResponse.json();
        setCartItems(cartData);

        // 사용 가능한 쿠폰 가져오기
        const couponsResponse = await fetch('http://localhost:8080/kokee/coupons', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const couponsData = await couponsResponse.json();
        setAvailableCoupons(['적용할 쿠폰을 선택하세요', ...couponsData]);

        // 멤버십 정보 가져오기
        const membershipResponse = await fetch('http://localhost:8080/kokee/membership', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const membershipData = await membershipResponse.json();
        setMembershipInfo(membershipData);
      } catch (error) {
        console.error('데이터 로딩 중 오류 발생:', error);
      }
    };

    fetchOrderData();
  }, []);

  // 기존의 하드코딩된 데이터 제거
  // const tableData = [...] 삭제
  // const coupons = [...] 삭제

  // calculateTotalPrice 수정
  const calculateTotalPrice = () => {
    return cartItems.reduce(
      (acc, curr) =>
        acc +
        curr.amount * parseInt(curr.price.replace(/,/g, "").replace("원", "")),
      0
    );
  };

  // calculateTotalAmount 수정
  const calculateTotalAmount = () => {
    return cartItems.reduce((acc, curr) => acc + curr.amount, 0);
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

  const handlePayment = () => {
    navigate("/ordercomplete");
  };

  const handleCancel = () => {
    navigate("/cart");
  };

  // 상태 추가
  const [isStoreModalOpen, setIsStoreModalOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState("구로점");

  // Store.jsx의 stores 데이터 가져오기
  const stores = [
    {
      id: 1,
      name: "구로점",
      address: "서울시 구로구 디지털로 300, 11층 (구로동, 지밸리비즈플라자)",
      phone: "02-2345-6789",
    },
    {
      id: 2,
      name: "인천점",
      address: "인천광역시 부평구 경원대로 1373, 2층(북인천우체국)",
      phone: "032-567-8901",
    },
    {
      id: 3,
      name: "판교점",
      address: "경기도 성남시 수정구 창업로 54 (시흥동, 판교제2테크노밸리기업성장센터) 2층",
      phone: "031-789-0123",
    },
    {
      id: 4,
      name: "천안아산점",
      address: "충청남도 아산시 배방읍 희망로46번길 45-17 위너스빌딩 4층",
      phone: "041-234-5678",
    },
    {
      id: 5,
      name: "광주점",
      address: "광주광역시 서구 천변좌로 268 19층",
      phone: "062-345-6789",
    },
    {
      id: 6,
      name: "대구점",
      address: "대구광역시 달서구 장산남로 11(용산동 230-9)",
      phone: "053-456-7890",
    },
    {
      id: 7,
      name: "부산점",
      address: "부산광역시 연제구 중앙대로 1000, 14층, 16층",
      phone: "051-567-8901",
    },
  ];

  // 지점 변경 모달 열기/닫기 함수
  const toggleStoreModal = () => {
    setIsStoreModalOpen(!isStoreModalOpen);
  };

  // 지점 선택 함수
  const handleStoreSelect = (storeName) => {
    setSelectedStore(storeName);
    setIsStoreModalOpen(false);
  };

  const OrderMethods = () => {
    return (
      <div className={style.order_methods}>
        {/* 주문 매장 섹션 */}
        <div>
          <h3 className={style.branch}>주문 매장</h3>
          <div className={style.checkout_store_title}>
            <span className={style.store_button}>{selectedStore}</span>
            <button className={style.branch_change} onClick={toggleStoreModal}>
              변경
            </button>
          </div>
        </div>

        {/* 지점 선택 모달 */}
        {isStoreModalOpen && (
          <div className={style.store_modal_overlay}>
            <div className={style.store_modal}>
              <h3>매장 선택</h3>
              <div className={style.store_list}>
                {stores.map((store) => (
                  <div
                    key={store.id}
                    className={`${style.store_item} ${
                      selectedStore === store.name ? style.selected : ""
                    }`}
                    onClick={() => handleStoreSelect(store.name)}
                  >
                    <div className={style.store_name}>{store.name}</div>
                    <div className={style.store_address}>{store.address}</div>
                  </div>
                ))}
              </div>
              <button className={style.close_button} onClick={toggleStoreModal}>
                닫기
              </button>
            </div>
          </div>
        )}

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
              {availableCoupons.map((coupon, index) => (
                <option key={index} value={coupon}>
                  {coupon}
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
            <span className={style.discount_price_money}>
              - {calculateDiscount().toLocaleString()}원
            </span>
          </div>
        </div>

        {/* 멤버십 적립 섹션 */}
        <div>
          <h2 className={style.checkout_stamp}>멤버쉽 적립</h2>
          <div className={style.stampGrid}>
            {Array(10)
              .fill(null)
              .map((_, index) => (
                <div
                  key={index}
                  className={`${style.stamp} ${
                    index < membershipInfo.stamps ? style.active : ""
                  }`}
                >
                  <img 
                    src="/public/img/coupon.png" 
                    alt={index < membershipInfo.stamps ? "Active stamp" : "Inactive stamp"} 
                  />
                </div>
              ))}
          </div>
          <div className={style.stampNote}>
            * 스탬프 10개 적립시 등급별 무료 쿠폰 증정 주문 제품 증정
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
              주문내역
              <span className={style.checkout_order_title_span}>
                {cartItems.length}
              </span>
              건
            </h2>
            <hr className={style.hr} />
            {cartItems.map((row) => (
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
            <OrderMethods />
            <hr />
          </div>
          <div>
            <div className={style.checkout_summary}>
              <h3 className={style.order_summary_title}>총 주문금액</h3>
              <div className={style.order_summary_detail}>
                <span className={style.order_summary_item}>총 주문수량</span>
                <span className={style.order_summary_count}>
                  {calculateTotalAmount()}개
                </span>
              </div>
              <div className={style.order_summary_detail}>
                <span className={style.order_summary_item}>총 주문금액</span>
                <span className={style.order_summary_price}>
                  {calculateTotalPrice().toLocaleString()}원
                </span>
              </div>
              <div className={style.order_summary_detail}>
                <span className={style.order_summary_item}>할인 금액</span>
                <span className={style.order_summary_discount}>
                  {calculateDiscount().toLocaleString()}원
                </span>
              </div>
              {selectedCoupon !== "사용 안 함" && ( // 쿠폰을 사용했을 경우에만 쿠폰할인 표시
                <div className={style.order_summary_detail}>
                  <span className={style.order_summary_item}>쿠폰할인</span>
                  <span className={style.order_summary_discount}>
                    - {calculateDiscount().toLocaleString()}원
                  </span>
                </div>
              )}
                <div className={style.order_summary_line}></div> {/*구분선 추가*/}
              <div className={style.order_summary_detail}>
                <span className={style.order_summary_item}>최종 결제금액</span>

                <span className={style.order_summary_finalPrice}>
                  {(calculateTotalPrice() - calculateDiscount()).toLocaleString()}원
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