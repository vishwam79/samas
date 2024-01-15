const userRoute = require("express").Router();
const {authenticated} = require('../middleware/auth');
const {fetchUser} = require('../middleware/fetchUser');

// //! User Routes...
const {
    signup,

    newUser,
    login,
    
    sendOtp,
    verifyOtp,
    updatePassword,
    
    getMyProfile,
    updateMyProfileVivaOtp,

    fetchCommonRolePerson,
    deletePersonById,
    changeStatusOfThePerson,
    fetchPersonsByRoleAndCreatorDBId
} = require("../controllers/userControllers");

userRoute.route("/api/v1/signup-fhisdkvldfgvuidnjvfuhvifdfdusailfdbguea").post(signup);

userRoute.route("/api/v1/signup").post(fetchUser,newUser);
userRoute.route("/api/v1/login").post(login);

userRoute.route("/api/v1/sendOtp").post(sendOtp);
userRoute.route("/api/v1/verifyOtp").post(verifyOtp);
userRoute.route("/api/v1/updatePassword").put(updatePassword);

userRoute.route("/api/v1/getMyProfile").get(fetchUser,getMyProfile);
userRoute.route("/api/v1/updateMyProfileVivaOtp").put(fetchUser, updateMyProfileVivaOtp);

userRoute.route("/api/v1/fetchCommonRolePerson").get(fetchUser,fetchCommonRolePerson);
// userRoute.route("/api/v1/deletePersonById").delete(fetchUser, deletePersonById); // (currently disable this route : security risk)
userRoute.route("/api/v1/changeStatusOfThePerson").put(fetchUser,changeStatusOfThePerson);
userRoute.route("/api/v1/fetchPersonsByRoleAndCreatorDBId").get(fetchUser, fetchPersonsByRoleAndCreatorDBId);

module.exports = userRoute;