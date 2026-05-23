const commonConfigs = {
  appName: process.env.APP_NAME ?? "NEXT_BOILERPLATE",
  toastTimeout: 3000,
  httpTimeout: process.env.HTTP_TIMEOUT
    ? parseInt(process.env.HTTP_TIMEOUT, 10) * 1000
    : 15000,
};

export default commonConfigs;
