const mongoose = require("mongoose");
//I want this category property to be linied to previous schema that i have created so i have to use the concept of mongoose objectId
//https://mongoosejs.com/docs/api.html#mongoose_Mongoose-ObjectId
const {ObjectId} = mongoose.Schema; //😭😭😭Initially I had put ObjectID. ERROR Will be : TypeError: Invalid value for schema path `category.type`, got value "undefined"

const productSchema = new mongoose.Schema({
    name:{
        type: String,
        trim: true,
        required: true,
        maxlength: 32
    },
    description:{
        type: String,
        trim: true,
        required: true,
        maxlength: 2000
    },
    price:{
        type: Number,
        trim: true,
        required: true,
        maxlength: 32
    },
    //I want this category property to be linied to previous schema that i have created so i have to use the concept of mongoose objectId
    //https://mongoosejs.com/docs/api.html#mongoose_Mongoose-ObjectId
    category:{
        type: ObjectId, //this is kind of venki defined type at line no 2
        ref: "Category", //we have to tell from which schema this ObjectId is reffered from i.e exact name of exported schema name. here it s "Category"
        required: true
    },
    //this stock property i can use to keep the number of that perticular tshirt unit i have stock
    stock:{
        type:Number
    },
    //this stock property i can use to keep the number of that perticular tshirt unit i have sold
    sold:{
        type:Number,
        default: 0 //default 0. bcz whenever i create a product obviosuly i would have not sold anything yet hence its 0
    },
    //usually we should not put photos into project DB bcz its bit heavier. other ways are like keeping the link and downloading when its requried like in Amazon or facebook
    //if i was using FIREBASE then i can create folder and keep photos and just pulled out reference
    //but now in this project lets just keep it in our project DB only
    photo:{
        data: Buffer,
        contentType: String
    }
},
{ timestamps: true}
);

module.exports = mongoose.model("Product", productSchema);