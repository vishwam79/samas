const leadGenerationModel = require('../models/leadGenerationModel');
const userModel = require('../models/userModel');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncError = require('../middleware/catchAsyncError');
const {validationResult} = require('express-validator');
const moment = require('moment');
const sendEmail = require('../utils/sendEmail');

// 1. Generate new lead
// 2. show generated leads by any one person
// 3. Update Lead Generation Data Field
// 4. Delete Lead By DBId

// 1. Generate new lead
exports.generateNewLead = catchAsyncError(async(req,res,next)=>{
    const errors = await validationResult(req);
    if(!errors.isEmpty())
    {
        return res.status(400).json({success: false, error: errors});
    }

    const {
        clientName,
        clientDesignation,
        clientOrganisation,
       
        clientMobileNumber,
        clientWhatsappNumber,
        clientMailId,
       
        serviceCategories,
        demand,
        firstConversationDate
    } = req.body;
 
    // lead generater db id
    const userId = req.id;

    const data  = await leadGenerationModel.create({
        generatedBy: userId,
        clientName,
        clientDesignation,
        clientOrganisation,
       
        clientMobileNumber,
        clientWhatsappNumber,
        clientMailId,
       
        serviceCategories,
        demand,
        firstConversation: {
            date: firstConversationDate,
        },
        lastConversation:{
            date: firstConversationDate // tracking last, at the time of creation first is last...
        }
    });
    return res.status(200).json({success: true, data});
})

// 2. show generated leads by any one person
exports.showGeneratedLeadsByAnyOnePerson = catchAsyncError(async(req,res,next)=>{
    const errors = await validationResult(req);
    if(!errors.isEmpty())
    {
        return res.status(400).json({success: false, error: errors});
    }
 
    const generaterDBId = req.query.generaterDBId;
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;

    const data = await leadGenerationModel.find({
        generatedBy:generaterDBId,
        leadGenerationDate:{
            $gte: new Date(startDate), // Greater than or equal to startDate (given from query)
            $lte: new Date(endDate),   // Less than or equal to endDate (given from query)
        }
    })
    .sort({leadGenerationDate:-1})  // sort in descending order of the date
    .populate({path:"generatedBy", options:{strictPopulate: false}})
    .exec();
    
    return res.status(200).json({success: true, data});
})

// 3. Update Lead Generation Data Field
exports.updateLeadGenerationDataField = catchAsyncError(async(req,res,next)=>{
    const error = await validationResult(req);
    if(!error.isEmpty())
    {
        return res.status(400).json({success: false, message: error});
    }

    const {
        DBId, 
        fieldName, 
        newFieldValue
    } = req.body;

    const user_id = req.id;

    const findUser = await userModel.findById(user_id);
    const findLead = await leadGenerationModel.findById(DBId).populate({path:'generatedBy', options:{strictPopulate: false}}).exec();
    let generatorRole = findLead.generatedBy.role;
    
    // now, higher authority can also update the field but lower or similar can not
    if((findUser.role === generatorRole && findLead.generatedBy._id.toString() !== user_id.toString()) && (user_id.toString() === findLead.generatedBy._id.toString() && fieldName === 'remarks') && (findUser.role === "BDI" && user_id.toString() !== findLead.generatedBy._id.toString()))
    {
        return res.status(400).json({success: false, message: "You have no authority"});
    }
    
    // update the value according to the field name
    switch(fieldName)
    {
        // updating remarks field, no authority set
        case "remarks": 
                await leadGenerationModel.findByIdAndUpdate({_id: DBId}, {remarks: newFieldValue}, {new:true});
                return res.status(200).json({success: true, message: "Remarks field updated successfully."});
                break;
        
        // updating bucket field, only creator have authority
        case "bucket":
                await leadGenerationModel.findByIdAndUpdate(DBId, {bucket: newFieldValue}, {new:true});
                return res.status(200).json({success: true, message: "Bucket field updated successfully."});
                break;
        
        // updating status field, only creator have authority
        case "status":
                await leadGenerationModel.findByIdAndUpdate(DBId, {status: newFieldValue}, {new:true});
                return res.status(200).json({success: true, message: "Status field updated successfully."});
                break;
        
        // updating client name field, only creator have authority
        case "clientName":
            await leadGenerationModel.findByIdAndUpdate(DBId, {clientName: newFieldValue}, {new:true});
            return res.status(200).json({success: true, message: "ClientName field updated successfully."});
            break;

        // updating client organisation field, only creator have authority
        case "clientOrganisation":
            await leadGenerationModel.findByIdAndUpdate(DBId, {clientOrganisation: newFieldValue}, {new:true});
            return res.status(200).json({success: true, message: "ClientOrganisation field updated successfully."});
            break;

        // updating client designation field, only creator have authority
        case "clientDesignation":
            await leadGenerationModel.findByIdAndUpdate(DBId, {clientDesignation: newFieldValue}, {new:true});
            return res.status(200).json({success: true, message: "Client Designation field updated successfully."});
            break;

        // updating client mobile number field, only creator have authority
        case "clientMobileNumber":
            await leadGenerationModel.findByIdAndUpdate(DBId, {clientMobileNumber: newFieldValue}, {new:true});
            return res.status(200).json({success: true, message: "Client Mobile Number field updated successfully."});
            break;

        // updating client whatsapp number field, only creator have authority
        case "clientWhatsappNumber":
            await leadGenerationModel.findByIdAndUpdate(DBId, {clientWhatsappNumber: newFieldValue}, {new:true});
            return res.status(200).json({success: true, message: "Client Whatsapp Number field updated successfully."});
            break;

        // updating clientMailId field, only creator have authority
        case "clientMailId":
            await leadGenerationModel.findByIdAndUpdate(DBId, {clientMailId: newFieldValue}, {new:true});
            return res.status(200).json({success: true, message: "Client MailId field updated successfully."});
            break;

        // updating serviceCategories field, only creator have authority
        case "serviceCategories":
            await leadGenerationModel.findByIdAndUpdate(DBId, {serviceCategories: newFieldValue}, {new:true});
            return res.status(200).json({success: true, message: "Service Categories field updated successfully."});
            break;

        // updating demand field, only creator have authority
        case "demand":
            await leadGenerationModel.findByIdAndUpdate(DBId, {demand: newFieldValue}, {new:true});
            return res.status(200).json({success: true, message: "Demand field updated successfully."});
            break;

        // updating First Conversation : date, only creator have authority
        case "firstConversationDate":
            await leadGenerationModel.findByIdAndUpdate(DBId, {'firstConversation.date': newFieldValue}, {new:true});
            return res.status(200).json({success: true, message: "Date subfield of the first conversation field updated successfully."});
            break;

         // updating FirstConversation : details, only creator have authority
         case "firstConversationDetails":
            await leadGenerationModel.findByIdAndUpdate(DBId, {'firstConversation.details': newFieldValue}, {new:true});
            return res.status(200).json({success: true, message: "Details subfield of the first conversation field updated successfully."});
            break;

         // updating lastConversation : date, only creator have authority
         case "lastConversationDate":
            await leadGenerationModel.findByIdAndUpdate(DBId, {'lastConversation.date': newFieldValue}, {new:true});
            return res.status(200).json({success: true, message: "lastConversation : date updated successfully."});
            break;

         // updating lastConversation : details, only creator have authority
         case "lastConversationDetails":
            await leadGenerationModel.findByIdAndUpdate(DBId, {'lastConversation.details': newFieldValue}, {new:true});
            return res.status(200).json({success: true, message: "lastConversation : details updated successfully."});
            break;

         // updating nextConversationDate field, only creator have authority
         case "nextConversationDate":
            await leadGenerationModel.findByIdAndUpdate(DBId, {nextConversationDate: newFieldValue}, {new:true});
            return res.status(200).json({success: true, message: "nextConversationDate field updated successfully."});
            break;

         // updating presentStatus field, only creator have authority
         case "presentStatus":
            await leadGenerationModel.findByIdAndUpdate(DBId, {presentStatus: newFieldValue}, {new:true});
            return res.status(200).json({success: true, message: "presentStatus field updated successfully."});
            break;

         // updating closingStatement field, only creator have authority
         case "closingStatement":
            await leadGenerationModel.findByIdAndUpdate(DBId, {closingStatement: newFieldValue}, {new:true});
            return res.status(200).json({success: true, message: "closingStatement field updated successfully."});
            break;
        
        // default : if not field match
        default: return res.status(400).json({success: false, message:"Field not found."});
    }
})

// 4. Delete Lead By DBId
exports.deleteLeadByDBId = catchAsyncError(async(req,res,next)=>{
    const errors = await validationResult(req);
    if(!errors.isEmpty())
    {
        return res.status(400).json({success: false, message: errors});
    }
    const {
        leadDBId
    } = req.body;
    const user_id = req.id;
    const findLead = await leadGenerationModel.findById(leadDBId);
    if(findLead.generatedBy.toString() !== user_id)
    {
        return res.status(400).json({success:false, message:"You have no authority."});
    }
    await leadGenerationModel.findByIdAndDelete(leadDBId);
    return res.status(200).json({success: true, message:"Lead Deleted Successfully."});
})