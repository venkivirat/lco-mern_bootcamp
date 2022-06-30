//11-2

/* In controller we usually import the models first, and usually we import/require like below
//product.js from controller
const Product = require("../models/product");
this is becuase in that respective model file we are exporting just one thing/ one model like below
//product.js Model from models
module.exports = mongoose.model("Product", productSchema); */

//but here for order.js controller we need to do differently
// bcz in order.js model we are exporting two models those are "Oder model" and "Productcart model"
const {Order, ProductCart} = require("../models/order.js");


//11-2
exports.getOrderById = (req, res, next) => {
    /* REGULAR STUFF WHAT WE DO IS
    //apply mongoose query method findById() to Order model and inject our id there then chain it to exec() method
    Order.findById(id).exec((err, order) => {
        //if error then we will set the http response status to 400 and send the error message in JSON format
        if(err){
            return res.status(400).json({
                error:"No Order found in the DB"
            })
        }
        //if no error then we simply go and populate the object called "order" in the request
        req.order = order; 
        //once all these done then hand over to next()
        next();
    }); 
    */

    //BUT IN ORDER WE DO NEED MUCH MORE THINGS like PRODUCT DETAILS bcz an ORDER is COMPRISED of variety of products SO We need to use populate here to pupulat the name and the price of the individual product
     //apply mongoose query method findById() to Order model and inject our id there then chain it to exec() method
     Order.findById(id)
     .populate("Products.product", "name price") //we are picking the name and price fields of each one product. 🥰😍😘 Make sure you dont use , to seperate the required fields in the populare method ie "name price" is correct and "name, price" is wrong
     .exec((err, order) => {
        //if error then we will set the http response status to 400 and send the error message in JSON format
        if(err){
            return res.status(400).json(
                {
                error:"No Order found in the DB"
            })
        }
        //if no error then we simply go and populate the object called "order" in the request
        req.order = order; 
        //once all these done then hand over to next()
        next();
    }); 
};

//11-3
exports.createOrder = (req, res) => {
    //req.body.Order.user this is the method in the Order model that i have defined and that is based on the Users model so i can simply assign using req.profile, and this profile is populated by my params which is getUserById
    req.body.Order.user = req.profile;
    const order = new Order(req.body.order)

    order.save((err, order) => {
        if(err){
            return res.status(400).json({
                error:"Failed to save your oder in DB"
            })
        }
        res.json(order);
    });
};


//11-4
exports.getAllOrders = (req, res) => {
    Order.find()
    .populate("user", "_id name") // we want to poupulate _id and name from user model... u can add much more if u need
    .exec((err, allorders) => {
        if(err){
            return res.status(400).json({
                error:"No orders found in the DB"
            });
        }
        res.json(order);
    });
};


//11-5
exports.getOrderStatus = (req, res) =>{
    //this is how we need to grab the enum values from any model schema
    res.json(Order.schema.path("status").enumValues); //not sure this is correct way of not H.C will go through the documentaion part and suggested us to do to and chekc whether the below written syntax is correct or not
}

//11-5
exports.updateStatus = (req, res) =>{
    Order.update(
        {_id: req.body.orderId}, //this value we are grabbing from front end
        {$set: {status: req.body.status}},
        (err, updatedorder) => {
            if(err){
                return res.status(400).json({
                    error:"Cannot update the order status"
                });
            }
            res.json(updatedorder);
        }
    );
};










