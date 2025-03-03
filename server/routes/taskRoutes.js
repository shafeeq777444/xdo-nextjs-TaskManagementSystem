import express from "express";
import { createTaskController, getTasksController,updateTaskController, deleteTaskController,getIndividualTaskController, generateTaskPDF, dragTaskUpdate,addFileController } from "../controllers/taskController.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { upload } from "../middlewares/multer.js";

const router = express.Router();

router.post("/",verifyToken,upload.array("attachments"),createTaskController);
router.get("/",verifyToken, getTasksController);
router.get("/:id",verifyToken, getIndividualTaskController);
router.delete("/:id",verifyToken, deleteTaskController);
router.patch('/drag-update', dragTaskUpdate);
router.get("/download/pdf", verifyToken, generateTaskPDF);
router.patch("/:id", verifyToken, upload.array("attachments"), updateTaskController);

router.patch("/newAttachment/:id",verifyToken,upload.array("attachments"),addFileController)


export default router;
