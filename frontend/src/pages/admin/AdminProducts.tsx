import { AdminLayout } from '@/components/AdminLayout';
import { Pencil, Trash2, Plus, Loader2, Search, Filter, MoreHorizontal } from 'lucide-react';
import { useState, useEffect } from 'react';
import { productService } from '@/services/productService';
import { Link } from 'react-router-dom';

const AdminProducts = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('Newest First');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const pageSize = 20; // Increased default for admin

  const fetchProducts = async (page = 0) => {
    setIsLoading(true);
    try {
      const data = await productService.getAllProducts({
        pageNumber: page,
        pageSize: pageSize
      });
      // Assuming Spring backend returns pagination format like { content: [...], totalPages: X }
      if (data && data.content) {
        setProducts(data.content);
        setTotalPages(data.totalPages || 1);
        setTotalItems(data.totalElements || 0);
      } else {
        setProducts(data || []);
      }
    } catch (err) {
      console.error("Failed to load admin products", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage]);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await productService.deleteProduct(id);
      fetchProducts();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const filteredProducts = products
    .filter(p => (p.title || p.name || '').toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'Price: High to Low') return (b.sellingPrice || 0) - (a.sellingPrice || 0);
      if (sortBy === 'Price: Low to High') return (a.sellingPrice || 0) - (b.sellingPrice || 0);
      return (b.id || 0) - (a.id || 0); // Newest First (default)
    });

  return (
  <AdminLayout>
    <div className="space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground tracking-tight">Products</h1>
          <p className="text-muted-foreground mt-1 text-sm">Manage your inventory, prices, and product details.</p>
        </div>
        <Link 
          to="/admin/products/add" 
          className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl font-bold hover:bg-primary/90 transition-all shadow-md hover:shadow-lg focus:ring-2 focus:ring-primary/50 outline-none"
        >
          <Plus className="w-4 h-4" /> Add New Product
        </Link>
      </div>

      {/* Data Table Container */}
      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden flex flex-col">
        
        {/* Table Toolbar */}
        <div className="p-4 md:p-6 border-b border-border flex flex-col sm:flex-row gap-4 justify-between items-center bg-muted/10">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all placeholder:text-muted-foreground"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 border border-border bg-background rounded-lg text-sm font-medium hover:bg-muted text-foreground transition-colors">
              <Filter className="w-4 h-4 text-muted-foreground" />
              Filters
            </button>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="flex-1 sm:flex-none border border-border bg-background rounded-lg text-sm font-medium px-4 py-2 hover:bg-muted text-foreground transition-colors outline-none cursor-pointer"
            >
              <option>Newest First</option>
              <option>Price: High to Low</option>
              <option>Price: Low to High</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-sm text-left">
            <thead className="bg-secondary/40 text-xs uppercase font-semibold text-muted-foreground">
              <tr>
                <th className="py-4 px-6 border-b border-border w-10">
                  <input type="checkbox" className="rounded border-border text-primary focus:ring-primary/50" />
                </th>
                <th className="py-4 px-6 border-b border-border">Product Name</th>
                <th className="py-4 px-6 border-b border-border">Seller</th>
                <th className="py-4 px-6 border-b border-border">Category</th>
                <th className="py-4 px-6 border-b border-border text-right">Price</th>
                <th className="py-4 px-6 border-b border-border text-center">Stock</th>
                <th className="py-4 px-6 border-b border-border text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-20 text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
                    <p className="text-muted-foreground font-medium">Loading products...</p>
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-20 text-center">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="w-6 h-6 text-muted-foreground/50" />
                    </div>
                    <p className="text-foreground font-semibold mb-1">No products found</p>
                    <p className="text-muted-foreground text-sm">We couldn't find anything matching your search.</p>
                  </td>
                </tr>
              ) : filteredProducts.map(product => {
                const price = product.discountedPrice || product.sellingPrice || product.price || 0;
                const finalPrice = typeof price === 'number' ? price : parseFloat(price);
                
                return (
                <tr key={product.id} className="hover:bg-muted/5 transition-colors group">
                  <td className="py-4 px-6 w-10">
                    <input type="checkbox" className="rounded border-border text-primary focus:ring-primary/50" />
                  </td>
                  <td className="py-4 px-6 min-w-[250px]">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg border border-border bg-white flex items-center justify-center overflow-hidden shrink-0">
                        <img 
                          src={product.images?.[0] || 'https://via.placeholder.com/150'} 
                          alt="" 
                          className="w-full h-full object-contain" 
                        />
                      </div>
                      <div>
                        <Link to={`/admin/products/edit/${product.id}`} className="font-semibold text-foreground hover:text-primary transition-colors line-clamp-1 block">
                          {product.title || product.name}
                        </Link>
                        <span className="text-xs text-muted-foreground mt-0.5 block truncate max-w-[200px]">ID: {product.id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-secondary/50 text-xs font-medium text-foreground border border-border/50">
                      {product.seller?.name || 'SastaBazaar'}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-muted-foreground font-medium">
                    {typeof product.category === 'object' 
                      ? (product.category?.name || 'Uncategorized') 
                      : (product.category || 'Uncategorized')}
                  </td>
                  <td className="py-4 px-6 text-right">
                     <span className="font-display font-semibold text-foreground text-[15px]">
                       ₹{finalPrice.toLocaleString('en-IN')}
                     </span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-secondary/50 text-foreground">
                      {product.quantity ?? product.stock ?? 0}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link 
                        to={`/admin/products/edit/${product.id}`} 
                        className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                        title="Edit Product"
                      >
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <button 
                        onClick={() => handleDelete(product.id)} 
                        className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                        title="Delete Product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors lg:hidden">
                         <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                    {/* Mobile menu icon (visible when not hovered on touch devices) */}
                    <div className="flex justify-end lg:hidden group-hover:hidden">
                       <button className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
                         <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              )})}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Footer */}
        {!isLoading && products.length > 0 && (
          <div className="p-4 border-t border-border bg-card flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
             <div>Showing <span className="font-medium text-foreground">{products.length}</span> of <span className="font-medium text-foreground">{totalItems}</span> products</div>
             <div className="flex items-center gap-2">
               <button 
                 onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                 disabled={currentPage === 0}
                 className="px-3 py-1.5 border border-border rounded-md hover:bg-secondary hover:text-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
               >
                 Previous
               </button>
               
               <div className="flex items-center gap-1">
                 {[...Array(totalPages)].map((_, i) => (
                   <button
                     key={i}
                     onClick={() => setCurrentPage(i)}
                     className={`px-3 py-1.5 border rounded-md transition-colors ${
                       currentPage === i 
                         ? 'border-primary bg-primary text-primary-foreground' 
                         : 'border-border hover:bg-secondary hover:text-foreground'
                     }`}
                   >
                     {i + 1}
                   </button>
                 )).slice(Math.max(0, currentPage - 2), Math.min(totalPages, currentPage + 3))}
               </div>

               <button 
                 onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                 disabled={currentPage === totalPages - 1}
                 className="px-3 py-1.5 border border-border rounded-md hover:bg-secondary hover:text-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
               >
                 Next
               </button>
             </div>
          </div>
        )}
      </div>
    </div>
  </AdminLayout>
  );
};

export default AdminProducts;
