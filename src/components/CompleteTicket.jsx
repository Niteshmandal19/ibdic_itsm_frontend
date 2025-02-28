import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MessageCircle, Clock, History, Paperclip, Download, File, Image, Loader2, User } from 'lucide-react';
import axios from 'axios';
import CommentForm from './CommentForm';
import Comment from './Comment';
import AssigneeDropdown from './AssigneeDropdown';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

const CompleteTicket = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [currentUserOrg, setCurrentUserOrg] = useState(null);
  const [attachmentPreview, setAttachmentPreview] = useState(null);

  const API_BASE_URL = 'http://localhost:3000';

  const isImageFile = (filename) => {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
    const extension = filename?.split('.').pop()?.toLowerCase();
    return imageExtensions.includes(extension);
  };

  const fetchComments = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${API_BASE_URL}/api/tickets/comments/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComments(response.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleAddReply = async (commentId, content) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_BASE_URL}/api/tickets/comments/${commentId}/replies`,
        { content },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchComments(); // Refresh comments after adding reply
    } catch (error) {
      console.error('Error adding reply:', error);
      throw error;
    }
  };

  const handleEditReply = async (replyId, content) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${API_BASE_URL}/api/tickets/comment/${replyId}`,
        { content },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchComments(); // Refresh comments after editing reply
    } catch (error) {
      console.error('Error editing reply:', error);
      throw error;
    }
  };

  const handleDeleteReply = async (replyId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `${API_BASE_URL}/api/tickets/comment/${replyId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchComments(); // Refresh comments after deleting reply
    } catch (error) {
      console.error('Error deleting reply:', error);
      throw error;
    }
  };

  const fetchTicketData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      const userData = JSON.parse(localStorage.getItem('user'));
      setCurrentUserOrg(userData?.organization_id);

      // Fetch ticket details
      const ticketResponse = await axios.get(
        `${API_BASE_URL}/api/tickets/complete-incidents/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (ticketResponse.data.attachment && isImageFile(ticketResponse.data.attachmentOriginalName)) {
        const attachmentResponse = await axios.get(
          `${API_BASE_URL}/api/tickets/download-attachment/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            responseType: 'blob'
          }
        );
        const previewUrl = URL.createObjectURL(attachmentResponse.data);
        setAttachmentPreview(previewUrl);
      }

      setTicket(ticketResponse.data);
      
      // Fetch comments separately
      await fetchComments();
    } catch (error) {
      console.error('Error fetching data:', error);
      if (error.response?.status === 401) {
        navigate('/incidents');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    if (currentUserOrg !== 'IBDIC') {
      alert('You do not have permission to change the status.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${API_BASE_URL}/api/tickets/update-status/${id}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchTicketData();
    } catch (error) {
      console.error('Error updating status:', error);
      alert(error.response?.data?.message || 'Failed to update status');
    }
  };

  const handleEditComment = async (commentId, newContent) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:3000/api/tickets/comments/${commentId}`,
        { content: newContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchTicketData();
    } catch (error) {
      console.error('Error updating comment:', error);
      alert(error.response?.data?.message || 'Failed to update comment');
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3000/api/tickets/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchTicketData();
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert(error.response?.data?.message || 'Failed to delete comment');
    }
  };

  const handleDownloadAttachment = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `http://localhost:3000/api/tickets/download-attachment/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'blob'
        }
      );

      const blob = new Blob([response.data], {
        type: response.headers['content-type']
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = ticket.attachmentOriginalName || 'download';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading attachment:', error);
      alert('Failed to download attachment: ' + (error.response?.data?.message || error.message));
    }
  };

  useEffect(() => {
    fetchTicketData();
  }, [id]);

  useEffect(() => {
    return () => {
      if (attachmentPreview) {
        URL.revokeObjectURL(attachmentPreview);
      }
    };
  }, [attachmentPreview]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const getPriorityColor = (priority) => {
    const colors = {
      High: "bg-red-100 text-red-800",
      Medium: "bg-yellow-100 text-yellow-800",
      Low: "bg-green-100 text-green-800"
    };
    return colors[priority] || "bg-gray-100 text-gray-800";
  };

  const getStatusColor = (status) => {
    const colors = {
      'Open': 'bg-blue-100 text-blue-800',
      'In Progress': 'bg-purple-100 text-purple-800',
      'Resolved': 'bg-green-100 text-green-800',
      'Closed': 'bg-gray-100 text-gray-800',
      'On Hold': 'bg-yellow-100 text-yellow-800'
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <Card className="mb-8">
        <CardHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold">{ticket?.title}</CardTitle>
            {currentUserOrg === "IBDIC" ? (
              <Select
                value={ticket?.status}
                onValueChange={handleStatusChange}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {['Open', 'In Progress', 'Resolved', 'Closed', 'On Hold'].map(status => (
                    <SelectItem key={status} value={status}>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${getStatusColor(status)}`}>
                        {status}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Badge variant="outline" className={getStatusColor(ticket?.status)}>
                {ticket?.status}
              </Badge>
            )}
          </div>
          <p className="text-gray-600">{ticket?.description}</p>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-medium text-gray-900">Project Details</h3>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Project</span>
                    <span className="font-medium">{ticket?.project}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Issue Type</span>
                    <span className="font-medium">{ticket?.issueType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Priority</span>
                    <Badge variant="outline" className={getPriorityColor(ticket?.priority)}>
                      {ticket?.priority}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-medium text-gray-900">People</h3>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Created By</span>
                    <span className="font-medium">
                      {`${ticket?.creator?.first_name} ${ticket?.creator?.last_name}`}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Assigned To</span>
                    {currentUserOrg === "IBDIC" ? (
                      <AssigneeDropdown
                        ticketId={id}
                        currentAssignee={ticket?.assignedTo?.id}
                        onAssigneeUpdated={fetchTicketData}
                      />
                    ) : (
                      <span className="font-medium">
                        {ticket?.assignedTo ?
                          `${ticket.assignedTo.first_name} ${ticket.assignedTo.last_name}` :
                          'Unassigned'
                        }
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {ticket?.attachment && (
            <div className="mt-8 space-y-4">
              <h3 className="flex items-center gap-2 font-medium text-gray-900">
                <Paperclip className="h-4 w-4" />
                Attachment
              </h3>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {isImageFile(ticket.attachmentOriginalName) ? (
                        <Image className="h-6 w-6" />
                      ) : (
                        <File className="h-6 w-6" />
                      )}
                      <span className="font-medium">
                        {ticket.attachmentOriginalName || 'Attachment'}
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDownloadAttachment}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                  {isImageFile(ticket.attachmentOriginalName) && attachmentPreview && (
                    <div className="mt-4">
                      <img
                        src={attachmentPreview}
                        alt={ticket.attachmentOriginalName}
                        className="max-h-96 w-full rounded-lg object-contain"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            {/* <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="comments">
                <MessageCircle className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger value="history">
                <History className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger value="worklog">
                <Clock className="h-4 w-4" />
              </TabsTrigger>
            </TabsList> */}
            <TabsContent value="all" className="space-y-4">
              <CommentForm
                ticketId={id}
                onCommentAdded={fetchTicketData}
              />
              <div className="space-y-4">
                {comments.map((comment) => (
                  <Comment
                    key={comment.id}
                    // comment={comment}
                    // currentUserOrg={currentUserOrg}
                    // onEdit={handleEditComment}
                    // onDelete={handleDeleteComment}
                    comment={comment}
                    onEdit={handleEditComment}
                    onDelete={handleDeleteComment}
                    onAddReply={handleAddReply}
                    onEditReply={handleEditReply}
                    onDeleteReply={handleDeleteReply}
                    currentUserOrg={currentUserOrg}

                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompleteTicket;