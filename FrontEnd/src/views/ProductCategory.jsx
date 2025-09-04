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
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  getAllProductCategories,
  getProductCategoryById,
  createNewProductCategory,
  updateProductCategory,
  deleteProductCategory,
} from "../api/productCategoryAction";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import Loader from "../components/Loader";
import { Eye, SquarePen, Trash2, Plus, EllipsisVertical } from "lucide-react";

const ProductCategory = () => {
  const [categoryData, setCategoryData] = useState([]);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [categoryToEdit, setCategoryToEdit] = useState(null);
  const [viewCategory, setViewCategory] = useState(null);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [isEditingCategory, setIsEditingCategory] = useState(false);
  const [openFormDialog, setOpenFormDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm({
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const fetchProductCategoryData = async () => {
    setIsLoading(true);
    try {
      const getCategoryData = await getAllProductCategories();
      console.log("getCategoryData:", getCategoryData);
      // await new Promise((resolve) => setTimeout(resolve, 3000));
      setCategoryData(getCategoryData);
    } catch (error) {
      console.log(
        "Something went wrong while fetching product category data:",
        error
      );
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchProductCategoryData();
  }, []);

  const createProductCategory = async (formData) => {
    try {
      setIsLoading(true);
      // const token = localStorage.getItem("token");
      await createNewProductCategory(formData);
      setOpenFormDialog(false);
      await new Promise((resolve) => setTimeout(resolve, 3000));
      toast.success("Created successful!", {
        description: "Product category have been created successfully.",
      });
      form.reset();
      await fetchProductCategoryData();
    } catch (error) {
      if (error.response?.status === 403) {
        toast.error("Permission Denied", {
          description: error.response.data.message,
        });
      } else {
        console.error(
          "Something went wrong while creating product category:",
          error
        );
        toast.error("Failed to create product category.");
      }
    } finally {
      setIsLoading(false);
    }
  };
  const editProductCategory = (category) => {
    setIsEditingCategory(true);
    setOpenFormDialog(true);
    setCategoryToEdit(category);
    form.reset({
      name: category.name,
      description: category.description,
    });
  };
  const updateProductCategoryData = async (formData) => {
    try {
      setIsLoading(true);
      // const token = localStorage.getItem("token");
      const categoryId = categoryToEdit ? categoryToEdit?.id : null;
      await updateProductCategory(categoryId, formData);
      setOpenFormDialog(false);
      await new Promise((resolve) => setTimeout(resolve, 3000));
      setIsEditingCategory(false);
      setCategoryToEdit(null);
      toast.success("Updated successful!", {
        description: "Product category has updated successfully.",
      });
      form.reset();
      await fetchProductCategoryData();
    } catch (error) {
      if (error.response?.status === 403) {
        toast.error("Permission Denied", {
          description: error.response.data.message,
        });
      } else {
        console.error(
          "Something went wrong while updating product category:",
          error
        );
        toast.error("Error updating product category");
      }
    } finally {
      setIsLoading(false);
    }
  };
  const confirmDeleteCategory = async () => {
    if (!categoryToDelete) return;
    try {
      setIsLoading(true);
      // const token = localStorage.getItem("token");
      const categoryId = categoryToDelete ? categoryToDelete?.id : null;
      await deleteProductCategory(categoryId);
      setOpenDeleteDialog(false);
      await new Promise((resolve) => setTimeout(resolve, 3000));
      toast.success("Deleted successful!", {
        description: "Product category have deleted successfully.",
      });
      await fetchProductCategoryData();
    } catch (error) {
      if (error.response?.status === 403) {
        toast.error("Permission Denied", {
          description: error.response.data.message,
        });
      } else {
        console.error(
          "Something went wrong while deleting product category:",
          error
        );
        toast.error("Error deleting product category");
      }
    } finally {
      setIsLoading(false);
    }
  };
  const handleSubmitForm = async (formData) => {
    if (isEditingCategory) {
      await updateProductCategoryData(formData);
    } else {
      await createProductCategory(formData);
    }
    handleClose();
  };
  const handleClose = () => {
    form.reset({
      name: "",
      description: "",
    });
    setCategoryToEdit(null);
    setOpenFormDialog(false);
    setIsEditingCategory(false);
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
              <CardTitle className="text-2xl font-semibold">
                Product Categories
              </CardTitle>
              <CardDescription>
                View and manage all available product category types in the
                system.
              </CardDescription>
            </div>
            <Button
              className="cursor-pointer"
              onClick={() => setOpenFormDialog(true)}
            >
              <Plus />
              Add New Category
            </Button>
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-gray-100">
              <TableRow>
                <TableHead className="w-[50px]">#</TableHead>
                <TableHead className="w-[150px]">Category ID</TableHead>
                <TableHead className="w-[180px]">Category Name</TableHead>
                <TableHead className="w-[220px]">Description</TableHead>
                <TableHead className="w-[80px] text-right" />
              </TableRow>
            </TableHeader>

            <TableBody>
              {categoryData.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center py-6 text-gray-500"
                  >
                    No categories found.
                  </TableCell>
                </TableRow>
              ) : (
                categoryData.map((category, index) => (
                  <TableRow key={category.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{category.id}</TableCell>
                    <TableCell>{category.name}</TableCell>
                    <TableCell>
                      {category.description ? (
                        <span className="text-sm text-gray-700">
                          {category.description}
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
                            className="h-8 w-8 cursor-pointer"
                          >
                            <EllipsisVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => {
                              setViewCategory(category);
                              setOpenViewDialog(true);
                            }}
                          >
                            <Eye />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => {
                              editProductCategory(category);
                            }}
                          >
                            <SquarePen />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="cursor-pointer"
                            variant="destructive"
                            onClick={() => {
                              setCategoryToDelete(category);
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
      {/* Create/Update Form Dialog */}
      <Dialog open={openFormDialog} onOpenChange={setOpenFormDialog}>
        <DialogContent className="sm:max-w-[500px]">
          {/* Dialog Header */}
          <DialogHeader>
            <DialogTitle>
              {isEditingCategory
                ? "Edit Product Category"
                : "Create Product Category"}
            </DialogTitle>
          </DialogHeader>
          {/* Form Section */}
          <Form {...form}>
            <form className="space-y-4 pt-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter category name" {...field} />
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
              {/* Footer Buttons */}
              <DialogFooter className="pt-2">
                <DialogClose asChild>
                  <Button type="button" variant="ghost" onClick={handleClose}>
                    Close
                  </Button>
                </DialogClose>
                <Button
                  type="submit"
                  onClick={form.handleSubmit(handleSubmitForm)}
                >
                  {isEditingCategory ? "Update" : "Create"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      {/*  Delete Dialog */}
      <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
          </DialogHeader>
          <p>
            This will permanently delete the category:{" "}
            <strong>{categoryToDelete?.name}</strong>
          </p>
          <DialogFooter>
            <Button
              variant="secondary"
              onClick={() => setOpenDeleteDialog(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteCategory}>
              Yes, Delete it.
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/*  View Dialog*/}
      <Dialog open={openViewDialog} onOpenChange={setOpenViewDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Category Details</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-[100px_1fr] gap-y-3 gap-x-4 text-sm pt-2">
            <span className="text-muted-foreground font-medium">
              Category ID:
            </span>
            <span>{viewCategory?.id}</span>

            <span className="text-muted-foreground font-medium">
              Category Name:
            </span>
            <span>{viewCategory?.name}</span>

            <span className="text-muted-foreground font-medium">
              Description:
            </span>
            <p className="col-span-1 whitespace-pre-line">
              {viewCategory?.description || "No description"}
            </p>
          </div>
          <DialogFooter className="pt-4">
            <Button variant="ghost" onClick={() => setOpenViewDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProductCategory;
