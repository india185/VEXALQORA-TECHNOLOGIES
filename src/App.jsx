import React, { useState } from 'react';

export default function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [theme, setTheme] = useState('Cybernetic Core');
  const [orders, setOrders] = useState([
    { id: 1, service: 'Only Website', price: 850, status: 'Unpaid', customer: 'Rahul Sharma', phone: '+91 9839000000' }
  ]);
  const [tickets, setTickets] = useState([]);
  const [newTicket, setNewTicket] = useState('');

  const handleOrder = (service, price) => {
    const newOrd = { id: orders.length + 1, service, price, status: 'Unpaid', customer: 'Sher Singh', phone: '+91 9839000000' };
    setOrders([...orders, newOrd]);
    alert(`Order Confirmed for ${service} (₹${price})! Our team will contact you within 24 hours.`);
  };

  const togglePayment = (id) => {
    setOrders(orders.map(o => o.id === id ? { ...o, status: o.status === 'Paid' ? 'Unpaid' : 'Paid' } : o));
  };

  const submitTicket = (e) => {
    e.preventDefault();
    if (!newTicket.trim()) return;
    setTickets([...tickets, { id: tickets.length + 1, message: newTicket, status: 'Open' }]);
    setNewTicket('');
    alert('Support ticket submitted successfully!');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-black">
      {/* Top Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center font-black text-xl shadow-lg shadow-cyan-500/20">V</div>
            <div>
              <h1 className="font-bold text-lg tracking-wider bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">VEXALQORA TECHNOLOGIES</h1>
              <p className="text-xs text-slate-400">3D Enterprise Platform & Cloud Solutions</p>
            </div>
          </div>
          <button 
            onClick={() => setIsAdmin(!isAdmin)}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 transition shadow"
          >
            {isAdmin ? 'Switch to Client View' : 'Switch to Admin Portal'}
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {!isAdmin ? (
          <div>
            {/* Hero Section */}
            <div className="relative rounded-3xl p-8 md:p-12 mb-10 overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 shadow-2xl">
              <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
              <div className="relative z-10 max-w-2xl">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-4">Next-Gen Digital Engineering</span>
                <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">Transform Your Business with Immersive 3D Solutions</h2>
                <p className="text-slate-400 mb-6">High-converting business websites, custom web applications, and automated growth campaigns delivered with rapid execution.</p>
                
                {/* Theme Selector */}
                <div className="flex items-center space-x-3 bg-slate-900/80 p-3 rounded-xl border border-slate-800 w-fit">
                  <span className="text-xs text-slate-400 font-medium">3D Theme Active:</span>
                  <select 
                    value={theme} 
                    onChange={(e) => setTheme(e.target.value)}
                    className="bg-slate-800 text-cyan-400 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-700 outline-none cursor-pointer"
                  >
                    <option>Cybernetic Core</option>
                    <option>Quantum Grid</option>
                    <option>Neural Matrix</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex flex-wrap gap-2 mb-8 border-b border-slate-800 pb-4">
              {[
                { id: 'overview', label: 'Overview & Pricing' },
                { id: 'orders', label: 'My Orders' },
                { id: 'invoices', label: 'Invoices & Payments' },
                { id: 'tickets', label: 'Support Tickets' },
                { id: 'reviews', label: 'Customer Reviews' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                    activeTab === tab.id 
                      ? 'bg-cyan-500 text-black font-bold shadow-lg shadow-cyan-500/20' 
                      : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Contents */}
            {activeTab === 'overview' && (
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between hover:border-cyan-500/50 transition">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Option 1</span>
                    <h3 className="text-2xl font-bold mt-1 mb-2">Only Website</h3>
                    <div className="text-3xl font-black text-white mb-4">₹850</div>
                    <p className="text-slate-400 text-sm mb-6">Modern business website with 1–2 days rapid delivery, 3D animations, and responsive layout.</p>
                  </div>
                  <button 
                    onClick={() => handleOrder('Only Website', 850)}
                    className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold transition shadow-lg shadow-cyan-500/20"
                  >
                    Confirm Order (₹850)
                  </button>
                </div>

                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between hover:border-indigo-500/50 transition">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Option 2 (Combo)</span>
                    <h3 className="text-2xl font-bold mt-1 mb-2">Website + Meta Ads / Promotion</h3>
                    <div className="text-3xl font-black text-white mb-4">₹700 + ₹400 <span className="text-sm font-normal text-slate-400">(Total ₹1,100)</span></div>
                    <p className="text-slate-400 text-sm mb-6">Complete business website combined with Meta Ads campaign management & promotion.</p>
                  </div>
                  <button 
                    onClick={() => handleOrder('Website + Meta Ads / Promotion', 1100)}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:opacity-90 text-white font-bold transition shadow-lg shadow-indigo-500/20"
                  >
                    Confirm Order (₹1,100)
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
                <h3 className="text-xl font-bold mb-4">Active & Past Orders</h3>
                {orders.length === 0 ? (
                  <p className="text-slate-400 text-sm">No orders placed yet.</p>
                ) : (
                  <div className="space-y-4">
                    {orders.map(o => (
                      <div key={o.id} className="flex justify-between items-center p-4 bg-slate-950 rounded-xl border border-slate-800">
                        <div>
                          <h4 className="font-bold text-white">{o.service}</h4>
                          <p className="text-xs text-slate-400">Price: ₹{o.price}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${o.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
                          {o.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'tickets' && (
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
                  <h3 className="text-xl font-bold mb-4">Create Support Ticket</h3>
                  <form onSubmit={submitTicket} className="space-y-4">
                    <textarea 
                      value={newTicket}
                      onChange={(e) => setNewTicket(e.target.value)}
                      placeholder="Describe your query or request..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:border-cyan-500 outline-none h-32 resize-none"
                    ></textarea>
                    <button type="submit" className="px-6 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-sm rounded-xl transition">Submit Ticket</button>
                  </form>
                </div>
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
                  <h3 className="text-xl font-bold mb-4">Your Tickets</h3>
                  {tickets.length === 0 ? (
                    <p className="text-slate-400 text-sm">No support tickets found.</p>
                  ) : (
                    <div className="space-y-3">
                      {tickets.map(t => (
                        <div key={t.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center">
                          <p className="text-sm text-slate-200">{t.message}</p>
                          <span className="px-2.5 py-1 bg-cyan-500/10 text-cyan-400 text-xs rounded-full border border-cyan-500/20">{t.status}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'invoices' && (
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
                <h3 className="text-xl font-bold mb-4">Invoices & Payment History</h3>
                <p className="text-slate-400 text-sm">All invoices are generated dynamically upon order confirmation.</p>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
                <h3 className="text-xl font-bold mb-4">Customer Reviews</h3>
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                  <div className="flex text-amber-400 mb-2">★★★★★</div>
                  <p className="text-sm text-slate-300">"Absolute game-changer for our business! Delivered within 24 hours with stunning 3D aesthetics."</p>
                  <span className="text-xs text-slate-500 mt-2 block">— Verified Client</span>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Admin Panel */
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold">Admin Management Portal</h2>
                <p className="text-xs text-slate-400">Manage orders, payment status, and client fulfillment.</p>
              </div>
              <span className="px-3 py-1 bg-cyan-500/10 text-cyan-400 text-xs font-bold rounded-full border border-cyan-500/20">Secure Admin Mode</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 text-xs uppercase">
                    <th className="py-3 px-4">Order ID</th>
                    <th className="py-3 px-4">Service</th>
                    <th className="py-3 px-4">Price</th>
                    <th className="py-3 px-4">Status Toggle</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-sm">
                  {orders.map(o => (
                    <tr key={o.id} className="hover:bg-slate-800/40">
                      <td className="py-4 px-4 font-mono">#{o.id}</td>
                      <td className="py-4 px-4 font-semibold text-white">{o.service}</td>
                      <td className="py-4 px-4 text-cyan-400 font-bold">₹{o.price}</td>
                      <td className="py-4 px-4">
                        <button 
                          onClick={() => togglePayment(o.id)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                            o.status === 'Paid' 
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20' 
                              : 'bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20'
                          }`}
                        >
                          {o.status} (Click to Toggle)
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
