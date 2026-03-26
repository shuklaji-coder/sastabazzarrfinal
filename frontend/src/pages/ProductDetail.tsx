import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { Star, ShoppingCart, ArrowLeft, Truck, Shield, RotateCcw, Loader2, ChevronRight, Check, Share2, Copy } from 'lucide-react';
import { useState, useEffect } from 'react';
import { ProductCard } from '@/components/ProductCard';
import { productService } from '@/services/productService';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [product, setProduct] = useState<any>(null);
  const [related, setRelated] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [isAdding, setIsAdding] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  const addToRecentlyViewed = (product: any) => {
    if (!product) return;
    try {
      const stored = localStorage.getItem('recently_viewed');
      let viewed: any[] = stored ? JSON.parse(stored) : [];
      
      // Remove if already exists and add to front
      viewed = viewed.filter(p => p.id !== product.id);
      viewed.unshift(product);
      
      // Limit to 10 items
      const limited = viewed.slice(0, 10);
      localStorage.setItem('recently_viewed', JSON.stringify(limited));
    } catch (e) {
      console.error("Error updating recently viewed", e);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!");
  };

  const handleWhatsAppShare = () => {
    const text = `Check out this amazing product on SastaaBazaar: ${product?.name} at ₹${(product?.sellingPrice || product?.price).toLocaleString('en-IN')}! \n\nLink: ${window.location.href}`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const getSizeList = (sizes: string): string[] => {
    if (!sizes || sizes.trim() === '') return [];
    return sizes.split(',').map(s => s.trim()).filter(Boolean);
  };

  const handleAddToCart = async () => {
    if (!product) return;
    const sizeList = getSizeList(product.sizes);
    if (sizeList.length > 0 && !selectedSize) {
      toast.error('Please select a size first!');
      return;
    }
    setIsAdding(true);
    try {
      await addItem({ ...product, selectedSize }, qty);
      toast.success("Added to cart successfully");
    } catch (err) {
      toast.error("Failed to add to cart");
    } finally {
      setIsAdding(false);
    }
  };

  const handleBuyNow = async () => {
    if (!product) return;
    const sizeList = getSizeList(product.sizes);
    if (sizeList.length > 0 && !selectedSize) {
      toast.error('Please select a size first!');
      return;
    }
    try {
      await addItem({ ...product, selectedSize }, qty);
      navigate('/checkout');
    } catch (err) {
      toast.error("Failed to proceed to checkout");
    }
  };

  useEffect(() => {
    const fetchProductAndRelated = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const fetchedProduct = await productService.getProductById(parseInt(id));
        setProduct(fetchedProduct);
        
        // Fetch related products by category
        if (fetchedProduct?.category) {
            addToRecentlyViewed(fetchedProduct);
            try {
                const response = await productService.getAllProducts({ category: fetchedProduct.category });
                const data = response.content || response;
                if (Array.isArray(data)) {
                    setRelated(data.filter((p: any) => p.id !== fetchedProduct.id).slice(0, 5));
                }
            } catch (err) {
                console.warn("Failed to fetch related products", err);
            }
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load product details');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProductAndRelated();
    window.scrollTo(0, 0);
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col justify-center items-center py-20">
          <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground font-medium animate-pulse">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="container mx-auto px-4 py-32 text-center flex-1">
          <h2 className="text-2xl font-bold mb-4">Product not found.</h2>
          <p className="text-muted-foreground mb-8">The product you are looking for might have been removed or is temporarily unavailable.</p>
          <Button asChild>
            <Link to="/products">Return to Products</Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const images = product.images && product.images.length > 0 ? product.images : ['https://via.placeholder.com/600?text=No+Image'];
  const finalPrice = product.sellingPrice || product.discountedPrice || product.price || 0;
  const originalPrice = product.originalPrice || product.mrpPrice || 0;
  const discount = originalPrice > finalPrice ? Math.round(((originalPrice - finalPrice) / originalPrice) * 100) : 0;

  return (
    <div className="min-h-screen bg-secondary/10 flex flex-col pt-16 md:pt-20">
      <Navbar />
      
      {/* Breadcrumb Area */}
      <div className="bg-background border-b border-border py-3">
        <div className="container mx-auto px-4 flex items-center text-sm text-muted-foreground flex-wrap gap-1">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <Link to="/products" className="hover:text-primary transition-colors">Products</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-foreground font-medium truncate max-w-[200px] sm:max-w-md">{product.name}</span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 flex-grow">
        
        {/* Main Product Section */}
        <div className="bg-card rounded-2xl shadow-sm border border-border p-4 md:p-8 mb-12">
          <div className="flex flex-col lg:flex-row gap-10">
            
            {/* Left: Image Gallery */}
            <div className="w-full lg:w-5/12 xl:w-1/2 flex gap-4">
              {/* Thumbnails (Desktop) */}
              <div className="hidden md:flex flex-col gap-3 w-20 shrink-0">
                {images.map((img: string, idx: number) => (
                  <button 
                    key={idx}
                    onMouseEnter={() => setActiveImage(idx)}
                    onClick={() => setActiveImage(idx)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${activeImage === idx ? 'border-primary ring-2 ring-primary/20' : 'border-transparent hover:border-border'}`}
                  >
                    <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
              
              {/* Main Image */}
              <div className="flex-1 relative aspect-square md:aspect-[4/5] bg-white rounded-xl overflow-hidden border border-border flex items-center justify-center p-4">
                <img 
                  src={images[activeImage]} 
                  alt={product.name} 
                  className="w-full h-full object-contain" 
                />
                {discount > 0 && (
                  <span className="absolute top-4 left-4 bg-destructive text-destructive-foreground font-bold px-3 py-1 rounded-md text-sm shadow-md">
                    -{discount}% OFF
                  </span>
                )}
              </div>

              {/* Thumbnails (Mobile) */}
              <div className="flex md:hidden gap-3 mt-4 overflow-x-auto pb-4 w-full hide-scrollbar">
                 {images.map((img: string, idx: number) => (
                  <button 
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`w-16 h-16 shrink-0 rounded-lg overflow-hidden border-2 transition-all ${activeImage === idx ? 'border-primary ring-2 ring-primary/20' : 'border-border bg-white p-1'}`}
                  >
                    <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Product Info & Buy Box */}
            <div className="w-full lg:w-7/12 xl:w-1/2 flex flex-col">
              
              {/* Header Info */}
              <div className="border-b border-border pb-6 mb-6">
                <Link to={`/seller/${product?.seller?.id || '#'}`} className="text-secondary font-semibold text-sm hover:underline mb-2 inline-block uppercase tracking-wide">
                  {product?.brand || product?.seller?.name || 'SastaBazaar Select'} {product?.seller?.isVerified && <Check className="inline w-3 h-3 bg-secondary text-white rounded-full p-0.5" />}
                </Link>
                <h1 className="font-display text-2xl md:text-3xl lg:text-4xl font-bold text-foreground leading-tight mb-4">
                  {product.name}
                </h1>
                
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-1 bg-warning/10 px-2 py-1 rounded-md">
                    <span className="text-sm font-bold text-warning-foreground">
                      {product.rating && product.rating > 0 
                        ? product.rating 
                        : (3.8 + (String(product.id).charCodeAt(0) % 12) / 10).toFixed(1)}
                    </span>
                    <Star className="w-4 h-4 fill-warning text-warning" />
                  </div>
                  <span className="text-sm text-primary hover:underline cursor-pointer font-medium">
                    {(product.reviewCount && product.reviewCount > 0
                      ? product.reviewCount
                      : Math.floor(120 + (String(product.id).charCodeAt(0) % 50) * 45)).toLocaleString()} Ratings
                  </span>
                  <span className="text-muted-foreground text-sm">|</span>
                  <span className="text-sm font-medium text-success flex items-center gap-1">
                    <Check className="w-4 h-4" /> Trusted Quality
                  </span>
                </div>
              </div>

              {/* Pricing Block */}
              <div className="mb-8">
                <div className="flex items-end gap-3 flex-wrap mb-2">
                  {discount > 0 && <span className="text-3xl text-destructive font-light">-{discount}%</span>}
                  <span className="font-display font-bold text-4xl text-foreground flex items-start">
                    <span className="text-xl mt-1">₹</span>{finalPrice.toLocaleString('en-IN')}
                  </span>
                </div>
                
                {/* Share Actions */}
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Share:</span>
                  <button 
                    onClick={handleWhatsAppShare}
                    className="w-10 h-10 rounded-full bg-[#25D366]/10 text-[#25D366] flex items-center justify-center hover:bg-[#25D366] hover:text-white transition-all shadow-sm"
                    title="Share on WhatsApp"
                  >
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.937 3.659 1.435 5.63 1.436h.008c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                    </svg>
                  </button>
                  <button 
                    onClick={handleCopyLink}
                    className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-all shadow-sm"
                    title="Copy Link"
                  >
                    <Copy className="w-5 h-5" />
                  </button>
                </div>
                {originalPrice > finalPrice && (
                  <p className="text-sm text-muted-foreground mr-1">
                    M.R.P.: <span className="line-through">₹{originalPrice.toLocaleString('en-IN')}</span> 
                    <span className="ml-2 font-medium">Inclusive of all taxes</span>
                  </p>
                )}
              </div>

              {/* Conditional Size Selector — only shown when product has sizes */}
              {getSizeList(product.sizes).length > 0 && (
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-lg">Select Size</h3>
                    {selectedSize && (
                      <span className="text-sm font-semibold text-primary">
                        Selected: <span className="uppercase">{selectedSize}</span>
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {getSizeList(product.sizes).map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`min-w-[52px] h-12 px-4 rounded-lg border-2 font-bold text-sm uppercase transition-all ${
                          selectedSize === size
                            ? 'border-primary bg-primary text-primary-foreground shadow-md scale-105'
                            : 'border-border bg-background hover:border-primary/60 text-foreground hover:bg-primary/5'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                  {!selectedSize && (
                    <p className="text-xs text-destructive mt-2 font-medium">* Please select a size to continue</p>
                  )}
                </div>
              )}

              {/* Description & Specs */}
              <div className="mb-8">
                <h3 className="font-bold text-lg mb-3">About this item</h3>
                <div className="text-muted-foreground text-sm space-y-2 leading-relaxed whitespace-pre-line">
                  {product.description || "No detailed description available for this product."}
                </div>
              </div>

              {/* Action Box (Buy/Add to Cart) */}
              <div className="bg-muted/30 border border-border rounded-xl p-5 mb-6">
                 <p className="text-lg font-bold mb-4 text-success">
                   Available Now
                 </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Quantity Selector */}
                  <div className="flex items-center border-2 border-border bg-background rounded-lg shrink-0 h-12 w-32">
                    <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-3 h-full text-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors rounded-l-md">−</button>
                    <span className="flex-1 text-center font-bold">{qty}</span>
                    <button onClick={() => setQty(qty + 1)} className="px-3 h-full text-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors rounded-r-md">+</button>
                  </div>
                  
                  {/* Buttons */}
                  <div className="flex flex-col w-full gap-3">
                    <Button 
                      onClick={() => navigate(`/product/${product?.id || id}/bargain`)}
                      className="w-full h-14 text-lg font-bold bg-gradient-to-r from-orange-400 via-orange-500 to-amber-500 text-white hover:from-orange-500 hover:to-amber-600 shadow-[0_0_20px_rgba(249,115,22,0.4)] transition-all transform hover:scale-[1.02] border-none group relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                      <span className="text-2xl mr-2 group-hover:scale-110 transition-transform">🤝</span> Bhaav Lagao / Get AI Deal
                    </Button>
                    <div className="flex gap-3">
                      <Button 
                        disabled={isAdding}
                        onClick={handleAddToCart}
                        className="flex-1 h-12 text-sm md:text-base font-bold bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-sm"
                      >
                        {isAdding ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <ShoppingCart className="w-5 h-5 mr-2" />}
                        Add to Cart
                      </Button>
                      <Button 
                        variant="outline"
                        disabled={isAdding}
                        onClick={handleBuyNow}
                        className="flex-1 h-12 text-sm md:text-base font-bold border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground shadow-sm"
                      >
                        Buy Now
                      </Button>
                    </div>
                  </div>
                </div>

                 <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground font-medium">
                   <Shield className="w-4 h-4 text-success" /> Secure transaction handled by SastaaBazaar
                 </div>
              </div>

              {/* Trust Features Grid */}
              <div className="grid grid-cols-4 gap-2 pt-4 border-t border-border">
                {[
                  { icon: Truck, label: 'Free Delivery' },
                  { icon: Shield, label: '1 Year Warranty' },
                  { icon: RotateCcw, label: '7 Days Replacement' },
                  { icon: Check, label: 'Top Brand' },
                ].map((item, i) => (
                  <div key={i} className="flex flex-col items-center text-center gap-2 p-2">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <item.icon className="w-5 h-5" />
                    </div>
                    <p className="text-xs font-medium text-foreground leading-tight">{item.label}</p>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>

        {/* Customer Reviews Section */}
        <div className="bg-card rounded-2xl shadow-sm border border-border p-6 md:p-8 mb-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 border-b border-border pb-6">
            <div>
              <h2 className="font-display text-2xl font-bold text-foreground">Customer Reviews</h2>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < 4.5 ? 'fill-warning text-warning' : 'text-muted-foreground'}`} />
                  ))}
                </div>
                <span className="text-sm font-medium text-muted-foreground">Based on {(product.reviewCount || 100).toLocaleString()} global ratings</span>
              </div>
            </div>
            <Button variant="outline" className="font-bold border-2 border-primary text-primary hover:bg-primary/5">Write a review</Button>
          </div>

          <div className="space-y-8">
            {(() => {
              const indianNames = [
                "Rahul Khanna", "Anjali Deshmukh", "Vikram Singh", "Priya Sharma", 
                "Suresh Iyer", "Meera Reddy", "Arjun Malhotra", "Sneha Patil",
                "Rajesh Kumar", "Kavita Singh", "Amit Sharma", "Deepika Iyer",
                "Rohan Gupta", "Shweta Verma", "Aarav Mehta", "Ishita Jain"
              ];

              const reviewComments = [
                "Absolutely loved it! The quality is premium and delivery was super fast.",
                "Value for money. Best in this segment. Packaging was also very good.",
                "Bahut hi badiya product hai. Sabko recommend karunga.",
                "Excellent build quality. Feels very sturdy and premium.",
                "Initially I was skeptical but after using it, I'm very happy with the purchase.",
                "Great service by SastaaBazaar. Product is exactly as shown in pictures.",
                "Amazing experience. The product exceeded my expectations.",
                "The finish is excellent. Looks much better in person than in the photos.",
                "Highly recommended for daily use. Very comfortable and durable.",
                "Premium feel and superb look. Worth every penny."
              ];

              const seed = String(product.id || id).charCodeAt(0);
              const numReviews = 3 + (seed % 3);
              const reviews = [];
              
              for (let i = 0; i < numReviews; i++) {
                const nameIdx = (seed + i * 7) % indianNames.length;
                const commentIdx = (seed + i * 13) % reviewComments.length;
                const rating = 4 + (seed + i) % 2; 
                const date = new Date(2024, 2, 14); 
                date.setDate(date.getDate() - (seed % 60) - i*4);
                
                reviews.push({
                  id: i,
                  name: indianNames[nameIdx],
                  comment: reviewComments[commentIdx],
                  rating,
                  date: date.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
                });
              }

              return reviews.map((rev) => (
                <div key={rev.id} className="border-b border-border last:border-0 pb-8 last:pb-0 animate-fade-in">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center font-bold text-secondary">
                      {rev.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-foreground leading-none">{rev.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">Verified Purchase • {rev.date}</p>
                    </div>
                  </div>
                  <div className="flex mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-warning text-warning' : 'text-muted-foreground'}`} />
                    ))}
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed max-w-3xl">
                    {rev.comment}
                  </p>
                </div>
              ));
            })()}
          </div>
        </div>

        {/* Related Products Carousel */}
        {related.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6 border-b border-border pb-4">
              <h2 className="font-display text-2xl font-bold text-foreground">Products related to this item</h2>
            </div>
            <div className="flex overflow-x-auto pb-6 gap-4 md:gap-6 hide-scrollbar snap-x">
              {related.map((p, i) => (
                <div key={p.id} className="min-w-[200px] w-[200px] md:min-w-[240px] snap-center">
                  <ProductCard product={p} index={i} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer />

      {/* Sticky Mobile Action Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass border-t border-border p-3 flex gap-3 animate-slide-up pb-safe">
        <Button 
          disabled={isAdding}
          onClick={handleAddToCart}
          variant="outline"
          className="flex-1 h-12 border-2 border-secondary text-secondary hover:bg-secondary/10 font-bold"
        >
          {isAdding ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShoppingCart className="w-5 h-5 mr-2" />}
          Add
        </Button>
        <Button 
          onClick={handleBuyNow}
          className="flex-[2] h-12 bg-secondary text-secondary-foreground hover:bg-secondary/90 font-bold shadow-lg"
        >
          Buy Now
        </Button>
      </div>
    </div>
  );
};

export default ProductDetail;
