import React, { useState } from 'react';
import { MessageCircle, File, Download, Edit2, Trash2, History, FileText, UserPlus, ChevronUp, MessageSquare, ChevronDown } from 'lucide-react';
import './Comment.css';


const CommentReply = ({ 
  reply, 
  onEditReply, 
  onDeleteReply, 
  currentUserOrg 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(reply.content);
  const [error, setError] = useState('');

  const handleSave = async () => {
    try {
      if (!editedContent?.trim()) {
        setError('Reply content cannot be empty');
        return;
      }
      await onEditReply(reply.id, editedContent);
      setIsEditing(false);
      setError('');
    } catch (err) {
      setError('Failed to update reply');
    }
  };

  return (
    <div className="ml-12 mt-2 p-3 bg-gray-50 rounded-lg border-l-2 border-gray-200">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2">
          <div className="flex-shrink-0">
            <div className="p-1.5 rounded-full bg-gray-200">
              <MessageSquare className="w-4 h-4 text-gray-600" />
            </div>
          </div>
          <div>
            <span className="font-medium text-sm">
              {reply.user?.first_name} {reply.user?.last_name}
            </span>
            <span className="text-xs text-gray-500 ml-2">
              {new Date(reply.created_at).toLocaleString()}
            </span>
          </div>
        </div>
        
        {(currentUserOrg === 'IBDIC' || reply.user_id === localStorage.getItem('userId')) && (
          <div className="flex gap-2">
            {!isEditing && (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <Edit2 className="w-3.5 h-3.5 text-gray-500" />
                </button>
                <button
                  onClick={() => onDeleteReply(reply.id)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <Trash2 className="w-3.5 h-3.5 text-red-500" />
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {isEditing ? (
        <div className="mt-2 space-y-2">
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="w-full p-2 text-sm border rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary"
            rows="2"
          />
          {error && (
            <div className="text-xs text-red-600">
              {error}
            </div>
          )}
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="px-2 py-1 text-xs font-medium text-white bg-primary rounded-md hover:bg-primary/90"
            >
              Save
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setEditedContent(reply.content);
                setError('');
              }}
              className="px-2 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <p className="mt-1 text-sm text-gray-700">{reply.content}</p>
      )}
    </div>
  );
};



const Comment = ({
  comment,
  onEdit,
  onDelete,
  onAddReply,
  onEditReply,
  onDeleteReply,
  currentUserOrg


}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const [error, setError] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [showReplies, setShowReplies] = useState(true);
  const [replyError, setReplyError] = useState('');




  const API_BASE_URL = 'http://localhost:3000';

  const handleReplySubmit = async () => {
    try {
      if (!replyContent?.trim()) {
        setReplyError('Reply content cannot be empty');
        return;
      }
      await onAddReply(comment.id, replyContent.trim());
      setReplyContent('');
      setIsReplying(false);
      setReplyError('');
    } catch (err) {
      setReplyError('Failed to add reply');
    }
  };




  const handleSave = async () => {
    try {
      if (!editedContent?.trim()) {
        setError('Comment content cannot be empty');
        return;
      }

      await onEdit(comment.id, editedContent);
      setIsEditing(false);
      setError('');
    } catch (err) {
      setError('Failed to update comment. Please try again.');
    }
  };

  const getStatusChangeStyles = (oldStatus, newStatus) => {
    const statusColors = {
      'Open': { bg: 'bg-blue-50', text: 'text-blue-700', icon: '🔵' },
      'In Progress': { bg: 'bg-purple-50', text: 'text-purple-700', icon: '⏳' },
      'Resolved': { bg: 'bg-green-50', text: 'text-green-700', icon: '✅' },
      'Closed': { bg: 'bg-gray-50', text: 'text-gray-700', icon: '🔒' },
      'On Hold': { bg: 'bg-yellow-50', text: 'text-yellow-700', icon: '⏸️' }
    };

    return {
      old: statusColors[oldStatus] || statusColors['Open'],
      new: statusColors[newStatus] || statusColors['Open']
    };
  };

  const renderStatusChange = () => {
    if (comment.type !== 'status_change' || !comment.content) return null;

    try {
      const { oldStatus, newStatus } = JSON.parse(comment.content);
      const styles = getStatusChangeStyles(oldStatus, newStatus);

      return (
        <div className="status-change-content">
          <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-50">
            <span className={`px-2 py-1 rounded-md ${styles.old.bg} ${styles.old.text} text-sm font-medium`}>
              {styles.old.icon} {oldStatus}
            </span>
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
            <span className={`px-2 py-1 rounded-md ${styles.new.bg} ${styles.new.text} text-sm font-medium`}>
              {styles.new.icon} {newStatus}
            </span>
          </div>
          <div className="mt-2 text-sm text-gray-500">
            Status updated by {comment.user?.first_name} {comment.user?.last_name}
          </div>
        </div>
      );
    } catch (e) {
      return <p className="comment-text">{comment.content}</p>;
    }
  };

  const renderAssigneeChange = () => {
    if (comment.type !== 'assignee_change' || !comment.content) return null;

    try {
      const { oldAssignee, newAssignee } = JSON.parse(comment.content);

      return (
        <div className="assignee-change-content">
          <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-50">
            <span className="px-2 py-1 rounded-md bg-gray-100 text-gray-700 text-sm font-medium">
              👤 {oldAssignee || 'Unassigned'}
            </span>
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
            <span className="px-2 py-1 rounded-md bg-blue-50 text-blue-700 text-sm font-medium">
              👤 {newAssignee}
            </span>
          </div>
          <div className="mt-2 text-sm text-gray-500">
            Assignee updated by {comment.user?.first_name} {comment.user?.last_name}
          </div>
        </div>
      );
    } catch (e) {
      return <p className="comment-text">{comment.content}</p>;
    }
  };


  const handleDownload = async () => {
    if (isDownloading) return;

    try {
      setIsDownloading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/tickets/comments/${comment.id}/attachment`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(
          response.status === 404 ? 'Attachment not found' :
            response.status === 403 ? 'Access denied' :
              'Failed to download attachment'
        );
      }

      const contentDisposition = response.headers.get('Content-Disposition');
      const filenameMatch = contentDisposition && contentDisposition.match(/filename="(.+)"/);
      const filename = filenameMatch ? filenameMatch[1] : comment.attachmentOriginalName;

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = decodeURIComponent(filename);

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 100);
    } catch (error) {
      console.error('Error downloading attachment:', error);
      setError(`Failed to download attachment: ${error.message}`);
    } finally {
      setIsDownloading(false);
    }
  };

  const renderAttachmentPreview = () => {
    if (!comment.attachment) return null;

    const attachmentUrl = `${API_BASE_URL}/api/tickets/comments/${comment.id}/attachment`;
    const fileExtension = comment.attachmentOriginalName?.split('.').pop()?.toLowerCase();
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
    const isPdf = fileExtension === 'pdf';
    const isImage = imageExtensions.includes(fileExtension);

    if (isImage) {
      return (
        <img
          src={attachmentUrl}
          alt={comment.attachmentOriginalName}
          className="max-h-48 w-auto rounded-lg object-cover shadow-sm cursor-pointer"
          crossOrigin="anonymous"
          onClick={() => window.open(attachmentUrl, '_blank')}
        />
      );
    }

    if (isPdf) {
      return (
        <div
          className="pdf-preview flex items-center gap-2 p-2 bg-gray-50 rounded-lg cursor-pointer"
          onClick={() => window.open(attachmentUrl, '_blank')}
        >
          <FileText className="w-6 h-6 text-red-500" />
          <span className="text-sm text-gray-700">Preview PDF</span>
        </div>
      );
    }

    return null;
  };

  return (
    <div className={`comment ${comment.type === 'internal' ? 'bg-yellow-50 border-l-4 border-yellow-400' :
      comment.type === 'status_change' ? 'bg-gray-50 border-l-4 border-gray-400' :
        comment.type === 'assignee_change' ? 'bg-blue-50 border-l-4 border-blue-400' :
          'bg-white border-l-4 border-transparent'
      } rounded-lg shadow-sm mb-4 transition-all duration-200`}>
      <div className="flex gap-4 p-4">
        <div className="flex-shrink-0">
          {comment.type === 'status_change' ? (
            <div className="p-2 rounded-full bg-gray-200">
              <History className="w-5 h-5 text-gray-600" />
            </div>
          ) : comment.type === 'assignee_change' ? (
            <div className="p-2 rounded-full bg-blue-200">
              <UserPlus className="w-5 h-5 text-blue-600" />
            </div>
          ) : (
            <div className="p-2 rounded-full bg-primary/10">
              <MessageCircle className="w-5 h-5 text-primary" />
            </div>
          )}
        </div>

        <div className="flex-grow">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <h4 className="font-medium text-gray-900">
                {comment.user?.first_name} {comment.user?.last_name}
              </h4>
              <span className="text-sm text-gray-500">
                {new Date(comment.created_at).toLocaleString()}
              </span>
            </div>

            {comment.type === 'internal' && (
              <span className="px-2 py-1 text-xs font-medium text-yellow-800 bg-yellow-100 rounded-full">
                Internal Note
              </span>
            )}
          </div>

          {isEditing ? (
            <div className="space-y-3">
              <textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary"
                rows="3"
              />
              {error && (
                <div className="text-sm text-red-600">
                  {error}
                </div>
              )}
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  className="px-3 py-1.5 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90 transition-colors"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditedContent(comment.content);
                    setError('');
                  }}
                  className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            comment.type === 'status_change' ? renderStatusChange() :
              comment.type === 'assignee_change' ? renderAssigneeChange() :
                <p className="text-gray-700 whitespace-pre-wrap">{comment.content}</p>
          )}

          {comment.attachment && (
            <div className="mt-3 space-y-2">
              {renderAttachmentPreview()}
              <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <File className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-700">{comment.attachmentOriginalName}</span>
                </div>
                <button
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className="flex items-center gap-1 px-2 py-1 text-sm font-medium text-gray-700 bg-white rounded-md hover:bg-gray-100 disabled:opacity-50 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>{isDownloading ? 'Downloading...' : 'Download'}</span>
                </button>
              </div>
              {error && (
                <div className="text-sm text-red-600">
                  {error}
                </div>
              )}
            </div>
          )}

          {(currentUserOrg === 'IBDIC' || comment.user_id === localStorage.getItem('userId')) && (
            <div className="flex gap-2 mt-3">
              {!isEditing &&
                comment.type !== 'status_change' &&
                comment.type !== 'assignee_change' && (
                  <>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-1 px-2 py-1 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => onDelete(comment.id)}
                      className="flex items-center gap-1 px-2 py-1 text-sm font-medium text-red-700 bg-red-100 rounded-md hover:bg-red-200 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete</span>
                    </button>
                  </>
                )}
            </div>
          )}
        </div>
      </div>
      {comment.type !== 'status_change' && 
       comment.type !== 'assignee_change' && (
        <div className="mt-3 border-t pt-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsReplying(!isReplying)}
              className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-md"
            >
              <MessageCircle className="w-4 h-4" />
              Reply
            </button>
            
            {comment.replies?.length > 0 && (
              <button
                onClick={() => setShowReplies(!showReplies)}
                className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-md"
              >
                {showReplies ? (
                  <>
                    <ChevronUp className="w-4 h-4" />
                    Hide Replies
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4" />
                    Show Replies ({comment.replies.length})
                  </>
                )}
              </button>
            )}
          </div>

          {isReplying && (
            <div className="mt-2 space-y-2">
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Write a reply..."
                className="w-full p-2 text-sm border rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary"
                rows="2"
              />
              {replyError && (
                <div className="text-xs text-red-600">
                  {replyError}
                </div>
              )}
              <div className="flex gap-2">
                <button
                  onClick={handleReplySubmit}
                  className="px-3 py-1.5 text-xs font-medium text-white bg-primary rounded-md hover:bg-primary/90"
                >
                  Submit Reply
                </button>
                <button
                  onClick={() => {
                    setIsReplying(false);
                    setReplyContent('');
                    setReplyError('');
                  }}
                  className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Display replies */}
          {showReplies && comment.replies?.length > 0 && (
            <div className="mt-2 space-y-2">
              {comment.replies.map(reply => (
                <CommentReply
                  key={reply.id}
                  reply={reply}
                  onEditReply={onEditReply}
                  onDeleteReply={onDeleteReply}
                  currentUserOrg={currentUserOrg}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Comment;

