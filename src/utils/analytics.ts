export const COOKIE_CONSENT_STORAGE_KEY = 'portfolio_cookie_consent_v2';

export interface ConsentPreferences {
  analytics: boolean;
  marketing: boolean;
  updatedAt: string;
  version: number;
}

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    __ga4InitializedIds?: Record<string, boolean>;
  }
}

export function isValidGa4Id(id: string | undefined | null): id is string {
  return Boolean(id && /^G-[A-Z0-9]{4,}$/i.test(id.trim()));
}

export function getStoredConsent(): ConsentPreferences | null {
  try {
    const raw = localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<ConsentPreferences>;
    if (typeof parsed.analytics !== 'boolean' || typeof parsed.marketing !== 'boolean') {
      return null;
    }
    return {
      analytics: parsed.analytics,
      marketing: parsed.marketing,
      updatedAt: parsed.updatedAt || new Date().toISOString(),
      version: parsed.version || 2,
    };
  } catch {
    return null;
  }
}

function ensureGtagFn(): (...args: unknown[]) => void {
  if (typeof window === 'undefined') {
    return () => {};
  }
  window.dataLayer = window.dataLayer || [];
  if (typeof window.gtag !== 'function') {
    window.gtag = function gtag(...args: unknown[]) {
      window.dataLayer!.push(args);
    };
  }
  return window.gtag;
}

export function applyConsentToGtag(prefs: { analytics: boolean; marketing: boolean }): void {
  const gtag = ensureGtagFn();
  gtag('consent', 'update', {
    ad_storage: prefs.marketing ? 'granted' : 'denied',
    ad_user_data: prefs.marketing ? 'granted' : 'denied',
    ad_personalization: prefs.marketing ? 'granted' : 'denied',
    analytics_storage: prefs.analytics ? 'granted' : 'denied',
    personalization_storage: prefs.marketing ? 'granted' : 'denied',
    functionality_storage: 'granted',
    security_storage: 'granted',
  });
  gtag('set', 'ads_data_redaction', !prefs.marketing);
}

export function saveAndApplyConsent(prefs: {
  analytics: boolean;
  marketing: boolean;
}): ConsentPreferences {
  const record: ConsentPreferences = {
    analytics: prefs.analytics,
    marketing: prefs.marketing,
    updatedAt: new Date().toISOString(),
    version: 2,
  };
  try {
    localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, JSON.stringify(record));
  } catch {
    // ignore storage errors
  }
  applyConsentToGtag(record);
  return record;
}

export function ensureGa4Loaded(rawMeasurementId: string): void {
  const measurementId = rawMeasurementId.trim();
  if (typeof document === 'undefined' || !isValidGa4Id(measurementId)) return;

  window.__ga4InitializedIds = window.__ga4InitializedIds || {};
  if (window.__ga4InitializedIds[measurementId]) return;

  const existingScript = document.querySelector(
    `script[src*="googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}"]`
  );
  const gtag = ensureGtagFn();

  if (!existingScript) {
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
    document.head.appendChild(script);
    gtag('js', new Date());
    gtag('config', measurementId, {
      anonymize_ip: true,
      send_page_view: false,
    });
  }

  window.__ga4InitializedIds[measurementId] = true;
}

let lastTrackedSignature = '';

export function trackSpaPageView(
  rawMeasurementId: string,
  virtualPath: string,
  pageTitle: string
): void {
  const measurementId = rawMeasurementId.trim();
  if (typeof window === 'undefined' || !isValidGa4Id(measurementId)) return;

  ensureGa4Loaded(measurementId);

  const signature = `${measurementId}|${virtualPath}|${pageTitle}`;
  if (signature === lastTrackedSignature) return;
  lastTrackedSignature = signature;

  const gtag = ensureGtagFn();
  gtag('event', 'page_view', {
    send_to: measurementId,
    page_title: pageTitle,
    page_path: virtualPath,
    page_location: window.location.href,
  });
}
