const Product = require("../models/product");
const formidable = require("formidable");
// Javascript concept used below:  _ this we use for variable to say as it is private stuff that if want to have variable but dont want to use that too much explicitly 
const _ = require("lodash");  //Recomended syntax: https://lodash.com/ 
//We need to access the path of file... so need to include file system (use default nodejs moduel fs)
const fs = require("fs"); 
const { sortBy } = require("lodash");
const { updateOne } = require("../models/product");


exports.getproductById = (req, res, next, id) => {
    //this will populate all the product
    /* Product.findById(id).exec( (err, prod) => {
        if(err){
            return res.status(400).json({
                error: "Product not found"
            })
        }
        req.product = prod;
        next(); 
    }); */

    //I want to populate the products only based on category so chain the populate method.... (REMEMBER We can chain as many as DB method as we want like .sort() .popualate() etcc)
    Product.findById(id)
    .populate("category")
    .exec( (err, prod) => {
        if(err){
            return res.status(400).json({
                error: "Product not found"
            })
        }
        req.product = prod;
        next(); //DONT FORGET THIS otherwise our application will get in middleware and no error will be thrown and we will have no knoledge why my app not working
    });
};


/* what we are doing here by H.T - [Section 10 - lesson 3: saving photo in mongo and tshirt assets]
simply first declare a form with formidable IncomingForm method then you simply parse the form.
then it gives you (majorily gives 3 items) that is error, fields and file.
handling fields is like just handling the text which will focus in the video [Section 10 - lesson 4 : add restriction to product]
in this video Section 10 - lession 3, we are seeing how to handle file. its pretty simple (similarly we can handle mp3 audio and mp4 video almost all are same with minor difference)
first we check the file size restriction then technially the 2 lines which saves the image in the database are 
product.photo.data = fs.readFileSync(file.photo.path)
product.photo.contentType = file.photo.contentType;
*/
exports.createProduct = (req, res) => {
    // now we will be using formidable here. https://www.npmjs.com/package/formidable 
    let form = new formidable.IncomingForm(); 
    form.keepExtenstions = true; //we want to say whether the files are in pnj or jpeg format etc...

    //we have to parse this form. this expect 3 paramaters req, incoming call backs 
    form.parse(req, (err, fields, file) => {
        if(err){
            return res.status(400).json({
                error:"probably problem with image"
            });
        }

        //H.T - Applying restrictions on the fields [Section 10 - lesson 4 : add restriction to product]. 😍🥰actually better way is to handle them in routes/product.js like we did in routes/auth.js... in case you can do your own then please go ahead and do granular level validation on fields 😊
        //H.T - Destructure the fields
        /*
        actually all the property coming up here will be like fields.name, fields.price, etcc so if somthing is coming up like that 
        and you dont want to call everysingle time fields.name fields.price then you can use Javascript ES6 destructuring concept like below
        const {price} = fields; so this line onwards you can simply say price instead of fields.price 🥰
        */
        //the below are all property of product (like mentioned in Product model)
        const {name, description, price, category, stock} = fields; 

        if( !name || !description ||!price || !category || !price || !stock){
            return res.status(400).json({
                error:"Hey User, you missed some of the fields... Please include all fields"
            });
        }


        //if there is no restrictions(erros) in the fields then create the product object of model Product type and pass the fields here which given by formidable
        let product = new Product(fields);

        //H.T - Lets handle file (i.e photo) here 
        //how to handle. first check the size of the file. 
        //file.photo .. file coming from formidable's parse method above.. photo is field name of my product model (i.e from front end the use has to send photo)
        if(file.photo){ 
            //how to calucalte the size - lets take for 2MB photo it will be (1024*1024 )*2 = (104856)*2 = 2097152 ~ let me take bit more than that.. so lets take 3000000 which is bit near to 3MB
            if(file.photo.size > 3000000){
                return res.status(400).json({
                    error:"File size is too big! try to upload file less than of size 3MB"
                })
            }
            //so now my file have no error so inlude file to my database. 
            //if u remember in poduct model.. we have data of type buffer and contentType as string for my photo field 
            //so in the photo.data of a product (i.e product.photo.data) u need to mention the full path of the image file
            product.photo.data = fs.readFileSync(file.photo.path)//file is given to us by formidable... look above in the parse method to know more
            //we need to mention the content Type also here
            product.photo.contentType = file.photo.contentType;
        }
       // console.log(product); //wrote this when we got error while debugging the issue of caterogy not getting saved in db

        
        //the above if block handled my photo now its ready to upload to database
        //H.T: save to the db
        product.save((err, prod) => {
            if (err){
                return res.status(400).json({
                  /*😭😭😭got this error when I just passed category directly ([{"key":"category","value":"summer","description":""}]) 
                  with name from postman instead of referncing required category id (which u can get it from DB.. check in Robo3T and 
                  copy the required category ID and pass it)*/
                  error:"Saving thirt in db failed" 
                });
            }
           res.json(product); //too big to print in postman so lets just print some message
           /* res.json({
               success_msg: "product added to database"
           }); */
        })
    });
};

exports.getProduct = (req, res) => {
    //in req.product we all aready storing things which we coded in method getproductById, so just return that req.product
    //and before rendering req.product make sure you undefine binary file if the fetching data has any like songs, videos, photos (here it is photo)
    //and meanwhile we can write a middleware to load the binary file (ie photo here) in the background
    req.product.photo = undefined 
    return res.json(req.product);
};


//H.C : middleware
//middleware to load the photo
exports.image = (req, res, next) => {
    if(req.product.photo.data) {  //let's do quick check so things dont crash directly... if there is data then only will do proceed
        res.set("Content-Type", req.product.photo.contentType) //😍we are setting the key-value here. key is : Content-Type, value is: will set it from product.photo (i.e database value)
        return res.send(req.product.photo.data); //Content-Type is set, now only thing i have to do it send the photo data
    }
    next();
};


//H.C : Update controllers //copy code from createProduct method as most of the code is same and just do edit/add/delete some lines of that code
exports.updateProduct = (req, res) => {
    let form = new formidable.IncomingForm(); 
    form.keepExtenstions = true; 

    form.parse(req, (err, fields, file) => {
        if(err){
            return res.status(400).json({
                error:"probably problem with image"
            });
        }

        //H.C : Updation code
        //here we are assining existing product in the db to variable product so replace "let product = new Product(fields)" to "let product = req.product"
        let product = req.product; //🥰😍😘In case you wonder where this req.product coming from, REMEMBER in the "put route" we are getting ":produtId", as soon as the program sees this the "prams gonna fire up/execute" so that we get req.product data 
        //now we need to update this using 🥰😍😘"loadash"🥰😍😘 which helps us easily in working with these objects, creating new objects, arrays etc stuff
        product = _.extend(product, fields); //🥰😍😘extend method of lodash🥰😍😘 takes the exisiting values in the object we are having and it extend that value means all the updation functionality involved there. and it takes 2 parmeter that is the object it need to look (here it is product), and what needs to update (here it is fields which is coming from foridable)... So lodash updates the fields which coming from formidable to object product

        if(file.photo){ 
            if(file.photo.size > 3000000){
                return res.status(400).json({
                    error:"File size is too big! try to upload file less than of size 3MB"
                })
            }
             product.photo.data = fs.readFileSync(file.photo.path)
            product.photo.contentType = file.photo.contentType;
        }
        //console.log(product);

        //H.C - Save to DB
        product.save((err, prod) => {
            if (err){
                return res.status(400).json({
                  error:"updation of product failed" 
                });
            }
           res.json(product); //too big to print in postman so lets just print some message
           /* res.json({
               success_msg: "product added to database"
           }); */
        })
    });
};

//H.C: delete controllers
exports.deleteProduct = (req, res) => {
    let product = req.product; //this is coming from middleware
    product.remove((err, deletedProduct) => {
        if(err){
            return res.status(400).json({
                error: "Failed to delete the procduct"
            });
        }
        deletedProduct.photo = undefined; //to not to load binary data of photo which is heavy and take time
        res.json({
            message:"Deletion was a sucess",
            message_2: "and the deleted product json response is",
            deletedProduct
        });
    });
};


//H.C : product listing controller
exports.getAllProducts = (req, res) => {
    //🥰😍😘taking limit value from user : if there is a query from front end (i.e in url ? will be there na.. with value that one) and if it has propoerty of limit then use that value of set default limit size as 8 
    //🥰😍😘 whenever we are taking any parameter from user, all the major launagues like java, js handle that as String value, so convert into Integer to use that variable in here
    let limit = req.query.limit ? parseInt(req.query.limit) : 8 ; 

    //🥰😍😘same thing as limit do the default value setting for sortBy if user not send it
    //🥰😍😘 no need to convert it into integer, bcz we need it in string format only
    //🥰😍😘 we can sort based on any field of product like creation date, products name etc.. the basic and most using one is based on id (and in database it saved as _id so use _id and not id)
    let sortBy = req.query.sortBy ? req.query.sortBy : "_id" ;

    //Product is the varibale of my model product shcema
    Product.find()
        .select("-photo")
        .populate("category")
        .sort([[sortBy, "asc"]])
        .limit(limit)
        .exec((err, manyProdcuts) => {
            if(err){
                return res.status(400).json({
                    error:"No Product Found"
                })
            }
            res.json(manyProdcuts);
        })
};


//This is useful to display all the distinct categories to admin when he is creating categories
exports.getAllUniqueCategories = (req, res) => {
    //mongoose's distinct() method will give me all the unique value
    // parameters - 1st Field from which u need distinct values, 2nd options (here i dont have any such so empy {}), 3rd callback
    Product.distinct("categories", {}, (err, categories) => {
        if(err){
            return res.status(400).json({
                error:"No Category found"
            });
        }
        res.json(categories);
    });
};

//updatestock or updateinventroy whichever is suits you, use that name here
/* 
🤩🤩🤩 In this section we are gonna talk about some of the operation as we have to perform as middleware 
as soon as somebody makes a purchase and the purchase is successfull we have to update couple of things that we mentioned in the "product model"
mainly "stocks" and "sold" in the product model, they are indirectly proportional
ie. increae in sold = decrease in stock , initially sold of any product will be 0 and as soon as it updates to 1 then obviosuly the stock will reduce by 1

🤩🤩🤩 Theory : we will use bulkwrite which is mongoose one of the famous method like find, findOne etcc...
https://mongoosejs.com/docs/api.html#model_Model.bulkWrite
or
https://mongodb.github.io/node-mongodb-native/3.0/api/Collection.html#bulkWrite 
*/
exports.updateStock = (req, res, next) => {
    
    //we will have oder and it will have many products which we will loop through in, and below prod is every single object of that loop  
    let myOperations = req.body.order.products.map(prod => {
        return {
            //for every single product i want to fire up updateOne method that we saw in the mongoose bulkwrite documentation https://mongoosejs.com/docs/api.html#model_Model.bulkWrite
            //and the operation which i want to perform will be inside {}
            updateOne: {
                filter: {_id: product_id},
                update: {$inc: {stock: -prod.count, sold: +prod.count, }} //this .count info will come from frontend bcz user may purchase 1 stock or 3 stock of same product
            }
        }
    });

    //once above things done we can use bulkwrite method and it takes 3 parameters, 1st one all the operation that we want to perfom, and 2nd we have to pass the options which is object (here i dont have any such so empy {}), 3rd is callback
    product.bulkWrite(myOperations, {}, (err, resultproducts) => {
        if (err){
            return res.status(400).json({
                error:"Bulk Operation Failed"
            })
        }
        //if no error then next thing is i have to pass the controller to the next middleware so just use next()
        next();
    });
};