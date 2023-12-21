import { Flight, FlightStatus } from "../types";
import { convertStringToDate } from "../utils";


export class CSVReader {
    data : Flight[] = []
    constructor(public file: File){}

    private load(file: File): Promise<string>{
        return new Promise((resolve, reject) => {
            let stringContent = ""
            const reader = new FileReader()
            reader.readAsText(file)
            reader.onloadend = function (e){
               stringContent = e?.target?.result as string
               resolve(stringContent)
            }
            reader.onerror = function(e){
                reject(e?.target?.error?.message)
            }
        })
    }

    async read(): Promise<void>{
      const stringContent =   await this.load(this.file)
      this.data = stringContent
                        .split("\n")
                        .map((row : string) : string[] => row.split(","))
                        .map(this.convertRow)
    }

    private convertRow(row: string[]): Flight {
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