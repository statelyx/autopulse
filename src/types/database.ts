/**
 * AUTO PULSE — Supabase Database Types
 * Supabase tabloları için TypeScript tanımları
 */

/**
 * Profile — Kullanıcı profili
 */
export interface Profile {
  id: string; // UUID (auth.users ile birebir)
  email: string;
  full_name?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

/**
 * SavedVehicle — Kaydedilen araçlar
 */
export interface SavedVehicle {
  id: string;
  user_id: string; // FK -> profiles.id
  brand: string;
  model: string;
  year?: number;
  notes?: string;
  created_at: string;
}

/**
 * CompareList — Karşılaştırma listesi
 */
export interface CompareList {
  id: string;
  user_id: string; // FK -> profiles.id
  name: string;
  created_at: string;
  updated_at: string;
}

/**
 * CompareListItem — Karşılaştırma listesi item
 */
export interface CompareListItem {
  id: string;
  compare_list_id: string; // FK -> compare_lists.id
  brand: string;
  model: string;
  year?: number;
  position: number; // Sıralama
  created_at: string;
}

/**
 * VehicleBrand — Araç markası
 */
export interface VehicleBrand {
  id: string;
  name: string;
  slug: string;
  logo_url?: string;
  country?: string;
  founded_year?: number;
  created_at: string;
}

/**
 * VehicleModel — Araç modeli
 */
export interface VehicleModel {
  id: string;
  brand_id: string; // FK -> vehicle_brands.id
  name: string;
  slug: string;
  category?: string; // SUV, Sedan, Hatchback, vb.
  production_start?: number;
  production_end?: number;
  created_at: string;
}

/**
 * VehicleYear — Araç yılı
 */
export interface VehicleYear {
  id: string;
  model_id: string; // FK -> vehicle_models.id
  year: number;
  generation?: string;
  body_type?: string;
  created_at: string;
}

/**
 * BrandLogo — Marka logosu
 */
export interface BrandLogo {
  id: string;
  brand_id: string; // FK -> vehicle_brands.id
  url: string;
  thumb_url?: string;
  optimized_url?: string;
  source_url?: string;
  created_at: string;
}

/**
 * Database Tables Union
 */
export type DatabaseTable =
  | Profile
  | SavedVehicle
  | CompareList
  | CompareListItem
  | VehicleBrand
  | VehicleModel
  | VehicleYear
  | BrandLogo;

/**
 * Supabase Row with metadata
 */
export type DatabaseRow<T extends DatabaseTable> = T & {
  created_at: string;
  updated_at?: string;
};

/**
 * Relations (JOIN results)
 */
export interface VehicleWithBrand extends VehicleModel {
  brand: VehicleBrand;
}

export interface CompareListWithItems extends CompareList {
  items: CompareListItem[];
}

export interface ProfileWithStats extends Profile {
  saved_vehicles_count?: number;
  compare_lists_count?: number;
}
