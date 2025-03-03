import React, { useEffect, useState } from "react";
import { MobileTaskForm } from "@/components/Mobile/MobileTaskForm";
import { useTasks } from "@/context/TaskContext";
import MobileTaskButtons from "../TaskButtons";
import MobileEditModal from "./MobileEditModal";
import { useAuth } from "@/context/AuthContext";
const MobileKanban = () => {
   const { logout } =process.env.NEXT_PUBLIC_BACKENDURL;
;
    const {  setOpenStatus, openStatus,  fetchTasks, tasks,statuses,DownloadPdf } = useTasks();
     const [addingTask, setAddingTask] = useState(false);
    const [editTask, setEditTask] = useState(null);


    useEffect(() => {
        fetchTasks();
    }, []);

    

    return (
        <div className="md:hidden  h-screen">
            <div className="flex justify-between p-4 bg-gray-200 rounded-lg shadow-md">
                <button
                    onClick={DownloadPdf}
                    className="bg-black text-white px-4 py-2 rounded "
                >
                    Download PDF 🗃️
                </button>
                <button
                    onClick={logout}
                    className="bg-black text-white px-4 py-2 rounded "
                >
                    Logout 
                </button>
            </div>
            
            {statuses.map((status) => (
                <div key={status} className="bg-gray-100 p-4 rounded-lg shadow-md">
                    <button
                        onClick={() => setOpenStatus(openStatus === status ? null : status)}
                        className="w-full text-left font-semibold text-lg flex justify-between items-center"
                    >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                        <span>{openStatus === status ? "▲" : "▼"}</span>
                    </button>
                    <div
                        className={`overflow-y-auto  scroll-smooth hide-scrollbar transition-all duration-300 ${
                            openStatus === status ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
                        }`}
                    >
                        {tasks
                            .filter((task) => task.status === status)
                            .map((task) => (
                                <div
                                    key={task._id}
                                    className="bg-white relative   m-2 p-3 rounded-lg shadow cursor-pointer"
                                    onClick={() => setEditTask(task)} // Open edit modal on click
                                >
                                    <p className="font-bold">{task.title}</p>
                                    <p className="text-sm text-gray-600">{task.description}</p>
                                    <p className="text-xs text-gray-500">Due: {task.dueDate}</p>
                                    
                                    {task.attachments && task.attachments.length > 0 && (
                                        <div className="mt-2 flex items-center">
                                            {task.attachments
                    .filter((attachment) => attachment.match(/\.(jpeg|jpg|png|gif)$/i)) // Get only images
                    
                    .map((attachment, index) => (
                        <a key={index} href={`${process.env.NEXT_PUBLIC_BACKENDURL}/${attachment}`} download target="_blank">
                            <img
                                src={`${process.env.NEXT_PUBLIC_BACKENDURL}/${attachment}`}
                                alt={`Task Attachment ${index + 1}`}
                                className={`relative z-${index} -ml-4 first:ml-0 pr-3`}
                            />
                        </a>
                    ))}
                                        </div>
                                    )}
                                   <MobileTaskButtons task={task} status={status} />
                                </div>
                            ))}
                        {status === "pending" && (
                            <div className={`mt-2 ${openStatus === status ? "opacity-100" : "opacity-0"}`}>
                                {addingTask ? (
                                    <MobileTaskForm  setAddingTask={setAddingTask}/>
                                ) : (
                                    <button
                                        onClick={() => setAddingTask(true)}
                                        className="w-full bg-blue-500 text-white p-2 rounded mt-2"
                                    >
                                        + Add Task
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            ))}

            {/* Edit Modal */}
            {editTask && (
               <MobileEditModal editTask={editTask} setEditTask={setEditTask}/>
            )}
        </div>
    );
};

export default MobileKanban;
