
import asyncHandler from "../middlewares/asyncHandler.js";
import { broadcastUpdate } from "../server.js";
import { createTask, getUserTasks,updateAttachments,  updateTask, deleteTask ,getTaskById,generateTaskPDFService, dragTaskUpdateService} from "../services/taskService.js";
import fs from "fs";

/**
 * Create Task
 */
export const createTaskController = asyncHandler(async (req, res) => {
  console.log(req.user.id,"check")
  const attachments = req.files ? req.files.map((file) => file.path) : [];
  const task = await createTask(req.user.id,{...req.body,attachments});
  
  // Broadcast the new task to all clients
  broadcastUpdate({ type: "TASK_CREATED", task });

  res.status(201).json(task);
});
/**
 * Update Task
 */
export const updateTaskController = asyncHandler(async (req, res) => {
  console.log(req.params.id)
  const task = await updateTask(req.params.id, req.user.id, req.body); 
  // Broadcast updated task
  broadcastUpdate({ type: "TASK_UPDATED", task });

  res.json(task);
});

/**
 * Get All Tasks
 */
export const getTasksController = asyncHandler(async (req, res) => {
  const tasks = await getUserTasks(req.user.id);
  res.json(tasks);
});

/**
 * Get Single Task
 */
export const getIndividualTaskController = asyncHandler(async (req, res) => {
  const task = await getTaskById(req.params.id, req.user.id); 
  res.json(task);
});


/**
 * Delete Task
 */
export const deleteTaskController = asyncHandler(async (req, res) => {
  const response = await deleteTask(req.params.id, req.user.id);
  // Broadcast the deleted task ID
  broadcastUpdate({ type: "TASK_DELETED", taskId: req.params.id });

  res.json(response);
});

/**
 * addAttachment
 */
export const addFileController = asyncHandler(async (req, res) => {
  console.log(req.params.id,"param id")
  console.log(req.files,"filessss")
  const task = await updateAttachments(req.params.id,req.user.id,  req.files.map(file => file.path));  
  console.log(req.files,"filesssss")
  broadcastUpdate({ type: "TASK_UPDATED", task });
  res.json(task)
  
});

/**
 * update Drag files(bulk files)
 */
export const dragTaskUpdate = asyncHandler(async (req, res) => {
  const { tasks,soacketTask } = req.body; 
  await dragTaskUpdateService(tasks);
   // Broadcast the dragTask
   broadcastUpdate({ type: "TASK_DRAGGED", soacketTask });

  res.status(200).json({ message: "Tasks updated successfully" });
});

/**
 * Generate PDF
 */
export const generateTaskPDF = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  try {
    const filePath = await generateTaskPDFService(userId);

    res.download(filePath, `tasks-${userId}.pdf`, (err) => {
      if (err) {
        console.error("Download error:", err);
      } else {
        fs.unlinkSync(filePath); // Delete file after download
      }
    });
  } catch (error) {
    console.error("PDF Download Error:", error.message);
    res.status(500).json({ success: false, error: "Failed to download PDF" });
  }
});