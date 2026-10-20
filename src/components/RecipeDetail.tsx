import React, { useState } from 'react';
import { Recipe, Ingredient } from '../types/recipe';
import { 
  ArrowLeft, Bookmark, Share2, Users, Clock, Flame, 
  ChefHat, Plus, Minus, ShoppingBag, Play, Check, 
  Info, Sparkles, CheckCircle2 
} from 'lucide-react';
import { soundFX } from '../utils/audio';

interface RecipeDetailProps {
  recipe: Recipe;
  isBookmarked: boolean;
  onToggleBookmark: (recipeId: string) => void;
  onClose: () => void;
  onAddToGrocery: (items: Ingredient[], recipeTitle: string, recipeId: string, servingsMultiplier: number) => void;
  onStartCookingMode: (recipe: Recipe) => void;
}

export const RecipeDetail: React.FC<RecipeDetailProps> = ({
  recipe,
  isBookmarked,
  onToggleBookmark,
  onClose,
  onAddToGrocery,
  onStartCookingMode,
}) => {
  const [servings, setServings] = useState(recipe.defaultServings);
  const [checkedIngredients, setCheckedIngredients] = useState<Record<string, boolean>>({});
  const [showShareToast, setShowShareToast] = useState(false);
  const [groceryAddedToast, setGroceryAddedToast] = useState(false);

  const multiplier = servings / recipe.defaultServings;

  const handleServingChange = (delta: number) => {
    soundFX.playClick();
    setServings((prev) => {
      const next = prev + delta;
      return next >= 1 && next <= 20 ? next : prev;
    });
  };

  const toggleIngredientChecked = (id: string) => {
    soundFX.playClick();
    setCheckedIngredients((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleShare = async () => {
    soundFX.playClick();
    const shareText = `Resep Tradisional: ${recipe.title} khas ${recipe.region}. Waktu masak: ${recipe.cookTime} menit.`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: recipe.title,
          text: shareText,
          url: window.location.href,
        });
        return;
      } catch {
        // Fallback to clipboard
      }
    }
    navigator.clipboard.writeText(`${shareText}\n${window.location.href}`);
    setShowShareToast(true);
    setTimeout(() => setShowShareToast(false), 2500);
  };

  const handleAddAllToGrocery = () => {
    soundFX.playClick();
    onAddToGrocery(recipe.ingredients, recipe.title, recipe.id, multiplier);
    setGroceryAddedToast(true);
    setTimeout(() => setGroceryAddedToast(false), 2500);
  };

  // Group ingredients by section
  const sections = ['Bahan Utama', 'Bumbu Halus', 'Bumbu Aromatik & Pelengkap'] as const;

  const formatAmount = (baseAmount: number, mult: number) => {
    const val = baseAmount * mult;
    if (Number.isInteger(val)) return val.toString();
    return parseFloat(val.toFixed(1)).toString();
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm overflow-y-auto flex flex-col justify-end sm:justify-center items-center">
      <div className="w-full max-w-xl bg-white dark:bg-stone-900 min-h-screen sm:min-h-0 sm:max-h-[92vh] sm:rounded-3xl shadow-2xl overflow-y-auto relative flex flex-col">
        
        {/* Top Floating App Bar */}
        <div className="sticky top-0 z-30 flex items-center justify-between px-4 py-3 bg-white/90 dark:bg-stone-900/90 backdrop-blur-md border-b border-stone-200/80 dark:border-stone-800">
          <button
            type="button"
            onClick={onClose}
            className="min-w-[44px] min-h-[44px] rounded-full flex items-center justify-center text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            aria-label="Kembali"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <span className="text-sm font-semibold text-stone-900 dark:text-stone-100 truncate max-w-[200px]">
            {recipe.shortTitle}
          </span>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleShare}
              className="min-w-[44px] min-h-[44px] rounded-full flex items-center justify-center text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              aria-label="Bagikan resep"
            >
              <Share2 className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => onToggleBookmark(recipe.id)}
              className="min-w-[44px] min-h-[44px] rounded-full flex items-center justify-center text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              aria-label={isBookmarked ? 'Hapus dari favorit' : 'Simpan favorit'}
            >
              <Bookmark
                className={`w-5 h-5 ${
                  isBookmarked ? 'fill-amber-600 text-amber-600' : ''
                }`}
              />
            </button>
          </div>
        </div>

        {/* Hero Food Photography */}
        <div className="relative aspect-[16/11] w-full overflow-hidden bg-stone-200 dark:bg-stone-800">
          <img
            src={recipe.image}
            alt={recipe.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/25 to-transparent pointer-events-none" />

          {/* Regional Heritage Badge */}
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <div className="text-xs uppercase tracking-wider font-semibold text-amber-300 mb-1 flex items-center gap-1.5">
              <span>Warisan Kuliner</span>
              <span>·</span>
              <span>{recipe.region}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-serif-display leading-tight drop-shadow-md">
              {recipe.title}
            </h1>
          </div>
        </div>

        {/* Main Body Details */}
        <div className="p-5 space-y-6 flex-grow pb-28">
          
          {/* Quick Metrics Bar (Unboxed text with quiet separators) */}
          <div className="grid grid-cols-4 divide-x divide-stone-200 dark:divide-stone-800 py-3 bg-stone-50 dark:bg-stone-850 rounded-2xl border border-stone-200/60 dark:border-stone-800 text-center">
            <div className="px-1 flex flex-col items-center">
              <span className="text-[10px] text-stone-500 uppercase tracking-tight">Persiapan</span>
              <span className="text-xs font-bold text-stone-800 dark:text-stone-200 mt-0.5 tabular-nums">
                {recipe.prepTime} mnt
              </span>
            </div>
            <div className="px-1 flex flex-col items-center">
              <span className="text-[10px] text-stone-500 uppercase tracking-tight">Memasak</span>
              <span className="text-xs font-bold text-stone-800 dark:text-stone-200 mt-0.5 tabular-nums">
                {recipe.cookTime} mnt
              </span>
            </div>
            <div className="px-1 flex flex-col items-center">
              <span className="text-[10px] text-stone-500 uppercase tracking-tight">Tingkat</span>
              <span className="text-xs font-bold text-stone-800 dark:text-stone-200 mt-0.5">
                {recipe.difficulty}
              </span>
            </div>
            <div className="px-1 flex flex-col items-center">
              <span className="text-[10px] text-stone-500 uppercase tracking-tight">Pedas</span>
              <span className="text-xs font-bold text-rose-700 dark:text-rose-400 mt-0.5">
                {recipe.spiceLevel}
              </span>
            </div>
          </div>

          {/* Description & Cultural Origin */}
          <div className="space-y-3">
            <p className="text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
              {recipe.description}
            </p>

            <div className="p-3.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 text-xs text-stone-700 dark:text-amber-200/90 leading-relaxed flex items-start gap-2.5">
              <Info className="w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block text-amber-900 dark:text-amber-300 mb-0.5">
                  Asal Usul & Filosofi Masakan
                </span>
                {recipe.history}
              </div>
            </div>
          </div>

          {/* Portion Scaler Section */}
          <div className="pt-2">
            <div className="flex items-center justify-between p-3.5 bg-stone-100/80 dark:bg-stone-850 rounded-2xl border border-stone-200/80 dark:border-stone-800">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-amber-700 dark:text-amber-400" />
                <span className="text-xs font-semibold text-stone-800 dark:text-stone-200">
                  Takaran Porsi
                </span>
                <span className="text-[11px] text-stone-500">
                  (Jumlah bumbu otomatis dihitung)
                </span>
              </div>

              <div className="flex items-center gap-2 bg-white dark:bg-stone-800 px-2 py-1 rounded-xl shadow-sm border border-stone-200 dark:border-stone-700">
                <button
                  type="button"
                  onClick={() => handleServingChange(-1)}
                  disabled={servings <= 1}
                  className="w-7 h-7 flex items-center justify-center rounded-lg text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                  aria-label="Kurangi porsi"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="text-sm font-bold text-stone-900 dark:text-stone-100 tabular-nums px-1">
                  {servings} Porsi
                </span>
                <button
                  type="button"
                  onClick={() => handleServingChange(1)}
                  disabled={servings >= 20}
                  className="w-7 h-7 flex items-center justify-center rounded-lg text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                  aria-label="Tambah porsi"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Ingredients Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                  <ChefHat className="w-4 h-4 text-amber-700 dark:text-amber-400" />
                  <span>Daftar Bahan & Bumbu</span>
                </h3>
                <span className="text-xs text-stone-500">
                  Centang bahan yang sudah disiapkan di dapur
                </span>
              </div>

              <button
                type="button"
                onClick={handleAddAllToGrocery}
                className="min-h-[40px] px-3 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-750 text-stone-800 dark:text-stone-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
                <span className="whitespace-nowrap">Ke Daftar Belanja</span>
              </button>
            </div>

            {/* Ingredients by Group */}
            <div className="space-y-5">
              {sections.map((sectionName) => {
                const sectionItems = recipe.ingredients.filter((item) => item.section === sectionName);
                if (sectionItems.length === 0) return null;

                return (
                  <div key={sectionName} className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                      {sectionName}
                    </h4>
                    <div className="divide-y divide-stone-100 dark:divide-stone-800 border border-stone-200/70 dark:border-stone-800 rounded-2xl overflow-hidden bg-white dark:bg-stone-850">
                      {sectionItems.map((item) => {
                        const isChecked = !!checkedIngredients[item.id];
                        return (
                          <div
                            key={item.id}
                            onClick={() => toggleIngredientChecked(item.id)}
                            className="p-3 flex items-center justify-between hover:bg-stone-50/80 dark:hover:bg-stone-800/50 cursor-pointer transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                                  isChecked
                                    ? 'bg-amber-700 border-amber-700 text-white'
                                    : 'border-stone-300 dark:border-stone-600 bg-stone-50 dark:bg-stone-800'
                                }`}
                              >
                                {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                              </div>
                              <div>
                                <span
                                  className={`text-sm ${
                                    isChecked
                                      ? 'line-through text-stone-400 dark:text-stone-500'
                                      : 'text-stone-800 dark:text-stone-200 font-medium'
                                  }`}
                                >
                                  {item.name}
                                </span>
                                {item.note && (
                                  <span className="block text-[11px] text-stone-400">
                                    {item.note}
                                  </span>
                                )}
                              </div>
                            </div>

                            <span className="text-xs font-semibold text-stone-600 dark:text-stone-400 tabular-nums shrink-0 ml-2">
                              {formatAmount(item.baseAmount, multiplier)} {item.unit}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Cooking Steps Overview */}
          <div className="space-y-3 pt-2">
            <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
              Tahapan Pengolahan ({recipe.steps.length} Langkah)
            </h3>
            
            <div className="space-y-3">
              {recipe.steps.map((st) => (
                <div
                  key={st.stepNumber}
                  className="p-4 rounded-2xl bg-white dark:bg-stone-850 border border-stone-200/80 dark:border-stone-800 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wide">
                      Langkah {st.stepNumber}: {st.title}
                    </span>
                    {st.durationMinutes && (
                      <span className="text-[11px] font-medium text-stone-400 tabular-nums">
                        ~{st.durationMinutes} menit
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
                    {st.instruction}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Chef's Secret Tip Box */}
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300/80 dark:border-amber-800/50 space-y-1">
            <div className="flex items-center gap-2 text-amber-900 dark:text-amber-300 font-bold text-xs uppercase tracking-wide">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Rahasia Dapur Turun Temurun</span>
            </div>
            <p className="text-xs sm:text-sm text-stone-800 dark:text-amber-200/90 leading-relaxed">
              {recipe.chefTip}
            </p>
          </div>
        </div>

        {/* Sticky Mobile CTA: Start Interactive Cooking Mode */}
        <div className="fixed sm:absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-white via-white/95 to-transparent dark:from-stone-900 dark:via-stone-900/95 pb-safe z-30 border-t sm:border-t-0 border-stone-200 dark:border-stone-800">
          <button
            type="button"
            onClick={() => {
              soundFX.playClick();
              onStartCookingMode(recipe);
            }}
            className="w-full h-13 rounded-2xl bg-amber-800 hover:bg-amber-900 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-900/20 active:scale-[0.98] transition-transform"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Mulai Masak (Panduan Langkah & Timer)</span>
          </button>
        </div>

        {/* Toast Feedbacks */}
        {showShareToast && (
          <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-stone-900 text-white text-xs px-4 py-2 rounded-full shadow-lg">
            Tautan resep disalin ke papan klip!
          </div>
        )}

        {groceryAddedToast && (
          <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-emerald-800 text-white text-xs px-4 py-2 rounded-full shadow-lg flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            <span>Bahan berhasil ditambahkan ke Daftar Belanja!</span>
          </div>
        )}
      </div>
    </div>
  );
};
