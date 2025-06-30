import { useState, useEffect } from "react";
import { apiFetch, Modal, FormBuilder } from "../../../../shared";
import { formFields as baseFormFields } from "./configs";

export const CreateConcert = ({ onCreateConcert }) => {
  const [isModalCreateOpen, setIsModalCreateOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [cities, setCities] = useState([]);
  const [isLoadingCities, setIsLoadingCities] = useState(false);

  const loadCities = async () => {
    try {
      setIsLoadingCities(true);
      const response = await apiFetch("/cities", {
        method: "GET",
        requireAuth: true,
      });

      if (response?.data) {
        const cityOptions = response.data.map((city) => ({
          value: city.id,
          label: city.name,
        }));
        setCities(cityOptions);
      }
    } catch (error) {
      console.error("Ошибка при загрузке городов:", error);
    } finally {
      setIsLoadingCities(false);
    }
  };

  useEffect(() => {
    loadCities();
  }, []);

  const getFormFields = () => {
    return baseFormFields.map((field) => {
      if (field.name === "city") {
        return {
          ...field,
          options: cities,
        };
      }
      return field;
    });
  };

  const openModal = () => setIsModalCreateOpen(true);
  const closeModal = () => setIsModalCreateOpen(false);

  const handleFormSubmit = async (data) => {
    try {
      setIsLoading(true);

      const formData = new FormData();
      formData.append("city", data.city);
      formData.append("title", data.title);
      formData.append("date", data.date);
      formData.append("time", data.time);

      await apiFetch("/concert", {
        method: "POST",
        body: formData,
        requireAuth: true,
      });

      if (onCreateConcert) {
        await onCreateConcert();
      }

      closeModal();
    } catch (err) {
      console.error("Ошибка при создании концерта:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <button
        className="button"
        onClick={openModal}
        style={{ marginBottom: 16 }}
      >
        Создать концерт
      </button>

      <Modal
        isOpen={isModalCreateOpen}
        onClose={closeModal}
        title="СОЗДАНИЕ КОНЦЕРТА"
        isLoading={isLoading}
      >
        <FormBuilder
          fields={getFormFields()}
          onSubmit={handleFormSubmit}
          submitText="Создать концерт"
          isLoading={isLoading || isLoadingCities}
          showCancelButton={true}
          onCancel={closeModal}
          cancelText="Отмена"
        />
      </Modal>
    </div>
  );
};
