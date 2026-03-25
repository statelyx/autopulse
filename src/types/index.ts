/**
 * AUTO PULSE — Global TypeScript Tip Tanımları
 *
 * Bu dosya projenin temel veri modellerini tanımlar.
 * Tüm servisler ve bileşenler bu tipleri kullanacaktır.
 *
 * @module types
 * @version 1.0.0
 */

// ========================
// Araç Veri Modelleri
// ========================

/** Araç markası */
export interface Brand {
    id: string;
    name: string;
    slug: string;
    logoUrl?: string;
    country?: string;
    founded?: number;
}

/** Araç modeli */
export interface Model {
    id: string;
    brandId: string;
    name: string;
    slug: string;
    category?: VehicleCategory;
}

/** Araç kategorisi */
export type VehicleCategory =
    | "sedan"
    | "suv"
    | "hatchback"
    | "coupe"
    | "convertible"
    | "wagon"
    | "pickup"
    | "van"
    | "electric"
    | "hybrid"
    | "sports"
    | "luxury";

/** Araç detay bilgisi */
export interface Vehicle {
    id: string;
    brandId: string;
    modelId: string;
    year: number;
    trim?: string;
    specs?: VehicleSpecs;
}

/** Araç teknik özellikleri */
export interface VehicleSpecs {
    engine?: string;
    horsepower?: number;
    torque?: number;
    transmission?: string;
    drivetrain?: string;
    fuelType?: string;
    fuelEconomy?: string;
    acceleration?: string;
    topSpeed?: number;
    weight?: number;
    dimensions?: {
        length?: number;
        width?: number;
        height?: number;
        wheelbase?: number;
    };
}

// ========================
// Kullanıcı & Yorum Modelleri (Faz 8+)
// ========================

/** Kullanıcı yorumu */
export interface Review {
    id: string;
    vehicleId: string;
    userId?: string;
    rating: number;
    title: string;
    content: string;
    pros?: string[];
    cons?: string[];
    createdAt: string;
}

// ========================
// AI Modelleri (Faz 7+)
// ========================

/** AI analiz sonucu */
export interface AIAnalysis {
    vehicleId: string;
    summary: string;
    strengths: string[];
    weaknesses: string[];
    recommendation: string;
    score: number;
    generatedAt: string;
}
