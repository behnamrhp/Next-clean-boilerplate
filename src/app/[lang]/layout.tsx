import { ThemeProvider } from "@/app/[lang]/dashboard/components/client/theme-provider/theme-provider";
import { getI18n, LANGS } from "@/bootstrap/i18n/i18n";
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
  props: PropsWithChildren & { params: Promise<{ lang: LANGS }> },
) {
  const { params, children } = props;
  const { lang } = await params;
  await getI18n({ lng: lang });
  return (
    <html lang={lang} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <TranslationsProvider lng={lang}>{children}</TranslationsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
