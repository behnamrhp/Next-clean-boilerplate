import langKey from "@/bootstrap/i18n/dictionaries/lang-key";

const en: typeof langKey = {
  global: {
    home: "Home",
    loading: "Loading",
    required: "{{field}} is Required",
    dashboard: "Dashboard",
    passwordMinLength: "Password length should be at least 8 characters!",
  },
  dashboard: {
    invoice: {
      createButton: "Create random Invoice",
    },
  },
};

export default en;
