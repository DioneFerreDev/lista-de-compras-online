

class Item {

    static id = 0;
    static allItems = [];

    constructor(name, estPrice) {
        this.id = Item.id;
        this.name = name;
        this.estPrice = estPrice;
        this.done = false;
        this.realPrice = "0";
        Item.id++;        
    }
}
class ReorganizarAlfabeticamente {

    constructor(items) {
        items.sort(function (a, b) {
            
                if (a.name > b.name) {
                    return 1;
                }
                if (a.name < b.name) {
                    return -1;
                }
                return 0;            
        })

        return items
    }

}


