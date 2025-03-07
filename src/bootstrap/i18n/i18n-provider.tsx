"use client";

import { I18nextProvider } from "react-i18next";
import { i18nInstance, initI18next, LANGS } from "@/bootstrap/i18n/i18n";
import { PropsWithChildren, useEffect, useState } from "react";
import storeLang from "@/bootstrap/i18n/store-lang-action";
import { i18n } from "i18next";

export default function TranslationsProvider(
  props: PropsWithChildren & { lng: LANGS },
) {
  const { lng, children } = props;
  const [i18n, setI18n] = useState<i18n>();

  useEffect(() => {
    (async () => {
      storeLang(lng);
      setI18n((await initI18next({ lng })).i18n);
    })();
  }, [lng]);

  if (!i18n) return null;

  return <I18nextProvider i18n={i18nInstance}>{children}</I18nextProvider>;
}
