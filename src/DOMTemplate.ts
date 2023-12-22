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

    renderTemplate(flightList : Flight[]){
        this.clearTemplate()
        this.main = document.createElement("main")
        this.renderTable(flightList)
        this.renderSelectConnexion(flightList)
        this.renderDownloadBtn()
        document.body.appendChild(this.main)
        this.btn?.scrollIntoView({behavior: "smooth"})
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

    private renderSelectConnexion(flightList : Flight[]){
        const selectConnexion = document.createElement("select")
        const connexions =   new Set( flightList.map(flight => flight[1]).sort())
        connexions.forEach(connexion => {
            const option = document.createElement("option")
            option.text = connexion 
            option.value = connexion 
            selectConnexion.appendChild(option)
        })
        this.main?.appendChild(selectConnexion)
    }

    private renderDownloadBtn(){
        this.btn = document.createElement("button")
        this.btn.innerText = "Télécharger le rapport"
        this.main?.appendChild(this.btn)
    }
}

