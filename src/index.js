const express = require("express");
const app = express();
const path =  require("path");
const hbs = require("hbs");
const db = require("./db/conn"); 
const Register = require("./models/registers");
const NewOrders = require("./models/placedorders");
const Products = require("./models/product");
const { json } = require("express");
const bcrypt =require('bcryptjs');
const jwt = require("jsonwebtoken");
const  bodyParser = require('body-parser');

const PORT  = process.env.PORT ||  3000;

app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.set("view engine", "ejs"); 
const middleware  = (req, res, next)=>{
  res.send(`Action Prohibited`);
  //next();
}
var currentUser;
app.use(bodyParser.urlencoded({extended:false}))
  
const axios = require("axios").default;
  
var  options = {
  method: 'GET',
  url: 'https://latest-stock-price.p.rapidapi.com/price',
  params: {Indices: 'NIFTY 50'},
  headers: {
    'x-rapidapi-host': 'latest-stock-price.p.rapidapi.com',
    'x-rapidapi-key': '9c4324e513mshdd7f131fa562556p1c3a3fjsnf8baf6f4993d'
  }
};
var dataFromResponse;
app.get("/",  function(req, res) {
    res.render("register");
});

app.get("/register", (req, res)=>{
    res.render("register");
});
app.get("/usercart", (req, res)=>{
  res.render("cart");
});
app.get("/signin" ,(req, res)=>{
  res.render("register");
});
app.get("/addassert", (req, res)=>{
  res.render("addassert");
});
app.post("/register", async(req, res)=>{
    try{ 
      const password = req.body.password;
      const cpassword = req.body.password;
      const useremailll = await Register.findOne({email:req.body.email});
      if(useremailll){
        res.send("Email Already Exists!!");
      }
      if(password === cpassword){
        const registerEmployee = new Register({
          name : req.body.name,
          email: req.body.email,
          phone: req.body.phone,
          linkedin: req.body.linkedin,
          password: req.body.password

        })
        currentUser = registerEmployee;
        const token = await registerEmployee.generateAuthToken();
        const registered =  await registerEmployee.save();
        // currentUser = registerEmployee;
        res.status(201).render("index", {currentUser: currentUser});
      }else{
        res.send("paswords are not matching")
      }
    }
    catch(error){
      res.status(400).send(error);
    }
})

app.post("/signin", async(req, res)=>{
    try{
        const email = req.body.email;
        const password =  req.body.password;
        const useremail = await Register.findOne({email:email});
        if(useremail == null)res.send("Email not found");
        const isMatch = await bcrypt.compare(req.body.password, useremail.password);
        const token = await useremail.generateAuthToken();
        if(isMatch == true){
          const message = "You are Sucessfully Logged in";
          currentUser = useremail;
          // console.log(useremail);
          res.status(201).render("index", {currentUser: currentUser});
        }
        else{
          res.send("password are not matching");
        }
    } catch(error){
        res.status(400).send(error);
    }
});

app.post("/addtocart", async(req, res)=>{
  try{ 
    const prod = req.body.prod;
    const currentUseremail =  req.body.user;
      currentUser = await Register.findOne({email:currentUseremail});
      const thisorder = await Products.find({productid: prod});
      const thisuser = await NewOrders.find({email:currentUseremail});
      if(thisuser.length >0){
          thisorderr = thisuser[0];
          thisorderr.orders[thisuser.length] = thisorder[0];
          const del =await NewOrders.remove({email: currentUser.email});
          //console.log(thisorderr.orders);
          const custOrder = new NewOrders({
            name: currentUser.name,
            email: currentUser.email,
            orders: thisorderr.orders
          })
           const sav= await custOrder.save();
          res.status(201).render("index", {currentUser: currentUser});
      }
      const curOrder = new NewOrders({
        name: currentUser.name,
        email: currentUser.email,
        orders: thisorder
      });
      const saveOrder = await curOrder.save();
      res.status(201).render("index", {currentUser: currentUser});
  }
  catch(error){
    res.status(400).send(error);
  }
})

app.post("/viewcart", async(req, res)=>{
  try{ 
    const currentUseremail =  req.body.user;
    currentUser = await Register.findOne({email:currentUseremail});
    const allorders = await NewOrders.findOne({email:currentUseremail});
    //console.log(allorders);
    res.status(201).render("cart", {currentUser: currentUser, allorders: allorders});
  }
  catch(error){
    res.status(400).send(error);
  }
})
app.post("/vieworders", async(req, res)=>{
  try{ 
    const currentUseremail =  req.body.user;
    currentUser = await Register.findOne({email:currentUseremail});
    res.status(201).render("index", {currentUser: currentUser});
  }
  catch(error){
    res.status(400).send(error);
  }
})

app.listen(PORT, ()=> {
  console.log(`server running at port no ${PORT}`);
}); 