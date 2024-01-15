const leadGenerationRoute = require('express').Router();
const {fetchUser} = require('../middleware/fetchUser');

const {
    generateNewLead,
    showGeneratedLeadsByAnyOnePerson,
    updateLeadGenerationDataField,
    deleteLeadByDBId
} = require('../controllers/leadGenerationControllers');

leadGenerationRoute.route("/api/v1/generateNewLead").post(fetchUser, generateNewLead);
leadGenerationRoute.route("/api/v1/showGeneratedLeadsByAnyOnePerson").get(fetchUser, showGeneratedLeadsByAnyOnePerson);
leadGenerationRoute.route("/api/v1/updateLeadGenerationDataField").put(fetchUser, updateLeadGenerationDataField);
leadGenerationRoute.route("/api/v1/deleteLeadByDBId").delete(fetchUser, deleteLeadByDBId);

module.exports = leadGenerationRoute;