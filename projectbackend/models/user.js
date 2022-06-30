var mongoose = require('mongoose'); //ES6 we have to import like - import { Schema } from 'mnogoose';
const crypto = require('crypto');  //ES6 we have to import like - import { createHmac } from 'crypto';
const uuidv1 = require('uuid/v1'); //import { v4 as uuidv4 } from 'uuid';
                                //uuidv4(); // ⇨ '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed'

var userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 32,
        trim: true 
    },
    lastname: {
        type: String,
        maxlength: 32,
        trim: true
    },
    email:{
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    userinfo: {
        type: String,
        trim: true
    },
    //TODO: come back here
    encry_password:{
        type: String,
        required: true
    },
    salt: String,
    role:{
        type: Number, //higher the number higher will be the previliges like user-0 helpers-1 technician to my website-2 admin-3
        default: 0
    },
    purchases:{
        type: Array,
        default: [] //empty array means everybody who login first to my website and not purchase anything then his purchases array will be empty
    }
}, 
{timestamps : true}
);  

//creating virtual field password which contians private password variable, salt value, encry password
//mongoose virtual : https://mongoosejs.com/docs/tutorials/virtuals.html
userSchema.virtual ("password")
    .set( function(password){
        this._password = password ; //I want to store pwd in private variable so to make it private use _ and attach to variable name
        this.salt = uuidv1(); //uuidv1 just populate the value which i can assign to salt which i can use in crypto to encrypt the password
        this.encry_password = this.securePassword(password);
    })
    .get(function(){
        return this.password;
    })

//i want to define 2 methods in my userSchema and i can do as below :-)
//defining method into schema https://mongoosejs.com/docs/api.html#schema_Schema-method (Schema.prototype.method())
userSchema.methods = {
    authenticate : function(plainpassword){
        return this.securePassword(plainpassword) === this.encry_password //return TRUE if it entered password matches existing user password
    },

    securePassword : function(plainpassword){
       if(!plainpassword) {
           return "";
       }
       try {
           //crypto nodejs module link: https://nodejs.org/api/crypto.html
           return crypto
           .createHmac('sha256', this.salt)
           .update(plainpassword)
           .digest('hex');
       } catch(err){
           return "";
       }
    }
}
//USEFUL LINKS
//UUID - npm : https://www.npmjs.com/package/uuid

//REMEBER
//Nowhere above i used arrow function. eventhogh i love to use arrow i but mongoose schema much dont support it hence im not using =>

module.exports = mongoose.model("User", userSchema); //recommondation is to export the same name (User) as the scheema name (User). its not mandatory but its recomonded