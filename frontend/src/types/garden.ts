import { type UserPublic } from "./user";
import { type SectionPlant } from "./plant";

export interface Garden {
    id: number;
    name: string;
    description: string;
    is_public: number;
    tags: Tag[];
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
    section_plants: SectionPlant[];
}