export default class TodoList{
    constructor(){
        this._list = []
    }

    getList(){
        return this._list
    }

    getListLength(){
        return this._list.length
    }

    clearList(){
        this._list = []
    }

    addItemToList(item){
        this._list.push(item)
    }

    removeItemFromList(id){
        this._list = this._list.filter(item => item._id != id)
    }
}