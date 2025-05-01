import langKey from "@/bootstrap/i18n/dictionaries/lang-key";

const ru: typeof langKey = {
  global: {
    home: "Дом",
    loading: "Загрузка",
    dashboard: "Панель приборов",
    required: "{{field}} требуется",
    passwordMinLength: "Длина пароля должна быть не менее 8 символов!",
  },
  dashboard: {
    invoice: {
      createButton: "Создать случайный счет-фактуру",
    },
  },
};

export default ru;
