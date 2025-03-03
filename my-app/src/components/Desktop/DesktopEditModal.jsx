import { useTasks } from "@/context/TaskContext";
import React, { useRef, useState } from "react";
const DesktopEditModal = ({ editTask, setEditTask }) => {
    const [newFiles, setNewFiles] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const fileInputRef = useRef(null);
    const { updateTask, addNewAttachment } = useTasks();
    const BASE_URL = process.env.NEXT_PUBLIC_BACKENDURL;
;
    const handleButtonClick = () => {
        fileInputRef.current.click(); // Trigger file input
    };
    const handleEditChange = (e) => {
        setEditTask({ ...editTask, [e.target.name]: e.target.value });
    };

    const handleSaveEdit = async () => {
        console.log(editTask, "editTask");
        const formData = new FormData();
        formData.append("title", editTask.title);
        formData.append("description", editTask.description);
        formData.append("dueDate", editTask.dueDate);
        formData.append("status", editTask.status);
        formData.append("order", editTask.order);
        formData.append("userId", editTask.userId);
        if (Array.isArray(editTask.attachments) && editTask.attachments.length > 0) {
          console.log(editTask.attachments, "attachments");
          editTask.attachments.forEach((file) => {
              formData.append("attachments", file);
          });
      } else {
          formData.append("attachments", JSON.stringify([])); // Send empty array as a string
      }
  
      // Log FormData to debug
      console.log("Logging FormData:");
      for (let pair of formData.entries()) {
          console.log(pair[0], pair[1]);
      }
        await updateTask(editTask._id, formData);
        console.log(editTask.attachments,"editAttachemnts")
        console.log("Logging FormData:");
      for (let pair of formData.entries()) {
          console.log(pair[0], pair[1]);
      }
        
            await addNewAttachment(editTask._id, newFiles);
          
        
        setEditTask(null);
        setNewFiles([]);
    };
    const handleAttachmentChange = (e) => {
        const files = Array.from(e.target.files); // Convert FileList to an array
        const existingAttachments = editTask.attachments || []; // Ensure it's an array

        const newAtt = files.filter(
            (file) => !existingAttachments.some((att) => att.split("-")[1] === file.name) // Compare by file name
        );

        if (newAtt) {
            setNewFiles([...newFiles, ...newAtt]);
        }
    };
    const handleRemoveNewFile = (index) => {
        setNewFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    };
    const handleRemoveAttachment = (index) => {
        const updatedAttachments = editTask.attachments.filter((_, i) => i !== index);
        setEditTask({ ...editTask, attachments: updatedAttachments });
    };

    if (!editTask) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
                <div
                    className={`w-full p-2 mb-2 transition ${!isEditing ? " hover:bg-gray-200 rounded " : ""}`}
                    onClick={() => setIsEditing(true)}
                >
                    {isEditing ? (
                        <input
                            type="text"
                            name="title"
                            value={editTask.title}
                            onChange={handleEditChange}
                            className="w-full p-1 rounded focus:ring-0 focus:outline-none"
                            autoFocus
                            onBlur={() => setIsEditing(false)} // Exit edit mode on blur
                        />
                    ) : (
                        <h3 className="text-2xl font-bold">{editTask.title || "Task title..."}</h3>
                    )}
                </div>
                <label htmlFor="discription" className="text-sm font-semibold p-2">Description:</label>
                <textarea
                id="discription"
                    name="description"
                    value={editTask.description}
                    onChange={handleEditChange}
                    className="w-full px-2 rounded mb-2  focus:ring-0 focus:outline-gray-200 resize-none"
                    placeholder="Task description..."
                />
                <div className="">
                    <label htmlFor="dueDate" className="text-sm font-semibold p-2">Date:</label>
                    <input
                        type="date"
                        id="dueDate"
                        name="dueDate"
                        value={editTask.dueDate ? editTask.dueDate.split("T")[0] : ""}
                        onChange={handleEditChange}
                        className="w-1/3 px-2   rounded mb-2 focus:ring-0 focus:outline-none resize-none"
                    />
                </div>
                <div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        onChange={handleAttachmentChange}
                        className="hidden w-full p-2 mb-2 rounded"
                    />
                    <button onClick={handleButtonClick} className="bg-gray-200 px-3 py-1 mb-2 rounded">+</button>
                </div>

                {/* Existing Attachments */}
                <div className="mb-2">
                    {editTask.attachments && editTask.attachments.length > 0 && (
                        <div className="space-y-2  max-h-64 overflow-y-auto scroll-smooth hide-scrollbar">
                            {editTask.attachments.map((attachment, index) => (
                                <div key={index} className="flex  items-start relative    rounded-lg ">
                                    {attachment.match(/\.(jpeg|jpg|png|gif)$/i) ? (
                                        <a href={`${BASE_URL}/${attachment}`} download target="_blank">
                                            <img
                                                src={`${BASE_URL}/${attachment}`}
                                                alt={`Task Attachment ${index + 1}`}
                                                className=""
                                            />
                                        </a>
                                    ) : (
                                        <a
                                            href={`${BASE_URL}/${attachment}`}
                                            target="_blank"
                                            className="text-black hover:text-gray-500 no-underline h-20 flex justify-center items-center w-full "
                                        >
                                            📄 {attachment.split("-").pop()}
                                        </a>
                                    )}
                                    <button
                                        onClick={() => handleRemoveAttachment(index)}
                                        className=" absolute right-0 bottom-4 h-10 bg-gray-500 text-white p-2 w-8 text-xs rounded-tl-xl   rounded-bl-xl  hover:w-12 text-md  duration-300 ease-in-out"
                                    >
                                        🗑
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                {/* Preview for New Files */}
                <div className="mb-2">
                    {newFiles.length > 0 && (
                        <div className="space-y-2  gap-2  max-h-32 overflow-x-auto">
                            {newFiles.map((file, index) => (
                                <div
                                    key={index}
                                    className=" border rounded-lg relative w-full overflow-y-auto whitespace-nowrap flex items-center gap-2"
                                >
                                    {file.type.startsWith("image/") ? (
                                        <img
                                            src={URL.createObjectURL(file)}
                                            alt={`New File ${index + 1}`}
                                            className="w-20 h-20 object-cover rounded-lg"
                                        />
                                    ) : (
                                        <span className="text-black hover:text-gray-500 no-underline h-20 flex justify-center items-center w-full">
                                            📄 {file.name}
                                        </span>
                                    )}
                                    <button
                                        onClick={() => handleRemoveNewFile(index)}
                                        className=" absolute right-0 bottom-4 h-10 bg-gray-500 text-white p-2 w-8 text-xs rounded-tl-xl   rounded-bl-xl  hover:w-12 text-md  duration-300 ease-in-out"
                                    >
                                        🗑
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex justify-end gap-2 pt-2">
                    <button
                        onClick={() => setEditTask(null)}
                        className="bg-white border border-gray-300 transition duration-30 text-xs text-black px-4 py-2 hover:bg-gray-100 rounded"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSaveEdit}
                        className="bg-black border border-black text-white px-4 rounded text-xs hover:bg-white hover:text-black hover:border-gray-300
               transition duration-30 "
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DesktopEditModal;
