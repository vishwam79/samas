const taskAllocationRoute = require('express').Router();
const {fetchUser} = require('../middleware/fetchUser');

const {
    allocateNewTask,
    viewAllAllocatedTask,
    viewAllAllocatedTaskVivaDate,
    viewAllAllocatedTaskVivaDateAndPageInfo,
    updateParticularField,
    updateParticularFieldWithoutCreatorPermission,
    deleteAllocatedTaskByDBId,
} = require('../controllers/taskAllocationControllers');


taskAllocationRoute.route("/api/v1/allocateNewTask").post(fetchUser, allocateNewTask);
taskAllocationRoute.route("/api/v1/viewAllAllocatedTask").get(fetchUser, viewAllAllocatedTask);
taskAllocationRoute.route("/api/v1/viewAllAllocatedTaskVivaDate").get(fetchUser, viewAllAllocatedTaskVivaDate);
taskAllocationRoute.route("/api/v1/viewAllAllocatedTaskVivaDateAndPageInfo").get(fetchUser, viewAllAllocatedTaskVivaDateAndPageInfo);
taskAllocationRoute.route("/api/v1/updateParticularField").put(fetchUser, updateParticularField);
taskAllocationRoute.route("/api/v1/updateParticularFieldWithoutCreatorPermission").put(fetchUser, updateParticularFieldWithoutCreatorPermission);
taskAllocationRoute.route("/api/v1/deleteAllocatedTaskByDBId").delete(fetchUser, deleteAllocatedTaskByDBId);

module.exports = taskAllocationRoute;