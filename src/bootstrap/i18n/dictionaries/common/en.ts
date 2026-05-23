import commonLangKey from "@/feature/common/lang-keys/common.lang-key";

const en: typeof commonLangKey = {
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
  failure: {
    network: "Something went wrong please try again layer!",
    param: "Please provide correct information",
    apiStructure: "Unexpected API response structure",
    unauthorized: "You are not authorized to perform this action",
  },
};

export default en;
