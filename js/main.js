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

const app = {
    init(){
        // écouteurs 
        listen(nameInput, "input", validateForm)
        listen(categoryInput, "input", validateForm)
        listen(form, "submit", app.addTodo)
    },
    addTodo(e){
        e.preventDefault()
        const id = calculateId()
        const name = nameInput.value.trim()
        const category = categoryInput.value.trim()
        const date = new Date()
        const item = createItem(id, name, category, date)
        todoList.addItemToList(item)
        resetUI()
        app.refreshPage()
    },
    refreshPage(){
        deleteContent(ul)
        renderUIList([...todoList.getList()].reverse())
    }
}

const validateForm = () => {
    if(nameInput.value.length && categoryInput.value.length){
        submitInput.disabled = false 
    } else {
        submitInput.disabled = true 
    }
}

const calculateId = () => {
    let nextId = 1; 
    if(todoList.getListLength()){
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
    if(Date.now() > new Date(item.date.getTime() + 1000 * 60 * 60 * 24 * 7)){
        li.classList.add("late")
    }
    li.innerHTML = `
    ${item.name} <span>${item.category}</span>
    <i class="fa fa-close"></i>
    `
    ul.appendChild(li)
}


document.addEventListener("DOMContentLoaded", app.init)