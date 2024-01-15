const userModel = require('../models/userModel');
const jwt  = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

exports.authenticated = async(req,res,next)=>{
    const {token} = req.cookies;
    if(!token)
    {
        return res.status(404).json({success: false, message:"login first"});
    }
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = await userModel.findById(decoded._id);
    next();
}