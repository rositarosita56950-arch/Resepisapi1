import React, { useState, useEffect, useMemo } from 'react';
import { TRADITIONAL_RECIPES } from './data/recipes';
import { Recipe, Ingredient, GroceryItem } from './types/recipe';
import { MobileFrame } from './components/MobileFrame';
import { BottomNav, NavTab } from './components/BottomNav';
import { ExploreView } from './components/ExploreView';
import { RecipeDetail } from './components/RecipeDetail';
import { CookingModeModal } from './components/CookingModeModal';
import { GroceryList } from './components/GroceryList';
import { KitchenTips } from './components/KitchenTips';
import { RecipeCard } from './components/RecipeCard';
import { Utensils, Bookmark, Flame, Heart } from 'lucide-react';
import { soundFX } from './utils/audio';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('jelajah');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('Semua Wilayah');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  
  // Selected recipe for detail modal
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  
  // Recipe for fullscreen cooking mode
  const [cookingModeRecipe, setCookingModeRecipe] = useState<Recipe | null>(null);

  // Bookmarks persistence
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('dapur_nusantara_bookmarks');
      return saved ? JSON.parse(saved) : ['rendang-padang', 'rawon-surabaya'];
    } catch {
      return ['rendang-padang', 'rawon-surabaya'];
    }
  });

  // Grocery list persistence
  const [groceryItems, setGroceryItems] = useState<GroceryItem[]>(() => {
    try {
      const saved = localStorage.getItem('dapur_nusantara_grocery');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('dapur_nusantara_bookmarks', JSON.stringify(bookmarkedIds));
    } catch {
      // Ignore
    }
  }, [bookmarkedIds]);

  useEffect(() => {
    try {
      localStorage.setItem('dapur_nusantara_grocery', JSON.stringify(groceryItems));
    } catch {
      // Ignore
    }
  }, [groceryItems]);

  const toggleBookmark = (recipeId: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    soundFX.playClick();
    setBookmarkedIds((prev) =>
      prev.includes(recipeId) ? prev.filter((id) => id !== recipeId) : [...prev, recipeId]
    );
  };

  // Add items from recipe to grocery shopping list
  const handleAddToGrocery = (
    items: Ingredient[],
    recipeTitle: string,
    recipeId: string,
    servingsMultiplier: number
  ) => {
    setGroceryItems((prev) => {
      const nextItems = [...prev];
      items.forEach((ing) => {
        const scaledAmount = Number.isInteger(ing.baseAmount * servingsMultiplier)
          ? ing.baseAmount * servingsMultiplier
          : parseFloat((ing.baseAmount * servingsMultiplier).toFixed(1));

        // Check if item already exists for this recipe
        const existingIdx = nextItems.findIndex(
          (it) => it.recipeId === recipeId && it.name.toLowerCase() === ing.name.toLowerCase()
        );

        if (existingIdx >= 0) {
          nextItems[existingIdx].amount = scaledAmount;
          nextItems[existingIdx].completed = false;
        } else {
          nextItems.push({
            id: `${recipeId}_${ing.id}_${Date.now()}_${Math.random()}`,
            recipeId,
            recipeTitle,
            name: ing.name,
            amount: scaledAmount,
            unit: ing.unit,
            completed: false,
          });
        }
      });
      return nextItems;
    });
  };

  const handleToggleGroceryItem = (id: string) => {
    setGroceryItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item))
    );
  };

  const handleDeleteGroceryItem = (id: string) => {
    setGroceryItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearCompletedGrocery = () => {
    setGroceryItems((prev) => prev.filter((item) => !item.completed));
  };

  const handleClearAllGrocery = () => {
    setGroceryItems([]);
  };

  // Filtered recipes
  const filteredRecipes = useMemo(() => {
    return TRADITIONAL_RECIPES.filter((r) => {
      // Search matching
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = r.title.toLowerCase().includes(q) || r.shortTitle.toLowerCase().includes(q);
        const matchesRegion = r.region.toLowerCase().includes(q) || r.regionTag.toLowerCase().includes(q);
        const matchesIngredient = r.ingredients.some((ing) => ing.name.toLowerCase().includes(q));
        if (!matchesTitle && !matchesRegion && !matchesIngredient) {
          return false;
        }
      }

      // Region matching
      if (selectedRegion !== 'Semua Wilayah' && r.regionTag !== selectedRegion) {
        return false;
      }

      // Category matching
      if (selectedCategory !== 'Semua' && r.category !== selectedCategory) {
        return false;
      }

      return true;
    });
  }, [searchQuery, selectedRegion, selectedCategory]);

  // Bookmarked recipes list
  const bookmarkedRecipes = useMemo(() => {
    return TRADITIONAL_RECIPES.filter((r) => bookmarkedIds.includes(r.id));
  }, [bookmarkedIds]);

  const pendingGroceryCount = groceryItems.filter((i) => !i.completed).length;

  return (
    <MobileFrame>
      <div className="flex flex-col min-h-full bg-stone-50 dark:bg-stone-900 text-stone-900 dark:text-stone-100">
        
        {/* Top App Header (Mobile App Bar) */}
        <header className="sticky top-0 z-30 bg-white/90 dark:bg-stone-900/90 backdrop-blur-md border-b border-stone-200/80 dark:border-stone-800 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-800 text-amber-100 flex items-center justify-center shadow-xs">
              <Utensils className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight text-stone-900 dark:text-stone-100 font-serif-display leading-none">
                Dapur Nusantara
              </h1>
              <span className="text-[11px] text-stone-500 dark:text-stone-400 font-medium tracking-tight">
                Resep Masakan Tradisional
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                soundFX.playClick();
                setActiveTab('favorit');
              }}
              className="min-w-[40px] min-h-[40px] rounded-full flex items-center justify-center text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors relative"
              aria-label="Resep Favorit"
            >
              <Heart
                className={`w-5 h-5 ${
                  bookmarkedIds.length > 0 ? 'fill-rose-500 text-rose-500' : ''
                }`}
              />
              {bookmarkedIds.length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500" />
              )}
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-4">
          {activeTab === 'jelajah' && (
            <ExploreView
              recipes={filteredRecipes}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedRegion={selectedRegion}
              onRegionChange={setSelectedRegion}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              bookmarkedIds={bookmarkedIds}
              onToggleBookmark={toggleBookmark}
              onSelectRecipe={setSelectedRecipe}
            />
          )}

          {activeTab === 'favorit' && (
            <div className="space-y-4 pb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                    <Bookmark className="w-4 h-4 text-amber-700 dark:text-amber-400 fill-current" />
                    <span>Resep Favorit Tersimpan</span>
                  </h2>
                  <p className="text-xs text-stone-500">
                    Akses cepat resep masakan tradisional yang telah kamu simpan
                  </p>
                </div>
                <span className="text-xs font-semibold text-stone-600 dark:text-stone-400 tabular-nums">
                  {bookmarkedRecipes.length} Resep
                </span>
              </div>

              {bookmarkedRecipes.length === 0 ? (
                <div className="py-16 text-center space-y-3 bg-white dark:bg-stone-850 rounded-2xl border border-stone-200 dark:border-stone-800 p-6">
                  <Bookmark className="w-10 h-10 text-stone-300 dark:text-stone-600 mx-auto" />
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-stone-800 dark:text-stone-200">
                      Belum Ada Resep Favorit
                    </h3>
                    <p className="text-xs text-stone-500 max-w-xs mx-auto">
                      Ketuk ikon pita bookmark pada kartu resep yang ingin kamu simpan agar mudah dibuka kembali saat memasak.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('jelajah')}
                    className="min-h-[42px] px-4 rounded-xl bg-amber-800 text-white text-xs font-semibold shadow-xs"
                  >
                    Cari Resep Tradisional
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {bookmarkedRecipes.map((recipe) => (
                    <RecipeCard
                      key={recipe.id}
                      recipe={recipe}
                      isBookmarked={true}
                      onToggleBookmark={toggleBookmark}
                      onSelect={setSelectedRecipe}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'belanja' && (
            <GroceryList
              items={groceryItems}
              onToggleItem={handleToggleGroceryItem}
              onDeleteItem={handleDeleteGroceryItem}
              onClearCompleted={handleClearCompletedGrocery}
              onClearAll={handleClearAllGrocery}
              onNavigateToExplore={() => setActiveTab('jelajah')}
            />
          )}

          {activeTab === 'tips' && <KitchenTips />}
        </main>

        {/* Recipe Detail Full View Modal */}
        {selectedRecipe && (
          <RecipeDetail
            recipe={selectedRecipe}
            isBookmarked={bookmarkedIds.includes(selectedRecipe.id)}
            onToggleBookmark={toggleBookmark}
            onClose={() => setSelectedRecipe(null)}
            onAddToGrocery={handleAddToGrocery}
            onStartCookingMode={(recipe) => {
              setSelectedRecipe(null);
              setCookingModeRecipe(recipe);
            }}
          />
        )}

        {/* Step-by-Step Interactive Cooking Mode with Digital Timer */}
        {cookingModeRecipe && (
          <CookingModeModal
            recipe={cookingModeRecipe}
            onClose={() => setCookingModeRecipe(null)}
          />
        )}

        {/* Sticky Mobile Bottom Navigation Bar */}
        <BottomNav
          activeTab={activeTab}
          onTabChange={(tab) => {
            soundFX.playClick();
            setActiveTab(tab);
          }}
          favoritesCount={bookmarkedIds.length}
          groceryPendingCount={pendingGroceryCount}
        />
      </div>
    </MobileFrame>
  );
}
