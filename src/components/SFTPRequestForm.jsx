// import React, { useState } from 'react';
// import { useEffect } from 'react';
// import { Input } from '@/components/ui/input';
// import { Button } from '@/components/ui/button';
// import { Textarea } from '@/components/ui/textarea';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';


// const SFTPRequestForm = () => {
    
//   return (
//     <form className="space-y-4">
//       <div className="grid grid-cols-2 gap-4">
//         <div className="space-y-2">
//           <label className="text-sm text-gray-600">Name</label>
//           <Input 
//             placeholder="Enter your name"
//             defaultValue="Delma Rodrigues"
//           />
//         </div>
//         <div className="space-y-2">
//           <label className="text-sm text-gray-600">Email</label>
//           <Input 
//             type="email"
//             placeholder="Enter your email"
//             defaultValue="delma.rodrigues@ibdic.in"
//           />
//         </div>
//       </div>
      
//       <div className="grid grid-cols-2 gap-4">
//         <div className="space-y-2">
//           <label className="text-sm text-gray-600">Request Type</label>
//           <Select defaultValue="create">
//             <SelectTrigger>
//               <SelectValue placeholder="Select request type" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="create">Create SFTP user</SelectItem>
//               <SelectItem value="modify">Modify SFTP user</SelectItem>
//               <SelectItem value="delete">Delete SFTP user</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>
//         <div className="space-y-2">
//           <label className="text-sm text-gray-600">Axis</label>
//           <Select>
//             <SelectTrigger>
//               <SelectValue placeholder="Select organization" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="axis1">Axis </SelectItem>
//               <SelectItem value="axis2">HDFC</SelectItem>
//               <SelectItem value="axis3">IBDIC</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>
//       </div>

//       <div className="space-y-2">
//         <label className="text-sm text-gray-600">Ticket Description</label>
//         <Textarea 
//           placeholder="Enter ticket description"
//           defaultValue="Give SFTP rights"
//           className="min-h-[100px]"
//         />
//       </div>

//       <div className="flex justify-end gap-4 pt-4">
//         <Button type="submit" className="bg-blue-500 hover:bg-blue-600">
//           Create
//         </Button>
//       </div>
//     </form>
//   );
// };

// export default SFTPRequestForm;



import React, { useState } from 'react';
import axios from 'axios';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

const SFTPRequestForm = () => {
  const [description, setDescription] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('description', description);

    try {
        const token = localStorage.getItem('token');
        const response = await axios.post('http://localhost:3000/api/tickets/create-ticket/sftp-request', formData, {
        headers: {
            Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        },
      });
      console.log('SFTP Request Submitted Successfully', response.data);
    } catch (error) {
      console.error('Request failed:', error);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <label className="text-sm text-gray-600">Ticket Description</label>
        <Textarea 
          placeholder="Enter ticket description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="min-h-[100px]"
        />
      </div>
      <div className="flex justify-end gap-4 pt-4">
        <Button type="submit" className="bg-blue-500 hover:bg-blue-600">
          Submit Request
        </Button>
      </div>
    </form>
  );
};

export default SFTPRequestForm;
