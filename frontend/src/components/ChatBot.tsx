import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, User, Loader2, ShoppingBag, Package, Star, ExternalLink, Sparkles } from 'lucide-react';
import { chatService, ChatProductDTO, OrderStatusDTO } from '../services/chatService';
import { useNavigate } from 'react-router-dom';

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
    <div className="mt-3 p-3 rounded-xl bg-white/5 border border-white/10">
      <div className="flex items-center gap-2 mb-3">
        <Package className="w-4 h-4 text-cyan-400" />
        <span className="text-xs font-semibold text-cyan-400">Order #{orderStatus.orderId}</span>
      </div>

      {isCancelled ? (
        <div className="text-center py-2">
          <span className="text-red-400 text-sm font-bold">❌ Order Cancelled</span>
        </div>
      ) : (
        <div className="flex items-center gap-1 mb-3 px-1">
          {steps.map((step, i) => (
            <React.Fragment key={step}>
              <div className="flex flex-col items-center" style={{ minWidth: '24px' }}>
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold border-2 transition-all duration-500 ${
                    i <= currentIndex
                      ? 'bg-cyan-500 border-cyan-400 text-black scale-110'
                      : 'bg-white/5 border-white/20 text-white/40'
                  }`}
                >
                  {i <= currentIndex ? '✓' : i + 1}
                </div>
                <span className={`text-[7px] mt-1 text-center leading-tight ${i <= currentIndex ? 'text-cyan-300' : 'text-white/30'}`}>
                  {step.charAt(0) + step.slice(1).toLowerCase()}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className={`flex-1 h-0.5 rounded-full mt-[-12px] ${i < currentIndex ? 'bg-cyan-500' : 'bg-white/10'}`} />
              )}
            </React.Fragment>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 gap-2 mt-2 text-[10px]">
        <div className="bg-white/5 rounded-lg p-2">
          <span className="text-white/40">Order Date</span>
          <p className="text-white/90 font-medium">{orderStatus.orderDate}</p>
        </div>
        <div className="bg-white/5 rounded-lg p-2">
          <span className="text-white/40">Est. Delivery</span>
          <p className="text-white/90 font-medium">{orderStatus.deliveryDate}</p>
        </div>
        <div className="bg-white/5 rounded-lg p-2">
          <span className="text-white/40">Items</span>
          <p className="text-white/90 font-medium">{orderStatus.totalItems}</p>
        </div>
        <div className="bg-white/5 rounded-lg p-2">
          <span className="text-white/40">Total</span>
          <p className="text-cyan-400 font-bold">₹{orderStatus.totalAmount?.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

// ─── Product Card Component ──────────────────────────────────────
const ProductCard = ({ product, onView }: { product: ChatProductDTO; onView: (id: number) => void }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    className="flex gap-2.5 p-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-500/30 transition-all duration-300 cursor-pointer group"
    onClick={() => onView(product.id)}
  >
    <div className="w-16 h-16 rounded-lg overflow-hidden bg-white/5 flex-shrink-0">
      {product.image ? (
        <img src={product.image} alt={product.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <ShoppingBag className="w-6 h-6 text-white/20" />
        </div>
      )}
    </div>
    <div className="flex-1 min-w-0">
      <h4 className="text-[11px] font-semibold text-white/90 truncate leading-tight">{product.title}</h4>
      {product.brand && <p className="text-[9px] text-cyan-400/70 mt-0.5">{product.brand}</p>}
      <div className="flex items-center gap-1.5 mt-1.5">
        <span className="text-sm font-bold text-cyan-400">₹{product.sellingPrice?.toLocaleString()}</span>
        {product.mrpPrice > product.sellingPrice && (
          <span className="text-[10px] text-white/30 line-through">₹{product.mrpPrice?.toLocaleString()}</span>
        )}
      </div>
      {product.discountPercent > 0 && (
        <span className="inline-block mt-1 px-1.5 py-0.5 rounded-full bg-green-500/20 text-green-400 text-[9px] font-bold">
          {product.discountPercent}% OFF
        </span>
      )}
    </div>
    <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
      <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
    </div>
  </motion.div>
);

// ─── Quick Action Chips ──────────────────────────────────────────
const QuickActions = ({ actions, onAction }: { actions: string[]; onAction: (action: string) => void }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.3 }}
    className="flex flex-wrap gap-1.5 mt-2"
  >
    {actions.map((action, i) => (
      <motion.button
        key={i}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 + i * 0.08 }}
        onClick={() => onAction(action)}
        className="px-2.5 py-1.5 rounded-full text-[10px] font-medium bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 hover:bg-cyan-500/20 hover:border-cyan-500/40 hover:scale-105 active:scale-95 transition-all duration-200 whitespace-nowrap"
      >
        {action}
      </motion.button>
    ))}
  </motion.div>
);

// ─── Markdown-lite Renderer (for bold text) ──────────────────────
const RenderText = ({ text }: { text: string }) => {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <span>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i} className="text-cyan-300 font-semibold">{part.slice(2, -2)}</strong>;
        }
        return <span key={i}>{part}</span>;
      })}
    </span>
  );
};

// ─── Main ChatBot Component ──────────────────────────────────────
export const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: '',
      sender: 'bot',
      timestamp: new Date(),
      type: 'text',
      quickActions: ['🔥 Trending Products', '📦 Track My Order', '💰 Today\'s Deals', '🚚 Shipping Info', '🔄 Return Policy', '❓ Help']
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Time-aware welcome message
  useEffect(() => {
    const hour = new Date().getHours();
    let greeting = 'Good Evening 🌙';
    if (hour < 12) greeting = 'Good Morning ☀️';
    else if (hour < 17) greeting = 'Good Afternoon 🌤️';

    setMessages(prev => prev.map((msg, i) =>
      i === 0
        ? { ...msg, text: `${greeting} Namaste! 🙏\n\nWelcome to SastaaBazaar! Main aapka AI Shopping Assistant hoon.\n\n🔍 Products search karein\n📦 Order track karein\n💰 Best deals paayein\n\nNeeche ke buttons try karein! 👇` }
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
        text: '😔 Sorry, I am having trouble connecting. Please try again!',
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

  // ─── Render a message bubble ───────────────────────────────────
  const renderMessageContent = (message: Message) => (
    <div className="space-y-2">
      {/* Text content with markdown-lite */}
      {message.text && (
        <div className="text-sm whitespace-pre-line leading-relaxed">
          {message.text.split('\n').map((line, i) => (
            <div key={i}>
              <RenderText text={line} />
            </div>
          ))}
        </div>
      )}

      {/* Product cards */}
      {message.products && message.products.length > 0 && (
        <div className="space-y-2 mt-2">
          {message.products.map((product) => (
            <ProductCard key={product.id} product={product} onView={handleViewProduct} />
          ))}
        </div>
      )}

      {/* Order status timeline */}
      {message.orderStatus && <OrderTimeline orderStatus={message.orderStatus} />}

      {/* Quick action chips */}
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
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed bottom-24 right-6 w-[360px] sm:w-[400px] h-[560px] max-h-[85vh] bg-[#050618]/95 backdrop-blur-2xl border border-cyan-500/20 rounded-2xl shadow-[0_0_60px_rgba(6,182,212,0.15),0_0_120px_rgba(6,182,212,0.05)] flex flex-col overflow-hidden z-[100]"
          >
            {/* ─── Header ─────────────────────────────────────── */}
            <div className="p-4 border-b border-cyan-500/20 bg-gradient-to-r from-cyan-500/10 via-purple-500/5 to-cyan-500/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                    <Bot className="w-6 h-6 text-white" />
                  </div>
                  <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-[#050618] animate-pulse" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm flex items-center gap-1.5">
                    SastaaBazaar AI
                    <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                  </h3>
                  <span className="text-[10px] text-white/40">Smart Shopping Assistant • Always Online</span>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-full hover:bg-white/10 transition-colors text-white/50 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* ─── Messages Area ──────────────────────────────── */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex gap-2 max-w-[90%] ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    {/* Avatar */}
                    <div className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center ${
                      message.sender === 'user'
                        ? 'bg-gradient-to-br from-purple-500 to-pink-500'
                        : 'bg-gradient-to-br from-cyan-400 to-blue-500'
                    }`}>
                      {message.sender === 'user'
                        ? <User className="w-3.5 h-3.5 text-white" />
                        : <Bot className="w-3.5 h-3.5 text-white" />
                      }
                    </div>

                    {/* Message Bubble */}
                    <div
                      className={`p-3 rounded-2xl ${
                        message.sender === 'user'
                          ? 'bg-gradient-to-br from-cyan-500 to-cyan-600 text-black rounded-tr-sm shadow-[0_2px_15px_rgba(6,182,212,0.3)]'
                          : 'bg-white/[0.04] text-white/90 border border-white/[0.08] rounded-tl-sm'
                      }`}
                    >
                      {message.sender === 'user' ? (
                        <p className="text-sm">{message.text}</p>
                      ) : (
                        renderMessageContent(message)
                      )}
                      <div className={`text-[9px] mt-1.5 ${message.sender === 'user' ? 'text-black/40 text-right' : 'text-white/25'}`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="flex gap-2 max-w-[90%]">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex-shrink-0 flex items-center justify-center">
                      <Bot className="w-3.5 h-3.5 text-white" />
                    </div>
                    <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/[0.08] rounded-tl-sm flex items-center gap-2">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                      <span className="text-[10px] text-white/30 ml-1">Thinking...</span>
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* ─── Input Area ─────────────────────────────────── */}
            <div className="p-3 border-t border-white/[0.08] bg-black/30">
              <form onSubmit={handleSendMessage} className="relative flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ask anything... (e.g., shoes under 2000)"
                  className="w-full bg-white/[0.05] border border-white/[0.08] rounded-2xl py-3 pl-4 pr-12 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-cyan-500/40 focus:bg-white/[0.07] transition-all duration-300"
                />
                <button
                  type="submit"
                  disabled={!inputMessage.trim() || isLoading}
                  className="absolute right-1.5 p-2.5 bg-gradient-to-r from-cyan-500 to-cyan-400 text-black rounded-xl hover:shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all duration-300 disabled:opacity-30 disabled:hover:shadow-none"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
              <p className="text-[8px] text-white/15 text-center mt-1.5">Powered by SastaaBazaar AI • Smart Shopping Assistant</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Floating Toggle Button ─────────────────────────── */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.4),0_4px_20px_rgba(0,0,0,0.3)] z-[100] group"
          >
            <Bot className="w-7 h-7 text-white group-hover:rotate-12 transition-transform duration-300" />

            {/* Notification Badge */}
            <span className="absolute -top-1 -right-1 flex h-5 w-5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-50" />
              <span className="relative inline-flex items-center justify-center rounded-full h-5 w-5 bg-red-500 text-[8px] font-bold text-white border-2 border-white/20">
                AI
              </span>
            </span>

            {/* Hover tooltip */}
            <span className="absolute right-16 bg-black/90 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap border border-white/10 pointer-events-none">
              Chat with AI Assistant 🤖
            </span>
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatBot;
