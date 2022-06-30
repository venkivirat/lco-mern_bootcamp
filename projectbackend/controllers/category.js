const Category = require("../models/category.js");

exports.getCategoryById = (req, res, next, id) => {
    Category.findById(id).exec((err, cate) => {
        if(err){
            return res.status(400).json({
                error: "category not found in DB"
            });
        }
        req.category = cate;
        next();
    });
};


exports.createCategory = (req, res) => {
    const category = new Category(req.body); //creating object category from Category model which imported from model folder
    category.save((err, cate) => {
        if(err){
            return res.status(400).json({
                error: "Not able to save category in DB"
            });
        }
        res.json({cate});
    });
};

exports.getCategory = (req, res) =>{
    //😀😀😀thanks to our middleware getCategoryById which is doing job for us where it will populate req.category and we are simply sending the response as below 
    return res.json(req.category); 
}

exports.getAllCategory = (req, res)=> {
    Category.find().exec((err, allCateItems) => {
        if(err){
            return res.status(400).json({
                error: "No Categories found"
            });
        }
        res.json(allCateItems);
    });
};

exports.updateCategory = (req, res) => {
    //creating variable category
    const category = req.category; //🥰🥰🥰 req.category coming from middleware getCategoryById :-) which get fired when we pass parameter in the url and cateogry is just a variable (object here)
    category.name = req.body.name; //🥰🥰🥰 here we are grabbing category name which is being sent from front end or from postman 

    //🥰🥰🥰 since category indeed req.category is already an object of database i can directly fire save method on it i.e category.save()
    category.save((err, updatedCategory) => {
        if(err){
            return res.status(400).json({
                error: "Failed to udpate category"
            });
        }
        //if no error then updation is done so will send that json response to front end
        res.json(updatedCategory);
    });
};

//HC Suggetion 😘😘😘
//😘😘😘 instead of removeCategory some ppl use delete... but pls try to not to use delete bcz delete is proprietory (means owned, KSowmyada etc) operation being performed in the mongo... hence try to use long name which tells us what we are doing here and also will be good
exports.removeCategory = (req, res) => {
        //creating variable category
        const category = req.category;

        //remove() operation given by mongoose
        category.remove((err, deletedCategory) => {
            if(err){
                return res.status(400).json({
                    error: "Failed to delete category"
                });
            }
            res.json({
                message:"Successfully deleted",
                deletedCategoryis: deletedCategory  //HC gave assignment to show the deletedcategory too .. I did it 😍😘🥰
            });
        });
};