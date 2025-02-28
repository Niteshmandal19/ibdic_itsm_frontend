// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Edit2, Save, X, Plus, Trash2 } from 'lucide-react';
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Textarea } from "@/components/ui/textarea";

// const OrgProducts = ({ organizationId }) => {
//     const [products, setProducts] = useState([]);
//     const [productCodes, setProductCodes] = useState([]);
//     const [editingId, setEditingId] = useState(null);
//     const [editData, setEditData] = useState({});
//     const [showAddForm, setShowAddForm] = useState(false);
//     const [newProduct, setNewProduct] = useState({
//         product_name: '',
//         product_code: '',
//         description: '',
//         price: '',
//         status: 'ACTIVE',
//         billingType: '',
//         billingMethod: '',
//         discounting: ''
//     });

//     useEffect(() => {
//         fetchProducts();
//         fetchProductCodes();
//     }, [organizationId]);

//     // Fetch functions remain the same
//     const fetchProducts = async () => {
//         try {
//             const response = await axios.get(`http://localhost:3000/api/organization/products/${organizationId}`);
//             setProducts(response.data.data || []);
//         } catch (error) {
//             console.error('Error fetching products:', error);
//             alert('Failed to fetch products');
//         }
//     };

//     const fetchProductCodes = async () => {
//         try {
//             const response = await axios.get('http://localhost:3000/api/products');
//             setProductCodes(response.data || []);
//         } catch (error) {
//             console.error('Error fetching product codes:', error);
//             alert('Failed to fetch product codes');
//         }
//     };

//     // Handler functions remain the same
//     const handleEdit = (product) => {
//         setEditingId(product.id);
//         setEditData(product);
//     };

//     const handleInputChange = (field, value) => {
//         setEditData(prev => ({
//             ...prev,
//             [field]: value
//         }));
//     };

//     const handleNewProductChange = (e) => {
//         const { name, value } = e.target;
//         setNewProduct(prev => ({
//             ...prev,
//             [name]: value
//         }));
//     };

//     const handleSave = async (productId) => {
//         try {
//             await axios.put(`http://localhost:3000/api/organization/update-products/${productId}`, editData);
//             fetchProducts();
//             setEditingId(null);
//         } catch (error) {
//             console.error('Error updating product:', error);
//             alert('Failed to update product');
//         }
//     };

//     const handleAdd = async (e) => {
//         e.preventDefault();
//         try {
//             await axios.post(`http://localhost:3000/api/organization/create-product/${organizationId}`, {
//                 ...newProduct,
//                 organization_id: organizationId
//             });
//             fetchProducts();
//             setShowAddForm(false);
//             setNewProduct({
//                 product_name: '',
//                 product_code: '',
//                 description: '',
//                 price: '',
//                 status: 'ACTIVE',
//                 billingType: '',
//                 billingMethod: '',
//                 discounting: ''
//             });
//         } catch (error) {
//             console.error('Error adding product:', error);
//             alert('Failed to add product');
//         }
//     };

//     const handleDelete = async (productId) => {
//         if (window.confirm('Are you sure you want to delete this product?')) {
//             try {
//                 await axios.delete(`http://localhost:3000/api/organization/delete-product/${productId}`);
//                 fetchProducts();
//             } catch (error) {
//                 console.error('Error deleting product:', error);
//                 alert('Failed to delete product');
//             }
//         }
//     };

//     const ProductForm = () => (
//         <Card className="mb-6">
//             <CardHeader>
//                 <CardTitle>Add New Product</CardTitle>
//             </CardHeader>
//             <CardContent>
//                 <form onSubmit={handleAdd} className="space-y-4">
//                     <div className="grid grid-cols-2 gap-4">
//                         <div className="space-y-2">
//                             <label className="text-sm font-medium">Product Code</label>
//                             <Select
//                                 name="product_code"
//                                 value={newProduct.product_code}
//                                 onValueChange={(value) => handleNewProductChange({ target: { name: 'product_code', value }})}
//                             >
//                                 <SelectTrigger>
//                                     <SelectValue placeholder="Select Product Code" />
//                                 </SelectTrigger>
//                                 <SelectContent>
//                                     {productCodes.map(code => (
//                                         <SelectItem key={code.product_code} value={code.product_code}>
//                                             {code.product_code}
//                                         </SelectItem>
//                                     ))}
//                                 </SelectContent>
//                             </Select>
//                         </div>

//                         {/* <div className="space-y-2">
//                             <label className="text-sm font-medium">Product Name</label>
//                             <Input
//                                 name="product_name"
//                                 value={newProduct.product_name}
//                                 onChange={handleNewProductChange}
//                                 placeholder="Product Name"
//                             />
//                         </div> */}

//                         <div className="space-y-2">
//                             <label className="text-sm font-medium">Price</label>
//                             <Input
//                                 name="price"
//                                 type="number"
//                                 value={newProduct.price}
//                                 onChange={handleNewProductChange}
//                                 placeholder="Price"
//                             />
//                         </div>

//                         <div className="space-y-2">
//                             <label className="text-sm font-medium">Status</label>
//                             <Select
//                                 name="status"
//                                 value={newProduct.status}
//                                 onValueChange={(value) => handleNewProductChange({ target: { name: 'status', value }})}
//                             >
//                                 <SelectTrigger>
//                                     <SelectValue placeholder="Select Status" />
//                                 </SelectTrigger>
//                                 <SelectContent>
//                                     <SelectItem value="ACTIVE">Active</SelectItem>
//                                     <SelectItem value="INACTIVE">Inactive</SelectItem>
//                                 </SelectContent>
//                             </Select>
//                         </div>

//                         <div className="space-y-2">
//                             <label className="text-sm font-medium">Billing Type</label>
//                             <Input
//                                 name="billingType"
//                                 value={newProduct.billingType}
//                                 onChange={handleNewProductChange}
//                                 placeholder="Billing Type"
//                             />
//                         </div>

//                         <div className="space-y-2">
//                             <label className="text-sm font-medium">Billing Method</label>
//                             <Input
//                                 name="billingMethod"
//                                 value={newProduct.billingMethod}
//                                 onChange={handleNewProductChange}
//                                 placeholder="Billing Method"
//                             />
//                         </div>

//                         <div className="space-y-2">
//                             <label className="text-sm font-medium">Discounting</label>
//                             <Input
//                                 name="discounting"
//                                 type="number"
//                                 value={newProduct.discounting}
//                                 onChange={handleNewProductChange}
//                                 placeholder="Discounting"
//                                 step="0.01"
//                                 min="0"
//                             />
//                         </div>
//                     </div>

//                     <div className="space-y-2">
//                         <label className="text-sm font-medium">Description</label>
//                         <Textarea
//                             name="description"
//                             value={newProduct.description}
//                             onChange={handleNewProductChange}
//                             placeholder="Description"
//                             className="h-24"
//                         />
//                     </div>

//                     <div className="flex justify-end space-x-2">
//                         <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
//                             Cancel
//                         </Button>
//                         <Button type="submit">Add Product</Button>
//                     </div>
//                 </form>
//             </CardContent>
//         </Card>
//     );

//     return (
//         <Card className="w-full">
//             <CardHeader className="flex flex-row items-center justify-between">
//                 <CardTitle>Products</CardTitle>
//                 <Button onClick={() => setShowAddForm(true)} className="ml-auto">
//                     <Plus className="mr-2 h-4 w-4" /> Add Product
//                 </Button>
//             </CardHeader>
//             <CardContent>
//                 {showAddForm && <ProductForm />}

//                 <div className="rounded-md border">
//                     <Table>
//                         <TableHeader>
//                             <TableRow>
//                                 <TableHead>Product Code</TableHead>
//                                 {/* <TableHead>Product Name</TableHead> */}
//                                 <TableHead>Description</TableHead>
//                                 <TableHead>Billing Method</TableHead>
//                                 <TableHead>Billing Type</TableHead>
//                                 <TableHead>Discounting</TableHead>
//                                 <TableHead>Price</TableHead>
//                                 <TableHead>Status</TableHead>
//                                 <TableHead>Actions</TableHead>
//                             </TableRow>
//                         </TableHeader>
//                         <TableBody>
//                             {products.map(product => (
//                                 <TableRow key={product.id}>
//                                     {editingId === product.id ? (
//                                         <>
//                                             <TableCell>
//                                                 <Select
//                                                     value={editData.product_code}
//                                                     onValueChange={(value) => handleInputChange('product_code', value)}
//                                                 >
//                                                     <SelectTrigger>
//                                                         <SelectValue placeholder="Select Product Code" />
//                                                     </SelectTrigger>
//                                                     <SelectContent>
//                                                         {productCodes.map(code => (
//                                                             <SelectItem key={code.product_code} value={code.product_code}>
//                                                                 {code.product_code}
//                                                             </SelectItem>
//                                                         ))}
//                                                     </SelectContent>
//                                                 </Select>
//                                             </TableCell>
//                                             {/* <TableCell>
//                                                 <Input
//                                                     value={editData.product_name}
//                                                     onChange={(e) => handleInputChange('product_name', e.target.value)}
//                                                 />
//                                             </TableCell> */}
//                                             <TableCell>
//                                                 <Textarea
//                                                     value={editData.description}
//                                                     onChange={(e) => handleInputChange('description', e.target.value)}
//                                                 />
//                                             </TableCell>
//                                             <TableCell>
//                                                 <Input
//                                                     value={editData.billingMethod}
//                                                     onChange={(e) => handleInputChange('billingMethod', e.target.value)}
//                                                 />
//                                             </TableCell>
//                                             <TableCell>
//                                                 <Input
//                                                     value={editData.billingType}
//                                                     onChange={(e) => handleInputChange('billingType', e.target.value)}
//                                                 />
//                                             </TableCell>
//                                             <TableCell>
//                                                 <Input
//                                                     type="number"
//                                                     value={editData.discounting}
//                                                     onChange={(e) => handleInputChange('discounting', e.target.value)}
//                                                 />
//                                             </TableCell>
//                                             <TableCell>
//                                                 <Input
//                                                     type="number"
//                                                     value={editData.price}
//                                                     onChange={(e) => handleInputChange('price', e.target.value)}
//                                                 />
//                                             </TableCell>
//                                             <TableCell>
//                                                 <Select
//                                                     value={editData.status}
//                                                     onValueChange={(value) => handleInputChange('status', value)}
//                                                 >
//                                                     <SelectTrigger>
//                                                         <SelectValue />
//                                                     </SelectTrigger>
//                                                     <SelectContent>
//                                                         <SelectItem value="1">Active</SelectItem>
//                                                         <SelectItem value="0">Inactive</SelectItem>
//                                                     </SelectContent>
//                                                 </Select>
//                                             </TableCell>
//                                             <TableCell>
//                                                 <div className="flex space-x-2">
//                                                     <Button
//                                                         variant="outline"
//                                                         size="icon"
//                                                         onClick={() => handleSave(product.id)}
//                                                     >
//                                                         <Save className="h-4 w-4" />
//                                                     </Button>
//                                                     <Button
//                                                         variant="outline"
//                                                         size="icon"
//                                                         onClick={() => setEditingId(null)}
//                                                     >
//                                                         <X className="h-4 w-4" />
//                                                     </Button>
//                                                 </div>
//                                             </TableCell>
//                                         </>
//                                     ) : (
//                                         <>
//                                             <TableCell>{product.product_code}</TableCell>
//                                             {/* <TableCell>{product.product_name}</TableCell> */}
//                                             <TableCell>{product.description}</TableCell>
//                                             <TableCell>{product.billingMethod}</TableCell>
//                                             <TableCell>{product.billingType}</TableCell>
//                                             <TableCell>{product.discounting}</TableCell>
//                                             <TableCell>{product.price}</TableCell>
//                                             <TableCell>{product.status}</TableCell>
//                                             <TableCell>
//                                                 <div className="flex space-x-2">
//                                                     <Button
//                                                         variant="outline"
//                                                         size="icon"
//                                                         onClick={() => handleEdit(product)}
//                                                     >
//                                                         <Edit2 className="h-4 w-4" />
//                                                     </Button>
//                                                     <Button
//                                                         variant="outline"
//                                                         size="icon"
//                                                         onClick={() => handleDelete(product.id)}
//                                                     >
//                                                         <Trash2 className="h-4 w-4" />
//                                                     </Button>
//                                                 </div>
//                                             </TableCell>
//                                         </>
//                                     )}
//                                 </TableRow>
//                             ))}
//                         </TableBody>
//                     </Table>
//                 </div>
//             </CardContent>
//         </Card>
//     );
// };

// export default OrgProducts;


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Edit2, Save, X, Plus, Trash2 } from 'lucide-react';
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const OrgProducts = ({ organizationId }) => {
    const [products, setProducts] = useState([]);
    const [productCodes, setProductCodes] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [editData, setEditData] = useState({});
    const [dialogOpen, setDialogOpen] = useState(false);
    const [newProduct, setNewProduct] = useState({
        // product_name: '',
        product_code: '',
        description: '',
        price: '',
        status: 'ACTIVE',
        billingType: '',
        billingMethod: '',
        discounting: ''
    });

    useEffect(() => {
        fetchProducts();
        fetchProductCodes();
    }, [organizationId]);

    const fetchProducts = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/api/organization/products/${organizationId}`);
            setProducts(response.data.data || []);
        } catch (error) {
            console.error('Error fetching products:', error);
            alert('Failed to fetch products');
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

    const handleEdit = (product) => {
        setEditingId(product.id);
        setEditData(product);
    };

    const handleInputChange = (field, value) => {
        setEditData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleNewProductChange = (e) => {
        const { name, value } = e.target;
        setNewProduct(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = async (productId) => {
        try {
            await axios.put(`http://localhost:3000/api/organization/update-products/${productId}`, editData);
            fetchProducts();
            setEditingId(null);
        } catch (error) {
            console.error('Error updating product:', error);
            alert('Failed to update product');
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`http://localhost:3000/api/organization/create-product/${organizationId}`, {
                ...newProduct,
                organization_id: organizationId
            });
            fetchProducts();
            setDialogOpen(false);
            setNewProduct({
                // product_name: '',
                product_code: '',
                description: '',
                price: '',
                status: 'ACTIVE',
                billingType: '',
                billingMethod: '',
                discounting: ''
            });
        } catch (error) {
            console.error('Error adding product:', error);
            alert('Failed to add product');
        }
    };

    const handleDelete = async (productId) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await axios.delete(`http://localhost:3000/api/organization/delete-product/${productId}`);
                fetchProducts();
            } catch (error) {
                console.error('Error deleting product:', error);
                alert('Failed to delete product');
            }
        }
    };

    const ProductForm = () => (
        <form onSubmit={handleAdd} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Product Code</label>
                    <Select
                        name="product_code"
                        value={newProduct.product_code}
                        onValueChange={(value) => handleNewProductChange({ target: { name: 'product_code', value }})}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select Product Code" />
                        </SelectTrigger>
                        <SelectContent>
                            {productCodes.map(code => (
                                <SelectItem key={code.product_code} value={code.product_code}>
                                    {code.product_code}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* <div className="space-y-2">
                    <label className="text-sm font-medium">Product Name</label>
                    <Input
                        name="product_name"
                        value={newProduct.product_name}
                        onChange={handleNewProductChange}
                        placeholder="Product Name"
                    />
                </div>
 */}
                <div className="space-y-2">
                    <label className="text-sm font-medium">Price</label>
                    <Input
                        name="price"
                        type="number"
                        value={newProduct.price}
                        onChange={handleNewProductChange}
                        placeholder="Price"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Status</label>
                    <Select
                        name="status"
                        value={newProduct.status}
                        onValueChange={(value) => handleNewProductChange({ target: { name: 'status', value }})}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ACTIVE">Active</SelectItem>
                            <SelectItem value="INACTIVE">Inactive</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Billing Type</label>
                    <Input
                        name="billingType"
                        value={newProduct.billingType}
                        onChange={handleNewProductChange}
                        placeholder="Billing Type"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Billing Method</label>
                    <Input
                        name="billingMethod"
                        value={newProduct.billingMethod}
                        onChange={handleNewProductChange}
                        placeholder="Billing Method"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Discounting</label>
                    <Input
                        name="discounting"
                        type="number"
                        value={newProduct.discounting}
                        onChange={handleNewProductChange}
                        placeholder="Discounting"
                        step="0.01"
                        min="0"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea
                    name="description"
                    value={newProduct.description}
                    onChange={handleNewProductChange}
                    placeholder="Description"
                    className="h-24"
                />
            </div>

            <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancel
                </Button>
                <Button type="submit">Add Product</Button>
            </div>
        </form>
    );

    return (
        <Card className="w-full">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Products</CardTitle>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> Add Product
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Add New Product</DialogTitle>
                        </DialogHeader>
                        <ProductForm />
                    </DialogContent>
                </Dialog>
            </CardHeader>
            <CardContent>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Product Code</TableHead>
                                {/* <TableHead>Product Name</TableHead> */}
                                <TableHead>Description</TableHead>
                                <TableHead>Billing Method</TableHead>
                                <TableHead>Billing Type</TableHead>
                                <TableHead>Discounting</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {products.map(product => (
                                <TableRow key={product.id}>
                                    {editingId === product.id ? (
                                        <>
                                            <TableCell>
                                                <Select
                                                    value={editData.product_code}
                                                    onValueChange={(value) => handleInputChange('product_code', value)}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select Product Code" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {productCodes.map(code => (
                                                            <SelectItem key={code.product_code} value={code.product_code}>
                                                                {code.product_code}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </TableCell>
                                            {/* <TableCell>
                                                <Input
                                                    value={editData.product_name}
                                                    onChange={(e) => handleInputChange('product_name', e.target.value)}
                                                />
                                            </TableCell> */}
                                            <TableCell>
                                                <Textarea
                                                    value={editData.description}
                                                    onChange={(e) => handleInputChange('description', e.target.value)}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Input
                                                    value={editData.billingMethod}
                                                    onChange={(e) => handleInputChange('billingMethod', e.target.value)}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Input
                                                    value={editData.billingType}
                                                    onChange={(e) => handleInputChange('billingType', e.target.value)}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Input
                                                    type="number"
                                                    value={editData.discounting}
                                                    onChange={(e) => handleInputChange('discounting', e.target.value)}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Input
                                                    type="number"
                                                    value={editData.price}
                                                    onChange={(e) => handleInputChange('price', e.target.value)}
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
                                                        <SelectItem value="1">Active</SelectItem>
                                                        <SelectItem value="0">Inactive</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex space-x-2">
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        onClick={() => handleSave(product.id)}
                                                    >
                                                        <Save className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        onClick={() => setEditingId(null)}
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </>
                                    ) : (
                                        <>
                                            <TableCell>{product.product_code}</TableCell>
                                            {/* <TableCell>{product.product_name}</TableCell> */}
                                            <TableCell>{product.description}</TableCell>
                                            <TableCell>{product.billingMethod}</TableCell>
                                            <TableCell>{product.billingType}</TableCell>
                                            <TableCell>{product.discounting}</TableCell>
                                            <TableCell>{product.price}</TableCell>
                                            <TableCell>{product.status}</TableCell>
                                            <TableCell>
                                                <div className="flex space-x-2">
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        onClick={() => handleEdit(product)}
                                                    >
                                                        <Edit2 className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        onClick={() => handleDelete(product.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
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

export default OrgProducts;