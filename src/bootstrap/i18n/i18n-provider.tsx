"use client";

import { I18nextProvider } from "react-i18next";
import { i18nInstance, initI18next, LANGS } from "@/bootstrap/i18n/i18n";
import { Resource } from "i18next";
import { PropsWithChildren } from "react";

export default function TranslationsProvider({
  children,
  lng,
  resources,
}: PropsWithChildren & { lng: LANGS; resources: Resource }) {
  if (!resources) return children;
  initI18next({ lng, resources });

  return <I18nextProvider i18n={i18nInstance}>{children}</I18nextProvider>;
}
