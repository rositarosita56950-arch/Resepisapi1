import React from 'react';
import { Recipe } from '../types/recipe';
import { Clock, Star, Flame, Bookmark } from 'lucide-react';

interface RecipeCardProps {
  recipe: Recipe;
  isBookmarked: boolean;
  onToggleBookmark: (recipeId: string, e: React.MouseEvent) => void;
  onSelect: (recipe: Recipe) => void;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({
  recipe,
  isBookmarked,
  onToggleBookmark,
  onSelect,
}) => {
  return (
    <div
      onClick={() => onSelect(recipe)}
      className="group bg-white dark:bg-stone-850 rounded-2xl overflow-hidden border border-stone-200/80 dark:border-stone-800 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col active:scale-[0.99]"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(recipe);
        }
      }}
    >
      {/* Food Photography Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-200 dark:bg-stone-800">
        <img
          src={recipe.image}
          alt={recipe.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />
        {/* Measured dark gradient scrim for contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-stone-950/20 to-transparent pointer-events-none" />

        {/* Region Heritage Kicker on top-left (unboxed editorial text) */}
        <div className="absolute top-3 left-3 pointer-events-none">
          <span className="text-[11px] font-semibold tracking-wider uppercase text-amber-200 bg-stone-900/70 backdrop-blur-sm px-2.5 py-1 rounded-md">
            {recipe.regionTag}
          </span>
        </div>

        {/* Bookmark Trigger Button (Hitbox 44x44) */}
        <button
          type="button"
          onClick={(e) => onToggleBookmark(recipe.id, e)}
          aria-label={isBookmarked ? 'Hapus dari favorit' : 'Simpan ke favorit'}
          className="absolute top-2 right-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full bg-stone-900/50 hover:bg-stone-900/80 backdrop-blur-md text-white transition-all active:scale-90"
        >
          <Bookmark
            className={`w-5 h-5 transition-colors ${
              isBookmarked ? 'fill-amber-400 text-amber-400' : 'text-white'
            }`}
          />
        </button>

        {/* Bottom Bar inside Photo: Prep & Cook Time */}
        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-xs text-white/95 font-medium pointer-events-none">
          <div className="flex items-center gap-1.5 drop-shadow-sm">
            <Clock className="w-3.5 h-3.5 text-amber-300" />
            <span className="tabular-nums">{recipe.prepTime + recipe.cookTime} menit</span>
          </div>
          <div className="flex items-center gap-1 text-amber-300 drop-shadow-sm">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span className="tabular-nums font-semibold text-white">{recipe.rating}</span>
          </div>
        </div>
      </div>

      {/* Card Content & Details */}
      <div className="p-3.5 flex flex-col flex-grow justify-between">
        <div>
          <h3 className="font-semibold text-base text-stone-900 dark:text-stone-100 leading-snug line-clamp-1 group-hover:text-amber-800 dark:group-hover:text-amber-400 transition-colors">
            {recipe.shortTitle}
          </h3>
          <p className="mt-1 text-xs text-stone-500 dark:text-stone-400 line-clamp-2 leading-relaxed">
            {recipe.description}
          </p>
        </div>

        {/* Quiet Editorial Metadata separator (NO pills) */}
        <div className="mt-3 pt-2.5 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-[11px] text-stone-500 dark:text-stone-400">
          <div className="flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-rose-500" />
            <span>{recipe.spiceLevel}</span>
          </div>
          <span className="text-stone-300 dark:text-stone-700">·</span>
          <span>{recipe.difficulty}</span>
          <span className="text-stone-300 dark:text-stone-700">·</span>
          <span className="tabular-nums">{recipe.ingredients.length} Bahan</span>
        </div>
      </div>
    </div>
  );
};
