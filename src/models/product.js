const mongoose = require("mongoose");
const employeeSchema = new mongoose.Schema({
    productid:{
      type: String
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
});

const Products = new mongoose.model("Products", employeeSchema);
module.exports  = Products;