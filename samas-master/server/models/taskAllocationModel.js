const mongoose  = require('mongoose');
const schema = mongoose.Schema({
    allocatedTo:{
        type: mongoose.Types.ObjectId,
        ref: 'users',
        required: true
    },
    allocatedBy:{
        type: mongoose.Schema.ObjectId,
        ref: 'users',
        required: true
    },
    taskName:{
        type: String,
        require: true
    },
    taskDesc:{
        type: String,
        require: true
    },
    startDate:{
        type: Date,
        require: true
    },
    deadline:{
        type: Date,
        require: true
    },    
    remarks:{
        type: String,
        default: ""
    },
    status:{
        type: String,
        default: "Allocated"
    }
});
const model = mongoose.model("allocated-task", schema);
module.exports = model;