import { Printer } from "../types";
import jsPDF from "jspdf";

export class PDFPrinter implements Printer {
    static description : string = "Rapport au format PDF"

    constructor(public connexion : string){}

    print(analysis : string[]){
       const pdf = new jsPDF()
       pdf.setTextColor("14919b")
       pdf.setFontSize(20)
       pdf.text(`Rapport de vols pour ${this.connexion}`, 65, 20)
       pdf.setTextColor(0, 0, 0)
       pdf.setFontSize(12)
       let y = 40 
       analysis.forEach(stat => {
        pdf.text(stat, 10, y)
        y+= 15
       })

       pdf.save(`rapport_${this.connexion}_${new Date().toLocaleString().replace(":", "_")}`)
    }
}