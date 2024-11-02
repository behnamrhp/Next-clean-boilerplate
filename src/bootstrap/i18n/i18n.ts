import { getOptions } from '@/bootstrap/i18n/settings'
import { createInstance } from 'i18next'
import resourcesToBackend from 'i18next-resources-to-backend'
import { initReactI18next } from 'react-i18next/initReactI18next'

const initI18next = async (lng: string, ns?: string) => {
  const i18nInstance = createInstance()
  await i18nInstance
    .use(initReactI18next)
    .use(resourcesToBackend((language: string) => import(`./dictionaries/${language}.ts`)))
    .init(getOptions(lng, ns))
  return i18nInstance
}

export async function getTranslation(lng: string, ns?: string, options: {keyPrefix?: string} = {}) {
  const i18nextInstance = await initI18next(lng, ns)
  return {
    t: i18nextInstance.getFixedT(lng, Array.isArray(ns) ? ns[0] : ns, options?.keyPrefix),
    i18n: i18nextInstance
  }
}