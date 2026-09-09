export interface CreateInventoryImageInput {
    inventory_id: string;
    image_url: string;
    is_display_image?: boolean;
}

export interface UpdateInventoryImageInput {
    is_display_image?: boolean;
}