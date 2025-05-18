export interface Itinerary {
    itinerary_id: number;
    itinerary_name: string;
    creator_user: number;
    creation_date: string;
    start_date: Date;
    end_date: Date;
    destinations_count?: number;
}