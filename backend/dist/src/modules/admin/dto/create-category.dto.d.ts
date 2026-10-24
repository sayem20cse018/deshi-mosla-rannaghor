export declare class CreateCategoryDto {
    name: string;
    nameEn?: string;
    slug: string;
    description?: string;
    image?: string;
    icon?: string;
    parentId?: string;
    isActive?: boolean;
    sortOrder?: number;
    showInNav?: boolean;
    navOrder?: number;
    metaTitle?: string;
    metaDesc?: string;
}
export declare class UpdateCategoryDto {
    name?: string;
    nameEn?: string;
    slug?: string;
    description?: string;
    image?: string;
    icon?: string;
    parentId?: string;
    isActive?: boolean;
    sortOrder?: number;
    showInNav?: boolean;
    navOrder?: number;
    metaTitle?: string;
    metaDesc?: string;
}
