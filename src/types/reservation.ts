export type Reservation = {
    id: string;
    resName: string;
    campsite_id: string;
    rentalName: string;
    startDate: string;
    endDate: string;
    email: string;
    phone: string;
    lastInventoryId?: string;
};