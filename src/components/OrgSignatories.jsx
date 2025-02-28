// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Edit2, Save, X, Plus, Trash2 } from 'lucide-react';

// const OrgSignatories = ({ organizationId }) => {
//     const [signatories, setSignatories] = useState([]);
//     const [editingId, setEditingId] = useState(null);
//     const [editData, setEditData] = useState({});
//     const [showAddForm, setShowAddForm] = useState(false);
//     const [newSignatory, setNewSignatory] = useState({
//         name: '',
//         designation: '',
//         email_id: '',
//         mobile_no: '',
//         pan_no: '',
//         status: 'ACTIVE'
//     });

//     useEffect(() => {
//         fetchSignatories();
//     }, [organizationId]);

//     const fetchSignatories = async () => {
//         try {
//             const response = await axios.get(`http://localhost:3000/api/organization/signatories/${organizationId}`);
//             setSignatories(response.data.data || []);
//         } catch (error) {
//             console.error('Error fetching signatories:', error);
//             alert('Failed to fetch signatories');
//         }
//     };

//     const handleEdit = (signatory) => {
//         setEditingId(signatory.id);
//         setEditData(signatory);
//     };

//     const handleInputChange = (field, value) => {
//         setEditData(prev => ({
//             ...prev,
//             [field]: value
//         }));
//     };

//     const handleNewSignatoryChange = (e) => {
//         const { name, value } = e.target;
//         setNewSignatory(prev => ({
//             ...prev,
//             [name]: value
//         }));
//     };

//     const handleSave = async (signatoryId) => {
//         try {
//             await axios.put(`http://localhost:3000/api/organization/update-signatory/${signatoryId}`, editData);
//             fetchSignatories();
//             setEditingId(null);
//         } catch (error) {
//             console.error('Error updating signatory:', error);
//             alert('Failed to update signatory');
//         }
//     };

//     const handleAdd = async (e) => {
//         e.preventDefault();
//         try {
//             await axios.post(`http://localhost:3000/api/organization/create-signatory/${organizationId}`, {
//                 ...newSignatory,
//                 organization_id: organizationId
//             });
//             fetchSignatories();
//             setShowAddForm(false);
//             setNewSignatory({
//                 name: '',
//                 designation: '',
//                 email_id: '',
//                 mobile_no: '',
//                 pan_no: '',
//                 status: 'ACTIVE'
//             });
//         } catch (error) {
//             console.error('Error adding signatory:', error);
//             alert('Failed to add signatory');
//         }
//     };

//     const handleDelete = async (signatoryId) => {
//         if (window.confirm('Are you sure you want to delete this signatory?')) {
//             try {
//                 await axios.delete(`http://localhost:3000/api/organization/delete-signatory/${signatoryId}`);
//                 fetchSignatories();
//             } catch (error) {
//                 console.error('Error deleting signatory:', error);
//                 alert('Failed to delete signatory');
//             }
//         }
//     };

//     const SignatoryForm = () => (
//         <div className="form-container">
//             <h3>Add New Signatory</h3>
//             <form onSubmit={handleAdd}>
//                 <div className="form-group">
//                     <label>Name</label>
//                     <input
//                         name="name"
//                         value={newSignatory.name}
//                         onChange={handleNewSignatoryChange}
//                         placeholder="Name"
//                         required
//                     />
//                 </div>
//                 <div className="form-group">
//                     <label>Designation</label>
//                     <input
//                         name="designation"
//                         value={newSignatory.designation}
//                         onChange={handleNewSignatoryChange}
//                         placeholder="Designation"
//                         required
//                     />
//                 </div>
//                 <div className="form-group">
//                     <label>Email ID</label>
//                     <input
//                         name="email_id"
//                         type="email"
//                         value={newSignatory.email_id}
//                         onChange={handleNewSignatoryChange}
//                         placeholder="Email"
//                         required
//                     />
//                 </div>
//                 <div className="form-group">
//                     <label>Mobile Number</label>
//                     <input
//                         name="mobile_no"
//                         value={newSignatory.mobile_no}
//                         onChange={handleNewSignatoryChange}
//                         placeholder="Mobile Number"
//                         required
//                     />
//                 </div>
//                 <div className="form-group">
//                     <label>PAN Number</label>
//                     <input
//                         name="pan_no"
//                         value={newSignatory.pan_no}
//                         onChange={handleNewSignatoryChange}
//                         placeholder="PAN Number"
//                         required
//                     />
//                 </div>
//                 <div className="form-group">
//                     <label>Status</label>
//                     <select
//                         name="status"
//                         value={newSignatory.status}
//                         onChange={handleNewSignatoryChange}
//                         required
//                     >
//                         <option value="ACTIVE">Active</option>
//                         <option value="INACTIVE">Inactive</option>
//                     </select>
//                 </div>
//                 <div className="form-actions">
//                     <button type="submit">Add Signatory</button>
//                     <button type="button" onClick={() => setShowAddForm(false)}>Cancel</button>
//                 </div>
//             </form>
//         </div>
//     );

//     return (
//         <div className="signatories-section">
//             <div className="section-header">
//                 <h2>Signatories</h2>
//                 <button onClick={() => setShowAddForm(true)} className="add-button">
//                     <Plus size={16} /> Add Signatory
//                 </button>
//             </div>

//             {showAddForm && <SignatoryForm />}

//             <div className="signatories-table">
//                 <table>
//                     <thead>
//                         <tr>
//                             <th>Name</th>
//                             <th>Designation</th>
//                             <th>Email ID</th>
//                             <th>Mobile Number</th>
//                             <th>PAN Number</th>
//                             <th>Status</th>
//                             <th>Actions</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {signatories.map(signatory => (
//                             <tr key={signatory.id}>
//                                 {editingId === signatory.id ? (
//                                     <>
//                                         <td>
//                                             <input
//                                                 value={editData.name || ''}
//                                                 onChange={(e) => handleInputChange('name', e.target.value)}
//                                             />
//                                         </td>
//                                         <td>
//                                             <input
//                                                 value={editData.designation || ''}
//                                                 onChange={(e) => handleInputChange('designation', e.target.value)}
//                                             />
//                                         </td>
//                                         <td>
//                                             <input
//                                                 type="email"
//                                                 value={editData.email_id || ''}
//                                                 onChange={(e) => handleInputChange('email_id', e.target.value)}
//                                             />
//                                         </td>
//                                         <td>
//                                             <input
//                                                 value={editData.mobile_no || ''}
//                                                 onChange={(e) => handleInputChange('mobile_no', e.target.value)}
//                                             />
//                                         </td>
//                                         <td>
//                                             <input
//                                                 value={editData.pan_no || ''}
//                                                 onChange={(e) => handleInputChange('pan_no', e.target.value)}
//                                             />
//                                         </td>
//                                         <td>
//                                             <select
//                                                 value={editData.status || ''}
//                                                 onChange={(e) => handleInputChange('status', e.target.value)}
//                                             >
//                                                 <option value="ACTIVE">Active</option>
//                                                 <option value="INACTIVE">Inactive</option>
//                                             </select>
//                                         </td>
//                                         <td>
//                                             <button onClick={() => handleSave(signatory.id)} className="save-button">
//                                                 <Save size={16} />
//                                             </button>
//                                             <button onClick={() => setEditingId(null)} className="cancel-button">
//                                                 <X size={16} />
//                                             </button>
//                                         </td>
//                                     </>
//                                 ) : (
//                                     <>
//                                         <td>{signatory.name}</td>
//                                         <td>{signatory.designation}</td>
//                                         <td>{signatory.email_id}</td>
//                                         <td>{signatory.mobile_no}</td>
//                                         <td>{signatory.pan_no}</td>
//                                         <td>{signatory.status}</td>
//                                         <td>
//                                             <button onClick={() => handleEdit(signatory)} className="edit-button">
//                                                 <Edit2 size={16} />
//                                             </button>
//                                             <button onClick={() => handleDelete(signatory.id)} className="delete-button">
//                                                 <Trash2 size={16} />
//                                             </button>
//                                         </td>
//                                     </>
//                                 )}
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     );
// };

// export default OrgSignatories;



import React, { useState, useEffect } from 'react';
import { Edit2, Save, X, Plus, Trash2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import axios from 'axios';

const OrgSignatories = ({ organizationId }) => {
    const [signatories, setSignatories] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [editData, setEditData] = useState({});
    const [showAddForm, setShowAddForm] = useState(false);
    const [error, setError] = useState('');
    const [newSignatory, setNewSignatory] = useState({
        name: '',
        designation: '',
        email_id: '',
        mobile_no: '',
        pan_no: '',
        status: 'ACTIVE'
    });

    useEffect(() => {
        fetchSignatories();
    }, [organizationId]);

    const fetchSignatories = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/api/organization/signatories/${organizationId}`);
            setSignatories(response.data.data || []);
            setError('');
        } catch (error) {
            setError('Failed to fetch signatories. Please try again.');
            console.error('Error fetching signatories:', error);
        }
    };

    const handleEdit = (signatory) => {
        setEditingId(signatory.id);
        setEditData({ ...signatory });
    };

    const handleInputChange = (field, value) => {
        setEditData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleNewSignatoryChange = (field, value) => {
        setNewSignatory(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSave = async (signatoryId) => {
        try {
            await axios.put(`http://localhost:3000/api/organization/update-signatory/${signatoryId}`, editData);
            fetchSignatories();
            setEditingId(null);
            setError('');
        } catch (error) {
            setError('Failed to update signatory. Please try again.');
            console.error('Error updating signatory:', error);
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`http://localhost:3000/api/organization/create-signatory/${organizationId}`, {
                ...newSignatory,
                organization_id: organizationId
            });
            fetchSignatories();
            setShowAddForm(false);
            setNewSignatory({
                name: '',
                designation: '',
                email_id: '',
                mobile_no: '',
                pan_no: '',
                status: 'ACTIVE'
            });
            setError('');
        } catch (error) {
            setError('Failed to add signatory. Please try again.');
            console.error('Error adding signatory:', error);
        }
    };

    const handleDelete = async (signatoryId) => {
        if (window.confirm('Are you sure you want to delete this signatory?')) {
            try {
                await axios.delete(`http://localhost:3000/api/organization/delete-signatory/${signatoryId}`);
                fetchSignatories();
                setError('');
            } catch (error) {
                setError('Failed to delete signatory. Please try again.');
                console.error('Error deleting signatory:', error);
            }
        }
    };

    const SignatoryForm = () => (
        <form onSubmit={handleAdd} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                        id="name"
                        value={newSignatory.name}
                        onChange={(e) => handleNewSignatoryChange('name', e.target.value)}
                        placeholder="Enter name"
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="designation">Designation</Label>
                    <Input
                        id="designation"
                        value={newSignatory.designation}
                        onChange={(e) => handleNewSignatoryChange('designation', e.target.value)}
                        placeholder="Enter designation"
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">Email ID</Label>
                    <Input
                        id="email"
                        type="email"
                        value={newSignatory.email_id}
                        onChange={(e) => handleNewSignatoryChange('email_id', e.target.value)}
                        placeholder="Enter email"
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="mobile">Mobile Number</Label>
                    <Input
                        id="mobile"
                        value={newSignatory.mobile_no}
                        onChange={(e) => handleNewSignatoryChange('mobile_no', e.target.value)}
                        placeholder="Enter mobile number"
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="pan">PAN Number</Label>
                    <Input
                        id="pan"
                        value={newSignatory.pan_no}
                        onChange={(e) => handleNewSignatoryChange('pan_no', e.target.value)}
                        placeholder="Enter PAN number"
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                        value={newSignatory.status}
                        onValueChange={(value) => handleNewSignatoryChange('status', value)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ACTIVE">Active</SelectItem>
                            <SelectItem value="INACTIVE">Inactive</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                    Cancel
                </Button>
                <Button type="submit">Add Signatory</Button>
            </div>
        </form>
    );

    return (
        <Card className="w-full">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Signatories</CardTitle>
                <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> Add Signatory
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Add New Signatory</DialogTitle>
                        </DialogHeader>
                        <SignatoryForm />
                    </DialogContent>
                </Dialog>
            </CardHeader>
            <CardContent>
                {error && (
                    <Alert variant="destructive" className="mb-4">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Designation</TableHead>
                                <TableHead>Email ID</TableHead>
                                <TableHead>Mobile Number</TableHead>
                                <TableHead>PAN Number</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {signatories.map(signatory => (
                                <TableRow key={signatory.id}>
                                    {editingId === signatory.id ? (
                                        <>
                                            <TableCell>
                                                <Input
                                                    value={editData.name || ''}
                                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Input
                                                    value={editData.designation || ''}
                                                    onChange={(e) => handleInputChange('designation', e.target.value)}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Input
                                                    type="email"
                                                    value={editData.email_id || ''}
                                                    onChange={(e) => handleInputChange('email_id', e.target.value)}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Input
                                                    value={editData.mobile_no || ''}
                                                    onChange={(e) => handleInputChange('mobile_no', e.target.value)}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Input
                                                    value={editData.pan_no || ''}
                                                    onChange={(e) => handleInputChange('pan_no', e.target.value)}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Select
                                                    value={editData.status}
                                                    onValueChange={(value) => handleInputChange('status', value)}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="ACTIVE">Active</SelectItem>
                                                        <SelectItem value="INACTIVE">Inactive</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleSave(signatory.id)}
                                                >
                                                    <Save className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => setEditingId(null)}
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </>
                                    ) : (
                                        <>
                                            <TableCell>{signatory.name}</TableCell>
                                            <TableCell>{signatory.designation}</TableCell>
                                            <TableCell>{signatory.email_id}</TableCell>
                                            <TableCell>{signatory.mobile_no}</TableCell>
                                            <TableCell>{signatory.pan_no}</TableCell>
                                            <TableCell>
                                                <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                                                    signatory.status === 'ACTIVE' 
                                                        ? 'bg-green-100 text-green-700' 
                                                        : 'bg-red-100 text-red-700'
                                                }`}>
                                                    {signatory.status}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleEdit(signatory)}
                                                >
                                                    <Edit2 className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleDelete(signatory.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </>
                                    )}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
};

export default OrgSignatories;