const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

module.exports = async function sendCookie(user, res, message, statusCode)
{
    const token = jwt.sign({_id:user._id},JWT_SECRET);
    const options = {
        httpOnly: true,
        maxAge: 30*60*1000,
        // sameSite: 'none',
        // secure: true
        sameSite:'Strict'
    }
    return res
    .status(statusCode)
    .cookie("token",token,options)
    .json({success:true, user, message});
}