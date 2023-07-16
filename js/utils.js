export const listen = (target, event, callback, capture = false) => {
    target.addEventListener(event, callback, !!capture)
}


export const deleteContent = (parentEl) => {
    let lastChild = parentEl.lastElementChild 
    while(lastChild){
        parentEl.removeChild(lastChild)
        lastChild = parentEl.lastElementChild
    }
}
