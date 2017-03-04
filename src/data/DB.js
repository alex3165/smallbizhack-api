const data = require('./defaultData');
const Merchant = require('./Merchant');

class DB {

  getMerchants() {
    return Promise.all(
      Object.keys(data.merchants || []).map(m => (new Merchant(m, data.merchants[m])).populateMerchant())
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

}

module.exports = DB;