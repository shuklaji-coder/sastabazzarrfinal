import { Navbar } from '@/components/Navbar';
import { RazorpayPayment } from '@/components/RazorpayPayment';
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Check, CreditCard, Wallet, Building2, ArrowLeft, MapPin, Plus, Loader2, Tag, X, Trash2, Smartphone, Home, Briefcase, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { orderService } from '@/services/orderService';
import { paymentService } from '@/services/paymentService';
import { userService } from '@/services/userService';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

interface CartItem {
  id: string;
  product: {
    id: string;
    name: string;
    price: number;
    sellingPrice?: number;
    discountedPrice?: number;
    originalPrice?: number;
    mrpPrice?: number;
    images?: string[];
    seller?: {
      name: string;
    };
  };
  quantity: number;
}

const steps = ['Address', 'Payment', 'Review'];

const Checkout = () => {
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [selectedAddress, setSelectedAddress] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderId, setOrderId] = useState(0);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [addressesList, setAddressesList] = useState<any[]>([]);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    name: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    locality: '',
    mobile: ''
  });

  // Coupon / Promo Code
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number; type: 'percent' | 'flat'; label: string } | null>(null);
  const [couponError, setCouponError] = useState('');

  const AVAILABLE_COUPONS = [
    { code: 'SASTA10', discount: 10, type: 'percent' as const, label: '10% Off' },
    { code: 'FIRST50', discount: 50, type: 'percent' as const, label: '50% Off (Max ₹200)' },
    { code: 'BAZAAR20', discount: 20, type: 'percent' as const, label: '20% Off' },
    { code: 'FLAT100', discount: 100, type: 'flat' as const, label: '₹100 Flat Off' },
    { code: 'WELCOME', discount: 15, type: 'percent' as const, label: '15% Off for New Users' },
  ];

  const handleApplyCoupon = () => {
    setCouponError('');
    const found = AVAILABLE_COUPONS.find(c => c.code === couponCode.trim().toUpperCase());
    if (found) {
      setAppliedCoupon(found);
      toast.success(`Coupon "${found.code}" applied! ${found.label}`);
      setCouponCode('');
    } else {
      setCouponError('Invalid coupon code. Try SASTA10, BAZAAR20, or FLAT100');
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    toast.info('Coupon removed');
  };

  const getDiscount = () => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon.type === 'flat') return appliedCoupon.discount;
    let disc = (total * appliedCoupon.discount) / 100;
    // Cap FIRST50 at ₹200
    if (appliedCoupon.code === 'FIRST50' && disc > 200) disc = 200;
    return Math.round(disc);
  };

  const handleDeleteAddress = async (addressId: number) => {
    try {
      await userService.deleteAddress(addressId);
      toast.success('Address deleted');
      fetchAddresses();
    } catch (err) {
      toast.error('Failed to delete address');
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const data = await userService.getUserAddresses();
      setAddressesList(data || []);
      if (data && data.length > 0 && !selectedAddress) {
        setSelectedAddress(data[0].id);
      }
    } catch (err) {
      console.error("Failed to fetch addresses", err);
    }
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Map to backend Address entity
      const addressToSave = {
        name: newAddress.name,
        locality: newAddress.locality || newAddress.street,
        address: newAddress.street,
        city: newAddress.city,
        state: newAddress.state,
        pincode: newAddress.zip,
        mobile: newAddress.phone || newAddress.mobile
      };

      await userService.addAddress(addressToSave);
      toast.success("Address added successfully");
      setIsAddingAddress(false);
      fetchAddresses();
    } catch (err) {
      console.error("Failed to add address", err);
      toast.error("Failed to add address");
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#F8F9FC] dark:bg-slate-950 pt-20">
        <Navbar />
        <div className="container mx-auto px-4 py-32 text-center max-w-md">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-12 rounded-[40px] bg-white/50 dark:bg-white/5 border border-white/20 dark:border-white/10 backdrop-blur-3xl shadow-2xl"
          >
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8">
              <Plus className="w-10 h-10 text-primary rotate-45" />
            </div>
            <h2 className="text-3xl font-display font-black text-foreground mb-4">Cart is Empty</h2>
            <p className="text-muted-foreground mb-10 leading-relaxed font-medium">Looks like you haven't added anything to your cart yet. Let's find some amazing deals for you!</p>
            <Button asChild size="lg" className="w-full h-14 rounded-2xl font-bold shadow-xl shadow-primary/20">
              <Link to="/products">Start Shopping Now</Link>
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  const couponDiscount = getDiscount();
  const grandTotal = (total * 1.18) - couponDiscount;

  const handlePlaceOrder = async () => {
    setIsSubmitting(true);
    try {
      // Find full address layout directly from current list
      const scAddress = addressesList.find(a => a.id === selectedAddress);
      
      if (!scAddress) {
        toast.error("Please select an address");
        setIsSubmitting(false);
        return;
      }
      
      // Match spring backend Order service expects Address
      const addressPayload = {
        name: scAddress?.name,
        locality: scAddress?.locality || scAddress?.address,
        address: scAddress?.address,
        city: scAddress?.city,
        state: scAddress?.state,
        pincode: scAddress?.pincode,
        mobile: scAddress?.mobile
      };

      // Sync cart with backend first
      const cartItemsForSync = items.map(item => ({
        productId: item.product.id,
        quantity: item.quantity,
        price: item.product.sellingPrice || item.product.discountedPrice || item.product.price
      }));
      
      await orderService.syncCart(cartItemsForSync);
      
      // Backend expects only Address object, cart is fetched from database
      const orderResponse = await orderService.createOrder(addressPayload);
      
      // Handle Set<Order> response from backend
      const responseArray = Array.isArray(orderResponse) ? orderResponse : 
                           (orderResponse && typeof orderResponse === 'object' ? Object.values(orderResponse) : []);
      
      const createdOrderId = responseArray[0]?.id || Date.now();
      setOrderId(createdOrderId);
      
      // If COD, place order directly
      if (paymentMethod === 'cod') {
        clearCart();
        navigate('/order-success', { 
          state: { 
            address: addressPayload, 
            orderId: createdOrderId,
            paymentMethod: 'Cash on Delivery'
          } 
        });
      } else {
        // For online payments, move to payment step
        setStep(2); // Go to review step
      }
    } catch (err) {
      console.error("Order creation failed", err);
      setIsSubmitting(false);
    }
  };

  const handlePaymentSuccess = (paymentId: string) => {
    const scAddress = addressesList.find(a => a.id === selectedAddress);
    const addressPayload = {
      locality: scAddress?.locality || scAddress?.address,
      address: scAddress?.address,
      city: scAddress?.city,
      pincode: scAddress?.pincode,
      mobile: scAddress?.mobile
    };

    setPaymentCompleted(true);
    clearCart();
    navigate('/order-success', { 
      state: { 
        address: addressPayload, 
        orderId: orderId,
        paymentMethod: 'Online Payment'
      } 
    });
  };

  const handlePaymentFailure = (error: any) => {
    console.error("Payment failed:", error);
    setIsSubmitting(false);
    alert("Payment failed. Please try again.");
  };

  const handlePaymentClose = () => {
    setIsSubmitting(false);
  };

  const handleCreatePaymentOrder = async () => {
    setIsSubmitting(true);
    try {
      // Create a simple order payload for payment
      const paymentOrderPayload = {
        amount: Math.round(grandTotal),
        orderId: orderId || Date.now()
      };

      // Create payment order directly
      const paymentOrder = await paymentService.createPaymentOrder(paymentOrderPayload);
      
      // Now proceed with Razorpay payment
      const paymentLink = await paymentService.createRazorpayPaymentLink({
        amount: Math.round(grandTotal),
        orderId: orderId || Date.now()
      });

      console.log("Real Razorpay payment link created:", paymentLink);

      // Open Razorpay payment with your key - WITHOUT order_id (let Razorpay create it)
      const options = {
        key: 'rzp_test_RvkRUEHFCxl4Rz', // Your Razorpay test key
        amount: Math.round(grandTotal) * 100, // Convert to paise
        currency: 'INR',
        name: 'SastaBazaar',
        description: `Payment for Order #${orderId}`,
        // Remove order_id to let Razorpay create it automatically
        handler: async (response: any) => {
          try {
            console.log("Razorpay payment successful:", response);
            
            // Process payment on backend
            const success = await paymentService.processPayment({
              paymentOrderId: paymentOrder.id,
              paymentId: response.razorpay_payment_id,
              paymentLinkId: paymentLink.id
            });

            if (success) {
              handlePaymentSuccess(response.razorpay_payment_id);
            } else {
              handlePaymentFailure(new Error('Payment processing failed'));
            }
          } catch (error) {
            handlePaymentFailure(error);
          }
        },
        prefill: {
          name: 'Customer Name', // Get from user context
          email: 'customer@example.com', // Get from user context
          contact: '9999999999' // Get from user context
        },
        notes: {
          address: 'Customer Address',
          orderId: (orderId || Date.now()).toString()
        },
        theme: {
          color: '#3399cc'
        },
        modal: {
          ondismiss: () => {
            console.log("Razorpay modal dismissed");
            handlePaymentClose();
          },
          escape: true,
          backdropclose: true
        }
      };

      console.log("Opening Razorpay modal with options:", options);
      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (error) {
      console.error('Payment error:', error);
      handlePaymentFailure(error);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC] dark:bg-slate-950 pt-16 md:pt-20">
      <Navbar />
      
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-secondary/5 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <Link to="/cart" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-2">
              <ArrowLeft className="w-4 h-4" /> Back to Shopping Cart
            </Link>
            <h1 className="text-3xl font-display font-black text-foreground tracking-tight">Checkout</h1>
          </div>

          {/* Premium Stepper */}
          <div className="flex items-center gap-2 bg-white/50 dark:bg-white/5 backdrop-blur-md border border-white/20 dark:border-white/10 p-2 rounded-2xl shadow-sm">
            {steps.map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className="flex flex-col items-center">
                  <motion.div 
                    initial={false}
                    animate={{ 
                      backgroundColor: i <= step ? 'var(--primary)' : 'transparent',
                      borderColor: i <= step ? 'var(--primary)' : 'rgba(156, 163, 175, 0.3)',
                      color: i <= step ? '#fff' : 'rgba(156, 163, 175, 1)',
                      scale: i === step ? 1.1 : 1
                    }}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold border-2 transition-all shadow-sm ${i === step ? 'shadow-primary/20' : ''}`}
                  >
                    {i < step ? <Check className="w-5 h-5" /> : i + 1}
                  </motion.div>
                </div>
                {i < steps.length - 1 && (
                  <div className="w-8 md:w-12 h-1 bg-muted rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: "0%" }}
                      animate={{ width: i < step ? "100%" : "0%" }}
                      className="h-full bg-primary"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-6">
            <AnimatePresence mode="wait">
              {step === 0 && (
                <motion.div 
                  key="address" 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0, y: -20 }} 
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-display font-bold text-foreground">Delivery Address</h2>
                      <p className="text-sm text-muted-foreground mt-1">Select where you want your items delivered</p>
                    </div>
                    <Button 
                      onClick={() => setIsAddingAddress(!isAddingAddress)}
                      variant={isAddingAddress ? "ghost" : "outline"}
                      className="gap-2 rounded-xl h-11"
                    >
                      {isAddingAddress ? 'Cancel' : <><Plus className="w-4 h-4" /> Add New Address</>}
                    </Button>
                  </div>

                  {isAddingAddress ? (
                    <motion.form 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      onSubmit={handleSaveAddress} 
                      className="space-y-6 p-6 md:p-8 bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-3xl shadow-xl"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-1">Receiver Name</label>
                          <input 
                            required
                            className="w-full bg-white dark:bg-white/5 border border-border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                            placeholder="e.g. Rahul Sharma"
                            value={newAddress.name}
                            onChange={(e) => setNewAddress({...newAddress, name: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-1">Mobile Number</label>
                          <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">+91</span>
                            <input 
                              required
                              className="w-full bg-white dark:bg-white/5 border border-border rounded-xl pl-14 pr-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                              placeholder="9876543210"
                              value={newAddress.phone}
                              onChange={(e) => setNewAddress({...newAddress, phone: e.target.value})}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-1">Flat, House no., Building, Company, Apartment</label>
                        <input 
                          required
                          className="w-full bg-white dark:bg-white/5 border border-border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                          placeholder="e.g. 102, Shanti Sadan"
                          value={newAddress.street}
                          onChange={(e) => setNewAddress({...newAddress, street: e.target.value, locality: e.target.value})}
                        />
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-1">Pincode</label>
                          <input 
                            required
                            className="w-full bg-white dark:bg-white/5 border border-border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-mono"
                            placeholder="400001"
                            value={newAddress.zip}
                            onChange={(e) => setNewAddress({...newAddress, zip: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-1">City</label>
                          <input 
                            required
                            className="w-full bg-white dark:bg-white/5 border border-border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                            placeholder="Mumbai"
                            value={newAddress.city}
                            onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                          />
                        </div>
                        <div className="col-span-2 md:col-span-1 space-y-2">
                          <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-1">State</label>
                          <input 
                            required
                            className="w-full bg-white dark:bg-white/5 border border-border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                            placeholder="Maharashtra"
                            value={newAddress.state}
                            onChange={(e) => setNewAddress({...newAddress, state: e.target.value})}
                          />
                        </div>
                      </div>

                      <Button type="submit" size="lg" className="w-full rounded-xl h-12 font-bold shadow-lg shadow-primary/20">
                        Save & Use This Address
                      </Button>
                    </motion.form>
                  ) : (
                    <>
                      {addressesList.length === 0 ? (
                        <div className="p-12 text-center border-2 border-dashed border-muted rounded-3xl bg-white/50 dark:bg-white/5">
                          <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <MapPin className="w-8 h-8 text-muted-foreground" />
                          </div>
                          <h3 className="text-xl font-bold mb-2">No saved addresses</h3>
                          <p className="text-sm text-muted-foreground mb-6 max-w-xs mx-auto">Please add a delivery address to proceed with your order.</p>
                          <Button onClick={() => setIsAddingAddress(true)} className="rounded-xl h-11 px-8">
                            Add New Address
                          </Button>
                        </div>
                      ) : (
                        <div className="grid gap-4">
                          {addressesList.map((addr, idx) => (
                            <motion.label 
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.05 }}
                              key={addr.id} 
                              className={`group block p-5 rounded-2xl border-2 cursor-pointer transition-all relative ${
                                selectedAddress === addr.id 
                                  ? 'border-primary bg-primary/[0.03]' 
                                  : 'border-white/50 dark:border-white/10 bg-white/50 dark:bg-white/5 hover:border-primary/40'
                              }`}
                            >
                              <div className="flex items-start gap-4">
                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mt-1 transition-colors ${
                                  selectedAddress === addr.id ? 'border-primary bg-primary text-white' : 'border-muted-foreground/30'
                                }`}>
                                  {selectedAddress === addr.id && <div className="w-2 h-2 rounded-full bg-white" />}
                                </div>
                                <input 
                                  type="radio" 
                                  name="address" 
                                  checked={selectedAddress === addr.id} 
                                  onChange={() => setSelectedAddress(addr.id)} 
                                  className="hidden" 
                                />
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-1">
                                    <span className="font-bold text-lg text-foreground">{addr.name}</span>
                                    {idx === 0 && <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">Default</span>}
                                  </div>
                                  <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                      {addr.address}, {addr.city}, {addr.state} - <span className="font-mono font-medium">{addr.pincode}</span>
                                    </p>
                                    <p className="text-sm font-medium text-foreground flex items-center gap-2">
                                      <Smartphone className="w-3.5 h-3.5 text-primary" /> {addr.mobile}
                                    </p>
                                  </div>
                                </div>
                                {selectedAddress === addr.id && (
                                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-4 right-4 text-primary">
                                    <ShieldCheck className="w-6 h-6" />
                                  </motion.div>
                                )}
                                <div className="flex flex-col gap-2">
                                  <button
                                    onClick={(e) => { e.preventDefault(); handleDeleteAddress(addr.id); }}
                                    className="p-2 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-all"
                                    title="Delete Address"
                                  >
                                    <Trash2 className="w-4.5 h-4.5" />
                                  </button>
                                </div>
                              </div>
                            </motion.label>
                          ))}
                        </div>
                      )}
                      
                      {addressesList.length > 0 && (
                        <Button 
                          onClick={() => setStep(1)} 
                          className="w-full h-14 rounded-2xl text-lg font-bold shadow-xl shadow-primary/20 mt-4 group"
                        >
                          Continue to Payment
                          <motion.span animate={{ x: [0, 4, 0] }} transition={{ repeat: Infinity, duration: 1.5 }} className="ml-2">
                            →
                          </motion.span>
                        </Button>
                      )}
                    </>
                  )}
                </motion.div>
              )}

              {step === 1 && (
                <motion.div 
                  key="payment" 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0, y: -20 }} 
                  className="space-y-6"
                >
                  <div>
                    <h2 className="text-2xl font-display font-bold text-foreground">Select Payment Mode</h2>
                    <p className="text-sm text-muted-foreground mt-1">Choose your preferred way to pay securely</p>
                  </div>

                  <div className="grid gap-4">
                    {[
                      { id: 'upi', icon: Wallet, label: 'UPI (Recommended)', desc: 'Pay via PhonePe, Google Pay, or Paytm', color: 'bg-green-500' },
                      { id: 'card', icon: CreditCard, label: 'Credit / Debit Cards', desc: 'Secure payment with Visa, Master, RuPay', color: 'bg-blue-500' },
                      { id: 'bank', icon: Building2, label: 'Net Banking', desc: 'Select from all major Indian banks', color: 'bg-purple-500' },
                      { id: 'cod', icon: MapPin, label: 'Cash on Delivery', desc: 'Pay with cash or QR code when delivered', color: 'bg-amber-500' },
                    ].map(pm => (
                      <label 
                        key={pm.id} 
                        className={`group flex items-center gap-5 p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                          paymentMethod === pm.id 
                            ? 'border-primary bg-primary/[0.03]' 
                            : 'border-white/50 dark:border-white/10 bg-white/50 dark:bg-white/5 hover:border-primary/40'
                        }`}
                      >
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                          paymentMethod === pm.id ? 'border-primary bg-primary text-white' : 'border-muted-foreground/30'
                        }`}>
                          {paymentMethod === pm.id && <div className="w-2 h-2 rounded-full bg-white" />}
                        </div>
                        <input 
                          type="radio" 
                          name="payment" 
                          checked={paymentMethod === pm.id} 
                          onChange={() => setPaymentMethod(pm.id)} 
                          className="hidden" 
                        />
                        <div className={`w-12 h-12 rounded-xl ${pm.color} bg-opacity-10 dark:bg-opacity-20 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                          <pm.icon className={`w-6 h-6 ${pm.id === 'cod' ? 'text-amber-500' : pm.id === 'upi' ? 'text-green-500' : pm.id === 'card' ? 'text-blue-500' : 'text-purple-500'}`} />
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-lg text-foreground">{pm.label}</p>
                          <p className="text-sm text-muted-foreground">{pm.desc}</p>
                        </div>
                      </label>
                    ))}
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button 
                      variant="outline" 
                      onClick={() => setStep(0)} 
                      className="flex-1 h-13 rounded-xl border-dashed hover:bg-muted font-bold"
                    >
                      Back
                    </Button>
                    <Button 
                      onClick={() => {
                        if (paymentMethod === 'cod') {
                          handlePlaceOrder();
                        } else {
                          setStep(2);
                        }
                      }} 
                      className="flex-1 h-13 rounded-xl font-bold shadow-lg"
                    >
                      {paymentMethod === 'cod' ? 'Confirm Order' : 'Review & Pay'}
                    </Button>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div 
                  key="review" 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0, y: -20 }} 
                  className="space-y-8"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-display font-bold text-foreground">Order Review</h2>
                      <p className="text-sm text-muted-foreground mt-1">Review your items before final payment</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {items.map((item, idx) => (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        key={item.product.id} 
                        className="flex gap-4 p-4 bg-white/50 dark:bg-white/5 backdrop-blur-md rounded-2xl border border-white/20 dark:border-white/10 group hover:shadow-lg transition-all"
                      >
                        <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-background">
                          <img 
                            src={item.product.images?.[0] || 'https://via.placeholder.com/150'} 
                            alt={item.product.name} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                          />
                        </div>
                        <div className="flex-1 flex flex-col justify-between py-1">
                          <div>
                            <p className="font-bold text-foreground line-clamp-1">{item.product.name}</p>
                            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5 font-medium">
                              Qty: <span className="text-foreground font-bold">{item.quantity}</span>
                              <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                              Price: <span className="text-foreground font-bold">₹{(item.product.sellingPrice || item.product.price).toLocaleString('en-IN')}</span>
                            </p>
                          </div>
                          <p className="font-display font-black text-lg text-primary">₹{((item.product.sellingPrice || item.product.price || 0) * item.quantity).toLocaleString('en-IN')}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  
                  {/* Summary Card Cards */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-5 rounded-2xl border border-white/20 dark:border-white/10 bg-white/30 dark:bg-white/5 backdrop-blur-sm">
                      <div className="flex items-center gap-2 mb-3">
                        <MapPin className="w-4 h-4 text-primary" />
                        <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Delivery To</h4>
                      </div>
                      <p className="font-bold text-sm text-foreground">{addressesList.find(a => a.id === selectedAddress)?.name}</p>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {addressesList.find(a => a.id === selectedAddress)?.address}, {addressesList.find(a => a.id === selectedAddress)?.city}
                      </p>
                    </div>

                    <div className="p-5 rounded-2xl border border-white/20 dark:border-white/10 bg-white/30 dark:bg-white/5 backdrop-blur-sm">
                      <div className="flex items-center gap-2 mb-3">
                        <CreditCard className="w-4 h-4 text-primary" />
                        <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Payment Method</h4>
                      </div>
                      <p className="font-bold text-sm text-foreground">
                        {paymentMethod === 'card' && 'Credit/Debit Card'}
                        {paymentMethod === 'upi' && 'UPI Payments'}
                        {paymentMethod === 'bank' && 'Net Banking'}
                        {paymentMethod === 'cod' && 'Cash on Delivery'}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">Change payment method in previous step</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <Button 
                      variant="outline" 
                      onClick={() => setStep(1)} 
                      disabled={isSubmitting} 
                      className="flex-1 h-13 rounded-xl font-bold"
                    >
                      Back
                    </Button>
                    <Button 
                      onClick={paymentMethod === 'cod' ? handlePlaceOrder : handleCreatePaymentOrder} 
                      disabled={isSubmitting} 
                      className="flex-1 h-13 rounded-xl font-bold shadow-xl shadow-primary/20 relative overflow-hidden"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="w-5 h-5 animate-spin" /> Processing...
                        </div>
                      ) : (
                        <span className="flex items-center gap-2">
                          {paymentMethod === 'cod' ? 'Place Order' : 'Pay via Secure Gateway'} — ₹{Math.round(grandTotal).toLocaleString('en-IN')}
                        </span>
                      )}
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <aside className="lg:col-span-4 sticky top-24">
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[32px] border border-white/20 dark:border-white/10 p-6 md:p-8 shadow-2xl relative overflow-hidden group">
              {/* Sidebar Background Shine */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary/20 transition-colors" />
              
              <h3 className="font-display font-black text-2xl text-foreground mb-6 flex items-center justify-between">
                Price Details
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Tag className="w-4 h-4 text-primary" />
                </div>
              </h3>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground font-medium">Price ({items.length} items)</span>
                  <span className="text-foreground font-bold font-mono">₹{total.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground font-medium">Delivery Charges</span>
                  <div className="text-right">
                    <span className="text-muted-foreground line-through text-xs mr-2">₹40</span>
                    <span className="text-green-500 font-bold uppercase text-sm tracking-wide">Free</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground font-medium">Platform Fee</span>
                  <div className="text-right">
                    <span className="text-muted-foreground line-through text-xs mr-2">₹10</span>
                    <span className="text-green-500 font-bold uppercase text-sm tracking-wide">Free</span>
                  </div>
                </div>
                <div className="flex justify-between items-center border-b border-dashed border-muted pb-4">
                  <span className="text-muted-foreground font-medium flex items-center gap-1.5">
                    GST <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded-sm">18%</span>
                  </span>
                  <span className="text-foreground font-bold font-mono">₹{(total * 0.18).toFixed(0).toLocaleString()}</span>
                </div>

                {appliedCoupon && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="flex justify-between items-center text-green-600 bg-green-500/5 p-3 rounded-xl border border-green-500/20">
                    <span className="flex items-center gap-2 text-sm font-bold">
                      <Tag className="w-3.5 h-3.5" /> {appliedCoupon.code} Applied
                    </span>
                    <span className="font-bold font-mono">-₹{couponDiscount.toLocaleString('en-IN')}</span>
                  </motion.div>
                )}
              </div>

              <div className="flex justify-between items-center mb-8">
                <div className="flex flex-col">
                  <span className="text-lg font-black font-display text-foreground leading-none">Total Amount</span>
                  <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1">All taxes included</span>
                </div>
                <div className="text-right">
                  <div className="font-display font-black text-3xl text-primary tracking-tighter">
                    ₹{Math.round(grandTotal).toLocaleString('en-IN')}
                  </div>
                  {appliedCoupon && (
                    <div className="text-[10px] font-bold text-green-500 uppercase">You Save ₹{couponDiscount.toLocaleString('en-IN')}</div>
                  )}
                </div>
              </div>

              {/* Enhanced Coupon Section */}
              <div className="pt-6 border-t border-dashed border-muted space-y-4">
                <h4 className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em] px-1 px-1">Special Coupons</h4>
                
                {appliedCoupon ? (
                  <div className="relative group/coupon">
                    <div className="flex items-center justify-between bg-green-500/10 border-2 border-dashed border-green-500/30 rounded-2xl pl-4 pr-2 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white">
                          <Check className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-sm font-black text-green-600 tracking-wider">CODE: {appliedCoupon.code}</p>
                          <p className="text-[10px] text-green-700/70 font-bold uppercase">{appliedCoupon.label}</p>
                        </div>
                      </div>
                      <Button size="icon" variant="ghost" onClick={handleRemoveCoupon} className="rounded-xl text-green-600 hover:text-destructive hover:bg-destructive/10">
                        <X className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
                        <input
                          type="text"
                          placeholder="PROMO CODE"
                          value={couponCode}
                          onChange={(e) => { setCouponCode(e.target.value.toUpperCase()); setCouponError(''); }}
                          onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                          className="w-full bg-muted/30 border border-border rounded-xl pl-10 pr-4 py-3 text-sm font-black tracking-widest focus:ring-2 focus:ring-primary/20 outline-none placeholder:text-muted-foreground/40"
                        />
                      </div>
                      <Button
                        onClick={handleApplyCoupon}
                        disabled={!couponCode.trim()}
                        variant="secondary"
                        className="rounded-xl px-5 font-black uppercase text-xs tracking-widest"
                      >
                        Apply
                      </Button>
                    </div>
                    {couponError && (
                      <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-xs font-bold text-destructive px-1">{couponError}</motion.p>
                    )}
                    
                    {/* Available Coupons Pills */}
                    <div className="flex flex-wrap gap-2">
                      {AVAILABLE_COUPONS.slice(0, 3).map(c => (
                        <button
                          key={c.code}
                          onClick={() => { setCouponCode(c.code); setCouponError(''); }}
                          className="px-3 py-1.5 rounded-lg border border-muted hover:border-primary/50 hover:bg-primary/5 text-[10px] font-black tracking-widest text-muted-foreground hover:text-primary transition-all uppercase"
                        >
                          {c.code}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Trust Badge */}
              <div className="mt-8 flex items-center justify-center gap-3 py-4 border-t border-border opacity-60">
                <ShieldCheck className="w-5 h-5 text-green-500" />
                <span className="text-[10px] font-black uppercase tracking-widest">Secure Checkout Guaranteed</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
