/**
 * main language keys which will be used for translation to avoid using strings directly and be
 *  a single source of truth in all changes between all languages dictionaries.
 * All languages dictionaries should have the same keys by having this object type.
 */
const commonLangKey = {
  global: {
    home: "global.home",
    dashboard: "global.dashboard",
    loading: "global.loading",
    required: "global.required",
    passwordMinLength: "global.passwordMinLength",
  },
  failure: {
    network: "failure.network",
    param: "failure.param",
  },
  dashboard: {
    invoice: {
      createButton: "dashboard.invoice.createButton",
    },
  },
};

export const commonLangNs = "common";

export default commonLangKey;
