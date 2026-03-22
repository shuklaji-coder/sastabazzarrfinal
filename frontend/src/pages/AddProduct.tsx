import { useState } from 'react';
import { productService } from '@/services/productService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

// Categories that require size selection
const SIZABLE_CATEGORIES = ['clothing', 'fashion', 'footwear', 'apparel', 'shoes', 'men', 'women', 'kids', 'tshirt', 't-shirt', 'jeans', 'kurta', 'dress', 'shirt', 'jacket', 'sari', 'saree'];
const ALL_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
const SHOE_SIZES = ['6', '7', '8', '9', '10', '11', '12'];

const isSizableCategory = (cat1: string, cat2: string, cat3: string): boolean => {
  const combined = `${cat1} ${cat2} ${cat3}`.toLowerCase();
  return SIZABLE_CATEGORIES.some(c => combined.includes(c));
};

const AddProduct = () => {
  const [product, setProduct] = useState({
    title: '',
    description: '',
    sellingPrice: 0,
    mrpPrice: 0,
    discountPercent: 0,
    color: '',
    sizes: '',
    images: [''],
    category: null as any,
    category2: null as any,
    category3: null as any
  });

  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);

  const toggleSize = (size: string) => {
    setSelectedSizes(prev =>
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  const cat1Str = product.category?.categoryId || '';
  const cat2Str = product.category2?.categoryId || '';
  const cat3Str = product.category3?.categoryId || '';
  const showSizes = isSizableCategory(cat1Str, cat2Str, cat3Str);
  const isFootwear = `${cat1Str} ${cat2Str} ${cat3Str}`.toLowerCase().includes('shoe') || `${cat1Str} ${cat2Str} ${cat3Str}`.toLowerCase().includes('footwear');
  const sizeOptions = isFootwear ? SHOE_SIZES : ALL_SIZES;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      const finalProduct = {
        ...product,
        sizes: showSizes ? selectedSizes.join(',') : ''
      };
      await productService.createProduct(finalProduct);
      setMessage('Product added successfully!');
      setProduct({
        title: '',
        description: '',
        sellingPrice: 0,
        mrpPrice: 0,
        discountPercent: 0,
        color: '',
        sizes: '',
        images: [''],
        category: null,
        category2: null,
        category3: null
      });
      setSelectedSizes([]);
    } catch (error: any) {
      setMessage('Error adding product: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageAdd = () => {
    setProduct(prev => ({
      ...prev,
      images: [...prev.images, '']
    }));
  };

  const handleImageRemove = (index: number) => {
    setProduct(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Add New Product</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {message && (
                <div className="p-4 rounded-md bg-green-50 text-green-800 border border-green-200">
                  {message}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title">Product Title</Label>
                  <Input
                    id="title"
                    type="text"
                    value={product.title}
                    onChange={(e) => setProduct(prev => ({ ...prev, title: e.target.value }))}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <textarea
                    id="description"
                    className="w-full p-2 border rounded-md"
                    rows={4}
                    value={product.description}
                    onChange={(e) => setProduct(prev => ({ ...prev, description: e.target.value }))}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="sellingPrice">Selling Price</Label>
                    <Input
                      id="sellingPrice"
                      type="number"
                      value={product.sellingPrice}
                      onChange={(e) => setProduct(prev => ({ ...prev, sellingPrice: parseInt(e.target.value) }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="mrpPrice">MRP Price</Label>
                    <Input
                      id="mrpPrice"
                      type="number"
                      value={product.mrpPrice}
                      onChange={(e) => setProduct(prev => ({ ...prev, mrpPrice: parseInt(e.target.value) }))}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="discountPercent">Discount %</Label>
                  <Input
                    id="discountPercent"
                    type="number"
                    value={product.discountPercent}
                    onChange={(e) => setProduct(prev => ({ ...prev, discountPercent: parseInt(e.target.value) }))}
                  />
                </div>

                <div>
                  <Label htmlFor="color">Color</Label>
                  <Input
                    id="color"
                    type="text"
                    value={product.color}
                    onChange={(e) => setProduct(prev => ({ ...prev, color: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="category">Category (Level 1)</Label>
                  <Input
                    id="category"
                    type="text"
                    value={product.category?.toString() || ''}
                    onChange={(e) => setProduct(prev => ({ ...prev, category: { categoryId: e.target.value } as any }))}
                    placeholder="e.g., Electronics"
                  />
                </div>

                <div>
                  <Label htmlFor="category2">Category (Level 2)</Label>
                  <Input
                    id="category2"
                    type="text"
                    value={product.category2?.toString() || ''}
                    onChange={(e) => setProduct(prev => ({ ...prev, category2: { categoryId: e.target.value } as any }))}
                    placeholder="e.g., Mobile"
                  />
                </div>

                <div>
                  <Label htmlFor="category3">Category (Level 3)</Label>
                  <Input
                    id="category3"
                    type="text"
                    value={product.category3?.toString() || ''}
                    onChange={(e) => setProduct(prev => ({ ...prev, category3: { categoryId: e.target.value } as any }))}
                    placeholder="e.g., Smartphone"
                  />
                </div>

                {/* Sizes — only shown for clothing/fashion/footwear categories */}
                {showSizes && (
                  <div>
                    <Label>Available Sizes</Label>
                    <p className="text-xs text-muted-foreground mb-2">Select all sizes available for this product</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {sizeOptions.map(size => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => toggleSize(size)}
                          className={`min-w-[48px] h-10 px-3 rounded-lg border-2 font-bold text-sm uppercase transition-all ${
                            selectedSizes.includes(size)
                              ? 'border-primary bg-primary text-primary-foreground'
                              : 'border-border bg-background hover:border-primary/60'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                    {selectedSizes.length > 0 && (
                      <p className="text-xs text-muted-foreground mt-2">
                        Selected: <span className="font-semibold text-foreground">{selectedSizes.join(', ')}</span>
                      </p>
                    )}
                  </div>
                )}

                <div>
                  <Label>Product Images</Label>
                  <div className="space-y-2">
                    {product.images.map((image, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Input
                          type="text"
                          value={image}
                          onChange={(e) => {
                            const newImages = [...product.images];
                            newImages[index] = e.target.value;
                            setProduct(prev => ({ ...prev, images: newImages }));
                          }}
                          placeholder="Image URL"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleImageRemove(index)}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleImageAdd}
                    >
                      Add Image
                    </Button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full"
                >
                  {isSubmitting ? 'Adding Product...' : 'Add Product'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AddProduct;
