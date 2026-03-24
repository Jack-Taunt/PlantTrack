import type { UserPublic } from "./user";

export interface Garden {
    id: number;
    name: string;
    description: string;
    is_public: number;
    tags: Tag[];
    user_id: number;
    user: UserPublic;
    sections: Section[];
    garden_images: Image[];
}

export interface Tag {
    id: number;
    name: string;
}

export interface Section {
    id: number;
    name: string;
    description: string;
    order: number;
}

export type GardenPlantAmount = {
    plant_id: number,
    amount: number
}

export type Image = {
    id: number;
}

export type gardenImage = {
    gardenId: number;
    image: string | null;
}