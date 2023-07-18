import TodoItem from "./TodoItem.js"
import TodoList from "./TodoList.js"
import { listen, deleteContent } from "./utils.js";

const todoList = new TodoList();

// DOM 
const nameInput = document.getElementById("addNameInput")
const categoryInput = document.getElementById("addCategoryInput")
const submitInput = document.getElementById("submitInput")
const form = document.querySelector("form")
const ul = document.querySelector("ul")
const trash = document.querySelector(".fa-trash")
const statBox = document.querySelector(".stats")

const app = {
    init() {
        // écouteurs 
        listen(nameInput, "input", validateForm)
        listen(categoryInput, "input", validateForm)
        listen(form, "submit", app.addTodo)
        listen(ul, "click", app.removeTodo)
        listen(trash, "click", app.clearTodos)

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
        renderUIStats(getStats())
        renderUIList([...todoList.getList()].reverse())
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
    nameInput.value = ""
    categoryInput.value = ""
    submitInput.disabled = true
}

const renderUIList = (list) => {
    list.forEach(item => {
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


document.addEventListener("DOMContentLoaded", app.init)