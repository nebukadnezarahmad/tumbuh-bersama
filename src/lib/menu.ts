import type { Ingredient, Recipe } from "../types";

export interface RecipeLine {
  base: Ingredient;
  chosen: {
    name: string;
    amount: string;
    cost: number;
    allergens?: string[];
  };
  substituted: boolean;
}

export function recipeLines(
  recipe: Recipe,
  substitutions: Record<string, string>,
): RecipeLine[] {
  return recipe.ingredients.map((base) => {
    const requested = substitutions[base.name];
    if (base.alt && requested === base.alt.name) {
      return {
        base,
        chosen: base.alt,
        substituted: true,
      };
    }
    return {
      base,
      chosen: {
        name: base.name,
        amount: base.amount,
        cost: base.cost,
        allergens: base.allergens,
      },
      substituted: false,
    };
  });
}

export function recipeCost(
  recipe: Recipe,
  substitutions: Record<string, string>,
): number {
  return recipeLines(recipe, substitutions).reduce(
    (total, line) => total + line.chosen.cost,
    0,
  );
}

export function recipeAllergens(
  recipe: Recipe,
  substitutions: Record<string, string>,
): string[] {
  const set = new Set<string>();
  recipeLines(recipe, substitutions).forEach((line) => {
    line.chosen.allergens?.forEach((item) => set.add(item));
  });
  return [...set];
}

export interface RecipeMatch {
  recipe: Recipe;
  cost: number;
  allergens: string[];
  missing: string[];
  matchCount: number;
  conflicts: string[];
}

export function matchRecipes(options: {
  recipes: Recipe[];
  ageMonths: number;
  minutes: number;
  budget: number;
  allergies: string[];
  pantry: string[];
  substitutions?: Record<string, string>;
}): RecipeMatch[] {
  const {
    recipes,
    ageMonths,
    minutes,
    budget,
    allergies,
    pantry,
    substitutions = {},
  } = options;

  return recipes
    .map((recipe) => {
      const cost = recipeCost(recipe, substitutions);
      const allergens = recipeAllergens(recipe, substitutions);
      const lines = recipeLines(recipe, substitutions);
      const missing = lines
        .filter((line) => !pantry.includes(line.chosen.name))
        .map((line) => line.chosen.name);
      const conflicts = allergens.filter((item) => allergies.includes(item));
      const matchCount = lines.length - missing.length;
      return { recipe, cost, allergens, missing, matchCount, conflicts };
    })
    .filter((item) => item.recipe.ageMin <= ageMonths && item.recipe.ageMax >= ageMonths)
    .filter((item) => item.recipe.minutes <= minutes)
    .filter((item) => item.cost <= budget)
    .filter((item) => item.conflicts.length === 0)
    .sort((a, b) => {
      if (b.matchCount !== a.matchCount) return b.matchCount - a.matchCount;
      if (a.recipe.minutes !== b.recipe.minutes) {
        return a.recipe.minutes - b.recipe.minutes;
      }
      return a.cost - b.cost;
    });
}

export function shoppingList(
  recipe: Recipe | undefined,
  substitutions: Record<string, string>,
  pantry: string[],
): string[] {
  if (!recipe) return [];
  return recipeLines(recipe, substitutions)
    .filter((line) => !pantry.includes(line.chosen.name))
    .map((line) => `${line.chosen.name} ${line.chosen.amount}`);
}
