'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { use } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { useGetMealByIdQuery } from '@/redux/meal/mealApi';
import { Skeleton } from '@/components/ui/skeleton';
import { Clock, Utensils, DollarSign, Star, ChefHat, CheckCircle2, ShoppingCart } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'react-hot-toast';
import { useAppSelector } from '@/redux/hooks';
import { currentUser } from '@/redux/features/auth/authSlice';
import { MealDetails as MealDetailsType, CustomizationOptions } from '../../../order/[mealId]/addToCartUtils';
import AddToCartButton from '../../../order/[mealId]/AddToCartButton';

// Meal interface used for API response typing
type Meal = {
  _id: string;
  name: string;
  description: string;
  price: number;
  providerId: string | {
    _id: string;
    name: string;
    email: string;
  };
  providerName?: string;
  ingredients: string[];
  portionSize: string;
  image: string;
  category: string;
  preparationTime: number;
  isAvailable: boolean;
  rating?: number;
  reviewCount?: number;
  ratings?: {
    average: number;
    count: number;
    reviews: Array<{
      userId: string;
      rating: number;
      comment: string;
      createdAt: string;
    }>;
  };
  nutritionalInfo: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  customizationOptions: {
    removeIngredients: string[];
    addOns: {
      name: string;
      price: number;
      _id: string;
    }[];
    spiceLevel: string[];
    noteToChef: boolean;
  };
}

const LoadingSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <Skeleton className="aspect-video w-full" />
        <Skeleton className="h-10 w-3/4 mt-4" />
        <Skeleton className="h-4 w-full mt-2" />
        <Skeleton className="h-4 w-full mt-2" />
        <Skeleton className="h-4 w-3/4 mt-2" />
      </div>
      <div className="space-y-6">
        <Skeleton className="h-10 w-1/4" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  );
};

export default function OrderPage({ params }: { params: Promise<{ mealId: string }> }) {
  const router = useRouter();
  const { mealId } = use(params);
  const user = useAppSelector(currentUser);
  
  const { data: mealData, isLoading, isError } = useGetMealByIdQuery(mealId);
  const meal = mealData?.data;

  const [quantity, setQuantity] = useState(1);
  const [noteToChef, setNoteToChef] = useState('');
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [removedIngredients, setRemovedIngredients] = useState<string[]>([]);
  const [spiceLevel, setSpiceLevel] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');
  const [deliveryAddress, setDeliveryAddress] = useState<string>('');
  const [availableDates, setAvailableDates] = useState<Array<{date: string, day: number, available: number}>>([]);
  const [currentMonth, setCurrentMonth] = useState<string>('');

  // Initialize calendar data
  useEffect(() => {
    // Generate the next 7 days for delivery dates
    const dates = [];
    const today = new Date();
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                        'July', 'August', 'September', 'October', 'November', 'December'];
    
    setCurrentMonth(`${monthNames[today.getMonth()]} ${today.getFullYear()}`);
    
    // Start from tomorrow
    for (let i = 1; i <= 7; i++) {
      const date = new Date();
      date.setDate(today.getDate() + i);
      
      dates.push({
        date: date.toISOString().split('T')[0],
        day: date.getDate(),
        available: 10 // Mock availability
      });
    }
    
    setAvailableDates(dates);
    setSelectedDate(dates[0].date); // Select first date by default
  }, []);

  const timeSlots = [
    '9 AM - 10 AM', '10 AM - 11 AM', '11 AM - 12 PM', 
    '12 PM - 1 PM', '1 PM - 2 PM', '2 PM - 3 PM',
    '3 PM - 4 PM', '4 PM - 5 PM', '5 PM - 6 PM'
  ];

  const handleAddOnToggle = (addOnId: string) => {
    setSelectedAddOns(prev => 
      prev.includes(addOnId)
        ? prev.filter(id => id !== addOnId)
        : [...prev, addOnId]
    );
  };

  const handleIngredientToggle = (ingredient: string) => {
    setRemovedIngredients(prev => 
      prev.includes(ingredient)
        ? prev.filter(ing => ing !== ingredient)
        : [...prev, ingredient]
    );
  };

  const calculateTotal = () => {
    if (!meal) return 0;
    
    let total = meal.price * quantity;
    
    // Add price for selected add-ons
    if (selectedAddOns.length > 0 && meal.customizationOptions.addOns) {
      meal.customizationOptions.addOns.forEach((addOn: { _id: string; price: number }) => {
        if (selectedAddOns.includes(addOn._id)) {
          total += addOn.price * quantity;
        }
      });
    }
    
    return total.toFixed(2);
  };

  const handleOrder = () => {
    if (!selectedTimeSlot) {
      alert("Please select a delivery time slot");
      return;
    }
    
    // Construct order object
    const order = {
      mealId: meal?._id,
      mealName: meal?.name,
      quantity,
      customizations: {
        removedIngredients,
        addOns: selectedAddOns,
        spiceLevel,
        noteToChef: noteToChef.trim() || null
      },
      deliveryDate: formatDeliveryDate(selectedDate),
      deliveryTime: selectedTimeSlot,
      deliveryAddress: deliveryAddress.trim() || 'Default Address',
      total: calculateTotal()
    };
    
    console.log('Order submitted:', order);
    
    // Build URL with query parameters for the success page
    const params = new URLSearchParams();
    params.append('mealName', meal?.name || '');
    params.append('deliveryDate', formatDeliveryDate(selectedDate));
    params.append('deliveryTime', selectedTimeSlot);
    params.append('deliveryAddress', deliveryAddress.trim() || 'Default Address');
    params.append('total', `$${calculateTotal()}`);
    if (noteToChef.trim()) {
      params.append('specialInstructions', noteToChef.trim());
    }
    
    // In a real app, would call an API to create the order
    // For now, just redirect to a success page with the order info
    router.push(`/order-success?${params.toString()}`);
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setQuantity(value);
    }
  };

  const formatDeliveryDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long', 
      day: 'numeric'
    });
  };

  const renderRating = (meal: Meal) => {
    const rating = meal.ratings?.average ?? meal.rating ?? 0;
    const reviewCount = meal.ratings?.count ?? meal.reviewCount ?? 0;
    
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    return (
      <div className="flex items-center">
        <div className="flex">
          {[...Array(fullStars)].map((_, i) => (
            <Star key={`full-${i}`} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          ))}
          {hasHalfStar && (
            <div className="relative h-4 w-4">
              <Star className="absolute h-4 w-4 text-gray-300" />
              <Star className="absolute h-4 w-4 fill-yellow-400 text-yellow-400" style={{ clipPath: 'inset(0 50% 0 0)' }} />
            </div>
          )}
          {[...Array(emptyStars)].map((_, i) => (
            <Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />
          ))}
        </div>
        <span className="ml-1 text-sm text-gray-500">({reviewCount})</span>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Customize Your Order</h1>
        <LoadingSkeleton />
      </div>
    );
  }

  if (isError || !meal) {
    return (
      <div className="container mx-auto py-8 text-center">
        <h1 className="text-3xl font-bold mb-4">Meal Not Found</h1>
        <p className="text-gray-600 mb-6">Sorry, we could not find the meal you are looking for.</p>
        <Button onClick={() => router.push('/find-meals')}>
          Browse All Meals
        </Button>
      </div>
    );
  }

  // Ensure meal is properly typed as Meal
  const typedMeal: Meal = meal;

  // Get provider name
  const providerName = typeof typedMeal.providerName === 'string' 
    ? typedMeal.providerName 
    : (typeof typedMeal.providerId === 'object' && typedMeal.providerId?.name)
      ? typedMeal.providerId.name
      : (typeof typedMeal.providerId === 'string')
        ? typedMeal.providerId
        : 'Unknown Provider';

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Customize Your Order</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <div className="aspect-video relative">
            <img
              src={typedMeal.image}
              alt={typedMeal.name}
              className="object-cover w-full h-full"
            />
            <Badge 
              className="absolute top-2 right-2 bg-white text-black hover:bg-white"
              variant="secondary"
            >
              {typedMeal.category}
            </Badge>
          </div>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span className="text-xl">{typedMeal.name}</span>
              <span className="text-lg font-semibold text-red-500">${typedMeal.price.toFixed(2)}</span>
            </CardTitle>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <ChefHat className="h-4 w-4" />
              <span>{providerName}</span>
            </div>
            <div className="mt-1">
              {renderRating(typedMeal)}
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">{typedMeal.description}</p>
            
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {typedMeal.ingredients.map((ingredient: string, index: number) => (
                  <Badge 
                    key={index} 
                    variant="outline"
                    className="bg-gray-50"
                  >
                    {ingredient}
                  </Badge>
                ))}
              </div>
              
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Utensils className="h-4 w-4" />
                  <span>{typedMeal.portionSize}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{typedMeal.preparationTime} mins</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <DollarSign className="h-4 w-4 text-green-500" />
                <span className="font-medium">{typedMeal.nutritionalInfo.calories} cal</span>
                <span>•</span>
                <span className="font-medium">{typedMeal.nutritionalInfo.protein}g protein</span>
                <span>•</span>
                <span className="font-medium">{typedMeal.nutritionalInfo.carbs}g carbs</span>
                <span>•</span>
                <span className="font-medium">{typedMeal.nutritionalInfo.fat}g fat</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Tabs defaultValue="schedule" className="w-full mb-6">
                  <TabsList className="w-full grid grid-cols-2">
                    <TabsTrigger value="schedule">Schedule & Quantity</TabsTrigger>
                    <TabsTrigger value="customize">Customize Meal</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="schedule" className="mt-4">
                    <h3 className="text-lg font-medium mb-4">Choose a date</h3>
                    <div className="mb-2 flex items-center">
                      <span className="text-lg font-medium">{currentMonth}</span>
                      <CheckCircle2 className="ml-2 h-5 w-5 text-green-500" />
                    </div>
                    
                    <div className="grid grid-cols-7 gap-2 text-center mb-6">
                      <div className="text-sm font-medium text-green-600">Sun</div>
                      <div className="text-sm font-medium text-green-600">Mon</div>
                      <div className="text-sm font-medium text-green-600">Tue</div>
                      <div className="text-sm font-medium text-green-600">Wed</div>
                      <div className="text-sm font-medium text-green-600">Thu</div>
                      <div className="text-sm font-medium text-green-600">Fri</div>
                      <div className="text-sm font-medium text-green-600">Sat</div>
                      
                      {availableDates.map((dateObj) => (
                        <div 
                          key={dateObj.date}
                          onClick={() => setSelectedDate(dateObj.date)}
                          className={`cursor-pointer rounded-full p-2 flex flex-col items-center justify-center ${
                            selectedDate === dateObj.date 
                              ? 'bg-green-500 text-white' 
                              : 'hover:bg-green-100'
                          }`}
                        >
                          <div className="text-sm">{dateObj.day}</div>
                          <div className="text-xs">{dateObj.available} left</div>
                        </div>
                      ))}
                    </div>
                    
                    <h3 className="text-lg font-medium mb-4">Delivery Slot</h3>
                    <div className="grid grid-cols-3 gap-2 mb-6">
                      {timeSlots.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setSelectedTimeSlot(slot)}
                          className={`py-2 px-4 rounded-full text-sm ${
                            selectedTimeSlot === slot
                              ? 'bg-green-500 text-white'
                              : 'bg-green-100 text-green-800 hover:bg-green-200'
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                    
                    <h3 className="text-lg font-medium mb-2">Quantity</h3>
                    <div className="flex items-center justify-between mb-6">
                      <span>{availableDates.find(d => d.date === selectedDate)?.available || 10} available</span>
                      <div className="flex items-center">
                        <button
                          type="button"
                          onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                          className="h-10 w-10 rounded-l border border-gray-300 flex items-center justify-center"
                        >
                          -
                        </button>
                        <Input
                          type="number"
                          min="1"
                          value={quantity}
                          onChange={handleQuantityChange}
                          className="h-10 w-16 text-center border-t border-b border-gray-300"
                        />
                        <button
                          type="button"
                          onClick={() => setQuantity(quantity + 1)}
                          className="h-10 w-10 rounded-r border border-gray-300 flex items-center justify-center"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <Label htmlFor="delivery-address" className="text-lg font-medium mb-2 block">Delivery Address</Label>
                      <Textarea
                        id="delivery-address"
                        placeholder="Enter your delivery address"
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        className="mt-2"
                      />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="customize" className="mt-4 space-y-6">
                    {typedMeal.customizationOptions.spiceLevel && typedMeal.customizationOptions.spiceLevel.length > 0 && (
                      <div>
                        <Label className="text-lg font-medium mb-2 block">Spice Level</Label>
                        <RadioGroup value={spiceLevel} onValueChange={setSpiceLevel} className="mt-2">
                          {typedMeal.customizationOptions.spiceLevel.map((level: string, index: number) => (
                            <div key={index} className="flex items-center space-x-2 mb-2">
                              <RadioGroupItem value={level} id={`spice-${level}`} />
                              <Label htmlFor={`spice-${level}`}>{level}</Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </div>
                    )}

                    {typedMeal.customizationOptions.removeIngredients && typedMeal.customizationOptions.removeIngredients.length > 0 && (
                      <div>
                        <Label className="text-lg font-medium mb-2 block">Remove Ingredients</Label>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          {typedMeal.ingredients.map((ingredient: string, index: number) => (
                            <div key={index} className="flex items-center space-x-2">
                              <Checkbox
                                id={`remove-${ingredient}`}
                                checked={removedIngredients.includes(ingredient)}
                                onCheckedChange={() => handleIngredientToggle(ingredient)}
                              />
                              <Label htmlFor={`remove-${ingredient}`}>No {ingredient}</Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {typedMeal.customizationOptions.addOns && typedMeal.customizationOptions.addOns.length > 0 && (
                      <div>
                        <Label className="text-lg font-medium mb-2 block">Add-ons</Label>
                        <div className="space-y-2 mt-2">
                          {typedMeal.customizationOptions.addOns.map((addOn: { _id: string; name: string; price: number }) => (
                            <div key={addOn._id} className="flex items-center justify-between border-b pb-2">
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  id={`addon-${addOn._id}`}
                                  checked={selectedAddOns.includes(addOn._id)}
                                  onCheckedChange={() => handleAddOnToggle(addOn._id)}
                                />
                                <Label htmlFor={`addon-${addOn._id}`}>{addOn.name}</Label>
                              </div>
                              <span className="text-green-600 font-medium">+${addOn.price.toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {typedMeal.customizationOptions.noteToChef && (
                      <div>
                        <Label htmlFor="notes" className="text-lg font-medium mb-2 block">Special Instructions</Label>
                        <Textarea
                          id="notes"
                          placeholder="e.g. Make the gravy extra spicy"
                          value={noteToChef}
                          onChange={(e) => setNoteToChef(e.target.value)}
                          className="mt-2"
                        />
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </div>

              <Separator />

              <div className="pt-4 space-y-4">
                <div className="text-xl font-semibold text-right">
                  Total: ${calculateTotal()}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {meal && (
                    <AddToCartButton
                      meal={{
                        _id: meal._id,
                        name: meal.name,
                        price: meal.price,
                        provider: {
                          _id: typeof meal.providerId === 'string' 
                            ? meal.providerId 
                            : (meal.providerId as any)._id,
                          name: typeof meal.providerId === 'string'
                            ? meal.providerName || 'Provider'
                            : (meal.providerId as any).name
                        }
                      }}
                      quantity={quantity}
                      deliveryDate={selectedDate}
                      deliverySlot={selectedTimeSlot}
                      deliveryAddress={deliveryAddress || "Default Address"}
                      customization={{
                        spiceLevel: spiceLevel || undefined,
                        removedIngredients: removedIngredients.length > 0 ? removedIngredients : undefined,
                        addOns: selectedAddOns.length > 0 && meal.customizationOptions.addOns
                          ? meal.customizationOptions.addOns
                              .filter((addOn: { _id: string }) => selectedAddOns.includes(addOn._id))
                              .map((addOn: { _id: string; name: string; price: number }) => ({
                                name: addOn.name,
                                price: addOn.price,
                              }))
                          : undefined,
                        specialInstructions: noteToChef.trim() || undefined
                      }}
                      onSuccess={() => router.push('/cart')}
                    />
                  )}
                  <Button 
                    onClick={handleOrder} 
                    className="bg-red-500 hover:bg-red-600"
                  >
                    Place Order
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 