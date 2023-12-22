

export class DOMTemplate {
    // singleton
    static instance  : DOMTemplate =  new DOMTemplate()
    main : HTMLElement | null = null
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
    }

    renderTemplate(){
        this.clearTemplate()
        this.main = document.createElement("main")

        document.body.appendChild(this.main)
    }
}

