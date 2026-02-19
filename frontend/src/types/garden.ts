import { type UserPublic } from "./user";

export interface Garden {
    id: number;
    name: string;
    description: string;
    is_public: number;
    tags: Tag[];
    user: UserPublic;
}

export interface Tag {
    id: number;
    name: string;
}