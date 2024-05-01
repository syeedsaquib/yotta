const mongoose = require("mongoose");



const postschema = new mongoose.Schema({
    uName : {
        type : String
    },
    postDescription: {
        type : String
    },
    likes:{
        type : Number,
        default : 0
    },
    postUrl: {
        type : String,
    }
    

});
const postData = mongoose.model("postData",postschema);
module.exports = postData;