import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ProductCard } from '@/components/ProductCard';
import { categories } from '@/data/mockData';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, Loader2, ChevronRight } from 'lucide-react';
import { productService } from '@/services/productService';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

const Products = () => {
  const [searchParams] = useSearchParams();
  const urlSearch = searchParams.get('search') || '';
  const urlCategory = searchParams.get('category') || '';

  const [search, setSearch] = useState(urlSearch);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(urlCategory || null);
  const [sortBy, setSortBy] = useState('featured');
  // const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);

  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const filters: any = {};
        if (selectedCategory) filters.category = selectedCategory;

        let data: any[] = [];
        if (search) {
          data = await productService.searchProduct(search);
          setProducts(data);
        } else {
          const response = await productService.getAllProducts(filters);
          // Stronger unwrapping for Page<Product> or List<Product>
          const resolvedData = response?.content || response?.data?.content || response?.data || response || [];
          if (Array.isArray(resolvedData)) {
            setProducts(resolvedData);
          } else if (resolvedData && typeof resolvedData === 'object' && Array.isArray(resolvedData.content)) {
            setProducts(resolvedData.content);
          }
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch products');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [search, selectedCategory]);

  // Sync from URL params when they change (e.g. Navbar search)
  useEffect(() => {
    if (urlSearch) setSearch(urlSearch);
    if (urlCategory) setSelectedCategory(urlCategory);
  }, [urlSearch, urlCategory]);

  let filtered = [...products];

  if (sortBy === 'price-low') filtered.sort((a, b) => (a.sellingPrice || a.price || 0) - (b.sellingPrice || b.price || 0));
  else if (sortBy === 'price-high') filtered.sort((a, b) => (b.sellingPrice || b.price || 0) - (a.sellingPrice || a.price || 0));
  else if (sortBy === 'rating') filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));

  const brands = ['Apple', 'Samsung', 'Sony', 'Nike', 'Adidas', 'Puma']; // Mock brands for UI purpose

  return (
    <div className="min-h-screen bg-secondary/10 flex flex-col pt-16 md:pt-20">
      <Navbar />

      {/* Breadcrumb Area */}
      <div className="bg-background border-b border-border py-3">
        <div className="container mx-auto px-4 flex items-center text-sm text-muted-foreground">
          <span>Home</span>
          <ChevronRight className="w-4 h-4 mx-1" />
          <span className="text-foreground font-medium">All Products</span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Left Sidebar Filters */}
          <aside className="w-full lg:w-1/4 xl:w-1/5 shrink-0 hidden md:block">
            <div className="bg-card rounded-xl border border-border p-5 sticky top-24 shadow-sm">
              <h2 className="font-display font-bold text-lg mb-6 flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5" /> Filters
              </h2>

              {/* Categories */}
              <div className="mb-8">
                <h3 className="font-semibold text-sm mb-4 uppercase tracking-wider text-muted-foreground">Category</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="cat-all"
                      checked={selectedCategory === null}
                      onCheckedChange={() => setSelectedCategory(null)}
                    />
                    <Label htmlFor="cat-all" className="cursor-pointer text-sm font-medium leading-none">
                      All Categories
                    </Label>
                  </div>
                  {categories.map((cat) => (
                    <div key={cat.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`cat-${cat.id}`}
                        checked={selectedCategory === cat.name}
                        onCheckedChange={() => setSelectedCategory(cat.name)}
                      />
                      <Label htmlFor={`cat-${cat.id}`} className="cursor-pointer text-sm font-medium leading-none flex justify-between w-full">
                        <span>{cat.name}</span>
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Brands (UI Demo) */}
              <div className="mb-8 border-t border-border pt-6">
                <h3 className="font-semibold text-sm mb-4 uppercase tracking-wider text-muted-foreground">Brands</h3>
                <div className="space-y-3">
                  {brands.map((brand, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <Checkbox id={`brand-${idx}`} />
                      <Label htmlFor={`brand-${idx}`} className="cursor-pointer text-sm font-medium leading-none">
                        {brand}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ratings (UI Demo) */}
              <div className="border-t border-border pt-6">
                <h3 className="font-semibold text-sm mb-4 uppercase tracking-wider text-muted-foreground">Customer Rating</h3>
                <div className="space-y-3">
                  {[4, 3, 2, 1].map((rating) => (
                    <div key={rating} className="flex items-center space-x-2">
                      <Checkbox id={`rating-${rating}`} />
                      <Label htmlFor={`rating-${rating}`} className="cursor-pointer text-sm font-medium leading-none flex items-center gap-1 text-warning">
                        {'★'.repeat(rating)}{'☆'.repeat(5 - rating)} <span className="text-muted-foreground text-xs ml-1">& up</span>
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </aside>

          {/* Main Product Grid Area */}
          <div className="flex-1">
            <div className="bg-card p-4 rounded-xl border border-border shadow-sm mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <h1 className="font-display text-2xl font-bold text-foreground">
                {selectedCategory ? `${selectedCategory} Products` : 'All Products'}
                <span className="text-sm font-normal text-muted-foreground ml-3">({filtered.length} items)</span>
              </h1>

              <div className="flex items-center gap-4 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary text-sm"
                  />
                </div>
                <div className="shrink-0">
                  <select
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value)}
                    className="text-sm border border-input rounded-lg px-3 py-2 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-secondary cursor-pointer"
                  >
                    <option value="featured">Featured</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Top Rated</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Mobile Filters Toggle (shown only on small screens) */}
            <div className="md:hidden flex overflow-x-auto pb-4 gap-2 mb-4 hide-scrollbar cursor-grab">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap border transition-colors shadow-sm ${!selectedCategory ? 'bg-primary text-primary-foreground border-primary' : 'bg-background border-border text-foreground hover:bg-muted'
                  }`}
              >
                All
              </button>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap border transition-colors shadow-sm flex items-center gap-1 ${selectedCategory === cat.name ? 'bg-primary text-primary-foreground border-primary' : 'bg-background border-border text-foreground hover:bg-muted'
                    }`}
                >
                  {cat.icon} {cat.name}
                </button>
              ))}
            </div>

            {isLoading ? (
              <div className="flex flex-col justify-center items-center py-32 space-y-4">
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
                <p className="text-muted-foreground animate-pulse font-medium">Loading products...</p>
              </div>
            ) : error ? (
              <div className="text-center py-32 bg-card rounded-xl border border-destructive/20 text-destructive shadow-sm">
                <p className="text-xl font-bold mb-2">Oops!</p>
                <p>{error}</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
                  {filtered.map((product, i) => (
                    <ProductCard key={product.id || i} product={product} index={i} />
                  ))}
                </div>
                {filtered.length === 0 && (
                  <div className="text-center py-32 bg-card rounded-xl border border-border shadow-sm flex flex-col items-center">
                    <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-4">
                      <Search className="w-10 h-10 text-muted-foreground opacity-50" />
                    </div>
                    <p className="text-foreground font-display font-medium text-xl">No products matched your criteria.</p>
                    <p className="text-muted-foreground mt-2">Try adjusting your filters or search terms.</p>
                    <button
                      onClick={() => { setSearch(''); setSelectedCategory(null); }}
                      className="mt-6 text-primary font-medium hover:underline flex items-center gap-1"
                    >
                      Clear all filters <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Products;
