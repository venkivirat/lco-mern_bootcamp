let express = require("express");
let router = express.Router();

const {isSignedIn, isAuthenticated, isAdmin} = require("../controllers/auth.js");
//along with getUserByID middleware, I need pushOrderInPurchaseList middleware too to push the order into the array of usermodel 
const {getUserById, pushOrderInPurchaseList} = require("../controllers/user.js");
//we need updatestock from product too to update stock as and when the order is placed so lets requrie updateStcok middleware
const {updateStock} = require("../controllers/product.js");
const {getOrderById, createOrder, getAllOrders, updateStatus, getOrderStatus} = require("../Controllers/order.js");


//H.C : Params (🥰😍😘this is also kind of route but it's just a parameter extractor for us... but very powerful and makes our code reusable and less writable by using it all the time)
router.param("userId", getUserById); //as soon as its see something like userId in the URL it's gonna run our method getUserById so indeed it will populate (or we will get) "req.profile" assigned for the loggedIn user data and which will be ready to use for us
router.param("orderId", getOrderById); //as soon as its see something like orderId in the URL it's gonna run our method getOrderById so indeed it will populate (or we will get) "" assigned for the order id mentioned in the URL and which will be ready to use for us


//H.C : Actual routes

//H.C : Create
/*11-3
🥰🎈🥰How to write route generally - first /api will be there from app.js then,write /<respective route> i.e order here, then /pupose of the route like create or update or delete, then /:<required param middleware> from other controllers which's data we use like here /:userId bcz we need req.profile
once the below path request comes from the url then i need to use some middleware then at last my callback function i.e createOrder
i need to check whether the user Signed in then whether he authenticated then i need to push the order in the purchase list then i need to update my stock then i fireup my method i.e createOrder
 */
router.post("/order/create/:userId", isSignedIn, isAuthenticated, pushOrderInPurchaseList, updateStock, createOrder);

//H.C : read 
//11-4
//Get all orders - only admin who is signed in and authenticated should be able to see all the orders hence use those auth middlewares
router.get("/order/all/:userId", isSignedIn, isAuthenticated, isAdmin, getAllOrders);


//H.C: 11-5: status of the order
router.get("/order/status/:userId", isSignedIn, isAuthenticated, isAdmin, getOrderStatus);

//11-5: explanation of below route path: we are going to the order mentioned in <:orderId>, want to update the order's status and who is updating, the user mentioned in <:userId> is updating. </oder> and </status> you can give any name and can place it anywhere in the below routes but the good way to write them is in the following way mentioned below
router.put("/order/:orderId/status/:userId", isSignedIn, isAuthenticated, isAdmin, updateStatus);

module.exports = router;

