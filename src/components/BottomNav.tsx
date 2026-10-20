import React from 'react';
import { Compass, Bookmark, ShoppingBag, BookOpen } from 'lucide-react';

export type NavTab = 'jelajah' | 'favorit' | 'belanja' | 'tips';

interface BottomNavProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  favoritesCount: number;
  groceryPendingCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  favoritesCount,
  groceryPendingCount,
}) => {
  return (
    <nav 
      aria-label="Navigasi Bawah"
      className="sticky bottom-0 z-40 w-full bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border-t border-stone-200 dark:border-stone-800 shadow-[0_-4px_16px_rgba(0,0,0,0.04)] pb-safe"
    >
      <div className="grid grid-cols-4 items-center h-16 max-w-md mx-auto px-2">
        {/* Tab 1: Jelajah */}
        <button
          type="button"
          onClick={() => onTabChange('jelajah')}
          className={`flex flex-col items-center justify-center min-h-[48px] min-w-[48px] rounded-xl transition-all duration-150 active:scale-95 ${
            activeTab === 'jelajah'
              ? 'text-amber-800 dark:text-amber-400 font-semibold'
              : 'text-stone-500 hover:text-stone-800 dark:text-stone-400 font-medium'
          }`}
        >
          <div className="relative">
            <Compass className={`w-5 h-5 transition-transform ${activeTab === 'jelajah' ? 'scale-110' : ''}`} />
          </div>
          <span className="text-[11px] mt-1 tracking-tight">Jelajah</span>
        </button>

        {/* Tab 2: Favorit */}
        <button
          type="button"
          onClick={() => onTabChange('favorit')}
          className={`flex flex-col items-center justify-center min-h-[48px] min-w-[48px] rounded-xl transition-all duration-150 active:scale-95 relative ${
            activeTab === 'favorit'
              ? 'text-amber-800 dark:text-amber-400 font-semibold'
              : 'text-stone-500 hover:text-stone-800 dark:text-stone-400 font-medium'
          }`}
        >
          <div className="relative">
            <Bookmark className={`w-5 h-5 transition-transform ${activeTab === 'favorit' ? 'scale-110 fill-current' : ''}`} />
            {favoritesCount > 0 && (
              <span className="absolute -top-1 -right-2.5 bg-amber-700 text-white text-[10px] font-bold h-4 min-w-[16px] px-1 rounded-full flex items-center justify-center">
                {favoritesCount}
              </span>
            )}
          </div>
          <span className="text-[11px] mt-1 tracking-tight">Favorit</span>
        </button>

        {/* Tab 3: Belanja */}
        <button
          type="button"
          onClick={() => onTabChange('belanja')}
          className={`flex flex-col items-center justify-center min-h-[48px] min-w-[48px] rounded-xl transition-all duration-150 active:scale-95 relative ${
            activeTab === 'belanja'
              ? 'text-amber-800 dark:text-amber-400 font-semibold'
              : 'text-stone-500 hover:text-stone-800 dark:text-stone-400 font-medium'
          }`}
        >
          <div className="relative">
            <ShoppingBag className={`w-5 h-5 transition-transform ${activeTab === 'belanja' ? 'scale-110' : ''}`} />
            {groceryPendingCount > 0 && (
              <span className="absolute -top-1 -right-2.5 bg-rose-700 text-white text-[10px] font-bold h-4 min-w-[16px] px-1 rounded-full flex items-center justify-center">
                {groceryPendingCount}
              </span>
            )}
          </div>
          <span className="text-[11px] mt-1 tracking-tight">Belanja</span>
        </button>

        {/* Tab 4: Tips Dapur */}
        <button
          type="button"
          onClick={() => onTabChange('tips')}
          className={`flex flex-col items-center justify-center min-h-[48px] min-w-[48px] rounded-xl transition-all duration-150 active:scale-95 ${
            activeTab === 'tips'
              ? 'text-amber-800 dark:text-amber-400 font-semibold'
              : 'text-stone-500 hover:text-stone-800 dark:text-stone-400 font-medium'
          }`}
        >
          <div className="relative">
            <BookOpen className={`w-5 h-5 transition-transform ${activeTab === 'tips' ? 'scale-110' : ''}`} />
          </div>
          <span className="text-[11px] mt-1 tracking-tight">Tips Dapur</span>
        </button>
      </div>
    </nav>
  );
};
