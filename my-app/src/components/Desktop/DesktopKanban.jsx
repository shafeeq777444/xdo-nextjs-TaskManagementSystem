import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DesktopTaskForm } from "@/components/Desktop/DesktopTaskForm";
import { useTasks } from "@/context/TaskContext";
import DesktopTaskCard from "./DesktopTaskCard";
import DesktopEditModal from "./DesktopEditModal";
import { useAuth } from "@/context/AuthContext";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const DesktopKanban = () => {
const { logout } = useAuth(); 
    const { fetchTasks, setTasks, updateDrag, tasks,statuses,DownloadPdf } = useTasks();
    const [editTask, setEditTask] = useState(null);

    useEffect(() => {
        fetchTasks();
    }, []);

    const handleDragEnd = (result) => {
        const completed = tasks.filter((x) => x.status == "completed");
        const inProgress = tasks.filter((x) => x.status == "inProgress");
        const pending = tasks.filter((x) => x.status == "pending");
        const taskss = { pending, inProgress, completed };

        const { destination, source } = result;
        if (!destination) return;
        if (destination.droppableId == source.droppableId) {
            const sourceColumn = taskss[source.droppableId];
            const [movedTask] = sourceColumn.splice(source.index, 1);
            sourceColumn.splice(destination.index, 0, movedTask);
            sourceColumn.forEach((task, index) => (task.order = index + 1));
        } else {
            const sourceColumn = taskss[source.droppableId];
            const destColumn = taskss[destination.droppableId];
            const [movedTask] = sourceColumn.splice(source.index, 1);
            destColumn.splice(destination.index, 0, movedTask);
            destColumn.forEach((task, index) => (task.order = index + 1));
            sourceColumn.forEach((task, index) => (task.order = index + 1));
            destColumn.forEach((task, index) => (task.status = destination.droppableId));
        }
        const updatedTasks = [...completed, ...inProgress, ...pending];
        setTasks(updatedTasks);
        updateDrag(updatedTasks);

        // Call API after updating state
    };

    return (
        <div className="hidden md:flex flex-row gap-4 bg-teal-50 h-screen">
           
            
            <DragDropContext onDragEnd={handleDragEnd}>
                {statuses.map((status) => (
                    <div key={status} className={`flex-1  m-4 rounded-t-lg shadow-md  bg-gray-100 
                        ${status === "pending" ? "h-[53%] pb-8 mb-6" : "h-[98%]"}`}>
                        {/* Fixed Title (Outside Droppable) */}
                        <h2 className="text-lg font-semibold mb-2 bg-gray-100 p-2 z-10">
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                        </h2>

                        <Droppable droppableId={status}>
                            {(provided) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className=" h-[92%]  overflow-y-auto scroll-smooth hide-scrollbar"
                                >
                                    <AnimatePresence>
                                        <div className="space-y-3 p-4   ">
                                            {tasks
                                                .filter((task) => task.status === status)
                                                .map((task, index) => (
                                                    <Draggable key={task._id} draggableId={task._id} index={index}>
                                                        {(provided) => (
                                                            <div
                                                            
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                            >
                                                                <DesktopTaskCard
                                                                    task={task}
                                                                    index={index}
                                                                    setEditTask={setEditTask}
                                                                />
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                ))}
                                        </div>
                                    </AnimatePresence>
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>

                        {/* Add Task Form for Pending Column */}
                        {status === "pending" && (
                            <motion.div
                                initial={{ opacity: 0.25 }}
                                whileHover={{ opacity: 1, transition: { duration: 0.3 } }}
                                className="relative top-6 h-20"
                            >
                                <DesktopTaskForm />
                                <div className="flex justify-between  p-4">
                <button
                    onClick={DownloadPdf}
                    className="bg-black text-white px-4 py-2 rounded hover:bg-teal-500 hover:text-black"
                >
                    Download PDF 🗃️
                </button>
                <button
                    onClick={logout}
                    className="bg-black text-white px-4 py-2 rounded hover:bg-teal-500 hover:text-black"
                >
                    Logout 
                </button>
            </div>
                            </motion.div>
                        )}
                    </div>
                ))}
            </DragDropContext>

            {/* Edit Modal */}
            <DesktopEditModal editTask={editTask} setEditTask={setEditTask} />
            
        </div>
        
    );
};

export default DesktopKanban;
