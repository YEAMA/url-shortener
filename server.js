const express = require('express')
const validator = require('validator')

const { mongoose } = require('./mongoose')
const { URL } = require('./url')

var app = express()
const port = process.env.PORT || 3000;
const baseURL = "https://fcc-urls.herokuapp.com/"

app.get('/', (req, res) => {
    res.send("Example to create: <br> https://fcc-urls.herokuapp.com/new/https://www.google.com <br><br><br><hr><br>Example to use: https://fcc-urls.herokuapp.com/500")
})

app.get('/new/*', (req, res) => {
    var url = req.params['0'];
    var short;
    var isURL = validator.isURL(url, {
        require_protocol: true
    })

    if (isURL) {
        URL.findOne({ long: url })
            .then((doc) => {
                if (!doc) {
                    return generateUniqueShort()

                } else
                    res.send({
                        short: baseURL + doc.short,
                        long: doc.long
                    })
            })
            .then((num) => {
                var newURL = new URL({ short: num, long: url })
                return newURL.save()
            })
            .then((doc) => {
                if (doc)
                    res.send({
                        shortened: baseURL + doc.short,
                        original: url
                    })
                else
                    res.status(400).send({ error: "Could not creat short url" });
            })
            .catch((e) => res.send(e))


    } else {
        res.status(400).send({
            error: "Wrong url format - make sure to enter a valid protocol"
        })
    }

})

app.get('/:short', (req, res) => {
    var short = req.params.short;
    URL.findOne({ short })
        .then((doc) => {
            if (doc)
                res.redirect(doc.long);
            else
                res.status(404).send({
                    error: "URL not found!"
                })
        })
        .catch((e) => res.status(400).send(e))
})

app.listen(port, () => {
    console.log(`Server Started on port ${port}`)
})



function generateUniqueShort() {
    var short = Math.floor(Math.random() * 9999);

    return new Promise((resolve, reject) => {
        URL.find({ short })
            .then((doc) => {
                if (doc.length) {
                    short = generateUniqueShort();
                } else
                    resolve(short);
            })
            .catch((e) => reject(e));
    })
}