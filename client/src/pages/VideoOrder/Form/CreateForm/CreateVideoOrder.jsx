import React, { useState } from "react";
import { useUser, apiFetch, Modal, FormBuilder } from "../../../../shared";
import { formField } from "../configs";
import "./CreateVideoOrder.css";

export const CreateVideoOrder = ({
  onCreateVideo,
  isOpen,
  onClose,
  showButton = true,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUser();

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const isControlled = isOpen !== undefined && onClose !== undefined;
  const modalIsOpen = isControlled ? isOpen : isModalOpen;
  const handleClose = isControlled ? onClose : closeModal;

  const handleFormSubmit = async (data) => {
    try {
      setIsLoading(true);

      const response = await apiFetch("/video-create/", {
        method: "POST",
        body: JSON.stringify(data),
        requireAuth: true,
      });

      alert("Заявка на видео поздравление успешно отправлена!");

      if (onCreateVideo && typeof onCreateVideo === "function") {
        await onCreateVideo(response.data);
      }

      handleClose();
    } catch (err) {
      console.error("Ошибка при создании заявки на видео:", err);
      alert("Ошибка при отправке заявки: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user && modalIsOpen) {
    return (
      <Modal
        isOpen={modalIsOpen}
        onClose={handleClose}
        title="ЗАКАЗ ВИДЕО ПОЗДРАВЛЕНИЯ"
      >
        <div className="auth-required">
          <p>Для заказа видео поздравления необходимо войти в систему</p>
          <button onClick={handleClose} className="close-btn">
            Понятно
          </button>
        </div>
      </Modal>
    );
  }

  return (
    <>
      {showButton && !isControlled && (
        <button
          className="button"
          onClick={openModal}
          style={{ marginBottom: 16 }}
        >
          Заказать видео поздравление
        </button>
      )}

      <Modal
        isOpen={modalIsOpen}
        onClose={handleClose}
        title="ЗАКАЗ ВИДЕО ПОЗДРАВЛЕНИЯ"
        isLoading={isLoading}
      >
        <FormBuilder
          fields={formField}
          onSubmit={handleFormSubmit}
          submitText="Заказать видео поздравление"
          isLoading={isLoading}
          showCancelButton={true}
          onCancel={handleClose}
          cancelText="Отмена"
        />
      </Modal>
    </>
  );
};
