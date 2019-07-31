const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const secret = 'demoapp';
const mongo = require('mongodb');
const fileUpload = require('express-fileupload');
const port = process.env.PORT || 3000;

const uri = 'mongodb+srv://root:123@cluster0-razzt.mongodb.net/test';

const db = mongoose.connect(uri,{useNewUrlParser: true}).then(()=>{ console.log('connected')}).catch((error) => { console.log(error); });

app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());

app.use('/',require('./routes/index'));
app.use('/users',require('./routes/users'));

app.listen(port, () => {
    console.log(`listning on ${port}`);
});