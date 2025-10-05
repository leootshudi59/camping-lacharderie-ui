export type Booking = {
    booking_id: string;
    resName: string;
    campsite_id: string;
    campsiteName: string;
    email?: string;
    phone?: string;
    startDate: string;
    endDate: string;
    lastInventoryId?: string;
};