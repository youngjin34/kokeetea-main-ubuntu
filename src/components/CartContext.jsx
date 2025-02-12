import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartCount, setCartCount] = useState(0);
  const token = localStorage.getItem("token");

  const fetchCartCount = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/carts", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      setCartCount(response.data.cart_count); // DB에서 가져온 개수 설정
    } catch (error) {
      console.error("장바구니 개수 불러오기 실패:", error);
      setCartCount(0); // 실패하면 0으로 초기화
    }
  };

  useEffect(() => {
    fetchCartCount(); // 처음 로드될 때 실행
  }, []);

  return (
    <CartContext.Provider value={{ cartCount, setCartCount, fetchCartCount }}>
      {children}
    </CartContext.Provider>
  );
}
