import React, { useState, useRef } from 'react';
import { Paperclip, X, File as FileIcon } from 'lucide-react';
import axios from 'axios';
import './CommentForm.css';

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/plain'
];

const defaultFormData = {
  content: '',
  type: 'open',
  attachments: []
};

const CommentForm = ({ ticketId, onCommentAdded, disabled = false }) => {
  const [formData, setFormData] = useState(defaultFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fileErrors, setFileErrors] = useState([]);
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

  const handleInputChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    const MAX_FILES = 5;

    const newFileErrors = [];
    const validFiles = files.filter((file, index) => {
      if (formData.attachments.length + index >= MAX_FILES) {
        newFileErrors.push(`Maximum ${MAX_FILES} files allowed`);
        return false;
      }

      if (file.size > MAX_FILE_SIZE) {
        newFileErrors.push(`${file.name} exceeds 10MB limit`);
        return false;
      }

      if (!ALLOWED_MIME_TYPES.includes(file.type)) {
        newFileErrors.push(`${file.name} has an unsupported file type`);
        return false;
      }

      return true;
    });

    setFormData(prev => ({
      ...prev,
      attachments: [
        ...prev.attachments,
        ...validFiles.map(file => ({
          file,
          originalName: file.name,
          mimeType: file.type
        }))
      ]
    }));

    setFileErrors(newFileErrors);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = (indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, index) => index !== indexToRemove)
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.type || !['open', 'internal'].includes(formData.type)) {
      newErrors.type = 'Comment type is required';
    }

    if (formData.attachments.length === 0 && (!formData.content || formData.content.trim().length === 0)) {
      newErrors.content = 'Comment or attachment is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const submissionData = new FormData();
    
    if (formData.content?.trim()) {
      submissionData.append('content', formData.content.trim());
    }
    
    submissionData.append('type', formData.type);
    submissionData.append('attachableType', 'comment');
    
    formData.attachments.forEach((attachment) => {
      submissionData.append('attachments', attachment.file);
    });

    setIsSubmitting(true);
    
    try {
      const response = await axios.post(
        `http://localhost:3000/api/tickets/create-comments/${ticketId}`,
        submissionData,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      setFormData(defaultFormData);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      if (onCommentAdded) {
        onCommentAdded(response.data);
      }
    } catch (error) {
      console.error('Comment creation failed:', error.response?.data || error.message);
      alert(error.response?.data?.message || 'Failed to create comment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="comment-form">
      <div className="comment-type-buttons">
        <button
          type="button"
          onClick={() => handleInputChange('type', 'internal')}
          className={`type-button ${formData.type === 'internal' ? 'internal-active' : ''}`}
          disabled={disabled}
        >
          Internal Note
        </button>
        <button
          type="button"
          onClick={() => handleInputChange('type', 'open')}
          className={`type-button ${formData.type === 'open' ? 'open-active' : ''}`}
          disabled={disabled}
        >
          Open Comment
        </button>
      </div>

      <form onSubmit={handleSubmit} className="comment-form-content">
        <div className="form-group">
          <textarea
            value={formData.content}
            onChange={(e) => handleInputChange('content', e.target.value)}
            className={`comment-textarea ${errors.content ? 'error' : ''}`}
            placeholder="Add a comment... (Press M to focus)"
            rows="3"
            disabled={disabled}
          />
          {errors.content && <span className="error-message">{errors.content}</span>}
        </div>

        <div className="form-actions">
          <div className="file-attachments">
            {formData.attachments.map((attachment, index) => (
              <div key={index} className="selected-file">
                <FileIcon className="file-icon" />
                <span className="file-name">{attachment.originalName}</span>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="remove-file-button"
                  disabled={disabled}
                >
                  <X />
                </button>
              </div>
            ))}

            {formData.attachments.length < 5 && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="attach-button"
                disabled={disabled}
              >
                <Paperclip />
                <span>Attach File</span>
              </button>
            )}
          </div>
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden-file-input"
            multiple
            disabled={disabled}
          />
          
          {fileErrors.map((error, index) => (
            <div key={index} className="error-message">{error}</div>
          ))}
          {errors.type && <div className="error-message">{errors.type}</div>}

          <button
            type="submit"
            disabled={isSubmitting || disabled}
            className={`submit-button ${isSubmitting ? 'submitting' : ''}`}
          >
            {isSubmitting ? 'Adding...' : 'Add Comment'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CommentForm;