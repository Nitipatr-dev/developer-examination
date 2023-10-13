class Item {
    constructor(itemData) {
        this.name = String(itemData.name || '');
        this.price = Number(itemData.price) || 0;
        this.quantity = Number(itemData.quantity) || 0;
        this.description = String(itemData.description || '');
    }
  
    static create(itemData) {
        return new Item(itemData);
    }
  }
  
  module.exports = Item;
  