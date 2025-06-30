import { useState, useEffect } from "react";
import { apiFetch, Modal, FormBuilder } from "../../../../shared";
import { formFields as baseFormFields } from "../CreateForm/configs";

export const UpdateConcert = ({ concertData, onUpdateConcert, onClose }) => {
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
        console.log("Загруженные города:", cityOptions);
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

  const getDefaultValues = () => {
    if (!concertData) return {};
    
    const defaultValues = {
      title: concertData.title || "",
      city: concertData.city || "",
      date: concertData.date || "",
      time: concertData.time || "",
    };
    
    return defaultValues;
  };

  const handleFormSubmit = async (data) => {
    if (!concertData?.id) {
      console.error("ID концерта не найден");
      return;
    }

    try {
      setIsLoading(true);

      const formData = new FormData();
      formData.append("city", data.city);
      formData.append("title", data.title);
      formData.append("date", data.date);
      formData.append("time", data.time);

      await apiFetch(`/concert/${concertData.id}`, {
        method: "PATCH",
        body: formData,
        requireAuth: true,
      });

      if (onUpdateConcert) {
        await onUpdateConcert();
      }

      if (onClose) {
        onClose();
      }
    } catch (err) {
      console.error("Ошибка при обновлении концерта:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading && onClose) {
      onClose();
    }
  };

  if (!concertData) return null;

  if (isLoadingCities) {
    return (
      <Modal
        isOpen={true}
        onClose={handleClose}
        title="РЕДАКТИРОВАНИЕ КОНЦЕРТА"
        isLoading={true}
      >
        <p>Загрузка данных...</p>
      </Modal>
    );
  }

  return (
    <Modal
      isOpen={true}
      onClose={handleClose}
      title="РЕДАКТИРОВАНИЕ КОНЦЕРТА"
      isLoading={isLoading}
    >
      <FormBuilder
        fields={getFormFields()}
        onSubmit={handleFormSubmit}
        submitText="Обновить концерт"
        defaultValues={getDefaultValues()}
        isLoading={isLoading}
        showCancelButton={true}
        onCancel={handleClose}
        cancelText="Отмена"
      />
    </Modal>
  );
};
