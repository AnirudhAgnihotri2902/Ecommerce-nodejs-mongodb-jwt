const mongoose = require("mongoose");
const bcrypt = require("bcryptjs"); 
const jwt =  require("jsonwebtoken");
const employeeSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    phone: {
      type: Number,
    },
    linkedin:{
      type: String,
    },
    password: {
      type: String,
      required: true
    },
    tokens:[{
        token:{
          type: String
        }
    }]
});

employeeSchema.methods.generateAuthToken = async function(){
  try{
    const token = jwt.sign({_id: this._id.toString()}, "onetwokafourfourtwokaonemynameislakhan");
    // console.log(token);
    this.tokens = this.tokens.concat({token:token});
    await this.save();
    return token;
  }
  catch(error){    
    res.send(error);
  }
}

employeeSchema.pre("save", async function(next){
  if(this.isModified("password")){
    this.password = await bcrypt.hash(this.password, 5); 
  }
  next();
});

const Register = new mongoose.model("Register", employeeSchema);
module.exports  = Register;