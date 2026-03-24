import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useState } from 'react';
import { toast } from 'sonner';
import { Sparkles } from 'lucide-react';

export const Footer = () => {
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubscribing(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success('Wait for the magic!', {
        description: 'You have successfully subscribed to our newsletter.',
        icon: <Sparkles className="w-5 h-5 text-secondary" />,
      });
      setEmail('');
      setIsSubscribing(false);
    }, 1500);
  };

  return (
    <footer className="w-full bg-primary text-primary-foreground pt-12 pb-20 md:pb-0">
      {/* Back to top banner */}
      <button 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="w-full bg-sidebar-accent/20 hover:bg-sidebar-accent/30 text-center py-4 font-medium transition-colors cursor-pointer"
      >
        Back to top
      </button>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Company Info */}
          <div className="space-y-4">
            <Link to="/" className="font-display font-bold text-2xl tracking-tight">
              Sasta<span className="text-secondary">Bazaar</span>
            </Link>
            <p className="text-sm text-primary-foreground/80 leading-relaxed max-w-xs">
              Your one-stop destination for affordable and premium quality products. Shop directly from sellers locally and globally.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <a href="#" className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-secondary hover:text-secondary-foreground transition-all"><Facebook className="w-5 h-5" /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-secondary hover:text-secondary-foreground transition-all"><Twitter className="w-5 h-5" /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-secondary hover:text-secondary-foreground transition-all"><Instagram className="w-5 h-5" /></a>
              <a href="https://www.linkedin.com/in/rohan-shukla-0b8889321" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-secondary hover:text-secondary-foreground transition-all">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-linkedin"
                >
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect width="4" height="12" x="2" y="9" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-bold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li><Link to="/products" className="hover:text-secondary transition-colors inline-block py-1">All Products</Link></li>
              <li><Link to="/login" className="hover:text-secondary transition-colors inline-block py-1">My Account</Link></li>
              <li><Link to="/orders" className="hover:text-secondary transition-colors inline-block py-1">Track Order</Link></li>
              <li><Link to="/seller" className="hover:text-secondary transition-colors inline-block py-1">Become a Seller</Link></li>
              <li><a href="#" className="hover:text-secondary transition-colors inline-block py-1">Returns & Exchanges</a></li>
            </ul>
          </div>

          {/* Contact Us */}
          <div className="space-y-4">
            <h4 className="font-bold text-lg mb-4">Contact Us</h4>
            <ul className="space-y-4 text-sm text-primary-foreground/80">
              <li className="flex gap-3">
                <MapPin className="w-5 h-5 text-secondary flex-shrink-0" />
                <span>123 Commerce Avenue, Building 4<br/>Tech Park, Mumbai, India</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-secondary flex-shrink-0" />
                <span>+91 95808 49709</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-secondary flex-shrink-0" />
                <span>support@sastaabazaar.in</span>
              </li>
              <li className="pt-2 text-xs font-semibold text-secondary uppercase tracking-widest">
                Feel free to connect with us
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h4 className="font-bold text-lg mb-4">Newsletter</h4>
            <p className="text-sm text-primary-foreground/80 mb-4">
              Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
              <Input 
                required
                type="email" 
                placeholder="Enter your email address" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 focus-visible:ring-secondary"
              />
              <Button 
                type="submit"
                disabled={isSubscribing}
                className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90"
              >
                {isSubscribing ? 'Subscribing...' : 'Subscribe'}
              </Button>
            </form>
          </div>

        </div>
      </div>

      <div className="border-t border-primary-foreground/10 bg-primary/95 text-center py-6">
        <p className="text-sm text-primary-foreground/60 leading-relaxed">
          &copy; {new Date().getFullYear()} SastaaBazaar. All rights reserved. | Developed with 💖 by <a href="https://www.linkedin.com/in/rohan-shukla-0b8889321" target="_blank" rel="noopener noreferrer" className="font-black text-secondary hover:underline">Mr. Rohan Shukla</a>
        </p>
      </div>
    </footer>
  );
};
