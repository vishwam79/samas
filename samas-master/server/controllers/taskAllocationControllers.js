const taskAllocationModel = require('../models/taskAllocationModel');
const userModel = require('../models/userModel');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncError = require('../middleware/catchAsyncError');
const { validationResult } = require('express-validator');
const moment = require('moment');
const sendMail = require('../utils/sendEmail');

// 1. allocate new task
// 2. view all allocated task
// 3. view all allocated task viva date
// 4. view all allocated task viva date and pageInfo
// 5. update particular field of the task : if the person not allocated the task then it have no authority excluding remarks filed update
// 6. update particular field of the task without the permission of task creator/allocator
// 7. delete Allocated Task By DBId : if the person not allocated the task then it have no authority.


// //! 1. allocate new task
exports.allocateNewTask = catchAsyncError(async (req, res, next) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({ success: false, message: error });
    }
    const userId = req.id;
    const {
        allocatedToDBId,
        allocatedByDBId,
        taskName,
        taskDesc,
        startDate,
        deadline
    } = req.body;

    const data = await taskAllocationModel.create({
        allocatedTo: allocatedToDBId,
        allocatedBy: allocatedByDBId,
        taskName,
        taskDesc,
        startDate,
        deadline
    });
    return res.status(200).json({ success: true, data });
});

// //! 2. view all allocated task
exports.viewAllAllocatedTask = catchAsyncError(async (req, res, next) => {
});

// //! 3. view all allocated task viva date  (to any particular person)
exports.viewAllAllocatedTaskVivaDate = catchAsyncError(async (req, res, next) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({ success: false, message: error });
    }

    const allocatedToDBId = req.query.allocatedToDBId;
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;
   
    let data = await taskAllocationModel.find({
        $and: [
            {
                allocatedTo: allocatedToDBId,
            },
            {
                $or: [
                    {
                        startDate: {
                            $gte: new Date(startDate), // Greater than or equal to startDate (given from query)
                            $lte: new Date(endDate),   // Less than or equal to endDate (given from query)
                        }
                    },
                    {
                        deadline: {
                            $gte: new Date(startDate), // Greater than or equal to startDate (given from query)
                            $lte: new Date(endDate),   // Less than or equal to endDate (given from query)
                        }
                    }
                ]
            }
        ]
    })
        .sort({ startDate: -1 }) // sort data by descending order of the date 
        .populate({ path: 'allocatedTo', options: { strictPopulate: false } }) // Populate the user field
        .populate({ path: 'allocatedBy', options: { strictPopulate: false } })
        .exec();

    return res.status(200).json({ success: true,  data});
});

// //! 4. view all allocated task viva date and page info (to any particular person)
exports.viewAllAllocatedTaskVivaDateAndPageInfo = catchAsyncError(async (req, res, next) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({ success: false, message: error });
    }

    const allocatedToDBId = req.query.allocatedToDBId;
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;
    const pageNo = req.query.pageNo;
    const pageSize = req.query.pageSize;

    if(pageNo<1) return res.status(400).json({success:false, message:"Page No must be greater than zero."});
    if(pageSize<1) return res.status(400).json({success:false, message:"Page size must be greater than zero."});
   
    let total = await taskAllocationModel.count({
        $and: [
            {
                allocatedTo: allocatedToDBId,
            },
            {
                $or: [
                    {
                        startDate: {
                            $gte: new Date(startDate), // Greater than or equal to startDate (given from query)
                            $lte: new Date(endDate),   // Less than or equal to endDate (given from query)
                        }
                    },
                    {
                        deadline: {
                            $gte: new Date(startDate), // Greater than or equal to startDate (given from query)
                            $lte: new Date(endDate),   // Less than or equal to endDate (given from query)
                        }
                    }
                ]
            }
        ]
    });

    let data = await taskAllocationModel.find({
        $and: [
            {
                allocatedTo: allocatedToDBId,
            },
            {
                $or: [
                    {
                        startDate: {
                            $gte: new Date(startDate), // Greater than or equal to startDate (given from query)
                            $lte: new Date(endDate),   // Less than or equal to endDate (given from query)
                        }
                    },
                    {
                        deadline: {
                            $gte: new Date(startDate), // Greater than or equal to startDate (given from query)
                            $lte: new Date(endDate),   // Less than or equal to endDate (given from query)
                        }
                    }
                ]
            }
        ]
    })
        .sort({ startDate: -1 }) // sort data by descending order of the date 
        .skip((pageNo-1)*pageSize) 
        .limit(pageSize)
        .populate({ path: 'allocatedTo', options: { strictPopulate: false } }) // Populate the user field
        .populate({ path: 'allocatedBy', options: { strictPopulate: false } })
        .exec();

    return res.status(200).json({ success: true, totalCount:total, resultCount: data ? data.length : 0, data});
});

// //! 5. update particular field of the task
exports.updateParticularField = catchAsyncError(async (req, res, next) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({ success: false, message: error });
    }
    const {
        fieldName,
        value,
        taskDBId,
        allocatedByDBId
    } = req.body;
    
    switch (fieldName) {
        case "taskDesc":
            const check = await taskAllocationModel.findById(taskDBId);
            if (check.allocatedBy.toString() !== allocatedByDBId) {
                return res.status(400).json({ success: false, message: "You have no authority..." });
            }
            await taskAllocationModel.findOneAndUpdate({_id: taskDBId}, {taskDesc: value}, {new: true});
            return res.status(200).json({success: true, message: "Task updated successfully."});
        
        case "remarks":
            await taskAllocationModel.findOneAndUpdate({_id: taskDBId}, {remarks: value}, {new: true});
            return res.status(200).json({success: true, message: "Task updated successfully."});
    }
    return res.status(400).json({success: false, message: "No Specification match"});
})


// //! 6. update particular field of the task without the permission of creator/allocator
exports.updateParticularFieldWithoutCreatorPermission = catchAsyncError(async (req, res, next) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({ success: false, message: error });
    }
    const {
        fieldName,
        value,
        taskDBId,
    } = req.body;
    
    switch (fieldName) { 
        case "status":
            await taskAllocationModel.findOneAndUpdate({_id: taskDBId}, {status: value}, {new: true});
            return res.status(200).json({success: true, message: "Status updated successfully."});
    }
    return res.status(400).json({success: false, message: "No Specification match"});
})

// //! 7. delete task by id
exports.deleteAllocatedTaskByDBId = catchAsyncError(async (req, res, next) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({ success: false, message: error });
    }
    const {
        taskDBId,
        allocatedByDBId
    } = req.body;
    const check = await taskAllocationModel.findById(taskDBId);
    if (check.allocatedBy.toString() !== allocatedByDBId) {
        return res.status(400).json({ success: false, message: "You have no authority..." });
    }
    await taskAllocationModel.findByIdAndDelete(taskDBId);
    return res.status(200).json({ success: true, message: "Task deleted successfully." });
})
