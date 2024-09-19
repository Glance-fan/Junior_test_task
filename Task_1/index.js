const http = require('http');
const express = require('express');
const app = express();
const pool = require('./pg_conn.js');

app.use('/', require('./routes/01_add_product/add_product.js'));
app.use('/', require('./routes/02_add_remains/add_remains.js'));
app.use('/', require('./routes/03_increase_remains/increase_remains.js'));
app.use('/', require('./routes/04_decrease_remains/decrease_remains.js'));
app.use('/', require('./routes/05_remains_filter/remains_filter.js'));
app.use('/', require('./routes/06_products_filter/products_filter.js'));
app.use('/', require('./routes/07_history/history.js'));





app.get('/', (request, response) => {
    response.end();
});

var port = 3001;
const server = http.createServer(app);
var host = 'localhost'
server.listen(port, host, () => {
    console.log(`Server running at http://${host}:${port}/`);
})