import { Seat } from "./seat";

export interface Train {
    seats: Seat[];
    availableSeats: number[];
    cap: number;
} 