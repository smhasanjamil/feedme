import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MealDetails, CustomizationOptions, useAddToCart } from './addToCartUtils';
import { Loader2 } from 'lucide-react';

interface AddToCartButtonProps {
  meal: MealDetails;
  quantity: number;
  deliveryDate: string;
  deliverySlot: string;
  customization?: CustomizationOptions;
  deliveryAddress?: string;
  onSuccess?: () => void;
}

const AddToCartButton = ({
  meal,
  quantity,
  deliveryDate,
  deliverySlot,
  customization,
  deliveryAddress = "Default Address",
  onSuccess
}: AddToCartButtonProps) => {
  const { addToCart, isLoading } = useAddToCart();
  const [adding, setAdding] = useState(false);

  const handleAddToCart = async () => {
    setAdding(true);
    try {
      const success = await addToCart(
        meal,
        quantity,
        deliveryDate,
        deliverySlot,
        customization,
        deliveryAddress
      );
      
      if (success && onSuccess) {
        onSuccess();
      }
    } finally {
      setAdding(false);
    }
  };

  return (
    <Button 
      onClick={handleAddToCart} 
      disabled={isLoading || adding} 
      className="w-full bg-primary hover:bg-primary/90 text-white py-2 rounded-md"
    >
      {(isLoading || adding) ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Adding to Cart...
        </>
      ) : (
        'Add to Cart'
      )}
    </Button>
  );
};

export default AddToCartButton; 