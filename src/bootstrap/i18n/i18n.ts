import { getOptions, languages } from "@/bootstrap/i18n/settings";
import { createInstance, Resource } from "i18next";
import resourcesToBackend from "i18next-resources-to-backend";
import { initReactI18next } from "react-i18next/initReactI18next";

export const i18nInstance = createInstance();

export enum LANGS {
  EN = "en",
  RU = "ru",
}

export const initI18next = async (params: {
  lng: LANGS;
  resources?: Resource;
  ns?: string;
}) => {
  const { lng, ns, resources } = params;
  await i18nInstance
    .use(initReactI18next)
    .use(
      resourcesToBackend(
        (language: LANGS) => import(`./dictionaries/${language}.ts`),
      ),
    )
    .init({
      ...getOptions(lng, ns),
      resources,
      preload: resources ? [] : languages,
    });

  await i18nInstance.init();

  return {
    i18n: i18nInstance,
    resources: i18nInstance.services.resourceStore.data,
    t: i18nInstance.t,
  };
};

export async function getServerTranslation(
  lng: LANGS,
  ns?: string,
  options: { keyPrefix?: string } = {},
) {
  await initI18next({ lng });
  return {
    t: i18nInstance.getFixedT(
      lng,
      Array.isArray(ns) ? ns[0] : ns,
      options?.keyPrefix,
    ),
    i18n: i18nInstance,
  };
}
