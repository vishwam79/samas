const taskModel = require('../models/taskModel');
const userModel = require('../models/userModel');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncError = require('../middleware/catchAsyncError');
const { validationResult } = require('express-validator');
const moment = require('moment');
const sendMail = require('../utils/sendEmail');

// 1. newTask
// 2. fetchAllTaskCreatedByYou
// 3. fetchAllTaskCreatedByYouVivaDate
// 4. fetchAllTaskCreatedByYouVivaDateAndPageInfo
// 5. viewOthersTasks
// 6. viewOthersTasksVivaDateAndPageInfo
// 7. viewOthersTasksWithOutHigherAuthorityDBIdAndPageInfo
// 8. handleStatusUpdate
// 9. handleOtherFieldUpdate
// 10. deleteTaskByDBId

// //! assign task
exports.newTask = catchAsyncError(async (req, res, next) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({ success: false, message: error });
    }
    const userId = req.id;
    const {
        date,
        taskName,
        description,
        workHalf
    } = req.body;
    // check if task is already created 
    const check = await taskModel.findOne({ userId: userId, date: date, workHalf: workHalf });
    if (check) {
        return res.status(400).json({ success: false, message: "task already created for this workHalf/date" });
    }
    const findSelf = await userModel.findById(userId);
    const data = await taskModel.create({
        author: userId,
        higherAuthority: findSelf.creator, // creator of author
        authorRole: findSelf.role,
        date,
        taskName,
        description,
        workHalf
    });
    return res.status(200).json({ success: true, data });
});

// //! view all task that is created by you
exports.fetchAllTaskCreatedByYou = catchAsyncError(async (req, res, next) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({ success: false, message: error });
    }
    const userId = req.id;
    let data = await taskModel.find({ author: userId })
        .sort({ date: -1 }) // sort data by descending order of the date 
        .populate({ path: 'author', options: { strictPopulate: false } }) // Populate the user field
        .populate({ path: 'higherAuthority', options: { strictPopulate: false } })
        .exec();
    // also apply a sorting such that for the same date, first half always come before second half
    data = data.sort((a, b) => {
        const d1 = moment(a.date).format("DD-MM-YYYY");
        const d2 = moment(b.date).format("DD-MM-YYYY");

        if (d1 === d2) {
            if (a.workHalf.trim() === "First Half" && b.workHalf.trim() === "Second Half") {
                return -1; // a should be come before b
            }
            else if (b.workHalf.trim() === "First Half" && a.workHalf.trim() === "Second Half") {
                return 1; // b should be come before a
            }
            else {
                return 0;  // both a and b are same
            }
        }
    });

    return res.status(200).json({ success: true, data });
})

// //! view all task that is created by you viva date
exports.fetchAllTaskCreatedByYouVivaDate = catchAsyncError(async (req, res, next) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({ success: false, message: error });
    }
    const userId = req.id;
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;
   
    let data = await taskModel.find(
        {
            author: userId,
            date: {
                $gte: new Date(startDate), // Greater than or equal to startDate
                $lte: new Date(endDate),   // Less than or equal to endDate
            },
        })
        .sort({ date: -1 }) // sort data by descending order of the date 
        .populate({ path: 'author', options: { strictPopulate: false } }) // Populate the user field
        .populate({ path: 'higherAuthority', options: { strictPopulate: false } })
        .exec();
    // also apply a sorting such that for the same date, first half always come before second half
    data = data.sort((a, b) => {
        const d1 = moment(a.date).format("DD-MM-YYYY");
        const d2 = moment(b.date).format("DD-MM-YYYY");

        if (d1 === d2) {
            if (a.workHalf.trim() === "First Half" && b.workHalf.trim() === "Second Half") {
                return -1; // a should be come before b
            }
            else if (b.workHalf.trim() === "First Half" && a.workHalf.trim() === "Second Half") {
                return 1; // b should be come before a
            }
            else {
                return 0;  // both a and b are same
            }
        }
    });

    return res.status(200).json({ success: true, data });
})

// //! view all task that is created by you viva date and page info
exports.fetchAllTaskCreatedByYouVivaDateAndPageInfo = catchAsyncError(async (req, res, next) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({ success: false, message: error });
    }
    const userId = req.id;
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;
    const pageSize = req.query.pageSize;
    const pageNo = req.query.pageNo;

    if(pageNo<1) return res.status(400).json({success:false, message:"Page No must be greater than zero."});
    if(pageSize<1) return res.status(400).json({success:false, message:"Page size must be greater than zero."});
   
    let total = await taskModel.count({
        author: userId,
        date: {
            $gte: new Date(startDate), // Greater than or equal to startDate
            $lte: new Date(endDate),   // Less than or equal to endDate
        },
    });
    let data = await taskModel.find(
        {
            author: userId,
            date: {
                $gte: new Date(startDate), // Greater than or equal to startDate
                $lte: new Date(endDate),   // Less than or equal to endDate
            },
        })
        .sort({ date: -1 }) // sort data by descending order of the date 
        .skip((pageNo-1)*pageSize) 
        .limit(pageSize)
        .populate({ path: 'author', options: { strictPopulate: false } }) // Populate the user field
        .populate({ path: 'higherAuthority', options: { strictPopulate: false } })
        .exec();
    // also apply a sorting such that for the same date, first half always come before second half
    data = data.sort((a, b) => {
        const d1 = moment(a.date).format("DD-MM-YYYY");
        const d2 = moment(b.date).format("DD-MM-YYYY");

        if (d1 === d2) {
            if (a.workHalf.trim() === "First Half" && b.workHalf.trim() === "Second Half") {
                return -1; // a should be come before b
            }
            else if (b.workHalf.trim() === "First Half" && a.workHalf.trim() === "Second Half") {
                return 1; // b should be come before a
            }
            else {
                return 0;  // both a and b are same
            }
        }
    });

    return res.status(200).json({ success: true, totalCount:total, resultCount: data ? data.length : 0, data});
})

// //! view all of the task created by lower authority
exports.viewOthersTasks = catchAsyncError(async (req, res, next) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({ success: false, message: error });
    }

    const authorRole = req.query.authorRole;
    const higherAuthority = req.query.higherAuthorityDBId;

    let data = await taskModel.find({ authorRole: authorRole, higherAuthority: higherAuthority })
        .sort({ date: -1 }) // sort data by descending order of the date 
        .populate({ path: 'author', options: { strictPopulate: false } }) // Populate the user field
        .populate({ path: 'higherAuthority', options: { strictPopulate: false } })
        .exec();
    // also apply a sorting such that for the same date, first half always come before second half
    data = data.sort((a, b) => {
        const d1 = moment(a.date).format("DD-MM-YYYY");
        const d2 = moment(b.date).format("DD-MM-YYYY");

        if (d1 === d2) {
            if (a.workHalf.trim() === "First Half" && b.workHalf.trim() === "Second Half") {
                return -1; // a should be come before b
            }
            else if (b.workHalf.trim() === "First Half" && a.workHalf.trim() === "Second Half") {
                return 1; // b should be come before a
            }
            else {
                return 0;  // both a and b are same
            }
        }
    });

    return res.status(200).json({ success: true, data });
})

// //! view all of the task created by lower authority viva date and page info
exports.viewOthersTasksVivaDateAndPageInfo = catchAsyncError(async (req, res, next) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({ success: false, message: error });
    }

    const authorRole = req.query.authorRole;
    const higherAuthority = req.query.higherAuthorityDBId;
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;
    const pageSize = req.query.pageSize;
    const pageNo = req.query.pageNo;

    if(pageNo<1) return res.status(400).json({success:false, message:"Page No must be greater than zero."});
    if(pageSize<1) return res.status(400).json({success:false, message:"Page size must be greater than zero."});

    let total = await taskModel.count({
        authorRole: authorRole,
        higherAuthority: higherAuthority,
        date: {
            $gte: new Date(startDate), // Greater than or equal to startDate
            $lte: new Date(endDate),   // Less than or equal to endDate
        },
    });

    let data = await taskModel.find({
        authorRole: authorRole,
        higherAuthority: higherAuthority,
        date: {
            $gte: new Date(startDate), // Greater than or equal to startDate
            $lte: new Date(endDate),   // Less than or equal to endDate
        },
    })
        .sort({ date: -1 }) // sort data by descending order of the date 
        .skip((pageNo-1)*pageSize) 
        .limit(pageSize)
        .populate({ path: 'author', options: { strictPopulate: false } }) // Populate the user field
        .populate({ path: 'higherAuthority', options: { strictPopulate: false } })
        .exec();
    // also apply a sorting such that for the same date, first half always come before second half
    data = data.sort((a, b) => {
        const d1 = moment(a.date).format("DD-MM-YYYY");
        const d2 = moment(b.date).format("DD-MM-YYYY");

        if (d1 === d2) {
            if (a.workHalf.trim() === "First Half" && b.workHalf.trim() === "Second Half") {
                return -1; // a should be come before b
            }
            else if (b.workHalf.trim() === "First Half" && a.workHalf.trim() === "Second Half") {
                return 1; // b should be come before a
            }
            else {
                return 0;  // both a and b are same
            }
        }
    });

    return res.status(200).json({ success: true, totalCount:total, resultCount: data ? data.length : 0, data});
})

// //! view other task (second method : here no need of passing higher authority db id)
exports.viewOthersTasksWithOutHigherAuthorityDBIdAndPageInfo = catchAsyncError(async (req, res, next) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({ success: false, message: error });
    }

    const authorRole = req.query.authorRole;
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;
    const pageSize = req.query.pageSize;
    const pageNo = req.query.pageNo;

    if(pageNo<1) return res.status(400).json({success:false, message:"Page No must be greater than zero."});
    if(pageSize<1) return res.status(400).json({success:false, message:"Page size must be greater than zero."});

    let total = await taskModel.count({
        authorRole: authorRole,
        date: {
            $gte: new Date(startDate), // Greater than or equal to startDate
            $lte: new Date(endDate),   // Less than or equal to endDate
        },
    });

    let data = await taskModel.find({
        authorRole: authorRole,
        date: {
            $gte: new Date(startDate), // Greater than or equal to startDate
            $lte: new Date(endDate),   // Less than or equal to endDate
        },
    })
        .sort({ date: -1 }) // sort data by descending order of the date 
        .skip((pageNo-1)*pageSize)
        .limit(pageSize)
        .populate({ path: 'author', options: { strictPopulate: false } }) // Populate the user field
        .populate({ path: 'higherAuthority', options: { strictPopulate: false } })
        .exec();
    // also apply a sorting such that for the same date, first half always come before second half
    data = data.sort((a, b) => {
        const d1 = moment(a.date).format("DD-MM-YYYY");
        const d2 = moment(b.date).format("DD-MM-YYYY");

        if (d1 === d2) {
            if (a.workHalf.trim() === "First Half" && b.workHalf.trim() === "Second Half") {
                return -1; // a should be come before b
            }
            else if (b.workHalf.trim() === "First Half" && a.workHalf.trim() === "Second Half") {
                return 1; // b should be come before a
            }
            else {
                return 0;  // both a and b are same
            }
        }
    });

    return res.status(200).json({ success: true, totalCount:total, resultCount: data ? data.length : 0, data});
})


// //! handle status update
exports.handleStatusUpdate = catchAsyncError(async (req, res, next) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({ success: false, message: error });
    }
    const {
        statusValue,
        dbId
    } = req.body;
    await taskModel.findOneAndUpdate({ _id: dbId }, { status: statusValue }, { new: true });
    return res.status(200).json({ success: true, message: "Status updated successfully." });
})

// //! handle other field update
exports.handleOtherFieldUpdate = catchAsyncError(async (req, res, next) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({ success: false, message: error });
    }
    const {
        fieldName,
        value,
        dbId
    } = req.body;

    if (fieldName === "remarks") {
        await taskModel.findOneAndUpdate({ _id: dbId }, { remarks: value }, { new: true });
    }
    else if (fieldName === "description") {
        await taskModel.findOneAndUpdate({ _id: dbId }, { description: value }, { new: true });
    }
    else if (fieldName === "status") {
        await taskModel.findOneAndUpdate({ _id: dbId }, { status: value }, { new: true });
    }
    else {
        return res.status(400).json({ success: false, message: "Make updation in server (task controller)." })
    }
    return res.status(200).json({ success: true, message: `${fieldName} updated successfully.` });
})

// //! delete task by id
exports.deleteTaskByDBId = catchAsyncError(async (req, res, next) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({ success: false, message: error });
    }
    const d = await taskModel.findByIdAndDelete(req.body.taskDBId);
    return res.status(200).json({ success: true, message: "Task deleted successfully." });
})