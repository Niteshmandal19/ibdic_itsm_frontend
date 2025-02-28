import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";



const UserCreationForm = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    identifier_type: '',
    identifier: '',
    email: '',
    mobile_no: '',
    role: '',
    organization_id: '',
    initialCommit: '',
    temp_password: '',
    product_codes: []
  });

  const [organizations, setOrganizations] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [productCodes, setProductCodes] = useState([]);


  const parseJwt = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(window.atob(base64));
      return payload;
    } catch (e) {
      console.error('Error parsing token:', e);
      return null;
    }
  };

  const getCurrentUserRole = () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return null;
      const payload = parseJwt(token);
      return payload?.role;
    } catch (err) {
      console.error('Error getting user role:', err);
      return null;
    }
  };

  const userRole = getCurrentUserRole();



  // Role options
  const roleOptions = [
    { value: 'IBDIC_ADMIN', label: 'IBDIC Admin' },
    { value: 'IBDIC_USER', label: 'IBDIC User' },
    { value: 'ORG_ADMIN', label: 'Organization Admin' },
    { value: 'ORG_USER', label: 'Organization User' }
  ];

  const filteredRoleOptions = roleOptions.filter(role => {
    if (userRole === 'IBDIC_ADMIN') {
      return true; // IBDIC_ADMIN can view all roles
    } else if (userRole === 'ORG_ADMIN') {
      return role.value === 'ORG_ADMIN' || role.value === 'ORG_USER'; // ORG_ADMIN can view only ORG_ADMIN and ORG_USER
    }
    return false; // Other roles see no options
  });


  // Identifier type options
  const identifierTypes = [
    { value: 'AADHAR', label: 'Aadhar Card' },
    { value: 'PAN', label: 'PAN Card' },
    { value: 'DRIVING_LICENSE', label: 'Driving License' },
    { value: 'VOTER_ID', label: 'Voter ID' }
  ];




  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/api/users/organizations', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setOrganizations(response.data.data);
      } catch (error) {
        console.error('Failed to fetch organizations:', error);
      }
    };

    const fetchProductCodes = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/products');
        setProductCodes(response.data || []);
      } catch (error) {
        console.error('Error fetching product codes:', error);
        alert('Failed to fetch product codes');
      }
    };


    fetchOrganizations();
    fetchProductCodes();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));

    // Clear error when field is modified
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  const handleProductSelect = (productCode) => {
    setFormData(prevState => ({
      ...prevState,
      product_codes: prevState.product_codes.includes(productCode)
        ? prevState.product_codes.filter(code => code !== productCode)
        : [...prevState.product_codes, productCode]
    }));
  };


  const validateForm = () => {
    const newErrors = {};

    // Required field validation
    const requiredFields = [
      'first_name',
      'last_name',
      'email',
      'mobile_no',
      'role',
      'identifier_type',
      'identifier',
      'organization_id',
      'temp_passowrd',
      'IS_SFTP_USER'
    ];

    // requiredFields.forEach(field => {
    //   if (!formData[field].trim()) {
    //     newErrors[field] = `${field.replace('_', ' ')} is required`;
    //   }
    // });

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    // Mobile number validation
    const mobileRegex = /^[0-9]{10,12}$/;
    if (formData.mobile_no && !mobileRegex.test(formData.mobile_no)) {
      newErrors.mobile_no = 'Invalid mobile number (10-12 digits)';
    }

    // Identifier validation based on type
    if (formData.identifier_type === 'AADHAR') {
      const aadharRegex = /^\d{12}$/;
      if (!aadharRegex.test(formData.identifier)) {
        newErrors.identifier = 'Invalid Aadhar number (12 digits)';
      }
    } else if (formData.identifier_type === 'PAN') {
      const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
      if (!panRegex.test(formData.identifier)) {
        newErrors.identifier = 'Invalid PAN number format';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitSuccess(false);

    if (validateForm()) {
      try {
        const payload = {
          ...formData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };


        const response = await axios.post(
          'http://localhost:3000/api/users/createUser',
          payload,
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}` // Adjust as needed
            },
          }
        );


        setSubmitSuccess(true);

        // Reset form
        setFormData({
          first_name: '',
          last_name: '',
          identifier_type: '',
          identifier: '',
          email: '',
          mobile_no: '',
          role: '',
          organization_id: '',
          initialCommit: '',
          temp_password: '',
          IS_SFTP_USER: '',
          product_codes: []
        });

        if (onSubmit) onSubmit(response.data);
        if (onClose) onClose();

      } catch (error) {
        console.error('User creation failed:', error);
        setErrors(prev => ({
          ...prev,
          submit: error.response?.data?.message || 'Failed to create user. Please try again.'
        }));
      }
    }

    setIsSubmitting(false);
  };


  return (
    <Card className="max-w-6xl mx-auto">

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          {errors.submit && (
            <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md">
              {errors.submit}
            </div>
          )}

          {submitSuccess && (
            <div className="p-3 text-sm text-green-500 bg-green-50 rounded-md">
              User created successfully! Temporary password will be sent to the user.
            </div>
          )}

          {/* Personal Information Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="first_name">First Name *</Label>
                <Input
                  id="first_name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  className={errors.first_name ? 'border-red-500' : ''}
                />
                {errors.first_name && (
                  <span className="text-xs text-red-500">{errors.first_name}</span>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="last_name">Last Name *</Label>
                <Input
                  id="last_name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  className={errors.last_name ? 'border-red-500' : ''}
                />
                {errors.last_name && (
                  <span className="text-xs text-red-500">{errors.last_name}</span>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="mobile_no">Mobile Number *</Label>
                <Input
                  id="mobile_no"
                  name="mobile_no"
                  value={formData.mobile_no}
                  onChange={handleChange}
                  className={errors.mobile_no ? 'border-red-500' : ''}
                />
                {errors.mobile_no && (
                  <span className="text-xs text-red-500">{errors.mobile_no}</span>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && (
                <span className="text-xs text-red-500">{errors.email}</span>
              )}
            </div>
          </div>

          {/* Identification Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Identification</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="identifier_type">ID Type *</Label>
                <Select
                  name="identifier_type"
                  value={formData.identifier_type}
                  onValueChange={(value) => handleChange({ target: { name: 'identifier_type', value } })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select ID Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {identifierTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="identifier">ID Number *</Label>
                <Input
                  id="identifier"
                  name="identifier"
                  value={formData.identifier}
                  onChange={handleChange}
                  className={errors.identifier ? 'border-red-500' : ''}
                />
                {errors.identifier && (
                  <span className="text-xs text-red-500">{errors.identifier}</span>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="temp_password">Temporary Password</Label>
                <Input
                  type="password"
                  id="temp_password"
                  name="temp_password"
                  value={formData.temp_password}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Organization Details Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Organization Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="organization_id">Organization *</Label>
                <Select
                  name="organization_id"
                  value={formData.organization_id}
                  onValueChange={(value) => handleChange({ target: { name: 'organization_id', value } })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Organization" />
                  </SelectTrigger>
                  <SelectContent>
                    {organizations.map(org => (
                      <SelectItem key={org.organization_id} value={org.organization_id}>
                        {org.organization_id}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role *</Label>
                <Select
                  name="role"
                  value={formData.role}
                  onValueChange={(value) => handleChange({ target: { name: 'role', value } })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Role" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredRoleOptions.map(role => (
                      <SelectItem key={role.value} value={role.value}>
                        {role.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="IS_SFTP_USER">Do you want to give SFTP access to this user?</Label>
                <Select
                  name="IS_SFTP_USER"
                  value={formData.IS_SFTP_USER}
                  onValueChange={(value) => handleChange({ target: { name: 'IS_SFTP_USER', value } })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="SFTP Access" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Yes</SelectItem>
                    <SelectItem value="0">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>

            </div>
          </div>

          {/* Product Access Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Product Access</h3>
            <div className="space-y-2">
              <Label>Products *</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {productCodes.map(product => (
                  <div key={product.product_code} className="flex items-center space-x-2">
                    <Checkbox
                      id={product.product_code}
                      checked={formData.product_codes.includes(product.product_code)}
                      onCheckedChange={() => handleProductSelect(product.product_code)}
                    />
                    <Label htmlFor={product.product_code} className="text-sm">
                      {product.product_name} ({product.product_code})
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Create User'}
            </Button>
          </div>
        </form>

      </CardContent>
    </Card>
  );
};

export default UserCreationForm;