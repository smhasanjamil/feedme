"use client";

import { useState, useEffect } from "react";
import { useGetProviderOrdersQuery, useUpdateOrderTrackingMutation, useDeleteOrderMutation } from "@/redux/features/orders/order";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { 
  MoreHorizontal, 
  CalendarIcon, 
  Search, 
  ChevronDown, 
  Check, 
  X, 
  Eye, 
  PackageCheck,
  User,
  DollarSign,
  MapPin,
  Clock,
  Tag,
  PlusCircle,
  MinusCircle,
  Flame
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useSelector } from "react-redux";
import { currentUser } from "@/redux/features/auth/authSlice";

export default function ManageOrdersPage() {
  const user = useSelector(currentUser);
  const providerId = user?.id || "";
  const { data: orders, isLoading, refetch } = useGetProviderOrdersQuery(providerId, {
    skip: !providerId // Skip the query if no providerId is available
  });
  const [updateOrderTracking] = useUpdateOrderTrackingMutation();
  const [deleteOrder] = useDeleteOrderMutation();
  const [mounted, setMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [statusMessage, setStatusMessage] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  // Order status counts
  const statusCounts = orders?.reduce(
    (acc, order) => {
      const status = order.status.toLowerCase();
      if (status === "placed") acc.placed++;
      else if (status === "approved") acc.approved++;
      else if (status === "processed") acc.processed++;
      else if (status === "delivered") acc.delivered++;
      acc.total++;
      return acc;
    },
    { total: 0, placed: 0, approved: 0, processed: 0, delivered: 0 }
  ) || { total: 0, placed: 0, approved: 0, processed: 0, delivered: 0 };

  // Filter orders based on search term
  const filteredOrders = orders?.filter((order) => {
    const searchStr = searchTerm.toLowerCase();
    return (
      order._id?.toLowerCase().includes(searchStr) ||
      order.name?.toLowerCase().includes(searchStr) ||
      order.email?.toLowerCase().includes(searchStr) ||
      order.status?.toLowerCase().includes(searchStr) ||
      order.trackingNumber?.toLowerCase().includes(searchStr)
    );
  });

  // Sort orders by date
  const sortedOrders = filteredOrders?.sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return sortDirection === "desc" ? dateB - dateA : dateA - dateB;
  });

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await updateOrderTracking({
        orderId,
        data: { status: newStatus },
      }).unwrap();
      
      setStatusMessage(`Order status changed to ${newStatus}`);
      setTimeout(() => setStatusMessage(""), 3000);
      
      refetch();
    } catch (error) {
      setStatusMessage("Could not update the order status");
      setTimeout(() => setStatusMessage(""), 3000);
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    try {
      await deleteOrder(orderId).unwrap();
      
      setStatusMessage("Order has been deleted successfully");
      setTimeout(() => setStatusMessage(""), 3000);
      
      refetch();
    } catch (error) {
      setStatusMessage("Could not delete the order");
      setTimeout(() => setStatusMessage(""), 3000);
    }
  };

  const handleViewOrderDetails = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "success";
      case "processed":
        return "default";
      case "approved":
        return "outline";
      case "placed":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "processed":
        return "bg-blue-100 text-blue-800";
      case "approved":
        return "bg-purple-100 text-purple-800";
      case "placed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getSpiceLevelColor = (level: string) => {
    if (!level) return "bg-gray-100 text-gray-600";
    
    switch (level.toLowerCase()) {
      case "mild":
        return "bg-green-50 text-green-700";
      case "medium":
        return "bg-orange-50 text-orange-700";
      case "hot":
        return "bg-red-50 text-red-700";
      case "thai hot":
        return "bg-red-100 text-red-800";
      case "extra hot":
        return "bg-red-200 text-red-900";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  if (!mounted || isLoading) {
    return (
      <div className="space-y-3">
        <h1 className="text-xl font-bold">Orders Management</h1>
        <p className="text-xs text-gray-500">
          Manage order statuses and estimated delivery dates.
        </p>
        <div className="mt-3 h-32 animate-pulse rounded-md bg-gray-100"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold">Orders Management</h1>
        <p className="text-xs text-gray-500">
          Manage order statuses and estimated delivery dates.
        </p>
        
        {statusMessage && (
          <div className="mt-2 rounded bg-green-50 p-2 text-sm text-green-700">
            {statusMessage}
          </div>
        )}
      </div>

      {/* Order Statistics */}
      <div className="grid grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-sm font-medium text-gray-500">Total Orders</h3>
            <p className="mt-2 text-2xl font-bold">{statusCounts.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-sm font-medium text-gray-500">Placed</h3>
            <p className="mt-2 text-2xl font-bold">{statusCounts.placed}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-sm font-medium text-gray-500">Approved</h3>
            <p className="mt-2 text-2xl font-bold">{statusCounts.approved}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-sm font-medium text-gray-500">Processed</h3>
            <p className="mt-2 text-2xl font-bold">{statusCounts.processed}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-sm font-medium text-gray-500">Delivered</h3>
            <p className="mt-2 text-2xl font-bold">{statusCounts.delivered}</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Search Orders</h3>
            <p className="text-xs text-gray-500">Find orders by ID, customer name, or status</p>
            <div className="relative">
              <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search orders..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* All Orders */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">All Orders</h3>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => setSortDirection(sortDirection === "asc" ? "desc" : "asc")}
            >
              Date {sortDirection === "asc" ? "↑" : "↓"}
            </Button>
          </div>
        </div>

        <div className="rounded-md border">
          <div className="grid grid-cols-6 gap-4 bg-gray-50 p-3 text-xs font-medium text-gray-500">
            <div>Order ID</div>
            <div>Customer</div>
            <div>Date</div>
            <div>Payment Status</div>
            <div>Order Stage</div>
            <div className="text-right">Total</div>
          </div>

          {sortedOrders && sortedOrders.length > 0 ? (
            sortedOrders.map((order) => (
              <div key={order._id} className="grid grid-cols-6 gap-4 border-t border-gray-100 p-3 text-sm">
                <div className="truncate text-xs font-medium">
                  {order._id?.substring(0, 12)}...
                </div>
                <div>
                  <div className="text-xs font-medium">{order.name || "N/A"}</div>
                  <div className="text-xs text-gray-500">{order.email || "N/A"}</div>
                </div>
                <div className="flex items-center text-xs text-gray-500">
                  <CalendarIcon className="mr-1 h-3 w-3" />
                  {new Date(order.createdAt).toLocaleDateString()}
                </div>
                <div>
                  <Badge
                    variant={order.transaction?.transactionStatus === "Paid" ? "outline" : "secondary"}
                    className="text-[10px]"
                  >
                    {order.transaction?.transactionStatus || "Pending"}
                  </Badge>
                </div>
                <div>
                  <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
                <div className="flex items-center justify-end gap-2">
                  <span className="text-xs font-medium">
                    ${order.totalPrice?.toFixed(2) || "0.00"}
                  </span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem 
                        className="flex cursor-pointer items-center gap-2 px-2 py-1.5 text-xs"
                        onClick={() => handleViewOrderDetails(order)}
                      >
                        <Eye className="h-3.5 w-3.5" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger className="flex items-center gap-2 text-xs">
                          <PackageCheck className="h-3.5 w-3.5" />
                          Update Status
                        </DropdownMenuSubTrigger>
                        <DropdownMenuSubContent className="w-32">
                          {["Placed", "Approved", "Processed", "Delivered"].map((status) => (
                            <DropdownMenuItem 
                              key={status}
                              className={`flex cursor-pointer items-center justify-between px-2 py-1.5 text-xs ${order.status === status ? 'bg-gray-100' : ''}`}
                              onClick={() => handleStatusChange(order._id, status)}
                            >
                              {status}
                              {order.status === status && <Check className="h-3 w-3" />}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuSubContent>
                      </DropdownMenuSub>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => {
                          if (confirm("Are you sure you want to delete this order?")) {
                            handleDeleteOrder(order._id);
                          }
                        }}
                        className="flex items-center gap-2 px-2 py-1.5 text-xs text-red-600"
                      >
                        <X className="h-3.5 w-3.5" />
                        Delete Order
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))
          ) : (
            <div className="p-6 text-center">
              <p className="text-sm text-gray-500">No orders found</p>
            </div>
          )}
        </div>
      </div>

      {/* Order Details Modal */}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-lg bg-white p-6 shadow-lg">
            {/* Close button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-4 rounded-full p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Modal Header */}
            <div className="mb-6">
              <h2 className="text-xl font-bold">Order Details</h2>
              <p className="text-sm text-gray-500">Complete information about the order</p>
            </div>
            
            <div className="space-y-6">
              {/* Order ID and Date */}
              <div className="flex flex-wrap items-center justify-between gap-2 rounded-md bg-gray-50 p-4">
                <div>
                  <p className="text-xs text-gray-500">Order ID</p>
                  <p className="font-medium">{selectedOrder._id}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Date</p>
                  <p className="font-medium">{new Date(selectedOrder.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Tracking Number</p>
                  <p className="font-medium">{selectedOrder.trackingNumber || "N/A"}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Status</p>
                  <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(selectedOrder.status)}`}>
                    {selectedOrder.status}
                  </span>
                </div>
              </div>

              {/* Customer Information */}
              <div>
                <h3 className="mb-2 flex items-center gap-2 font-medium">
                  <User className="h-4 w-4" />
                  Customer Information
                </h3>
                <div className="rounded-md border p-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <p className="text-xs text-gray-500">Name</p>
                      <p className="font-medium">
                        {selectedOrder.name || 
                         (selectedOrder.customerFirstName && selectedOrder.customerLastName 
                           ? `${selectedOrder.customerFirstName} ${selectedOrder.customerLastName}`
                           : "N/A")}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Email</p>
                      <p className="font-medium">{selectedOrder.email || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Phone</p>
                      <p className="font-medium">{selectedOrder.phone || "N/A"}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipping Information */}
              <div>
                <h3 className="mb-2 flex items-center gap-2 font-medium">
                  <MapPin className="h-4 w-4" />
                  Shipping Information
                </h3>
                <div className="rounded-md border p-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <p className="text-xs text-gray-500">Address</p>
                      <p className="font-medium">{selectedOrder.address || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">City</p>
                      <p className="font-medium">{selectedOrder.city || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Zip Code</p>
                      <p className="font-medium">{selectedOrder.zipCode || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Delivery Date & Time</p>
                      <p className="font-medium">
                        {selectedOrder.deliveryDate ? new Date(selectedOrder.deliveryDate).toLocaleDateString() : 'N/A'}
                        {selectedOrder.deliverySlot ? ` (${selectedOrder.deliverySlot})` : ''}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="mb-2 flex items-center gap-2 font-medium">
                  <PackageCheck className="h-4 w-4" />
                  Order Items
                </h3>
                
                {/* For meals */}
                {selectedOrder.meals && selectedOrder.meals.length > 0 ? (
                  <div className="space-y-4">
                    {selectedOrder.meals.map((item, index) => (
                      <div key={item._id || index} className="overflow-hidden rounded-md border">
                        {/* Meal header */}
                        <div className="border-b bg-gray-50 p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              {item.mealId?.image ? (
                                <div className="relative h-16 w-16 overflow-hidden rounded-md bg-gray-200">
                                  <img 
                                    src={item.mealId.image} 
                                    alt={item.mealId.name}
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                              ) : (
                                <div className="h-16 w-16 rounded-md bg-gray-200"></div>
                              )}
                              <div>
                                <h4 className="font-medium">{item.mealId?.name || "Meal"}</h4>
                                <div className="mt-1 flex flex-wrap items-center gap-2">
                                  <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                                    <Tag className="h-3 w-3" />
                                    {item.mealId?.category || "N/A"}
                                  </span>
                                  {item.mealId?.preparationTime && (
                                    <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                                      <Clock className="h-3 w-3" />
                                      {item.mealId.preparationTime} min
                                    </span>
                                  )}
                                  {item.mealId?.portionSize && (
                                    <span className="text-xs text-gray-500">
                                      {item.mealId.portionSize}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="text-end">
                              <div className="font-medium">${item.price?.toFixed(2) || "0.00"}</div>
                              <div className="text-xs text-gray-500">Qty: {item.quantity}</div>
                            </div>
                          </div>
                          
                          {/* Description if available */}
                          {item.mealId?.description && (
                            <p className="mt-2 text-sm text-gray-600">
                              {item.mealId.description}
                            </p>
                          )}
                        </div>
                        
                        {/* Meal details */}
                        <div className="p-3">
                          {/* Customizations */}
                          {item.customization && (
                            <div className="mb-3 space-y-2">
                              <h5 className="flex items-center gap-1 text-sm font-medium">
                                <Flame className="h-4 w-4 text-orange-500" />
                                Customizations
                              </h5>
                              
                              {/* Spice Level */}
                              {item.customization.spiceLevel && (
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-gray-500">Spice Level:</span>
                                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${getSpiceLevelColor(item.customization.spiceLevel)}`}>
                                    {item.customization.spiceLevel}
                                  </span>
                                </div>
                              )}
                              
                              {/* Removed Ingredients */}
                              {item.customization.removedIngredients && item.customization.removedIngredients.length > 0 && (
                                <div>
                                  <div className="flex items-center gap-1 text-xs text-gray-500">
                                    <MinusCircle className="h-3.5 w-3.5 text-red-500" />
                                    Removed Ingredients:
                                  </div>
                                  <div className="mt-1 flex flex-wrap gap-1">
                                    {item.customization.removedIngredients.map((ingredient, i) => (
                                      <span key={i} className="rounded-full bg-red-50 px-2 py-0.5 text-xs text-red-700">
                                        {ingredient}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                              
                              {/* Add-ons */}
                              {item.customization.addOns && item.customization.addOns.length > 0 && (
                                <div>
                                  <div className="flex items-center gap-1 text-xs text-gray-500">
                                    <PlusCircle className="h-3.5 w-3.5 text-green-500" />
                                    Add-ons:
                                  </div>
                                  <div className="mt-1 space-y-1">
                                    {item.customization.addOns.map((addon, i) => (
                                      <div key={i} className="flex items-center justify-between">
                                        <span className="text-xs">{addon.name}</span>
                                        <span className="text-xs font-medium">+${addon.price?.toFixed(2) || "0.00"}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                          
                          {/* Ingredients */}
                          {item.mealId?.ingredients && item.mealId.ingredients.length > 0 && (
                            <div className="mb-3">
                              <h5 className="text-sm font-medium">Ingredients</h5>
                              <div className="mt-1 flex flex-wrap gap-1">
                                {item.mealId.ingredients.map((ingredient, i) => (
                                  <span key={i} className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700">
                                    {ingredient}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {/* Nutritional Info */}
                          {item.mealId?.nutritionalInfo && (
                            <div>
                              <h5 className="text-sm font-medium">Nutritional Information</h5>
                              <div className="mt-2 grid grid-cols-4 gap-2 text-center">
                                <div className="rounded-md bg-blue-50 p-2">
                                  <p className="text-xs text-gray-500">Calories</p>
                                  <p className="font-medium text-blue-700">{item.mealId.nutritionalInfo.calories || 0}</p>
                                </div>
                                <div className="rounded-md bg-green-50 p-2">
                                  <p className="text-xs text-gray-500">Protein</p>
                                  <p className="font-medium text-green-700">{item.mealId.nutritionalInfo.protein || 0}g</p>
                                </div>
                                <div className="rounded-md bg-yellow-50 p-2">
                                  <p className="text-xs text-gray-500">Carbs</p>
                                  <p className="font-medium text-yellow-700">{item.mealId.nutritionalInfo.carbs || 0}g</p>
                                </div>
                                <div className="rounded-md bg-red-50 p-2">
                                  <p className="text-xs text-gray-500">Fat</p>
                                  <p className="font-medium text-red-700">{item.mealId.nutritionalInfo.fat || 0}g</p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                        
                        {/* Price summary */}
                        <div className="border-t bg-gray-50 p-3">
                          <div className="flex justify-between text-sm">
                            <span className="font-medium">Subtotal</span>
                            <span className="font-medium">
                              ${item.subtotal?.toFixed(2) || (item.price * item.quantity).toFixed(2) || "0.00"}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-md border p-4 text-center text-sm text-gray-500">
                    No items found in this order
                  </div>
                )}
              </div>

              {/* Payment Information */}
              <div>
                <h3 className="mb-2 flex items-center gap-2 font-medium">
                  <DollarSign className="h-4 w-4" />
                  Payment Information
                </h3>
                <div className="rounded-md border p-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <p className="text-sm">Subtotal</p>
                      <p className="text-sm font-medium">${selectedOrder.subtotal?.toFixed(2) || "0.00"}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-sm">Tax</p>
                      <p className="text-sm font-medium">${selectedOrder.tax?.toFixed(2) || "0.00"}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-sm">Shipping</p>
                      <p className="text-sm font-medium">${selectedOrder.shipping?.toFixed(2) || "0.00"}</p>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <p className="text-base font-semibold">Total</p>
                      <p className="text-base font-semibold">${selectedOrder.totalPrice?.toFixed(2) || "0.00"}</p>
                    </div>
                    <div className="mt-2">
                      <p className="text-xs text-gray-500">Payment Status</p>
                      <Badge
                        variant={selectedOrder.transaction?.transactionStatus === "Paid" ? "outline" : "secondary"}
                      >
                        {selectedOrder.transaction?.transactionStatus || "Pending"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tracking Updates */}
              {selectedOrder.trackingUpdates && selectedOrder.trackingUpdates.length > 0 && (
                <div>
                  <h3 className="mb-2 font-medium">Tracking Updates</h3>
                  <div className="space-y-2">
                    {selectedOrder.trackingUpdates.map((update, index) => (
                      <div key={update._id || index} className="rounded-md border p-3">
                        <div className="flex justify-between">
                          <p className="text-sm font-medium">{update.stage}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(update.timestamp).toLocaleString()}
                          </p>
                        </div>
                        <p className="text-sm">{update.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="mt-6 flex justify-end space-x-2">
              <Button 
                variant="outline" 
                onClick={() => setIsModalOpen(false)}
              >
                Close
              </Button>
              <Button 
                onClick={() => {
                  handleStatusChange(selectedOrder._id, 
                    selectedOrder.status === "Delivered" ? "Processed" :
                    selectedOrder.status === "Processed" ? "Delivered" :
                    selectedOrder.status === "Approved" ? "Processed" : "Approved"
                  );
                  setIsModalOpen(false);
                }}
              >
                {selectedOrder.status === "Delivered" ? "Mark as Processed" :
                 selectedOrder.status === "Processed" ? "Mark as Delivered" :
                 selectedOrder.status === "Approved" ? "Mark as Processed" : "Approve Order"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 