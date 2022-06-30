const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        maxlength: 32,
        unique: true
    }
}, 
//whenever new entry/record created through this schem it will record the exact time when it is created and will store it in database
//we can make use of this timestamp for filter etc
{ timestamps: true } 
);

module.exports = mongoose.model("Category", categorySchema);