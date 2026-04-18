import { SellerLayout } from '@/components/SellerLayout';
import { products } from '@/data/mockData';
import { AlertTriangle } from 'lucide-react';

const SellerInventory = () => {
  const allProducts = products;

  return (
    <SellerLayout>
      <div className="p-6 md:p-8 space-y-6">
        <h1 className="font-display text-2xl font-bold text-foreground">Inventory</h1>


        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Product</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">SKU</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Stock</th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">Action</th>
                </tr>
              </thead>
              <tbody>
                {allProducts.map(product => (
                  <tr key={product.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img src={product.images[0]} alt="" className="w-10 h-10 rounded-lg object-cover" />
                        <span className="font-medium text-foreground line-clamp-1">{product.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground font-mono text-xs">{String(product.id).toUpperCase()}</td>
                    <td className="py-3 px-4 font-display font-semibold text-foreground">{product.quantity ?? product.stock}</td>
                    <td className="py-3 px-4 font-display font-semibold text-foreground">{product.quantity ?? product.stock}</td>
                    <td className="py-3 px-4 text-right">
                      <button className="px-3 py-1.5 rounded-lg text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                        Restock
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </SellerLayout>
  );
};

export default SellerInventory;
