/**
 * main language keys which will be used for translation to avoid using strings directly and be
 *  a single source of truth in all changes between all languages dictionaries.
 * All languages dictionaries should have the same keys by having this object type.
 */
const userLangKey = {
  deleteUser: "deleteUser",
  failure: {
    usernameExists: "failure.usernameExists",
  },
};

export const userLangNs = "user";

export default userLangKey;
