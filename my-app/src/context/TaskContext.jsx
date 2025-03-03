"use client";
import { useState, createContext, useContext, useEffect } from "react";
import axiosInstance from "@/utils/axiosInstance";


const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
    const statuses = ["pending", "inProgress", "completed"];
    const [openStatus, setOpenStatus] = useState("pending");
    const [tasks, setTasks] = useState([]);
    

    useEffect(() => {
        fetchTasks();

        // Set up WebSocket connection
        const socket = new WebSocket("wss://x-do-nodejs-tms.onrender.com");
        socket.onopen = () => console.log("WebSocket connected ✅");
        socket.onclose = () => console.warn("WebSocket disconnected ❌, trying to reconnect...");

        socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            console.log("WebSocket message received:", message);
            if (message.type === "TASK_CREATED") {
                setTasks((prev) => [...prev, message.task]);
            } else if (message.type === "TASK_UPDATED") {
                //pending not update in backend
                setTasks((prev) => prev.map((task) => (task._id === message.task._id ? message.task : task)));
            } else if (message.type === "TASK_DELETED") {
                setTasks((prev) => prev.filter((task) => task._id !== message.taskId));
            }else if(message.type=='TASK_DRAGGED'){
                setTasks(message.soacketTask)
            }
        };

        return () => socket.close();
    }, []);

    /**
     * fetching all tasks
     */
    const fetchTasks = async () => {
        try {
            const { data } = await axiosInstance.get("/api/tasks", { withCredentials: true });
            console.log(data);
            setTasks(data);
        } catch (error) {
            console.error("Error fetching tasks", error);
        }
    };

    /**
     * AddTask
     */
    const addTask = async (task) => {
        try {
            console.log(task,"addTask")
            const { data } = await axiosInstance.post("/api/tasks", task, { withCredentials: true });
            setTasks([...tasks, data]);
        } catch (error) {
            console.error("Error adding task", error);
        }
    };

    /**
     *Edit Task
     */
    const updateTask = async (id, update) => {
        console.log("id",id)
        console.log(update,"update task")
        for (let pair of update.entries()) {
            console.log(pair[0], pair[1]);
        }
        try {
            const { data } = await axiosInstance.patch(`/api/tasks/${id}`, update, {
                withCredentials: true,
            });
            setTasks(tasks.map((task) => (task._id === id ? data : task)));
        } catch (error) {
            console.error("Error updating task", error);
        }
    };

    /**
     * soft Delete
     */
    const deleteTask = async (id) => {
        try {
            await axiosInstance.delete(`/api/tasks/${id}`, { withCredentials: true });
            setTasks(tasks.filter((task) => task._id !== id));
        } catch (error) {
            console.error("Error deleting task", error);
        }
    };
    

     /**
     * Download Pdf
     */
     const DownloadPdf = async () => {
        try {
            const response = await axiosInstance.get("/api/tasks/download/pdf", {
                withCredentials: true,
                responseType: "blob", // Important! Ensures Axios returns a Blob
            });
    
            // Create Blob URL
            const url = window.URL.createObjectURL(response.data);
            const a = document.createElement("a");
            a.href = url;
            a.download = "tasks.pdf"; // Set file name
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Error downloading PDF", error);
        }
    };

    /**
     * Move Task (mobile view)
     */
    const moveTask = async (taskId, direction) => {
        // Find the current task
        const task = tasks.find((task) => task._id === taskId);
        if (!task) return;

        const currentIndex = statuses.indexOf(task.status);
        const newIndex = currentIndex + direction;

        if (newIndex >= 0 && newIndex < statuses.length) {
            const newStatus = statuses[newIndex];

            const id = taskId;
            try {
                // Send update request to backend
                await axiosInstance.patch(
                    `/api/tasks/${id}`,
                    { status: newStatus },
                    { withCredentials: true }
                );

                // Update local state only if API call succeeds
                setTasks((prevTasks) => prevTasks.map((t) => (t._id === taskId ? { ...t, status: newStatus } : t)));
            } catch (error) {
                console.error("Error updating task status:", error);
            }
            setOpenStatus(newStatus);
        }
    };

    /**
     * Drag Task (Desktop view)
     */
    const updateDrag = async (taskss) => {
        try {
            const updatedTasks = taskss.map((task) => ({
                id: task._id,
                status: task.status,
                order: task.order,
            }));

            await axiosInstance.patch(
                `/api/tasks/drag-update`,
                { tasks: updatedTasks,soacketTask:taskss },
                { withCredentials: true }
            );
        } catch (error) {
            console.error("Error updating tasks:", error);
        }
    };
/**
     * updateAttachment
     */
const addNewAttachment = async (id,newAtt) => {
    console.log(id,"id check")
    try {
        console.log(newAtt,"newAtt")
        const formData = new FormData();
        if (newAtt instanceof FileList || Array.isArray(newAtt)) {
            // ✅ If newAtt is a FileList, append all files
            for (let i = 0; i < newAtt.length; i++) {
                formData.append("attachments", newAtt[i]);
            }
        } else {
            // ✅ If it's a single file, append it directly
            formData.append("attachments", newAtt);
        }
        const response = await axiosInstance.patch(`/api/tasks/newAttachment/${id}`,formData, {
            withCredentials: true,
         
        });
        console.log(response.data)
        // setTasks([...tasks, data]);
    } catch (error) {
        console.error("Error adding Attachment", error);
    }
};
    return (
        <TaskContext.Provider
            value={{
                tasks,
                addTask,
                updateTask,
                deleteTask,
                fetchTasks,
                moveTask,
                openStatus,
                setOpenStatus,
                setTasks,
                updateDrag,
                statuses,
                addNewAttachment,DownloadPdf

            }}
        >
            {children}
        </TaskContext.Provider>
    );
};

export const useTasks = () => useContext(TaskContext);
