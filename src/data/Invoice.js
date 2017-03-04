const QuickBooks = require('node-quickbooks');
const Product = require('./Product');

class Invoice {
  constructor(qb, invoiceData) {
    this.qb = qb;
    this.data = invoiceData;
  }

  format() {
    return Promise.all(
      this.data.Line
      .filter(l => l.SalesItemLineDetail !== undefined)
      .map(l => (new Product(this.qb, l.SalesItemLineDetail.ItemRef.value)).fetch())
    )
    .then(
      products => ({
        id: this.data.Id,
        customer: {
          id: this.data.CustomerRef.value,
          name: this.data.CustomerRef.name
        },
        products: products,
        total: this.data.TotalAmt
      })
    );
  }
}

module.exports = Invoice;