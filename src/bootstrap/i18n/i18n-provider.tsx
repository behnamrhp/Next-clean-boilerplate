"use client";

import { I18nextProvider } from "react-i18next";
import { getI18n, LANGS } from "@/bootstrap/i18n/i18n";
import { PropsWithChildren, useEffect, useState } from "react";
import { i18n } from "i18next";
import storeLang from "@/bootstrap/i18n/store-lang-action";

export default function TranslationsProvider({
  children,
  lng,
}: PropsWithChildren & { lng: LANGS }) {
  const [i18n, setI18n] = useState<i18n>();

  useEffect(() => {
    (async () => {
      storeLang(lng);
      setI18n((await getI18n({ lng })).i18n);
    })();
  }, [lng]);

  if (!i18n) return null;
  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
