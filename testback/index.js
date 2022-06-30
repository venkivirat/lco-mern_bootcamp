const express = require("express");

const app = express();
const port = 7000;

//you can define method without using "arrow function expression" 
app.get("/", (req, res) => res.send("hello venki...!") ); 
//OR 
//you can define method without using "arrow function expression" 
// const mymedthod = function mymethod(req, res){
//      res.send("hello venki...!")
// }
// app.get("/",mymethod);

app.get("/login", (req, res) => res.send("You are visiting login in route") );
app.get("/signup", (req, res) => res.send("You are visiting signup route") );
app.get("/signout", (req, res) => res.send( "you are signed out") );

app.listen(port, () => {
    console.log("server is up and running...!!!");
    console.log(`server is up and running in the port ${port}`)
});

//From express - NPM :- https://www.npmjs.com/package/express 
// const express = require('express')
// const app = express()
// const port = 3000

// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })

// app.listen(port, () => {
//   console.log(`Example app listening at http://localhost:${port}`)
// })


//********************************************************************************************************************************//
//MIDDLEWARE concept
//isAdmin and isLoggedIn is middleware that to its customized middle ware bcz its says next() 
//ERROR Remember - you have to pass next whenever you write middleware then you have to use next() inside else the error will comes up as "ReferenceError: next is not defined"
const isAdmIn = (req, res, next) => {   //defininng and assighning function Using Arrow => funtion 
    console.log("isAdmin is running");
    next()
};

const isLoggedIn = function (req, res, next) {   //defininng and assighning function without Using Arrow => funtion (default way)
    console.log("isLogged in is passed or running");
    next()
};

const admin = (req, res) => {
    return res.send("this is admin dashbaord");
};

app.get("/admin", isLoggedIn, isAdmIn, admin);


//********************************************************************************************************************************//
//MIDDLEWARE - Most needed or most common Used Middlwares by programmer

//Writing middleware for use in Express apps (THEORY must know)
//https://expressjs.com/en/guide/writing-middleware.html
//Middeleware Example - bodyparser (Node.js body parsing middleware. Parse incoming request bodies in a middleware before your handlers, available under the req.body property.) 
//https://www.npmjs.com/package/body-parser
//Middeleware Example - Cookie parser (Parse Cookie header and populate req.cookies with an object keyed by the cookie names. Optionally you may enable signed cookie support by passing a secret string, which assigns req.secret so it may be used by other middleware.) 
//https://www.npmjs.com/package/cookie-parser
//Middleware Examole - CORS (CORS - Cross-origin resource sharing (CORS) is a mechanism that allows restricted resources on a web page to be requested from another domain outside the domain from which the first resource was served.[)
//https://www.npmjs.com/package/cors and https://en.wikipedia.org/wiki/Cross-origin_resource_sharing 

//HOW TO load middleware
//app.use() //To load the middleware function, call app.use(), specifying the middleware function. For example, the following code loads the myLogger middleware function before the route to the root path (/).


const cookieParser = require('cookie-parser');
const cors = require('cors');
const bodyParser = require('body-parser');


app.use(cookieParser());
app.use(cors());
// parse application/json (https://stackoverflow.com/questions/24330014/bodyparser-is-deprecated-express-4 )
//app.use(bodyParser.json()); //getting message as "'bodyParser' is deprecated.ts(6385)" WHy Bcz see below
//Explanation: The default value of the extended option has been deprecated, meaning you need to explicitly pass true or false value.
//Note for Express 4.16.0 and higher: body parser has been re-added to provide request body parsing support out-of-the-box.
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));



