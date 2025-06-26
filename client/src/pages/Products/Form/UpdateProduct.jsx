import { useState, useEffect } from "react";

export const UpdateProduct = ({ product, onUpdate, onClose }) => {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    desc: "",
    type: "",
    price: 0,
  });

  useEffect(() => {
    if (product) {
      setFormData({
        title: product.title || "",
        desc: product.desc || "",
        type: product.type || "",
        price: product.price || 0,
      });
    }
  }, [product]);

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
      
      const response = await fetch(`http://127.0.0.1:8000/api/product/${product.id}`, {
        method: "PATCH",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
        body: JSON.stringify(formData),
      });
      
      if (response.status === 200) {
        const updatedProduct = await response.json();
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
      } else {
        const errorData = await response.json();
        setMessage(errorData.errors?.details || "Произошла ошибка при обновлении товара");
      }
    } catch (err) {
      console.error("Failed to connect to server: ", err);
      setMessage("Ошибка подключения к серверу");
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
        
        <form onSubmit={handleSubmitForm} className="modal-form">
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
              onChange={(el) => handleInputChange("title", el.target.value)}
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
              onChange={(el) => handleInputChange("desc", el.target.value)}
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
              onChange={(el) => handleInputChange("price", Number(el.target.value) || 0)}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="type">Тип:</label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={(el) => handleInputChange("type", el.target.value)}
              required
            >
              <option value="" disabled>
                choose type
              </option>
              <option value="school">school</option>
              <option value="dress">dress</option>
            </select>
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