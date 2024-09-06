var express = require('express');
var router = express.Router();
require('dotenv/config')


// const mongoose = require("mongoose");
// require('dotenv.config')


// const dbOptions = {}
// mongoose.connect(process.env.DB_URI, dbOptions)
// .then(() => console.log("MY DB IS CONNECTED"))
// .catch(() => console.log("ERROR: mongoose.connect did not connect"))


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
