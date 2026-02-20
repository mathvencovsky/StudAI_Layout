import 'react-i18next';

declare module 'react-i18next' {
  interface CustomTypeOptions {
    returnNull: false;
    // Permite qualquer string como chave de tradução
    defaultNS: 'common';
    resources: {
      common: any;
    };
  }
}
