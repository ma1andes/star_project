export const formField = [
  {
    name: "full_name",
    type: "text",
    label: "ФИО",
    placeholder: "Введите ФИО",
    required: true,
  },
  {
    name: "email",
    label: "E-mail",
    placeholder: "Введите ваш E-mail адрес",
    type: "email",
    required: true,
  },
  {
    name: "phone",
    label: "Номер телефона",
    placeholder: "Введите номер телефона",
    type: "text",
    required: true,
  },
  {
    name: "age",
    label: "Возраст",
    placeholder: "Введите ваш возраст",
    type: "number",
    validation: {
      min: { value: 1, message: "Возраст не может быть меньше 0" },
      max: { value: 100, message: "Возраст не может быть больше 100" },
    },
    required: true,
  },
  {
    name: "desc",
    label: "Описание",
    placeholder: "Введите описание ребёнка",
    type: "textarea",
    required: false,
  },
  {
    name: "hobbies",
    label: "Хобби",
    placeholder: "Введите хобби ребёнка",
    type: "textarea",
    required: false,
  },
  {
    name: "date_birthday",
    label: "Дата рождения",
    placeholder: "Введите дату рождения ребёнка",
    type: "date",
    required: true,
  },
  {
    name: "count",
    label: "Количество",
    placeholder: "Введите кол-во поздравлений",
    type: "number",
    validation: {
      min: {
        value: 1,
        message: "Кол-во поздравлений не может быть меньше одного",
      },
    },
    required: true,
  },
  {
    name: "price",
    label: "Цена",
    placeholder: "Введите цену",
    type: "number",
    validation: {
      min: {
        value: 1,
        message: "Цена поздравления не может быть меньше 1",
      },
    },
    required: true,
  },
];
