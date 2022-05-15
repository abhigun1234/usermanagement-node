var mongoose = require('mongoose');


var UserSchema  = mongoose.Schema({
   
    name:{
        type:String,
        required:true,
        trim:true,
        unique:true
    },
    age:{
        type:Number,
        required:true
    },
    contact:{
        type:Number
    },
    email:{
        type:String,
        unique:true
    },
    password:{
        type:String,
        required:true,
        minlength:6
    }
    
    
});

var User = mongoose.model('User',UserSchema);

module.exports = {User};