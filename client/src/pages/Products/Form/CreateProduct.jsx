import { useState } from "react";
import { apiFetch } from "../../../shared";

export const CreateProduct = ({ onCreateProduct }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [newProduct, setNewProduct] = useState({
    title: "",
    desc: "",
    type: "",
    price: "",
    img: null,
  });

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleChange = (e) => {
    const { name, value, files, type } = e.target;
    if (type === "file") {
      setNewProduct((prev) => ({ ...prev, [name]: files[0] || null }));
    } else {
      setNewProduct((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("title", newProduct.title);
      formData.append("desc", newProduct.desc);
      formData.append("price", newProduct.price);
      formData.append("type", newProduct.type);
      if (newProduct.img) {
        formData.append("img", newProduct.img);
      }

      await apiFetch("/product", {
        method: "POST",
        body: formData,
        requireAuth: true,
      });

      if (onCreateProduct && typeof onCreateProduct === "function") {
        await onCreateProduct();
      }

      // Очистка формы и закрытие модального окна
      setNewProduct({ title: "", desc: "", type: "", price: "", img: null });
      closeModal();
    } catch (err) {
      console.error("Error creating product", err);
    }
  };

  return (
    <div>
      {/* Кнопка открытия модального окна */}
      <button className="button" onClick={openModal} style={{ marginBottom: 16 }}>
        Создать товар
      </button>

      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>СОЗДАНИЕ ТОВАРА</h2>
              <button className="modal-close" onClick={closeModal}>
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              <input
                name="title"
                placeholder="Название"
                value={newProduct.title}
                onChange={handleChange}
                required
              />
              <input
                name="desc"
                placeholder="Описание"
                value={newProduct.desc}
                onChange={handleChange}
                required
              />
              <input
                name="price"
                type="number"
                placeholder="Цена"
                value={newProduct.price}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
              />

              <select name="type" value={newProduct.type} onChange={handleChange} required>
                <option value="" disabled>
                  Выберите тип
                </option>
                <option value="dress">dress</option>
                <option value="school">school</option>
              </select>

              <input
                type="file"
                name="img"
                accept="image/*"
                onChange={handleChange}
              />

              {newProduct.img && (
                <img
                  src={URL.createObjectURL(newProduct.img)}
                  alt="Preview"
                  style={{ width: "100px", height: "100px", objectFit: "cover", marginTop: 8 }}
                />
              )}

              <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
                <button type="submit" className="btn-primary">
                  Создать
                </button>
                <button type="button" onClick={closeModal} className="btn-secondary">
                  Отмена
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
