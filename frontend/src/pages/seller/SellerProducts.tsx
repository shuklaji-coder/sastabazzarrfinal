import { SellerLayout } from '@/components/SellerLayout';
import { Plus, Edit, Trash2, Search, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productService } from '@/services/productService';

const SellerProducts = () => {
  const [search, setSearch] = useState('');
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await productService.getAllProducts();
        const data = res.content || res;
        if (Array.isArray(data)) {
          setProducts(data);
          console.log('=== SELLER PRODUCTS PAGE ===');
          data.forEach((product, index) => {
            console.log(`${index + 1}. ${product.title || product.name} - ₹${product.sellingPrice || product.price} (Stock: ${product.quantity || product.stock || 0})`);
          });
        }
      } catch (err) {
        console.error("Failed to load seller products", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filtered = products.filter(p => (p.name || p.title || '').toLowerCase().includes(search.toLowerCase()));

  return (
    <SellerLayout>
      <div className="p-6 md:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-2xl font-bold text-foreground">Products</h1>
          <Link to="/seller/products/add" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors">
            <Plus className="w-4 h-4" /> Add Product
          </Link>
        </div>

        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text" placeholder="Search products..."
            value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-input bg-card text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        {/* Product Summary */}
        <div className="bg-card rounded-lg border border-border p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-foreground">Product Summary</h3>
            <span className="text-sm text-muted-foreground">{products.length} Total Products</span>
          </div>
          {products.length > 0 && (
            <div className="space-y-1">
              {products.slice(0, 3).map((product, index) => (
                <div key={product.id} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{index + 1}. {product.title || product.name}</span>
                  <span className="font-medium text-foreground">₹{product.sellingPrice || product.price || 0}</span>
                </div>
              ))}
              {products.length > 3 && (
                <div className="text-xs text-muted-foreground pt-1">
                  ... and {products.length - 3} more products
                </div>
              )}
            </div>
          )}
        </div>

        <div className="bg-card rounded-lg border border-border overflow-hidden">
          {isLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Product</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Category</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Price</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Stock</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Rating</th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr><td colSpan={6} className="py-8 text-center text-muted-foreground">No products found.</td></tr>
                  ) : filtered.map(product => (
                    <tr key={product.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img src={product.images?.[0] || 'https://via.placeholder.com/150'} alt="" className="w-10 h-10 rounded-lg object-cover" />
                          <div>
                            <span className="font-medium text-foreground line-clamp-1">{product.title || product.name}</span>
                            <span className="text-xs text-muted-foreground">ID: {product.id}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {typeof product.category === 'object' 
                          ? (product.category?.name || 'Uncategorized') 
                          : (product.category || 'Uncategorized')}
                      </td>
                      <td className="py-3 px-4">
                        <div className="space-y-1">
                          <span className="font-display font-semibold text-foreground">₹{(product.sellingPrice || product.discountedPrice || product.price || 0).toFixed(2)}</span>
                          {product.mrpPrice && product.mrpPrice > (product.sellingPrice || product.price) && (
                            <span className="text-xs text-muted-foreground line-through block">₹{product.mrpPrice.toFixed(2)}</span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`text-sm font-medium ${(product.quantity || product.stock || 0) < 20 ? 'text-destructive' : 'text-success'}`}>
                          {product.quantity || product.stock || 0}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-foreground">⭐ {product.rating || '4.5'}</td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"><Edit className="w-4 h-4" /></button>
                          <button className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </SellerLayout>
  );
};

export default SellerProducts;
