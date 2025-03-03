import React from "react";
import { motion } from "framer-motion";
import { useTasks } from "@/context/TaskContext";
import MobileTaskButtons from "../TaskButtons";

const TaskCard = ({ task ,index,setEditTask}) => {
    const BASE_URL = process.env.NEXT_PUBLIC_BACKENDURL;
;
    const { moveTask, deleteTask } = useTasks();
    return (
        <motion.div 
            key={task._id}
            
            transition={{ duration: 0.3 }}
            className="bg-white pt-3 pl-3 pr-0 pb-0 rounded-xl shadow cursor-pointer   "
             // Open edit modal when clicking the task card
        >
            <div onClick={() => setEditTask(task)}>
                <p className="font-bold">{task.title}</p>
                <p className="text-sm text-gray-600">{task.description}</p>
                <p className="text-xs text-gray-500">Due: {new Date(task.dueDate).toLocaleDateString()}</p>
                </div>
                <div className="mb-2">
           
    {task.attachments && task.attachments.length > 0 && (
        <div className="mb-2">
        {task.attachments && task.attachments.length > 0 && (
            <div className="overflow-y-auto flex   gap-2 pt-4 items-center">
                {task.attachments
                    .filter((attachment) => attachment.match(/\.(jpeg|jpg|png|gif)$/i)) // Get only images
                    
                    .map((attachment, index) => (
                        <a key={index} href={`${BASE_URL}/${attachment}`} download target="_blank">
                            <img
                                src={`${BASE_URL}/${attachment}`}
                                alt={`Task Attachment ${index + 1}`}
                                className={`relative z-${index} -ml-4 first:ml-0 pr-3`}
                            />
                        </a>
                    ))}
            </div>
        )}
    </div>
    )}
    
</div>
            <div className="flex gap-2 mt-2 w-full">
               
                <div className="flex relative  p-4 w-full">
                <MobileTaskButtons task={task} status={task.status} />
                    
                    
                </div>
                
            </div>
            
        </motion.div>
    );
};

export default TaskCard;
