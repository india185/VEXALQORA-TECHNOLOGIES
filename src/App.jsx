import React, { useState, useEffect, useRef } from 'react';
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  Users,
  Briefcase,
  ShoppingBag,
  MessageSquare,
  CreditCard,
  Settings,
  BarChart3,
  Globe,
  LogOut,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Eye,
  EyeOff,
  Menu,
  X,
  FileText,
  Star,
  Send,
  Check
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [adminMode, setAdminMode] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState('Cybernetic Core');
  
  // State data synced across panels
  const [orders, setOrders] = useState([
    { id: 'ORD-9481', service: 'Website + Meta Ads / Promotion (₹700 + ₹400)', amount: '₹1,100', status: 'Pending', client: 'Apex Enterprise', date: '2026-11-16' }
  ]);
  
  const [invoices, setInvoices] = useState([
    { id: 'INV-338481', item: 'Website + Meta Ads / Promotion (₹700 + ₹400) • ₹1,100', amount: '₹1,100', status: 'Unpaid', date: '2026-11-16' }
  ]);

  const [tickets, setTickets] = useState([
    { id: 'TCK-101', subject: 'Domain integration assistance', message: 'Need help connecting custom domain to Vercel.', status: 'Open', date: '2026-11-16' }
  ]);

  const [newTicketSubject, setNewTicketSubject] = useState('');
  const [newTicketMsg, setNewTicketMsg] = useState('');
  
  const [reviews, setReviews] = useState([
    { id: 1, user: 'Gopal Singh', rating: 5, comment: 'Amazing 3D web platform delivered on time with 2 years support!', date: '2026-11-16' }
  ]);
  const [newRating, setNewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState('');

  // Order modal state
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedServiceType, setSelectedServiceType] = useState('Website + Meta Ads / Promotion');
  const [selectedPrice, setSelectedPrice] = useState('₹1,100');
  const [businessNameInput, setBusinessNameInput] = useState('Apex Enterprise');
  const [requirementsInput, setRequirementsInput] = useState('');

  const handleCreateOrder = (type, price) => {
    setSelectedServiceType(type);
    setSelectedPrice(price);
    setShowOrderModal(true);
  };

  const submitOrderConfirmation = () => {
    const newOrd = {
      id: 'ORD-' + Math.floor(1000 + Math.random() * 9000),
      service: `${selectedServiceType} (${selectedPrice})`,
      amount: selectedPrice,
      status: 'Pending',
      client: businessNameInput || 'Client',
      date: new Date().toISOString().split('T')[0]
    };
    const newInv = {
      id: 'INV-' + Math.floor(100000 + Math.random() * 900000),
      item: `${selectedServiceType} • ${selectedPrice}`,
      amount: selectedPrice,
      status: 'Unpaid',
      date: new Date().toISOString().split('T')[0]
    };
    setOrders([newOrd, ...orders]);
    setInvoices([newInv, ...invoices]);
    setShowOrderModal(false);
    alert('Order Confirmed Successfully! Invoice generated.');
  };

  const handleAddTicket = (e) => {
    e.preventDefault();
    if (!newTicketSubject || !newTicketMsg) return;
    const tck = {
      id: 'TCK-' + Math.floor(100 + Math.random() * 900),
      subject: newTicketSubject,
      message: newTicketMsg,
      status: 'Open',
      date: new Date().toISOString().split('T')[0]
    };
    setTickets([tck, ...tickets]);
    setNewTicketSubject('');
    setNewTicketMsg('');
    alert('Support Ticket Submitted!');
  };

  const handleAddReview = (e) => {
    e.preventDefault();
    if (!newReviewComment) return;
    const rev = {
      id: reviews.length + 1,
      user: businessNameInput || 'Verified Client',
      rating: newRating,
      comment: newReviewComment,
      date: new Date().toISOString().split('T')[0]
    };
    setReviews([rev, ...reviews]);
    setNewReviewComment('');
    alert('Thank you for your feedback! Review posted.');
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 font-sans flex flex-col selection:bg-cyan-500 selection:text-black">
      {/* Top Navbar */}
      <header className="h-16 border-b border-slate-800/80 bg-[#0b0f17]/90 backdrop-blur px-6 flex items-center justify-between z-40 sticky top-0">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Globe className="w-5 h-5 text-black" />
          </div>
          <div>
            <span className="font-bold tracking-wider text-sm bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">
              {adminMode ? 'ADMIN COMMAND' : 'VEXALQORA TECHNOLOGIES 3D Enterprise Platform'}
            </span>
            <span className="block text-[10px] text-slate-400 tracking-widest uppercase">
              {adminMode ? 'VEXALQORA ROOT' : 'VEXALQORA CLOUD'}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={() => setAdminMode(!adminMode)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition border ${
              adminMode 
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-400 hover:bg-rose-500/20' 
                : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20'
            }`}
          >
            {adminMode ? '🔒 Lock Admin Session' : '⚡ Switch to Admin'}
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 border-r border-slate-800/80 bg-[#080c14] p-4 flex flex-col justify-between z-30">
          <div className="space-y-6">
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-bold">
                AS
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-semibold truncate">Sher Singh</p>
                <p className="text-xs text-cyan-400 truncate">ananymart85@gmail.com</p>
              </div>
            </div>

            <nav className="space-y-1">
              {!adminMode ? (
                <>
                  <button onClick={() => setActiveTab('overview')} className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${activeTab === 'overview' ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'}`}>
                    <BarChart3 className="w-4 h-4" />
                    <span>Overview & Services</span>
                  </button>
                  <button onClick={() => setActiveTab('orders')} className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${activeTab === 'orders' ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'}`}>
                    <ShoppingBag className="w-4 h-4" />
                    <span>My Orders</span>
                  </button>
                  <button onClick={() => setActiveTab('invoices')} className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${activeTab === 'invoices' ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'}`}>
                    <CreditCard className="w-4 h-4" />
                    <span>Invoices & Payments</span>
                  </button>
                  <button onClick={() => setActiveTab('tickets')} className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${activeTab === 'tickets' ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'}`}>
                    <MessageSquare className="w-4 h-4" />
                    <span>Support Tickets</span>
                  </button>
                  <button onClick={() => setActiveTab('reviews')} className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${activeTab === 'reviews' ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'}`}>
                    <Star className="w-4 h-4" />
                    <span>Customer Reviews</span>
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => setActiveTab('admin-overview')} className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${activeTab === 'admin-overview' ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'}`}>
                    <BarChart3 className="w-4 h-4" />
                    <span>Admin Overview</span>
                  </button>
                  <button onClick={() => setActiveTab('admin-orders')} className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${activeTab === 'admin-orders' ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'}`}>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Manage Orders ({orders.length})</span>
                  </button>
                  <button onClick={() => setActiveTab('admin-invoices')} className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${activeTab === 'admin-invoices' ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'}`}>
                    <CreditCard className="w-4 h-4" />
                    <span>Manage Payments ({invoices.length})</span>
                  </button>
                  <button onClick={() => setActiveTab('admin-tickets')} className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${activeTab === 'admin-tickets' ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'}`}>
                    <MessageSquare className="w-4 h-4" />
                    <span>Support Tickets ({tickets.length})</span>
                  </button>
                </>
              )}
            </nav>
          </div>

          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800/80">
              <span className="text-[11px] text-cyan-400 font-semibold block mb-1">3D Theme Active</span>
              <select 
                value={selectedTheme} 
                onChange={(e) => setSelectedTheme(e.target.value)}
                className="w-full bg-black/60 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
              >
                <option>Cybernetic Core</option>
                <option>Quantum Helix</option>
                <option>Neural Grid</option>
              </select>
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 bg-[#05070b] p-8 overflow-y-auto">
          {!adminMode ? (
            <div className="max-w-5xl mx-auto space-y-8">
              {activeTab === 'overview' && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Option 1: Only Website */}
                    <div className="bg-[#0b0f17] border border-slate-800 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between hover:border-cyan-500/50 transition">
                      <div className="absolute -right-10 -top-10 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl"></div>
                      <div>
                        <span className="text-xs uppercase tracking-wider text-cyan-400 font-bold">Option 1</span>
                        <h3 className="text-xl font-bold mt-1 text-white">Only Website</h3>
                        <p className="text-3xl font-extrabold text-cyan-400 mt-2">₹850</p>
                        <p className="text-sm text-slate-400 mt-3">Modern business website with 1–2 days rapid delivery, 3D animations, and responsive layout.</p>
                      </div>
                      <button 
                        onClick={() => handleCreateOrder('Only Website', '₹850')}
                        className="mt-6 w-full py-3 bg-cyan-500 text-black font-bold rounded-xl hover:bg-cyan-400 transition shadow-lg shadow-cyan-500/20"
                      >
                        Confirm Order (₹850)
                      </button>
                    </div>

                    {/* Option 2: Website + Meta Ads */}
                    <div className="bg-[#0b0f17] border border-cyan-500/40 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between shadow-xl shadow-cyan-500/5">
                      <div className="absolute -right-10 -top-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl"></div>
                      <div>
                        <span className="text-xs uppercase tracking-wider text-indigo-400 font-bold">Option 2 (Combo)</span>
                        <h3 className="text-xl font-bold mt-1 text-white">Website + Meta Ads / Promotion</h3>
                        <p className="text-3xl font-extrabold text-indigo-400 mt-2">₹700 + ₹400 <span className="text-sm text-slate-400 font-normal">(Total ₹1,100)</span></p>
                        <p className="text-sm text-slate-400 mt-3">Complete business website combined with Meta Ads campaign management & promotion.</p>
                      </div>
                      <button 
                        onClick={() => handleCreateOrder('Website + Meta Ads / Promotion', '₹700 + ₹400')}
                        className="mt-6 w-full py-3 bg-gradient-to-r from-cyan-500 to-indigo-600 text-black font-bold rounded-xl hover:opacity-90 transition shadow-lg shadow-cyan-500/20"
                      >
                        Confirm Order (₹1,100)
                      </button>
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'orders' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold">My Commissioned Orders</h2>
                  <div className="space-y-3">
                    {orders.map((ord, idx) => (
                      <div key={idx} className="p-4 bg-[#0b0f17] border border-slate-800 rounded-xl flex items-center justify-between">
                        <div>
                          <p className="font-bold text-white">{ord.service}</p>
                          <p className="text-xs text-slate-400">Order ID: {ord.id} • Date: {ord.date}</p>
                        </div>
                        <span className="px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-full text-xs font-semibold">
                          {ord.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'invoices' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold">Invoices & Payment Records</h2>
                  <div className="space-y-3">
                    {invoices.map((inv, idx) => (
                      <div key={idx} className="p-4 bg-[#0b0f17] border border-slate-800 rounded-xl flex items-center justify-between">
                        <div>
                          <p className="font-bold text-white">{inv.id}</p>
                          <p className="text-xs text-slate-400">{inv.item}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                          inv.status === 'Paid' 
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                            : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                        }`}>
                          {inv.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'tickets' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold">Support Tickets & Complaints</h2>
                  <form onSubmit={handleAddTicket} className="p-6 bg-[#0b0f17] border border-slate-800 rounded-2xl space-y-4">
                    <h3 className="text-sm font-semibold text-cyan-400">Create New Support Ticket</h3>
                    <input 
                      type="text" 
                      placeholder="Subject / Issue Title" 
                      value={newTicketSubject}
                      onChange={(e) => setNewTicketSubject(e.target.value)}
                      className="w-full bg-black/60 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
                    />
                    <textarea 
                      rows="3"
                      placeholder="Describe your issue or complaint in detail..." 
                      value={newTicketMsg}
                      onChange={(e) => setNewTicketMsg(e.target.value)}
                      className="w-full bg-black/60 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
                    ></textarea>
                    <button type="submit" className="px-6 py-2.5 bg-cyan-500 text-black font-bold rounded-xl text-sm hover:bg-cyan-400 transition">
                      Submit Ticket
                    </button>
                  </form>

                  <div className="space-y-3">
                    {tickets.map((tck, idx) => (
                      <div key={idx} className="p-4 bg-[#0b0f17] border border-slate-800 rounded-xl space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-white">{tck.subject} ({tck.id})</span>
                          <span className="px-2.5 py-0.5 bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded-full text-xs">{tck.status}</span>
                        </div>
                        <p className="text-xs text-slate-300">{tck.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold">Customer Reviews & Testimonials</h2>
                  <form onSubmit={handleAddReview} className="p-6 bg-[#0b0f17] border border-slate-800 rounded-2xl space-y-4">
                    <h3 className="text-sm font-semibold text-cyan-400">Leave a Review</h3>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-slate-400">Rating:</span>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button 
                          type="button" 
                          key={star} 
                          onClick={() => setNewRating(star)}
                          className={`text-lg ${star <= newRating ? 'text-amber-400' : 'text-slate-600'}`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                    <textarea 
                      rows="3"
                      placeholder="Share your experience with Vexalqora Technologies..." 
                      value={newReviewComment}
                      onChange={(e) => setNewReviewComment(e.target.value)}
                      className="w-full bg-black/60 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
                    ></textarea>
                    <button type="submit" className="px-6 py-2.5 bg-cyan-500 text-black font-bold rounded-xl text-sm hover:bg-cyan-400 transition">
                      Post Review
                    </button>
                  </form>

                  <div className="space-y-3">
                    {reviews.map((rev) => (
                      <div key={rev.id} className="p-4 bg-[#0b0f17] border border-slate-800 rounded-xl space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-white">{rev.user}</span>
                          <span className="text-amber-400">{'★'.repeat(rev.rating)}</span>
                        </div>
                        <p className="text-xs text-slate-300">{rev.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="max-w-5xl mx-auto space-y-8">
              {activeTab === 'admin-overview' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-rose-400">Admin Control Command Center</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-6 bg-[#0b0f17] border border-slate-800 rounded-2xl">
                      <p className="text-xs text-slate-400">Total Orders</p>
                      <p className="text-3xl font-extrabold text-white mt-1">{orders.length}</p>
                    </div>
                    <div className="p-6 bg-[#0b0f17] border border-slate-800 rounded-2xl">
                      <p className="text-xs text-slate-400">Total Invoices</p>
                      <p className="text-3xl font-extrabold text-white mt-1">{invoices.length}</p>
                    </div>
                    <div className="p-6 bg-[#0b0f17] border border-slate-800 rounded-2xl">
                      <p className="text-xs text-slate-400">Support Tickets</p>
                      <p className="text-3xl font-extrabold text-white mt-1">{tickets.length}</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'admin-orders' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-rose-400">Manage Customer Orders</h2>
                  <div className="space-y-3">
                    {orders.map((ord, idx) => (
                      <div key={idx} className="p-4 bg-[#0b0f17] border border-slate-800 rounded-xl flex items-center justify-between">
                        <div>
                          <p className="font-bold text-white">{ord.client} - {ord.service}</p>
                          <p className="text-xs text-slate-400">ID: {ord.id} • {ord.date}</p>
                        </div>
                        <span className="px-3 py-1 bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded-full text-xs font-semibold">
                          {ord.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'admin-invoices' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-rose-400">Manage Payments & Invoices</h2>
                  <div className="space-y-3">
                    {invoices.map((inv, idx) => (
                      <div key={idx} className="p-4 bg-[#0b0f17] border border-slate-800 rounded-xl flex items-center justify-between">
                        <div>
                          <p className="font-bold text-white">{inv.id}</p>
                          <p className="text-xs text-slate-400">{inv.item}</p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <select 
                            value={inv.status}
                            onChange={(e) => {
                              const updated = [...invoices];
                              updated[idx].status = e.target.value;
                              setInvoices(updated);
                            }}
                            className={`px-3 py-1 rounded-lg text-xs font-semibold border bg-black/60 ${
                              inv.status === 'Paid' 
                                ? 'text-emerald-400 border-emerald-500/40' 
                                : 'text-rose-400 border-rose-500/40'
                            }`}
                          >
                            <option value="Unpaid">Unpaid</option>
                            <option value="Paid">Paid</option>
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'admin-tickets' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-rose-400">Manage Support Tickets</h2>
                  <div className="space-y-3">
                    {tickets.map((tck, idx) => (
                      <div key={idx} className="p-4 bg-[#0b0f17] border border-slate-800 rounded-xl space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-white">{tck.subject} ({tck.id})</span>
                          <button 
                            onClick={() => {
                              const updated = [...tickets];
                              updated[idx].status = updated[idx].status === 'Open' ? 'Resolved' : 'Open';
                              setTickets(updated);
                            }}
                            className="px-3 py-1 bg-rose-500/10 text-rose-400 border border-rose-500/30 rounded-full text-xs"
                          >
                            Status: {tck.status} (Click to toggle)
                          </button>
                        </div>
                        <p className="text-xs text-slate-300">{tck.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Order Modal */}
      {showOrderModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#0b0f17] border border-cyan-500/40 rounded-2xl w-full max-w-lg p-6 space-y-6 relative shadow-2xl">
            <button 
              onClick={() => setShowOrderModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              ✕
            </button>
            <div>
              <h3 className="text-lg font-bold text-white">Order: {selectedServiceType}</h3>
              <p className="text-xs text-cyan-400 mt-1">1–2 Days Rapid Delivery • 2 Years Support Guarantee</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 block mb-1">BUSINESS NAME *</label>
                <input 
                  type="text" 
                  value={businessNameInput}
                  onChange={(e) => setBusinessNameInput(e.target.value)}
                  className="w-full bg-black/60 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">PACKAGE & PRICING</label>
                <div className="p-3 bg-black/60 border border-cyan-500/40 rounded-xl flex justify-between items-center">
                  <span className="text-sm font-bold text-white">{selectedServiceType}</span>
                  <span className="text-sm font-extrabold text-cyan-400">{selectedPrice}</span>
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">DETAILED REQUIREMENTS / SPECIFICATIONS *</label>
                <textarea 
                  rows="3"
                  placeholder="Describe your design preferences, target audience, color schemes..."
                  value={requirementsInput}
                  onChange={(e) => setRequirementsInput(e.target.value)}
                  className="w-full bg-black/60 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                ></textarea>
              </div>
            </div>

            <div className="flex space-x-3 pt-2">
              <button 
                onClick={() => setShowOrderModal(false)}
                className="flex-1 py-3 bg-slate-800 text-slate-300 font-bold rounded-xl hover:bg-slate-700 transition text-sm"
              >
                Cancel
              </button>
              <button 
                onClick={submitOrderConfirmation}
                className="flex-1 py-3 bg-cyan-500 text-black font-bold rounded-xl hover:bg-cyan-400 transition text-sm shadow-lg shadow-cyan-500/20"
              >
                Confirm Order ({selectedPrice})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
