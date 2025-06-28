import { useState } from "react";
import { apiFetch, FormBuilder, Modal } from "../../../../shared";
import { formFields } from "../CreateForm/configs.js";

export const UpdateProduct = ({ product, onUpdate, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const defaultValues = {
    title: product?.title || "",
    desc: product?.desc || "",
    price: product?.price || 0,
    type: product?.type || "",
  };

  const handleFormSubmit = async (data) => {
    try {
      setIsLoading(true);
      setMessage("");
      
      const formDataToSend = new FormData();
      formDataToSend.append('title', data.title);
      formDataToSend.append('desc', data.desc);
      formDataToSend.append('type', data.type);
      formDataToSend.append('price', data.price);
      
      if (data.img && data.img[0]) {
        formDataToSend.append('img', data.img[0]);
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

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  if (!product) return null;

  return (
    <Modal
      isOpen={true}
      onClose={handleClose}
      title="РЕДАКТИРОВАНИЕ ТОВАРА"
      isLoading={isLoading}
    >
      {message && (
        <p 
          style={{ 
            color: message.includes("успешно") ? "green" : "red",
            marginBottom: "16px",
            padding: "8px",
            backgroundColor: message.includes("успешно") ? "#d4edda" : "#f8d7da",
            border: `1px solid ${message.includes("успешно") ? "#c3e6cb" : "#f5c6cb"}`,
            borderRadius: "4px"
          }}
        >
          {message}
        </p>
      )}

      {product.img && (
        <div style={{ marginBottom: "16px" }}>
          <p style={{ marginBottom: "8px", fontWeight: "500" }}>Текущее изображение:</p>
          <img
            src={`http://127.0.0.1:8000${product.img}`}
            alt="Current"
            style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "4px" }}
          />
        </div>
      )}
      
      <FormBuilder
        fields={formFields}
        onSubmit={handleFormSubmit}
        submitText="Обновить товар"
        defaultValues={defaultValues}
        isLoading={isLoading}
        showCancelButton={true}
        onCancel={handleClose}
        cancelText="Отмена"
      />
    </Modal>
  );
}; 