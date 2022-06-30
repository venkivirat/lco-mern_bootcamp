/*Remember whenever we create any router from scracth first main things u need to do are
const express = require("express");
const router = express.router;

<CODE HERE>

module.exports = router; */

const express = require("express");
const router = express.Router();

//in this router category.js route we need methods which we export from cateogry controllers hence will add them
const {getCategoryById, createCategory, getCategory, getAllCategory, updateCategory, removeCategory} = require("../controllers/category.js");
//in this router category.js route we even need methods which we export from auth and user controllers hence will add them too
//from auth what all we may need - a user can be able to create categories if he signed in, if he logged in as well and only admin should be able to create categories so we need the below stuff mention inside {}
const {isSignedIn, isAuthenticated, isAdmin} = require("../controllers/auth.js");
//getUserById method i need from user hence will add them inside {}
const {getUserById} = require("../controllers/user.js");


//HC - Params goes here
/* 😍😍😍
So anywhere if my proect see userID in the parameter, then its just go ahead and populate my profile field 
(this feature is defined in the user.js file from router folder which inturn connects with getuserbyid function in user.js from 
controller folder and create re.profile object which is actually a user detail object in json format and it will be added to my body itself http call) 
😍😍😍*/
router.param("userId", getUserById); 
//similar to above we will create something for category too😀😎😀...
router.param("categoryId", getCategoryById); 


//HC- Actual routes goes here

//HC - create routes
//😡😡😡Remember the order of the middleware isSignedIn , isAuthenticated, isAdmin are very imprtant (HC told in section 9 - lesson 3)
router.post( 
    "/category/create/:userId", 
    isSignedIn , 
    isAuthenticated, 
    isAdmin ,
    createCategory
);

//HC - read/get routes
router.get( "/category/:categoryId", getCategory);
router.get( "/categories", getAllCategory);

//HC - update routes
router.put( 
    "/category/:categoryId/:userId", 
    isSignedIn , 
    isAuthenticated, 
    isAdmin ,
    updateCategory
);


//HC - delete routes
router.delete( 
    "/category/:categoryId/:userId", 
    isSignedIn , 
    isAuthenticated, 
    isAdmin ,
    removeCategory
);


module.exports = router;
