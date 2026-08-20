import React, { useState } from 'react';
import { 
  HelpCircle, 
  Search, 
  MessageSquare, 
  Mail, 
  Phone, 
  ChevronDown, 
  Send,  
  CheckCircle2, 
  X,
  FileText,
  ExternalLink,
  MessageCircle
} from 'lucide-react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'Orders' | 'Payments' | 'Shipping' | 'System';
}

const faqs: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'Payments',
    question: 'How do customers confirm CIH Bank transfer payments?',
    answer: 'Customers can send their CIH Bank transfer receipt directly via the automated WhatsApp link provided on order checkout, or upload it through the order confirmation drawer.',
  },
  {
    id: 'faq-2',
    category: 'Shipping',
    question: 'What are the default delivery lead times across Morocco?',
    answer: 'Major cities (Casablanca, Rabat, Marrakech, Tangier) take 24–48 hours. Regional locations take 2–4 business days via local courier networks.',
  },
  {
    id: 'faq-3',
    category: 'Orders',
    question: 'How do I edit or override a customer’s phone order address?',
    answer: 'Navigate to the Orders tab, expand the order row, and select "Edit Details" or create a manual order replacement directly from the top menu.',
  },
  {
    id: 'faq-4',
    category: 'System',
    question: 'How does the Neon PostgreSQL database auto-scale?',
    answer: 'Your Neon database scales compute resources dynamically based on incoming traffic. Storage scales automatically without manual intervention.',
  },
];

export const SupportView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [openFaqId, setOpenFaqId] = useState<string | null>('faq-1');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Ticket Form Modal State
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketCategory, setTicketCategory] = useState('Technical Issue');
  const [ticketMessage, setTicketMessage] = useState('');
  const [ticketSuccess, setTicketSuccess] = useState(false);

  const categories = ['All', 'Orders', 'Payments', 'Shipping', 'System'];

  const filteredFaqs = faqs.filter((f) => {
    const matchesSearch = 
      f.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'All' || f.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject.trim() || !ticketMessage.trim()) return;

    setTicketSuccess(true);
    setTimeout(() => {
      setTicketSuccess(false);
      setIsTicketModalOpen(false);
      setTicketSubject('');
      setTicketMessage('');
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-700/50 dark:border-white/[0.08] pb-5">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-100 dark:text-white flex items-center gap-2">
            Support & Store Help Desk <HelpCircle className="w-4 h-4 text-[#7c5cfc]" />
          </h2>
          <p className="text-xs text-slate-400 dark:text-slate-400 mt-0.5">
            Documentation, workflow guides, direct operator channels, and system ticketing
          </p>
        </div>

        <button
          onClick={() => setIsTicketModalOpen(true)}
          className="flex items-center gap-2 bg-[#7c5cfc] hover:bg-[#6b4af3] text-white px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-sm"
        >
          <MessageSquare className="w-4 h-4" /> Open Support Ticket
        </button>
      </div>

      {/* Direct Operator Contact Channels */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <a
          href="https://wa.me/212612345678"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#1c202c]/90 dark:bg-[#0e1015]/90 border border-slate-700/50 dark:border-white/[0.08] p-5 rounded-2xl shadow-lg space-y-2 group hover:border-emerald-500/40 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <MessageCircle className="w-5 h-5" />
            </div>
            <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-emerald-400 transition-colors" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm">WhatsApp Priority Line</h3>
            <p className="text-xs text-slate-400 mt-0.5">Direct chat for order receipts & manual verifications</p>
          </div>
        </a>

        <a
          href="mailto:contact@zynstore.ma"
          className="bg-[#1c202c]/90 dark:bg-[#0e1015]/90 border border-slate-700/50 dark:border-white/[0.08] p-5 rounded-2xl shadow-lg space-y-2 group hover:border-[#7c5cfc]/40 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-xl bg-[#7c5cfc]/10 text-[#7c5cfc] border border-[#7c5cfc]/20">
              <Mail className="w-5 h-5" />
            </div>
            <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-[#7c5cfc] transition-colors" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm">Technical Email Support</h3>
            <p className="text-xs text-slate-400 mt-0.5">contact@zynstore.ma — 24hr response time</p>
          </div>
        </a>

        <div className="bg-[#1c202c]/90 dark:bg-[#0e1015]/90 border border-slate-700/50 dark:border-white/[0.08] p-5 rounded-2xl shadow-lg space-y-2">
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
              <Phone className="w-5 h-5" />
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm">Direct Phone Hotline</h3>
            <p className="text-xs text-slate-400 mt-0.5">+212 6 12 34 56 78 — Mon to Sat (9 AM - 7 PM)</p>
          </div>
        </div>
      </div>

      {/* Knowledge Base & FAQs Section */}
      <div className="bg-[#1c202c]/90 dark:bg-[#0e1015]/90 border border-slate-700/50 dark:border-white/[0.08] rounded-2xl p-6 shadow-lg space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-700/50 dark:border-white/5 pb-4">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#7c5cfc]" /> Knowledge Base & Frequently Asked Questions
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Quick guides on order processing, payments, and system sync</p>
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search help topics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 bg-[#121520] dark:bg-[#08090d] border border-slate-700/50 dark:border-white/[0.08] rounded-xl text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[#7c5cfc]"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-[#7c5cfc] text-white shadow-sm'
                  : 'bg-[#121520] dark:bg-[#08090d] text-slate-400 hover:text-white border border-slate-700/50 dark:border-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Accordion List */}
        <div className="space-y-3 pt-2">
          {filteredFaqs.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-8 font-mono">
              No help articles matching search keywords.
            </p>
          ) : (
            filteredFaqs.map((faq) => {
              const isOpen = openFaqId === faq.id;
              return (
                <div
                  key={faq.id}
                  className="bg-[#121520] dark:bg-[#08090d] border border-slate-700/50 dark:border-white/5 rounded-xl overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                    className="w-full flex items-center justify-between p-4 text-left cursor-pointer hover:bg-slate-700/20 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#7c5cfc]/10 text-[#7c5cfc] border border-[#7c5cfc]/20">
                        {faq.category}
                      </span>
                      <span className="text-xs font-bold text-white">{faq.question}</span>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-[#7c5cfc]' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-4 pt-1 text-xs text-slate-300 leading-relaxed border-t border-slate-700/30 dark:border-white/5">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Submit Ticket Modal */}
      {isTicketModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#1c202c] dark:bg-[#0e1015] border border-slate-700/60 dark:border-white/[0.1] rounded-2xl w-full max-w-md overflow-hidden shadow-2xl p-6 space-y-4 text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-700/50 dark:border-white/[0.08] pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Send className="w-4 h-4 text-[#7c5cfc]" /> Open Technical Support Ticket
              </h3>
              <button onClick={() => setIsTicketModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            {ticketSuccess ? (
              <div className="p-6 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <p className="text-sm font-bold text-white">Support Ticket Submitted!</p>
                <p className="text-xs text-slate-400">Our engineering team will review and reply within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleTicketSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-mono font-bold uppercase text-slate-400 mb-1">
                    Subject Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Issue with Supabase webhook sync"
                    value={ticketSubject}
                    onChange={(e) => setTicketSubject(e.target.value)}
                    className="w-full px-3 py-2 bg-[#121520] dark:bg-[#08090d] border border-slate-700/50 dark:border-white/[0.08] rounded-xl text-xs text-white focus:outline-none focus:border-[#7c5cfc]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono font-bold uppercase text-slate-400 mb-1">
                    Issue Category
                  </label>
                  <select
                    value={ticketCategory}
                    onChange={(e) => setTicketCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-[#121520] dark:bg-[#08090d] border border-slate-700/50 dark:border-white/[0.08] rounded-xl text-xs text-white focus:outline-none cursor-pointer"
                  >
                    <option value="Technical Issue" className="bg-[#121520]">Technical Issue / Bug</option>
                    <option value="Database Sync" className="bg-[#121520]">Database / PostgreSQL Sync</option>
                    <option value="Payment Gateway" className="bg-[#121520]">CIH Bank / WhatsApp Link Issue</option>
                    <option value="Feature Request" className="bg-[#121520]">Feature Request</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-mono font-bold uppercase text-slate-400 mb-1">
                    Detailed Message
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Describe the steps to reproduce or details..."
                    value={ticketMessage}
                    onChange={(e) => setTicketMessage(e.target.value)}
                    className="w-full px-3 py-2 bg-[#121520] dark:bg-[#08090d] border border-slate-700/50 dark:border-white/[0.08] rounded-xl text-xs text-white focus:outline-none focus:border-[#7c5cfc] resize-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-700/50 dark:border-white/[0.08]">
                  <button
                    type="button"
                    onClick={() => setIsTicketModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#7c5cfc] hover:bg-[#6b4af3] text-white rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-sm"
                  >
                    Submit Ticket
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};