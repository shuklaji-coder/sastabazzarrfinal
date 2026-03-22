import { AdminLayout } from '@/components/AdminLayout';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { productService } from '@/services/productService';
import { ArrowLeft, Loader2, Save, Image as ImageIcon, Tag, DollarSign, ListOrdered, Sparkles, UploadCloud } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

const AddProduct = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    mrpPrice: '',
    sellingPrice: '',
    color: '',
    images: '',
    category: '',
    category2: '',
    category3: '',
    brand: '',
    sizes: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        mrpPrice: parseInt(formData.mrpPrice),
        sellingPrice: parseInt(formData.sellingPrice),
        color: formData.color,
        images: formData.images.split(',').map(url => url.trim()),
        brand: formData.brand,
        sizes: formData.sizes || '',
        // Converting simple string to Category object structure expected by backend
        category: { name: formData.category, categoryId: formData.category.toLowerCase().replace(/\s+/g, '_') },
        category2: { name: formData.category2, categoryId: formData.category2.toLowerCase().replace(/\s+/g, '_') },
        category3: { name: formData.category3, categoryId: formData.category3.toLowerCase().replace(/\s+/g, '_') }
      };

      await productService.createProduct(payload);
      toast.success('Product created successfully!', {
        icon: <Sparkles className="w-5 h-5 text-primary" />,
      });
      navigate('/admin/products');
    } catch (err: any) {
      console.error("Create product failed", err);
      toast.error(err.message || 'Failed to create product.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8 max-w-5xl mx-auto p-6 md:p-8">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link to="/admin/products" className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center hover:bg-secondary transition-colors group shadow-sm">
              <ArrowLeft className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
            </Link>
            <div>
              <h1 className="font-display text-3xl font-bold text-foreground tracking-tight">Add New Product</h1>
              <p className="text-muted-foreground mt-1 text-sm">Create a new product listing for your store.</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <Link to="/admin/products" className="px-5 py-2.5 rounded-xl border border-border bg-card font-semibold text-foreground hover:bg-muted transition-all shadow-sm">
              Discard
            </Link>
            <button 
              onClick={handleSubmit}
              disabled={isSubmitting} 
              className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-bold hover:bg-primary/90 transition-all shadow-md hover:shadow-lg focus:ring-2 focus:ring-primary/50 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              Publish Product
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Basic Information */}
            <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
              <div className="p-6 border-b border-border bg-muted/10">
                <div className="flex items-center gap-2">
                  <Tag className="w-5 h-5 text-primary" />
                  <h3 className="font-display font-bold text-lg text-foreground">Basic Information</h3>
                </div>
              </div>
              <div className="p-6 space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">Product Title <span className="text-destructive">*</span></label>
                  <input 
                    required 
                    name="title" 
                    value={formData.title} 
                    onChange={handleChange} 
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-foreground" 
                    placeholder="e.g. Premium Cotton T-Shirt" 
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">Description <span className="text-destructive">*</span></label>
                  <textarea 
                    required 
                    name="description" 
                    value={formData.description} 
                    onChange={handleChange} 
                    rows={6} 
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-foreground resize-none" 
                    placeholder="Write a detailed product description highlighting features, material, and care instructions..." 
                  />
                  <p className="text-xs text-muted-foreground text-right mt-1">Make it compelling and detailed.</p>
                </div>
              </div>
            </div>

            {/* Media */}
            <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
               <div className="p-6 border-b border-border bg-muted/10">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-primary" />
                  <h3 className="font-display font-bold text-lg text-foreground">Product Media</h3>
                </div>
              </div>
              <div className="p-6 space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">Image URLs <span className="text-destructive">*</span></label>
                  <p className="text-xs text-muted-foreground mb-3">Provide comma-separated URLs for the product images. The first image will be used as the cover.</p>
                  
                  <div className="border border-border bg-muted/30 rounded-xl p-4 flex flex-col items-center justify-center gap-3 border-dashed h-40">
                     <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                       <UploadCloud className="w-6 h-6" />
                     </div>
                     <p className="text-sm font-medium text-foreground">Paste image URLs below</p>
                  </div>
                  
                  <input 
                    required 
                    name="images" 
                    value={formData.images} 
                    onChange={handleChange} 
                    className="w-full px-4 py-3 mt-4 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-foreground" 
                    placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg" 
                  />
                  
                  {formData.images && (
                    <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
                       {formData.images.split(',').filter(url => url.trim() !== '').map((url, i) => (
                         <div key={i} className="w-16 h-16 rounded-lg border border-border bg-white overflow-hidden shrink-0 relative group">
                           <img src={url.trim()} alt="" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
                         </div>
                       ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>

          {/* Sidebar Column */}
          <div className="space-y-8">
            
            {/* Pricing */}
            <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
              <div className="p-6 border-b border-border bg-muted/10">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-success" />
                  <h3 className="font-display font-bold text-lg text-foreground">Pricing</h3>
                </div>
              </div>
              <div className="p-6 space-y-5">
                <div className="space-y-2 relative">
                  <label className="text-sm font-semibold text-foreground">Selling Price <span className="text-destructive">*</span></label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-semibold text-muted-foreground">₹</span>
                    <input 
                      required 
                      type="number" 
                      name="sellingPrice" 
                      value={formData.sellingPrice} 
                      onChange={handleChange} 
                      className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-foreground font-display font-semibold" 
                      placeholder="0.00"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">Original Price (MRP) <span className="text-destructive">*</span></label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-medium text-muted-foreground">₹</span>
                    <input 
                      required 
                      type="number" 
                      name="mrpPrice" 
                      value={formData.mrpPrice} 
                      onChange={handleChange} 
                      className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-foreground font-display" 
                      placeholder="0.00"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Shown struck-out to indicate a discount.</p>
                </div>
              </div>
            </div>

            {/* Organization */}
            <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
               <div className="p-6 border-b border-border bg-muted/10">
                <div className="flex items-center gap-2">
                  <ListOrdered className="w-5 h-5 text-warning" />
                  <h3 className="font-display font-bold text-lg text-foreground">Organization</h3>
                </div>
              </div>
              <div className="p-6 space-y-5">
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2 col-span-2">
                    <label className="text-sm font-semibold text-foreground">Top Category <span className="text-destructive">*</span></label>
                    <input 
                      required 
                      name="category" 
                      value={formData.category} 
                      onChange={handleChange} 
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-foreground" 
                      placeholder="e.g. Clothing" 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Sub Category</label>
                    <input 
                      name="category2" 
                      value={formData.category2} 
                      onChange={handleChange} 
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-foreground" 
                      placeholder="e.g. Men" 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Type category</label>
                    <input 
                      name="category3" 
                      value={formData.category3} 
                      onChange={handleChange} 
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-foreground" 
                      placeholder="e.g. T-Shirts" 
                    />
                  </div>
                </div>

                <div className="h-px bg-border my-2"></div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">Color Variant</label>
                  <input 
                    name="color" 
                    value={formData.color} 
                    onChange={handleChange} 
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-foreground" 
                    placeholder="e.g. Navy Blue" 
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">Brand <span className="text-destructive">*</span></label>
                  <input 
                    required
                    name="brand" 
                    value={formData.brand} 
                    onChange={handleChange} 
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-foreground" 
                    placeholder="e.g. Nike" 
                  />
                </div>



              </div>
            </div>

          </div>
          
        </form>
      </div>
    </AdminLayout>
  );
};

export default AddProduct;
