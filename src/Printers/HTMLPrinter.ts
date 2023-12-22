import { Printer } from "../types";


export class HTMLPrinter implements Printer {
    static description : string = "Rapport au format HTML"

    constructor(public connexion : string){}

    private createHTMLContent(analysis : string[]) : string {
        const h2 = document.createElement("h2")
        const ul = document.createElement("ul") 
        h2.innerText = `Rapport de vols pour ${this.connexion}`
        analysis.forEach(stat => {
            const li = document.createElement("li")
            li.innerText = stat 
            ul.appendChild(li)
        })

        const HTMLContent = `
            <html>
                <style>
                body{
                    height: 100vh;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                }
                h2{
                    color: #14919b;
                }
                ul{
                    font-size: 1.3rem;
                }
                li{
                    padding-bottom: 1rem;
                }
            </style>

            <body>
                ${h2.outerHTML}
                ${ul.outerHTML}
            </body>
            </html>
        `

        return HTMLContent
    }

    private createFile (content: string) : File {
        const filename = `rapport_${this.connexion}_${new Date().toLocaleString().replace(":", "_")}`
        const file = new File([content], filename, {type: "text/html"})
        return file 
    }

    private donwloadFile(file: File) : void {
        const url = window.URL.createObjectURL(file)
        const a = document.createElement("a")
        a.href = url 
        a.download = file.name 
        a.click() 
        a.remove()
        window.URL.revokeObjectURL(url)
    }

    print(analysis: string[]) : void {
        const content = this.createHTMLContent(analysis)
        const file = this.createFile(content)
        this.donwloadFile(file)
    }
}