import React, { useState } from 'react';
import { Smartphone, Monitor, Wifi, Battery, Signal } from 'lucide-react';

interface MobileFrameProps {
  children: React.ReactNode;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({ children }) => {
  // Option on desktop to toggle between authentic Phone Mockup Frame or Wide Canvas
  const [isPhoneFrame, setIsPhoneFrame] = useState(true);

  // Current fake digital clock for phone status bar
  const currentTime = '09:41';

  return (
    <div className="min-h-screen bg-stone-200/90 dark:bg-stone-950 flex flex-col items-center justify-start sm:p-4 md:p-6 transition-colors">
      
      {/* Top Device Viewport Switcher Toolbar (Hidden on actual mobile screens) */}
      <div className="hidden sm:flex items-center justify-between w-full max-w-md mb-3 px-2 text-xs text-stone-600 dark:text-stone-400">
        <div className="flex items-center gap-1.5 font-medium">
          <Smartphone className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
          <span>Tampilan Mobile Nusantara</span>
        </div>

        <div className="flex items-center gap-1 bg-white/80 dark:bg-stone-850 p-1 rounded-lg border border-stone-300/80 dark:border-stone-800 shadow-xs">
          <button
            type="button"
            onClick={() => setIsPhoneFrame(true)}
            className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
              isPhoneFrame
                ? 'bg-amber-800 text-white shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
            }`}
          >
            Bingkai HP
          </button>
          <button
            type="button"
            onClick={() => setIsPhoneFrame(false)}
            className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
              !isPhoneFrame
                ? 'bg-amber-800 text-white shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
            }`}
          >
            Layar Penuh
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div
        className={`w-full bg-white dark:bg-stone-900 transition-all duration-300 flex flex-col overflow-hidden ${
          isPhoneFrame
            ? 'sm:max-w-[420px] sm:h-[890px] sm:rounded-[44px] sm:border-[10px] sm:border-stone-900 sm:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.35)] sm:ring-1 sm:ring-white/20'
            : 'sm:max-w-xl sm:rounded-3xl sm:border border-stone-200 dark:border-stone-800 sm:shadow-lg'
        }`}
      >
        {/* iOS-Style Status Bar inside Phone Frame */}
        {isPhoneFrame && (
          <div className="hidden sm:flex items-center justify-between px-7 pt-3.5 pb-1 select-none z-30 bg-stone-900 text-stone-200 text-xs font-semibold">
            <span>{currentTime}</span>

            {/* Dynamic Island / Speaker Notch Pill */}
            <div className="w-24 h-4 bg-stone-950 rounded-full flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-stone-800 mr-2" />
              <div className="w-2 h-2 rounded-full bg-stone-900" />
            </div>

            <div className="flex items-center gap-1.5 text-stone-300">
              <Signal className="w-3 h-3" />
              <Wifi className="w-3 h-3" />
              <Battery className="w-3.5 h-3.5" />
            </div>
          </div>
        )}

        {/* Inner App Content */}
        <div className="flex-1 overflow-y-auto flex flex-col relative no-scrollbar">
          {children}
        </div>

        {/* Phone Bottom Home Bar */}
        {isPhoneFrame && (
          <div className="hidden sm:flex justify-center pb-2 pt-1 bg-stone-900">
            <div className="w-32 h-1 bg-stone-600 rounded-full" />
          </div>
        )}
      </div>
    </div>
  );
};
