import { commonLangNs } from "@/feature/common/lang-keys/common.lang-key";
import { userLangNs } from "@/feature/common/lang-keys/user.lang-key";
import { getOptions, languages } from "@/bootstrap/i18n/settings";
import { createInstance, Resource } from "i18next";
import resourcesToBackend from "i18next-resources-to-backend";
import { initReactI18next } from "react-i18next/initReactI18next";

export const i18nInstance = createInstance();

export enum LANGS {
  EN = "en",
  RU = "ru",
}

const nameSpaces = [commonLangNs, userLangNs];

export const getI18n = async (params: {
  lng: LANGS;
  resources?: Resource;
  ns?: string;
}) => {
  const { lng, ns, resources } = params;
  if (i18nInstance.isInitialized) {
    await i18nInstance.changeLanguage(lng);
    return {
      i18n: i18nInstance,
      resources: i18nInstance.services.resourceStore.data,
      ns: nameSpaces,
      defaultNs: commonLangNs,
      t: i18nInstance.t,
    };
  }
  await i18nInstance
    .use(initReactI18next)
    .use(
      resourcesToBackend(
        (language: LANGS, namespace: string) =>
          import(`./dictionaries/${namespace}/${language}.ts`),
      ),
    )
    .init({
      ...getOptions(lng, ns),
      resources,
      ns: nameSpaces,
      defaultNS: commonLangNs,
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
  const { i18n } = await getI18n({ lng });
  // console.log(i18n);
  return {
    t: i18n.getFixedT(lng, Array.isArray(ns) ? ns[0] : ns, options?.keyPrefix),
    i18n: i18nInstance,
  };
}
