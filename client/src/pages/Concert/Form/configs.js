export const formFields = [
    {
        name: "title",
        label: "Название концерта",
        type: "text",
        placeholder: "Введите название концерта",
        required: true
    },
    {
        name: "city",
        label: "Город",
        type: "select",
        required: true,
        options: []
    },
    {
        name: "date",
        label: "Дата концерта",
        type: "date",
        required: true
    },
    {
        name: "time",
        label: "Время концерта",
        type: "time",
        required: true
    }
]