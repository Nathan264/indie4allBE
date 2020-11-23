const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const requireDir = require('require-dir');
const routes = require('./routes');
require('dotenv-safe').config();

mongoose.connect('mongodb://localhost:27017/indie4all', { 
    useNewUrlParser: true, 
    useUnifiedTopology: true, 
    useCreateIndex: true,
    useFindAndModify: false
});
requireDir('./models');

const app = express();
const port = process.env.port || 3333;

app.use(cors());
app.use(express.json());
app.use(routes);
app.use('/static',express.static('uploads'));

app.listen(port);