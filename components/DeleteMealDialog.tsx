'use client'
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useDeleteProductMutation } from "@/redux/meal/mealApi";
import { Trash2 } from "lucide-react";

import React from "react";
import toast from "react-hot-toast";

interface AddOn {
  name: string;
  price: number;
  _id: string;
}

interface CustomizationOptions {
  removeIngredients: string[];
  addOns: AddOn[];
  spiceLevel: string[];
  noteToChef: boolean;
}

interface NutritionalInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface IMeal {
  _id: string;
  name: string;
  providerId: string;
  ingredients: string[];
  portionSize: string;
  price: number;
  image: string;
  category: string;
  description: string;
  preparationTime: number;
  isAvailable: boolean;
  customizationOptions: CustomizationOptions;
  nutritionalInfo: NutritionalInfo;
  ratings: {
    average: number;
    count: number;
    reviews: {
      userId: string;
      rating: number;
      comment: string;
      date: Date;
    }[];
  };
  quantity: number;
}


const DeleteMealDialog = ({ meal }: { meal: IMeal }) => {
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);
  const [deleteProduct, { isLoading: isDeleteLoading }] =
    useDeleteProductMutation();

  const handleDelete = async (productId: string) => {
    try {
      const res = await deleteProduct(productId).unwrap();
      if (res.success) {
        toast.success(res.message || "Product deleted successfully!");
      } else {
        toast.info(res.message || "Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product. Please try again.");
    } finally {
      setIsDeleteOpen(false);
    }
  };

  return (
    <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="destructive">
        <Trash2 size={14} />Delete
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription>This action cannot be undone.</DialogDescription>
        </DialogHeader>
        <div className="mt-4 flex justify-between">
          <Button
            variant="outline"
            onClick={() => setIsDeleteOpen(false)}
            className="cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => handleDelete(meal._id!)}
            disabled={isDeleteLoading}
            className="cursor-pointer hover:bg-red-800"
          >
            {isDeleteLoading ? "Deleting..." : "Confirm Delete"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteMealDialog;
