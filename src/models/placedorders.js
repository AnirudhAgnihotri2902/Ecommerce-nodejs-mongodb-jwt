const mongoose = require("mongoose");
const employeeSchema = new mongoose.Schema({
    name: {
      type: String,
    },
    email:{
      type: String,
      
    },
    orders:[{
      productid:{
        type: String,
      },
      productName: {
        type: String,
      },
      productPrice:{
        type: String,
      },
      productImage:{
        type: String
      }
    }]
    
});
const NewOrders = new mongoose.model("NewOrders", employeeSchema);
module.exports  = NewOrders;