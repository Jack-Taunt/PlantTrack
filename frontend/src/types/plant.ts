import type { Image } from "./garden";

export interface Plant {
    id: number;
    common_name: string;
    scientific_name: string;
    family: string;
    genus: string;
    order: string;
    class_: string;
    phylum: string;
    variety: string;

    toxicity: Toxicity;
    edibility: Edibility;
    environment: Environment;
    care_requirements: CareRequirements;
    growth: Growth;
    planting: Planting;
}

export interface GardenPlant {
    id: number;
    planted_date: string;
    notes: string;
    plant: Plant;
    section_id: number;
    garden_plant_images: Image[];
}

export interface Toxicity{
    toxic_to_cats: boolean;
    toxic_to_dogs: boolean;
    toxic_to_humans: boolean;
    toxicity: string;
}

export interface Edibility{
    edible_fruit: boolean;
    edible_leaves: boolean;
    edible_flowers: boolean;
    edible_roots: boolean;
}

export interface Environment{
    light_type: string;
    min_temp: number;
    max_temp: number;
    min_humidity: number;
    max_humidity: number;
    min_usda_zone: string;
    max_usda_zone: string;
}

export interface CareRequirements{
    min_water_frequency: number;
    max_water_frequency: number;
    soil_moisture: string;
    drought_tolerant: boolean;
    soil_type: string;
    min_soil_ph: number;
    max_soil_ph: number;
    fertilizer_frequency: number;
    fertilizer_nitrogen: number;
    fertilizer_phosphorus: number;
    fertilizer_potassium: number;
}

export interface Growth{
    annual: boolean;
    biennial: boolean;
    perennial: boolean;
    min_height: number;
    max_height: number;
    min_width: number;
    max_width: number;
    growth_rate: string;
    min_days_to_harvest: number;
    max_days_to_harvest: number;
}

export interface Planting{
    spacing: number;
    seed_depth: number;
    direct_sow: boolean;
    transplant: boolean;
    propagation: boolean;
}