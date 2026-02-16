export interface Garden {
    id: number;
    name: string;
    description: string;
    is_public: number;
    tags: Tag[];
}

export interface Tag {
    id: number;
    name: string;
}