const mongoose = require('mongoose');

const dbConnect = ()=>{
    mongoose.connect(process.env.MONGO_URL, {dbName:process.env.DB_Name})
    .then(()=>{
        console.log("Database connected successfully.");
    })
    .catch((err)=>{
        console.log(err);
    })
}

module.exports = dbConnect;