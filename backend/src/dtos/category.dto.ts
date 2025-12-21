export class CreateCategoryDto {
    name!: string;
    description?: string;
    color?: string;
    icon?: string;
}

export class UpdateCategoryDto {
    name?: string;
    description?: string;
    color?: string;
    icon?: string;
    isActive?: boolean;
}
