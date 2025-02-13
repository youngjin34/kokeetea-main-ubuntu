import React, { useState, useEffect, useRef, useContext } from "react";
import style from "./MyMenu.module.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { CartContext } from "../components/CartContext";

const token = localStorage.getItem("token");

const MyMenu = () => {
  // 페이지 들어왔들 때 제일 위로 이동하게 하는 코드
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [myMenuItems, setMyMenuItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [quantity, setQuantity] = useState(1);

  const [cartItems, setCartItems] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [branches, setBranches] = useState([]); // 브랜치 데이터를 상태로 저장
  const [selectedBranchId, setSelectedBranchId] = useState(1); // 선택된 브랜치 ID 상태

  const [previousBranchId, setPreviousBranchId] = useState(selectedBranchId);

  // 드롭다운에서 브랜치 선택 시 처리
  const handleBranchChange = (event) => {
    setPreviousBranchId(selectedBranchId); // 현재 선택된 브랜치를 이전 브랜치로 저장
    setSelectedBranchId(event.target.value); // 새 브랜치로 변경
  };

  const navigate = useNavigate();

  const { fetchCartCount } = useContext(CartContext);

  useEffect(() => {
    const fetchBranchDate = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/branches");
        setBranches(response.data); // 받아온 데이터로 상태 설정
      } catch (error) {
        console.error(error);
      }
    };

    fetchBranchDate();
  }, []);

  const fetchMyMenuData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8080/api/members/personal-products`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response.data);

      const items = response.data || [];
      setMyMenuItems(items);

      if (items.length === 0) {
        setError(""); // 404가 아닌 정상 응답일 때는 에러 메시지 X
      }
    } catch (error) {
      console.error("나만의 메뉴 데이터 로드 실패:", error);

      // 404 에러일 경우 빈 배열로 처리해서 오류 방지
      if (error.response && error.response.status === 404) {
        setMyMenuItems([]);
        setError(""); // 404일 때는 오류 메시지를 보여주지 않음
      } else {
        setError("나만의 메뉴 데이터를 불러오는 데 실패했습니다.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyMenuData();
  }, []);

  // 장바구니 아이템 삭제

  const onDeleteMyMenu = async (id) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) {
      return; // 취소하면 삭제하지 않음
    }

    try {
      await axios.delete(
        `http://localhost:8080/api/members/personal-products/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await fetchCartCount();
      window.location.reload();
    } catch (error) {
      console.error("상품 삭제 실패:", error);
      alert("상품 삭제에 실패했습니다.");
    }
  };

  // addToCart 함수 수정
  const addToCart = async () => {
    const token = localStorage.getItem("token");

    if (token) {
      // 브랜치가 변경되었을 때만 확인 다이얼로그를 띄우고 장바구니를 비운다
      if (selectedBranchId !== previousBranchId) {
        const isConfirmed = window.confirm(
          "지점을 변경하면 장바구니가 비워집니다. 계속 하시겠습니까?"
        );
        if (!isConfirmed) {
          return;
        } else {
          setCartItems([]); // 장바구니 비우기
        }
      }

      try {
        const response = await axios.post(
          "http://localhost:8080/api/carts",
          {
            product_id: selectedProduct.id,
            quantity: quantity,
            option_ids: [tempId, sizeId, sugarId, iceAmountId, ...toppingId],
            branch_id: selectedBranchId,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          alert("장바구니에 추가되었습니다.");
          toggleModal();
          fetchCartCount(); // 장바구니 개수 즉시 업데이트

          // 장바구니에 아이템을 추가한 후, 이전 브랜치와 현재 브랜치가 같도록 설정
          setPreviousBranchId(selectedBranchId);
        } else {
          alert("장바구니 추가에 실패했습니다.");
        }
      } catch (error) {
        console.error("장바구니 추가 실패:", error);
        alert("장바구니 추가에 실패했습니다.");
      }
    }
  };

  // 바로 주문
  const handleDirectOrder = async (item) => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("로그인이 필요한 서비스입니다.");
      return;
    }
    const optionId = item.options.map((option) => option.id);
    console.log(item.id);

    if (token) {
      try {
        const response = await axios.post(
          "http://localhost:8080/api/carts",
          {
            product_id: item.id,
            quantity: quantity,
            option_ids: optionId,
            branch_id: selectedBranchId,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } catch (error) {
        console.error("주문 실패:", error);
        alert("주문에 실패했습니다.");
      }
    }

    navigate("/order");
  };

  if (loading) return <div>로딩중...</div>;
  if (error) return <div>에러: {error}</div>;

  return (
    <div className={style.Container}>
      <div className={style.MainContent}>
        <h1 className={style.my_menu_title}>나만의 메뉴</h1>

        {/* 브랜치 드롭다운 */}
        <div className={style.branchSelectWrapper}>
          <select
            id="branchSelect"
            value={selectedBranchId}
            onChange={handleBranchChange}
            className={style.branchSelect} // 추가된 스타일 적용
          >
            {branches.map((branch) => (
              <option key={branch.id} value={branch.id}>
                {branch.name}
              </option>
            ))}
          </select>
        </div>

        <div className={style.my_menu_container}>
          <div className={style.my_menu_items}>
            {myMenuItems.length === 0 ? (
              <div className={style.empty_my_menu}>
                <h2>나만의 메뉴가 없습니다</h2>
                <p>본인 취향에 맞는 음료를 추가해보세요</p>
                <button
                  className={style.go_to_menu_button}
                  onClick={() => navigate("/menupage")}
                >
                  메뉴 보러가기
                </button>
              </div>
            ) : (
              <>
                <div className={style.my_menu_items_scrollable}>
                  {myMenuItems.map((item) => (
                    <div key={item.id} className={style.cart_item}>
                      <div className={style.my_menu_item_image}>
                        <img src={item.product.image_url} alt={item.name} />
                      </div>
                      <div className={style.my_menu_item_details}>
                        <div className={style.my_menu_item_header}>
                          <h3 className={style.my_menu_item_name}>
                            {item.name}
                          </h3>
                        </div>
                        <div className={style.my_menu_item_options}>
                          <h4 className={style.product_name}>
                            {item.product.name}
                          </h4>
                          <p>온도: {item.options[0].name}</p>
                          <p>사이즈: {item.options[1].name}</p>
                          <p>당도: {item.options[2].name}</p>
                          {item.options[3] && (
                            <p>얼음량: {item.options[3]?.name}</p>
                          )}
                          <div>
                            <span>토핑: </span>
                            {item.options
                              .filter((option) => option.group === "topping")
                              .map((topping, index) => (
                                <span key={index}>
                                  {topping.name}
                                  {index !==
                                  item.options.filter(
                                    (o) => o.group === "topping"
                                  ).length -
                                    1
                                    ? ", "
                                    : ""}
                                </span>
                              ))}
                          </div>
                        </div>
                        <div className={style.my_menu_item_bottom}>
                          <div className={style.my_menu_item_count}>
                            <button
                              className={style.minus_button}
                              onClick={() =>
                                setQuantity(Math.max(quantity - 1, 1))
                              } // 1 이하로 못 내려감
                            >
                              -
                            </button>
                            <span className={style.amount_input}>
                              {quantity}
                            </span>
                            <button
                              className={style.plus_button}
                              onClick={() => setQuantity(quantity + 1)}
                            >
                              +
                            </button>
                          </div>
                          <div className={style.my_menu_item_price}>
                            {item.price}원
                          </div>
                        </div>
                        <div className={style.button_group}>
                          <button
                            className={`${style.my_menu_button} ${style.delete_button}`}
                            onClick={() => {
                              onDeleteMyMenu(item.id);
                            }}
                          >
                            삭제
                          </button>
                          <button
                            className={`${style.my_menu_button} ${style.cart_button}`}
                            onClick={addToCart}
                          >
                            담기
                          </button>
                          <button
                            className={`${style.my_menu_button} ${style.order_button}`}
                            onClick={() => {
                              handleDirectOrder(item);
                            }}
                          >
                            바로주문
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyMenu;
