import { AdminLayout } from '@/components/AdminLayout';
import { adminUsers } from '@/data/mockData';
import { CheckCircle2, XCircle, Clock, Search, Filter, MoreHorizontal, Download, Plus } from 'lucide-react';
import { useState } from 'react';

const AdminSellers = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const allSellers = adminUsers.filter(u => u.role === 'seller');
  
  const filtered = allSellers.filter(s =>
    (s.name.toLowerCase().includes(search.toLowerCase()) || 
     s.email.toLowerCase().includes(search.toLowerCase())) &&
    (!statusFilter || s.status === statusFilter)
  );

  return (
    <AdminLayout>
      <div className="space-y-8">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground tracking-tight">Seller Management</h1>
            <p className="text-muted-foreground mt-1 text-sm">Review, approve, and manage seller accounts on your platform.</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="inline-flex items-center justify-center gap-2 bg-secondary text-secondary-foreground px-4 py-2 rounded-xl font-semibold hover:bg-secondary/80 transition-all shadow-sm focus:ring-2 focus:ring-primary/50 outline-none">
              <Download className="w-4 h-4" /> Export Data
            </button>
            <button className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl font-semibold hover:bg-primary/90 transition-all shadow-md hover:shadow-lg focus:ring-2 focus:ring-primary/50 outline-none">
              <Plus className="w-4 h-4" /> Invite Seller
            </button>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-card rounded-2xl border border-border p-6 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="w-14 h-14 rounded-full bg-success/10 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-7 h-7 text-success" />
            </div>
            <div>
              <p className="font-display text-2xl font-bold text-foreground">{allSellers.filter(s => s.status === 'active').length}</p>
              <p className="text-sm text-muted-foreground font-medium">Active Sellers</p>
            </div>
          </div>
          <div className="bg-card rounded-2xl border border-border p-6 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
             <div className="w-14 h-14 rounded-full bg-warning/10 flex items-center justify-center shrink-0">
              <Clock className="w-7 h-7 text-warning" />
            </div>
            <div>
              <p className="font-display text-2xl font-bold text-foreground">{allSellers.filter(s => s.status === 'pending').length}</p>
              <p className="text-sm text-muted-foreground font-medium">Pending Approval</p>
            </div>
          </div>
          <div className="bg-card rounded-2xl border border-border p-6 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
             <div className="w-14 h-14 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
              <XCircle className="w-7 h-7 text-destructive" />
            </div>
            <div>
              <p className="font-display text-2xl font-bold text-foreground">{allSellers.filter(s => s.status === 'suspended').length}</p>
              <p className="text-sm text-muted-foreground font-medium">Suspended</p>
            </div>
          </div>
        </div>

        {/* Data Table Container */}
        <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden flex flex-col">
          
          {/* Table Toolbar */}
          <div className="p-4 md:p-6 border-b border-border flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center bg-muted/10">
            <div className="relative w-full lg:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Search sellers by name or email..." 
                value={search} 
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all placeholder:text-muted-foreground"
              />
            </div>
            
            <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
              <div className="flex items-center p-1 bg-secondary/50 rounded-lg border border-border">
                {[
                  { value: null, label: 'All' },
                  { value: 'active', label: 'Active' },
                  { value: 'pending', label: 'Pending' },
                  { value: 'suspended', label: 'Suspended' }
                ].map(status => (
                  <button 
                    key={status.value ?? 'all'} 
                    onClick={() => setStatusFilter(status.value)}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                      statusFilter === status.value 
                        ? 'bg-background text-foreground shadow-sm' 
                        : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                    }`}
                  >
                    {status.label}
                  </button>
                ))}
              </div>
              <button className="flex items-center justify-center gap-2 px-3 py-2 border border-border bg-background rounded-lg text-sm font-medium hover:bg-muted text-foreground transition-colors hidden sm:flex">
                <Filter className="w-4 h-4 text-muted-foreground" />
                More Filters
              </button>
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
                  <th className="py-4 px-6 border-b border-border">Seller Details</th>
                  <th className="py-4 px-6 border-b border-border">Email</th>
                  <th className="py-4 px-6 border-b border-border">Status</th>
                  <th className="py-4 px-6 border-b border-border">Joined Date</th>
                  <th className="py-4 px-6 border-b border-border text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.length === 0 ? (
                   <tr>
                    <td colSpan={6} className="py-20 text-center">
                      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search className="w-6 h-6 text-muted-foreground/50" />
                      </div>
                      <p className="text-foreground font-semibold mb-1">No sellers found</p>
                      <p className="text-muted-foreground text-sm">We couldn't find anyone matching your current filters.</p>
                      {(search || statusFilter) && (
                        <button 
                          onClick={() => { setSearch(''); setStatusFilter(null); }}
                          className="mt-4 text-primary text-sm font-semibold hover:underline"
                        >
                          Clear all filters
                        </button>
                      )}
                    </td>
                  </tr>
                ) : filtered.map(seller => (
                  <tr key={seller.id} className="hover:bg-muted/5 transition-colors group cursor-pointer">
                    <td className="py-4 px-6 w-10">
                      <input type="checkbox" className="rounded border-border text-primary focus:ring-primary/50" />
                    </td>
                    <td className="py-4 px-6 min-w-[250px]">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-xl shrink-0 overflow-hidden">
                           {seller.avatar ? (
                             typeof seller.avatar === 'string' && seller.avatar.startsWith('http') 
                               ? <img src={seller.avatar} alt={seller.name} className="w-full h-full object-cover" />
                               : <span>{seller.avatar}</span>
                           ) : (
                             <span className="text-primary font-bold text-sm">{seller.name.charAt(0)}</span>
                           )}
                        </div>
                        <div>
                           <span className="font-semibold text-foreground block group-hover:text-primary transition-colors">{seller.name}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-muted-foreground">{seller.email}</td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border capitalize ${
                        seller.status === 'active' ? 'bg-success/10 text-success border-success/20' :
                        seller.status === 'pending' ? 'bg-warning/10 text-warning border-warning/20' :
                        'bg-destructive/10 text-destructive border-destructive/20'
                      }`}>
                         <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                          seller.status === 'active' ? 'bg-success' : 
                          seller.status === 'pending' ? 'bg-warning' : 'bg-destructive'
                        }`}></span>
                        {seller.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-muted-foreground font-medium">
                      {new Date(seller.joinedDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="py-4 px-6 text-right">
                      {seller.status === 'pending' ? (
                        <div className="flex items-center justify-end gap-2">
                          <button className="px-3 py-1.5 rounded-md text-xs font-semibold bg-success/10 text-success hover:bg-success hover:text-success-foreground transition-colors border border-transparent">
                            Approve
                          </button>
                          <button className="px-3 py-1.5 rounded-md text-xs font-semibold bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors border border-transparent">
                            Reject
                          </button>
                        </div>
                      ) : seller.status === 'active' ? (
                        <div className="flex items-center justify-end gap-2">
                           <button className="px-3 py-1.5 rounded-md text-xs font-semibold border border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors">
                            Suspend
                          </button>
                          <button className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors" title="More Options">
                             <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                         <div className="flex items-center justify-end gap-2">
                           <button className="px-3 py-1.5 rounded-md text-xs font-semibold border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors">
                            Reactivate
                          </button>
                           <button className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors" title="More Options">
                             <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination Footer */}
          {filtered.length > 0 && (
            <div className="p-4 border-t border-border bg-card flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
               <div>Showing <span className="font-medium text-foreground">{filtered.length}</span> sellers</div>
               <div className="flex items-center gap-2">
                 <button className="px-3 py-1.5 border border-border rounded-md hover:bg-secondary hover:text-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled>Previous</button>
                 <button className="px-3 py-1.5 border border-primary bg-primary text-primary-foreground rounded-md transition-colors">1</button>
                 <button className="px-3 py-1.5 border border-border rounded-md hover:bg-secondary hover:text-foreground transition-colors">2</button>
                 <button className="px-3 py-1.5 border border-border rounded-md hover:bg-secondary hover:text-foreground transition-colors">Next</button>
               </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSellers;
