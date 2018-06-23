const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/strapi'); 

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


morgan('tiny');

app.use(express.static('public'))


const routes = require('./api/routes/girlRoute');
routes(app);

const server = app.listen(9000, function () {
    const host = server.address().address;
    const port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
});