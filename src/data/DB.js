const data = require('./defaultData');
const Merchant = require('./merchant');

class DB {

  getMerchants() {
    return Promise.all(
      Object.keys(data.merchants || []).map(m => (new Merchant(m, data.merchants[m])).populateMerchant())
    );
  }

}

module.exports = DB;