import "i18next";
import common from "@/i18n/locales/en/common.ts";
import { defaultNS } from "@/i18n/i18n";

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: typeof defaultNS;
    resources: {
      common: typeof common;
    };
  }
}
