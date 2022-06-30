//First Import user model. User is variable whichim using for my user module
const User = require("../models/user"); 
const Order = require("../models/order");

//very first thing we should do after importing the model is export a method so that our params can candle

//So lets create a method getUserById (basically its a MIDDLEWARE)  
//lets use findByID method then CHAIN😍 it to exec method which will does the execution and bring everything to us then we can do a CALLBACK here
//whenever there is database callback (a callback in a database method (mongoose method)) REMEMBER ❤😍 it will always retrun 2 things i.e ERROR MESSAGE AND THE OBJECT ITSELF if it was found
exports.getUserById = (req, res, next, id) => {
    User.findById(id).exec( (err,user ) => {
        //if error is there or there is no user then return set http response status code to 400 and chain 😍 a json response back with customized message
        if(err || !user){ 
            return res.status(400).json({
                error: "No user was found in the DB"
            })
        }

        //else means user found... so now lets store into REQUEST OBJECT😍 infact we can create an Object inside Request Object by just appending '.objectvarname' to 'req' object
        //in other words - if no error then we simply go and populate the object called "profile" in the request
        req.profile = user;

        //since it is callback function (from line 7 only u can check) 100% compulsory to chain it back as next() 
        //in other words - //once all these done then hand over to next()
        next();
    });  
};

//Unlike getUserById method getUser is simple method where whenever somebody calls this method we have to grab a user and send it back thats it 😂😂😂
exports.getUser = (req, res) => {
    //TODO: get back here for password (done we edited in the section-8 lesson-4 fixing a major bug)
    // "" will assign empty string, udefiened will not display that property only in the json repose to frontend
    // req.profile.salt = "";
    req.profile.salt = undefined;
    req.profile.encry_password = undefined;

    //in this getUser method we can make use of the object profile which we created in the getUserById method... EFFICIENT WAY OF WRITING A CODE
    return res.json(req.profile);
};

/*
[DELETE THIS ASSIGNEMENT BCZ WE DONT WANT SOMEONE TO ACCESS MY ROUTE AND SEE ALL THE USERS]
//ASSIGNMENT section-8 lesson-5, fetch all users from the database and return the response 
exports.getAllUsers = (req, res) => {
    User.find().exec( (err, allUsers) => {
        if(err || !allUsers){
            return res.status(400).json({
                error:"No users exist in database. 0 users"
            });
        }

       // return res.json(allUsers); //or just send the response no need of return here...
        res.json(allUsers);
        
    });
};
*/

//Here we are updating on the stuff present in the database... so some additional things need to be done unlike above methods getUser, getUserById etc
exports.updateUser = (req, res) => {
    User.findByIdAndUpdate(
        {_id: req.profile._id}, //what data to find and update... for that will pass query using { databasefield: value} parentesis
        {$set: req.body}, //what we want to update will pass it in $set, so here i'm updating everything which is there in my request body
        {new: true, useFindAndModify: false},  //general parameters necessary while updating things in database (read them in mongoose documentory)
        (err, updatinguserdata) => { //updatinguserdata just variable.. in hitesh code it is just user
            if(err){
                return res.status(400).json({
                    error:"you are not authorized to update this user"
                })
            }

            updatinguserdata.salt = undefined;
            updatinguserdata.encry_password = undefined; 
            res.json(updatinguserdata);
        }
    )
};


//Section -8 lesson -9, using populate from other collection
exports.userPurchaseList = (req, res) => {
    Order.find({user: req.profile._id}) //one more time to inform you that req.profile._id this is coming from my middleware
    .populate("user", "_id name") //syntax of populate mongoose database function is - Usermodel.fetchmethod().populate("<the model/object u r updating", "<field1 field2 field3>")
    .exec((err, urder) =>{
        if(err){
            return res.status(400).json({
                error:"No order in this account"
            })
        }
        return res.json(order)
    })
} 


//section-8 lesson-10, one more MIDDLEWARE to update purchases 
//🥰😘🥰just i'm writing a MIDDLEWARE here to udpate the purchase list of a user model whenever a user order a product
//1. Here we are recieving some info from front end we are looping through it, creating an object from it, storing that object using push method into purchases array (i.e this one - let purchases = []) 
//2. finally we will use model user, and we are finding and updating purchases to a document in db based on user id, and here we are handling error, if no error then we will move using next() bcz this is middleware
exports.pushOrderInPurchaseList = (req, res, next) => {
   
   let purchases = []
   //we are just looping through each product of an oder (one time amazon order we may have multiple products) and add them to local array purchases
   req.body.order.products.forEach(product => {
       //i'm using method of array object push.. what information i'm pushing = im pushing an object every single time
       purchases.push({
           _id: product._id,
           name:product.name,
           description: product.description,
           category: product.category,
           quantity: product.quantity,
           amount:req.body.order.amount, //this will come from request body (ie i guess from front end)
           transaction_id: req.body.order.transaction_id
       });
   });
   
   //store this in DB (use findoneandupdate db fuction - bcz the data which we push should get added to a perticular data if it is not there)
   User.findOneAndUpdate(
       {_id: req.profile._id},
       {$push: {purchases: purchases} }, //as we are pushing array we cant use $set, we have to use $push 😍😍😍 {database array purchases: local purchases array which written above}
       {new:true}, //😍😎😎remember from db we recieve error nad object iteself so here new:true -> after dupdating it will retrun the updated document not the old document
       //no need to add .exec() here, directly u can write callback
        (err, purchases) => {
            if(err){
                return res.status(400).json({
                    error: "Unable to save purchase list"
                })
            }
        next();      
        }
   ) 
}