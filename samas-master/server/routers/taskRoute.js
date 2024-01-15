const taskRoute = require('express').Router();
const {fetchUser} = require('../middleware/fetchUser');

const {
   newTask,
   fetchAllTaskCreatedByYou,
   fetchAllTaskCreatedByYouVivaDate,
   fetchAllTaskCreatedByYouVivaDateAndPageInfo,
   viewOthersTasks,
   viewOthersTasksVivaDateAndPageInfo,
   viewOthersTasksWithOutHigherAuthorityDBIdAndPageInfo,
   handleStatusUpdate,
   handleOtherFieldUpdate,
   deleteTaskByDBId
} = require('../controllers/taskControllers');


taskRoute.route("/api/v1/addTask").post(fetchUser, newTask);
taskRoute.route("/api/v1/fetchAllTaskCreatedByYou").get(fetchUser, fetchAllTaskCreatedByYou);
taskRoute.route("/api/v1/fetchAllTaskCreatedByYouVivaDate").get(fetchUser, fetchAllTaskCreatedByYouVivaDate);
taskRoute.route("/api/v1/fetchAllTaskCreatedByYouVivaDateAndPageInfo").get(fetchUser, fetchAllTaskCreatedByYouVivaDateAndPageInfo);
taskRoute.route("/api/v1/viewOthersTasks").get(fetchUser, viewOthersTasks);
taskRoute.route("/api/v1/viewOthersTasksVivaDateAndPageInfo").get(fetchUser, viewOthersTasksVivaDateAndPageInfo);
taskRoute.route("/api/v1/viewOthersTasksWithOutHigherAuthorityDBIdAndPageInfo").get(fetchUser, viewOthersTasksWithOutHigherAuthorityDBIdAndPageInfo);
taskRoute.route("/api/v1/handleStatusUpdate").put(fetchUser, handleStatusUpdate);
taskRoute.route("/api/v1/handleOtherFieldUpdate").put(fetchUser, handleOtherFieldUpdate);
taskRoute.route("/api/v1/deleteTaskByDBId").delete(fetchUser, deleteTaskByDBId);

module.exports = taskRoute;