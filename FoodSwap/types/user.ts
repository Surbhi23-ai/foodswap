export type DietPreference =
  | "vegetarian"
  | "vegan"
  | "eggetarian"
  | "non-vegetarian"
  | "any";

export interface UserProfile {
  id: string;
  user_id: string;
  display_name: string | null;
  diet_preference: DietPreference;
  allergies: string[];
  location: string | null;
  created_at: string;
  updated_at: string;
}
