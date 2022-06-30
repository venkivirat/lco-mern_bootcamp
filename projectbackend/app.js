require('dotenv').config()

const express = require("express");  
const app = express(); 

const mongoose = require('mongoose');
const cookieParser = require('cookie-parser'); //Cookie parser helps to create cookies, put value into and delete value from cookies
const cors = require('cors');
const bodyParser = require('body-parser');

//My routes
const authRoutes = require("./routes/auth.js"); 
const userRoutes = require("./routes/user.js");
const categoryRoutes = require("./routes/category.js");
const productRoutes = require("./routes/product.js");
const orderRoutes = require("./routes/order.js");

//DB Connection
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser : true,
    useUnifiedTopology: true,
    useCreateIndex:true 
}).then( () => {   
    console.log("DB CONNECTED...");    
});


//Middlewares
app.use(cookieParser());
app.use(cors());
app.use(express.json()); //app.use(bodyParser.json()); //getting message as "'bodyParser' is deprecated.ts(6385)" WHy Bcz see app_Learnings.js
app.use(express.urlencoded({
  extended: true
}));


//My Routes
app.use("/api",authRoutes); //to access api auth routes use - /api/signout, /api/signin etc...
app.use("/api",userRoutes); //to access api auth routes use - /api/user, /api/user/:userId etc... (:variable in a url always treated as parameter)
app.use("/api",categoryRoutes);
app.use("/api",productRoutes);
app.use("/api",orderRoutes);

//PORT
const port = process.env.PORT || 8000; 


//Starting a Server
app.listen(port, () => {  
    console.log(`App is running to port ${port}`);
});
