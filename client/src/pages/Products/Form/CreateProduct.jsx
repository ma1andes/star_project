import { useState } from "react";

export const CreateProduct = ({ onCreateProduct }) => {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    desc: "",
    type: "",
    price: 0,
    img: null
  });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    
    if (type === 'file') {
      setFormData((prevData) => ({
        ...prevData,
        [name]: files[0] || null,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();

    if (
      !formData.title ||
      !formData.desc ||
      !formData.type ||
      !formData.price
    ) {
      setMessage("Заполните все обязательные поля");
      return;
    }

    if (formData.price <= 0) {
      setMessage("Цена должна быть больше 0");
      return;
    }

    try {
      setIsLoading(true);
      setMessage("");

      // Создаем FormData для отправки файла
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('desc', formData.desc);
      formDataToSend.append('type', formData.type);
      formDataToSend.append('price', formData.price);
      
      if (formData.img) {
        formDataToSend.append('img', formData.img);
      }

      const response = await fetch("http://127.0.0.1:8000/api/product", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          // Убираем content-type, чтобы браузер сам установил правильный для FormData
        },
        body: formDataToSend,
      });

      if (response.status === 201) {
        setFormData({
          title: "",
          desc: "",
          type: "",
          price: 0,
          img: null,
        });
        setMessage("Товар успешно создан!");

        // Вызываем функцию обновления списка товаров
        if (onCreateProduct && typeof onCreateProduct === "function") {
          try {
            await onCreateProduct();
          } catch (error) {
            console.error("Error refreshing products:", error);
          }
        }
      } else {
        const errorData = await response.json();
        setMessage(
          errorData.errors?.details || "Произошла ошибка при создании товара"
        );
      }
    } catch (err) {
      console.error("Failed to connect to server: ", err);
      setMessage("Ошибка подключения к серверу");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Очищаем сообщение при изменении полей
    if (message) {
      setMessage("");
    }
  };

  return (
    <>
      {isLoading ? (
        <div>Загрузка...</div>
      ) : (
        <div className="container">
          <h1>СОЗДАНИЕ ТОВАРА</h1>
          <form
            onSubmit={handleSubmitForm}
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            encType="multipart/form-data"
          >
            {message && <p style={{ fontWeight: "bold" }}>{message}</p>}
            <input
              type="text"
              name="title"
              placeholder="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="desc"
              placeholder="desc"
              value={formData.desc}
              onChange={handleChange}
              required
            />
            <input
              type="number"
              name="price"
              placeholder="price"
              min="0"
              step="0.01"
              value={formData.price}
              onChange={handleChange}
              required
            />
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                choose type
              </option>
              <option value="school">school</option>
              <option value="dress">dress</option>
            </select>
            <input 
              type="file" 
              name="img"
              accept="image/*"
              onChange={handleChange} 
            />
            {formData.img && (
              <img
                src={URL.createObjectURL(formData.img)}
                alt="Preview"
                style={{ width: "100px", height: "100px" }}
              />
            )}
            <button type="submit" disabled={isLoading}>
              {isLoading ? "Создание..." : "create"}
            </button>
          </form>
        </div>
      )}
    </>
  );
};
