import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../utils/UserContext";

export const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const { fetchUser } = useUser();
  const navigate = useNavigate();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setError("");
    
    try {
      
      const response = await fetch("http://127.0.0.1:8000/api/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      console.log("Login response:", data);
      
      if (response.status === 200) {
        localStorage.setItem("auth_token", data.data.auth_token);
        localStorage.setItem("isAdmin", data.data.isAdmin);
        localStorage.setItem("role", data.data.role);
        
        console.log("Stored in localStorage:", {
          auth_token: data.data.auth_token,
          isAdmin: data.data.isAdmin,
          role: data.data.role
        });
        
        await fetchUser();
        navigate("/product");
      } else {
        setError(data.errors?.details || "Ошибка входа");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Ошибка подключения к серверу");
    }
  };

  return (
    <div>
      <form onSubmit={onSubmitHandler}>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <input
          type="email"
          placeholder="email"
          value={formData.email}
          onChange={(el) => setFormData({ ...formData, email: el.target.value })}
          required
        />
        <input
          type="password"
          placeholder="password"
          value={formData.password}
          onChange={(el) => setFormData({ ...formData, password: el.target.value })}
          required
        />
        <button type="submit">login</button>
      </form>
    </div>
  );
};
