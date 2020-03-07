let path = require('path')
let BASE_PATH = path.dirname(process.mainModule.filename);

module.exports = {
  PUBLIC: {
    AVATAR_PICTURES: BASE_PATH + '/../public/avatar-pictures'
  }
}