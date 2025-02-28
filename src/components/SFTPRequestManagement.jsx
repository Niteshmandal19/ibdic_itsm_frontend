import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import SFTPRequestForm from './SFTPRequestForm';

const SFTPRequestManagement = () => {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Request Management</h1>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
              <line x1="21" y1="4" x2="3" y2="4"></line>
              <line x1="21" y1="12" x2="3" y2="12"></line>
              <line x1="21" y1="20" x2="3" y2="20"></line>
            </svg>
          </Button>
          <Button variant="ghost" size="icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
              <rect x="3" y="3" width="7" height="7"></rect>
              <rect x="14" y="3" width="7" height="7"></rect>
              <rect x="14" y="14" width="7" height="7"></rect>
              <rect x="3" y="14" width="7" height="7"></rect>
            </svg>
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="default">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-2">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                New Request
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Create Request</DialogTitle>
              </DialogHeader>
              <SFTPRequestForm />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pending">
            Pending <span className="ml-2 text-sm text-gray-500">(0)</span>
          </TabsTrigger>
          <TabsTrigger value="approve">
            Approve <span className="ml-2 text-sm text-gray-500">(0)</span>
          </TabsTrigger>
          <TabsTrigger value="reject">
            Reject <span className="ml-2 text-sm text-gray-500">(0)</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          <Card>
            <CardContent className="pt-6 flex flex-col items-center text-gray-500 py-12">
              <Info className="h-8 w-8 mb-2" />
              <p>Tickets unavailable for selected filters.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="approve">
          <Card>
            <CardContent className="pt-6 flex flex-col items-center text-gray-500 py-12">
              <Info className="h-8 w-8 mb-2" />
              <p>Tickets unavailable for selected filters.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reject">
          <Card>
            <CardContent className="pt-6 flex flex-col items-center text-gray-500 py-12">
              <Info className="h-8 w-8 mb-2" />
              <p>Tickets unavailable for selected filters.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SFTPRequestManagement;