import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import {
  Table,
  TableHeader,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import Loader from "../components/Loader";
import { Eye, SquarePen, Trash2, Plus, EllipsisVertical } from "lucide-react";
import {
  getAllProducts,
  createNewProduct,
  updateProduct,
  deleteProduct,
} from "../api/productAction";
import { getAllProductCategories } from "../api/productCategoryAction";

const Product = () => {
  const [proudctData, setProudctData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [openFormDialog, setOpenFormDialog] = useState(false);
  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [viewProduct, setViewProduct] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  // const BASE_URL = import.meta.env.VITE_BASE_URL;
  // console.log("BASE URL:", BASE_URL);
  const form = useForm({
    defaultValues: {
      productName: "",
      description: "",
      price: "",
      category: "",
      stock: 0,
      image: null,
    },
  });

  const fetchProductData = async () => {
    setIsLoading(true);
    try {
      const getProductData = await getAllProducts();
      console.log("getProductData", getProductData);
      setProudctData(getProductData);
    } catch (error) {
      console.log("Something went wrong while fetching product data", error);
    } finally {
      setIsLoading(false);
    }
  };
  const fetchCategoryData = async () => {
    try {
      const getProductCategory = await getAllProductCategories();
      setCategoryData(getProductCategory);
    } catch (error) {
      console.log("Something went wrong while fetching category data", error);
    }
  };
  useEffect(() => {
    fetchProductData();
    fetchCategoryData();
  }, []);
  const createProduct = async (formData) => {
    try {
      setIsLoading(true);
      // const token = localStorage.getItem("token");
      await createNewProduct(formData);
      setOpenFormDialog(false);
      await new Promise((resolve) => setTimeout(resolve, 3000));
      toast.success("Created successful!", {
        description: "Product have been created successfully",
      });
      form.reset();
      await fetchProductData();
    } catch (error) {
      if (error.response?.status === 403) {
        toast.error("Permission Denied", {
          description: error.response.data.message,
        });
      } else {
        console.log("Something went wrong while creating product data", error);
        toast.error("Failed to create product");
      }
    } finally {
      setIsLoading(false);
    }
  };
  const editProduct = (product) => {
    setIsEditingProduct(true);
    setProductToEdit(product);
    form.reset({
      productName: product.productName,
      description: product.description,
      price: product.price,
      category: product.category?._id,
      image: null,
      stock: product.stock,
    });
    setPreviewImage(product.image);

    setOpenFormDialog(true);
  };
  const updateProductData = async (formData) => {
    try {
      setIsLoading(true);
      // const token = localStorage.getItem("token");
      const productId = productToEdit ? productToEdit?.id : null;
      await updateProduct(productId, formData);
      setOpenFormDialog(false);
      await new Promise((resolve) => setTimeout(resolve, 3000));
      setIsEditingProduct(false);
      setProductToEdit(null);
      toast.success("Updated successful!", {
        description: "Product have been updated successfully",
      });
      form.reset();
      await fetchProductData();
    } catch (error) {
      if (error.response?.status === 403) {
        toast.error("Permission Denied", {
          description: error.response.data.message,
        });
      } else {
        console.log("Something went wrong while updating product", error);
        toast.error("Failed to update product");
      }
    } finally {
      setIsLoading(false);
    }
  };
  const confirmDeleteProduct = async () => {
    if (!productToDelete) return;
    try {
      setIsLoading(true);
      // const token = localStorage.getItem("token");
      const productId = productToDelete ? productToDelete?.id : null;
      console.log(productId);
      await deleteProduct(productId);
      setOpenDeleteDialog(false);
      await new Promise((resolve) => setTimeout(resolve, 3000));
      toast.success("Deleted successfully!", {
        description: "Product has been deleted successfully.",
      });
      await fetchProductData();
    } catch (error) {
      if (error.response?.status === 403) {
        toast.error("Permission Denied", {
          description: error.response.data.message,
        });
      } else {
        console.error("Something went wrong while deleting product:", error);
        toast.error("Error deleting product");
      }
    } finally {
      setIsLoading(false);
    }
  };
  const handleSubmitProductForm = async (formData) => {
    try {
      setIsLoading(true);
      setOpenFormDialog(false);
      if (isEditingProduct) {
        await updateProductData(formData);
      } else {
        await createProduct(formData);
      }
      console.log("This is formData:", formData);
      handleCloseProductDialog();
    } catch (error) {
      console.error("Error submitting product form:", error);
      toast.error("Failed to submit product");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseProductDialog = () => {
    form.reset();
    setOpenFormDialog(false);
    setIsEditingProduct(false);
    setProductToEdit(null);
    setPreviewImage(null);
    form.reset({
      productName: "",
      description: "",
      price: (0).toFixed(2),
      category: "",
      image: null,
      stock: 0,
    });
  };
  return (
    <>
      {/* Overlay Loader */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-50">
          <Loader />
        </div>
      )}
      {/* Table section */}
      <Card className="mb-4">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-semibold">Products</CardTitle>
              <CardDescription>
                View and manage all available products in the system.
              </CardDescription>
            </div>
            <Button
              className="cursor-pointer"
              onClick={() => setOpenFormDialog(true)}
            >
              <Plus />
              Add New Product
            </Button>
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-gray-100">
              <TableRow>
                <TableHead className="w-[50px]">#</TableHead>
                <TableHead className="w-[150px]">Product ID</TableHead>
                <TableHead className="w-[180px]">Product Name</TableHead>
                <TableHead className="w-[100px]">Image</TableHead>
                <TableHead className="w-[100px]">Category</TableHead>
                <TableHead className="w-[80px]">Stock</TableHead>
                <TableHead className="w-[80px]">Price</TableHead>
                <TableHead className="w-[220px]">Description</TableHead>
                <TableHead className="text-right w-[80px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {proudctData.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-center py-6 text-gray-500"
                  >
                    No products found.
                  </TableCell>
                </TableRow>
              ) : (
                proudctData.map((product, index) => (
                  <TableRow key={product.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{product.id}</TableCell>
                    <TableCell>{product.productName}</TableCell>
                    <TableCell>
                      {product.image ? (
                        <img
                          src={product.image} // use the Cloudinary URL directly
                          alt={product.productName}
                          className="h-10 w-10 object-cover rounded"
                          onError={() =>
                            console.error(
                              `Failed to load image for ${product.productName}`
                            )
                          }
                        />
                      ) : (
                        <span className="text-sm text-muted-foreground">
                          No image
                        </span>
                      )}
                    </TableCell>

                    <TableCell>
                      {product.category?.name || (
                        <span className="text-sm text-muted-foreground">
                          Uncategorized
                        </span>
                      )}
                    </TableCell>
                    <TableCell>{product.stock ? product.stock : 0}</TableCell>
                    <TableCell>
                      {product.price}{" "}
                      <span style={{ fontFamily: "Hanuman, sans-serif" }}>
                        ៛
                      </span>
                    </TableCell>
                    <TableCell>
                      {product.description ? (
                        <span className="text-sm text-gray-700">
                          {product.description}
                        </span>
                      ) : (
                        <span className="text-sm text-muted-foreground">
                          No description
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <EllipsisVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              setViewProduct(product);
                              setOpenViewDialog(true);
                            }}
                          >
                            <Eye />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              editProduct(product);
                            }}
                          >
                            <SquarePen />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            variant="destructive"
                            onClick={() => {
                              setProductToDelete(product);
                              setOpenDeleteDialog(true);
                            }}
                          >
                            <Trash2 />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      {/*Create/Update Dialog*/}
      <Dialog open={openFormDialog} onOpenChange={setOpenFormDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {isEditingProduct ? "Edit Product" : "Create Product"}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form className="space-y-4 pt-2">
              <FormField
                control={form.control}
                name="productName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter product name" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Optional description" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter price"
                        {...field}
                        min={0}
                        step="0.25"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categoryData.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Image</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/png, image/jpeg"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            setPreviewImage(URL.createObjectURL(file));
                            field.onChange(e.target.files);
                          }
                        }}
                      />
                    </FormControl>

                    {previewImage && (
                      <img
                        src={previewImage}
                        alt="Preview"
                        className="h-24 mt-2 rounded object-cover"
                      />
                    )}
                  </FormItem>
                )}
              />
              <DialogFooter className="pt-2">
                <DialogClose asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleCloseProductDialog}
                  >
                    Cancel
                  </Button>
                </DialogClose>
                <Button
                  type="submit"
                  onClick={form.handleSubmit(handleSubmitProductForm)}
                >
                  {isEditingProduct ? "Update" : "Create"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* View Product Dialog */}
      <Dialog open={openViewDialog} onOpenChange={setOpenViewDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Product Details</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-[120px_1fr] gap-y-3 gap-x-4 text-sm pt-2">
            <span className="text-muted-foreground font-medium">
              Product ID:
            </span>
            <span>{viewProduct?.id}</span>

            <span className="text-muted-foreground font-medium">
              Product Name:
            </span>
            <span>{viewProduct?.productName}</span>

            <span className="text-muted-foreground font-medium">Category:</span>
            <span>{viewProduct?.category?.name || "Uncategorized"}</span>

            <span className="text-muted-foreground font-medium">Price:</span>
            <span>
              {viewProduct?.price}{" "}
              <span style={{ fontFamily: "Hanuman, sans-serif" }}>៛</span>
            </span>

            <span className="text-muted-foreground font-medium">
              Description:
            </span>
            <p className="col-span-1 whitespace-pre-line">
              {viewProduct?.description || "No description"}
            </p>

            <span className="text-muted-foreground font-medium">Image:</span>
            {viewProduct?.image ? (
              <img
                src={viewProduct.image} // use Cloudinary URL directly
                alt={viewProduct.productName}
                className="w-20 h-20 object-cover rounded"
              />
            ) : (
              <span>No image</span>
            )}
          </div>
          <DialogFooter className="pt-4">
            <Button variant="ghost" onClick={() => setOpenViewDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Delete Product Dialog */}
      <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
          </DialogHeader>
          <p>
            This will permanently delete the product:{" "}
            <strong>{productToDelete?.productName}</strong>
          </p>
          <DialogFooter>
            <Button
              variant="secondary"
              onClick={() => setOpenDeleteDialog(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteProduct}>
              Yes, Delete it.
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Product;
