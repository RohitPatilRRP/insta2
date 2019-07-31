const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');

// Set The Storage Engine
const storage = multer.diskStorage({
    destination: './routes/uploads/',
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Init Upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 },
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
}).single('img');


function checkFileType(file, cb) {
    // Allowed ext
    const filetypes = /jpeg|jpg|png|gif/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images Only!');
    }
}



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
    if (req.files.img.size == 0) {
        return res.status(400).send('No files were uploaded.');
    }

    if (errors.length > 0) {
        res.status(409).send(errors);
    }

    else {
        let file;
        User.findOne({ email: email }).then((user) => {
            if (user) {
                res.status(500).send('user exits');
            }
            else {

               
                upload(req, res, (err) => {
                    if (err) {
                        res.json({
                            msg: err
                        });
                    } else {
                        console.log('this',req.file);
                        if (req.file == undefined) {
                            res.json({
                                msg: 'Error: No File Selected!'
                            });
                        } else {

                            console.log('File Uploaded!');
                            file = `uploads/${req.file.filename}`;

                        }
                    }
                });
                // let sampleFile = req.files.img;
                // sampleFile.mv(__dirname + '/uploads/'+ email , function (err) {
                //     if (err) {
                //         return res.status(500).send(err);
                //     }
                //     else {
                //         console.log('image uploaded');
                //     }
                // });


                const newUser = new User({
                    firstname,
                    lastname,
                    email,
                    password,
                    file
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