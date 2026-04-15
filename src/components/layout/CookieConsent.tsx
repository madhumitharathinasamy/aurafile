"use client";

import { useState, useEffect } from "react";
import { Icon } from "@/components/ui/Icon";

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  // Settings toggle states
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false);
  const [adsEnabled, setAdsEnabled] = useState(false);

  useEffect(() => {
    // Event listener for opening settings via Footer or other components
    const handleOpenCookieSettings = () => {
      setIsVisible(true);
      setShowSettings(true);
    };
    window.addEventListener("open-cookie-settings", handleOpenCookieSettings);

    // Check if consent has already been given or rejected
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      setIsVisible(true);
    } else {
      // Setup the state if they previously interacted
      try {
        const parsed = JSON.parse(consent);
        if (parsed.analytics) setAnalyticsEnabled(true);
        if (parsed.ads) setAdsEnabled(true);
        
        // Push update to gtag
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag("consent", "update", {
            analytics_storage: parsed.analytics ? "granted" : "denied",
            ad_storage: parsed.ads ? "granted" : "denied",
            ad_user_data: parsed.ads ? "granted" : "denied",
            ad_personalization: parsed.ads ? "granted" : "denied",
          });
        }
      } catch (e) {
        // If it was just "accepted" or "rejected" legacy string
        if (consent === "accepted") {
          updateConsentState(true, true);
        }
      }
    }

    return () => window.removeEventListener("open-cookie-settings", handleOpenCookieSettings);
  }, []);

  const updateConsentState = (analytics: boolean, ads: boolean) => {
    localStorage.setItem("cookie-consent", JSON.stringify({ analytics, ads }));
    setIsVisible(false);
    
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag("consent", "update", {
        analytics_storage: analytics ? "granted" : "denied",
        ad_storage: ads ? "granted" : "denied",
        ad_user_data: ads ? "granted" : "denied",
        ad_personalization: ads ? "granted" : "denied",
      });
    }
  };

  const handleAcceptAll = () => updateConsentState(true, true);
  const handleRejectAll = () => updateConsentState(false, false);
  const handleSaveSettings = () => updateConsentState(analyticsEnabled, adsEnabled);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] md:bottom-6 md:left-6 md:right-auto md:max-w-[420px] w-full p-3 md:p-4 pointer-events-none fade-in">
      <div className="bg-white/95 backdrop-blur-xl border border-slate-200 shadow-[0_-10px_40px_rgba(0,0,0,0.08)] md:shadow-2xl rounded-2xl p-4 md:p-5 pointer-events-auto flex flex-col gap-3 md:gap-4 relative overflow-hidden">
        
        {/* Decorative Top Accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-emerald-400"></div>

        {!showSettings ? (
          <div className="flex flex-col gap-3">
            <div className="flex items-start gap-3">
              <div className="text-[28px] leading-none select-none mt-1 shadow-sm">🍪</div>
              <div>
                <h3 className="font-bold text-slate-900 text-[15px] leading-tight mb-1">We value your privacy</h3>
                <p className="text-slate-600 text-[13px] leading-snug">
                  We use cookies for analytics and ads. 
                  <strong className="text-slate-900 font-semibold"> Your files are never uploaded.</strong>
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2 mt-1">
              <div className="flex gap-2 w-full">
                <button 
                  onClick={handleRejectAll}
                  className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-all text-[13px]"
                >
                  Reject
                </button>
                <button 
                  onClick={handleAcceptAll}
                  className="flex-1 py-2 bg-[#00B4D8] hover:bg-[#0096b7] text-slate-900 font-semibold rounded-lg transition-all shadow-sm shadow-[#00B4D8]/20 text-[13px]"
                >
                  Accept
                </button>
              </div>
              <button 
                onClick={() => setShowSettings(true)}
                className="w-full py-1.5 text-slate-600 hover:text-slate-900 font-medium text-[12px] transition-colors"
              >
                Manage Preferences
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <h3 className="font-bold text-slate-900 text-[15px]">Cookie Preferences</h3>
            
            <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/60 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-slate-900 text-[13px]">Necessary</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Required for the site to function</p>
                </div>
                <div className="w-8 h-4 bg-primary rounded-full relative opacity-40 cursor-not-allowed">
                  <div className="absolute right-0.5 top-0.5 w-3 h-3 bg-white rounded-full"></div>
                </div>
              </div>
              
              <div className="w-full h-px bg-slate-200/60"></div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-slate-900 text-[13px]">Analytics</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Google Analytics traffic data</p>
                </div>
                <button 
                  onClick={() => setAnalyticsEnabled(!analyticsEnabled)}
                  className={`w-8 h-4 rounded-full relative transition-colors duration-300 ${analyticsEnabled ? 'bg-primary' : 'bg-slate-300'}`}
                  aria-label="Toggle Analytics"
                >
                  <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-transform duration-300 ${analyticsEnabled ? 'translate-x-[18px]' : 'translate-x-0.5'}`}></div>
                </button>
              </div>

              <div className="w-full h-px bg-slate-200/60"></div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-slate-900 text-[13px]">Marketing</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Personalized AdSense ads</p>
                </div>
                <button 
                  onClick={() => setAdsEnabled(!adsEnabled)}
                  className={`w-8 h-4 rounded-full relative transition-colors duration-300 ${adsEnabled ? 'bg-[#00B4D8]' : 'bg-slate-300'}`}
                  aria-label="Toggle Marketing"
                >
                  <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-transform duration-300 ${adsEnabled ? 'translate-x-[18px]' : 'translate-x-0.5'}`}></div>
                </button>
              </div>
            </div>

            <button 
              onClick={handleSaveSettings}
              className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg transition-all shadow-sm text-[13px] mt-1"
            >
              Save Preferences
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
