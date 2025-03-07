"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
