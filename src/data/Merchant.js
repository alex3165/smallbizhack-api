const QuickBooks = require('node-quickbooks');
const GreatCircle = require('great-circle')
const Invoice = require('./Invoice');
const Product = require('./Product');

class Merchant {
  constructor(id, data) {
    this.id = id;
    this.image = data.image;
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

  getCompanyInfo() {
    return new Promise((resolve, reject) => {
      const cbToPromise = (err, data) => err?reject(err):resolve(data);
      this.qb.getCompanyInfo(this.id, cbToPromise);
    });
  }

  getInvoices() {
    return new Promise((resolve, reject) => {
      const cbToPromise = (err, data) => err?reject(err):resolve(data);
      this.qb.findInvoices(`where Balance!='0'`, cbToPromise);
    })
    .then(response => Promise.all(response.QueryResponse.Invoice.map(invoiceData => (new Invoice(this.qb, invoiceData).format()))))
  }

  getCategories() {
     return new Promise((resolve, reject) => {
      const cbToPromise = (err, data) => err?reject(err):resolve(data);
      this.qb.findItems(`where Type='Category'`, cbToPromise);
    })
    .then(response => response.QueryResponse.Item.map(i => i.Name).filter(i => ['Hours', 'Services'].indexOf(i) === -1))
  }

  populateMerchant(userLocation) {
    return Promise.all([
      (new Product(this.qb)).getProducts(),
      this.getCompanyInfo(),
      this.getCategories()
    ])
    .then(data => ({
      id: this.id,
      name: data[1].CompanyName,
      city: data[1].CompanyAddr.City,
      categories: data[2],
      image: this.image,
      location: this.location,
      distance: userLocation.lat && GreatCircle.distance(this.location.lat, this.location.lng, userLocation.lat, userLocation.lng),
      products: data[0]
    }));
  }

}

module.exports = Merchant;