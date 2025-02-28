import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Edit2, Save, X, Download, FileText } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import OrgProducts from './OrgProducts';
import OrgSignatories from './OrgSignatories';

const CompleteOrg = () => {
    const { organizationId } = useParams();
    const [orgDetails, setOrgDetails] = useState(null);
    const [activeTab, setActiveTab] = useState('details');
    const [isEditing, setIsEditing] = useState(false);
    const [editFormData, setEditFormData] = useState(null);

    useEffect(() => {
        fetchOrganizationData();
    }, [organizationId]);

    const fetchOrganizationData = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/api/organization/${organizationId}`);
            const orgData = response.data.organization;
            setOrgDetails(orgData);
            setEditFormData({ ...orgData });
        } catch (error) {
            console.error('Error fetching organization data:', error);
            alert('Failed to fetch organization data');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSaveChanges = async () => {
        try {
            await axios.put(`http://localhost:3000/api/organization/update/${organizationId}`, editFormData);
            setOrgDetails(editFormData);
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating organization:', error);
            alert('Failed to update organization');
        }
    };

    const DetailField = ({ label, value, name, required = true }) => {
        return (
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                    {required && <span className="text-red-500">*</span>}
                </label>
                {isEditing ? (
                    name === 'status' ? (
                        <select
                            name={name}
                            value={editFormData[name]}
                            onChange={handleInputChange}
                            required={required}
                            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="1">Active</option>
                            <option value="0">Inactive</option>
                        </select>
                    ) : (
                        <input
                            name={name}
                            value={editFormData[name] || ''}
                            onChange={handleInputChange}
                            required={required}
                            type={name === 'date_of_agreement' ? 'date' : 'text'}
                            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            disabled={name === 'organization_id' || name === 'created_by' || name === 'created_at'}
                        />
                    )
                ) : (
                    <div className="p-2 bg-gray-50 rounded-md">
                        {name === 'status' ? 
                            (value === '1' ? 'Active' : 'Inactive') : 
                            value || '-'}
                    </div>
                )}
            </div>
        );
    };

    const AttachmentPreview = ({ attachment }) => {
        if (!attachment) return null;

        const handleDownload = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:3000/api/organization/attachment/${organizationId}`,
                    { responseType: 'blob' }
                );
                
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', attachment.attachmentOriginalName);
                document.body.appendChild(link);
                link.click();
                link.remove();
                window.URL.revokeObjectURL(url);
            } catch (error) {
                console.error('Error downloading file:', error);
                alert('Failed to download file');
            }
        };

        return (
            <div className="mt-6 p-4 border rounded-lg">
                <h3 className="text-lg font-medium mb-4">Attachment</h3>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md">
                        <FileText className="w-6 h-6 text-gray-500" />
                        <span className="text-sm">{attachment.attachmentOriginalName}</span>
                    </div>
                    <button 
                        onClick={handleDownload}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                    >
                        <Download className="w-4 h-4" />
                        Download
                    </button>
                </div>
            </div>
        );
    };

    const renderOrgDetails = () => {
        if (!orgDetails) return null;

        return (
            <Card className="w-full mx-auto">
                <CardContent className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-semibold">Organization Details</h2>
                        <div className="flex gap-2">
                            {isEditing ? (
                                <>
                                    <button
                                        onClick={handleSaveChanges}
                                        className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                                    >
                                        <Save className="w-4 h-4" />
                                        Save
                                    </button>
                                    <button
                                        onClick={() => {
                                            setIsEditing(false);
                                            setEditFormData({ ...orgDetails });
                                        }}
                                        className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                        Cancel
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                                >
                                    <Edit2 className="w-4 h-4" />
                                    Edit
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="grid grid-cols-1 gap-6">
                            <DetailField
                                label="Status"
                                value={orgDetails.status}
                                name="status"
                            />
                            <DetailField
                                label="Organization ID"
                                value={orgDetails.organization_id}
                                name="organization_id"
                            />
                            <DetailField
                                label="Organization Name"
                                value={orgDetails.org_name}
                                name="org_name"
                            />
                            <DetailField
                                label="Member Number"
                                value={orgDetails.member_no}
                                name="member_no"
                            />
                            <DetailField
                                label="Address 1"
                                value={orgDetails.address1}
                                name="address1"
                            />
                            <DetailField
                                label="Address 2"
                                value={orgDetails.address2}
                                name="address2"
                                required={false}
                            />
                            <DetailField
                                label="City"
                                value={orgDetails.city}
                                name="city"
                            />
                            <DetailField
                                label="State"
                                value={orgDetails.state}
                                name="state"
                            />
                            <DetailField
                                label="Postal Code"
                                value={orgDetails.pin_code}
                                name="pin_code"
                            />
                            <DetailField
                                label="PAN Number"
                                value={orgDetails.pan_no}
                                name="pan_no"
                            />
                            <DetailField
                                label="GSTN Number"
                                value={orgDetails.gstn_no}
                                name="gstn_no"
                            />
                            <DetailField
                                label="Agreement Number"
                                value={orgDetails.agreement_no}
                                name="agreement_no"
                            />
                            <DetailField
                                label="Date of Agreement"
                                value={orgDetails.date_of_agreement}
                                name="date_of_agreement"
                            />
                            {!isEditing && (
                                <>
                                    <DetailField
                                        label="Created By"
                                        value={orgDetails.created_by}
                                        name="created_by"
                                    />
                                    <DetailField
                                        label="Created Date"
                                        value={orgDetails.created_at}
                                        name="created_at"
                                    />
                                </>
                            )}
                        </div>

                        {orgDetails.attachmentPath && (
                            <AttachmentPreview
                                attachment={{
                                    attachmentUrl: orgDetails.attachmentUrl,
                                    attachmentOriginalName: orgDetails.attachmentOriginalName,
                                    attachmentMimeType: orgDetails.attachmentMimeType
                                }}
                            />
                        )}
                    </div>
                </CardContent>
            </Card>
        );
    };

    if (!orgDetails) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold mb-4">{orgDetails.organization_id}</h1>
                <div className="flex gap-4 border-b">
                    <button
                        onClick={() => setActiveTab('details')}
                        className={`px-4 py-2 -mb-px ${
                            activeTab === 'details'
                                ? 'border-b-2 border-blue-500 text-blue-600'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        Organization Details
                    </button>
                    <button
                        onClick={() => setActiveTab('products')}
                        className={`px-4 py-2 -mb-px ${
                            activeTab === 'products'
                                ? 'border-b-2 border-blue-500 text-blue-600'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        Products
                    </button>
                    <button
                        onClick={() => setActiveTab('signatories')}
                        className={`px-4 py-2 -mb-px ${
                            activeTab === 'signatories'
                                ? 'border-b-2 border-blue-500 text-blue-600'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        Signatories
                    </button>
                </div>
            </div>

            <div className="mt-6">
                {activeTab === 'details' && renderOrgDetails()}
                {activeTab === 'products' && (
                    <OrgProducts organizationId={organizationId} />
                )}
                {activeTab === 'signatories' && (
                    <OrgSignatories organizationId={organizationId} />
                )}
            </div>
        </div>
    );
};

export default CompleteOrg;