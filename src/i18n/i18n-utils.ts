import { type SupportedLocale, supportedLocales } from "@/i18n/i18n";

export const isSupportedLocale = (lng: string): lng is SupportedLocale => {
  return supportedLocales.includes(lng as SupportedLocale);
};

export function toSupportedLocale(lng: string): SupportedLocale {
  if (isSupportedLocale(lng)) return lng;

  const base = lng.split("-")[0];
  const match = supportedLocales.find((l) => l.split("-")[0] === base);
  return (match ?? "en") as SupportedLocale;
}
