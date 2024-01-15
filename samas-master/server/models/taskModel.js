const mongoose  = require('mongoose');
const schema = mongoose.Schema({
    author:{
        type: mongoose.Schema.ObjectId,
        ref: 'users',
        required: true
    },
    higherAuthority:{
        type: mongoose.Types.ObjectId,
        ref: 'users',
        required: true
    },
    authorRole:{
        type: String,
        required: true
    },
    date:{
        type: Date,
        required: true
    },
    taskName:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    workHalf:{
        type: String,
        required: true
    },
    remarks:{
        type: String,
        default: ""
    },
    status:{
        type: String,
        default: "Created"
    }
});
const model = mongoose.model("task", schema);
module.exports = model;


// YourModel.find({ /* query criteria */ })
//     .sort({ createdAt: -1 }) // Sort by createdAt in descending order
//     .limit(10) // Limit the results to 10 documents
//     .populate('user') // Populate the user field
//     .exec()
//     .then(result => {
//         // Handle the modified query result
//     })
//     .catch(error => {
//         // Handle errors
//     });
