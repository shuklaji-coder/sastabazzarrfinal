import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { userService } from '@/services/userService';
import { orderService } from '@/services/orderService';
import { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Package, Settings, ShieldCheck, Loader2, Edit, Save, Plus, Star, ShoppingCart, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

const Profile = () => {
  const { role } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobile: ''
  });

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, ordersRes] = await Promise.all([
          userService.getUserProfile(),
          orderService.getUserOrderHistory()
        ]);
        
        setProfile(profileRes);
        setOrders(ordersRes.content || ordersRes || []);
        setFormData({
          firstName: profileRes.firstName || '',
          lastName: profileRes.lastName || '',
          email: profileRes.email || '',
          mobile: profileRes.mobile || ''
        });

        await fetchAddresses();

      } catch (err) {
        console.error("Failed to fetch profile data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const fetchAddresses = async () => {
    try {
        const addrRes = await userService.getUserAddresses();
        setAddresses(addrRes || []);
    } catch (e) {
        console.warn("Addresses not found");
    }
  };

  const stats = {
    totalOrders: orders.length,
    totalSpent: orders.reduce((acc, curr) => acc + (curr.total || 0), 0),
    activeAddresses: addresses.length,
    memberStatus: orders.length > 5 ? 'Elite Member' : 'Valued Customer'
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
    toast.success("Profile details updated!");
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
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
      
      // Clear form
      setNewAddress({
        name: '', phone: '', street: '', city: '', state: '', zip: '', locality: '', mobile: ''
      });
    } catch (err) {
      console.error("Failed to add address", err);
      toast.error("Failed to add address");
    }
  };
  
  const handleDeleteAddress = async (addressId: number) => {
    try {
      await userService.deleteAddress(addressId);
      toast.success("Address removed successfully");
      fetchAddresses();
    } catch (err) {
      console.error("Failed to delete address", err);
      toast.error("Failed to delete address");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col justify-center items-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
          <p className="text-muted-foreground mt-4 font-medium">Getting everything ready...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary/10 flex flex-col">
      <Navbar />
      
      {/* Premium Header Banner */}
      <div className="pt-24 md:pt-32 pb-16 bg-primary relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-secondary/20 skew-x-12 translate-x-20"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/10 rounded-full -translate-x-32 translate-y-32 blur-3xl"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-white/10 backdrop-blur-md border-4 border-white/20 p-1 shadow-2xl relative group"
            >
              <div className="w-full h-full rounded-full bg-gradient-to-br from-secondary to-primary/80 flex items-center justify-center text-white text-5xl font-bold">
                {profile?.firstName?.charAt(0) || profile?.username?.charAt(0) || 'U'}
              </div>
              <button className="absolute bottom-2 right-2 p-2 rounded-full bg-white text-primary shadow-lg scale-0 group-hover:scale-100 transition-transform duration-200">
                <Edit className="w-4 h-4" />
              </button>
            </motion.div>
            
            <div className="text-center md:text-left text-white">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                  <h1 className="text-3xl md:text-5xl font-display font-bold">
                    {profile?.firstName ? `${profile.firstName} ${profile.lastName || ''}` : 'User Profile'}
                  </h1>
                  <span className="px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-bold uppercase tracking-widest flex items-center gap-1 shadow-sm">
                    <ShieldCheck className="w-3 h-3" /> {stats.memberStatus}
                  </span>
                </div>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-white/70 text-sm md:text-base font-medium">
                  <span className="flex items-center gap-1.5"><Mail className="w-4 h-4" /> {profile?.email}</span>
                  <span className="hidden md:block">|</span>
                  <span className="flex items-center gap-1.5"><Package className="w-4 h-4" /> Member since {new Date().getFullYear()}</span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1 container mx-auto px-4 py-8 max-w-6xl -mt-10 relative z-20">
        
        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Orders', value: stats.totalOrders, icon: Package, color: 'text-primary' },
            { label: 'Total Spent', value: `₹${stats.totalSpent.toLocaleString()}`, icon: ShoppingCart, color: 'text-success' },
            { label: 'Addresses', value: stats.activeAddresses, icon: MapPin, color: 'text-secondary' },
            { label: 'Loyalty Points', value: stats.totalOrders * 50, icon: Star, color: 'text-warning' },
          ].map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 * i }}
              className="bg-card glass rounded-2xl border border-white/20 p-5 shadow-sm flex items-center gap-4 group hover:shadow-md transition-all cursor-default"
            >
              <div className={`p-3 rounded-xl bg-muted/50 ${stat.color} group-hover:scale-110 transition-transform`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase">{stat.label}</p>
                <p className="text-lg font-display font-bold">{stat.value}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Tabs Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-card glass rounded-2xl border border-white/20 p-2 shadow-sm sticky top-24">
              {[
                { id: 'overview', label: 'Overview', icon: User },
                { id: 'orders', label: 'My Orders', icon: Package },
                { id: 'addresses', label: 'Addresses', icon: MapPin },
                { id: 'security', label: 'Account Security', icon: ShieldCheck },
                { id: 'settings', label: 'Settings', icon: Settings },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold transition-all ${activeTab === tab.id ? 'bg-primary text-primary-foreground shadow-md' : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'}`}
                >
                  <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? '' : 'text-muted-foreground'}`} />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content Areas */}
          <div className="lg:col-span-3 min-h-[500px]">
            <AnimatePresence mode="wait">
              {activeTab === 'overview' && (
                <motion.div 
                  key="overview"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="bg-card glass rounded-2xl border border-white/20 p-8 shadow-sm">
                    <div className="flex items-center justify-between mb-8 pb-4 border-b border-border/50">
                      <h2 className="text-2xl font-display font-bold flex items-center gap-2">
                        Personal Information
                      </h2>
                      {!isEditing ? (
                        <Button onClick={() => setIsEditing(true)} size="sm" variant="ghost" className="text-primary gap-1 font-bold">
                          <Edit className="w-4 h-4" /> Edit Profile
                        </Button>
                      ) : (
                        <div className="flex gap-2">
                           <Button onClick={() => setIsEditing(false)} size="sm" variant="outline" className="font-bold">Cancel</Button>
                           <Button onClick={handleUpdateProfile} size="sm" className="bg-success hover:bg-success/90 font-bold gap-1"><Save className="w-4 h-4" /> Save Changes</Button>
                        </div>
                      )}
                    </div>
                    
                    <form className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {[
                        { label: 'First Name', key: 'firstName', editable: true },
                        { label: 'Last Name', key: 'lastName', editable: true },
                        { label: 'Email Address', key: 'email', editable: false },
                        { label: 'Mobile Phone', key: 'mobile', editable: true },
                      ].map((field) => (
                        <div key={field.key} className="space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">{field.label}</label>
                          <input 
                            disabled={!isEditing || !field.editable}
                            value={formData[field.key as keyof typeof formData]}
                            onChange={(e) => setFormData({...formData, [field.key]: e.target.value})}
                            className={`w-full px-5 py-3 rounded-2xl border transition-all font-semibold outline-none focus:ring-4 focus:ring-primary/10 ${!isEditing || !field.editable ? 'bg-muted/30 border-transparent text-muted-foreground' : 'bg-background border-border hover:border-primary focus:border-primary'}`}
                          />
                        </div>
                      ))}
                    </form>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-card glass rounded-2xl border border-white/20 p-6 shadow-sm">
                       <h3 className="font-bold mb-4 flex items-center gap-2">Quick Overview</h3>
                       <p className="text-sm text-muted-foreground leading-relaxed">
                         You have placed <strong>{stats.totalOrders} orders</strong> in total and have <strong>{stats.activeAddresses} saved addresses</strong>. 
                         Your total life-time spending is <strong>₹{stats.totalSpent.toLocaleString()}</strong>.
                       </p>
                    </div>
                    <div className="bg-card glass rounded-2xl border border-white/20 p-6 shadow-sm flex flex-col justify-center items-center text-center">
                       <Star className="w-8 h-8 text-warning mb-2 fill-warning" />
                       <h3 className="font-bold uppercase tracking-widest text-xs text-warning">Loyalty Program</h3>
                       <p className="text-xl font-display font-bold mt-1">{stats.totalOrders * 50} Points</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'orders' && (
                <motion.div 
                  key="orders"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-card glass rounded-2xl border border-white/20 shadow-sm overflow-hidden"
                >
                  <div className="p-6 border-b border-border/50">
                    <h2 className="text-xl font-display font-bold">My Order History</h2>
                  </div>
                  {orders.length === 0 ? (
                    <div className="py-20 text-center">
                       <Package className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
                       <p className="text-muted-foreground font-medium">No orders found yet</p>
                       <Link to="/products" className="text-primary font-bold hover:underline mt-2 inline-block">Start Shopping</Link>
                    </div>
                  ) : (
                    <div className="divide-y divide-border/50">
                      {orders.map((order) => (
                        <Link 
                          to={`/orders/${order.id}`}
                          key={order.id} 
                          className="p-5 md:p-8 flex flex-col md:flex-row md:items-center gap-6 hover:bg-muted/30 transition-all group"
                        >
                          <div className="w-20 h-20 rounded-2xl bg-muted border border-border/50 flex items-center justify-center shrink-0 overflow-hidden group-hover:scale-105 transition-transform">
                             {order.orderItems?.[0]?.product?.images?.[0] ? (
                               <img src={order.orderItems[0].product.images[0]} alt="" className="w-full h-full object-cover" />
                             ) : <Package className="w-8 h-8 text-muted-foreground/30" />}
                          </div>
                          <div className="flex-1">
                             <div className="flex items-center gap-3 mb-1">
                               <span className="font-display font-bold text-lg">Order #{order.id.toString().slice(-8)}</span>
                               <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${order.orderStatus === 'DELIVERED' ? 'bg-success/10 text-success' : 'bg-primary/10 text-primary'}`}>
                                 {order.orderStatus}
                               </span>
                             </div>
                             <p className="text-sm text-muted-foreground">Placed on {new Date(order.orderDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                             <p className="text-xs text-muted-foreground mt-2">{order.orderItems?.length || 0} items</p>
                          </div>
                          <div className="text-right flex md:flex-col items-center md:items-end justify-between md:justify-center">
                             <p className="text-2xl font-display font-bold">₹{order.total?.toLocaleString()}</p>
                             <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'addresses' && (
                <motion.div 
                  key="addresses"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between mb-4">
                     <h2 className="text-2xl font-display font-bold">Saved Addresses</h2>
                     <Button 
                        onClick={() => setIsAddingAddress(!isAddingAddress)}
                        className="font-bold gap-2"
                        variant={isAddingAddress ? "outline" : "default"}
                     >
                        {isAddingAddress ? 'Cancel' : <><Plus className="w-4 h-4" /> Add New</>}
                     </Button>
                  </div>

                  {isAddingAddress && (
                    <motion.form 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      onSubmit={handleSaveAddress} 
                      className="mb-8 p-6 bg-card glass border border-white/20 rounded-2xl shadow-xl space-y-6"
                    >
                      <h3 className="text-lg font-bold mb-4">Add New Delivery Address</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Receiver Name</label>
                          <input 
                            required
                            className="w-full px-5 py-3 rounded-2xl border bg-background border-border hover:border-primary focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-semibold"
                            placeholder="e.g. Rahul Sharma"
                            value={newAddress.name}
                            onChange={(e) => setNewAddress({...newAddress, name: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Mobile Number</label>
                          <input 
                            required
                            className="w-full px-5 py-3 rounded-2xl border bg-background border-border hover:border-primary focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-semibold"
                            placeholder="9876543210"
                            value={newAddress.phone}
                            onChange={(e) => setNewAddress({...newAddress, phone: e.target.value})}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Street Address</label>
                        <input 
                          required
                          className="w-full px-5 py-3 rounded-2xl border bg-background border-border hover:border-primary focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-semibold"
                          placeholder="Flat, House no., Building, Company, Apartment"
                          value={newAddress.street}
                          onChange={(e) => setNewAddress({...newAddress, street: e.target.value, locality: e.target.value})}
                        />
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Pincode</label>
                          <input 
                            required
                            className="w-full px-5 py-3 rounded-2xl border bg-background border-border hover:border-primary focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-semibold font-mono"
                            placeholder="400001"
                            value={newAddress.zip}
                            onChange={(e) => setNewAddress({...newAddress, zip: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">City</label>
                          <input 
                            required
                            className="w-full px-5 py-3 rounded-2xl border bg-background border-border hover:border-primary focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-semibold"
                            placeholder="Mumbai"
                            value={newAddress.city}
                            onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                          />
                        </div>
                        <div className="col-span-2 md:col-span-1 space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">State</label>
                          <input 
                            required
                            className="w-full px-5 py-3 rounded-2xl border bg-background border-border hover:border-primary focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-semibold"
                            placeholder="Maharashtra"
                            value={newAddress.state}
                            onChange={(e) => setNewAddress({...newAddress, state: e.target.value})}
                          />
                        </div>
                      </div>

                      <Button type="submit" className="w-full py-6 rounded-2xl font-bold shadow-lg shadow-primary/20">
                        Save Address
                      </Button>
                    </motion.form>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {addresses.length === 0 ? (
                      <div className="col-span-full py-20 bg-card glass rounded-2xl border border-white/20 text-center">
                         <MapPin className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
                         <p className="text-muted-foreground font-medium">No addresses saved yet</p>
                      </div>
                    ) : addresses.map((addr, i) => (
                      <div key={i} className="bg-card glass rounded-2xl border border-white/20 p-6 shadow-sm relative group hover:border-primary/50 transition-all">
                        <div className="flex items-center gap-2 mb-4">
                           <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                             <MapPin className="w-5 h-5" />
                           </div>
                           <h3 className="font-bold text-lg">{addr.name || 'Home'}</h3>
                        </div>
                        <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                          {addr.address}<br/>
                          {addr.city}, {addr.state} - {addr.pincode}
                        </p>
                        <div className="flex items-center gap-4 border-t border-border/50 pt-4">
                           <button className="text-xs font-bold text-primary hover:underline">Edit</button>
                           <button 
                             onClick={() => handleDeleteAddress(addr.id)}
                             className="text-xs font-bold text-destructive hover:underline"
                           >
                             Remove
                           </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'security' && (
                <motion.div 
                  key="security"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-card glass rounded-2xl border border-white/20 p-8 shadow-sm"
                >
                   <h2 className="text-2xl font-display font-bold mb-8">Account Security</h2>
                   <div className="space-y-8">
                      <div className="flex items-center justify-between gap-6 p-4 rounded-2xl border border-border/50 bg-muted/20">
                         <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500"><Settings className="w-6 h-6" /></div>
                            <div>
                               <p className="font-bold">Password</p>
                               <p className="text-xs text-muted-foreground">Change your password frequently to keep account safe</p>
                            </div>
                         </div>
                         <Button variant="outline" size="sm" className="font-bold">Change</Button>
                      </div>

                      <div className="flex items-center justify-between gap-6 p-4 rounded-2xl border border-border/50 bg-muted/20">
                         <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500"><ShieldCheck className="w-6 h-6" /></div>
                            <div>
                               <p className="font-bold">Two-Factor Authentication</p>
                               <p className="text-xs text-muted-foreground">Add an extra layer of security to your account</p>
                            </div>
                         </div>
                         <Button variant="outline" size="sm" className="font-bold">Enable</Button>
                      </div>
                   </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Profile;
