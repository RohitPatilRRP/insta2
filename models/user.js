const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    firstname: {
      type: String,
      required: true
    },
    lastname: {
        type: String,
        required: true
      },
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    image: { 
        data: Buffer,
         contentType: String ,
        },
    posts : { 
        type : Array , 
        "default" : [] 
    },
    likes :{
        type: Array,
        "default" : []
    }
  });
  
  const User = mongoose.model('User', UserSchema);
  
  module.exports = User;