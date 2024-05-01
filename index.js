// const express = require("express");
// const app = express();

// const port = 8080;
// app.use(express.urlencoded({extended:true}));
// app.use(express.json());

// app.get("/register",(req,res) =>{
//     const data = req.query;
//     console.log(data);
//     res.send("Get request accepted");
// })

// app.post("/register",(req,res) =>{
//     // const data = req.query;
//     console.log(req.body);
//     res.send("Post request accepted");
// })


// app.listen(port, ()=>{
//     console.log("Port is listening");
// });













  require('dotenv').config();


const expres = require("express");
const path = require("path");
const app = expres();
const port = 8080;
const mongoose = require("mongoose");
const loginData = require("./models/loginData");
const postData = require("./models/postData");
const multer = require('multer');
const {storage} = require("./cloudConfig");
const { METHODS } = require("http");
const upload  = multer({storage}); 


app.use(expres.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.set("views",path.join(__dirname,"/views"));


main()
  .then(()=>{
    console.log("Connectio succesful");
  })
  .catch((err)=>console.log(err));

async function main(){
  await mongoose.connect(process.env.DB_URL);
}





app.post('/new',async (req,res)=>{
  
  let uName = req.body;
  uName = uName.uName;
  
  let b = await loginData.findOne({uName:uName});
  let profile_picture = b.profile_picture;
  res.render("new.ejs" ,{uName,profile_picture})
});


app.listen(process.env.PORT,()=>{
  console.log(`App is litsening`)
});






app.get("/SignUp",(req,res)=>{
    res.render("SignUp.ejs");


});
app.get("/LogIn",(req,res)=>{
  res.render("LogIn.ejs");
});




app.post("/:uName/post",upload.single('image'),async (req,res)=>{
  let {path} = req.file;
  let {postDescription,uName} = req.body;

  let data = new postData({
    uName : uName ,
    postDescription : postDescription,
    postUrl : path
  });
  data.save();

  res.redirect("/"+uName+"/post");
});

app.get("/:uName/post", async (req,res)=>{
  let {uName} = req.params;

  let b = await loginData.findOne({uName:uName});
  if(b!=null){
    let p = await postData.find({uName:uName});
    if(p.length != 0){
      let profile_picture= b.profile_picture;
      res.render("post.ejs",{uName,profile_picture,p});

    }else{
      res.redirect("/"+uName);
    }
    
  }
  else{
    let str = "Username does't exist";
    res.render("error.ejs",{str})
  }
});


app.post("/",async (req,res)=>{
    let {name,uName,email,password} = req.body;
    let b = await loginData.findOne({uName:uName});

    if(b != null){
      if(b.password == password){
        let profile_picture = b.profile_picture;
        let posts = await postData.countDocuments({uName:uName});
        let email = b.email;
        let location = b.location;
        let country = b.country;
        let about = b.about;
        let p = await postData.find({uName:uName})
        res.render("home.ejs",{name,about,uName,location,email,country,posts,profile_picture,p});
      }
      else{
        let str = "Username alrady exist";
        res.render("error.ejs",{str});
      }
        
      

    }
    else{

      let data = new loginData({
        name : name,
        uName : uName,
        email : email,
        password : password
      });
      data.save();
      
    }

    let a = await loginData.findOne({uName:uName});

    while(a != null){
      let profile_picture = a.profile_picture;
      let posts = await postData.countDocuments({uName:uName});
      let name = a.name;
      let about = a.about;
      let email = a.email;
      let location = a.location;
      let country = a.country;
      let p = await postData.find({uName:uName});
      res.render("home.ejs",{name,about,email,uName,location,country,posts,profile_picture,p});
      break;
    }


});

app.post("/k",async (req,res)=>{
  let {uName,password} = req.body;
  let a = await loginData.findOne({uName:uName});
  let p = await postData.find({uName:uName});
  if(a != null){
    if(a.password == password){
      
      let uName = a.uName;  
      let name = a.name;
      let profile_picture = a.profile_picture;
      let posts = await postData.countDocuments({uName:uName});
      let email = a.email;
      let about = a.about;
      let location = a.location;
      let country = a.country;
      res.render("home.ejs",{name,about,uName,email,location,country,posts,profile_picture,p});

    }
    else{
      let str = "Rong Password"
      res.render("error.ejs",{str})
    }
  }
  else{
    let str = "Rong Username"
    res.render("error.ejs",{str})
  }
  

});


app.post("/search",(req,res)=>{
  let {uName} = req.body;
  if(uName == ""){
    let str = "First enter a username";
    res.render("error.ejs",{str});
  }
  else{
    res.redirect("/"+uName);
  }
  
})

app.get("/",(req,res)=>{
  res.redirect('/SignUp');
});










  
  

// });

app.get("/:uName",async(req,res)=>{
  let {uName} = req.params;
  let a = await loginData.findOne({uName:uName});
  let p = await postData.find({uName:uName});

  if(a != null){
    let name = a.name;
    let email = a.email;
    let about = a.about;
    let location = a.location;
    let country = a.country;
    let posts = await postData.countDocuments({uName:uName});
    let profile_picture = a.profile_picture;

    res.render("profile.ejs",{name,uName,email,about,location,country,posts,profile_picture,p});
      
  }
  else{
    let str = "Username not found"
    res.render("error.ejs",{str})
  }
  
});

app.post('/:uName/edit',async (req,res)=>{
  let {uName} = req.params;
  let a = await loginData.findOne({uName:uName});
  let name = a.name;
  res.render("edit.ejs",{uName,name,a});
});


app.post("/edited",upload.single('image'),async (req,res)=>{
  let {path} = req.file;
  let {name,about,country,email,location,uName} = req.body;
  console.log(path,name,uName,about,country,email,location);
  let filter = {uName:uName};
  let update = {name:name, about:about, country:country, email:email, location:location, profile_picture:path}
  await loginData.findOneAndUpdate(filter,update);
  res.render("test.ejs");
});


app.get("/",(req,res)=>{
  res.send("katuga")  
  // res.render(woodnew.json);
  // res.send(furniture_categories);
});


// app.get("/ig/:username", (req, res) => {
//         let {username} = req.params;  
        
//         // if(data){
//             res.render("woodnew.json");
//         // }else{
//         //     res.render("error.ejs");
//         // }
// });






// app.use((req,res)=>{
//     console.log('Request recieved');
//     res.send({
//             name: "Syeed Mohd Saquib",
//             Course: "B.Tech",
//             RollNo: "6CS47",
//             RID: "R32056",
//     });
// });
