import { AvgAnalyzer } from "./Analyzers/AvgAnalyzer"
import { MinMaxAnalyzer } from "./Analyzers/MinMaxAnalyzer"
import { DOMTemplate } from "./DOMTemplate"
import { HTMLPrinter } from "./Printers/HTMLPrinter"
import { PDFPrinter } from "./Printers/PDFPrinter"
import { FlightReader } from "./Readers/FlightReader"
import { Report } from "./Report"
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
                DOMTemplate.instance.renderAlert(error.message)
                DOMTemplate.instance.clearTemplate()
            }
        }
    })

    // lecture des données
    async function readFlights(file: File) : Promise<void> {
      const flightReader =  new FlightReader(file)
      try {
        await flightReader.read()
        const flightList = flightReader.data

        // afficher la template 
        DOMTemplate.instance.renderTemplate()

        // const avgAnalyzer = new AvgAnalyzer("Paris-Madrid", flightList)
        // const minMaxAnalyzer = new MinMaxAnalyzer("Paris-Madrid", flightList)
        // const htmlPrinter = new HTMLPrinter("Paris-Madrid")
        // const pdfPrinter = new PDFPrinter("Paris-Madrid")
        // const report1 = new Report(avgAnalyzer, htmlPrinter)
        // const report2 = new Report(minMaxAnalyzer, pdfPrinter)
        // report1.generate()
        // report2.generate()


      } catch (error) {
        if(error instanceof Error){
          DOMTemplate.instance.renderAlert(error.message)
          DOMTemplate.instance.clearTemplate()
        }
      }
    }
}


document.addEventListener('DOMContentLoaded', initApp)