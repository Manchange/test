var express = require('express');
var app = express();
app.use(express.static('../../src'));
require('./route.js').getBrand(app);
app.listen(2566);