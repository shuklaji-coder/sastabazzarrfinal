import { Navbar } from '@/components/Navbar';
import { StatusBadge } from '@/components/StatusBadge';
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Check, Circle, MapPin, CreditCard, 
  Package, Truck, CheckCircle2, Star, MessageSquare, 
  Image as ImageIcon, Loader2, X, Send
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { orderService } from '@/services/orderService';
import { reviewService } from '@/services/reviewService';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [activeReviewId, setActiveReviewId] = useState<string | number | null>(null);
  const [reviewForm, setReviewForm] = useState({ rating: 5, text: '' });

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  const fetchOrderDetails = async () => {
    setIsLoading(true);
    try {
      if (id) {
        const data = await orderService.getOrderById(parseInt(id));
        setOrder(data);
      }
    } catch (err) {
      console.error("Failed to fetch order details", err);
      toast.error("Failed to load order details");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!order) return;
    try {
      await orderService.cancelOrder(order.id);
      toast.success("Order cancelled successfully");
      fetchOrderDetails();
    } catch (err) {
      console.error("Failed to cancel order", err);
      toast.error("Failed to cancel order");
    }
  };

  const handleSubmitReview = async (productId: string | number) => {
    if (!reviewForm.text.trim()) {
      toast.error("Please enter some feedback");
      return;
    }
    setIsSubmittingReview(true);
    try {
      await reviewService.createReview(productId, {
        revievText: reviewForm.text,
        revievRating: reviewForm.rating
      });
      toast.success("Review submitted! Thank you for your feedback.");
      setActiveReviewId(null);
      setReviewForm({ rating: 5, text: '' });
    } catch (err) {
      console.error("Failed to submit review", err);
      toast.error("Failed to submit review");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
          <p className="text-muted-foreground animate-pulse font-medium">Fetching your order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center space-y-6">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted">
            <Package className="w-10 h-10 text-muted-foreground" />
          </div>
          <div>
            <h2 className="text-2xl font-display font-bold text-foreground">Order Not Found</h2>
            <p className="text-muted-foreground mt-2">The order you're looking for doesn't exist or has been removed.</p>
          </div>
          <Button asChild>
            <Link to="/orders"><ArrowLeft className="mr-2 w-4 h-4" /> Back to My Orders</Link>
          </Button>
        </div>
      </div>
    );
  }

  const orderStatus = order.orderStatus?.toUpperCase() || 'PLACED';
  const steps = [
    { label: 'Placed', icon: Package, status: 'PLACED' },
    { label: 'Confirmed', icon: CheckCircle2, status: 'CONFIRMED' },
    { label: 'Shipped', icon: Truck, status: 'SHIPPED' },
    { label: 'Delivered', icon: Check, status: 'DELIVERED' }
  ];

  const currentStep = steps.findIndex(s => s.status === orderStatus);
  const canCancel = orderStatus === 'PLACED' || orderStatus === 'CONFIRMED' || orderStatus === 'PENDING';

  return (
    <div className="min-h-screen bg-secondary/30 pb-20">
      <Navbar />
      
      {/* Premium Header Backdrop */}
      <div className="bg-foreground text-white py-12 md:py-16">
        <div className="container mx-auto px-4">
          <Link to="/orders" className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Orders
          </Link>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <StatusBadge status={orderStatus} />
                <span className="text-white/50">Order #{order.id}</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight">
                Order <span className="text-primary italic">Summary</span>
              </h1>
              <p className="text-white/70">Placed on {new Date(order.orderDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
            {canCancel && (
              <button 
                onClick={handleCancelOrder}
                className="px-6 py-3 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive-foreground hover:bg-destructive/20 transition-all font-bold text-sm"
              >
                Cancel Entire Order
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-8">
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Elegant Tracking Stepper */}
            <div className="bg-card rounded-2xl border border-border p-8 shadow-sm">
              <h2 className="font-display font-bold text-xl mb-10 flex items-center gap-2">
                <Truck className="w-5 h-5 text-primary" /> Delivery Status
              </h2>
              <div className="relative flex justify-between">
                <div className="absolute top-5 left-0 w-full h-1 bg-muted -z-0" />
                <div 
                  className="absolute top-5 left-0 h-1 bg-primary transition-all duration-1000 -z-0" 
                  style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                />
                
                {steps.map((step, i) => {
                  const Icon = step.icon;
                  const isCompleted = i <= currentStep;
                  const isActive = i === currentStep;
                  
                  return (
                    <div key={i} className="relative z-10 flex flex-col items-center gap-4">
                      <div className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-500 shadow-md ${
                        isCompleted ? 'bg-primary text-primary-foreground scale-110' : 'bg-muted text-muted-foreground'
                      } ${isActive ? 'ring-4 ring-primary/20' : ''}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="text-center">
                        <p className={`text-xs font-bold uppercase tracking-wider ${isCompleted ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {step.label}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Order Items with Reviews */}
            <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
              <div className="p-6 border-b border-border bg-muted/30">
                <h2 className="font-display font-bold text-lg flex items-center gap-2">
                  <Package className="w-5 h-5 text-primary" /> Products in this Order
                </h2>
              </div>
              <div className="divide-y divide-border">
                {order.orderItems?.map((item: any) => (
                  <div key={item.id} className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="w-24 h-24 rounded-xl bg-white border border-border p-2 shrink-0 flex items-center justify-center overflow-hidden">
                        <img 
                          src={item.product?.images?.[0] || 'https://via.placeholder.com/150'} 
                          alt={item.product?.name} 
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <Link to={`/product/${item.product?.id}`} className="font-bold text-foreground hover:text-primary transition-colors">
                              {item.product?.name}
                            </Link>
                            <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                          </div>
                          <p className="font-display font-bold text-lg">
                            ₹{(item.sellingPrice * item.quantity).toLocaleString('en-IN')}
                          </p>
                        </div>
                        
                        {/* Review Trigger */}
                        {orderStatus === 'DELIVERED' && (
                          <div className="pt-4">
                            {activeReviewId === item.id ? (
                               <motion.div 
                                 initial={{ opacity: 0, scale: 0.95 }}
                                 animate={{ opacity: 1, scale: 1 }}
                                 className="bg-muted/50 rounded-xl p-4 space-y-4 border border-border"
                               >
                                 <div className="flex items-center justify-between">
                                   <p className="text-sm font-bold">Write a Review</p>
                                   <button onClick={() => setActiveReviewId(null)}><X className="w-4 h-4" /></button>
                                 </div>
                                 <div className="flex gap-2">
                                   {[1,2,3,4,5].map(s => (
                                     <button 
                                       key={s} 
                                       onClick={() => setReviewForm(prev => ({ ...prev, rating: s }))}
                                       className="transition-transform hover:scale-125 focus:outline-none"
                                     >
                                       <Star className={`w-8 h-8 ${s <= reviewForm.rating ? 'fill-primary text-primary' : 'text-muted-foreground'}`} />
                                     </button>
                                   ))}
                                 </div>
                                 <textarea 
                                   className="w-full bg-background border border-border rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none min-h-[100px]"
                                   placeholder="Share your experience with this product..."
                                   value={reviewForm.text}
                                   onChange={(e) => setReviewForm(prev => ({ ...prev, text: e.target.value }))}
                                 />
                                 <button 
                                   disabled={isSubmittingReview}
                                   onClick={() => handleSubmitReview(item.product.id)}
                                   className="w-full py-2 bg-primary text-white rounded-lg font-bold text-sm flex items-center justify-center gap-2 hover:bg-primary/90 transition-all disabled:opacity-50"
                                 >
                                   {isSubmittingReview ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                   Submit Review
                                 </button>
                               </motion.div>
                            ) : (
                              <button 
                                onClick={() => setActiveReviewId(item.id)}
                                className="inline-flex items-center gap-2 text-primary font-bold text-sm hover:underline"
                              >
                                <Star className="w-4 h-4" /> Rate & Review Product
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar / Summary */}
          <div className="space-y-6">
            
            {/* Shipping Info */}
            <div className="bg-card rounded-2xl border border-border p-6 shadow-sm space-y-4">
              <h3 className="font-display font-bold text-lg flex items-center gap-2 border-b border-border pb-3">
                <MapPin className="w-5 h-5 text-primary" /> Shipping To
              </h3>
              <div className="space-y-2 text-sm">
                <p className="font-bold text-foreground text-base capitalize">{order.shippingAddress?.name}</p>
                <div className="text-muted-foreground space-y-1">
                  <p>{order.shippingAddress?.address}</p>
                  <p>{order.shippingAddress?.locality}</p>
                  <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}</p>
                  <div className="pt-2 flex items-center gap-2 text-foreground font-medium">
                    <span className="text-primary font-bold">Contact:</span> {order.shippingAddress?.mobile}
                  </div>
                </div>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="bg-card rounded-2xl border border-border p-6 shadow-sm space-y-6">
              <h3 className="font-display font-bold text-lg flex items-center gap-2 border-b border-border pb-3">
                <CreditCard className="w-5 h-5 text-primary" /> Payment Details
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground font-medium">Payment Method</span>
                  <span className="font-bold uppercase tracking-wider">{order.paymentDetails?.paymentMethod || 'PREPAID'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground font-medium">Order Subtotal</span>
                  <span className="font-bold">₹{order.totalSellingPrice?.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground font-medium">Discount</span>
                  <span className="font-bold text-green-600">- ₹{(order.discount || 0).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground font-medium">Delivery Charges</span>
                  <span className="font-bold text-primary">FREE</span>
                </div>
                <div className="pt-4 border-t border-border flex justify-between items-center">
                  <span className="font-display font-bold text-lg">Order Total</span>
                  <span className="font-display font-extrabold text-2xl text-primary">₹{order.totalSellingPrice?.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            <p className="text-[10px] text-muted-foreground text-center px-4">
              By placing this order you agree to Sastaa Bazaar's Terms of Use and Sale Conditions. Need help with this order? <Link to="/contact" className="text-primary hover:underline">Contact Support</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
