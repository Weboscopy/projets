
export type Flight = [Date, string, number, number, number, FlightStatus ]


export enum FlightStatus {
    OnTime = "O",
    Cancelled = "C", 
    Delayed = "D"
}