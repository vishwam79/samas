const mongoose = require('mongoose');
const moment = require('moment');

const schema = mongoose.Schema({
    generatedBy:{
        type: mongoose.Types.ObjectId,
        ref: 'users',
        require: true
    },
    remarks:{
        type: String,
        require: true,
        default: ''
    },
    bucket:{
        type: String,
        require: true,
        default: 'cold'
    },
    status:{
        type: String,
        require: true,
        default: 'new'
    },
    leadGenerationDate:{
        type: Date,
        require: true,
        default: moment(new Date()).format("YYYY-MM-DD")
    },
    clientName:{
        type: String,
        require: true
    },
    clientOrganisation:{
        type: String
    },
    clientDesignation:{
        type: String
    },
    
    clientMobileNumber:{
        type: String,
        require: true
    },
    clientWhatsappNumber:{
        type: String,
    },
    clientMailId:{
        type: String
    },
   
    serviceCategories:{
        type: String,
        require: true
    },
    demand:{
        type: String
    },
    firstConversation:{
        date:{
            type: Date,
            require: true
        },
        details:{
            type: String,
            default: ''
        }
    },
    lastConversation:{
        date:{
            type: Date
        },
        details:{
            type: String
        }
    },
    nextConversationDate:{
        type:Date
    },
    presentStatus:{
        type: String,
        default: 'generated'
    },
    closingStatement:{
        type: String,
    }
});

const model = mongoose.model('lead-generation',schema);

module.exports = model;