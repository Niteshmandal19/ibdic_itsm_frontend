import React, { useState, useEffect } from 'react';
import { UserPlus, Loader2, User } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const AssigneeDropdown = ({ ticketId, currentAssignee, onAssigneeUpdated, assigneeData }) => {
  const [assignees, setAssignees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [selectedAssignee, setSelectedAssignee] = useState(currentAssignee || '');

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  
  const fetchAssignees = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/users/assignee', {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch assignees');
      
      const data = await response.json();
      const formattedUsers = data.users?.map((user) => ({
        value: user.id,
        label: `${user.first_name} ${user.last_name}`,
        first_name: user.first_name,
        last_name: user.last_name
      })) || [];
      
      setAssignees(formattedUsers);
    } catch (error) {
      console.error('Error fetching assignees:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAssigneeChange = async (newAssigneeId) => {
    if (!newAssigneeId) return;
    
    setLoadingUpdate(true);
    setSelectedAssignee(newAssigneeId);
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `http://localhost:3000/api/tickets/update-assignee/${ticketId}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ assigneeId: newAssigneeId })
        }
      );

      if (!response.ok) throw new Error('Failed to update assignee');
      
      // Find the new assignee's full data
      const newAssignee = assignees.find(a => a.value === newAssigneeId);
      onAssigneeUpdated?.({
        id: newAssigneeId,
        first_name: newAssignee.first_name,
        last_name: newAssignee.last_name
      });
    } catch (error) {
      console.error('Error updating assignee:', error);
      setSelectedAssignee(currentAssignee);
    } finally {
      setLoadingUpdate(false);
    }
  };

  const handleAssignToMe = () => {
    handleAssigneeChange(currentUser.id);
  };

  useEffect(() => {
    fetchAssignees();
  }, []);

  useEffect(() => {
    setSelectedAssignee(currentAssignee);
  }, [currentAssignee]);

  const isAssignedToMe = selectedAssignee === currentUser.id;
  const selectedAssigneeName = assignees.find(a => a.value === selectedAssignee)?.label;

  return (
    <div className="space-y-3 max-w-sm">
      <div className="flex items-center gap-3">
        <Button
          variant={isAssignedToMe ? "secondary" : "outline"}
          className="flex-1 h-10 transition-all duration-200"
          onClick={handleAssignToMe}
          disabled={loading || loadingUpdate || isAssignedToMe}
        >
          {loadingUpdate ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <UserPlus className="mr-2 h-4 w-4" />
          )}
          {isAssignedToMe ? 'Assigned to me' : 'Assign to me'}
        </Button>

        {selectedAssigneeName && !loading && (
          <div className="px-3 py-1.5 bg-gray-100 rounded-md text-sm text-gray-600 flex items-center gap-2">
            <User className="h-4 w-4" />
            {selectedAssigneeName}
          </div>
        )}
      </div>

      <Select
        value={selectedAssignee}
        onValueChange={handleAssigneeChange}
        disabled={loading || loadingUpdate}
      >
        <SelectTrigger className="w-full h-10 bg-white">
          <SelectValue placeholder={
            loading ? (
              <div className="flex items-center text-gray-500">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading assignees...
              </div>
            ) : "Select an assignee"
          } />
        </SelectTrigger>
        <SelectContent>
          {assignees.map((assignee) => (
            <SelectItem 
              key={assignee.value} 
              value={assignee.value}
              className="cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-500" />
                {assignee.label}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {loadingUpdate && (
        <div className="flex items-center justify-center text-sm text-gray-500 py-1">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Updating assignee...
        </div>
      )}
    </div>
  );
};

export default AssigneeDropdown;