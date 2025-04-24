"use client";

import { useState, useEffect } from "react";
import { useGetProviderOrdersQuery, useUpdateOrderTrackingMutation, useDeleteOrderMutation } from "@/redux/features/orders/order";
import type { Order } from "@/redux/features/orders/order";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { 
  MoreHorizontal, 
  CalendarIcon, 
  Search, 
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
  Flame,
  RefreshCw,
  Trash2
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
import { currentUser, currentToken } from "@/redux/features/auth/authSlice";

export default function ManageOrdersPage() {
  const user = useSelector(currentUser);
  const token = useSelector(currentToken);
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
  const [updateMessage, setUpdateMessage] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState({ type: "", title: "", message: "" });
  
  // Function to display toast notification
  const displayToast = (type: "success" | "error", title: string, message: string) => {
    setToastMessage({ type, title, message });
    setShowToast(true);
    
    // Auto hide toast after 3 seconds
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };
  
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

  const handleStatusChange = async (orderId: string, newStatus: string, message: string) => {
    try {
      console.log(`Updating order ${orderId} to status: ${newStatus}`);
      
      // Prepare update message if not provided
      const updateMessage = message || `Order ${newStatus.toLowerCase()} successfully`;
      
      // Check if user is logged in and has an ID
      if (!providerId) {
        console.error('Cannot update order: Provider ID is missing');
        setStatusMessage("Authentication required. Please log in.");
        setTimeout(() => setStatusMessage(""), 3000);
        return;
      }

      // Check for authentication token
      if (!token) {
        console.error('Cannot update order: Authentication token is missing');
        setStatusMessage("Authentication required. Please log in again.");
        setTimeout(() => setStatusMessage(""), 3000);
        return;
      }
      
      // Try using a direct fetch approach instead of RTK Query
      try {
        // Ensure the URL exactly matches the confirmed format
        const apiUrl = `http://localhost:5000/api/orders/${orderId}/tracking`;
        console.log('Making direct API call to:', apiUrl);
        
        const directResponse = await fetch(apiUrl, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `${token}`
          },
          body: JSON.stringify({
            stage: newStatus.toLowerCase(),
            message: updateMessage
          }),
          credentials: 'include',
        });
        
        console.log('Response status:', directResponse.status);
        
        if (!directResponse.ok) {
          const errorText = await directResponse.text();
          console.error('Direct fetch error text:', errorText);
          
          try {
            const errorData = JSON.parse(errorText);
            console.error('Direct fetch error data:', errorData);
            throw new Error(`API error: ${errorData.message || directResponse.statusText}`);
          } catch {
            throw new Error(`API error (${directResponse.status}): ${errorText || directResponse.statusText}`);
          }
        }
        
        const responseData = await directResponse.json();
        console.log('Direct fetch successful:', responseData);
        
        // Show success message with highlighted styling
        setStatusMessage(`✅ Order status updated to ${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}`);
        
        // Reset the update message
        setUpdateMessage("");
        setTimeout(() => setStatusMessage(""), 5000);
        
        // If we're updating in a modal, update the selected order
        if (selectedOrder) {
          const updatedOrder = {
            ...selectedOrder,
            status: newStatus.toLowerCase(),
            trackingUpdates: [
              ...(selectedOrder.trackingUpdates || []),
              {
                stage: newStatus.toLowerCase(),
                message: updateMessage,
                timestamp: new Date().toISOString()
              }
            ]
          };
          setSelectedOrder(updatedOrder);
        }
        
        // Refetch orders to update the list
        await refetch();
        return;
      } catch (fetchErr) {
        console.error('Direct fetch attempt failed:', fetchErr);
        // Fall back to RTK Query approach
      }
      
      // Original RTK Query approach as fallback
      const result = await updateOrderTracking({
        orderId,
        data: { 
          "stage": newStatus.toLowerCase(),
          "message": updateMessage
        },
      }).unwrap();
      
      console.log('Order update result:', result);
      
      // Show success message with highlighted styling
      setStatusMessage(`✅ Order status updated to ${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}`);
      
      // Reset the update message
      setUpdateMessage("");
      setTimeout(() => setStatusMessage(""), 5000);
      
      // If we're updating in a modal, update the selected order
      if (selectedOrder) {
        const updatedOrder = {
          ...selectedOrder,
          status: newStatus.toLowerCase(),
          trackingUpdates: [
            ...(selectedOrder.trackingUpdates || []),
            {
              stage: newStatus.toLowerCase(),
              message: updateMessage,
              timestamp: new Date().toISOString()
            }
          ]
        };
        setSelectedOrder(updatedOrder);
      }
      
      // Refetch orders to update the list
      await refetch();
      
    } catch (err) {
      console.error('Error updating status:', err);
      
      let errorMsg = "Could not update the order status";
      if (err && typeof err === 'object' && 'data' in err) {
        // Try to extract error message from RTK Query error
        errorMsg = `Update failed: ${(err.data as any)?.message || 'Unknown error'}`;
      } else if (err instanceof Error) {
        errorMsg = `Update failed: ${err.message}`;
      }
      
      // Show highlighted error message
      setStatusMessage(`❌ ${errorMsg}`);
      setTimeout(() => setStatusMessage(""), 5000);
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    try {
      console.log(`Attempting to delete order with ID: ${orderId}`);
      
      // Check if user is logged in and has an ID
      if (!providerId) {
        console.error('Cannot delete order: Provider ID is missing');
        setStatusMessage("❌ Authentication required. Please log in.");
        displayToast("error", "Authentication Required", "Please log in to delete orders.");
        setTimeout(() => setStatusMessage(""), 3000);
        return;
      }

      // Check for authentication token
      if (!token) {
        console.error('Cannot delete order: Authentication token is missing');
        setStatusMessage("❌ Authentication required. Please log in again.");
        displayToast("error", "Authentication Required", "Your session has expired. Please log in again.");
        setTimeout(() => setStatusMessage(""), 3000);
        return;
      }
      
      let deleteSuccessful = false;
      
      // First try RTK Query approach
      try {
        console.log("Trying RTK Query delete approach");
        const result = await deleteOrder(orderId).unwrap();
        
        if (result && result.success === true) {
          console.log("RTK Query delete successful");
          setStatusMessage("✅ Order has been deleted successfully");
          deleteSuccessful = true;
          await refetch();
          
          // Show toast notification
          displayToast("success", "Order Deleted", "The order has been successfully deleted.");
          
          setTimeout(() => setStatusMessage(""), 3000);
          return; // Exit early - do not try the fallback approach
        } else {
          console.log("RTK Query delete returned unsuccessful result:", result);
        }
      } catch (rtqError) {
        console.log('RTK Query delete attempt failed, error:', rtqError);
        // Check if the error contains a message about "not found" which could indicate
        // the order was already deleted
        if (rtqError && typeof rtqError === 'object' && 
            ('message' in rtqError || 'data' in rtqError)) {
          const errorMsg = (rtqError as { message?: string; data?: { message?: string } }).message || 
                         ((rtqError as { data?: { message?: string } }).data && (rtqError as { data?: { message?: string } }).data?.message);
          
          if (errorMsg && typeof errorMsg === 'string' && 
              errorMsg.toLowerCase().includes('not found')) {
            console.log("Order was already deleted or doesn't exist");
            setStatusMessage("✅ Order has been deleted successfully");
            deleteSuccessful = true;
            await refetch();
            
            // Show toast notification
            displayToast("success", "Order Deleted", "The order has been successfully deleted.");
            
            setTimeout(() => setStatusMessage(""), 3000);
            return; // Exit early if the order wasn't found (likely already deleted)
          }
        }
        // Otherwise continue to fallback approach
      }
      
      // Only try the direct fetch approach if RTK Query approach failed
      // and it wasn't because the order was already deleted
      if (!deleteSuccessful) {
        try {
          console.log("Trying direct fetch delete approach");
          const apiUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/orders/${orderId}`;
          console.log('Making direct API call to:', apiUrl);
          
          const directResponse = await fetch(apiUrl, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Authorization': token
            },
            credentials: 'include',
          });
          
          console.log('Response status:', directResponse.status);
          
          // Handle 404 Not Found as a success case (the order is already gone)
          if (directResponse.status === 404) {
            console.log("Order not found - already deleted or doesn't exist");
            setStatusMessage("✅ Order has been deleted successfully");
            await refetch();
            
            // Show toast notification
            displayToast("success", "Order Deleted", "The order has been successfully deleted.");
            
            setTimeout(() => setStatusMessage(""), 3000);
            return;
          }
          
          if (!directResponse.ok) {
            const errorText = await directResponse.text();
            console.log('Direct fetch error text:', errorText);
            
            try {
              const errorData = JSON.parse(errorText);
              console.log('Direct fetch error data:', errorData);
              
              // Check if the error is "Order not found" which is actually a success
              if (errorData && errorData.message && 
                  errorData.message.toLowerCase().includes('not found')) {
                console.log("Order was already deleted or doesn't exist");
                setStatusMessage("✅ Order has been deleted successfully");
                await refetch();
                
                // Show toast notification
                displayToast("success", "Order Deleted", "The order has been successfully deleted.");
                
                setTimeout(() => setStatusMessage(""), 3000);
                return;
              }
              
              throw new Error(`API error: ${errorData.message || directResponse.statusText}`);
            } catch (e) {
              if (e instanceof Error && e.message.includes('API error:')) {
                throw e; // Re-throw our custom error
              }
              throw new Error(`API error (${directResponse.status}): ${errorText || directResponse.statusText}`);
            }
          }
          
          const responseData = await directResponse.json();
          console.log('Direct fetch successful:', responseData);
          
          setStatusMessage("✅ Order has been deleted successfully");
          await refetch();
          
          // Show toast notification
          displayToast("success", "Order Deleted", "The order has been successfully deleted.");
          
          setTimeout(() => setStatusMessage(""), 3000);
        } catch (fetchErr) {
          console.error('All delete attempts failed:', fetchErr);
          throw fetchErr; // Re-throw to be caught by outer handler
        }
      }
    } catch (error) {
      console.error('Error deleting order:', error);
      
      let errorMsg = "Could not delete the order";
      if (error && typeof error === 'object' && 'data' in error) {
        // Try to extract error message from RTK Query error
        errorMsg = `Deletion failed: ${(error.data as { message?: string })?.message || 'Unknown error'}`;
      } else if (error instanceof Error) {
        errorMsg = `Deletion failed: ${error.message}`;
      }
      
      // Check if error indicates order was not found (which means it's already deleted)
      if (typeof errorMsg === 'string' && errorMsg.toLowerCase().includes('not found')) {
        setStatusMessage("✅ Order has been deleted successfully");
        await refetch();
        
        // Show toast notification for "not found" case
        displayToast("success", "Order Deleted", "The order has been successfully deleted.");
      } else {
        // Show highlighted error message
        setStatusMessage(`❌ ${errorMsg}`);
        
        // Show error toast
        displayToast("error", "Deletion Failed", errorMsg);
      }
      
      setTimeout(() => setStatusMessage(""), 5000);
    }
  };

  const handleViewOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setUpdateMessage(""); // Reset update message when opening modal
    setIsModalOpen(true);
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

  // Add a helper function to get the current stage from tracking updates
  const getCurrentStage = (order: Order) => {
    if (!order.trackingUpdates || order.trackingUpdates.length === 0) {
      return order.status;
    }
    
    // Sort updates by timestamp (newest first) and get the most recent stage
    const sortedUpdates = [...order.trackingUpdates].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    
    return sortedUpdates[0].stage;
  };

  // Updated modal opening with current stage check
  const handleOpenUpdateModal = (order: Order) => {
    // Get a copy of the order with the current stage set from the most recent update
    const orderWithCurrentStage = {
      ...order,
      status: getCurrentStage(order) // Set status to the latest stage
    };
    
    setSelectedOrder(orderWithCurrentStage);
    setUpdateMessage(""); // Reset update message
    setIsUpdateModalOpen(true);
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
      {/* Toast notification */}
      {showToast && (
        <div className={`fixed top-4 right-4 z-50 max-w-md rounded-lg p-4 shadow-lg ${
          toastMessage.type === "success" ? "bg-green-50 text-green-800 border border-green-200" : 
          "bg-red-50 text-red-800 border border-red-200"
        }`}>
          <div className="flex items-center">
            <div className={`mr-3 flex-shrink-0 rounded-full p-1.5 ${
              toastMessage.type === "success" ? "bg-green-100" : "bg-red-100"
            }`}>
              {toastMessage.type === "success" ? (
                <Trash2 className="h-5 w-5" />
              ) : (
                <X className="h-5 w-5" />
              )}
            </div>
            <div>
              <h3 className="text-sm font-medium">{toastMessage.title}</h3>
              <p className="mt-1 text-sm">{toastMessage.message}</p>
            </div>
            <button 
              onClick={() => setShowToast(false)}
              className="ml-auto rounded-md p-1.5 hover:bg-opacity-20 hover:bg-gray-500"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

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

        <div className="rounded-md border overflow-x-auto">
          <table className="w-full min-w-full">
            <thead>
              <tr className="bg-gray-50 text-xs font-medium text-gray-500">
                <th className="px-3 py-3 text-left">Order ID</th>
                <th className="px-3 py-3 text-left">Customer</th>
                <th className="px-3 py-3 text-left">Date</th>
                <th className="px-3 py-3 text-left">Delivery Date</th>
                <th className="px-3 py-3 text-left">Payment Status</th>
                <th className="px-3 py-3 text-left">Tracking Stage</th>
                <th className="px-3 py-3 text-right">Total</th>
                <th className="px-3 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedOrders && sortedOrders.length > 0 ? (
                sortedOrders.map((order) => (
                  <tr key={order._id} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="px-3 py-3 text-xs font-medium">
                      {order._id}
                    </td>
                    <td className="px-3 py-3">
                      <div className="text-xs font-medium">{order.name || "N/A"}</div>
                      <div className="text-xs text-gray-500">{order.email || "N/A"}</div>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center text-xs text-gray-500">
                        <CalendarIcon className="mr-1 h-3 w-3" />
                        {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-3 py-3 text-xs text-gray-500">
                      {order.deliveryDate ? (
                        <>
                          {new Date(order.deliveryDate).toLocaleDateString()}
                          {order.deliverySlot && <div className="text-xs">{order.deliverySlot}</div>}
                        </>
                      ) : (
                        "N/A"
                      )}
                    </td>
                    <td className="px-3 py-3">
                      <Badge
                        variant={order.transaction?.transactionStatus === "Paid" ? "outline" : "secondary"}
                        className="text-[10px]"
                      >
                        {order.transaction?.transactionStatus || "Pending"}
                      </Badge>
                    </td>
                    <td className="px-3 py-3">
                      {order.trackingUpdates && order.trackingUpdates.length > 0 ? (
                        <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(order.trackingUpdates[order.trackingUpdates.length - 1].stage)}`}>
                          {order.trackingUpdates[order.trackingUpdates.length - 1].stage}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-500">No tracking info</span>
                      )}
                    </td>
                    <td className="px-3 py-3 text-right">
                      <span className="text-xs font-medium">
                        ${order.totalPrice?.toFixed(2) || "0.00"}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-right">
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
                          <DropdownMenuItem 
                            className="flex cursor-pointer items-center gap-2 px-2 py-1.5 text-xs"
                            onClick={() => handleOpenUpdateModal(order)}
                          >
                            <RefreshCw className="h-3.5 w-3.5" />
                            Update Status
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger className="flex items-center gap-2 text-xs">
                              <PackageCheck className="h-3.5 w-3.5" />
                              Quick Status Update
                            </DropdownMenuSubTrigger>
                            <DropdownMenuSubContent className="w-32">
                              {["placed", "approved", "processed", "shipped", "delivered"].map((status) => (
                                <DropdownMenuItem 
                                  key={status}
                                  className={`flex cursor-pointer items-center justify-between px-2 py-1.5 text-xs ${order.status === status ? 'bg-gray-100' : ''}`}
                                  onClick={() => handleStatusChange(order._id, status, "")}
                                >
                                  {/* Capitalize first letter for display only */}
                                  {status.charAt(0).toUpperCase() + status.slice(1)}
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
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="p-6 text-center text-sm text-gray-500">
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
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
                    {selectedOrder.meals.map((item: any, index: number) => (
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
                                    {item.customization.removedIngredients.map((ingredient: string, i: number) => (
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
                                    {item.customization.addOns.map((addon: any, i: number) => (
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
                                {item.mealId.ingredients.map((ingredient: string, i: number) => (
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
                    setIsModalOpen(false);
                    handleOpenUpdateModal(selectedOrder);
                  }}
                >
                  Update Order
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Order Update Modal */}
      {isUpdateModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg bg-white p-6 shadow-lg">
            {/* Close button */}
            <button
              onClick={() => setIsUpdateModalOpen(false)}
              className="absolute right-4 top-4 rounded-full p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Modal Header */}
            <div className="mb-6">
              <h2 className="text-xl font-bold">Update Order Status</h2>
              <p className="text-sm text-gray-500">Change status and add tracking updates</p>
            </div>
            
            <div className="space-y-6">
              {/* Order basic info */}
              <div className="rounded-md border p-4">
                <div className="flex flex-wrap gap-4 justify-between">
                  <div>
                    <p className="text-xs text-gray-500">Order ID</p>
                    <p className="font-medium">{selectedOrder._id}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Customer</p>
                    <p className="font-medium">{selectedOrder.name || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Current Stage</p>
                    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(selectedOrder.status)}`}>
                      {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Tracking Updates */}
              {selectedOrder.trackingUpdates && selectedOrder.trackingUpdates.length > 0 && (
                <div>
                  <h3 className="mb-2 font-medium">Tracking Updates</h3>
                  <div className="space-y-2 max-h-60 overflow-y-auto border rounded-md p-2">
                    {/* Sort tracking updates by timestamp, newest first */}
                    {[...selectedOrder.trackingUpdates]
                      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                      .map((update: any, index: number) => {
                        const isLatest = index === 0; // First item is the most recent update
                        return (
                          <div 
                            key={update._id || index} 
                            className={`rounded-md border p-3 ${isLatest ? 'border-blue-300 bg-blue-50' : ''}`}
                          >
                            <div className="flex justify-between mb-1">
                              <div className="flex items-center">
                                <p className="text-sm font-medium">
                                  {update.stage.charAt(0).toUpperCase() + update.stage.slice(1)}
                                </p>
                                {isLatest && (
                                  <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded-full font-medium">
                                    Current
                                  </span>
                                )}
                              </div>
                              <span className="text-xs text-gray-500">
                                {new Date(update.timestamp).toLocaleString()}
                              </span>
                            </div>
                            {update.message && (
                              <p className="text-sm text-gray-700 mt-1 bg-gray-50 p-2 rounded">
                                {update.message}
                              </p>
                            )}
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}

              {/* Status update form */}
              <div className="rounded-md border p-4">
                <h4 className="mb-3 text-sm font-medium">Update Status</h4>
                
                {/* Current status tracking information */}
                <div className="mb-5 p-3 bg-gray-50 rounded-md">
                  <h5 className="text-sm font-semibold mb-2">Status Progression</h5>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {["placed", "approved", "processed", "shipped", "delivered"].map((stage, index) => {
                      // Determine the order progression
                      const stageOrder = {
                        "placed": 1,
                        "approved": 2,
                        "processed": 3,
                        "shipped": 4,
                        "delivered": 5
                      };
                      
                      // Get current stage order number
                      const currentStageOrder = stageOrder[selectedOrder.status as keyof typeof stageOrder] || 0;
                      
                      // This stage's order number
                      const thisStageOrder = stageOrder[stage as keyof typeof stageOrder];
                      
                      // Check if this stage has explicitly been reached in tracking updates
                      const isExplicitlyCompleted = selectedOrder.trackingUpdates?.some(u => u.stage === stage);
                      
                      // A stage is considered completed if:
                      // 1. It's explicitly in the tracking updates, OR
                      // 2. It's a previous stage compared to the current stage (to handle skipped stages)
                      const isCompleted = isExplicitlyCompleted || thisStageOrder < currentStageOrder;
                      
                      // Check if this is the current status
                      const isCurrent = selectedOrder.status === stage;
                      
                      return (
                        <div 
                          key={stage} 
                          className={`flex items-center gap-1 rounded-md px-2 py-1 text-xs ${
                            isCurrent 
                              ? 'bg-blue-100 text-blue-800 border border-blue-300' 
                              : isCompleted 
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-500'
                          }`}
                        >
                          {index + 1}. {stage.charAt(0).toUpperCase() + stage.slice(1)}
                          {isCurrent && <span className="ml-1 text-[10px] font-medium">(Current)</span>}
                          {isCompleted && !isCurrent && <Check className="h-3 w-3" />}
                        </div>
                      );
                    })}
                  </div>
                  <p className="text-xs text-gray-500">
                    Current status: <span className="font-medium">{selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}</span>
                  </p>
                </div>
                
                {/* Status update message feedback */}
                {statusMessage && (
                  <div className="mb-3 rounded bg-green-50 p-2 text-sm text-green-700">
                    {statusMessage}
                  </div>
                )}
                
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="status" className="text-xs text-gray-500">New Status</label>
                    <select 
                      id="status"
                      className="mt-1 w-full rounded-md border-gray-300 p-2 text-sm shadow-sm focus:border-primary focus:ring-primary"
                      value={selectedOrder.status}
                      onChange={(e) => setSelectedOrder({...selectedOrder, status: e.target.value})}
                    >
                      {["placed", "approved", "processed", "shipped", "delivered"].map((status) => (
                        <option key={status} value={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="flex items-center text-xs text-gray-500">
                      Update Message <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input 
                      id="message"
                      type="text"
                      className="mt-1 w-full rounded-md border-gray-300 p-2 text-sm shadow-sm focus:border-primary focus:ring-primary"
                      placeholder="Required message for this update"
                      value={updateMessage}
                      onChange={(e) => setUpdateMessage(e.target.value)}
                      required
                    />
                    {!updateMessage && (
                      <p className="mt-1 text-xs text-red-500">A message is required for status updates</p>
                    )}
                  </div>
                </div>
                
                <div className="mt-4 flex justify-end space-x-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsUpdateModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={async () => {
                      // Validate message field
                      if (!updateMessage) {
                        setStatusMessage("❌ Please provide a message for the status update");
                        return;
                      }
                      
                      await handleStatusChange(selectedOrder._id, selectedOrder.status, updateMessage);
                      // Don't close the modal so users can see the confirmation
                      // Instead, refresh the order data to show the updated tracking
                      const updatedOrders = await refetch();
                      if (updatedOrders.data) {
                        // Find and update the selected order with new data
                        const refreshedOrder = updatedOrders.data.find(
                          order => order._id === selectedOrder._id
                        );
                        if (refreshedOrder) {
                          setSelectedOrder(refreshedOrder);
                        }
                      }
                    }}
                    disabled={!updateMessage}
                  >
                    <RefreshCw className="h-4 w-4 mr-1" />
                    Update Status
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 