import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, XCircle, Upload, X } from 'lucide-react';
import axios from 'axios';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

const defaultOptions = {
  priorities: [
    { value: 'Urgent', label: '🔴 Urgent' },
    { value: 'High', label: '🟠 High' },
    { value: 'Medium', label: '🟡 Medium' },
    { value: 'Low', label: '🟢 Low' }
  ],
};

const CreateTicketModal = ({
  isOpen = false,
  onClose = () => { },
  options = defaultOptions,
  onSubmit = () => { },
  showSuccessMessage = false,
  currentUserId = null
}) => {
  const [formData, setFormData] = useState({
    project: '',
    issueType: '',
    requestType: '',
    title: '',
    description: '',
    assignee: '',
    priority: '',
    attachment: []
  });

  const [errors, setErrors] = useState({});
  const [fileErrors, setFileErrors] = useState([]);
  const [assignees, setAssignees] = useState([]);
  const [loadingAssignees, setLoadingAssignees] = useState(false);

  // New state for dropdowns
  const [projects, setProjects] = useState([]);
  const [issueTypes, setIssueTypes] = useState([]);
  const [requestTypes, setRequestTypes] = useState([]);
  const [loading, setLoading] = useState({
    projects: false,
    issueTypes: false,
    requestTypes: false
  });

  // Fetch projects on modal open
  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(prev => ({ ...prev, projects: true }));
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/api/index/products/projects', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const formattedProjects = response.data.map(product => ({
          value: product.product_code,
          label: `${product.product_name}`
        }));
        setProjects(formattedProjects);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(prev => ({ ...prev, projects: false }));
      }
    };

    if (isOpen) {
      fetchProjects();
    }
  }, [isOpen]);

  // Fetch issue types when project changes
  useEffect(() => {
    const fetchIssueTypes = async () => {
      if (!formData.project) {
        setIssueTypes([]);
        return;
      }

      setLoading(prev => ({ ...prev, issueTypes: true }));
      try {
        const response = await axios.get(`http://localhost:3000/api/index/projects/${formData.project}/issue-types`);
        const formattedIssueTypes = response.data.map(type => ({
          value: type.issue_type_id,
          label: type.issue_type
        }));
        setIssueTypes(formattedIssueTypes);
        // Clear the selected issue type and request type
        setFormData(prev => ({
          ...prev,
          issueType: '',
          requestType: ''
        }));
      } catch (error) {
        console.error('Error fetching issue types:', error);
      } finally {
        setLoading(prev => ({ ...prev, issueTypes: false }));
      }
    };

    fetchIssueTypes();
  }, [formData.project]);

  // Fetch request types when issue type changes
  useEffect(() => {
    const fetchRequestTypes = async () => {
      if (!formData.issueType) {
        setRequestTypes([]);
        return;
      }

      setLoading(prev => ({ ...prev, requestTypes: true }));
      try {
        const response = await axios.get(`http://localhost:3000/api/index/issue-types/${formData.issueType}/request-types`);
        const formattedRequestTypes = response.data.map(type => ({
          value: type.request_type_id,
          label: type.request_type
        }));
        setRequestTypes(formattedRequestTypes);
        // Clear the selected request type
        setFormData(prev => ({
          ...prev,
          requestType: ''
        }));
      } catch (error) {
        console.error('Error fetching request types:', error);
      } finally {
        setLoading(prev => ({ ...prev, requestTypes: false }));
      }
    };

    fetchRequestTypes();
  }, [formData.issueType]);

  // Fetch assignees on modal open (keeping existing assignee logic)
  useEffect(() => {
    const fetchUsers = async () => {
      setLoadingAssignees(true);
      try {
        const response = await axios.get('http://localhost:3000/api/users/assignee');
        const formattedUsers = response.data.users?.map((user) => ({
          value: user.id,
          label: `${user.first_name} ${user.last_name}`,
        })) || [];
        setAssignees(formattedUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoadingAssignees(false);
      }
    };

    if (isOpen) {
      fetchUsers();
    }
  }, [isOpen]);

  // Rest of the component remains the same...
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


  const validateForm = () => {
    const newErrors = {};
    const requiredFields = ['project', 'issueType', 'title', 'description', 'priority'];
    requiredFields.forEach(field => {
      if (!formData[field]) {
        newErrors[field] = 'This field is required';
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []); // Ensure files is always an array
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    const MAX_FILES = 5; // Maximum number of files allowed

    // Safely check the current attachments length
    const currentAttachments = formData.attachments || [];

    // Check if adding new files would exceed the limit
    if (currentAttachments.length + files.length > MAX_FILES) {
      setFileErrors(prev => [...prev, `Maximum ${MAX_FILES} files allowed`]);
      return;
    }

    const newFiles = files.map(file => {
      if (file.size > MAX_FILE_SIZE) {
        setFileErrors(prev => [...prev, `${file.name} exceeds 10MB limit`]);
        return null;
      }
      return {
        file,
        originalName: file.name,
        mimeType: file.type
      };
    }).filter(Boolean);

    setFormData(prev => ({
      ...prev,
      attachments: [...(prev.attachments || []), ...newFiles] // Safely spread existing attachments
    }));
  };

  const removeFile = (index) => {
    setFormData(prev => ({
      ...prev,
      attachments: (prev.attachments || []).filter((_, i) => i !== index)
    }));
    setFileErrors([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      const submissionData = new FormData();
      submissionData.append('attachableType', 'ticket');


      // Append all regular form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== '' && key !== 'attachments') {
          submissionData.append(key, value);
        }
      });

      // Safely append attachments
      const attachments = formData.attachments || [];
      attachments.forEach((attachment, index) => {
        if (attachment && attachment.file) {
          submissionData.append('attachments', attachment.file);
        }
      });

      if (currentUserId) {
        submissionData.append('created_by', currentUserId);
      }

      try {
        const response = await axios.post(
          'http://localhost:3000/api/tickets/create-ticket',
          submissionData,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        );
        onClose();
        onSubmit(response.data);
      } catch (error) {
        console.error('Ticket creation failed:', error);
      }
    }
  };



  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Create New Incident</DialogTitle>
          <DialogDescription>
            Fill out the details for your new service ticket
          </DialogDescription>
        </DialogHeader>

        {showSuccessMessage && (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-600">
              Ticket created successfully!
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Platform</Label>
              <Select
                value={formData.project}
                onValueChange={(value) => handleInputChange('project', value)}
                disabled={loading.projects}
              >
                <SelectTrigger className={errors.project ? 'border-red-500' : ''}>
                  <SelectValue placeholder={loading.projects ? 'Loading...' : 'Select Project'} />
                </SelectTrigger>
                <SelectContent>
                  {projects.map(project => (
                    <SelectItem key={project.value} value={project.value}>
                      {project.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.project && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" /> {errors.project}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Issue Type</Label>
              <Select
                value={formData.issueType}
                onValueChange={(value) => handleInputChange('issueType', value)}
                disabled={loading.issueTypes || !formData.project}
              >
                <SelectTrigger className={errors.issueType ? 'border-red-500' : ''}>
                  <SelectValue
                    placeholder={
                      !formData.project
                        ? 'Select Project First'
                        : loading.issueTypes
                          ? 'Loading...'
                          : 'Select Issue Type'
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {issueTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.issueType && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" /> {errors.issueType}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              placeholder="Incident Title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className={errors.title ? 'border-red-500' : ''}
            />
            {errors.title && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" /> {errors.title}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              placeholder="Detailed Description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className={`min-h-32 ${errors.description ? 'border-red-500' : ''}`}
            />
            {errors.description && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" /> {errors.description}
              </p>
            )}
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Request Type</Label>
              <Select
                value={formData.requestType}
                onValueChange={(value) => handleInputChange('requestType', value)}
                disabled={loading.requestTypes || !formData.issueType}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      !formData.issueType
                        ? 'Select Issue Type First'
                        : loading.requestTypes
                          ? 'Loading...'
                          : 'Select Request Type'
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {requestTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* <div className="space-y-2">
              <Label>Assignee</Label>
              <Select
                value={formData.assignee}
                onValueChange={(value) => handleInputChange('assignee', value)}
                disabled={loadingAssignees}
              >
                <SelectTrigger>
                  <SelectValue placeholder={loadingAssignees ? 'Loading...' : 'Select Assignee'} />
                </SelectTrigger>
                <SelectContent>
                  {assignees.map(assignee => (
                    <SelectItem key={assignee.value} value={assignee.value}>
                      {assignee.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div> */}

            <div className="space-y-2">
              <Label>Priority</Label>
              <Select
                value={formData.priority}
                onValueChange={(value) => handleInputChange('priority', value)}
              >
                <SelectTrigger className={errors.priority ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select Priority" />
                </SelectTrigger>
                <SelectContent>
                  {options.priorities.map(priority => (
                    <SelectItem key={priority.value} value={priority.value}>
                      {priority.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.priority && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" /> {errors.priority}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Attachments (Max 5 files, 10MB each)</Label>
            <div className="flex flex-col space-y-2">
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-2 text-gray-500" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">
                      Upload up to 5 files (JPEG, PNG, PDF)
                    </p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                    multiple
                    accept=".jpg,.jpeg,.png,.pdf"
                  />
                </label>
              </div>

              {/* File list - with safe check for attachments */}
              {formData.attachments && formData.attachments.length > 0 && (
                <div className="space-y-2">
                  {formData.attachments.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm truncate">{file.originalName}</span>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Error messages */}
              {fileErrors.map((error, index) => (
                <p key={index} className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" /> {error}
                </p>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex items-center gap-2"
            >
              <XCircle className="h-4 w-4" />
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
            >
              <CheckCircle className="h-4 w-4" />
              Create Ticket
            </Button>
          </div>

        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTicketModal;
