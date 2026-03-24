import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, X, Send, Bot, User, Loader2, ShoppingBag, 
  Package, Star, ExternalLink, Sparkles, Mic, MicOff, 
  ShoppingCart, Zap, Headphones, CheckCircle2, Search
} from 'lucide-react';
import { chatService, ChatProductDTO, OrderStatusDTO } from '../services/chatService';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { toast } from '@/components/ui/sonner';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'text' | 'products' | 'order_status' | 'faq';
  products?: ChatProductDTO[];
  quickActions?: string[];
  orderStatus?: OrderStatusDTO;
}

// ─── Order Status Timeline Component ─────────────────────────────
const OrderTimeline = ({ orderStatus }: { orderStatus: OrderStatusDTO }) => {
  const steps = ['PENDING', 'PLACED', 'CONFIRMED', 'SHIPPED', 'DELIVERED'];
  const currentIndex = steps.indexOf(orderStatus.status);
  const isCancelled = orderStatus.status === 'CANCELLED';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-3 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-md"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Package className="w-5 h-5 text-cyan-400" />
          <span className="text-sm font-bold text-white">Order Status</span>
        </div>
        <span className="text-[10px] font-mono bg-cyan-500/10 text-cyan-400 px-2 py-0.5 rounded-full border border-cyan-500/20">
          #{orderStatus.orderId}
        </span>
      </div>

      {isCancelled ? (
        <div className="text-center py-4 bg-red-500/5 rounded-xl border border-red-500/20">
          <span className="text-red-400 text-sm font-black flex items-center justify-center gap-2">
            <X className="w-4 h-4" /> ORDER CANCELLED
          </span>
        </div>
      ) : (
        <div className="relative flex items-center justify-between mb-6 px-1">
          {steps.map((step, i) => (
            <React.Fragment key={step}>
              <div className="flex flex-col items-center z-10">
                <motion.div
                  initial={false}
                  animate={{
                    scale: i <= currentIndex ? 1.1 : 1,
                    backgroundColor: i <= currentIndex ? '#06b6d4' : 'rgba(255,255,255,0.05)',
                  }}
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black border-2 transition-all duration-500 ${
                    i <= currentIndex ? 'border-cyan-400 text-black' : 'border-white/10 text-white/30'
                  }`}
                >
                  {i <= currentIndex ? <CheckCircle2 className="w-3.5 h-3.5" /> : i + 1}
                </motion.div>
                <span className={`text-[8px] mt-2 font-bold uppercase tracking-tighter ${i <= currentIndex ? 'text-cyan-400' : 'text-white/20'}`}>
                  {step}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className="flex-1 h-[2px] mx-[-4px] mt-[-18px] bg-white/5 overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: i < currentIndex ? '100%' : '0%' }}
                    className="h-full bg-cyan-500"
                  />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 mt-2">
        {[
          { label: 'Order Date', value: orderStatus.orderDate },
          { label: 'Est. Delivery', value: orderStatus.deliveryDate },
          { label: 'Total Items', value: orderStatus.totalItems },
          { label: 'Amount', value: `₹${orderStatus.totalAmount?.toLocaleString()}`, primary: true }
        ].map((item, idx) => (
          <div key={idx} className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-2.5">
            <span className="text-[9px] uppercase tracking-widest text-white/30 block mb-0.5">{item.label}</span>
            <p className={`text-xs font-bold ${item.primary ? 'text-cyan-400' : 'text-white/80'}`}>{item.value}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

// ─── Pro Product Card Component ──────────────────────────────────────
const ProductCard = ({ product, onView }: { product: ChatProductDTO; onView: (id: number) => void }) => {
  const { addItem } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAdding(true);
    // Simulate slight delay for premium feel
    setTimeout(() => {
      addItem(product as any);
      setIsAdding(false);
      toast.success(`${product.title} added to cart!`, {
        icon: <ShoppingCart className="w-4 h-4 text-primary" />,
        className: "bg-[#050618] border-cyan-500/20 text-white"
      });
    }, 600);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ y: -4 }}
      className="group relative flex flex-col gap-3 p-3 rounded-[1.5rem] bg-white/[0.03] border border-white/[0.08] hover:border-cyan-500/40 hover:bg-white/[0.05] transition-all duration-500 cursor-pointer overflow-hidden shadow-2xl"
      onClick={() => onView(product.id)}
    >
      <div className="flex gap-4">
        <div className="w-24 h-24 rounded-2xl overflow-hidden bg-black/40 flex-shrink-0 relative">
          <img 
            src={product.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80"} 
            alt={product.title} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
          />
          {product.discountPercent > 0 && (
            <div className="absolute top-1 left-1 bg-red-500 text-[8px] font-black text-white px-2 py-0.5 rounded-full shadow-lg">
              -{product.discountPercent}%
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
          <div>
            <h4 className="text-sm font-bold text-white truncate group-hover:text-cyan-400 transition-colors">{product.title}</h4>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-lg font-black text-cyan-400">₹{product.sellingPrice?.toLocaleString()}</span>
              {product.mrpPrice > product.sellingPrice && (
                <span className="text-[10px] text-white/30 line-through">₹{product.mrpPrice?.toLocaleString()}</span>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
             <div className="flex gap-0.5">
                {[1,2,3,4,5].map(s => (
                  <Star key={s} className={`w-2.5 h-2.5 ${s <= 4 ? 'text-yellow-400 fill-yellow-400' : 'text-white/10'}`} />
                ))}
             </div>
             <span className="text-[10px] text-white/40 font-bold">4.2 (120+)</span>
          </div>
        </div>
      </div>

      <div className="flex gap-2 mt-1">
        <button
          onClick={handleAddToCart}
          disabled={isAdding}
          className="flex-1 h-9 flex items-center justify-center gap-2 rounded-xl bg-white/5 border border-white/10 text-white text-[10px] font-bold hover:bg-white/10 hover:border-white/20 transition-all active:scale-95 disabled:opacity-50"
        >
          {isAdding ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ShoppingCart className="w-3.5 h-3.5" />}
          ADD TO CART
        </button>
        <button
          className="w-10 h-9 flex items-center justify-center rounded-xl bg-cyan-500 text-black hover:bg-cyan-400 transition-all active:scale-90"
        >
          <Zap className="w-4 h-4 fill-current" />
        </button>
      </div>
    </motion.div>
  );
};

// ─── Quick Action Chips ──────────────────────────────────────────
const QuickActions = ({ actions, onAction }: { actions: string[]; onAction: (action: string) => void }) => (
  <div className="flex flex-wrap gap-2 mt-4">
    {actions.map((action, i) => (
      <motion.button
        key={i}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: i * 0.05 }}
        whileHover={{ scale: 1.05, backgroundColor: 'rgba(6,182,212,0.15)' }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onAction(action)}
        className="px-4 py-2 rounded-2xl text-[11px] font-bold bg-white/[0.03] text-white/70 border border-white/[0.08] hover:text-cyan-400 hover:border-cyan-500/30 transition-all shadow-lg"
      >
        {action}
      </motion.button>
    ))}
  </div>
);

// ─── Markdown-lite Renderer ──────────────────────
const RenderText = ({ text }: { text: string }) => {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <span>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i} className="text-cyan-300 font-bold">{part.slice(2, -2)}</strong>;
        }
        return <span key={i}>{part}</span>;
      })}
    </span>
  );
};

// ─── Main Pro ChatBot Component ──────────────────────────────────────
export const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: '',
      sender: 'bot',
      timestamp: new Date(),
      type: 'text',
      quickActions: ['🔥 Trending Products', '📦 Track My Order', '💰 Today\'s Deals', '🚚 Shipping Info', '❓ Help']
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Voice Recognition Setup
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-IN';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
        setIsListening(false);
        toast.success("Voice input captured!");
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
        toast.error("Voice recognition failed. Try again.");
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
        toast.error("Voice recognition not supported in your browser.");
        return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      setIsListening(true);
      recognitionRef.current.start();
      toast.info("Listening for your command...", { duration: 2000 });
    }
  };

  // Time-aware welcome message
  useEffect(() => {
    const hour = new Date().getHours();
    let greeting = 'Shubh Sandhya! 🌙';
    if (hour < 12) greeting = 'Suprabhat! ☀️';
    else if (hour < 17) greeting = 'Namaste! 🌤️';

    setMessages(prev => prev.map((msg, i) =>
      i === 0
        ? { ...msg, text: `${greeting} Welcome to SastaaBazaar AI Pro!\n\nI am your premium shopping assistant. How can I help you discover something amazing today?\n\n✨ Search premium products\n📦 Track your journey\n💰 Unlock exclusive deals` }
        : msg
    ));
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSendMessage = async (e?: React.FormEvent, overrideMessage?: string) => {
    if (e) e.preventDefault();
    const msgText = overrideMessage || inputMessage.trim();
    if (!msgText) return;

    const newUserMessage: Message = {
      id: Date.now().toString(),
      text: msgText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newUserMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await chatService.sendMessage(msgText);
      const newBotMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.response,
        sender: 'bot',
        timestamp: new Date(),
        type: response.type || 'text',
        products: response.products,
        quickActions: response.quickActions,
        orderStatus: response.orderStatus,
      };
      setMessages(prev => [...prev, newBotMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: '😔 Sorry, I encountered a minor glitch. Let me try that again!',
        sender: 'bot',
        timestamp: new Date(),
        quickActions: ['🔄 Try Again', '❓ Help']
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleQuickAction = (action: string) => {
    handleSendMessage(undefined, action);
  };

  const handleViewProduct = (productId: number) => {
    navigate(`/product/${productId}`);
    setIsOpen(false);
  };

  // ─── Render Message Content ───────────────────────────────────
  const renderMessageContent = (message: Message) => (
    <div className="space-y-4">
      {message.text && (
        <div className="text-[13px] whitespace-pre-line leading-[1.6]">
          {message.text.split('\n').map((line, i) => (
            <div key={i}>
              <RenderText text={line} />
            </div>
          ))}
        </div>
      )}

      {message.products && message.products.length > 0 && (
        <div className="grid grid-cols-1 gap-4 mt-3">
          {message.products.map((product) => (
            <ProductCard key={product.id} product={product} onView={handleViewProduct} />
          ))}
        </div>
      )}

      {message.orderStatus && <OrderTimeline orderStatus={message.orderStatus} />}

      {message.quickActions && message.quickActions.length > 0 && (
        <QuickActions actions={message.quickActions} onAction={handleQuickAction} />
      )}
    </div>
  );

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.95, y: 20, filter: 'blur(10px)' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-24 right-6 w-[380px] sm:w-[440px] h-[640px] max-h-[85vh] bg-[#050618]/95 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5),0_0_80px_rgba(6,182,212,0.1)] flex flex-col overflow-hidden z-[100]"
          >
            {/* ─── Premium Header ─────────────────────────────────────── */}
            <div className="p-6 border-b border-white/5 relative bg-gradient-to-r from-cyan-500/5 via-transparent to-purple-500/5">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-transparent animate-pulse opacity-20" />
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-4">
                  <div className="relative group">
                    <div className="w-14 h-14 rounded-[1.25rem] bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.3)] transform group-hover:rotate-[360deg] transition-transform duration-1000">
                      <Bot className="w-8 h-8 text-white" />
                    </div>
                    <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-green-500 border-4 border-[#050618] shadow-lg" />
                  </div>
                  <div>
                    <h3 className="font-black text-white text-lg flex items-center gap-2 tracking-tighter uppercase">
                      BazaarBot Pro
                      <motion.span 
                        animate={{ rotate: [0, 15, -15, 0] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="text-yellow-400"
                      >
                         <Sparkles className="w-4 h-4" />
                      </motion.span>
                    </h3>
                    <div className="flex items-center gap-2">
                       <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                       <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Active • AI Shopping Agent</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                    <button className="p-2.5 rounded-2xl bg-white/5 text-white/40 hover:text-white hover:bg-white/10 transition-all">
                        <Headphones className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-2.5 rounded-2xl bg-white/5 text-white/40 hover:text-white hover:bg-red-500/20 transition-all"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
              </div>
            </div>

            {/* ─── Messages Area ──────────────────────────────── */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar scroll-smooth">
              {messages.map((message, idx) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex gap-3 max-w-[85%] ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    {/* Avatar */}
                    <motion.div 
                       whileHover={{ scale: 1.1 }}
                       className={`w-9 h-9 rounded-2xl flex-shrink-0 flex items-center justify-center shadow-lg ${
                        message.sender === 'user'
                            ? 'bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400'
                            : 'bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600'
                        }`}
                    >
                      {message.sender === 'user'
                        ? <User className="w-5 h-5 text-white" />
                        : <Bot className="w-5 h-5 text-white" />
                      }
                    </motion.div>

                    {/* Message Bubble */}
                    <div
                      className={`relative p-4 rounded-[1.75rem] shadow-xl ${
                        message.sender === 'user'
                          ? 'bg-gradient-to-br from-cyan-500 to-cyan-600 text-black font-medium rounded-tr-none'
                          : 'bg-white/[0.04] text-white/90 border border-white/[0.08] rounded-tl-none backdrop-blur-xl'
                      }`}
                    >
                      {message.sender === 'user' ? (
                        <p className="text-[13px] leading-relaxed">{message.text}</p>
                      ) : (
                        renderMessageContent(message)
                      )}
                      
                      <div className={`text-[8px] mt-2 font-black uppercase tracking-widest ${message.sender === 'user' ? 'text-black/30 text-right' : 'text-white/20'}`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Pro Typing Indicator */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex justify-start"
                >
                  <div className="flex gap-3 max-w-[90%]">
                    <div className="w-9 h-9 rounded-2xl bg-white/5 flex-shrink-0 flex items-center justify-center border border-white/10">
                        <Loader2 className="w-5 h-5 text-cyan-500 animate-spin" />
                    </div>
                    <div className="p-4 rounded-[1.75rem] bg-white/[0.02] border border-white/[0.05] rounded-tl-none flex items-center gap-3">
                         <div className="flex gap-1.5">
                            {[0,1,2].map(i => (
                                <motion.span 
                                    key={i}
                                    animate={{ height: [4, 12, 4], opacity: [0.3, 1, 0.3] }}
                                    transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
                                    className="w-1 bg-cyan-400 rounded-full"
                                />
                            ))}
                         </div>
                         <span className="text-[11px] font-black text-cyan-400 tracking-widest uppercase italic">Synthesizing Response...</span>
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* ─── Pro Input Area ─────────────────────────────────── */}
            <div className="p-6 border-t border-white/5 bg-black/40 relative group">
              <div className="absolute inset-0 bg-cyan-500/5 opacity-0 group-focus-within:opacity-100 transition-opacity" />
              
              <form onSubmit={handleSendMessage} className="relative flex flex-col gap-3">
                <div className="relative">
                    <input
                        ref={inputRef}
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        placeholder="Type a message or use voice command..."
                        className="w-full bg-white/[0.04] border border-white/10 rounded-[1.5rem] py-4 pl-12 pr-28 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-cyan-500/50 focus:bg-white/[0.07] transition-all duration-500 shadow-inner"
                    />
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-cyan-400 transition-colors" />
                    
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                        <motion.button
                            type="button"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={toggleListening}
                            className={`p-2.5 rounded-xl transition-all ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-white/5 text-white/40 hover:text-cyan-400'}`}
                        >
                            {isListening ? <Mic className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                        </motion.button>
                        
                        <motion.button
                            type="submit"
                            disabled={!inputMessage.trim() || isLoading}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-2.5 bg-gradient-to-r from-cyan-500 to-cyan-400 text-black rounded-xl hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all duration-300 disabled:opacity-30"
                        >
                            <Send className="w-4 h-4" />
                        </motion.button>
                    </div>
                </div>
                <div className="flex items-center justify-between px-2">
                    <div className="flex gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500" />
                        <span className="text-[9px] font-bold text-white/20 uppercase tracking-[0.2em]">Neural Engine Balanced</span>
                    </div>
                    <p className="text-[9px] text-white/10 font-black uppercase tracking-tighter">SastaaBazaar AI Pro v2.4.0</p>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Premium Floating Toggle ─────────────────────────── */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 45 }}
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-cyan-500 via-blue-600 to-purple-600 rounded-[1.75rem] flex items-center justify-center shadow-[0_10px_40px_rgba(6,182,212,0.5),0_0_0_4px_rgba(255,255,255,0.05)] z-[100] group overflow-hidden"
          >
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
            <Bot className="w-9 h-9 text-white group-hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] transition-all duration-500" />

            {/* Notification Glow */}
            <span className="absolute inset-0 rounded-[1.75rem] border-2 border-cyan-400/30 animate-pulse" />

            {/* AI Chip Badge */}
            <div className="absolute -top-1 -right-1 bg-red-500 flex items-center justify-center h-6 w-6 rounded-xl border-2 border-[#050618] shadow-lg">
               <span className="text-[10px] font-black text-white italic">AI</span>
            </div>
            
            <div className="absolute -bottom-8 group-hover:bottom-2 left-0 right-0 text-[8px] font-black text-white text-center tracking-widest uppercase transition-all duration-300">
               PRO
            </div>
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatBot;
