import img from "./assets/flight.svg"

const initApp = () => {
    // afficher l'image
    document.querySelector('img')!.src = img 
}


document.addEventListener('DOMContentLoaded', initApp)