import commonLangKey from "@/feature/common/lang-keys/common.lang-key";

const ru: typeof commonLangKey = {
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
  failure: {
    network: "Пожалуйста, предоставьте правильную информацию.",
    param: "Пожалуйста, предоставьте правильную информацию.",
  },
};

export default ru;
