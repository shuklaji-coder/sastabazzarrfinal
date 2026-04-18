import { motion } from 'framer-motion';
import { Download, FileText, CheckCircle2, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { generateInvoicePDF, InvoiceData } from '@/lib/invoiceGenerator';

interface InvoiceDownloadCardProps {
  invoiceData: InvoiceData;
  compact?: boolean;
}

const InvoiceDownloadCard = ({ invoiceData, compact = false }: InvoiceDownloadCardProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasDownloaded, setHasDownloaded] = useState(false);

  const handleDownload = () => {
    setIsGenerating(true);
    // Small delay for UX feedback
    setTimeout(() => {
      generateInvoicePDF(invoiceData);
      setIsGenerating(false);
      setHasDownloaded(true);
      // Reset after a few seconds
      setTimeout(() => setHasDownloaded(false), 4000);
    }, 600);
  };

  if (compact) {
    return (
      <button
        onClick={handleDownload}
        disabled={isGenerating}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-primary/30 bg-primary/5 hover:bg-primary/10 text-primary font-bold text-sm transition-all active:scale-[0.98] disabled:opacity-60"
      >
        {isGenerating ? (
          <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</>
        ) : hasDownloaded ? (
          <><CheckCircle2 className="w-4 h-4 text-success" /> Invoice Opened!</>
        ) : (
          <><Download className="w-4 h-4" /> Download Invoice</>
        )}
      </button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.65 }}
      className="bg-card rounded-2xl border border-border shadow-premium overflow-hidden"
    >
      {/* Card Header */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent px-6 py-5 border-b border-border flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <FileText className="w-5 h-5 text-primary" />
        </div>
        <div>
          <p className="font-bold text-foreground">Invoice &amp; Receipt</p>
          <p className="text-xs text-muted-foreground">Order #{invoiceData.orderId}</p>
        </div>
        <div className="ml-auto">
          <span className="text-[10px] font-bold uppercase tracking-widest bg-success/10 text-success px-3 py-1 rounded-full border border-success/20">
            Ready to Download
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="px-6 py-6 flex flex-col sm:flex-row items-center gap-6">
        {/* Invoice Preview Icon */}
        <div className="w-24 h-32 bg-gradient-to-b from-muted/50 to-muted/20 rounded-xl border border-border flex flex-col items-center justify-center gap-2 shrink-0 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-6 bg-foreground/10" />
          <FileText className="w-8 h-8 text-primary mt-4" />
          <div className="space-y-1 w-full px-3 mt-1">
            <div className="h-1 bg-muted-foreground/20 rounded-full" />
            <div className="h-1 bg-muted-foreground/20 rounded-full w-3/4" />
            <div className="h-1 bg-muted-foreground/20 rounded-full" />
            <div className="h-1 bg-muted-foreground/20 rounded-full w-1/2" />
          </div>
          <p className="text-[8px] font-bold text-primary uppercase tracking-widest mt-1">PDF</p>
        </div>

        {/* Info + Action */}
        <div className="flex-1 space-y-3 text-center sm:text-left">
          <div>
            <h3 className="font-display font-bold text-lg text-foreground">Tax Invoice</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Aapka official invoice ready hai! Isse download karein ya print karein.
            </p>
          </div>

          {/* Details */}
          <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-muted-foreground">
            <span>📦 {invoiceData.items.length} item{invoiceData.items.length > 1 ? 's' : ''}</span>
            <span>💰 ₹{invoiceData.grandTotal.toLocaleString('en-IN')}</span>
            <span>🗓 {new Date(invoiceData.orderDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
          </div>

          {/* Download Button */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleDownload}
            disabled={isGenerating}
            className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:bg-primary/90 transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating Invoice...
              </>
            ) : hasDownloaded ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Invoice Window Opened ✓
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Download Invoice (PDF)
              </>
            )}
          </motion.button>

          <p className="text-[10px] text-muted-foreground">
            Opens in new tab → Use browser's Save as PDF option to download
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default InvoiceDownloadCard;
