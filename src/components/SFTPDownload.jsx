// import React, { useState } from 'react';
// import { Download, Eye } from 'lucide-react';

// const SFTPDownload = () => {
//   const [downloadStatus, setDownloadStatus] = useState('input');
//   const [selectedSupport, setSelectedSupport] = useState('Support123');
  
//   // Sample data for the table
//   const [fileData] = useState([{
//     fileName: 'uat%test0611%invoice_reg_without_entity_code_finance%Support123-user-20240807115750%169%invoice_reg_without_entity_code_finance%071124%094340%3%0%2.csv',
//     status: 'output',
//     uploadedBy: 'IBDIC Support Team',
//     uploadedAt: '07 Nov 09:44:00 AM'
//   }]);

//   const handleDownload = () => {
//     setDownloadStatus('output');
//     setTimeout(() => {
//       setDownloadStatus('delivered');
//     }, 2000);
//   };

//   return (
//     <div className="p-6 space-y-6">

//       <div className="flex gap-4 border-b">
//         <button 
//           className={`px-8 py-2 ${downloadStatus === 'input' ? 'text-blue-500 border-b-2 border-blue-500' : ''}`}
//           onClick={() => setDownloadStatus('input')}
//         >
//           Input
//         </button>
//         <button 
//           className={`px-8 py-2 ${downloadStatus === 'output' ? 'text-blue-500 border-b-2 border-blue-500' : ''}`}
//           onClick={() => setDownloadStatus('output')}
//         >
//           Output
//         </button>
//         <button 
//           className={`px-8 py-2 ${downloadStatus === 'delivered' ? 'text-blue-500 border-b-2 border-blue-500' : ''}`}
//           onClick={() => setDownloadStatus('delivered')}
//         >
//           Delivered
//         </button>
//       </div>

//       <div className="flex items-center gap-4">
//         <select 
//           value={selectedSupport}
//           onChange={(e) => setSelectedSupport(e.target.value)}
//           className="border rounded p-2"
//         >
//           <option value="Support123">Support123</option>
//           <option value="Support124">Support124</option>
//         </select>
        
//         <div className="flex items-center gap-2 text-gray-600">
//           <span>01-11-2024</span>
//           <span>-</span>
//           <span>07-11-2024</span>
//         </div>
//       </div>

//       <div className="mt-4">
//         <h3 className="text-blue-500 mb-4">Audit Log</h3>
//         <div className="overflow-x-auto">
//           <table className="w-full min-w-full">
//             <thead>
//               <tr className="border-b">
//                 <th className="text-left py-2">File</th>
//                 <th className="text-left py-2">Status</th>
//                 <th className="text-left py-2">Uploaded by</th>
//                 <th className="text-left py-2">UploadedAt</th>
//                 <th className="text-left py-2">Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {fileData.map((file, index) => (
//                 <tr key={index} className="border-b">
//                   <td className="py-4 max-w-md truncate">
//                     {file.fileName}
//                   </td>
//                   <td className="py-4">{file.status}</td>
//                   <td className="py-4">{file.uploadedBy}</td>
//                   <td className="py-4">{file.uploadedAt}</td>
//                   <td className="py-4">
//                     <div className="flex gap-2">
//                       <Download className="w-5 h-5 text-gray-600 cursor-pointer" />
//                       <Eye className="w-5 h-5 text-gray-600 cursor-pointer" />
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SFTPDownload;























// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Download, Eye } from 'lucide-react';

// const SFTPDownload = () => {
//   const [downloadStatus, setDownloadStatus] = useState('Input');
//   const [fileData, setFileData] = useState([]);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     fetchSFTPFiles();
//   }, [downloadStatus]);

//   const fetchSFTPFiles = async () => {
//     setLoading(true);
//     try {
//       const response = await axios.get('http://localhost:3000/api/sftp/files', {
//         params: { status: downloadStatus }
//       });
//       setFileData(response.data);
//     } catch (error) {
//       console.error('Error fetching SFTP files:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDownload = (fileName) => {
//     // Basic download implementation
//     axios({
//       url: `http://localhost:3000/api/sftp/download/${fileName}`,
//       method: 'GET',
//       responseType: 'blob'
//     }).then((response) => {
//       const url = window.URL.createObjectURL(new Blob([response.data]));
//       const link = document.createElement('a');
//       link.href = url;
//       link.setAttribute('download', fileName);
//       document.body.appendChild(link);
//       link.click();
//     });
//   };

//   return (
//     <div className="p-6 space-y-6">
//       <div className="flex gap-4 border-b">
//         {['Input', 'Output', 'Delivered', 'Failed'].map(status => (
//           <button 
//             key={status}
//             className={`px-8 py-2 ${downloadStatus === status ? 'text-blue-500 border-b-2 border-blue-500' : ''}`}
//             onClick={() => setDownloadStatus(status)}
//           >
//             {status}
//           </button>
//         ))}
//       </div>

//       <div className="mt-4">
//         <h3 className="text-blue-500 mb-4">SFTP Files</h3>
//         {loading ? (
//           <div>Loading...</div>
//         ) : (
//           <table className="w-full border">
//             <thead>
//               <tr className="bg-gray-100">
//                 <th className="p-2 border">File Name</th>
//                 <th className="p-2 border">Status</th>
//                 <th className="p-2 border">Uploaded By</th>
//                 <th className="p-2 border">Uploaded At</th>
//                 <th className="p-2 border">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {fileData.map((file, index) => (
//                 <tr key={index} className="hover:bg-gray-50">
//                   <td className="p-2 border truncate max-w-xs">{file.file_name}</td>
//                   <td className="p-2 border">{file.status}</td>
//                   <td className="p-2 border">{file.uploader?.first_name || 'Unknown'}</td>
//                   <td className="p-2 border">
//                     {new Date(file.uploaded_at).toLocaleString()}
//                   </td>
//                   <td className="p-2 border">
//                     <div className="flex gap-2 justify-center">
//                       <Download 
//                         onClick={() => handleDownload(file.file_name)}
//                         className="cursor-pointer text-blue-500 hover:text-blue-700"
//                       />
//                       <Eye 
//                         className="cursor-pointer text-green-500 hover:text-green-700"
//                       />
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </div>
//     </div>
//   );
// };

// export default SFTPDownload;




















import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Download, Eye, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const SFTPDownload = () => {
  const [downloadStatus, setDownloadStatus] = useState('Input');
  const [fileData, setFileData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [downloadProgress, setDownloadProgress] = useState({});

  useEffect(() => {
    fetchSFTPFiles();
  }, [downloadStatus]);

  const fetchSFTPFiles = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get('/api/sftp/files', {
        params: { status: downloadStatus }
      });
      setFileData(response.data);
    } catch (error) {
      setError('Error fetching files');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (fileName) => {
    try {
      setDownloadProgress(prev => ({ ...prev, [fileName]: 0 }));
      
      const response = await axios.get(`/api/sftp/download/${fileName}`, {
        responseType: 'blob',
        onDownloadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setDownloadProgress(prev => ({ ...prev, [fileName]: progress }));
        }
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      // Move file to delivered folder
      await axios.put(`/api/sftp/status/${fileName}`, {
        status: 'Delivered',
        folder: 'delivered'
      });
      
      setDownloadProgress(prev => ({ ...prev, [fileName]: 0 }));
      fetchSFTPFiles();
    } catch (error) {
      setError(`Error downloading ${fileName}`);
    }
  };

  const viewFileDetails = async (fileName) => {
    try {
      const response = await axios.get(`/api/sftp/details/${fileName}`);
      // Implement file preview logic here
    } catch (error) {
      setError('Error viewing file details');
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex gap-4 border-b">
        {['Input', 'Output', 'Delivered', 'Failed'].map(status => (
          <button 
            key={status}
            className={`px-8 py-2 ${
              downloadStatus === status 
                ? 'text-blue-500 border-b-2 border-blue-500' 
                : 'text-gray-500'
            }`}
            onClick={() => setDownloadStatus(status)}
          >
            {status}
          </button>
        ))}
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="mt-4">
        <h3 className="text-blue-500 font-semibold mb-4">SFTP Files</h3>
        {loading ? (
          <div className="text-center py-4">Loading...</div>
        ) : (
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 text-left">File Name</th>
                <th className="p-2 text-left">Status</th>
                <th className="p-2 text-left">Uploaded By</th>
                <th className="p-2 text-left">Uploaded At</th>
                <th className="p-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {fileData.map((file, index) => (
                <tr key={index} className="border-t hover:bg-gray-50">
                  <td className="p-2 truncate max-w-xs">{file.file_name}</td>
                  <td className="p-2">{file.status}</td>
                  <td className="p-2">{file.uploader?.first_name || 'Unknown'}</td>
                  <td className="p-2">
                    {new Date(file.uploaded_at).toLocaleString()}
                  </td>
                  <td className="p-2">
                    <div className="flex gap-2 justify-center">
                      <div className="relative">
                        <Download 
                          onClick={() => handleDownload(file.file_name)}
                          className="cursor-pointer text-blue-500 hover:text-blue-700"
                        />
                        {downloadProgress[file.file_name] > 0 && (
                          <div className="absolute -bottom-1 left-0 w-full h-1 bg-blue-200 rounded-full">
                            <div 
                              className="h-full bg-blue-500 rounded-full transition-all"
                              style={{ width: `${downloadProgress[file.file_name]}%` }}
                            />
                          </div>
                        )}
                      </div>
                      <Eye 
                        onClick={() => viewFileDetails(file.file_name)}
                        className="cursor-pointer text-green-500 hover:text-green-700"
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default SFTPDownload;