var express = require('express');
var router = express.Router();
//const { check, validationResult } = require('express-validator'); //and you can use validationresult (will use in controller->auth.js) also but in this file we only use check 
const { check } = require('express-validator'); 

//import signout method from auth.js in controller to here (auth.js in controller may have many methods but im imprting signout here as of now)
const {signup, signout, signin, isSignedIn} = require("../controllers/auth.js")

//express validator (to validate the data ex: before entering user/client data to db):  https://express-validator.github.io/docs/  and https://express-validator.github.io/docs/custom-error-messages.html
// we actually apply validation AFTER the route (here it is /signout) and BEFORE the controller (here it is signout)
//router.get("/signout", signout); By adding validation its look bit heavy defintion as shown below. but learn it which is EASY and USEFUL
router.post("/signup",  [
    check("name", "name should be atleaset 3 char").isLength({ min:3 }),
    check("email", "valid email is required").isEmail(),
    check("password","password should be atlease 3 char").isLength({ min:3 })
],  
signup);

router.post(
    "/signin", 
   [
    check("email", "valid email is required").isEmail(),
    check("password","password field is required").isLength({ min:1 })
   ],  
   signin
);

//signout is the simple process where we just clear cookies from users browser so here user wont pass any info or not fill any form etc... 
//so just create a controller for signout
router.get("/signout", signout);

//test this protected testroute via postman
//this route only works if you are logged in else it will throw error which is correct() UnauthorizedError: No authorization token was found)
// to get it work: first signin then send the created token in the header as Key (Authorization) , value(Bearer <token value>).. if the token is not correct then you will get error (UnauthorizedError: invalid token)
router.get("/testroute", isSignedIn, (req, res) => {
   // res.send("a protected route"); 
   res.json(req.authVarAnyName); //authVarAnyName is name of var which is coming from isSignedIn middleware from auth.js from conroller. it will return the id which is same is id which was given to us during signein in the postman... BASED ON THIS WE CAN DO LOT OF TESTING FURTHER
});

module.exports = router; //this will export the router variable which we created in this app