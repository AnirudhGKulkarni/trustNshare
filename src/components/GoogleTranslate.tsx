import React, { useEffect, useRef } from "react";

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: any;
  }
}

const GOOGLE_TRANSLATE_SCRIPT_ID = "google-translate-script";

// Language codes restricted to Indian languages + English
// hi (Hindi), kn (Kannada), ta (Tamil), te (Telugu), ml (Malayalam),
// mr (Marathi), gu (Gujarati), bn (Bengali), pa (Punjabi), or (Odia), en (English)
const INCLUDED_LANGUAGES = "en,hi,kn,ta,te,ml,mr,gu,bn,pa,or";

function setCookie(name: string, value: string, days = 365) {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
}

function getCookie(name: string) {
  const nameEQ = name + "=";
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

const GoogleTranslate: React.FC<{ compact?: boolean }> = ({ compact = true }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Ensure only one script load and init
    const ensureInit = () => {
      window.googleTranslateElementInit = () => {
        try {
          if (!containerRef.current) return;
          // Initialize widget
          new window.google.translate.TranslateElement(
            {
              pageLanguage: "en",
              includedLanguages: INCLUDED_LANGUAGES,
              autoDisplay: false,
              layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
            },
            containerRef.current.id
          );

          // Apply saved preference if present
          const saved = localStorage.getItem("preferredLang");
          if (saved && saved !== "en") {
            setCookie("googtrans", `/en/${saved}`);
          }

          // Attach change listener once the select exists
          const attachListener = () => {
            const select = containerRef.current?.querySelector("select.goog-te-combo") as HTMLSelectElement | null;
            if (select) {
              // Pre-select from cookie/localStorage if set
              const cookie = getCookie("googtrans");
              const fromCookie = cookie?.split("/").pop();
              if (fromCookie) select.value = fromCookie;

              select.addEventListener("change", () => {
                const lang = select.value;
                localStorage.setItem("preferredLang", lang);
                // Set cookie to persist language
                setCookie("googtrans", `/en/${lang}`);
              });
              return true;
            }
            return false;
          };

          let attempts = 0;
          const iv = setInterval(() => {
            attempts++;
            if (attachListener() || attempts > 50) {
              clearInterval(iv);
            }
          }, 100);
        } catch (e) {
          // no-op
        }
      };
    };

    // If google is already loaded, just run init
    if (window.google && window.google.translate) {
      ensureInit();
      window.googleTranslateElementInit?.();
      return;
    }

    // Load script if not already present
    const existing = document.getElementById(GOOGLE_TRANSLATE_SCRIPT_ID) as HTMLScriptElement | null;
    if (!existing) {
      ensureInit();
      const s = document.createElement("script");
      s.id = GOOGLE_TRANSLATE_SCRIPT_ID;
      s.type = "text/javascript";
      s.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      s.defer = true;
      document.body.appendChild(s);
    } else {
      // Script exists but maybe not initialized yet
      ensureInit();
      // If it has already loaded, fire init; otherwise it will call back
      if ((existing as any).dataset.loaded === "true") {
        window.googleTranslateElementInit?.();
      } else {
        existing.addEventListener("load", () => {
          (existing as any).dataset.loaded = "true";
          window.googleTranslateElementInit?.();
        });
      }
    }
  }, []);

  return (
    <div
      id="google_translate_element_container"
      className={`${compact ? "min-w-[110px]" : "min-w-[140px]"} inline-flex items-center`}
    >
      <div
        id="google_translate_element"
        ref={containerRef}
        className="gt-inline"
      />
    </div>
  );
};

export default GoogleTranslate;
