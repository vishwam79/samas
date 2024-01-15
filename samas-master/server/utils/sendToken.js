const bcryptjs = require('bcryptjs');
const jwt  = require('jsonwebtoken');

module.exports = async function sendToken(user, message, statusCode, res) {
    // console.log(user);
    // console.log(res);
    const awthToken = await user.getToken();
    const options = {};
    return res
        .status(statusCode)
        .cookie("token", awthToken, options)
        .json({ success: true, awthToken, message });
};