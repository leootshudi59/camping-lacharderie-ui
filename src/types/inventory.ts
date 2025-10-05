export type InventoryItemUI = {
    inventoryItemId: string;
    name: string;
    quantity: number;
    condition?: string | null;
};

export type InventorySummary = {
    id: string;
    type: 0 | 1;                 // 0 = arrival, 1 = departure (normalisation pour rester compatible avec ton render)
    createdAt: string;           // ISO string
    comment?: string | null;
    items: InventoryItemUI[];
};

export type InventoryWithBooking = InventorySummary & {
    booking_id: string;
    booking_res_name: string;
    campsite_id: string;
    campsiteName: string;
};