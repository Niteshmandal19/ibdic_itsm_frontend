// import React, { useState, useEffect } from 'react';
// import axios from 'axios'; // Make sure to install axios: npm install axios

// const SFTPUpload = () => {
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [uploadStatus, setUploadStatus] = useState('input');
//   const [records, setRecords] = useState(0);
//   const [fileNames, setFileNames] = useState([]);
//   const [selectedFileName, setSelectedFileName] = useState('');

//   // Fetch file names on component mount
//   useEffect(() => {
//     const fetchFileNames = async () => {
//       try {
//         const response = await axios.get('http://localhost:3000/api/sftp/fileNames'); // Adjust the API endpoint as needed
//         if (response.data.success) {
//           setFileNames(response.data.data);
//         }
//       } catch (error) {
//         console.error('Error fetching file names:', error);
//       }
//     };

//     fetchFileNames();
//   }, []);

//   const handleFileSelect = (event) => {
//     const file = event.target.files[0];
//     setSelectedFile(file);
//     setRecords(7); // You might want to calculate actual records dynamically
//   };

//   const handleFileNameChange = (event) => {
//     setSelectedFileName(event.target.value);
//   };

//   const handleUpload = async () => {
//     if (!selectedFile || !selectedFileName) {
//       alert('Please select both a file and a file name');
//       return;
//     }

//     try {
//       setUploadStatus('output');
      
//       // Create form data for file upload
//       const formData = new FormData();
//       formData.append('file', selectedFile);
//       formData.append('fileName', selectedFileName);

//       // Example upload logic - adjust based on your actual API
//       const response = await axios.post('http://localhost:3000/api/sftp/upload', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data'
//         }
//       });

//       if (response.data.success) {
//         setUploadStatus('delivered');
//       } else {
//         setUploadStatus('input');
//         alert('Upload failed');
//       }
//     } catch (error) {
//       console.error('Upload error:', error);
//       setUploadStatus('input');
//       alert('Upload failed');
//     }
//   };

//   return (
//     <div className="space-y-4">
//       <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-blue-50 text-center">
//         <p className="text-blue-500 font-semibold">Add File</p>
//         <p className="text-sm text-gray-500">(* Add 1 file at a time & Max size 100MB)</p>
//         <input
//           type="file"
//           onChange={handleFileSelect}
//           className="mt-2 w-full border border-gray-300 rounded-md p-2"
//           accept=".csv, .png"
//         />
//       </div>

//       <div className="space-y-4">
//         <div className="flex items-center gap-4 border border-gray-300 rounded-md p-2">
//           <span className="truncate w-2/3">
//             {selectedFile ? selectedFile.name : 'No file selected'}
//           </span>
//           <select 
//             className="border border-gray-300 rounded-md p-2 flex-1"
//             value={selectedFileName}
//             onChange={handleFileNameChange}
//           >
//             <option value="">Select a file name</option>
//             {fileNames.map((fileName) => (
//               <option 
//                 key={fileName.file_name_API} 
//                 value={fileName.file_name_API}
//               >
//                 {fileName.file_name_API}
//               </option>
//             ))}
//           </select>
//           <span className="text-blue-500">
//             You are about to submit: <b>{records}</b> records.
//           </span>
//         </div>
//         <button
//           onClick={handleUpload}
//           className="bg-blue-500 text-white px-6 py-2 rounded font-semibold"
//           disabled={!selectedFile || !selectedFileName}
//         >
//           UPLOAD
//         </button>
//       </div>
//     </div>
//   );
// };

// export default SFTPUpload;


























// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const SFTPUpload = () => {
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [uploadStatus, setUploadStatus] = useState('input');
//   const [records, setRecords] = useState(0);
//   const [fileNames, setFileNames] = useState([]);
//   const [selectedFileName, setSelectedFileName] = useState('');
//   const [validationError, setValidationError] = useState('');

//   useEffect(() => {
//     const fetchFileNames = async () => {
//       try {
//         const response = await axios.get('http://localhost:3000/api/sftp/fileNames');
//         if (response.data.success) {
//           setFileNames(response.data.data);
//         }
//       } catch (error) {
//         console.error('Error fetching file names:', error);
//       }
//     };

//     fetchFileNames();
//   }, []);

//   const handleFileNameChange = (event) => {
//     const fileName = event.target.value;
//     setSelectedFileName(fileName);
//     setSelectedFile(null);
//     setValidationError('');
//   };

//   const handleFileSelect = (event) => {
//     if (!selectedFileName) {
//       setValidationError('Please select a file name from the dropdown first');
//       event.target.value = null;
//       return;
//     }

//     const file = event.target.files[0];
//     const selectedFileInfo = fileNames.find(
//       (item) => item.file_name_API === selectedFileName
//     );

//     if (!selectedFileInfo) {
//       setValidationError('Invalid file name selection');
//       return;
//     }

//     const fileNameToMatch = selectedFileInfo.file_name;
//     if (!file.name.includes(fileNameToMatch)) {
//       setValidationError(`File name must include "${fileNameToMatch}"`);
//       event.target.value = null;
//       return;
//     }

//     setSelectedFile(file);
//     setRecords(7);
//     setValidationError('');
//   };

//   const handleUpload = async () => {
//     if (!selectedFile || !selectedFileName) {
//       setValidationError('Please select both a file name and a file');
//       return;
//     }
  
//     try {
//       setUploadStatus('uploading');
  
//       // Create FormData object
//       const formData = new FormData();
//       formData.append('attachableType', 'sftp');
  
//       // Append regular form fields excluding attachments
//       Object.entries(formData).forEach(([key, value]) => {
//         if (value !== null && value !== '' && key !== 'attachments') {
//           formData.append(key, value);
//         }
//       });
  
//       // Append selected file as an attachment
//       const attachments = formData.attachments || [];
//       attachments.forEach((attachment, index) => {
//         if (attachment && attachment.file) {
//           formData.append('attachments', attachment.file);
//         }
//       });
  
//       // Append manually selected file
//       formData.append('attachments', selectedFile);
//       formData.append('fileName', selectedFileName);
  
//       // Send data to the server
//       const response = await axios.post(
//         'http://localhost:3000/api/sftp/upload',
//         formData,
//         {
//           headers: {
//             'Content-Type': 'multipart/form-data',
//           },
//         }
//       );
  
//       // Handle response success/failure
//       if (response.status === 200 && response.data.success) {
//         setUploadStatus('success');
//         setValidationError('');
//       } else {
//         throw new Error('Upload failed. Please try again.');
//       }
//     } catch (error) {
//       console.error('Upload error:', error);
//       setUploadStatus('failed');
//       setValidationError(error.response?.data?.message || 'Upload failed. Please check the file and try again.');
//     }
//   };
  
//   return (
//     <div className="space-y-4">
//       <div className="space-y-2">
//         <div className="flex items-center gap-4">
//           <select 
//             className="border border-gray-300 rounded-md p-2 flex-1"
//             value={selectedFileName}
//             onChange={handleFileNameChange}
//           >
//             <option value="">Select a file name</option>
//             {fileNames.map((fileName) => (
//               <option 
//                 key={fileName.file_name_API} 
//                 value={fileName.file_name_API}
//               >
//                 {fileName.file_name_API}
//               </option>
//             ))}
//           </select>
//           <span className="text-blue-500 whitespace-nowrap">
//             Records: <b>{records}</b>
//           </span>
//         </div>
//         {validationError && (
//           <p className="text-red-500 text-sm">{validationError}</p>
//         )}
//       </div>

//       {selectedFileName && (
//         <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-blue-50 text-center">
//           <p className="text-blue-500 font-semibold">Add File</p>
//           <p className="text-sm text-gray-500">(* Add 1 file at a time & Max size 100MB)</p>
//           <input
//             type="file"
//             onChange={handleFileSelect}
//             className="mt-2 w-full border border-gray-300 rounded-md p-2"
//             accept=".csv, .png"
//           />
//           {selectedFile && (
//             <p className="mt-2 text-green-600">
//               Selected file: {selectedFile.name}
//             </p>
//           )}
//         </div>
//       )}

//       <button
//         onClick={handleUpload}
//         className="bg-blue-500 text-white px-6 py-2 rounded font-semibold"
//         disabled={!selectedFile || !selectedFileName}
//       >
//         UPLOAD
//       </button>
//     </div>
//   );
// };

// export default SFTPUpload;
































import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Upload } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const SFTPUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('input');
  const [records, setRecords] = useState(0);
  const [fileNames, setFileNames] = useState([]);
  const [selectedFileName, setSelectedFileName] = useState('');
  const [validationError, setValidationError] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    fetchFileNames();
  }, []);

  const fetchFileNames = async () => {
    try {
      const response = await axios.get('/api/sftp/fileNames');
      if (response.data.success) {
        setFileNames(response.data.data);
      }
    } catch (error) {
      setValidationError('Error fetching file types');
    }
  };

  const handleFileNameChange = (event) => {
    setSelectedFileName(event.target.value);
    setSelectedFile(null);
    setValidationError('');
    setUploadProgress(0);
  };

  const handleFileSelect = (event) => {
    if (!selectedFileName) {
      setValidationError('Please select a file type first');
      event.target.value = null;
      return;
    }

    const file = event.target.files[0];
    if (!file) return;

    const selectedFileInfo = fileNames.find(
      item => item.file_name_API === selectedFileName
    );

    if (!selectedFileInfo) {
      setValidationError('Invalid file type');
      return;
    }

    if (!file.name.includes(selectedFileInfo.file_name)) {
      setValidationError(`File name must include "${selectedFileInfo.file_name}"`);
      event.target.value = null;
      return;
    }

    // Check file size (100MB limit)
    if (file.size > 100 * 1024 * 1024) {
      setValidationError('File size exceeds 100MB limit');
      event.target.value = null;
      return;
    }

    setSelectedFile(file);
    setValidationError('');
  };

  const handleUpload = async () => {
    if (!selectedFile || !selectedFileName) {
      setValidationError('Please select both file type and file');
      return;
    }

    try {
      setUploadStatus('uploading');
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('fileName', selectedFileName);
      formData.append('folder', 'input');

      const response = await axios.post('/api/sftp/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(progress);
        },
      });

      if (response.data.success) {
        setUploadStatus('success');
        setSelectedFile(null);
        setSelectedFileName('');
        setUploadProgress(0);
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      setUploadStatus('failed');
      setValidationError(error.message || 'Upload failed');
    }
  };

  return (
    <div className="space-y-4 p-6">
      <div className="space-y-2">
        <select 
          className="w-full p-2 border rounded-md"
          value={selectedFileName}
          onChange={handleFileNameChange}
        >
          <option value="">Select file type</option>
          {fileNames.map(item => (
            <option key={item.file_name_API} value={item.file_name_API}>
              {item.file_name_API}
            </option>
          ))}
        </select>
      </div>

      {selectedFileName && (
        <div className="border-2 border-dashed rounded-lg p-4 bg-blue-50">
          <input
            type="file"
            onChange={handleFileSelect}
            className="w-full"
            accept=".csv,.xlsx,.pdf"
          />
          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="mt-2">
              <div className="h-2 bg-blue-200 rounded-full">
                <div 
                  className="h-2 bg-blue-500 rounded-full transition-all"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {validationError && (
        <Alert variant="destructive">
          <AlertDescription>{validationError}</AlertDescription>
        </Alert>
      )}

      <button
        onClick={handleUpload}
        disabled={!selectedFile || uploadStatus === 'uploading'}
        className="w-full bg-blue-500 text-white p-2 rounded-lg flex items-center justify-center gap-2 disabled:bg-gray-300"
      >
        <Upload size={20} />
        {uploadStatus === 'uploading' ? 'Uploading...' : 'Upload'}
      </button>
    </div>
  );
};

export default SFTPUpload;