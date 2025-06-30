import React, { useState, useEffect } from "react";
import { apiFetch } from "../../shared";
import { Card, CardContainer } from "../../shared";

export const CartPage = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCart = async () => {
    try {
      const res = await apiFetch("/cart", {
        method: "GET",
        requireAuth: true,
      });
      setCart(res.data);
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);



  return (
    <div>
      <h1>КОРЗИНА</h1>
      <CardContainer>
        {cart.length === 0 ? (
          <div style={{ 
            gridColumn: '1 / -1', 
            textAlign: 'center', 
            padding: '40px', 
            color: '#718096' 
          }}>
            Корзина пуста
          </div>
        ) : (
          cart.map((item) => (
            <Card key={item.id}>
              <img
                src={`http://127.0.0.1:8000/media/${item.img}`}
              />
              <h2>{item.title}</h2>
              <p>{item.price}</p>
              <p>{item.type}</p>
            </Card>
          ))
        )}
      </CardContainer>
    </div>
  );
};

