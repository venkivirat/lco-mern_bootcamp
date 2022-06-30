//Document for routes in express - https://expressjs.com/en/guide/routing.html

//**********************************************routes/auth.js*********************************************************************************

//const { Router } = require("express");
//OR
// you can use traditional way of getting Router https://expressjs.com/en/guide/routing.html 
var express = require('express');
var router = express.Router();


/*
//REMEMBER Carefully only conosle.log and without any response like res.send or res.json etc back to browser/client then the api req will load infinitely and throw error
//if you just use console.log it will print in the browser console or in IDE console like Visual code and when we try http://localhost:7000/api/signout then the broswer will load infinitely as there is no responose like res.send or res.json etcc
const signup = (req, res) => {
    //console.log("Signup works!"); //only conosle.log and without any response like res.send or res.json etc back to browser/client then the api req will load infinitely and throw error
    //res.send("signed in successfully");
    console.log("REQUEST BODY", req.body); //HERE we can directly access body of json bcz we are already imported and using Json parser middleware in the app.js which takes up any incoming json and parse it and we can use the json methods in our project
    res.json({
        message: "signed in successfully"
    })
}
*/

/* UPDATED function of above one
 exports.signup = (req, res) => {
    //console.log("Signup works!"); //only conosle.log and without any response like res.send or res.json etc back to browser/client then the api req will load infinitely and throw error
    //res.send("signed in successfully");
    console.log("REQUEST BODY", req.body); //HERE we can directly access body of json bcz we are already imported and using Json parser middleware in the app.js which takes up any incoming json and parse it and we can use the json methods in our project
    res.json({
        message: "signed in successfully"
    })
 }
 */
 
 // UPDATED function of above one

 exports.signup = (req, res) => {
    const user = new User(req.body); //user is object of class User (which is a mongoose schema) and the data is passed by body paramaeter which send by client / browser
    //since user is created by Class User which further created by mongoose we can access All DATABASE methods which MONGOOSE provide to us
    //you can use objectofmongooseschema.save (here user.save) or populate etc etc .... methods
    //user.save(); //it will just save the data to database thats good but i want to send some response to client hence use callbacks
    //and any method of mongodb or firebase gives two parameters back to us those are "error" and the "same object which we tried to save to database"
    user.save( (err, user) => { 
        if(err){ 
            //console.log(err); to display the complete error stack in the console
			//res.send(err); to display the complete error stack to the clinet /broswer / postman 
            return res.status(400).json({  //if error then send 400 status code and clear info to front end user in the Json format is good too
                err: "NOT able to save user in DB"
            })
        }
        else{
             // res.json(user); //if no error send the complete object i.e user here, or we can selectively send required field as shown below
            res.json({
                Name:user.name,
                Lastname:user.lastname,
                EmailID:user.email, //email is the exact field name of monogdb response object / u can say field name of user database table
                id:user._id //REMEMBER the field name is _id not just id
            })
        }
 
    })
};


/*
router.get("/signout", (req, res) => {
    res.send("user signout succcessfully");
})
*/
//OR
const signout = (req, res) => {
    //REMEMBER Carefully if you just use
    //console.log("Signup works!"); 
    res.send("user signout succcessfully");
    //Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client
    //BCZ once response send used the control goes out of fucntion and again u can't set json header and respond. so use any one response
    res.json({
        message: "user signout"
    })
}

/* 
//YOU can place the above code in Controller->auth.js and import here for organising my project in better way, better coding structure and easy understanding
//auth.js in controller
//create the file in controller folder with the same name as file created in routes folder

//we can directly exports the function using exports.functionName
exports.signout = (req, res) => {
    res.json({
         message: "user signout"
     })
 }
//import signout method from auth.js in controller to here (auth.js in controller may have many methods but im imprting signout here as of now)
const {signout} = require("../controllers/auth.js")
*/

router.get("/signout", signout);

module.exports = router; //this will export the router variable which we created in this app

