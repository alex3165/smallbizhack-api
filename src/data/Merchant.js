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
      const cbToPromise = (err, data) => err?reject(err):resolve(data);
      this.qb.findItems(`where Type='Inventory'`, cbToPromise);
    })
    // Format each items§
    .then(response => response.QueryResponse.Item.map(this.formatItem))
    // Fetch images for all products
    .then(products => Promise.all([products, this.getImages(products)]))
    // Attach images to individual products
    .then(data => data[0].map(product => this.attachImage(product, data[1])));
  }
  
  getImages(products) {
    const whereClause = products.reduce((acc, p,i) => {
      if(i === 0) return acc.concat(` AttachableRef.EntityRef.value='${p.id}'`);
      else return acc.concat(` OR AttachableRef.EntityRef.value='${p.id}'`);
    }, 'where');

    return new Promise((resolve, reject) => {
      const cbToPromise = (err, data) => err?reject(err):resolve(data);
      this.qb.findAttachables(whereClause, cbToPromise);
    })
    .then(response => response.QueryResponse.Attachable.map(a => ({
      productId: a.AttachableRef[0].EntityRef.value,
      image: a.TempDownloadUri
    })));
  }

  attachImage(product, images) {
    return Object.assign({}, product, {
      images: images.filter(i => i.productId === product.id).map(i => i.image)
    });
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