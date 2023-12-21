import { Flight, FlightStatus } from "../types";
import { convertStringToDate } from "../utils";
import { CSVReader } from "./CSVReader";

export class FlightReader extends CSVReader<Flight> {
    
     convertRow(row: string[]): Flight {
        if(row.length !== 6 || !(Object.values(FlightStatus).includes(row[5] as FlightStatus)) ){
            throw new Error("Format de tableau invalide")
        }

        return [
            convertStringToDate(row[0]),
            row[1],
            Number(row[2]),
            Number(row[3]),
            Number(row[4]),
            row[5] as FlightStatus
        ]
    }
}