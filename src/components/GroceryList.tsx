import React, { useState } from 'react';
import { GroceryItem } from '../types/recipe';
import { 
  ShoppingBag, Check, Trash2, Copy, CheckCircle2, 
  ArrowRight, UtensilsCrossed 
} from 'lucide-react';
import { soundFX } from '../utils/audio';

interface GroceryListProps {
  items: GroceryItem[];
  onToggleItem: (id: string) => void;
  onDeleteItem: (id: string) => void;
  onClearCompleted: () => void;
  onClearAll: () => void;
  onNavigateToExplore: () => void;
}

export const GroceryList: React.FC<GroceryListProps> = ({
  items,
  onToggleItem,
  onDeleteItem,
  onClearCompleted,
  onClearAll,
  onNavigateToExplore,
}) => {
  const [copiedToast, setCopiedToast] = useState(false);

  // Group by recipe title
  const groupedByRecipe = items.reduce<Record<string, GroceryItem[]>>((acc, item) => {
    if (!acc[item.recipeTitle]) {
      acc[item.recipeTitle] = [];
    }
    acc[item.recipeTitle].push(item);
    return acc;
  }, {});

  const totalCount = items.length;
  const completedCount = items.filter((i) => i.completed).length;

  const handleCopyForWhatsApp = () => {
    soundFX.playClick();
    if (items.length === 0) return;

    let text = `🛒 *DAFTAR BELANJA MASAKAN TRADISIONAL*\n`;
    text += `Dibuat melalui Dapur Nusantara\n\n`;

    Object.entries(groupedByRecipe).forEach(([recipeTitle, recipeItems]) => {
      text += `📌 *${recipeTitle}*\n`;
      recipeItems.forEach((it) => {
        const checkMark = it.completed ? '✅' : '⬜';
        text += `${checkMark} ${it.name} (${it.amount} ${it.unit})\n`;
      });
      text += `\n`;
    });

    navigator.clipboard.writeText(text);
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 2500);
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-6 text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-amber-100 dark:bg-amber-950/40 flex items-center justify-center text-amber-800 dark:text-amber-400">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100">
            Daftar Belanja Masih Kosong
          </h3>
          <p className="text-xs text-stone-500 max-w-xs leading-relaxed">
            Pilih resep masakan tradisional favoritmu, lalu ketuk tombol "Ke Daftar Belanja" untuk mencatat bahan-bahan yang perlu dibeli di pasar.
          </p>
        </div>
        <button
          type="button"
          onClick={onNavigateToExplore}
          className="min-h-[44px] px-5 rounded-xl bg-amber-800 hover:bg-amber-900 text-white text-xs font-semibold flex items-center gap-2 shadow-sm transition-all active:scale-95"
        >
          <span>Jelajahi Resep Tradisional</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-8">
      {/* Header Summary & Actions */}
      <div className="bg-white dark:bg-stone-850 p-4 rounded-2xl border border-stone-200/80 dark:border-stone-800 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-amber-700 dark:text-amber-400" />
              <span>Daftar Belanja Pasar</span>
            </h2>
            <p className="text-xs text-stone-500">
              <span className="tabular-nums font-semibold text-stone-800 dark:text-stone-200">{completedCount}</span> dari <span className="tabular-nums">{totalCount}</span> bahan terbeli
            </p>
          </div>

          <button
            type="button"
            onClick={handleCopyForWhatsApp}
            className="min-h-[40px] px-3 rounded-xl bg-amber-800 text-white hover:bg-amber-900 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Salin WA</span>
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-stone-100 dark:bg-stone-800 rounded-full h-2 overflow-hidden">
          <div
            className="bg-amber-600 h-2 transition-all duration-300"
            style={{ width: `${(completedCount / totalCount) * 100}%` }}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-1 text-xs">
          {completedCount > 0 && (
            <button
              type="button"
              onClick={() => {
                soundFX.playClick();
                onClearCompleted();
              }}
              className="text-stone-600 dark:text-stone-400 hover:text-amber-800 dark:hover:text-amber-300 font-medium"
            >
              Hapus yang Sudah Dibeli
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              if (window.confirm('Kosongkan semua daftar belanja?')) {
                soundFX.playClick();
                onClearAll();
              }
            }}
            className="text-rose-600 dark:text-rose-400 hover:text-rose-700 ml-auto font-medium"
          >
            Kosongkan Semua
          </button>
        </div>
      </div>

      {/* Grouped Lists */}
      <div className="space-y-4">
        {Object.entries(groupedByRecipe).map(([recipeTitle, recipeItems]) => (
          <div
            key={recipeTitle}
            className="bg-white dark:bg-stone-850 rounded-2xl border border-stone-200/80 dark:border-stone-800 overflow-hidden"
          >
            <div className="px-4 py-2.5 bg-stone-50 dark:bg-stone-800/60 border-b border-stone-200/60 dark:border-stone-800 flex items-center gap-2">
              <UtensilsCrossed className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
              <h3 className="text-xs font-bold text-stone-800 dark:text-stone-200 tracking-wide">
                {recipeTitle}
              </h3>
            </div>

            <div className="divide-y divide-stone-100 dark:divide-stone-800">
              {recipeItems.map((item) => (
                <div
                  key={item.id}
                  className="px-4 py-3 flex items-center justify-between hover:bg-stone-50/50 dark:hover:bg-stone-800/30 transition-colors"
                >
                  <div
                    onClick={() => {
                      soundFX.playClick();
                      onToggleItem(item.id);
                    }}
                    className="flex items-center gap-3 flex-grow cursor-pointer"
                  >
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                        item.completed
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'border-stone-300 dark:border-stone-600 bg-stone-50 dark:bg-stone-800'
                      }`}
                    >
                      {item.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>

                    <span
                      className={`text-sm ${
                        item.completed
                          ? 'line-through text-stone-400 dark:text-stone-500'
                          : 'text-stone-800 dark:text-stone-200 font-medium'
                      }`}
                    >
                      {item.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 ml-2">
                    <span className="text-xs font-semibold text-stone-600 dark:text-stone-400 tabular-nums">
                      {item.amount} {item.unit}
                    </span>

                    <button
                      type="button"
                      onClick={() => {
                        soundFX.playClick();
                        onDeleteItem(item.id);
                      }}
                      className="w-7 h-7 flex items-center justify-center text-stone-400 hover:text-rose-600 transition-colors"
                      aria-label="Hapus bahan"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Copy Toast */}
      {copiedToast && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-stone-900 text-white text-xs px-4 py-2 rounded-full shadow-lg flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Daftar belanja disalin dalam format WhatsApp!</span>
        </div>
      )}
    </div>
  );
};
