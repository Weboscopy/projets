import { AvgAnalyzer } from "./Analyzers/AvgAnalyzer"
import { MinMaxAnalyzer } from "./Analyzers/MinMaxAnalyzer"
import { HTMLPrinter } from "./Printers/HTMLPrinter"
import { FlightReader } from "./Readers/FlightReader"
import img from "./assets/flight.svg"

const initApp = () => {
    // afficher l'image
    document.querySelector('img')!.src = img 

    // envoi des fichiers 
    const form = document.querySelector("form")!
    form.addEventListener("submit", (e: SubmitEvent) => {
        e.preventDefault()
        try {
          const files =  document.querySelector("input")?.files!
          const file = files[0]
          if(files.length !== 1 || file.type !== "text/csv"){
            throw new Error("Vous devez envoyer un seul fichier au format CSV")
          }

          readFlights(file)
        } catch (error) {
            if(error instanceof Error){
                console.log(error.message)
            }
        }
    })

    // lecture des données
    async function readFlights(file: File) : Promise<void> {
      const flightReader =  new FlightReader(file)
      try {
        await flightReader.read()
        const flightList = flightReader.data

        const avgAnalyzer = new AvgAnalyzer("Paris-Madrid", flightList)
        const minMaxAnalyzer = new MinMaxAnalyzer("Paris-Madrid", flightList)

        const analysis = minMaxAnalyzer.run()

        const htmlPrinter = new HTMLPrinter("Paris-Madrid")

        htmlPrinter.print(analysis)

      } catch (error) {
        if(error instanceof Error){
            console.log(error.message)
        }
      }
    }
}


document.addEventListener('DOMContentLoaded', initApp)