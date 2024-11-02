import { getOptions, languages } from '@/bootstrap/i18n/settings'
import { createInstance, i18n, Resource } from 'i18next'
import resourcesToBackend from 'i18next-resources-to-backend'
import { initReactI18next } from 'react-i18next/initReactI18next'

export const initI18next = async (params: {lng: string, i18n?: i18n,  resources?: Resource, ns?: string}) => {
    const { lng, i18n, ns, resources } = params
  const i18nInstance = i18n ? i18n : createInstance()
  await i18nInstance
    .use(initReactI18next)
    .use(resourcesToBackend((language: string) => import(`./dictionaries/${language}.ts`)))
    .init({
        ...getOptions(lng, ns),
        resources,
        preload: resources ? [] : languages 
    },)

    await i18nInstance.init()
 
    return {
        i18n: i18nInstance,
        resources: i18nInstance.services.resourceStore.data,
        t: i18nInstance.t
    } 
}

export async function getServerTranslation(lng: string, ns?: string, options: {keyPrefix?: string} = {}) {
  const i18nextInstance = (await initI18next({lng, ns})).i18n
  
  return {
    t: i18nextInstance.getFixedT(lng, Array.isArray(ns) ? ns[0] : ns, options?.keyPrefix),
    i18n: i18nextInstance
  }
}