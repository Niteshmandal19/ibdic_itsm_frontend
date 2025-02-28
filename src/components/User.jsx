import React, { useState, useEffect } from 'react';
import { X, ArrowLeft, Save, Pencil, Trash2 } from 'lucide-react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import './User.css';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

const parseJwt = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(window.atob(base64));
  } catch (e) {
    console.error('Error parsing token:', e);
    return null;
  }
};

const User = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);
  const [currentUserRole, setCurrentUserRole] = useState(null);
  const [currentUserOrgId, setCurrentUserOrgId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const { register, handleSubmit, reset, setValue, watch } = useForm({
    defaultValues: {
      first_name: '',
      last_name: '',
      mobile_no: '',
      status: '1',
      IS_SFTP_USER: '0',
      identifier_type: '',
      identifier: '',
    }
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const payload = parseJwt(token);
      setCurrentUserRole(payload?.role);
      setCurrentUserOrgId(payload?.organization_id);
    }
  }, []);

  const canEdit = (user) => {
    return currentUserRole === 'IBDIC_ADMIN' ||
      (currentUserRole === 'ORG_ADMIN' && currentUserOrgId === user?.organization_id) ||
      user?.id === userId;
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:3000/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(response.data);
        reset({
          first_name: response.data.first_name,
          last_name: response.data.last_name,
          mobile_no: response.data.mobile_no,
          status: String(response.data.status),
          IS_SFTP_USER: String(response.data.IS_SFTP_USER),
          identifier_type: response.data.identifier_type,
          identifier: response.data.identifier,
        });
      } catch (err) {
        setError('Failed to fetch user details');
      }
    };

    fetchUser();
  }, [userId, reset]);

  const onSubmit = async (data) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`http://localhost:3000/api/users/${userId}`, {
        ...data,
        status: +data.status,
        IS_SFTP_USER: +data.IS_SFTP_USER,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setUser(response.data);
      setIsEditing(false);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update user');
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3000/api/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      navigate('/user-management');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete user');
      setIsDeleting(false);
    }
  };

  // const handleStatusChange = async (newStatus) => {
  //   setValue('status', newStatus);
  //   try {
  //     const token = localStorage.getItem('token');
  //     const response = await axios.put(`http://localhost:3000/api/users/${userId}`, {
  //       ...user,
  //       status: +newStatus,
  //     }, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //         'Content-Type': 'application/json'
  //       }
  //     });
  //     setUser(response.data);
  //   } catch (err) {
  //     setError(err.response?.data?.message || 'Failed to update status');
  //   }
  // };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg text-gray-500">Loading user details...</div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => navigate('/user-management')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Users
        </Button>

        {canEdit(user) && !isEditing && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2"
            >
              <Pencil className="h-4 w-4" />
              Edit
            </Button>
            <Button
              variant="destructive"
              onClick={() => setShowDeleteDialog(true)}
              disabled={isDeleting}
              className="flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </div>
        )}
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader className="relative">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>User Details</CardTitle>
              <CardDescription>
                View and manage user information
              </CardDescription>
            </div>
            {canEdit(user) && (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">Status:</span>
                  {isEditing ? (
                    <Select
                      value={watch('status')}
                      onValueChange={(value) => setValue('status', value)}
                    >
                      <SelectTrigger className="w-[120px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Active</SelectItem>
                        <SelectItem value="0">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Badge
                      className={user.status === 1 ? "bg-green-500 text-white" : "bg-red-500 text-white"}
                    >
                      {user.status === 1 ? "Active" : "Inactive"}
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">SFTP User:</span>
                  {isEditing ? (
                    <Select
                      value={watch('IS_SFTP_USER')}
                      onValueChange={(value) => setValue('IS_SFTP_USER', value)}
                    >
                      <SelectTrigger className="w-[120px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Yes</SelectItem>
                        <SelectItem value="0">No</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Badge
                      className={user.IS_SFTP_USER === 1 ? "bg-blue-500 text-white" : "bg-gray-500 text-white"}
                    >
                      {user.IS_SFTP_USER === 1 ? "Yes" : "No"}
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-group">
                <label className="block text-sm font-medium mb-2">First Name</label>
                {isEditing ? (
                  <input
                    {...register('first_name')}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <div className="p-2 bg-gray-50 rounded-md">{user.first_name}</div>
                )}
              </div>

              <div className="form-group">
                <label className="block text-sm font-medium mb-2">Last Name</label>
                {isEditing ? (
                  <input
                    {...register('last_name')}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <div className="p-2 bg-gray-50 rounded-md">{user.last_name}</div>
                )}
              </div>

              <div className="form-group">
                <label className="block text-sm font-medium mb-2">Email</label>
                <div className="p-2 bg-gray-50 rounded-md">{user.email}</div>
              </div>

              <div className="form-group">
                <label className="block text-sm font-medium mb-2">Mobile</label>
                {isEditing ? (
                  <input
                    {...register('mobile_no')}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <div className="p-2 bg-gray-50 rounded-md">{user.mobile_no}</div>
                )}
              </div>

              <div className="form-group">
                <label className="block text-sm font-medium mb-2">Role</label>
                <div className="p-2 bg-gray-50 rounded-md">
                  <Badge variant="outline">{user.role}</Badge>
                </div>
              </div>

              <div className="form-group">
                <label className="block text-sm font-medium mb-2">Organization ID</label>
                <div className="p-2 bg-gray-50 rounded-md">{user.organization_id}</div>
              </div>

              <div className="form-group">
                <label className="block text-sm font-medium mb-2">Identifier Type</label>
                {isEditing ? (
                  <input
                    {...register('identifier_type')}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <div className="p-2 bg-gray-50 rounded-md">{user.identifier_type}</div>
                )}
              </div>

              <div className="form-group">
                <label className="block text-sm font-medium mb-2">Identifier</label>
                {isEditing ? (
                  <input
                    {...register('identifier')}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <div className="p-2 bg-gray-50 rounded-md">{user.identifier}</div>
                )}
              </div>
            </div>

            {isEditing && (
              <div className="flex justify-end gap-2 mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    reset();
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            )}
          </form>
        </CardContent>
      </Card>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete User'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default User;