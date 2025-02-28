import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import SFTPUpload from './SFTPUpload';
import SFTPDownload from './SFTPDownload';

const SFTP = () => {
  return (
    <Card className="p-4 w-full max-w-4xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">File based Processing</h2>
      <Tabs defaultValue="upload" className="w-full">
        <TabsList>
          <TabsTrigger value="upload">UPLOAD</TabsTrigger>
          <TabsTrigger value="download">DOWNLOAD</TabsTrigger>
        </TabsList>
        <TabsContent value="upload">
          <SFTPUpload />
        </TabsContent>
        <TabsContent value="download">
          <SFTPDownload />
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default SFTP;