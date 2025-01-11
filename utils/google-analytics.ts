declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

// utils/google-analytics.ts
import 'url:https://www.googletagmanager.com/gtag/js?id=G-XXXXXX';

window.dataLayer = window.dataLayer || [];
window.gtag = function (...args: any[]) {
  window.dataLayer.push(args);
};
window.gtag('js', new Date());
window.gtag('config', 'G-XXXXXX');

export {};