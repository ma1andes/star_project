import React from "react";
import { useForm } from "react-hook-form";
import "./FormBuilder.css";

export const FormBuilder = ({ 
  fields, 
  onSubmit, 
  submitText = "Отправить", 
  className = "",
  defaultValues = {},
  isLoading = false,
  showCancelButton = false,
  onCancel = null,
  cancelText = "Отмена"
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({ defaultValues });

  const renderField = (field) => {
    const { 
      name, 
      label, 
      type = "text", 
      options, 
      placeholder, 
      required = false,
      validation = {},
      accept,
      min,
      max,
      step
    } = field;

    const validationRules = {
      required: required ? "Обязательное поле" : false,
      ...validation
    };

    if (type === "select") {
      return (
        <select 
          {...register(name, validationRules)} 
          disabled={isLoading}
          className="form-select"
        >
          <option value="">-- Выберите --</option>
          {options?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      );
    }

    if (type === "textarea") {
      return (
        <textarea 
          {...register(name, validationRules)} 
          placeholder={placeholder}
          disabled={isLoading}
          className="form-textarea"
        />
      );
    }

    if (type === "file") {
      return (
        <input 
          type="file" 
          {...register(name, validationRules)} 
          accept={accept}
          disabled={isLoading}
          className="form-file"
        />
      );
    }

    return (
      <input 
        type={type} 
        {...register(name, validationRules)} 
        placeholder={placeholder}
        min={min}
        max={max}
        step={step}
        disabled={isLoading}
        className="form-input"
      />
    );
  };

  // Функция для показа превью изображения
  const renderImagePreview = (field) => {
    if (field.type === "file" && field.showPreview) {
      const fileValue = watch(field.name);
      if (fileValue && fileValue[0]) {
        return (
          <div className="image-preview">
            <img
              src={URL.createObjectURL(fileValue[0])}
              alt="Preview"
            />
            <span className="image-preview-label">Предпросмотр изображения</span>
          </div>
        );
      }
    }
    return null;
  };

  const handleCancelClick = () => {
    if (onCancel && !isLoading) {
      onCancel();
    }
  };

  return (
    <form 
      onSubmit={handleSubmit(onSubmit)} 
      className={`form-builder ${className}`}
    >
      {fields.map((field) => (
        <div key={field.name} className="form-field">
          {field.label && (
            <label className="form-label">
              {field.label}
              {field.required && <span className="required">*</span>}
            </label>
          )}
          {renderField(field)}
          {renderImagePreview(field)}
          {errors[field.name] && (
            <div className="form-error">
              {errors[field.name].message}
            </div>
          )}
        </div>
      ))}

      <div className="form-buttons">
        <button 
          type="submit" 
          disabled={isLoading}
          className="form-submit"
        >
          {isLoading ? "Загрузка..." : submitText}
        </button>
        
        {showCancelButton && (
          <button 
            type="button" 
            onClick={handleCancelClick}
            disabled={isLoading}
            className="form-cancel"
          >
            {cancelText}
          </button>
        )}
      </div>
    </form>
  );
};
