import React from 'react';
import { 
  AlertTriangle, 
  Clock, 
  User, 
  Briefcase, 
  Tag, 
  CheckCircle, 
  Calendar, 
  MessageSquare,
  X 
} from 'lucide-react';
import AssigneeDropdown from './AssigneeDropdown';

const IncidentDetails = ({ incident, onClose, onAssigneeUpdated }) => {
  if (!incident) return null;

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'Urgent': return <AlertTriangle className="text-red-500 w-6 h-6" />;
      case 'High': return <AlertTriangle className="text-orange-500 w-6 h-6" />;
      case 'Medium': return <Clock className="text-yellow-500 w-6 h-6" />;
      default: return <CheckCircle className="text-green-500 w-6 h-6" />;
    }
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'Urgent': return 'bg-red-100 text-red-600';
      case 'High': return 'bg-orange-100 text-orange-600';
      case 'Medium': return 'bg-yellow-100 text-yellow-600';
      default: return 'bg-green-100 text-green-600';
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Open': return 'bg-red-100 text-red-600';
      case 'In Progress': return 'bg-yellow-100 text-yellow-600';
      case 'Resolved': return 'bg-blue-100 text-blue-600';
      default: return 'bg-green-100 text-green-600';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl w-full">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{incident.title}</h2>
          <p className="text-sm text-gray-500">Incident #{incident.id}</p>
        </div>
        <button 
          onClick={onClose} 
          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-6 h-6 text-gray-500" />
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <Briefcase className="w-5 h-5 text-gray-400" />
            <span className="font-medium text-gray-600">Project:</span>
            <span className="text-gray-900">{incident.project}</span>
          </div>
          <div className="flex items-center space-x-3">
            <Tag className="w-5 h-5 text-gray-400" />
            <span className="font-medium text-gray-600">Issue Type:</span>
            <span className="text-gray-900">{incident.issueType}</span>
          </div>
          <div className="flex items-center space-x-3">
        <User className="w-5 h-5 text-gray-400" />
        <span className="font-medium text-gray-600">Assignee:</span>
        <span className="text-gray-900">
          {incident.assignedTo ? 
            `${incident.assignedTo.first_name} ${incident.assignedTo.last_name}` : 
            'Unassigned'
          }
        </span>
      </div>

        </div>
            
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            {getPriorityIcon(incident.priority)}
            <span className="font-medium text-gray-600">Priority:</span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityClass(incident.priority)}`}>
              {incident.priority}
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-5 h-5 text-gray-400" />
            <span className="font-medium text-gray-600">Status:</span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusClass(incident.status)}`}>
              {incident.status}
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <Calendar className="w-5 h-5 text-gray-400" />
            <span className="font-medium text-gray-600">Created:</span>
            <span className="text-gray-900">{incident.createdAt}</span>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="border-t pt-6">
          <div className="flex items-center space-x-2 mb-3">
            <MessageSquare className="w-5 h-5 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900">Description</h3>
          </div>
          <p className="text-gray-700 whitespace-pre-wrap">
            {incident.description || 'No description provided.'}
          </p>
        </div>

        {incident.comments && incident.comments.length > 0 && (
          <div className="border-t pt-6">
            <div className="flex items-center space-x-2 mb-4">
              <MessageSquare className="w-5 h-5 text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900">
                Comments ({incident.comments.length})
              </h3>
            </div>
            <div className="space-y-4">
              {incident.comments.map((comment, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-gray-900">{comment.author}</span>
                    <span className="text-sm text-gray-500">{comment.timestamp}</span>
                  </div>
                  <p className="text-gray-700">{comment.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="border-t pt-6">
          <div className="flex items-center space-x-2 mb-4">
            <User className="w-5 h-5 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900">Choose Assignee</h3>
          </div>
          <div className="bg-gray-50 rounded-lg p-6">
            <AssigneeDropdown 
              ticketId={incident.id}
              currentAssignee={incident.assignedTo?.id}
              onAssigneeUpdated={onAssigneeUpdated}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncidentDetails;