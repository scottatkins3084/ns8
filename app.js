const express = require('express');
const app = express();


const dataRoute = require('./routes/data');

app.use('/data', dataRoute);


app.listen(3000);

