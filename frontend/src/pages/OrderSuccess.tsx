import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useLocation, Link } from 'react-router-dom';
import { CheckCircle2, Package, ArrowRight, Home, ShoppingBag, Truck, Clock, MapPin, CreditCard, Sparkles, PartyPopper, Gift } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import InvoiceDownloadCard from '@/components/InvoiceDownloadCard';

// Confetti particle component
const ConfettiParticle = ({ delay, x }: { delay: number; x: number }) => (
  <motion.div
    initial={{ y: -20, x, opacity: 1, rotate: 0 }}
    animate={{ y: 600, opacity: 0, rotate: 720 }}
    transition={{ duration: 3, delay, ease: "easeIn" }}
    className="absolute top-0 pointer-events-none"
    style={{ left: `${x}%` }}
  >
    <div
      className="w-2.5 h-2.5 rounded-sm"
      style={{
        backgroundColor: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#FF69B4'][Math.floor(Math.random() * 8)]
      }}
    />
  </motion.div>
);

const OrderSuccess = () => {
  const location = useLocation();
  const { address, orderId, paymentMethod: passedPaymentMethod, cartItems, subtotal, grandTotal, discount } = location.state || {};
  const [showConfetti, setShowConfetti] = useState(true);

  const orderNumber = orderId ? `#${orderId}` : `ORD-${Date.now()}`;
  const estimatedDelivery = new Date();
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 5);

  const displayAddress = address || {
    name: 'Customer',
    address: '123 Main Street',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400001',
    mobile: '+91 98765 43210'
  };

  const paymentMethod = passedPaymentMethod || 'Cash on Delivery';

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  // Timeline steps
  const timeline = [
    { icon: CheckCircle2, label: 'Order Placed', desc: 'Your order is confirmed', done: true, color: 'text-success' },
    { icon: Package, label: 'Processing', desc: 'Seller will pack your order', done: false, color: 'text-primary' },
    { icon: Truck, label: 'Shipped', desc: 'On its way to you', done: false, color: 'text-primary' },
    { icon: Home, label: 'Delivered', desc: estimatedDelivery.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }), done: false, color: 'text-primary' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-success/5 via-background to-background flex flex-col pt-16 md:pt-20">
      <Navbar />

      {/* Confetti */}
      {showConfetti && (
        <div className="fixed inset-0 z-50 pointer-events-none overflow-hidden">
          {Array.from({ length: 40 }).map((_, i) => (
            <ConfettiParticle key={i} delay={i * 0.08} x={Math.random() * 100} />
          ))}
        </div>
      )}

      <main className="flex-1 container mx-auto px-4 py-10 md:py-16">
        <div className="max-w-3xl mx-auto space-y-8">

          {/* Hero Success Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="text-center space-y-6"
          >
            {/* Animated Success Icon */}
            <div className="relative w-28 h-28 mx-auto">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 15, delay: 0.1 }}
                className="w-28 h-28 bg-success/15 rounded-full flex items-center justify-center relative"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring" }}
                >
                  <CheckCircle2 className="w-14 h-14 text-success" />
                </motion.div>
                {/* Pulse ring */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 1 }}
                  animate={{ scale: 2, opacity: 0 }}
                  transition={{ duration: 1.5, delay: 0.5, repeat: 2 }}
                  className="absolute inset-0 rounded-full border-2 border-success/30"
                />
              </motion.div>
              {/* Floating sparkles */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: -5 }}
                transition={{ delay: 0.6, duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                className="absolute -top-2 -right-2"
              >
                <Sparkles className="w-6 h-6 text-warning" />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: -5 }}
                transition={{ delay: 0.9, duration: 0.6, repeat: Infinity, repeatType: "reverse" }}
                className="absolute -top-1 -left-3"
              >
                <PartyPopper className="w-5 h-5 text-primary" />
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h1 className="font-display text-4xl md:text-5xl font-black text-foreground tracking-tight">
                Order <span className="text-success">Successful!</span> 🎉
              </h1>
              <p className="text-lg text-muted-foreground mt-3 max-w-md mx-auto">
                Badhaai Ho! Aapka order confirm ho gaya hai. Hum jaldi se jaldi deliver karenge!
              </p>
            </motion.div>
          </motion.div>

          {/* Order Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-card rounded-2xl border border-border shadow-premium overflow-hidden"
          >
            {/* Order Number Banner */}
            <div className="bg-gradient-to-r from-primary/10 via-success/10 to-secondary/10 px-6 py-5 border-b border-border">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Order Number</p>
                  <p className="font-display text-2xl font-black text-foreground mt-0.5">{orderNumber}</p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Expected Delivery</p>
                  <p className="font-display text-2xl font-black text-success mt-0.5">
                    {estimatedDelivery.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
              </div>
            </div>

            {/* Progress Timeline */}
            <div className="px-6 py-6">
              <div className="flex items-center justify-between relative">
                {/* Progress line */}
                <div className="absolute top-5 left-5 right-5 h-0.5 bg-border z-0" />
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '10%' }}
                  transition={{ delay: 0.8, duration: 0.8 }}
                  className="absolute top-5 left-5 h-0.5 bg-success z-10"
                />

                {timeline.map((step, i) => (
                  <div key={step.label} className="relative z-20 flex flex-col items-center text-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.6 + i * 0.15, type: "spring" }}
                      className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                        step.done
                          ? 'bg-success border-success text-white'
                          : 'bg-card border-border text-muted-foreground'
                      }`}
                    >
                      <step.icon className="w-4 h-4" />
                    </motion.div>
                    <p className={`text-xs font-bold mt-2 ${step.done ? 'text-success' : 'text-muted-foreground'}`}>{step.label}</p>
                    <p className="text-[10px] text-muted-foreground hidden sm:block">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Details Grid */}
            <div className="px-6 pb-6 grid sm:grid-cols-2 gap-4">
              {/* Address */}
              <div className="bg-muted/30 rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                  <MapPin className="w-4 h-4 text-primary" /> Delivery Address
                </div>
                <div className="text-sm text-muted-foreground space-y-0.5 pl-6">
                  <p className="font-semibold text-foreground">{displayAddress.name || displayAddress.locality || 'Customer'}</p>
                  <p>{displayAddress.address}</p>
                  <p>{displayAddress.city}{displayAddress.state ? `, ${displayAddress.state}` : ''} {displayAddress.pincode}</p>
                  <p>{displayAddress.mobile}</p>
                </div>
              </div>

              {/* Payment */}
              <div className="bg-muted/30 rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                  <CreditCard className="w-4 h-4 text-primary" /> Payment
                </div>
                <div className="text-sm text-muted-foreground pl-6 space-y-1">
                  <p className="font-semibold text-foreground">{paymentMethod}</p>
                  <p>{paymentMethod === 'Cash on Delivery' ? 'Pay when you receive your order' : '✅ Paid securely via Razorpay'}</p>
                </div>

                <div className="flex items-center gap-2 text-sm font-bold text-foreground mt-3">
                  <Clock className="w-4 h-4 text-primary" /> Estimated Time
                </div>
                <p className="text-sm text-muted-foreground pl-6">5-7 Business Days</p>
              </div>
            </div>

            {/* What's Next Banner */}
            <div className="mx-6 mb-6 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl p-5 border border-primary/10">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Gift className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-bold text-foreground mb-2">Aage kya hoga?</p>
                  <div className="grid sm:grid-cols-2 gap-x-6 gap-y-1.5 text-sm text-muted-foreground">
                    <p className="flex items-center gap-2">✉️ Email & SMS confirmation</p>
                    <p className="flex items-center gap-2">📦 24 ghante mein processing</p>
                    <p className="flex items-center gap-2">🚚 Tracking details milenge</p>
                    <p className="flex items-center gap-2">🏠 Door-step delivery</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Invoice Download Section */}
          <InvoiceDownloadCard
            invoiceData={{
              orderId: orderId || 'N/A',
              orderDate: new Date().toISOString(),
              paymentMethod: paymentMethod,
              items: (cartItems || []).map((item: any) => ({
                name: item.product?.name || item.name || 'Product',
                quantity: item.quantity,
                price: item.product?.sellingPrice || item.product?.price || item.price || 0,
                total: (item.product?.sellingPrice || item.product?.price || item.price || 0) * item.quantity,
              })),
              subtotal: subtotal || grandTotal || 0,
              discount: discount || 0,
              deliveryCharge: 0,
              grandTotal: grandTotal || subtotal || 0,
              address: displayAddress,
            }}
          />

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              to="/orders"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-bold text-lg hover:bg-primary/90 transition-all shadow-md hover:shadow-lg active:scale-[0.98]"
            >
              <Package className="w-5 h-5" />
              Track My Order
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/products"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border-2 border-border bg-card font-bold text-lg hover:bg-muted hover:border-primary/30 transition-all active:scale-[0.98]"
            >
              <ShoppingBag className="w-5 h-5" />
              Continue Shopping
            </Link>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="flex flex-wrap justify-center gap-6 text-sm pb-8"
          >
            <Link to="/" className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
              <Home className="w-4 h-4" />
              Back to Home
            </Link>
            <Link to="/products" className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
              Need Help? Contact Support
            </Link>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OrderSuccess;
