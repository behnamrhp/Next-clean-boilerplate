import { initI18next } from "@/bootstrap/i18n/i18n";
import TranslationsProvider from "@/bootstrap/i18n/i18n-provider";
import localFont from "next/font/local";
import { PropsWithChildren } from "react";

const geistSans = localFont({
  src: "./../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./../fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default async function layout(
  props: PropsWithChildren & { params: Promise<{ lang: string }> },
) {
  const { params, children } = props;
  const { lang } = await params;
  const { resources } = await initI18next({ lng: lang });
  return (
    <html lang={lang}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <TranslationsProvider lng={lang} resources={resources}>
          {children}
        </TranslationsProvider>
      </body>
    </html>
  );
}
