import Task from "../models/Task.js";
import CustomError from "../middlewares/customError.js";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import mongoose from "mongoose";

/**
 * Create a new task
 */
export const createTask = async (userId, taskData) => {
    console.log(userId, "check second");

    // Find the last task for the user and determine the next order
    const lastTask = await Task.findOne({ userId }).sort({ order: -1 });

    taskData.userId = userId;
    taskData.order = lastTask ? lastTask.order + 1 : 1; // Assign order value

    const task = await Task.create(taskData);
    return task;
};

/**
 * Get all tasks for a user
 */
export const getUserTasks = async (userId) => {
    return await Task.find({ userId: userId, isDeleted: false }).sort({ order: 1 });
};

/**
 * Get a single task by ID
 */
export const getTaskById = async (taskId, userId) => {
    return await Task.find({ user: userId, isDeleted: false, _id: taskId });
};

/**
 * Update a task
 */
export const updateTask = async (taskId, userId, taskData) => {
    console.log("i am updatecontroller");
    console.log(taskData,"taskDat")
    const task = await Task.findOne({_id: taskId, userId: userId, isDeleted: false });

    if (!task) {
        throw new CustomError("Task not found", 404);
    }
    // Handle attachments properly
    if (taskData.attachments === "[]") {
        taskData.attachments = []; // Convert back to an empty array
    }

    Object.assign(task, taskData);
    
    await task.save();
    return task;
};

/**
 * Delete a task
 */
export const deleteTask = async (taskId, userId) => {
    const task = await Task.findOne({ _id: taskId, userId: userId });

    // Delete attached files
    task.attachments.forEach(filePath => {
        const fullPath = path.join(process.cwd(), filePath);
        fs.unlink(fullPath, (err) => {
            if (err) console.error("Error deleting file:", err);
        });
    });
    
    if (!task) {
        throw new CustomError("Task not found", 404);
    }
    // Soft delete: Mark isDeleted as true instead of deleting
    task.isDeleted = true;
    await task.save();

    return { message: "Task deleted successfully", task };
};

/**
 * Update Drag Task
 */
export const dragTaskUpdateService = async (tasks) => {
    const dragOperations = tasks.map((task) => ({
        updateOne: {
            filter: { _id: new mongoose.Types.ObjectId(task.id) },
            update: { $set: { status: task.status, order: task.order } },
        },
    }));

    return Task.bulkWrite(dragOperations);
};

/**
 * Update a attachments
 */
export const updateAttachments = async (taskId,userId,  newAtt) => {
    console.log(newAtt,"newAttPath")
    console.log("i am updataAttachcments");
    const task = await Task.findOne({_id: taskId,userId: userId,  isDeleted: false });

    if (!task) {
        throw new CustomError("Task not found", 404);
    }

    task.attachments = [...task.attachments, ...newAtt];
    await task.save();
    return task;
};


/**
 * generate pdf
 */
export const generateTaskPDFService = async (userId) => {
    try {
        const tasks = await Task.find({ userId, isDeleted: false });

        if (!tasks || tasks.length === 0) {
            throw new Error("No tasks found");
        }

        // Ensure 'uploads' directory exists
        const uploadDir = path.join("uploads");
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        // Create new blank PDF
        const doc = new PDFDocument();
        const filePath = path.join(uploadDir, `tasks-${userId}.pdf`);
        const writeStream = fs.createWriteStream(filePath);
        doc.pipe(writeStream);

        // Add Title
        doc.fontSize(20).text("Task List", { align: "center" });
        doc.moveDown();

        // Add Tasks to PDF
        tasks.forEach((task, index) => {
            doc.fontSize(14).text(`Task ${index + 1}: ${task.title}`, { underline: true });
            doc.fontSize(12).text(`Description: ${task.description || "N/A"}`);
            doc.fontSize(12).text(`Due Date: ${task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "N/A"}`);
            doc.fontSize(12).text(`Status: ${task.status}`);
            
            // Handling Attachments
if (task.attachments && task.attachments.length > 0) {
    doc.fontSize(12).text("Attachments:", { underline: true });

    task.attachments.forEach((attachment, i) => {
        const fileName = attachment.split("/").pop(); // Extract filename from path
        const fileUrl = `http://localhost:4200/${attachment}`; // Construct full URL

        doc.fontSize(10).fillColor("blue").text(`${i + 1}. ${fileName}`, { link: fileUrl, underline: true });
        doc.fillColor("black");
    });
} else {
    doc.fontSize(12).text("Attachments: None");
}

doc.moveDown();
        });

        doc.end();

        return new Promise((resolve, reject) => {
            writeStream.on("finish", () => {
                console.log("PDF generated successfully:", filePath);
                resolve(filePath);
            });
            writeStream.on("error", (error) => {
                console.error("Error writing PDF:", error);
                reject(error);
            });
        });

    } catch (error) {
        console.error("Error generating PDF:", error.message);
        throw new Error("Failed to generate PDF");
    }
};