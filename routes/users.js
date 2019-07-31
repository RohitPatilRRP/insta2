const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');


//login
router.post('/login', (req, res) => {

});


//register
router.post('/register', (req, res) => {
    const { firstname, lastname, email, password } = req.body;

    let errors = [];

    if (!firstname || !lastname || !email || !password) {
        errors.push({ msg: 'Please enter all fields' });
    }
    if (password.length < 6) {
        errors.push({ msg: 'Password must be at least 6 characters' });
    }
    if (req.files.img.size == 0 ) {
        return res.status(400).send('No files were uploaded.');
    }

    if (errors.length > 0) {
        res.status(409).send(errors);
    }

    else {
        const image =req.files.img;
        User.findOne({ email: email }).then((user) => {
            if (user) {
                res.status(500).send('user exits');
            }
            else {
                let sampleFile = req.files.img;
                sampleFile.mv(__dirname + '/uploads/'+ email , function (err) {
                    if (err) {
                        return res.status(500).send(err);
                    }
                    else {
                        console.log('image uploaded');
                    }
                });


                const newUser = new User({
                    firstname,
                    lastname,
                    email,
                    password,
                    image
                });

         //       console.log('this ',newUser);

                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                      if (err) throw err;
                      newUser.password = hash;
                      newUser
                        .save()
                        .then(user => {
                          res.json({
                            message: 'success_msg'
                          });
                        })
                        .catch(err => console.log(err));
                    });
                  });
            }
        })

    }


});

module.exports = router;