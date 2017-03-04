const QuickBooks = require('node-quickbooks');

class Merchant {
  constructor(id, data) {
    this.id = id;
    this.location = data.location;

    this.qb = new QuickBooks(
      data.consumerKey,
      data.consumerSecret,
      data.oauthToken,
      data.oauthSecret,
      data.realmId,
      true,
      true
    );
  }

  getProducts() {
    return new Promise((resolve, reject) => {
      const cb = (err, data) => err?reject(err):resolve(data);
      this.qb.findItems(`where Type='Inventory'`, cb);
    })
    .then(response => response.QueryResponse.Item.map(this.formatItem));
  }

  populateMerchant() {
    return this.getProducts()
    .then(products => ({
      id: this.id,
      name: 'tintin',
      location: this.location,
      products: products
    }));
  }

  formatItem(qbItem) {
    return {
      id: qbItem.Id,
      name: qbItem.Name,
      price: qbItem.UnitPrice
    };
  }

}

module.exports = Merchant;