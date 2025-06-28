import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser, apiFetch } from "../../shared";

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
    <div>
      {isLoading ? (
        "loading"
      ) : (
        <form onSubmit={onSubmitHandler}>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <input
            type="email"
            placeholder="email"
            value={formData.email}
            onChange={(el) =>
              setFormData({ ...formData, email: el.target.value })
            }
            required
          />
          <input
            type="password"
            placeholder="password"
            value={formData.password}
            onChange={(el) =>
              setFormData({ ...formData, password: el.target.value })
            }
            required
          />
          <button type="submit">login</button>
        </form>
      )}
    </div>
  );
};
