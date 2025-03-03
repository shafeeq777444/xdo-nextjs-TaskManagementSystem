import { useTasks } from "@/context/TaskContext";
import React from "react";

const MobileTaskButtons = ({status,task}) => {
      const { moveTask, deleteTask } = useTasks();
    return (
        <div className="flex gap-2 mt-3 ">
            {status !== "pending" && (
                <button
                    onClick={(e) => {
                        e.stopPropagation(); 
                        moveTask(task._id, -1);
                    }}
                    className="bg-black border py-2 border-black text-white px-3 rounded text-xs hover:bg-white hover:text-black hover:border-gray-300
               transition duration-30"
                >
                    ← Back
                </button>
            )}
            {status !== "completed" && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        moveTask(task._id, 1);
                    }}
                    className="bg-black border py-2 border-black text-white px-3 rounded text-xs hover:bg-white hover:text-black hover:border-gray-300
               transition duration-30"
                >
                    Move →
                </button>
            )}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    deleteTask(task._id);
                }}
                className="absolute right-0 bottom-4 h-10 bg-gray-500 text-white p-2 w-8 text-xs rounded-tl-xl   rounded-bl-xl  hover:w-12 text-md  duration-300 ease-in-out"
            >
                🗑 
            </button>
        </div>
    );
};

export default MobileTaskButtons;
