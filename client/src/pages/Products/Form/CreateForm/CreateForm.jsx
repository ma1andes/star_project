import { useState } from "react";
import { apiFetch, FormBuilder } from "../../../../shared";
import { formFields } from "./configs";

export const CreateProduct = ({ onCreateProduct }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleFormSubmit = async (data) => {
    try {
      setIsLoading(true);

      // Создаем FormData для отправки файлов
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("desc", data.desc);
      formData.append("price", data.price);
      formData.append("type", data.type);
      
      if (data.img && data.img[0]) {
        formData.append("img", data.img[0]);
      }

      await apiFetch("/product", {
        method: "POST",
        body: formData,
        requireAuth: true,
      });

      if (onCreateProduct && typeof onCreateProduct === "function") {
        await onCreateProduct();
      }

      closeModal();
    } catch (err) {
      console.error("Error creating product", err);
      alert("Ошибка при создании товара: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <button className="button" onClick={openModal} style={{ marginBottom: 16 }}>
        Создать товар
      </button>

      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>СОЗДАНИЕ ТОВАРА</h2>
              <button className="modal-close" onClick={closeModal} disabled={isLoading}>
                ×
              </button>
            </div>

            <div className="modal-form">
              <FormBuilder
                fields={formFields}
                onSubmit={handleFormSubmit}
                submitText="Создать товар"
                isLoading={isLoading}
                showCancelButton={true}
                onCancel={closeModal}
                cancelText="Отмена"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
