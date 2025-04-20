'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Meal {
  id: string;
  name: string;
  description: string;
  price: number;
  rating: number;
  provider: string;
  image: string;
}

export default function FindMealsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRating, setSelectedRating] = useState('');
  const [selectedProvider, setSelectedProvider] = useState('');
  const [meals, setMeals] = useState<Meal[]>([]);

  const mockMeals: Meal[] = [
    {
      id: '1',
      name: 'Healthy Buddha Bowl',
      description: 'Fresh vegetables with quinoa and tahini dressing',
      price: 12.99,
      rating: 4.5,
      provider: 'Healthy Eats',
      image: '/meals/buddha-bowl.jpg',
    },
    {
      id: '2',
      name: 'Grilled Salmon with Asparagus',
      description: 'Fresh Atlantic salmon with roasted asparagus and lemon butter sauce',
      price: 18.99,
      rating: 4.8,
      provider: 'Fresh Kitchen',
      image: '/meals/salmon.jpg',
    },
    {
      id: '3',
      name: 'Vegetarian Pasta Primavera',
      description: 'Al dente pasta with seasonal vegetables in a light cream sauce',
      price: 14.99,
      rating: 4.2,
      provider: 'Home Cooks',
      image: '/meals/pasta.jpg',
    },
    {
      id: '4',
      name: 'Beef Stir Fry',
      description: 'Tender beef strips with mixed vegetables in a savory soy sauce',
      price: 16.99,
      rating: 4.6,
      provider: 'Healthy Eats',
      image: '/meals/stir-fry.jpg',
    },
    {
      id: '5',
      name: 'Mediterranean Platter',
      description: 'Hummus, falafel, tabbouleh, and pita bread with tzatziki sauce',
      price: 15.99,
      rating: 4.7,
      provider: 'Fresh Kitchen',
      image: '/meals/mediterranean.jpg',
    },
    {
      id: '6',
      name: 'Chicken Caesar Salad',
      description: 'Crisp romaine lettuce with grilled chicken, parmesan, and Caesar dressing',
      price: 13.99,
      rating: 4.3,
      provider: 'Home Cooks',
      image: '/meals/caesar-salad.jpg',
    }
  ];

  useEffect(() => {
    setMeals(mockMeals);
  }, []);

  const handleSearch = () => {
    let filteredMeals = [...mockMeals];
    
    if (searchQuery) {
      filteredMeals = filteredMeals.filter(meal => 
        meal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        meal.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (selectedRating) {
      filteredMeals = filteredMeals.filter(meal => 
        meal.rating >= parseInt(selectedRating)
      );
    }
    
    if (selectedProvider) {
      filteredMeals = filteredMeals.filter(meal => 
        meal.provider === selectedProvider
      );
    }
    
    setMeals(filteredMeals);
  };

  const handleMealClick = (mealId: string) => {
    router.push(`/order/${mealId}`);
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Find Meals</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Input
          placeholder="Search meals..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="col-span-2"
        />
        <Select value={selectedRating} onValueChange={setSelectedRating}>
          <SelectTrigger>
            <SelectValue placeholder="Rating" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">5+ Stars</SelectItem>
            <SelectItem value="4">4+ Stars</SelectItem>
            <SelectItem value="3">3+ Stars</SelectItem>
          </SelectContent>
        </Select>
        <Select value={selectedProvider} onValueChange={setSelectedProvider}>
          <SelectTrigger>
            <SelectValue placeholder="Provider" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Healthy Eats">Healthy Eats</SelectItem>
            <SelectItem value="Fresh Kitchen">Fresh Kitchen</SelectItem>
            <SelectItem value="Home Cooks">Home Cooks</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={handleSearch} className="w-full">Search</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {meals.map((meal) => (
          <Card 
            key={meal.id} 
            className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-200"
            onClick={() => handleMealClick(meal.id)}
          >
            <div className="aspect-video relative">
              <img
                src={meal.image}
                alt={meal.name}
                className="object-cover w-full h-full"
              />
            </div>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>{meal.name}</span>
                <span className="text-lg font-semibold">${meal.price}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-2">{meal.description}</p>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <span className="text-yellow-400">★</span>
                  <span className="ml-1">{meal.rating}</span>
                </div>
                <span className="text-sm text-gray-500">{meal.provider}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 