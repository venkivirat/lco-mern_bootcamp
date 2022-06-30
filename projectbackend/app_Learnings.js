
//you can use dotenv library which is very useful t hide sensitive info like port no, db connection, payment gateway to get exposed in github or in the server we host our application like Amazon AWS or Microsoft Azures or  Digital Ocean or SAP cloud platfrom.
// dotenv doc link: https://www.npmjs.com/package/dotenv
require('dotenv').config()

const express = require("express");  
const app = express(); 

const mongoose = require('mongoose');
//MIDDLEWARE - Most needed or most common Used Middlwares by programmer
const cookieParser = require('cookie-parser');
const cors = require('cors');
const bodyParser = require('body-parser');

const authRoutes = require("./routes/auth.js"); //./ means current directory 


//DB Connection
//how to connect mongodb - https://mongoosejs.com/    more details - https://mongoosejs.com/docs/connections.html
//Online Database services - MATLAB then make sure to bring that database URL and pass to connect method of mogoose
//you can connect to other db as well which you like to use. Ex: MySQL Db ( https://www.npmjs.com/package/mysql#install ) 
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser : true,
    useUnifiedTopology: true,
    useCreateIndex:true //you can pass as many as option u need. go through link shared above for usage/details of all the options
}).then( () => {        ////myfunction.run().then().catch() //common thing we use in javascript where then potion will run if there is success and catch if there is error
    console.log("DB CONNECTED...");
});


//Middlewares
//MIDDLEWARE - HOW TO load MIDDLEWARE
//app.use() //To load the middleware function, call app.use(), specifying the middleware function. For example, the following code loads the myLogger middleware function before the route to the root path (/).
app.use(cookieParser());
app.use(cors());
// parse application/json ( https://stackoverflow.com/questions/24330014/bodyparser-is-deprecated-express-4  )
//app.use(bodyParser.json()); //getting message as "'bodyParser' is deprecated.ts(6385)" WHy Bcz see below
//Explanation: The default value of the extended option has been deprecated, meaning you need to explicitly pass true or false value.
//Note for Express 4.16.0 and higher: body parser has been re-added to provide request body parsing support out-of-the-box.
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));


//My Routes
// Theory - https://expressjs.com/en/guide/routing.html
//Below i'm prepending /api ( you can prepend /api/venki anything....) which is good way of practice to use /api before using any api routes which we creates
//COMMON ERROR - REMEMBER - ppl usually forget to prepend /api while fetching api routes so use /api/signout, /api/signin etc...
app.use("/api",authRoutes); //to access api routes use - /api/signout, /api/signin etc...


//PORT
//So process.env.PORT || 3000 means: assign port variable as whatever is in the environment variable PORT, or 8000 if there's nothing there.
//syntax is = process.env.VARIABLE NAME IN THE .env FILE
const port = process.env.PORT || 8000; 


//Starting a Server
//now the app will start listen to the port 7000 q with below code
app.listen(port, () => {  
    //console.log("app is running on port 7000");
    console.log(`App is running to port ${port}`);
});


