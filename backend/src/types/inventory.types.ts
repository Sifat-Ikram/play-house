export interface CreateInventoryInput {
    product_id: string;

    quantity: number;

    mark_unavailable?: boolean;

    base_price: number;
    selling_price: number;

    applicable_tax_percent?: number;

    color_id?: string;

    is_featured?: boolean;
}

export interface UpdateInventoryInput {
    quantity?: number;

    mark_unavailable?: boolean;

    base_price?: number;
    selling_price?: number;

    applicable_tax_percent?: number;

    color_id?: string;

    is_featured?: boolean;
}