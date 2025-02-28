import React from "react";
import { useState } from "react";

const CommentReply = ({ reply, onEdit, onDelete, currentUserOrg }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(reply.content);
  
    const handleSave = async () => {
      try {
        await onEdit(reply.id, editedContent);
        setIsEditing(false);
      } catch (error) {
        console.error('Error saving reply:', error);
      }
    };
  
    return (
      <div className="ml-8 mt-2 p-3 bg-gray-50 rounded-lg">
        <div className="flex justify-between items-start">
          <div>
            <span className="font-medium">{reply.user?.first_name} {reply.user?.last_name}</span>
            <span className="text-sm text-gray-500 ml-2">
              {new Date(reply.created_at).toLocaleString()}
            </span>
          </div>
          {(currentUserOrg === 'IBDIC' || reply.user_id === localStorage.getItem('userId')) && (
            <div className="flex gap-2">
              <button
                onClick={() => setIsEditing(true)}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(reply.id)}
                className="text-sm text-red-600 hover:text-red-900"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
        {isEditing ? (
          <div className="mt-2">
            <textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="w-full p-2 border rounded"
            />
            <div className="mt-2 flex gap-2">
              <button
                onClick={handleSave}
                className="px-3 py-1 text-sm bg-primary text-white rounded"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditedContent(reply.content);
                }}
                className="px-3 py-1 text-sm bg-gray-200 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <p className="mt-1 text-gray-700">{reply.content}</p>
        )}
      </div>
    );
  };

  export default CommentReply;
  