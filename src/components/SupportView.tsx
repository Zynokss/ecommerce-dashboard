import React, { useState } from 'react';
import { 
  MessageSquare, 
  CheckCircle2, 
  Search, 
  Send, 
  BookOpen, 
  Clock 
} from 'lucide-react';

export const SupportView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');
  const [ticketSent, setTicketSent] = useState(false);

  const faqs = [
    {
      q: 'How do I synchronize custom inventory items?',
      a: 'Navigate to the Products Table tab and use the Add Product modal, or set up automated webhooks in Settings.',
    },
    {
      q: 'How are sales analytics and conversion rates calculated?',
      a: 'Metrics are generated in real-time by tracking completed store checkouts against unique store visitor sessions.',
    },
    {
      q: 'Can I issue packing slips directly from the dashboard?',
      a: 'Yes, click the external link icon on any order inside the Orders Feed tab to preview and print a packing slip.',
    },
  ];

  const filteredFaqs = faqs.filter(
    (item) =>
      item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject || !ticketMessage) return;
    setTicketSent(true);
    setTicketSubject('');
    setTicketMessage('');
    setTimeout(() => setTicketSent(false), 4000);
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Help & Client Support</h2>
        <p className="text-xs font-medium text-slate-400 dark:text-slate-500 mt-1">
          Search the knowledge base, monitor platform uptime, or contact technical support
        </p>
      </div>

      {/* System Status Banner */}
      <div className="bg-white dark:bg-slate-900/60 backdrop-blur-xl rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-500">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-white">All Zynboard OS Services Operational</h3>
            <p className="text-[11px] text-slate-400">Database connection, webhooks, and analytics engine running normally.</p>
          </div>
        </div>
        <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5" /> Uptime: 99.98%
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Knowledge Base Search & FAQs */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white dark:bg-slate-900/60 backdrop-blur-xl rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-500" />
              Knowledge Base & FAQs
            </h3>

            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search help articles, topics, guides..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div className="space-y-3 pt-2">
              {filteredFaqs.length === 0 ? (
                <p className="text-xs text-slate-400 py-4 text-center">No articles matching "{searchQuery}".</p>
              ) : (
                filteredFaqs.map((faq, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-800/40 space-y-1">
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{faq.q}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">{faq.a}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Submit Priority Support Ticket Form */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-slate-900/60 backdrop-blur-xl rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-indigo-500" />
              Contact Dedicated Support
            </h3>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              Need assistance with your dashboard setup? Open a direct ticket with our development team.
            </p>

            {ticketSent ? (
              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Ticket submitted! A developer will respond shortly.
              </div>
            ) : (
              <form onSubmit={handleSubmitTicket} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Subject / Issue Area
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Question about webhook setup"
                    value={ticketSubject}
                    onChange={(e) => setTicketSubject(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Detailed Message
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Describe what you need help with..."
                    value={ticketMessage}
                    onChange={(e) => setTicketMessage(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl font-semibold text-xs transition-colors cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  Submit Support Ticket
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};