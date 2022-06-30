const mongoose = require("mongoose");
const {ObjectId} = mongoose.Schema;

//usually we should have one model.js for one schema but sometimes we may need to have it one model.js file only.. its not an error

//product schema is the one which you can relate to array of products in the order screen in flipkart or amazon
const ProductCartSchema = new mongoose.Schema ({
    product:{  //product (again its a product schema)
        type: ObjectId,
        ref: "Product"
    },
    name: String, //name of the product
    count: Number, //in the cart a user can order any number of (2 or 3 or 4 etc) same products. so for this he will just increase the count of the product
    price : Number //price of the product (if it is in 2 count then 2*actualprice = price )
});

const ProductCart = mongoose.model("ProductCart", ProductCartSchema);

//Order schema represent ordering the variety or products in the order/cart page
const OrderSchema = new mongoose.Schema(
    {
        products: [ProductCartSchema], //array of products in the order cart (its array of ProductCartSchema again)
        transaction_id: {}, //payment id 
        amount: {        //total amount of all products
             type: Number //or directly you can write amount:Number if at all u are sure that no other arguemtents or properties you wont use for amount
        },
        address: String, //address of the user to which the products will be sent
        //this added during the 12-4 Section-12, lesson-4
        status: {
            type: String,
            default: "Recieved", //default status of the order
            enum: ["Cancelled", "Delivered", "Shipped", "Processing", "Recieved"]
        },
         //till here added during the 12-4 Section-12, lesson-4
        updated: Date,  //updated cart
        user:{             //the user info (its a user schema again)
            type: ObjectId,
            ref: "User"
        }
    },
    { timestamps : true}
);

const Order = mongoose.model("OrderSchema", OrderSchema);

//Exporting 2 schema is using the variable names can be done in this way
module.exports = {  Order, ProductCart };

/* 
ENUMS
Enums are looks almost like an array but they are very restricitve choice and only from that choice you can use certain things.
Example Usecase:
✈🛫🛬
    Lets say you are travelling in an aeroplane and in the airplace always you asked about 3 kinds of seats Window, middle or aisle seat. Now imagine if a user who
is alloting you a seat just mentioned as corner seat instead of aisle seat. this strange thing which is a small choas in the naming convenstion can 
create a nightmare for the staff inside the plane to show that seat to user.
    So as a programmer you need to restrict the usecase of what word user is using while doing booking or recieving an order in such places we use ENUMS
    Incase of aeroplane there is just window, corner, or aisle seat and there is no such term called corner seat.

🥰🎈😘
    Similar to that when we are processing the order of the user we want to restrict the order phase that the order is in a given moment. like whether the order is in
recieved state?
ordering state?
processing state?
delevered state? or 
cancelled state?
and these states we need to retrict using ENUMS
    So for this we need to update our order schema.
*/