import TodoItem from "./TodoItem.js"
import TodoList from "./TodoList.js"
import { listen, deleteContent, debounce } from "./utils.js";

// state 
const todoList = new TodoList();
let pages; 
let currentPage = 1 
let currentCategory = "tous" 
let currentSearch = ""

// DOM 
const nameInput = document.getElementById("addNameInput")
const categoryInput = document.getElementById("addCategoryInput")
const submitInput = document.getElementById("submitInput")
const form = document.querySelector("form")
const ul = document.querySelector("ul")
const trash = document.querySelector(".fa-trash")
const statBox = document.querySelector(".stats")
const pageBox = document.querySelector(".pages")
const leftChevron = document.querySelector(".fa-chevron-left")
const rightChevron = document.querySelector(".fa-chevron-right")
const select = document.querySelector("select")
const searchInput = document.getElementById("search")

const app = {
    init() {
        // écouteurs 
        listen(nameInput, "input", validateForm)
        listen(categoryInput, "input", validateForm)
        listen(form, "submit", app.addTodo)
        listen(ul, "click", app.removeTodo)
        listen(trash, "click", app.clearTodos)
        listen(leftChevron, "click", e => app.changePage("left"))
        listen(rightChevron, "click", e => app.changePage("right")) 
        listen(select, "change", app.filter)
        listen(searchInput, "input", debounce(app.search, 2000))

        //procédures 
        app.load()
        app.refreshPage()
    },
    addTodo(e) {
        e.preventDefault()
        const id = calculateId()
        const name = nameInput.value.trim()
        const category = categoryInput.value.trim()
        const date = new Date()
        const item = createItem(id, name, category, date)
        todoList.addItemToList(item)
        app.update()
    },
    removeTodo(e) {
        if (e.target.tagName === "I") {
            const id = e.target.parentElement.getAttribute("id")
            todoList.removeItemFromList(id)
            app.update()
        }
    },
    clearTodos() {
        if (todoList.getListLength()) {
            const confirmed = confirm("Voulez-vous vraiment supprimer tous les todos ?")
            if (confirmed) {
                todoList.clearList()
                app.update()
            }
        }
    },
    load() {
        const storedList = localStorage.getItem("myTodos")
        if (typeof storedList !== "string") return
        const parsedList = JSON.parse(storedList)
        parsedList.forEach(obj => {
            const item = createItem(obj._id, obj._name, obj._category, new Date(obj._date))
            todoList.addItemToList(item)
        })
    },
    persist() {
        localStorage.setItem("myTodos", JSON.stringify(todoList.getList()))
    },
    update() {
        resetUI()
        app.persist()
        app.refreshPage()
    },
    refreshPage() {
        deleteContent(ul)
        deleteContent(statBox) 
        deleteContent(select)
        renderUIStats(getStats()) 
        renderUIList(paginate([...getUIList()].reverse())) 
        renderUISelectCat()
    },
    changePage(direction){
        if(direction === "left"){
            if(currentPage === 1) return 
            currentPage--
        } else if (direction === "right"){
            if(currentPage === pages) return 
            currentPage++
        }
        app.refreshPage()
    },
    filter(e){
        resetUI() 
        currentCategory = e.target.value 
        app.refreshPage()
    }, 
    search(e){
        currentPage = 1 
        currentSearch = e.target.value 
        app.refreshPage()
    }
}

const validateForm = () => {
    if (nameInput.value.length && categoryInput.value.length) {
        submitInput.disabled = false
    } else {
        submitInput.disabled = true
    }
}

const calculateId = () => {
    let nextId = 1;
    if (todoList.getListLength()) {
        nextId = todoList.getList()[todoList.getListLength() - 1].id + 1
    }
    return nextId
}

const createItem = (id, name, category, date) => {
    const todo = new TodoItem()
    todo.id = id
    todo.name = name
    todo.category = category
    todo.date = date
    return todo
}

const resetUI = () => {
    currentPage = 1
    currentCategory = "tous"
    currentSearch = ""
    nameInput.value = ""
    categoryInput.value = ""
    submitInput.disabled = true
}

const renderUIList = (list) => {
    list[currentPage - 1].forEach(item => {
        buildUIItem(item)
    })
}

const buildUIItem = (item) => {
    const li = document.createElement("li")
    li.setAttribute("id", item.id)
    if (Date.now() > new Date(item.date.getTime() + 1000 * 60 * 60 * 24 * 7)) {
        li.classList.add("late")
    }
    li.innerHTML = `
    ${item.name} <span>${item.category}</span>
    <i class="fa fa-close"></i>
    `
    ul.appendChild(li)
}

const renderUIStats = (stats) => {
    const totalDiv = document.createElement("div")
    totalDiv.innerHTML = `
    Total : <b>${stats.total}</b>
    `
    statBox.appendChild(totalDiv)
    const aggregateDiv = document.createElement("div")
    if(typeof stats.aggregate !== "undefined"){
        for (let [key, value] of Object.entries(stats.aggregate)){
            const span = document.createElement("span")
            span.innerHTML = `${key} : ${value}`
            aggregateDiv.appendChild(span)
        }
    }

    statBox.appendChild(aggregateDiv)
} 

const renderUISelectCat = () => {
  const categories =  ["tous",...new Set(todoList.getList().map(item => item._category))]
  categories.forEach(category => {
    const option = document.createElement("option")  
    option.value = category 
    option.textContent = category 
    option.selected = category === currentCategory 
    select.appendChild(option)
  })
}

const getStats = () => {
    const total = todoList.getListLength()
    let aggregate; 
    if(total > 0 ){
        aggregate = todoList.getList().reduce((acc, curr) => {
            const {_category} = curr 
            acc[_category] = acc[_category] + 1 || 1
            return acc 
        }, {})
    }

    return {total, aggregate}
}

const getUIList = () => {
    let UIList;  
    if( currentCategory !== "tous"){
        UIList = todoList.getList().filter(item => item._category === currentCategory)
    } else {
        UIList = todoList.getList()
    } 
    if(currentSearch !== ""){
        UIList = UIList.filter(item => item._name.includes(currentSearch))
    }
    return UIList
}

const paginate = (list) => {
    const itemsPerPage = 4; 
    pages = list.length > 0 ? Math.ceil(list.length / itemsPerPage) : 1
    const paginatedItems = Array.from({length: pages}, (_,i) => {
        const start = i * itemsPerPage  
        return list.slice(start, start + itemsPerPage)
    })

    pageBox.querySelector("span").firstElementChild.textContent = currentPage 
    pageBox.querySelector("span").lastElementChild.textContent = pages

    return paginatedItems
}


document.addEventListener("DOMContentLoaded", app.init)