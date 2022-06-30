const express = require("express");
const router = express.Router();

//we may need some controllers methods which we defined earlier... so lets require them here
const {getproductById, createProduct, getProduct, image, updateProduct, deleteProduct, getAllProducts, getAllUniqueCategories} = require("../controllers/product.js");
const {isSignedIn, isAuthenticated, isAdmin} = require("../controllers/auth.js");
const {getUserById} = require("../controllers/user.js");

//H.T - All of params
//now the next thing after requiring the needed controllers as above is "we need to get something from paramaters".. lets handle that part here (similar to the way we did in user.js and category.js)
//THANKS TO method getUserById, bcz it will gonna populate req.profile automatically wherver i use :userId parameter in the file
router.param("userId", getUserById); //😭😭😭Initially I wrote "UserId" and below at actual routes wrote as :userID hence my user didnt get authenticated. got ERROR:Access Denied for you (from auth.js)
router.param("productId", getproductById);

//H.C - All of actual routes
//H.C - Create Routes
router.post("/product/create/:userId", isSignedIn, isAuthenticated, isAdmin,  createProduct);//😭😭😭Always isSignedIn should be first bcz req.profile, req.authVarAnyName all are will get values only if isSignedIn executed first else will get ERROR: Undefined like "TypeError: Cannot read property '_id' of undefined" 


//H.C - Read routes
//route to read/get a single product
router.get("/product/:productId", getProduct);
//lets create a Temporary router to use the middleware method image. (SO AS SOON AS I see somthing like "/product/image/:productId" in the URL then this route will trigger hence the middleware "image" )
router.get("/product/image/:productId", image);


//H.C - update routes
router.put("/product/:productId/:userID", isSignedIn, isAuthenticated, isAdmin, updateProduct);

//H.C - delete routes
router.delete("/product/:productId/:userID", isSignedIn, isAuthenticated, isAdmin, deleteProduct);


//H.C - Listing routes
//I dont want any auth middlware here to authenticate user or to check whether user sighned in or admin etcc.. bcz any client/user who opens our app should see the listing product
router.get("/products", getAllProducts);

/* In admin panel user will be able to create product, but obviously he needs to create categories as well so he need to select the categories. 
now i wont allow him to write the category bcz it might create mistakes there, rather i would like to populate these categories in advance and
in the front end i will just display these categories. 
so i need  a method using which i can grab all the distinct categories so i can see all of them
This is useful to display all the distinct categories to user i.e admin bcz only admin can create categories and products when he is creating categories */
router.get("/products/categories", getAllUniqueCategories);


module.exports = router;