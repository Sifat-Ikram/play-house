export interface CreateInventoryVideoInput {
    inventory_id: string;
    video_url: string;
}

export interface UpdateInventoryVideoInput {
    video_url?: string;
}