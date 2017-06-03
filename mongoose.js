const mongoose = require('mongoose')

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://yeama:yeama123456789@ds064799.mlab.com:64799/urls')

module.exports.mongoose = mongoose;