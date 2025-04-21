import "server-only";

/**
 * You can put all configs which shouldn't be mapped to the client side.
 */
const serverConfigs = {
  env: {
    backendApi: {
      url: process.env.BACKEND_BASE_HOST as string,
    },
  },
  cookies: {
    authToken: "auth-token",
    authProfile: "auth-profile",
  },
};

export default serverConfigs;
