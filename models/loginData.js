const mongoose = require("mongoose");

const loginschema = new mongoose.Schema({
    name: {
        type : String,

    },
    uName: {
        type: String,
        required:true
    },
    post:{
        type:Number,
        default:0
    },
    email: {
        type : String,
        default:"--"
    },
    password : {
        type : String,
    },
    about : {
        type : String,
        default:"--"
    },
    location : {
        type : String,
        default:"--"

    },
    country : {
        type : String,
        default:"--"

    },
    profile_picture : {
        type : String,
        default: "https://res.cloudinary.com/dz6owqlde/image/upload/v1714112918/my_img_eeyz6f.jpg"
    }
    

});


// const postschema = new mongoose.Schema({
//     uName : {
//         type : String
//     },
//     postDescription: {
//         type : String
//     },
//     likes:{
//         type : Number
//     },
//     postUrl: {
//         url : String,
//     }
    

// });
// const postData = mongoose.model("postData",postschema);
const loginData = mongoose.model("loginData",loginschema);
// module.exports = postData;
module.exports = loginData;