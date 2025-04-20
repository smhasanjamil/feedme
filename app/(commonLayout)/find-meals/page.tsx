'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useGetAllMealsQuery } from '@/redux/meal/mealApi';
import { Skeleton } from '@/components/ui/skeleton';
import { Star, Search, Filter, ChefHat } from 'lucide-react';

export default function FindMealsPage() {
  const router = useRouter();
  const { data: mealData, isLoading, isError } = useGetAllMealsQuery({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // Filter meals based on search and category
  const filteredMeals = mealData?.data?.filter((meal) => {
    const matchesSearch = searchTerm === '' || 
      meal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      meal.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !selectedCategory || meal.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  }) || [];
  
  // Get all unique categories
  const categories = mealData?.data ? 
    Array.from(new Set(mealData.data.map(meal => meal.category))) : 
    [];
  
  const handleMealSelect = (mealId) => {
    router.push(`/order/${mealId}`);
  };
  
  const renderRating = (meal) => {
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
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">Find Meals</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <CardContent className="p-4">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }
  
  if (isError) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <h1 className="text-3xl font-bold mb-4">Error Loading Meals</h1>
        <p className="text-gray-600 mb-6">We're having trouble loading the available meals. Please try again later.</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Find Meals</h1>
      
      {/* Search and filters */}
      <div className="mb-8 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search meals by name or description..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(null)}
          >
            All
          </Button>
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>
      
      {/* Meals grid */}
      {filteredMeals.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-medium mb-4">No meals found</h2>
          <p className="text-gray-500 mb-6">Try adjusting your search or filters</p>
          <Button onClick={() => {setSearchTerm(''); setSelectedCategory(null);}}>
            Show All Meals
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMeals.map((meal) => (
            <Card 
              key={meal._id} 
              className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => handleMealSelect(meal._id)}
            >
              <div className="aspect-video relative">
                <img
                  src={meal.image}
                  alt={meal.name}
                  className="object-cover w-full h-full"
                />
                <Badge 
                  className="absolute top-2 right-2 bg-white text-black hover:bg-white"
                  variant="secondary"
                >
                  {meal.category}
                </Badge>
              </div>
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-lg">{meal.name}</h3>
                  <span className="text-red-500 font-semibold">${meal.price.toFixed(2)}</span>
                </div>
                
                <p className="text-gray-600 text-sm line-clamp-2 mb-2">{meal.description}</p>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <ChefHat className="h-4 w-4" />
                    <span>
                      {typeof meal.providerId === 'object' && meal.providerId?.name
                        ? meal.providerId.name
                        : (typeof meal.providerId === 'string'
                            ? meal.providerId
                            : 'Unknown Provider')}
                    </span>
                  </div>
                  {renderRating(meal)}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 