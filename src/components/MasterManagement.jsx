import React, { useState, useEffect } from 'react';
import { Plus, Search, Trash2, MoreHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './MasterManagement.css';
import OrgMasterCreationForm from './OrgMasterCreationForm';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const MasterManagement = () => {
  const navigate = useNavigate();
  const [organizations, setOrganizations] = useState([]);
  const [isCreationModalOpen, setIsCreationModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrganizations = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('http://localhost:3000/api/organization/list');
      setOrganizations(response.data.organizations || []);
      setTotalPages(response.data.totalPages || 1);
      setTotalItems(response.data.total || 0);
    } catch (error) {
      console.error('Error fetching organizations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const handleDelete = async (event, orgId) => {
    event.stopPropagation();
    if (window.confirm('Are you sure you want to delete this organization?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.delete(
          `http://localhost:3000/api/organization/soft-delete/${orgId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (response.status === 200) {
          await fetchOrganizations();
        }
      } catch (error) {
        console.error('Error deleting organization:', error);
      }
    }
  };

  const filteredOrganizations = organizations.filter(org =>
    org?.org_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    org?.organization_id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOrganizationClick = (organizationId) => {
    navigate(`/complete-org/${organizationId}`);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-2xl font-bold">Organizations</CardTitle>
          <Button onClick={() => setIsCreationModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Organization
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 pb-4">
            <Search className="h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search organizations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Organization ID</TableHead>
                  <TableHead>Organization Name</TableHead>
                  <TableHead>Member Number</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : filteredOrganizations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      No organizations found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrganizations.map((org) => (
                    <TableRow
                      key={org.organization_id}
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => handleOrganizationClick(org.organization_id)}
                    >
                      <TableCell className="font-medium">{org.organization_id}</TableCell>
                      <TableCell>{org.org_name}</TableCell>
                      <TableCell>{org.member_no}</TableCell>
                      <TableCell>
                        <Badge
                          variant={org.status === 1 ? "success" : "secondary"}
                          className={
                            org.status === 1
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }
                        >
                          {org.status === 1 ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              className="h-8 w-8 p-0"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={(e) => handleDelete(e, org.organization_id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isCreationModalOpen} onOpenChange={setIsCreationModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Organization</DialogTitle>
          </DialogHeader>
          <OrgMasterCreationForm
            onClose={() => {
              setIsCreationModalOpen(false);
              fetchOrganizations();
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MasterManagement;