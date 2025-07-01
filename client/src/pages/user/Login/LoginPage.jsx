import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser, apiFetch } from "../../../shared";
import "./LoginPage.css"; // Импорт стилей

export const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const { fetchUser } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setIsLoading(true);
      const data = await apiFetch("/login", {
        method: "POST",
        body: JSON.stringify(formData),
        requireAuth: false,
      });

      localStorage.setItem("auth_token", data.data.auth_token);
      await fetchUser();
      navigate("/product");
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Ошибка входа");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <h2>Добро пожаловать!</h2>
          <p>Войдите в свой аккаунт</p>
        </div>
        
        {isLoading ? (
          <div className="loader">💖</div>
        ) : (
          <form onSubmit={onSubmitHandler} className="login-form">
            {error && <p className="error-message">{error}</p>}
            
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={(el) =>
                  setFormData({ ...formData, email: el.target.value })
                }
                required
              />
              <span className="input-icon">✉️</span>
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Пароль</label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(el) =>
                  setFormData({ ...formData, password: el.target.value })
                }
                required
              />
              <span className="input-icon">🔒</span>
            </div>
            
            <button type="submit" className="login-button">
              Войти <span>🌸</span>
            </button>
            
            <div className="login-footer">
              <p>Ещё нет аккаунта? <a href="/register">Зарегистрироваться</a></p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};