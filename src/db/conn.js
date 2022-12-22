const mongoose = require("mongoose");

// mongoose.connect("mongodb://localhost:27017/registration", {
//     useNewUrlParser:true,
//     useUnifiedTopology:true,
//     // useCreateIndex: true
// }).then(()=> {
//   console.log(`connection successfull`);
// }).catch((e)=>{
//     console.log(e);
// })
const {DB} =  require('../keys');
mongoose.connect(DB,{
    useNewUrlParser: true,
    // useCreateIndex: true,
    useUnifiedTopology: true
    // useFindAndModify:false
}).then(()=>{
    console.log(`connection successful`);
}).catch((err)=> console.log(`no connection`));