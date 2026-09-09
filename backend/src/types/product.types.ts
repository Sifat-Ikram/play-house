export interface CreateProductInput {
    category_id: string;
    brand_id: string;
    name: string;
    number_of_pieces?: number;

    warranty_info?: string;

    minimum_age_range?: number;
    maximum_age_range?: number;

    material_ids?: string[];

    dimensions?: {
        type: "BOX" | "PRODUCT";
        height?: number;
        width?: number;
        depth?: number;
        weight?: number;
        dimension_unit?: string;
        weight_unit?: string;
    };

    description?: string;
    in_the_box?: string;

    summary?: string[];

    return_and_refund_policy?: string;
}

export interface UpdateProductInput {
    category_id?: string;
    brand_id?: string;
    name?: string;
    number_of_pieces?: number;

    warranty_info?: string;

    minimum_age_range?: number;
    maximum_age_range?: number;

    material_ids?: string[];

    dimensions?: {
        type: "BOX" | "PRODUCT";
        height?: number;
        width?: number;
        depth?: number;
        weight?: number;
        dimension_unit?: string;
        weight_unit?: string;
    };

    description?: string;
    in_the_box?: string;

    summary?: string[];

    return_and_refund_policy?: string;
}