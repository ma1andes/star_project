import React, { useState, useEffect } from "react";
import { apiFetch } from "../../shared";
import { Card, CardContainer } from "../../shared";
import './CartPage.css'

export const CartPage = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingIds, setDeletingIds] = useState(new Set()); // Для множественного удаления

  const fetchCart = async () => {
    try {
      const res = await apiFetch("/cart", {
        method: "GET",
        requireAuth: true,
      });
      setCart(res.data || []);
      setError(null);
    } catch (error) {
      console.error("Error fetching cart:", error);
      setError("Не удалось загрузить корзину");
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async (id) => {
    setDeletingIds(prev => new Set(prev).add(id));
    setError(null);
    
    try {
      const response = await apiFetch(`/cart_item/${id}`, {
        method: "DELETE",
        requireAuth: true
      });

      console.log("Delete response:", response);

      const isSuccess = (
        response.status === 204 || 
        response.status === 200 || 
        (response.ok && response.data?.success) || 
        response.data === null || 
        response.success
      );

      if (!isSuccess) {
        throw new Error(response.data?.message || "Не удалось удалить товар");
      }

      setCart(prev => prev.filter(item => item.id !== id));
      
    } catch (error) {
      console.error("Delete failed:", error);
      setError(error.message || "Ошибка при удалении товара");
      fetchCart(); 
    } finally {
      setDeletingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  if (loading && cart.length === 0) {
    return <div className="loading-message">Загрузка корзины...</div>;
  }

  return (
    <div className="cart-page">
      <h1>КОРЗИНА</h1>
      
      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}

      <CardContainer>
        {cart.length === 0 ? (
          <div className="empty-cart">
            {loading ? 'Загрузка...' : 'Корзина пуста'}
          </div>
        ) : (
          cart.map(item => (
            <Card key={item.id}>
              <img
                src={`http://127.0.0.1:8000/media/${item.img}`}
                alt={item.title}
              />
              <h2>{item.title}</h2>
              <p>Цена: {item.price} ₽</p>
              <p>Тип: {item.type}</p>
              <button
                onClick={() => deleteItem(item.id)}
                disabled={deletingIds.has(item.id)}
                className={deletingIds.has(item.id) ? 'deleting' : ''}
              >
                {deletingIds.has(item.id) ? 'Удаление...' : 'Удалить'}
              </button>
            </Card>
          ))
        )}
      </CardContainer>
    </div>
  );
};
