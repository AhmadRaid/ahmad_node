const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");

router.route("/").get(taskController.getTask).post(taskController.createTask);
router
  .route("/:id")
  .get(taskController.showTask)
  .patch(taskController.updateTask)
  .delete(taskController.deleteTask);

module.exports = router;
