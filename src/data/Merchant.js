const QuickBooks = require('node-quickbooks');
const Invoice = require('./Invoice');
const Product = require('./Product');

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

  populateMerchant() {
    return Promise.all([
      (new Product(this.qb)).getProducts(),
      this.getCompanyInfo()
    ])
    .then(data => ({
      id: this.id,
      name: data[1].CompanyName,
      image: 'https://farm1.staticflickr.com/110/296976979_16fae1c07b_z_d.jpg',
      location: this.location,
      products: data[0]
    }));
  }

}

module.exports = Merchant;