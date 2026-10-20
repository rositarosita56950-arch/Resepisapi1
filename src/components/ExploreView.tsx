import React from 'react';
import { Recipe } from '../types/recipe';
import { RecipeCard } from './RecipeCard';
import { Search, SlidersHorizontal, Sparkles, ChefHat, Clock, Star } from 'lucide-react';
import { soundFX } from '../utils/audio';

interface ExploreViewProps {
  recipes: Recipe[];
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedRegion: string;
  onRegionChange: (region: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  bookmarkedIds: string[];
  onToggleBookmark: (id: string, e: React.MouseEvent) => void;
  onSelectRecipe: (recipe: Recipe) => void;
}

export const ExploreView: React.FC<ExploreViewProps> = ({
  recipes,
  searchQuery,
  onSearchChange,
  selectedRegion,
  onRegionChange,
  selectedCategory,
  onCategoryChange,
  bookmarkedIds,
  onToggleBookmark,
  onSelectRecipe,
}) => {
  const regions = [
    'Semua Wilayah',
    'Minang',
    'Jawa Timur',
    'Betawi',
    'Bali',
    'Yogyakarta',
    'Palembang',
    'Sunda',
  ];

  const categories = [
    'Semua',
    'Daging',
    'Kuah & Sup',
    'Olahan Ikan',
    'Sate & Bakaran',
    'Sayuran',
  ];

  // Featured hero recipe (Rendang Padang)
  const heroRecipe = recipes.find((r) => r.id === 'rendang-padang') || recipes[0];

  return (
    <div className="space-y-5 pb-6">
      
      {/* Search Input Bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Cari resep (rendang, rawon, soto, bumbu...)"
          className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-stone-100 dark:bg-stone-850 border border-stone-200/80 dark:border-stone-800 text-xs sm:text-sm text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800 transition-all"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-600 px-1 py-0.5"
          >
            Hapus
          </button>
        )}
      </div>

      {/* Featured Recipe Hero Spotlight (Only shown when not searching) */}
      {!searchQuery && selectedRegion === 'Semua Wilayah' && selectedCategory === 'Semua' && (
        <div
          onClick={() => onSelectRecipe(heroRecipe)}
          className="relative rounded-3xl overflow-hidden cursor-pointer group shadow-sm hover:shadow-md transition-all border border-stone-200/80 dark:border-stone-800"
          role="button"
          tabIndex={0}
        >
          <div className="relative aspect-[16/10] w-full overflow-hidden bg-stone-900">
            <img
              src={heroRecipe.image}
              alt={heroRecipe.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent pointer-events-none" />

            {/* Editorial Kicker */}
            <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-amber-900/85 backdrop-blur-md text-amber-200 px-2.5 py-1 rounded-lg text-[11px] font-semibold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Resep Pilihan Utama</span>
            </div>

            {/* Content inside hero */}
            <div className="absolute bottom-3.5 left-4 right-4 text-white">
              <div className="text-[11px] font-semibold text-amber-300 uppercase tracking-wider mb-1">
                {heroRecipe.region}
              </div>
              <h2 className="text-xl sm:text-2xl font-bold font-serif-display leading-tight drop-shadow-md">
                {heroRecipe.title}
              </h2>

              <div className="mt-2.5 flex items-center gap-3 text-xs text-stone-200 font-medium">
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span className="tabular-nums">{heroRecipe.cookTime} mnt</span>
                </div>
                <span>·</span>
                <div className="flex items-center gap-1 text-amber-400">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span className="text-white font-semibold">{heroRecipe.rating}</span>
                </div>
                <span>·</span>
                <span>{heroRecipe.difficulty}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Region Filter Rail (Horizontal Scrollable Tabs) */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs font-semibold text-stone-500 dark:text-stone-400">
          <span>Daerah Asal Kuliner</span>
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 -mx-1 px-1">
          {regions.map((region) => {
            const isActive = selectedRegion === region;
            return (
              <button
                key={region}
                type="button"
                onClick={() => {
                  soundFX.playClick();
                  onRegionChange(region);
                }}
                className={`min-h-[38px] px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap shrink-0 transition-all active:scale-95 ${
                  isActive
                    ? 'bg-amber-800 text-white shadow-xs font-semibold'
                    : 'bg-stone-100 dark:bg-stone-850 text-stone-600 dark:text-stone-400 hover:bg-stone-200/70 border border-stone-200/60 dark:border-stone-800'
                }`}
              >
                {region}
              </button>
            );
          })}
        </div>
      </div>

      {/* Category Segmented Filter */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs font-semibold text-stone-500 dark:text-stone-400">
          <span>Kategori Sajian</span>
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 -mx-1 px-1">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  soundFX.playClick();
                  onCategoryChange(cat);
                }}
                className={`min-h-[36px] px-3 py-1.5 rounded-xl text-xs whitespace-nowrap shrink-0 transition-all active:scale-95 ${
                  isActive
                    ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 font-semibold shadow-xs'
                    : 'bg-stone-100 dark:bg-stone-850 text-stone-600 dark:text-stone-400 hover:bg-stone-200/70'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Recipes Header */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-1.5">
          <ChefHat className="w-4 h-4 text-amber-700 dark:text-amber-400" />
          <h2 className="text-sm font-bold text-stone-900 dark:text-stone-100">
            Daftar Resep Otentik
          </h2>
        </div>
        <span className="text-xs text-stone-500 tabular-nums font-medium">
          {recipes.length} Resep Masakan
        </span>
      </div>

      {/* Recipes Grid */}
      {recipes.length === 0 ? (
        <div className="p-8 text-center space-y-2 bg-white dark:bg-stone-850 rounded-2xl border border-stone-200 dark:border-stone-800">
          <p className="text-sm font-semibold text-stone-800 dark:text-stone-200">
            Tidak ada resep yang sesuai pencarian
          </p>
          <p className="text-xs text-stone-500">
            Coba gunakan kata kunci lain atau reset filter wilayah dan kategori.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {recipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              isBookmarked={bookmarkedIds.includes(recipe.id)}
              onToggleBookmark={onToggleBookmark}
              onSelect={onSelectRecipe}
            />
          ))}
        </div>
      )}
    </div>
  );
};
