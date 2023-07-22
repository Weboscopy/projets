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

export const debounce = (func, delay) => {
    let timeout;
    return (...args) => {
        if (timeout) clearTimeout(timeout)
      timeout = setTimeout(() => {
            func(...args)
        }, delay)
    }
}