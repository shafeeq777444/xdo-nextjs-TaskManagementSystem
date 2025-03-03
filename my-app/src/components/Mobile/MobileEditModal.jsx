import { useTasks } from "@/context/TaskContext";
import React, { useRef, useState } from "react";

const MobileEditModal = ({ editTask, setEditTask }) => {
    const [newFiles, setNewFiles] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const fileInputRef = useRef(null);
    const { updateTask, addNewAttachment } = useTasks();
    const BASE_URL = process.env.NEXT_PUBLIC_BACKENDURL;
;

    const handleButtonClick = () => fileInputRef.current.click();

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

    const handleRemoveNewFile = (index) => setNewFiles(newFiles.filter((_, i) => i !== index));

    const handleRemoveAttachment = (index) => {
        const updatedAttachments = editTask.attachments.filter((_, i) => i !== index);
        setEditTask({ ...editTask, attachments: updatedAttachments });
    };

    if (!editTask) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 h-full">
            <div className="bg-white  p-4 rounded-lg shadow-lg w-full max-w-lg md:w-1/3">
                <div className="w-full p-2 mb-2" onClick={() => setIsEditing(true)}>
                    {isEditing ? (
                        <input
                            type="text"
                            name="title"
                            value={editTask.title}
                            onChange={handleEditChange}
                            className="w-full p-2 rounded focus:ring-0 focus:outline-none"
                            autoFocus
                            onBlur={() => setIsEditing(false)}
                        />
                    ) : (
                        <h3 className="text-xl font-bold break-words">{editTask.title || "Task title..."}</h3>
                    )}
                </div>
                <label htmlFor="discription" className="text-sm font-semibold p-2">Description:</label>
                <textarea
                    name="description"
                    value={editTask.description}
                    onChange={handleEditChange}
                    className="w-full p-2 rounded mb-2 focus:ring-0 focus:outline-gray-200 resize-none"
                    placeholder="Task description..."
                />
                <label htmlFor="dueDate" className="text-sm font-semibold p-2">Date:</label>
                <input
                    type="date"
                    name="dueDate"
                    value={editTask.dueDate ? editTask.dueDate.split("T")[0] : ""}
                    onChange={handleEditChange}
                    className="w-full p-2 rounded mb-2 focus:ring-0 focus:outline-gray-200 "
                />
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    onChange={handleAttachmentChange}
                    className="hidden"
                />
                <button onClick={handleButtonClick} className="bg-gray-200 px-3 py-1 mb-2 rounded">+</button>
                <div className="mt-2 max-h-40 overflow-y-auto">
                    {editTask.attachments?.map((attachment, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-100 p-2 rounded mb-1">
                            <a href={`${BASE_URL}/${attachment}`} target="_blank" className="truncate">
                                {attachment.split("-").pop()}
                            </a>
                            <button onClick={() => handleRemoveAttachment(index)} className="text-red-500">🗑</button>
                        </div>
                    ))}
                </div>
                <div className="mt-2 max-h-40 overflow-y-auto">
                    {newFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-200 p-2 rounded mb-1">
                            <span className="truncate">{file.name}</span>
                            <button onClick={() => handleRemoveNewFile(index)} className="text-red-500">🗑</button>
                        </div>
                    ))}
                </div>
                <div className="flex justify-end gap-2 pt-2">
                    <button onClick={() => setEditTask(null)} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
                    <button onClick={handleSaveEdit} className="bg-black text-white px-4 py-2 rounded">Save</button>
                </div>
            </div>
        </div>
    );
};

export default MobileEditModal;
