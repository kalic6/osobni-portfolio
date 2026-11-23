import { useState, useEffect } from 'react';
import { ShieldCheck, SlidersHorizontal, X, Check } from 'lucide-react';
import {
  getStoredConsent,
  saveAndApplyConsent,
  type ConsentPreferences,
} from '../utils/analytics';

interface CookieConsentProps {
  externalOpenRequest: number;
  onConsentChanged?: (prefs: ConsentPreferences) => void;
}

export function CookieConsent({ externalOpenRequest, onConsentChanged }: CookieConsentProps) {
  const [bannerVisible, setBannerVisible] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return getStoredConsent() === null;
  });
  const [settingsOpen, setSettingsOpen] = useState(false);

  const [analyticsEnabled, setAnalyticsEnabled] = useState<boolean>(() => {
    return getStoredConsent()?.analytics ?? false;
  });
  const [marketingEnabled, setMarketingEnabled] = useState<boolean>(() => {
    return getStoredConsent()?.marketing ?? false;
  });

  // Allow reopening preferences modal from Footer ("Nastavení cookies")
  useEffect(() => {
    if (externalOpenRequest > 0) {
      const current = getStoredConsent();
      setAnalyticsEnabled(current?.analytics ?? false);
      setMarketingEnabled(current?.marketing ?? false);
      setSettingsOpen(true);
    }
  }, [externalOpenRequest]);

  const commitChoice = (analytics: boolean, marketing: boolean) => {
    const saved = saveAndApplyConsent({ analytics, marketing });
    setAnalyticsEnabled(saved.analytics);
    setMarketingEnabled(saved.marketing);
    setBannerVisible(false);
    setSettingsOpen(false);
    onConsentChanged?.(saved);
  };

  if (!bannerVisible && !settingsOpen) {
    return null;
  }

  return (
    <>
      {/* První vrstva: Souhlas s cookies (rovnocenná tlačítka Přijmout / Odmítnout dle EU & ÚOOÚ) */}
      {bannerVisible && !settingsOpen && (
        <div
          role="dialog"
          aria-modal="false"
          aria-label="Nastavení soukromí a cookies"
          className="fixed bottom-4 left-4 right-4 z-50 max-w-4xl mx-auto animate-in slide-in-from-bottom-4 duration-200"
        >
          <div className="bg-white border border-[#D5E2EC] rounded-2xl shadow-2xl p-5 sm:p-6 text-[#0C1E34]">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#10B981] shrink-0" />
                  <h2 className="text-sm sm:text-base font-bold text-[#0C1E34]">
                    Soukromí a používání cookies
                  </h2>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Tento web používá nezbytné ukládání v prohlížeči pro uložení vašeho nastavení. S vaším souhlasem využíváme také{' '}
                  <strong className="font-semibold text-[#0C1E34]">Google Analytics 4 (Consent Mode v2)</strong>{' '}
                  pro anonymní měření návštěvnosti, zdrojů návštěv a čtenosti článků. Svou volbu můžete kdykoliv změnit v patičce stránky.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setSettingsOpen(true)}
                  className="inline-flex items-center justify-center gap-1.5 min-h-[44px] px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 hover:text-[#0C1E34] hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
                >
                  <SlidersHorizontal className="w-4 h-4 shrink-0" />
                  <span>Nastavení</span>
                </button>

                <button
                  type="button"
                  onClick={() => commitChoice(false, false)}
                  className="inline-flex items-center justify-center min-h-[44px] px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-[#0C1E34] bg-white hover:bg-slate-100 border border-[#0C1E34]/30 transition-colors cursor-pointer"
                >
                  Odmítnout vše
                </button>

                <button
                  type="button"
                  onClick={() => commitChoice(true, true)}
                  className="inline-flex items-center justify-center min-h-[44px] px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-[#0C1E34] hover:bg-[#16365C] border border-[#0C1E34] transition-colors cursor-pointer"
                >
                  Přijmout vše
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Druhá vrstva: Detailní nastavení kategorií Consent Mode v2 */}
      {settingsOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="cookie-modal-title"
          className="fixed inset-0 z-50 bg-[#0C1E34]/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setSettingsOpen(false)}
        >
          <div
            className="bg-white border border-[#D5E2EC] rounded-2xl shadow-2xl max-w-xl w-full p-6 text-[#0C1E34] space-y-5 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-4">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-[#10B981] shrink-0" />
                <div>
                  <h2 id="cookie-modal-title" className="text-base sm:text-lg font-bold text-[#0C1E34]">
                    Nastavení cookies (Consent Mode v2)
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Vyberte, které kategorie měření chcete na tomto webu povolit.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSettingsOpen(false)}
                aria-label="Zavřít nastavení cookies"
                className="p-2 text-slate-400 hover:text-[#0C1E34] rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="divide-y divide-slate-200">
              {/* Kategorie 1: Nezbytné */}
              <div className="py-4 first:pt-0 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-[#0C1E34]">Nezbytné technické ukládání</h3>
                    <span className="text-xs font-medium text-emerald-700">· Vždy aktivní</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Slouží k uložení vaší volby ohledně cookies (<code className="font-mono">functionality_storage</code>,{' '}
                    <code className="font-mono">security_storage</code>) a správnému fungování navigace webu. Bez nich by se lišta zobrazovala při každém načtení.
                  </p>
                </div>
                <span
                  aria-label="Vždy povoleno"
                  className="inline-flex items-center justify-center w-11 h-6 rounded-full bg-emerald-600 text-white shrink-0 mt-0.5"
                >
                  <Check className="w-3.5 h-3.5" />
                </span>
              </div>

              {/* Kategorie 2: Analytické (GA4) */}
              <div className="py-4 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-[#0C1E34]">
                    Analytické a statistické cookies (Google Analytics 4)
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Parametr <code className="font-mono">analytics_storage</code>. Pomáhá mi zjistit, odkud návštěvníci přicházejí (zdroje návštěvnosti) a které články či sekce čtou nejčastěji. Data jsou anonymizovaná.
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={analyticsEnabled}
                  aria-label="Povolit analytické cookies"
                  onClick={() => setAnalyticsEnabled((prev) => !prev)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0C1E34] mt-0.5 ${
                    analyticsEnabled ? 'bg-[#0C1E34]' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs transition-transform ${
                      analyticsEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Kategorie 3: Marketingové a personalizační signály */}
              <div className="py-4 last:pb-0 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-[#0C1E34]">
                    Personalizační a marketingové signály
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Parametry <code className="font-mono">ad_storage</code>, <code className="font-mono">ad_user_data</code>,{' '}
                    <code className="font-mono">ad_personalization</code> a <code className="font-mono">personalization_storage</code>. Web neobsahuje reklamy; volba nastavuje pouze signály vyžadované standardem Google Consent Mode v2.
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={marketingEnabled}
                  aria-label="Povolit personalizační a marketingové signály"
                  onClick={() => setMarketingEnabled((prev) => !prev)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0C1E34] mt-0.5 ${
                    marketingEnabled ? 'bg-[#0C1E34]' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs transition-transform ${
                      marketingEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => commitChoice(false, false)}
                className="inline-flex items-center justify-center min-h-[44px] px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-[#0C1E34] bg-white hover:bg-slate-100 border border-[#0C1E34]/30 transition-colors cursor-pointer"
              >
                Odmítnout vše
              </button>
              <button
                type="button"
                onClick={() => commitChoice(analyticsEnabled, marketingEnabled)}
                className="inline-flex items-center justify-center min-h-[44px] px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-[#0C1E34] bg-slate-100 hover:bg-slate-200 border border-slate-300 transition-colors cursor-pointer"
              >
                Uložit moje volby
              </button>
              <button
                type="button"
                onClick={() => commitChoice(true, true)}
                className="inline-flex items-center justify-center min-h-[44px] px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-[#0C1E34] hover:bg-[#16365C] border border-[#0C1E34] transition-colors cursor-pointer"
              >
                Přijmout vše
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
