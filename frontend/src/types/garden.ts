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
}

export interface Tag {
    id: number;
    name: string;
}

export interface Section {
    id: number;
    name: string;
    description: string;
}

export type GardenPlantAmount = {
    plant_id: number,
    amount: number
}