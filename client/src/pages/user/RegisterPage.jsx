import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../../shared";

export const RegisterPage = () => {
  const [formData, setFormData] = useState({
    role: "",
    username: "",
    name: "",
    email: "",
    password: "",
    password2: "",
  });

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

    if (formData.password !== formData.password2) {
      alert("Пароли не совпадают");
      return Promise.resolve();
    }

    try {
      await apiFetch("/register", {
        method: "POST",
        body: JSON.stringify(formData),
        requireAuth: false,
      });

      navigate("/login");
    } catch (error) {
      console.error("Ошибка при отправке запроса:", error);
      alert("Ошибка: " + error.message);
    }
  };

  return (
    <div>
      <form onSubmit={onSubmitHandler}>
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          required
        >
          <option value="" disabled>
            выбери роль
          </option>
          <option value="admin">admin</option>
          <option value="qa">QA</option>
          <option value="user">user</option>
        </select>
        <input
          name="username"
          type="text"
          placeholder="username"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <input
          name="email"
          type="email"
          placeholder="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          name="name"
          type="text"
          placeholder="name"
          value={formData.name}
          onChange={handleChange}
        />
        <input
          name="password"
          type="password"
          placeholder="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <input
          name="password2"
          type="password"
          placeholder="repeat password"
          value={formData.password2}
          onChange={handleChange}
          required
        />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};
