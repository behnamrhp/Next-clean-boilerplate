import { initI18next } from "@/bootstrap/i18n/i18n";
import TranslationsProvider from "@/bootstrap/i18n/i18n-provider";
import { PropsWithChildren } from "react";

export default async function layout(
  props: PropsWithChildren & { params: Promise<{ lang: string }> },
) {
  const { lang } = await props.params;
  const { resources } = await initI18next({ lng: lang });
  return (
    <TranslationsProvider lng={lang} resources={resources}>
      {props.children}
    </TranslationsProvider>
  );
}
