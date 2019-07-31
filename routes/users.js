const express = require('express');
const router = express.Router();
const User = require('../models/user');


//login
router.post('/login', (req, res) => {

});


//register
router.post('/register', (req, res) => {
    const { firstname, lastname, email, password } = req.body;
    var image_path;

    let errors = [];

    if (!firstname || !lastname || !email || !password) {
        errors.push({ msg: 'Please enter all fields' });
    }
    if (password.length < 6) {
        errors.push({ msg: 'Password must be at least 6 characters' });
    }
    if (Object.keys(req.files).length == 0) {
        return res.status(400).send('No files were uploaded.');
    }

    if (errors.length > 0) {
        res.status(409).send(errors);
    }

    else {
        User.findOne({ email: email }).then((user) => {
            if (user) {
                res.status(500).send('user exits');
            }
            else {
                let sampleFile = req.files.img;
                sampleFile.mv(__dirname + '/uploads/'+ email+"_"+req.files.img.name , function (err) {
                    if (err) {
                        return res.status(500).send(err);
                    }
                    else {
                        console.log('image uploaded');
                        image_path = __dirname + '/uploads/'+ email+"_"+req.files.img.name;
                    }
                });


                const newUser = new User({
                    firstname,
                    lastname,
                    email,
                    password,
                    image_path
                });

                console.log('this ',newUser);
            }
        })

    }


});

module.exports = router;