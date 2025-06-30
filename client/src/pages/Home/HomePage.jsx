import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useUser, apiFetch, Card, CardContainer } from "../../shared";
import { CreateVideoOrder } from "../VideoOrder/Form/CreateForm/CreateVideoOrder";
import "./HomePage.css";

export const HomePage = () => {
  const [concerts, setConcerts] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isVideoFormOpen, setIsVideoFormOpen] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        setLoading(true);

        const concertsResponse = await apiFetch("/concerts", {
          method: "GET",
          requireAuth: false,
        });

        const productsResponse = await apiFetch("/products", {
          method: "GET",
          requireAuth: false,
        });

        setConcerts(concertsResponse.data?.slice(0, 3) || []);
        setProducts(productsResponse.data?.slice(0, 4) || []);
      } catch (error) {
        console.error("Ошибка загрузки данных для главной:", error);
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, []);

  if (loading) {
    return <div className="loading">Загрузка...</div>;
  }

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">MILANA STAR SHOP</h1>
          <p className="hero-subtitle">
            Закажите персональное видео поздравление от вашего любимого артиста
          </p>
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-number">{concerts.length}+</span>
              <span className="stat-label">Концертов</span>
            </div>
            <div className="stat">
              <span className="stat-number">{products.length}+</span>
              <span className="stat-label">Товаров</span>
            </div>
            <div className="stat">
              <span className="stat-number">1000+</span>
              <span className="stat-label">Довольных клиентов</span>
            </div>
          </div>
          <button
            onClick={() => setIsVideoFormOpen(true)}
            className="cta-button"
          >
            ЗАКАЗАТЬ ВИДЕО ПОЗДРАВЛЕНИЕ
          </button>
        </div>
      </section>

      {/* Ближайшие концерты */}
      {concerts.length > 0 && (
        <section className="upcoming-concerts">
          <div className="section-header">
            <h2>БЛИЖАЙШИЕ КОНЦЕРТЫ</h2>
            <Link to="/concert" className="view-all-link">
              Все концерты →
            </Link>
          </div>

          <CardContainer>
            {concerts.map((concert) => (
              <Card key={concert.id} className="concert-card">
                <div className="concert-date">
                  {new Date(concert.date).toLocaleDateString("ru-RU", {
                    day: "numeric",
                    month: "short",
                  })}
                </div>
                <h3 className="concert-title">{concert.title}</h3>
                <p className="concert-city">📍 {concert.city_name}</p>
                <p className="concert-time">
                  🕐{" "}
                  {new Date(`1970-01-01T${concert.time}`).toLocaleTimeString(
                    [],
                    {
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )}
                </p>
              </Card>
            ))}
          </CardContainer>
        </section>
      )}

      {/* Популярные товары */}
      {products.length > 0 && (
        <section className="popular-products">
          <div className="section-header">
            <h2>ПОПУЛЯРНЫЕ ТОВАРЫ</h2>
            <Link to="/product" className="view-all-link">
              Все товары →
            </Link>
          </div>

          <CardContainer>
            {products.map((product) => (
              <Card key={product.id} className="product-card">
                {product.img && (
                  <img
                    src={`http://127.0.0.1:8000${product.img}`}
                    alt={product.title}
                    className="product-image"
                  />
                )}
                <h3 className="product-title">{product.title}</h3>
                <p className="product-price">💰 {product.price} ₽</p>
                <span className={`product-type ${product.type}`}>
                  {product.type === "dress" ? "👗 Платье" : "🎓 Школа"}
                </span>
              </Card>
            ))}
          </CardContainer>
        </section>
      )}

      {/* Видео поздравления */}
      <section className="video-section">
        <div className="video-content">
          <h2>ПЕРСОНАЛЬНЫЕ ВИДЕО ПОЗДРАВЛЕНИЯ</h2>
          <p className="video-description">
            Сделайте особенный подарок для близких! Закажите персональное видео
            поздравление с днем рождения, юбилеем или любым другим праздником.
          </p>

          <div className="video-features">
            <div className="feature">
              <span className="feature-icon">🎥</span>
              <span>Индивидуальный подход</span>
            </div>
            <div className="feature">
              <span className="feature-icon">⚡</span>
              <span>Быстрое выполнение</span>
            </div>
            <div className="feature">
              <span className="feature-icon">💎</span>
              <span>Высокое качество</span>
            </div>
          </div>

          <div className="video-price">
            <span className="price-label">Стоимость:</span>
            <span className="price-value">20 000 ₽</span>
          </div>

          <button
            onClick={() => setIsVideoFormOpen(true)}
            className="cta-button"
          >
            {user ? "ЗАКАЗАТЬ СЕЙЧАС" : "ЗАКАЗАТЬ ВИДЕО"}
          </button>
        </div>
      </section>

      {/* О проекте */}
      <section className="about-section">
        <h2>О Milana Star</h2>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor in
          quidem maiores deserunt vero cum odio exercitationem rem error
          delectus beatae laboriosam sed laudantium, omnis vel eveniet
          reiciendis distinctio temporibus.
        </p>

        <div className="about-features">
          <div className="about-feature">
            <h3>🎤 Концерты</h3>
            <p>География выступлений по всей стране</p>
          </div>
          <div className="about-feature">
            <h3>🛍️ Магазин</h3>
            <p>Эксклюзивные товары</p>
          </div>
          <div className="about-feature">
            <h3>📹 Видео</h3>
            <p>Персональные поздравления для особых моментов</p>
          </div>
        </div>
      </section>

      <CreateVideoOrder
        isOpen={isVideoFormOpen}
        onClose={() => setIsVideoFormOpen(false)}
        showButton={false}
      />
    </div>
  );
};
