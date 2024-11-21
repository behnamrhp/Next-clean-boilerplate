"use client";

import { I18nextProvider } from "react-i18next";
import { initI18next } from "@/bootstrap/i18n/i18n";
import { createInstance, Resource } from "i18next";
import { PropsWithChildren } from "react";

export default function TranslationsProvider({
  children,
  lng,
  resources,
}: PropsWithChildren & { lng: string; resources: Resource }) {
  const i18n = createInstance();

  initI18next({ lng, i18n, resources });

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
