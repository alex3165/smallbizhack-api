const QuickBooks = require('node-quickbooks');
const Product = require('./Product');

class Invoice {
  constructor(qb, invoiceData) {
    this.qb = qb;
    this.data = invoiceData;
  }

  create(orderData) {
    return Promise.all(
      orderData.products.map(p => (new Product(this.qb, p.productId)).fetch())
    )
    .then(
      products => {
        const invoice = {
          "Line": products.map((product, i) => (
            {
              "Amount": product.price*orderData.products[i].quantity,
              "DetailType": "SalesItemLineDetail",
              "SalesItemLineDetail": {
                "TaxInclusiveAmt": null,
                "ItemRef": {
                  "value": product.id
                },
                "UnitPrice": product.price,
                "Qty": orderData.products[i].quantity,
                "TaxCodeRef": {
                  "value": "3"
                }
              }
            }
          )),
          "CustomerRef": {
            "value": orderData.customerId,
          }
        };

        return new Promise((resolve, reject) => {
          const cbToPromise = (err, data) => err?reject(err):resolve(data);
          return this.qb.createInvoice(invoice, cbToPromise);
        });
      }
    );
  }

  fetchCustomerImage(customerId) {
    const whereClause = `where AttachableRef.EntityRef.value in ('${customerId}')`;

    return new Promise((resolve, reject) => {
      const cbToPromise = (err, data) => err?reject(err):resolve(data);
      this.qb.findAttachables(whereClause, cbToPromise);
    })
    .then(response => (response.QueryResponse.Attachable || []).map(a => a.TempDownloadUri));
  }

  format() {
    return Promise.all([
      Promise.all(
        this.data.Line
        .filter(l => l.SalesItemLineDetail !== undefined)
        .map(l => (new Product(this.qb, l.SalesItemLineDetail.ItemRef.value)).fetch())
      ),
      this.fetchCustomerImage(this.data.CustomerRef.value)
    ])
    .then(
      data => ({
        id: this.data.Id,
        customer: {
          id: this.data.CustomerRef.value,
          name: this.data.CustomerRef.name,
          image: data[1].length && data[1][0]
        },
        products: data[0],
        total: this.data.TotalAmt
      })
    );
  }
}

module.exports = Invoice;