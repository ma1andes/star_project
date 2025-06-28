export const formFields = [
    {
      name: "title",
      label: "Название",
      type: "text",
      placeholder: "Введите название товара",
      required: true,
    },
    {
      name: "desc",
      label: "Описание",
      type: "textarea",
      placeholder: "Введите описание товара",
      required: true,
    },
    {
      name: "price",
      label: "Цена",
      type: "number",
      placeholder: "Введите цену",
      required: true,
      min: "0",
      step: "0.01",
      validation: {
        min: { value: 0.01, message: "Цена должна быть больше 0" }
      }
    },
    {
      name: "type",
      label: "Тип товара",
      type: "select",
      required: true,
      options: [
        { value: "dress", label: "Платье" },
        { value: "school", label: "Школа" }
      ]
    },
    {
      name: "img",
      label: "Изображение",
      type: "file",
      accept: "image/*",
      required: false,
      showPreview: true
    }
  ];