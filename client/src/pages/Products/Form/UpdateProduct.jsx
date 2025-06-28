import { useState, useEffect } from "react";
import { apiFetch } from "../../../shared";

export const UpdateProduct = ({ product, onUpdate, onClose }) => {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    desc: "",
    type: "",
    price: 0,
    img: null
  });

  useEffect(() => {
    if (product) {
      setFormData({
        title: product.title || "",
        desc: product.desc || "",
        type: product.type || "",
        price: product.price || 0,
        img: null // Новое изображение, если пользователь выберет
      });
    }
  }, [product]);

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
    
    if (!formData.title || !formData.desc || !formData.type || !formData.price) {
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
      
      const updatedProduct = await apiFetch(`/product/${product.id}`, {
        method: "PATCH",
        body: formDataToSend,
        requireAuth: true,
      });
      
      setMessage("Товар успешно обновлен!");
      
      if (onUpdate && typeof onUpdate === 'function') {
        try {
          await onUpdate(updatedProduct.data);
        } catch (error) {
          console.error("Error updating products list:", error);
        }
      }
      
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err) {
      console.error("Failed to connect to server: ", err);
      setMessage(err.message || "Ошибка подключения к серверу");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (message) {
      setMessage("");
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  if (!product) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>РЕДАКТИРОВАНИЕ ТОВАРА</h2>
          <button className="modal-close" onClick={handleClose} disabled={isLoading}>
            ×
          </button>
        </div>
        
        <form onSubmit={handleSubmitForm} className="modal-form" encType="multipart/form-data">
          {message && (
            <p className={`message ${message.includes("успешно") ? "success" : "error"}`}>
              {message}
            </p>
          )}
          
          <div className="form-group">
            <label htmlFor="title">Название:</label>
            <input
              id="title"
              type="text"
              name="title"
              placeholder="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="desc">Описание:</label>
            <input
              id="desc"
              type="text"
              name="desc"
              placeholder="desc"
              value={formData.desc}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="price">Цена:</label>
            <input
              id="price"
              type="number"
              name="price"
              placeholder="price"
              min="0"
              step="0.01"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="type">Тип:</label>
            <select
              id="type"
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
          </div>

          <div className="form-group">
            <label htmlFor="img">Изображение:</label>
            <input
              id="img"
              type="file"
              name="img"
              accept="image/*"
              onChange={handleChange}
            />
            {formData.img && (
              <img
                src={URL.createObjectURL(formData.img)}
                alt="Preview"
                style={{ width: "100px", height: "100px", marginTop: "10px" }}
              />
            )}
            {product.img && !formData.img && (
              <div style={{ marginTop: "10px" }}>
                <p>Текущее изображение:</p>
                <img
                  src={`http://127.0.0.1:8000${product.img}`}
                  alt="Current"
                  style={{ width: "100px", height: "100px" }}
                />
              </div>
            )}
          </div>
          
          <div className="modal-actions">
            <button 
              type="button" 
              onClick={handleClose} 
              disabled={isLoading}
              className="btn-secondary"
            >
              Отмена
            </button>
            <button 
              type="submit" 
              disabled={isLoading}
              className="btn-primary"
            >
              {isLoading ? "Обновление..." : "Обновить"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}; 