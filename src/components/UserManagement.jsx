import React, { useState, useEffect, useMemo } from 'react';
import { Search, Plus, Users, Filter } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './UserManagement.css';
import UserCreationForm from './UserCreationForm';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const ROLES = {
  IBDIC_ADMIN: 'IBDIC_ADMIN',
  IBDIC_USER: 'IBDIC_USER',
  ORG_ADMIN: 'ORG_ADMIN',
  ORG_USER: 'ORG_USER'
};

const ADMIN_ROLES = [ROLES.IBDIC_ADMIN, ROLES.ORG_ADMIN];

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

const UserManagement = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUserFormOpen, setIsUserFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('ALL');
  const [filterSFTP, setFilterSFTP] = useState(false);
  const [filterOrganization, setFilterOrganization] = useState('ALL');

  const getCurrentUserRole = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    const payload = parseJwt(token);
    return payload?.role;
  };

  const canCreateUsers = ADMIN_ROLES.includes(getCurrentUserRole());
  const canAccessUserDetails = ADMIN_ROLES.includes(getCurrentUserRole());

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };

        const [usersResponse, orgsResponse] = await Promise.all([
          axios.get('http://localhost:3000/api/users/getUserDetailByOrganization', { headers }),
          axios.get('http://localhost:3000/api/users/organizations', { headers })
        ]);

        setUsers(usersResponse.data);
        setOrganizations(orgsResponse.data.data || []);
        setError(null);
      } catch (err) {
        setError(err.message || 'Error fetching data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch =
        user.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRole = filterRole === 'ALL' || !filterRole || user.role === filterRole;
      const matchesOrganization = filterOrganization === 'ALL' || !filterOrganization || user.organization_id === filterOrganization;

      const matchesSFTP = filterSFTP !== '1' || user.IS_SFTP_USER === 1;

      return matchesSearch && matchesRole && matchesOrganization && matchesSFTP;
    });
  }, [users, searchTerm, filterRole, filterOrganization, filterSFTP]);

  const handleRowClick = (userId) => {
    if (canAccessUserDetails) {
      navigate(`/user-management/user/${userId}`);
    } else {
      setError('You do not have permission to view user details');
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleUserCreation = async (newUserData) => {
    if (!canCreateUsers) {
      setError('You do not have permission to create users');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:3000/api/users', newUserData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });

      setUsers(prev => [...prev, response.data]);
      setIsUserFormOpen(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create user');
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4 mb-4">
          {error}
        </div>
      )}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="text-2xl font-bold">Users</CardTitle>
            <CardDescription>
              Manage user account
            </CardDescription>
          </div>
          {canCreateUsers && (
            <Button onClick={() => setIsUserFormOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add User
            </Button>
          )}
        </CardHeader>

        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>

            <Select value={filterRole} onValueChange={setFilterRole}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Roles</SelectItem>
                {Object.values(ROLES).map(role => (
                  <SelectItem key={role} value={role}>{role}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterOrganization} onValueChange={setFilterOrganization}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Organizations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Organizations</SelectItem>
                {organizations.map(org => (
                  <SelectItem key={org.organization_id} value={org.organization_id}>
                    {org.organization_id}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              onClick={() => setFilterSFTP(prev => (prev === '1' ? '' : '1'))}
              className={filterSFTP === '1' ? 'bg-blue-500 text-white' : 'bg-transparent text-black border border-gray-400'}
            >
              {filterSFTP === '1' ? 'SFTP Users' : 'CLick to show SFTP Users'}
            </Button>

          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Organization</TableHead>
                  <TableHead>Tickets</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>

                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      Loading users...
                    </TableCell>
                  </TableRow>
                ) : filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      No users found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map(user => (
                    <TableRow
                      key={user.id}
                      className={`${canAccessUserDetails ? 'cursor-pointer hover:bg-gray-50' : 'cursor-not-allowed opacity-70'}`}
                      onClick={() => handleRowClick(user.id)}
                    >
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{`${user.first_name} ${user.last_name}`}</span>
                          <span className="text-sm text-gray-500">{user.mobile_no}</span>
                        </div>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{user.role}</Badge>
                      </TableCell>
                      <TableCell>{user.organization_id}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-sm">Assigned: {user.ticket_assigned}</span>
                          <span className="text-sm text-green-600">Resolved: {user.ticket_resolved}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <TableCell>
                          <Badge
                            variant={user.status === 1 ? "success" : "secondary"}
                            className={
                              user.status === 1
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }
                          >
                            {user.status === 1 ? "Active" : "Inactive"}
                          </Badge>

                        </TableCell>

                      </TableCell>
                      <TableCell>{new Date(user.date_created).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isUserFormOpen} onOpenChange={setIsUserFormOpen}>
        <DialogContent className="max-w-3xl w-[95vw] h-[90vh]">
          <DialogHeader>
            <DialogTitle>Create New User</DialogTitle>
          </DialogHeader>
          <div className="overflow-y-auto">
            <UserCreationForm
              onSubmit={handleUserCreation}
              onCancel={() => setIsUserFormOpen(false)}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement;