import { analyzerLookup, printerLookup } from "./main"
import { Flight, FlightStatus } from "./types"


export class DOMTemplate {
    // singleton
    static instance  : DOMTemplate =  new DOMTemplate()
    public btn : HTMLButtonElement | null = null 
    private main : HTMLElement | null = null
    private constructor(){}


    renderAlert(msg: string){
        const alert = document.createElement("span")
        alert.innerText = msg 
        document.body.prepend(alert)
        setTimeout(() => {
            alert.remove()
        }, 3000)
    }

    clearTemplate(){
        this.main && this.main.remove()
        this.btn && this.btn.remove()
    }

    renderTemplate(flightList : Flight[]) : HTMLSelectElement[]{
        this.clearTemplate()
        this.main = document.createElement("main")
        this.renderTable(flightList)
        const selectConnexion = this.renderSelectConnexion(flightList)
        const selectAnalyzer = this.renderDynamicSelect(analyzerLookup)
        const selectPrinter = this.renderDynamicSelect(printerLookup)
        this.renderDownloadBtn()
        document.body.appendChild(this.main)
        this.btn?.scrollIntoView({behavior: "smooth"})
        return [selectConnexion, selectAnalyzer, selectPrinter]
    }

    private renderTable(flightList : Flight[]){
        const section = document.createElement("section")
        const table = document.createElement("table")
        const thead = document.createElement("thead")
        const tbody = document.createElement("tbody")

        thead.innerHTML = `
            <tr>
            <th>Date</th>
            <th>Connexion</th>
            <th>Passaagers</th>
            <th>Temps de vol (min)</th>
            <th>Altitude (m)</th>
            <th>Statut du vol</th>
            </tr>
        `
        flightList.forEach((flight: Flight) => {
            const row =   tbody.insertRow()
            flight.forEach(col => {
                const cell =    row.insertCell()
                if(col instanceof Date){
                    cell.innerText = col.toLocaleDateString("fr", {dateStyle: "medium"})
                } else if (Object.values(FlightStatus).includes(col as FlightStatus)){
                    switch(col){
                        case FlightStatus.OnTime:
                            cell.innerText = "A l'heure"
                            break; 
                        case FlightStatus.Cancelled:
                            cell.innerText = "Annulé"
                            break;
                        case FlightStatus.Delayed:
                            cell.innerText = "En Retard"
                    }
                } else {
                    cell.innerText = String(col)
                }
            })
        })

        table.append(thead, tbody)
        section.appendChild(table)
        this.main?.appendChild(section)
    }

    private renderSelectConnexion(flightList : Flight[]) : HTMLSelectElement{
        const selectConnexion = document.createElement("select")
        const connexions =   new Set( flightList.map(flight => flight[1]).sort())
        connexions.forEach(connexion => {
            const option = document.createElement("option")
            option.text = connexion 
            option.value = connexion 
            selectConnexion.appendChild(option)
        })
        this.main?.appendChild(selectConnexion)
        return selectConnexion
    }

    private renderDynamicSelect<K extends string, T extends {description : string}>(lookup : Record<K , T>) : HTMLSelectElement{
        const dynamicSelect = document.createElement("select")
        for(const key in lookup){
            const val = lookup[key]
            const option = document.createElement("option")
            option.value = key 
            option.textContent = val.description
            dynamicSelect.appendChild(option)
        }
        this.main?.appendChild(dynamicSelect)
        return dynamicSelect
    }

    private renderDownloadBtn(){
        this.btn = document.createElement("button")
        this.btn.innerText = "Télécharger le rapport"
        this.main?.appendChild(this.btn)
    }
}

