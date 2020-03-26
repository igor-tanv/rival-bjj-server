let path = require('path')
let BASE_PATH = path.dirname(process.mainModule.filename);
console.log('path',BASE_PATH)

module.exports = {
  PUBLIC: {
    AVATAR_PICTURES: BASE_PATH + '/../public/avatar-pictures'
  }
}