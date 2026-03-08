"use client";

import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  Flame,
  Beef,
  Wheat,
  Droplets,
  ArrowRight,
  Sprout,
} from "lucide-react";
import clsx from "clsx";
import type { FoodResult, FoodAlternative, HealthLabel } from "@/types/food";

interface FoodCardProps {
  food: FoodResult | FoodAlternative;
  isAlternative?: boolean;
  onSearch?: (name: string) => void;
}

const HEALTH_CONFIG: Record<
  HealthLabel,
  {
    badgeClass: string;
    icon: React.ReactNode;
    barColor: string;
    borderColor: string;
  }
> = {
  Safe: {
    badgeClass: "badge-safe",
    icon: <CheckCircle className="h-3.5 w-3.5" />,
    barColor: "bg-green-500",
    borderColor: "border-l-green-500",
  },
  Moderate: {
    badgeClass: "badge-moderate",
    icon: <AlertTriangle className="h-3.5 w-3.5" />,
    barColor: "bg-amber-500",
    borderColor: "border-l-amber-500",
  },
  Avoid: {
    badgeClass: "badge-avoid",
    icon: <XCircle className="h-3.5 w-3.5" />,
    barColor: "bg-red-500",
    borderColor: "border-l-red-500",
  },
};

function NutritionPill({
  icon,
  label,
  value,
  unit = "g",
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  unit?: string;
}) {
  return (
    <div className="nutrition-pill">
      <div className="mb-1 text-gray-400">{icon}</div>
      <span className="text-base font-bold text-gray-900">
        {value}
        <span className="text-xs font-normal text-gray-400 ml-0.5">{unit}</span>
      </span>
      <span className="text-xs text-gray-500">{label}</span>
    </div>
  );
}

export default function FoodCard({
  food,
  isAlternative = false,
  onSearch,
}: FoodCardProps) {
  const config = HEALTH_CONFIG[food.healthLabel];
  const explanation = "explanation" in food ? food.explanation : undefined;
  const reason = "reason" in food ? food.reason : undefined;

  const handleClick = () => {
    if (isAlternative && onSearch) onSearch(food.name);
  };

  return (
    <div
      onClick={handleClick}
      className={clsx(
        "card border-l-4",
        config.borderColor,
        isAlternative &&
          "cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
      )}
    >
      {/* Header */}
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-brand-50">
            <Sprout className="h-5 w-5 text-brand-600" />
          </div>
          <div className="min-w-0">
            <h2
              className={clsx(
                "truncate font-bold text-gray-900",
                isAlternative ? "text-base" : "text-2xl"
              )}
            >
              {food.name}
            </h2>
            {reason && (
              <p className="mt-0.5 text-xs text-gray-500 line-clamp-2">
                {reason}
              </p>
            )}
          </div>
        </div>
        <span className={clsx("flex-shrink-0", config.badgeClass)}>
          {config.icon}
          {food.healthLabel}
        </span>
      </div>

      {/* Explanation */}
      {explanation && (
        <p className="mb-5 text-sm leading-relaxed text-gray-600">
          {explanation}
        </p>
      )}

      {/* Nutrition */}
      <div
        className={clsx(
          "grid gap-3",
          isAlternative ? "grid-cols-2" : "grid-cols-2 sm:grid-cols-4"
        )}
      >
        <NutritionPill
          icon={<Flame className="h-4 w-4" />}
          label="Calories"
          value={food.nutrition.calories}
          unit="kcal"
        />
        <NutritionPill
          icon={<Beef className="h-4 w-4" />}
          label="Protein"
          value={food.nutrition.protein}
        />
        <NutritionPill
          icon={<Wheat className="h-4 w-4" />}
          label="Carbs"
          value={food.nutrition.carbs}
        />
        <NutritionPill
          icon={<Droplets className="h-4 w-4" />}
          label="Fat"
          value={food.nutrition.fat}
        />
      </div>

      {/* Extra nutrition (non-alternative) */}
      {!isAlternative &&
        (food.nutrition.fiber !== undefined ||
          food.nutrition.sugar !== undefined) && (
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {food.nutrition.fiber !== undefined && (
              <NutritionPill
                icon={<Sprout className="h-4 w-4" />}
                label="Fiber"
                value={food.nutrition.fiber}
              />
            )}
            {food.nutrition.sugar !== undefined && (
              <NutritionPill
                icon={<Droplets className="h-4 w-4" />}
                label="Sugar"
                value={food.nutrition.sugar}
              />
            )}
          </div>
        )}

      {/* Alternative CTA */}
      {isAlternative && (
        <div className="mt-4 flex items-center justify-end gap-1 text-xs font-semibold text-brand-600">
          View full analysis
          <ArrowRight className="h-3.5 w-3.5" />
        </div>
      )}
    </div>
  );
}
