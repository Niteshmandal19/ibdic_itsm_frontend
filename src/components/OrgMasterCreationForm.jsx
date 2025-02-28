import React, { useState } from 'react';
import { CodeSquare, Upload, AlertCircle } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

const OrgMasterCreationForm = ({ isOpen = true, onClose = () => { }, onSubmit }) => {
    const [errors, setErrors] = useState({});
    const [fileError, setFileError] = useState('');
    const [formData, setFormData] = useState({
        organization_id: '',
        org_name: '',
        member_no: '',
        address1: '',
        pin_code: '',
        city: '',
        state: '',
        pan_no: '',
        gstn_no: '',
        agreement_no: '',
        date_of_agreement: '',
        attachment: null,
        attachmentOriginalName: '',
        attachmentMimeType: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: undefined,
            }));
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const MAX_FILE_SIZE = 10 * 1024 * 1024;
            if (file.size > MAX_FILE_SIZE) {
                setFileError('File size exceeds 10MB limit');
                return;
            }
            setFormData((prev) => ({
                ...prev,
                attachment: file,
                attachmentOriginalName: file.name,
                attachmentMimeType: file.type,
            }));
            setFileError('');
        }
    };


    const validateForm = (data, requiredFields) => {
        const newErrors = {};
        requiredFields.forEach((field) => {
            if (!data[field]) {
                newErrors[field] = 'This field is required';
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const requiredFields = [
            'organization_id',
            'member_no',
            'address1',
            'pin_code',
            'city',
            'state',
            'pan_no',
            'gstn_no',
            'agreement_no',
            'date_of_agreement',
        ];

        if (validateForm(formData, requiredFields)) {
            const submissionData = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                if (value !== null && value !== '') {
                    submissionData.append(key, value);
                }
            });
            try {
                const response = await axios.post(
                    'http://localhost:3000/api/organization/create-org-master',
                    submissionData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    }
                );

                console.log('Response data:', response.data);
                alert('Organization created successfully!');
                onClose();
                if (onSubmit) onSubmit(response.data);
            } catch (error) {
                console.error('Submission error:', error.response?.data || error);
                alert(error.response?.data?.message || 'An error occurred while submitting the form.');
            }
        }
    };



    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <CodeSquare className="w-6 h-6" />
                        Create New Organization
                    </DialogTitle>
                    <DialogDescription>
                        Fill in the organization details below to create a new master record.
                    </DialogDescription>
                </DialogHeader>

                <div className="max-h-[70vh] overflow-y-auto pr-4">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Organization Details Section */}
                            <div className="space-y-4 md:col-span-2">
                                <h3 className="text-lg font-semibold border-b pb-2">Organization Details</h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="organization_id">Organization ID*</Label>
                                        <Input
                                            id="organization_id"
                                            name="organization_id"
                                            value={formData.organization_id}
                                            onChange={handleInputChange}
                                            className={errors.organization_id ? "border-red-500" : ""}
                                        />
                                        {errors.organization_id && (
                                            <p className="text-red-500 text-sm">{errors.organization_id}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="org_name">Organization Name</Label>
                                        <Input
                                            id="org_name"
                                            name="org_name"
                                            value={formData.org_name}
                                            onChange={handleInputChange}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="member_no">Member Number*</Label>
                                        <Input
                                            id="member_no"
                                            name="member_no"
                                            value={formData.member_no}
                                            onChange={handleInputChange}
                                            className={errors.member_no ? "border-red-500" : ""}
                                        />
                                        {errors.member_no && (
                                            <p className="text-red-500 text-sm">{errors.member_no}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Address Section */}
                            <div className="space-y-4 md:col-span-2">
                                <h3 className="text-lg font-semibold border-b pb-2">Address Information</h3>

                                <div className="space-y-2">
                                    <Label htmlFor="address1">Address Line 1*</Label>
                                    <Textarea
                                        id="address1"
                                        name="address1"
                                        value={formData.address1}
                                        onChange={handleInputChange}
                                        className={errors.address1 ? "border-red-500" : ""}
                                        rows={2}
                                    />
                                    {errors.address1 && (
                                        <p className="text-red-500 text-sm">{errors.address1}</p>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="pin_code">PIN Code*</Label>
                                        <Input
                                            id="pin_code"
                                            name="pin_code"
                                            value={formData.pin_code}
                                            onChange={handleInputChange}
                                            className={errors.pin_code ? "border-red-500" : ""}
                                        />
                                        {errors.pin_code && (
                                            <p className="text-red-500 text-sm">{errors.pin_code}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="city">City*</Label>
                                        <Input
                                            id="city"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleInputChange}
                                            className={errors.city ? "border-red-500" : ""}
                                        />
                                        {errors.city && (
                                            <p className="text-red-500 text-sm">{errors.city}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="state">State*</Label>
                                        <Select
                                            name="state"
                                            value={formData.state}
                                            onValueChange={(value) => handleInputChange({ target: { name: 'state', value } })}
                                        >
                                            <SelectTrigger className={errors.state ? "border-red-500" : ""}>
                                                <SelectValue placeholder="Select state" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {[
                                                    "Andhra Pradesh",
                                                    "Arunachal Pradesh",
                                                    "Assam",
                                                    "Bihar",
                                                    "Chhattisgarh",
                                                    "Goa",
                                                    "Gujarat",
                                                    "Haryana",
                                                    "Himachal Pradesh",
                                                    "Jharkhand",
                                                    "Karnataka",
                                                    "Kerala",
                                                    "Madhya Pradesh",
                                                    "Maharashtra",
                                                    "Manipur",
                                                    "Meghalaya",
                                                    "Mizoram",
                                                    "Nagaland",
                                                    "Odisha",
                                                    "Punjab",
                                                    "Rajasthan",
                                                    "Sikkim",
                                                    "Tamil Nadu",
                                                    "Telangana",
                                                    "Tripura",
                                                    "Uttar Pradesh",
                                                    "Uttarakhand",
                                                    "West Bengal"
                                                ].map((state) => (
                                                    <SelectItem key={state} value={state}>
                                                        {state}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.state && (
                                            <p className="text-red-500 text-sm">{errors.state}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Legal Information Section */}
                            <div className="space-y-4 md:col-span-2">
                                <h3 className="text-lg font-semibold border-b pb-2">Legal Information</h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="pan_no">PAN Number*</Label>
                                        <Input
                                            id="pan_no"
                                            name="pan_no"
                                            value={formData.pan_no}
                                            onChange={handleInputChange}
                                            className={errors.pan_no ? "border-red-500" : ""}
                                        />
                                        {errors.pan_no && (
                                            <p className="text-red-500 text-sm">{errors.pan_no}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="gstn_no">GSTIN Number*</Label>
                                        <Input
                                            id="gstn_no"
                                            name="gstn_no"
                                            value={formData.gstn_no}
                                            onChange={handleInputChange}
                                            className={errors.gstn_no ? "border-red-500" : ""}
                                        />
                                        {errors.gstn_no && (
                                            <p className="text-red-500 text-sm">{errors.gstn_no}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Agreement Section */}
                            <div className="space-y-4 md:col-span-2">
                                <h3 className="text-lg font-semibold border-b pb-2">Agreement Details</h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="agreement_no">Agreement Number*</Label>
                                        <Input
                                            id="agreement_no"
                                            name="agreement_no"
                                            value={formData.agreement_no}
                                            onChange={handleInputChange}
                                            className={errors.agreement_no ? "border-red-500" : ""}
                                        />
                                        {errors.agreement_no && (
                                            <p className="text-red-500 text-sm">{errors.agreement_no}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="date_of_agreement">Agreement Date*</Label>
                                        <Input
                                            id="date_of_agreement"
                                            name="date_of_agreement"
                                            type="date"
                                            value={formData.date_of_agreement}
                                            onChange={handleInputChange}
                                            className={errors.date_of_agreement ? "border-red-500" : ""}
                                        />
                                        {errors.date_of_agreement && (
                                            <p className="text-red-500 text-sm">{errors.date_of_agreement}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* File Upload Section */}
                            <div className="space-y-4 md:col-span-2">
                                <div className="space-y-2">
                                    <Label htmlFor="attachment">Upload Agreement Document</Label>
                                    <div className="flex items-center gap-4">
                                        <Input
                                            id="attachment"
                                            type="file"
                                            onChange={handleFileChange}
                                            className="hidden"
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="w-full"
                                            onClick={() => document.getElementById('attachment').click()}
                                        >
                                            <Upload className="w-4 h-4 mr-2" />
                                            {formData.attachmentOriginalName || 'Choose file'}
                                        </Button>
                                    </div>
                                    {fileError && (
                                        <Alert variant="destructive">
                                            <AlertCircle className="h-4 w-4" />
                                            <AlertDescription>{fileError}</AlertDescription>
                                        </Alert>
                                    )}
                                    {formData.attachmentOriginalName && !fileError && (
                                        <p className="text-sm text-gray-500">
                                            Selected file: {formData.attachmentOriginalName}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-4 pt-4 border-t">
                            <Button type="button" variant="outline" onClick={onClose}>
                                Cancel
                            </Button>
                            <Button type="submit">
                                Create Organization
                            </Button>
                        </div>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default OrgMasterCreationForm;