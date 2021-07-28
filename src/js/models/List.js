import uniqid from 'uniqid';

export default class List {

    constructor() {
        this.items = [];
    }

    addItem(count, unit, ing){
        let item = {
            count,
            unit,
            ing,
            id: uniqid()
        }
        this.items.push(item);
    }

    deleteItem(id) {
        const i = this.items.findIndex(el => el.id === id);
        this.items.splice(i, 1);
    }

    updateCount(id, newCount) {
        this.items.find(el => el.id === id).count = newCount;f
    }

    deleteAllItems() {
        this.items = [];
    }

    persistItems() {
        localStorage.setItem('shopping_list', JSON.stringify(this.items));
    }

    readItems() {
        const data = JSON.parse(localStorage.getItem('shopping_list'));

        if (data) this.items = data;
    }

    getNumOfItems() {
        return this.items.length;
    }

}