export interface Ingredient {
  id: string;
  name: string;
  baseAmount: number;
  unit: string;
  section: 'Bahan Utama' | 'Bumbu Halus' | 'Bumbu Aromatik & Pelengkap';
  note?: string;
}

export interface Step {
  stepNumber: number;
  title: string;
  instruction: string;
  durationMinutes?: number;
  tip?: string;
}

export interface Recipe {
  id: string;
  title: string;
  shortTitle: string;
  region: string;
  regionTag: string;
  image: string;
  description: string;
  history: string;
  prepTime: number;
  cookTime: number;
  defaultServings: number;
  difficulty: 'Mudah' | 'Sedang' | 'Mahir';
  spiceLevel: 'Tidak Pedas' | 'Sedang' | 'Pedas Mantap' | 'Ekstra Pedas';
  category: 'Daging' | 'Kuah & Sup' | 'Olahan Ikan' | 'Sate & Bakaran' | 'Sayuran';
  rating: number;
  reviewsCount: number;
  ingredients: Ingredient[];
  steps: Step[];
  chefTip: string;
}

export interface GroceryItem {
  id: string;
  recipeId: string;
  recipeTitle: string;
  name: string;
  amount: number;
  unit: string;
  completed: boolean;
}

export interface KitchenTip {
  id: string;
  title: string;
  category: string;
  summary: string;
  content: string[];
  traditionalQuote: string;
}
