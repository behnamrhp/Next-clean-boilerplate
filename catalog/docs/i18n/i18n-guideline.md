## Table of contents
- [Table of contents](#table-of-contents)
- [Overview](#overview)
- [Guideline for adding new key](#guideline-for-adding-new-key)
- [Folder acrhitecture](#folder-acrhitecture)
- [Configuration](#configuration)
- [Provider and client support](#provider-and-client-support)
- [Combination with failure handling and params validation](#combination-with-failure-handling-and-params-validation)

## Overview
A major issue with most localization libraries is their reliance on hardcoded string keys throughout the codebase. This forces developers to manually track and update every language dictionary file whenever keys change - a tedious and error-prone process with no type safety or automation.

This document provides guidelines for:

- File organization: Structure localization files so changes to any key trigger errors across all language resources

- Key management: Replace hardcoded strings with typed objects to eliminate manual refactoring when keys change

- Possible to work with error handling

## Guideline for adding new key
1. **Define namespace**: at first based on the domains which we talked about it in [this article](/catalog/docs/clean-architecture/clean-architecture.md) we make a folder.
Example folder: [common](/src/bootstrap/i18n/dictionaries/common)

2. **Add langkey and namespace name for the domain**: langKey is the single source for the languages in that domain which all dictionaries will use it. As we use this source in failure and params message in domain layer we put them in feature layer but dictionaries will remain in bootstrap.
Example: [common-lang-key.ts](/src/feature/common/lang-keys/common-lang-key.ts)

> note: Make sure the namespace name is the same as folder name in dictionaries to be able import them by this namespace.

4. **Dictionaries**: Add related dictionaries for the domain in bootstrap layer.
Example: [en.ts](src/bootstrap/i18n/dictionaries/common/en.ts)

> note: as we use language enum to define languages make sure the langs are the same as language enum in [this file](/src/bootstrap/i18n/i18n.ts) to be able import the dictionaries.

1. Add your new key to langKey.ts to proper domain.
2. Add translation for new key in en.ts and ru.ts in the same domain as in the langKey.ts. en.ts and ru.ts objects are connected to source object, so typescript will show an error if new key added or old key was changed. Also this connections helps us to avoid code become brittle since typescript will show an error in places of usage of translation keys if they were changed.

langKey.ts
```typescript
const langKey = {
  global: {
    keyWithoutSpecificDomain: "global.keyWithoutSpecificDomain"
  },
  sampleDomain: {
    sampleKey: "sampleDomain.sampleKey",
  }
};

export default langKey;
```

ru.ts
```typescript
const ru: typeof langKey = {
  global: {
    keyWithoutSpecificDomain: "Строка без домена"
  },
  sampleDomain: {
    sampleKey: "Строка с доменом",
  }
}
```

en.ts
```typescript
const en: typeof langKey = {
  global: {
    keyWithoutSpecificDomain: "String without domain"
  },
  sampleDomain: {
    sampleKey: "String with domain",
  }
}
```

## Folder acrhitecture
```
.
└── src/
    ├── bootstrap/
    │   └── i18n/
    │       ├── i18n.ts
    │       └── dictionaries/
    │           └── common/
    │               ├── en.ts
    │               └── ru.ts
    └── feature/
        └── common/
            └── lang-keys/
                ├── common.lang-keys.ts
                └── user.lang-key.ts
```

__i18n.ts__ configuring i18next.

__langKey.ts__ contains object of all possible keys for translation.

__ru.ts__ object of russian keys.

__en.ts__ object of english keys.

## Configuration

Before usage i18next's translation hook, it must be configured with languages it should support.

example of initialization
[Main file](/src/bootstrap/i18n/i18n.ts)
```typescript
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

```

## Provider and client support
To support client side translations with once loaded data in the server we can use provider component like [this file](/src/bootstrap/i18n/i18n-provider.tsx).

Then we can use this provider in one main layout of the app like [this file](/src/app/[lang]/layout.tsx).

## Combination with failure handling and params validation
- For combination with failure hanlding, please check [this article](https://dev.to/behnamrhp/how-to-automate-failure-handling-and-messages-with-this-powerful-architecture-i4j) or [this document](/catalog/docs/failure-error-handling/failure-error-handling.md) in the boilerplate
- Also for combination with params please check the [feature layer architecture](/catalog/docs/feature-layer/feature-layer-architecture.md) article.