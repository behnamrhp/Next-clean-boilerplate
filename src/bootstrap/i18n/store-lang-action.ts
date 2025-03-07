"use server";

import { LANGS } from "@/bootstrap/i18n/i18n";
import { cookieName } from "@/bootstrap/i18n/settings";
import { cookies } from "next/headers";

export default async function storeLang(lng: LANGS) {
  (await cookies()).set(cookieName, lng);
}
