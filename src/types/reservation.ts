export type Reservation = {
    id: string;
    resName: string;
    rentalId: string;
    rentalName: string;
    startDate: string;
    endDate: string;
    email: string;
    phone: string;
    lastInventoryId?: string;
};