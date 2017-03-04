const data = require('./defaultData');
const Merchant = require('./merchant');

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

}

module.exports = DB;