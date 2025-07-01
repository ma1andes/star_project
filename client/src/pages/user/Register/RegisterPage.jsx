import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../../../shared";
import "./RegisterPage.css"; // Импорт стилей

export const RegisterPage = () => {
  const [formData, setFormData] = useState({
    role: "",
    username: "",
    name: "",
    email: "",
    password: "",
    password2: "",
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.password2) {
      setError("Пароли не совпадают");
      return;
    }

    try {
      setIsLoading(true);
      await apiFetch("/register", {
        method: "POST",
        body: JSON.stringify(formData),
        requireAuth: false,
      });

      navigate("/login");
    } catch (error) {
      console.error("Ошибка при отправке запроса:", error);
      setError(error.message || "Ошибка регистрации");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <div className="register-header">
          <h2>Присоединяйтесь!</h2>
          <p>Создайте свой аккаунт</p>
        </div>
        
        {isLoading ? (
          <div className="loader">💖</div>
        ) : (
          <form onSubmit={onSubmitHandler} className="register-form">
            {error && <p className="error-message">{error}</p>}
            
            <div className="form-group">
              <label htmlFor="role">Роль</label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
                className="form-select"
              >
                <option value="" disabled>Выберите роль</option>
                <option value="admin">Admin</option>
                <option value="qa">QA</option>
                <option value="user">User</option>
              </select>
              <span className="input-icon">👑</span>
            </div>
            
            <div className="form-group">
              <label htmlFor="username">Имя пользователя</label>
              <input
                id="username"
                name="username"
                type="text"
                placeholder="username"
                value={formData.username}
                onChange={handleChange}
                required
              />
              <span className="input-icon">👤</span>
            </div>
            
            <div className="form-group">
              <label htmlFor="name">Полное имя</label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Ваше имя"
                value={formData.name}
                onChange={handleChange}
              />
              <span className="input-icon">🌸</span>
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <span className="input-icon">✉️</span>
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Пароль</label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <span className="input-icon">🔒</span>
            </div>
            
            <div className="form-group">
              <label htmlFor="password2">Повторите пароль</label>
              <input
                id="password2"
                name="password2"
                type="password"
                placeholder="••••••••"
                value={formData.password2}
                onChange={handleChange}
                required
              />
              <span className="input-icon">🔒</span>
            </div>
            
            <button type="submit" className="register-button">
              Зарегистрироваться <span>✨</span>
            </button>
            
            <div className="register-footer">
              <p>Уже есть аккаунт? <a href="/login">Войти</a></p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};