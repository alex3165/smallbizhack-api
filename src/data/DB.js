const data = require('./defaultData');
const Merchant = require('./Merchant');
const Invoice = require('./Invoice');

class DB {

  getMerchants(userLocation) {
    return Promise.all(
      Object.keys(data.merchants || []).map(m => (new Merchant(m, data.merchants[m])).populateMerchant(userLocation))
    );
  }

  getMerchant(id) {
    const merchantData = data.merchants[id];
    if(!merchantData) return Promise.error('Not found');

    return (new Merchant(id, merchantData)).populateMerchant();
  }

  getInvoices(merchantId) {
    const merchantData = data.merchants[merchantId];
    if(!merchantData) return Promise.error('Not found');

    return (new Merchant(merchantId, merchantData).getInvoices());
  }

  createInvoice(merchantId, orderData) {
    const merchantData = data.merchants[merchantId];
    if(!merchantData) return Promise.error('Not found');

    const merchant = new Merchant(merchantId, merchantData);
    return (new Invoice(merchant.qb)).create(orderData);
  }

}

module.exports = DB;