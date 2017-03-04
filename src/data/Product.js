const QuickBooks = require('node-quickbooks');

class Product {
  constructor(qb, id) {
    this.qb = qb;
    this.id = id;
  }

  fetch() {
    return new Promise((resolve, reject) => {
      const cbToPromise = (err, data) => err?reject(err):resolve(data);
      this.qb.getItem(this.id, cbToPromise);
    })
    .then(response => this.format(response))
    .then(product => Promise.all([product, this.getImages([product])]))
    .then(data => this.attachImage(data[0], data[1]));
  }

  getProducts() {
    return new Promise((resolve, reject) => {
      const cbToPromise = (err, data) => err?reject(err):resolve(data);
      this.qb.findItems(`where Type='Inventory'`, cbToPromise);
    })
    // Format each items§
    .then(response => response.QueryResponse.Item.map(this.format))
    // Fetch images for all products
    .then(products => Promise.all([products, this.getImages(products)]))
    // Attach images to individual products
    .then(data => data[0].map(product => this.attachImage(product, data[1])));
  }
  
  getImages(products) {
    const whereClause = `where AttachableRef.EntityRef.value in (${products.map(p => `'${p.id}'`)})`;

    return new Promise((resolve, reject) => {
      const cbToPromise = (err, data) => err?reject(err):resolve(data);
      this.qb.findAttachables(whereClause, cbToPromise);
    })
    .then(response => response.QueryResponse.Attachable.map(a => ({
      productId: a.AttachableRef[0].EntityRef.value,
      image: a.ThumbnailTempDownloadUri
    })));
  }

  attachImage(product, images) {
    return Object.assign({}, product, {
      images: images.filter(i => i.productId === product.id).map(i => i.image)
    });
  }

  format(data) {
    return {
      id: data.Id,
      name: data.Name,
      price: data.UnitPrice
    };
  }
}

module.exports = Product;