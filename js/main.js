import TodoItem from "./TodoItem.js"
import TodoList from "./TodoList.js"

const todoList = new TodoList();


const app = {
    init(){
        console.log(todoList)
    }
}


document.addEventListener("DOMContentLoaded", app.init)