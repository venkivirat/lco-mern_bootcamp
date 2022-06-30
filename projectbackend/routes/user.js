//In EVery project route First majorly we need to import Express
const express = require("express");
//from express import router
const router = express.Router();

//We will be bringing few stuff from user and auth controller as well so...
const { getUserById, getUser, updateUser, userPurchaseList } = require("../controllers/user.js");
//const { getUserById, getUser, getAllUsers } = require("../controllers/user.js"); //getAllUsers method is assignement to us from Hitesh... we can delete it now
const { isSignedIn, isAuthenticated, isAdmin} = require("../controllers/auth.js");

//this getUserById will POPULATE 😍❤ req.profile with that
router.param("userId", getUserById);
//in above getUserById will replace by method in controller folder so it will looks like
/*
router.param("userID", (req, res, next, id) => {
    User.findById(id).exec( (err,user ) => {
        if(err || !user){ 
            return res.status(400).json({
                error: "No user was found in the DB"
            })
        }
        req.profile = user
        next();
    });  
});
*/

//MY ALL TIME DOUBT CLEARED HERE 😍😍😍💕💕💕😍😍😍 
//in the below methods when we make request on the router by passign parameter after user, the parameter will assign to :userID and automatically middleware userID will fire up (i.e 'router.param("userId", getUserById);' gonna fireup)
//and then in the above middleware will populate the field req.profile and sets it up (i.e it will create and assign new object called profile (with fetched database data) to request parameter of http) 😀😀😀😀😀

// u can put anything but :userID is GOOD Way to name the param variable bcz going forward in our project we may use productId, cartId, bundleID etcc...
//router.get("/user/:userId", getUser); 
//LETS insert middleware inbetween to authenticate and check the signed in feature 😍❤❤ [REMEMBER U CAN MAKE USE OF MIDDLEWARE by INSERTING THEM ANYWHERE IN THE ROUTE Bcz they are middlewares 😍😍😍]
router.get("/user/:userId", isSignedIn, isAuthenticated, getUser); 

//PUT request - updating things on database
router.put("/user/:userId", isSignedIn, isAuthenticated, updateUser);

//Section -8 lesson -9, using populate from other collection
router.get("/orders/user/:userId", isSignedIn, isAuthenticated, userPurchaseList);

/* 
[DELETE THIS ASSIGNEMENT BCZ WE DONT WANT SOMEONE TO ACCESS MY ROUTE AND SEE ALL THE USERS]
//ASSIGNMENT section-8 lesson-5, fetch all users from the database and return the response
router.get("/allusers", getAllUsers); 
*/

//what ever gonna come up need to be exported so...
module.exports = router;