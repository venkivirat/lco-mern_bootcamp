//create the file in controller folder with the same name as file created in routes folder
//in this file we can directly exports the individual function (as many as we want) using exports.functionName

const User = require("../models/user"); //Importing the user.js model mongoose schema
//const { check, validationResult } = require('express-validator'); //here we dont need check, just we need expressvalidator
const { validationResult } = require('express-validator'); 
//moduule to create token and put that into user browser to authenticate user at any given time
var jwt = require('jsonwebtoken'); //https://www.npmjs.com/package/jsonwebtoken 
var expressJwt = require('express-jwt'); //https://www.npmjs.com/package/express-jwt


exports.signup = (req, res) => {

    //documentation about error validation https://express-validator.github.io/docs/index.html we need to send the response in good format
    const errors = validationResult(req);

    if(!errors.isEmpty() ){
        return res.status(422).json({
            //errors is an array of objects as u can see in the doc h ttps://express-validator.github.io/docs/index.html
            /*
            {
                "errors": [
                     {
                        "location": "body",
                        "msg": "Invalid value",
                        "param": "username"
                    }
                ]
            }
            */
            //we need to convert it to array (use the "array" method which is method in Javascript which convert everthing to an array)
           //"errors.array()" now access first element with "[0]" and now its object so i can take out anything in it like .msg or .param etc
            error: errors.array()[0].msg  
        });
    }
//OUTPUT
//when i send user data with email having no format i got the response in postman as
//{
  //  "error": "valid email is required"
//}

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
                name:user.name,
                lastname:user.lastname,
                email:user.email, //email is the exact field name of monogdb response object / u can say field name of user database table
                id:user._id //REMEMBER the field name is _id not just id
            })
        }
 
    })
};

exports.signin = (req, res) => {
    const errors = validationResult(req);
    //previos controllers we were just passing all the info coming up from user into body to the database bcz all the data was needed
    //now in here - signin, we are just curiuos about 2 info so from req.body we jsut extract email and password 
    //ES6 - latest feature of javascript - OBJECT DESTRUCTURING 🥰 where we can mention only the required field from the array object
    const {email, password} = req.body; //So here we extracted email and password which we can use directly in the code

    //VALIDATION PART
    if(!errors.isEmpty() ){
        return res.status(422).json({
         error: errors.array()[0].msg  
        });
    }


    //findone matches very first match from the database
    //Syntax: module.mogoosemethod({condition/property on which this findone need to search}, (callback parameters will be 'error' and 'object itslef') => { callback method})
    User.findOne({email}, (err, user) =>{
        // if the email does not exist then set the status code 400 and send proper customized error response in json format (instead of default error message which is good practice)
        if(err || !user){
            return res.status(400).json({ 
                error:"User email does not exists"
            })
        }

        //if email exist then check for match of the password if it not matches then get inside the if block
        //for this will use AUTHENTICATE Method in User module... will make use of that method here
        //while using this method we authenticate based on plainpassword which user enters which we need to pass here as parameter
        if(!user.authenticate(password)){
            res.status(401).json({  //initially i had forgot to put return here. return required bcz i dont want further execution of things over here
                error:"Email and password do not match"
            })
        }

        //H.C: CREATE TOKEN
        //validation/check is done, now i have i have to signin 😍 the user i.e create token and put that toeken into cookies
        //i will use jwt method signin, and i can create sign with any key value pair, so i use _id which given to me by user method 
        //const token = jwt.sign({_id: user._id}, "shhhh") // or use any string u like... better to use ir via .env file
        const token = jwt.sign({ _id: user._id }, process.env.SECRET);
        //H.C: PUT TOKEN INTO USER COOKIE
        //🥵 Got error "Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client" and app crashed when i sent the wrong pwd... need to fix it
        //🥵 https://stackoverflow.com/questions/7042340/error-cant-set-headers-after-they-are-sent-to-the-client
        res.cookie("token", token, { expire: new Date() + 9999 }); 


        //send response to front end
        //lets use DECONSTRUCT feature on user object and send only required stuff to front end
        const {_id, name, email, role} = user; 
        return res.json({token, user: {_id, name, email, role} });
    });
};


exports.signout = (req, res) => {
    //clear the cookie for the token which is the variable you passed to cookie method in the signin controller 
    res.clearCookie("token");
    res.json({
         message: "user signout successfully"
     })
 };


//H.C: Protected routes
//good practice = for route protection methods try to prepend "is" like isSignedIn, isAdmin etcc
exports.isSignedIn = expressJwt({   //pass object to expressJwt which we required/imported above in this file.. so to pass object use always {}
    secret: process.env.SECRET,
    userProperty: "authVarAnyName" //😊VIP- here the middleware just add property inside the reqest which is here authVarAnyName which we can make use in other function, at routes functions etcc...
}); //remember in custom middlewares we always use next(), the reason why we not write next() here even isSignedIn is middleware is bcs the 'expressJwt' method already got next() covered up for us.. so we are not writing next() here


 //H.C: Custom middlewares
exports.isAuthenticated = (req, res, next) => {
    //req means data from frontend or userend... so through the frontedn we are goint to setup property called profile.. u can name anything u like and this profile only going to set if the user logged in.. like if you have email, id or role then only this propoerty will set
    //SO we are creating variable checker... where req.profile will set up fron front end, authVarAnyName propoerty set from above SignedIn method, and then we chech the profile id which is set from the front end is equal to authVarAnyName id which set by middleware..
    let checker = req.profile && req.authVarAnyName && req.profile._id == req.authVarAnyName._id; // use == to commpare the values, use === to compare the object itself
    console.log("req.profile is : "); console.log(req.profile);
    console.log("req.authVarAnyName is : "); console.log(req.authVarAnyName);
    console.log("req.profile._id is : "); console.log(req.profile._id);
    console.log("req.authVarAnyName._id is: "); console.log(req.authVarAnyName._id);
    //if all of the above are true that means the user can autheticated and change things in his own account. 😍😍😍
    if(!checker){
        return res.status(403).json({
            error:"Access Denied for you as you are not authenticated"
        });
    }
    next();
};

exports.isAdmin = (req, res, next) => {
    //how to check wherher the user is admin... its simple using our admin model property which we created
    //again remember the profile is gonna set from front end
    if(req.profile.role === 0){
        return res.status(403).json({
            error: "You are not ADMIN, access to this page/route/feature denied for you"
        })
    }
    next();
};