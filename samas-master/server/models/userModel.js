const mongoose = require('mongoose');

const schema = mongoose.Schema({
    creator:{
        type: mongoose.Schema.ObjectId,
        ref: 'users',
        required: true
    },
    imgUrl:{
        type: String,
        default: "https://res.cloudinary.com/dzgaixltu/image/upload/v1693552944/logo_cmliyg.webp"
    },
    name:{
        type:String,
        require:[true, "name is requirred."]
    },
    email:{
        type:String,
        require:[true, "email is requirred."]
    },
    mobile:{
        type:String
    },
    whatsappNo:{
        type:String
    },
    password:{
        type:String,
        require:[true, "password is requirred."],
        select: false
    },
    department:{
        type:String
    },
    ageGroup:{
        type:String
    },
    role:{
        type:String,
        require:true,
        default:"BDI"
    },
    address:{
        type: String
    },
    employeeID:{
        type: String,
        default:"0000"
    },
    otp:{
        type:String,
        default:""
    },
    status:{
        type:String,
        default:"active"
    }
},
{timeStamp: true}
)

const model = mongoose.model("users", schema);
module.exports = model;

// status:{
//     type:String,
//     default:"blocked"
// }