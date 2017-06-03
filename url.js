const mongoose = require('mongoose')

var URL = mongoose.model('URL', {
    short: {
        type: Number,
        required: true,
        unique: true
    },
    long: {
        type: String,
        required: true
    }
});

module.exports = { URL }