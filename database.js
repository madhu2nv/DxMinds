var mongojs = require('mongojs');
module.exports = {

  url: mongojs("mongodb://localhost:27017/DxMinds", [])

}