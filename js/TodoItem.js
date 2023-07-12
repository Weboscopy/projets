export default class TodoItem {
    get id(){
        return this._id
    }

    set id(id){
        this._id = id
    }

    get name(){
        return this._name
    }

    set name(name){
        this._name = name
    }

    get category(){
        return this._category
    }

    set category(category){
        this._category = category
    }

    get date(){
        return this._date
    }

    set date(date){
        this._date = date
    }
}