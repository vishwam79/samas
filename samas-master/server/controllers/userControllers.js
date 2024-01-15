const userModel = require("../models/userModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const { validationResult } = require("express-validator");
const sendCookie = require("../utils/sendCookie");
const sendToken = require("../utils/sendToken");
const JWT_SECRET = process.env.JWT_SECRET;
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const sendMail = require("../utils/sendEmail");

// //* all exported method
// 1. signup
// 2. create new user
// 3. login user
// 4. generateOTP() Generate a random 6-digit OTP --- normal function
// 5. sendOtp
// 6. verifyOtp
// 7. update Password
// 8. getmyprofile
// 9. updateMyProfileVivaOtp
// 10. getch common role person
// 11. delete person by id
// 12. changeStatusOfThePerson : change status of the person (active/blocked)
// 13. fetchPersonsByRoleAndCreatorDBId

// //! signup
exports.signup = catchAsyncError(async (req, res, next) => {
  const error = validationResult(req.body);
  if (!error.isEmpty()) {
    return res.status(400).json({ success: false, error: error });
  }
  const {
    name,
    email,
    employeeID,
    mobile,
    whatsappNo,
    password,
    department,
    role,
    ageGroup,
    address,
  } = req.body;
  if (!name || !email || !password) {
    return next(new ErrorHandler("Fields can't be empty", 400));
  }

  let userExist = await userModel.findOne({ email: email.toLowerCase() });
  if (userExist) {
    return next(new ErrorHandler(`${email} is already used`, 400));
  }

  // check by employee id
  userExist = await userModel.findOne({ employeeID: employeeID });
  if (userExist) {
    return next(new ErrorHandler(`${employeeID} is already used`, 400));
  }

  // // now, create unique employeeID
  // let generatedUniqueID = role + Math.floor(1000 + Math.random() * 9000);
  // // Check uniqueness
  // while (await userModel.findOne({ employeeID: generatedUniqueID })) {
  //     generatedUniqueID = role + Math.floor(1000 + Math.random() * 9000);
  // }

  const salt = await bcryptjs.genSalt(15);
  const enPassword = await bcryptjs.hash(password, salt);

  const newUser = await userModel.create({
    name,
    email: email.toLowerCase(),
    employeeID: employeeID,
    mobile,
    whatsappNo,
    password: enPassword,
    department,
    ageGroup,
    role,
    address,
  });

  return res
    .status(200)
    .json({ success: true, message: "user created successful", newUser });
});

// //! create new user
exports.newUser = catchAsyncError(async (req, res, next) => {
  const error = validationResult(req.body);
  if (!error.isEmpty()) {
    return res.status(400).json({ success: false, error: error });
  }
  const admin = await userModel.findOne({ _id: req.id });

  if (req.body.role === "BDI" && admin.role && (admin.role !== "TL" && admin.role !== "CXO" && admin.role !== "MD")) {
    return next(new ErrorHandler("You have no authority.", 400));
  }

  if (req.body.role === "TL" && admin.role && (admin.role !== "CXO" && admin.role !== "MD")) {
    return next(new ErrorHandler("You have no authority.", 400));
  }

  if (req.body.role === "CXO" && admin.role && admin.role !== "MD") {
    return next(new ErrorHandler("You have no authority.", 400));
  }

  if (req.body.role === "MD" && admin.role && admin.role !== "MD") {
    return next(new ErrorHandler("You have no authority.", 400));
  }

  const userId = req.id;
  const {
    name,
    email,
    employeeID,
    mobile,
    whatsappNo,
    password,
    department,
    role,
    ageGroup,
    address,
  } = req.body;

  if (!name || !email || !password) {
    return next(new ErrorHandler("Fields can't be empty", 400));
  }

  let userExist = await userModel.findOne({ email: email.toLowerCase() });
  if (userExist) {
    return next(new ErrorHandler(`${email} is already used`, 400));
  }

  // check by employee id
  userExist = await userModel.findOne({ employeeID: employeeID });
  if (userExist) {
    return next(new ErrorHandler(`${employeeID} is already used`, 400));
  }

  // // now, create unique employeeID
  // let generatedUniqueID = role + Math.floor(1000 + Math.random() * 9000);
  // // Check uniqueness
  // while (await userModel.findOne({ employeeID: generatedUniqueID })) {
  //     generatedUniqueID = role + Math.floor(1000 + Math.random() * 9000);
  // }

  const salt = await bcryptjs.genSalt(15);
  const enPassword = await bcryptjs.hash(password, salt);

  const newUser = await userModel.create({
    creator: userId,
    name,
    email: email.toLowerCase(),
    employeeID: employeeID,
    mobile,
    whatsappNo,
    password: enPassword,
    department,
    ageGroup,
    role,
    address,
  });

  return res
    .status(200)
    .json({ success: true, message: "user created successful", newUser });
});

// //! login user
exports.login = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorHandler("Field can't be empty.", 400));
  }

  const user = await userModel.findOne({ email: email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("User not exists.", 400));
  }

  // if user is blocked by higher authority then he have no access of any of the operations
  const check = await userModel.findOne({ email: email });
  if (check.status === "blocked") {
    return res
      .status(400)
      .json({
        success: false,
        message: "You are blocked by higher authority.",
      });
  }

  const isMatch = await bcryptjs.compare(password, user.password);
  if (!isMatch) {
    return next(new ErrorHandler("Invalid Email or Password", 400));
  }

  const token = jwt.sign({ _id: user._id }, JWT_SECRET);
  return res.status(200).json({ success: true, token, data: user });
  // sendCookie(user, res, `Welcome back, ${user.name}`, 200);
});

// //! Generate a random 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000);
}

// //! send otp
exports.sendOtp = catchAsyncError(async (req, res, next) => {
  const otp = generateOTP();
  try {
    const { email } = req.body;

    const check = await userModel.findOne({ email: email });
    if (!check) {
      return res
        .status(400)
        .json({ success: false, message: "Enter registered mail id." });
    }

    // if user is blocked by higher authority then he have no access of any of the operations
    if (check.status === "blocked") {
      return res
        .status(400)
        .json({ success: false, message: "You are blocked by higher authority." });
    }

    await userModel.findOneAndUpdate(
      { email: email },
      { otp: otp },
      { new: true }
    );
    const info = await sendMail(
      req.body.email,
      "For the verification of the OTP-",
      `OTP: ${otp}`
    );
    return res
      .status(200)
      .json({
        success: true,
        message: "OTP sent successfully. Check your mailbox.",
      });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ success: false, message: "Failed to send OTP via email." });
  }
});

// //! verfiy otp
exports.verifyOtp = catchAsyncError(async (req, res, next) => {
  const { otp, email } = req.body;

  if (!otp || !email) {
    return next(new ErrorHandler("Field can't be empty.", 400));
  }
  const check = await userModel.findOne({ email: email });
  if (otp !== check.otp) {
    return res
      .status(400)
      .json({ success: false, message: "Otp not matched." });
  }
  return res
    .status(200)
    .json({ success: true, message: "Otp verify successfully." });
});

// //! update password
exports.updatePassword = catchAsyncError(async (req, res, next) => {
  const { otp, email, password } = req.body;

  const find = await userModel.findOne({ email: email });

  // if user is blocked by higher authority then he have no access of any of the operations
  if (find.status === "blocked") {
    return res
      .status(400)
      .json({ success: false, message: "You are blocked by higher authority." });
  }

  // again check otp
  if (find.otp !== otp) {
    return res.status(400).json({ success: false, message: "Try again." });
  } else {
    const salt = await bcryptjs.genSalt(15);
    const enPassword = await bcryptjs.hash(password, salt);
    const update = await userModel.findOneAndUpdate(
      { email: email },
      { password: enPassword },
      { new: true }
    );
    return res
      .status(200)
      .json({
        success: true,
        message: "Password updated successfully. Login your account.",
      });
  }
});

// //! get my profile
exports.getMyProfile = catchAsyncError(async (req, res, next) => {
  const person = await userModel.findOne({ _id: req.id });
  return res.status(200).json({
    success: true,
    data: person,
  });
});

// // //! handle logout
// exports.logout = catchAsyncError((req, res, next) => {
//     return res
//         .status(200)
//         .cookie('token', '', { expires: new Date(), httpOnly: true })
//         .json({
//             success: true,
//             message: "Logout Successful."
//         });
// });

// //! update my profile viva otp
exports.updateMyProfileVivaOtp = catchAsyncError(async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(400).json({ success: false, message: error });
  }
  const { otp, name, email, mobile, whatsappNo, ageGroup, address, imgUrl } =
    req.body;
  if (
    !otp ||
    !name ||
    !email ||
    !mobile ||
    !whatsappNo ||
    !ageGroup ||
    !address
  ) {
    return next(new ErrorHandler("Fields can't be empty", 400));
  }
  const check = await userModel.findOne({ email: email });
  if (check.otp !== otp) {
    return res.status(400).json({ success: false, message: "Try again." });
  }
  await userModel.findOneAndUpdate(
    { email: email },
    {
      name: name,
      mobile: mobile,
      whatsappNo: whatsappNo,
      ageGroup: ageGroup,
      address: address,
      imgUrl: imgUrl,
    },
    { new: true }
  );
  // fetch updated data
  const data = await userModel.findOne({ email: email });
  return res
    .status(200)
    .json({ success: true, message: "Profile updated successfully.", data });
});

// //! fetch all persons according to the given role (query)
exports.fetchCommonRolePerson = catchAsyncError(async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(400).json({ success: false, message: error });
  }
  const query = req.query.role;
  const user_id = req.id;
  // checking access authority
  const admin = await userModel.findById(user_id);
  if(query==="BDI" && (admin.role !== "TL" && admin.role !== "CXO" && admin.role !== "MD"))
  {
    return res.status(400).json({success:false, message:"You have no authority."});
  }
  if(query==="TL" && (admin.role !== "CXO" && admin.role !== "MD"))
  {
    return res.status(400).json({success:false, message:"You have no authority."});
  }
  if(query==="CXO" && (admin.role !== "MD"))
  {
    return res.status(400).json({success:false, message:"You have no authority."});
  }
  if(query==="MD" && (admin.role !== "MD"))
  {
    return res.status(400).json({success:false, message:"You have no authority."});
  }

  const data = await userModel.find({ role: query });
  return res.status(200).json({ success: true, data });
});

// //! fetch persons with the help of role and creator id
exports.fetchPersonsByRoleAndCreatorDBId = catchAsyncError(
  async (req, res, next) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({ success: false, message: error });
    }
    const role = req.query.role;
    const creatorDBId = req.query.creatorDBId;
   
    // checking the access level
    const admin = await userModel.findById(req.id);
    if (role === "BDI" && admin.role && (admin.role !== "TL" && admin.role !== "CXO" && admin.role !== "MD")) {
      return next(new ErrorHandler("You have no authority.", 400));
    }
    if (role === "TL" && admin.role && (admin.role !== "CXO" && admin.role !== "MD")) {
      return next(new ErrorHandler("You have no authority.", 400));
    }
    if (role === "CXO" && admin.role && admin.role !== "MD") {
      return next(new ErrorHandler("You have no authority.", 400));
    }
    if (role === "MD" && admin.role && admin.role !== "MD") {
      return next(new ErrorHandler("You have no authority.", 400));
    }

    const data = await userModel
      .find({ creator: creatorDBId })
      .populate({ path: "creator", options: { strictPopulate: false } }) // Populate the user field
      .exec();
    return res.status(200).json({ success: true, data });
  }
);

// //! delete person by id
// exports.deletePersonById = catchAsyncError(async (req, res, next) => {
//   const error = validationResult(req);
//   if (!error.isEmpty()) {
//     return res.status(400).json({ success: false, message: error });
//   }
//   const { personId } = req.body;
//   const id = req.id;
//   const adminLevel = await userModel.findById(id);
//   const person = await userModel.findById(personId);
//   const flag = false;
//   if (
//     adminLevel.role === "CXO" &&
//     (person.role === "CXO" || person.role === "MD")
//   ) {
//     flag = true;
//   } else if (adminLevel.role === "TL" && person.role !== "BDI") {
//     flag = true;
//   } else if (adminLevel.role === "BDI") {
//     flag = true;
//   }
//   if (flag) {
//     return res
//       .status(400)
//       .json({ success: false, message: "You have no authority." });
//   }
//   const ans = await userModel.findByIdAndDelete(personId);
//   if (ans) {
//     return res
//       .status(200)
//       .json({ success: true, message: "Deletion Successful." });
//   } else {
//     return res.status(400).json({ success: false, message: "Try again." });
//   }
// });


// //! block/un-block person by id
exports.changeStatusOfThePerson = catchAsyncError(async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(400).json({ success: false, message: error });
  }
  
  const { personId, status } = req.body;
  
  const id = req.id;
  
  const adminLevel = await userModel.findById(id);
  const person = await userModel.findById(personId);
  
  const flag = false;
  
  if (
    adminLevel.role === "CXO" &&
    (person.role === "CXO" || person.role === "MD")
  ) {
    flag = true;
  } else if (adminLevel.role === "TL" && person.role !== "BDI") {
    flag = true;
  } else if (adminLevel.role === "BDI") {
    flag = true;
  }
  if (flag) {
    return res
      .status(400)
      .json({ success: false, message: "You have no authority." });
  }
 
  const ans = await userModel.findByIdAndUpdate(personId, {status: status}, {new:true});
 
  if (ans) {
    return res
      .status(200)
      .json({ success: true, message: "Status updated Successful." });
  } else {
    return res.status(400).json({ success: false, message: "Try again." });
  }
});