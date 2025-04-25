import "server-only";

/**
 * You can put all configs which shouldn't be mapped to the client side.
 */
const serverConfigs = {
  env: {
    idp: {
      url: process.env.IDP_URL as string,
      clientId: process.env.IDP_CLIENT_ID as string,
      clientSecret: process.env.IDP_CLIENT_SECRET as string,
    },
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
