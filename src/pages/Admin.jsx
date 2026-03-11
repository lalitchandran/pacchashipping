import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiLock, FiLogOut, FiMessageSquare, FiFileText, FiPlus, FiX, FiShield, FiCheckCircle } from 'react-icons/fi';
import { auth, db } from '../firebase/config';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { ref, onValue, push, set, remove } from 'firebase/database';

const Admin = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [activeTab, setActiveTab] = useState('queries'); // queries, news

    const [queriesList, setQueriesList] = useState([]);
    const [newsItems, setNewsItems] = useState([]);
    const [partners, setPartners] = useState([]);
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(false);

    const [isAddingNews, setIsAddingNews] = useState(false);
    const [newNews, setNewNews] = useState({ title: '', summary: '', type: 'Company News', imageUrl: '' });
    const [newPartner, setNewPartner] = useState({ name: '', logoUrl: '' });
    const [newTestimonial, setNewTestimonial] = useState({ text: '', author: '', role: '' });

    useEffect(() => {
        if (!isAuthenticated) return;
        setLoading(true);
        let unsubscribe = () => { };

        if (activeTab === 'queries') {
            unsubscribe = onValue(ref(db, 'queries'), (snapshot) => {
                if (snapshot.exists()) {
                    const data = snapshot.val();
                    let arr = Object.keys(data).map(key => ({
                        id: key,
                        ...data[key],
                        date: data[key].createdAt ? new Date(data[key].createdAt).toLocaleDateString() : 'Recent'
                    }));
                    arr.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
                    setQueriesList(arr);
                } else {
                    setQueriesList([]);
                }
                setLoading(false);
            }, (err) => { console.error(err); setLoading(false); });
        } else if (activeTab === 'news') {
            unsubscribe = onValue(ref(db, 'news'), (snapshot) => {
                if (snapshot.exists()) {
                    const data = snapshot.val();
                    let arr = Object.keys(data).map(key => ({
                        id: key,
                        ...data[key],
                        date: data[key].createdAt ? new Date(data[key].createdAt).toLocaleDateString() : 'Recent'
                    }));
                    arr.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
                    setNewsItems(arr);
                } else {
                    setNewsItems([]);
                }
                setLoading(false);
            }, (err) => { console.error(err); setLoading(false); });
        } else if (activeTab === 'ecosystem') {
            let loaded = 0;
            const checkDone = () => { loaded++; if (loaded >= 2) setLoading(false); };
            const unsubPartners = onValue(ref(db, 'partners'), (snapshot) => {
                if (snapshot.exists()) {
                    const data = snapshot.val();
                    let arr = Object.keys(data).map(key => ({ id: key, ...data[key] }));
                    arr.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
                    setPartners(arr);
                } else {
                    setPartners([]);
                }
                checkDone();
            }, (err) => { console.error(err); checkDone(); });
            const unsubTestimonials = onValue(ref(db, 'testimonials'), (snapshot) => {
                if (snapshot.exists()) {
                    const data = snapshot.val();
                    let arr = Object.keys(data).map(key => ({ id: key, ...data[key] }));
                    arr.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
                    setTestimonials(arr);
                } else {
                    setTestimonials([]);
                }
                checkDone();
            }, (err) => { console.error(err); checkDone(); });
            unsubscribe = () => { unsubPartners(); unsubTestimonials(); };
        }

        return () => unsubscribe();
    }, [isAuthenticated, activeTab]);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            setIsAuthenticated(true);
        } catch (error) {
            console.error(error);
            alert("Login failed: Check credentials or Firebase Config.");
        }
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error(error);
        }
        setIsAuthenticated(false);
    };

    const handleAddNews = async (e) => {
        e.preventDefault();
        if (!auth.currentUser) {
            alert("\u26A0\uFE0F Cannot add data to Firebase while using the dummy demo login. Please create a real user in Firebase Authentication and log in, OR update your Firebase Security Rules.");
            return;
        }
        const newsData = { ...newNews };
        setIsAddingNews(false);
        setNewNews({ title: '', summary: '', type: 'Company News', imageUrl: '' });
        try {
            const newRef = push(ref(db, 'news'));
            await set(newRef, {
                ...newsData,
                createdAt: Date.now()
            });
        } catch (error) {
            alert("Error adding news: " + error.message + "\n\n(Check your Firebase Security Rules)");
        }
    };

    const handleAddPartner = async (e) => {
        e.preventDefault();
        if (!newPartner.name.trim()) return;
        if (!auth.currentUser) {
            alert("\u26A0\uFE0F Cannot add data: You are logged in with the demo fallback account.");
            return;
        }
        const partnerData = { ...newPartner };
        setNewPartner({ name: '', logoUrl: '' });
        try {
            const newRef = push(ref(db, 'partners'));
            await set(newRef, { name: partnerData.name, logoUrl: partnerData.logoUrl || '', createdAt: Date.now() });
        } catch (error) {
            alert("Error adding partner: " + error.message + "\n\n(Check your Firebase Security Rules)");
        }
    };

    const handleAddTestimonial = async (e) => {
        e.preventDefault();
        if (!newTestimonial.text || !newTestimonial.author) return;
        if (!auth.currentUser) {
            alert("\u26A0\uFE0F Cannot add data: You are logged in with the demo fallback account.");
            return;
        }
        const testimonialData = { ...newTestimonial };
        setNewTestimonial({ text: '', author: '', role: '' });
        try {
            const newRef = push(ref(db, 'testimonials'));
            await set(newRef, { ...testimonialData, createdAt: Date.now() });
        } catch (error) {
            alert("Error adding testimonial: " + error.message + "\n\n(Check your Firebase Security Rules)");
        }
    };

    const handleDelete = async (collectionName, id) => {
        if (!window.confirm("Delete this item from " + collectionName + "?")) return;
        if (!auth.currentUser) {
            alert("\u26A0\uFE0F Cannot delete data: You are logged in with the demo fallback account.");
            return;
        }
        try {
            await remove(ref(db, collectionName + "/" + id));
        } catch (error) {
            alert("Error deleting item: " + error.message + "\n\n(Check your Firebase Security Rules)");
        }
    };

    const handleUpdateStatus = async (collectionName, id, newStatus) => {
        if (!auth.currentUser) {
            alert("\u26A0\uFE0F Cannot update data: You are logged in with the demo fallback account.");
            return;
        }
        try {
            await set(ref(db, collectionName + "/" + id + "/status"), newStatus);
        } catch (error) {
            alert("Error updating status: " + error.message);
        }
    };

    const revealVariants = {
        hidden: { opacity: 0, scale: 0.98, y: 30 },
        visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
    };

    if (!isAuthenticated) {
        return (
            <div className="w-full min-h-screen flex items-center justify-center relative bg-background overflow-hidden px-6">
                {/* Background ambient light */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-brand-primary/10 to-transparent rounded-full blur-[120px] pointer-events-none"></div>

                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={revealVariants}
                    className="glass-panel p-12 w-full max-w-md relative z-10 shadow-[0_20px_60px_rgba(0,0,0,0.5)] border border-white/5 text-center"
                >
                    <div className="flex justify-center mb-10 relative mx-auto w-fit">
                        <div className="w-24 h-24 rounded-[1.5rem] bg-gradient-to-b from-brand-secondary/80 to-background flex items-center justify-center text-4xl text-brand-primary shadow-inner border border-brand-primary/20">
                            <FiShield />
                        </div>
                        <div className="absolute top-0 right-1/4 w-4 h-4 rounded-full bg-brand-primary animate-pulse blur-[1px]"></div>
                    </div>
                    <h2 className="text-3xl font-extrabold text-center mb-2 tracking-tight text-foreground">Enterprise Login</h2>
                    <p className="text-center text-muted-foreground text-xs font-bold uppercase tracking-[0.2em] mb-10">Command Center Authorization</p>

                    <form onSubmit={handleLogin} className="flex flex-col gap-6 text-left">
                        <div className="relative">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="Admin ID / Email"
                                className="w-full px-6 py-5 rounded-2xl glass-input focus:bg-white/5 focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/20 transition-all text-foreground outline-none font-medium placeholder-muted-foreground/50"
                            />
                        </div>
                        <div className="relative">
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="Security Key"
                                className="w-full px-6 py-5 rounded-2xl glass-input focus:bg-white/5 focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/20 transition-all text-foreground outline-none font-medium placeholder-muted-foreground/50"
                            />
                        </div>
                        <button
                            type="submit"
                            className="mt-6 w-full py-5 rounded-full bg-brand-primary text-background font-bold text-lg hover:bg-brand-secondary hover:text-foreground hover:shadow-neon-brand hover:-translate-y-1 transition-all duration-300"
                        >
                            Establish Connection
                        </button>
                    </form>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen pt-32 pb-20 px-6 max-w-[1500px] mx-auto flex flex-col md:flex-row gap-10 bg-background">
            {/* Sidebar */}
            <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="w-full md:w-80 glass-panel p-8 flex flex-col h-fit shrink-0 gap-10 shadow-[0_10px_40px_rgba(0,0,0,0.4)] border border-white/5 relative z-20"
            >
                <div>
                    <h2 className="text-3xl font-extrabold text-foreground tracking-tight">Operations</h2>
                    <p className="text-[11px] font-bold uppercase tracking-widest text-brand-secondary mt-2">Paccha Command Center</p>
                </div>

                <div className="flex flex-col gap-3">
                    <button
                        onClick={() => setActiveTab('queries')}
                        className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all font-semibold text-[15px] ${activeTab === 'queries' ? 'glass-panel text-brand-secondary shadow-neon-brand scale-100 border border-brand-primary/20 bg-brand-secondary/20' : 'text-muted-foreground hover:bg-white/5 hover:text-foreground scale-95 origin-left'}`}
                    >
                        <FiMessageSquare className="text-xl" /> Logistics Requests
                    </button>
                    <button
                        onClick={() => setActiveTab('news')}
                        className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all font-semibold text-[15px] ${activeTab === 'news' ? 'glass-panel text-brand-secondary shadow-neon-brand scale-100 border border-brand-primary/20 bg-brand-secondary/20' : 'text-muted-foreground hover:bg-white/5 hover:text-foreground scale-95 origin-left'}`}
                    >
                        <FiFileText className="text-xl" /> Global Intelligence
                    </button>
                    <button
                        onClick={() => setActiveTab('ecosystem')}
                        className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all font-semibold text-[15px] ${activeTab === 'ecosystem' ? 'glass-panel text-brand-secondary shadow-neon-brand scale-100 border border-brand-primary/20 bg-brand-secondary/20' : 'text-muted-foreground hover:bg-white/5 hover:text-foreground scale-95 origin-left'}`}
                    >
                        <FiShield className="text-xl" /> Ecosystem
                    </button>
                </div>

                <div className="mt-auto pt-8 border-t border-white/5">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-3 px-5 py-4 rounded-2xl bg-red-500/10 text-red-500 hover:bg-red-500/20 hover:shadow-sm transition-all font-bold group"
                    >
                        <FiLogOut className="text-xl group-hover:-translate-x-1 transition-transform" /> Terminate Session
                    </button>
                </div>
            </motion.div>

            {/* Main Content Pane */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                className="flex-1 glass-panel p-10 md:p-14 relative shadow-[0_10px_40px_rgba(0,0,0,0.4)] border border-white/5 z-10"
            >
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-6 mb-12 pb-8 border-b border-white/5">
                    <h3 className="text-4xl font-extrabold text-foreground tracking-tight">
                        {activeTab === 'queries' ? 'Enterprise Inquiries' : activeTab === 'news' ? 'Intelligence Broadcast' : 'Partner Ecosystem Manage'}
                    </h3>

                    {activeTab === 'news' && !isAddingNews && (
                        <button
                            onClick={() => setIsAddingNews(true)}
                            className="px-8 py-3.5 rounded-full bg-brand-primary text-background font-bold hover:bg-brand-secondary hover:text-foreground hover:shadow-neon-brand hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                        >
                            <FiPlus className="text-xl" /> Issue New Advisory
                        </button>
                    )}
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-[50vh]">
                        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} className="w-12 h-12 border-[3px] border-muted border-t-brand-primary rounded-full" />
                    </div>
                ) : activeTab === 'queries' ? (
                    <div className="flex flex-col gap-6">
                        {/* Map Location Section */}
                        <div className="glass-panel rounded-[1.5rem] border border-white/5 p-4 mb-4 overflow-hidden relative shadow-[0_12px_30px_rgba(0,0,0,0.3)]">
                            <h4 className="font-extrabold text-xl text-foreground mb-4 px-2">Network Operations Map</h4>
                            <div className="w-full h-[300px] rounded-2xl overflow-hidden bg-white/5">
                                <iframe
                                    title="Network Operations Location Map"
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1m3!1d3885.645607062489!2d80.20815131482397!3d13.121603590757521!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a5264a2c5a0134f%3A0x6bbaaaa3c28271a3!2sKolathur%2C%20Chennai%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1672589000000!5m2!1sen!2sin"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) contrast(100%)' }}
                                    allowFullScreen=""
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade">
                                </iframe>
                            </div>
                        </div>

                        {queriesList.length === 0 ? (
                            <div className="h-64 flex flex-col items-center justify-center text-muted-foreground font-medium border-2 border-dashed border-white/5 rounded-[2rem] bg-white/5 gap-4">
                                <FiMessageSquare className="text-4xl opacity-50" />
                                No pending logistics requests.
                            </div>
                        ) : (
                            <AnimatePresence>
                                {queriesList.map(q => (
                                    <motion.div
                                        key={q.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="glass-panel rounded-[1.5rem] border border-white/5 p-8 flex flex-col md:flex-row justify-between gap-6 hover:shadow-[0_12px_30px_rgba(0,0,0,0.4)] hover:shadow-neon-brand transition-all group"
                                    >
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center gap-3">
                                                    <span className={`text-[10px] px-3 py-1.5 rounded-full font-bold uppercase tracking-widest ${q.status === 'Completed' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-brand-primary/20 text-brand-secondary border border-brand-primary/30'}`}>
                                                        {q.status || 'New'}
                                                    </span>
                                                    <span className="text-muted-foreground text-xs font-bold uppercase tracking-widest">{q.date}</span>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button onClick={() => handleUpdateStatus('queries', q.id, 'Completed')} className="text-green-500 hover:text-green-400 bg-green-500/10 p-2 rounded-full opacity-50 group-hover:opacity-100 transition-opacity"><FiCheckCircle size={18} /></button>
                                                    <button onClick={() => handleDelete('queries', q.id)} className="text-red-500 hover:text-red-400 bg-red-500/10 p-2 rounded-full opacity-50 group-hover:opacity-100 transition-opacity"><FiX size={18} /></button>
                                                </div>
                                            </div>
                                            <h4 className="font-extrabold text-2xl text-foreground mb-1">{q.name}</h4>
                                            <p className="text-sm font-bold text-muted-foreground mb-6 uppercase tracking-wider">{q.email} <span className="mx-3 opacity-50">•</span> {q.phone}</p>
                                            <div className="p-6 bg-black/40 rounded-[1rem] text-[15px] text-muted-foreground font-medium leading-relaxed border border-white/5">
                                                {q.message}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        )}
                    </div>
                ) : activeTab === 'news' ? (
                    <div className="flex flex-col gap-8">
                        {isAddingNews && (
                            <motion.form
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                onSubmit={handleAddNews}
                                className="glass-panel p-8 border border-white/5 flex flex-col gap-6 overflow-hidden relative"
                            >
                                <div className="flex justify-between items-center mb-2 pb-4 border-b border-white/5">
                                    <h4 className="font-bold text-2xl text-foreground">Compose Advisory</h4>
                                    <button type="button" onClick={() => setIsAddingNews(false)} className="text-muted-foreground hover:text-foreground bg-white/5 hover:bg-white/10 rounded-full p-2.5 transition-colors"><FiX size={20} /></button>
                                </div>
                                <input
                                    className="w-full px-5 py-4 rounded-xl glass-input focus:bg-white/5 focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/20 transition-all text-foreground outline-none font-bold text-lg placeholder-muted-foreground/40"
                                    placeholder="Advisory Header"
                                    value={newNews.title}
                                    onChange={(e) => setNewNews({ ...newNews, title: e.target.value })}
                                    required
                                />
                                <div className="flex gap-4">
                                    <div className="relative w-full md:w-1/3">
                                        <select
                                            className="w-full px-5 py-4 rounded-xl glass-input focus:bg-white/5 focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/20 transition-all text-foreground outline-none font-bold appearance-none cursor-pointer"
                                            style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2386868b' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 1rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.2em 1.2em' }}
                                            value={newNews.type}
                                            onChange={(e) => setNewNews({ ...newNews, type: e.target.value })}
                                        >
                                            <option value="Global Directive" className="font-medium text-black">Global Directive</option>
                                            <option value="Regulatory Intel" className="font-medium text-black">Regulatory Intel</option>
                                            <option value="Network Status" className="font-medium text-black">Network Status</option>
                                        </select>
                                    </div>
                                    <input
                                        className="flex-1 px-5 py-4 rounded-xl glass-input focus:bg-white/5 focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/20 transition-all text-foreground outline-none font-medium placeholder-muted-foreground/40"
                                        placeholder="Image URL (Optional)"
                                        value={newNews.imageUrl}
                                        onChange={(e) => setNewNews({ ...newNews, imageUrl: e.target.value })}
                                    />
                                </div>
                                <textarea
                                    className="w-full px-5 py-4 rounded-xl glass-input focus:bg-white/5 focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/20 transition-all text-foreground outline-none font-medium placeholder-muted-foreground/40 h-40 resize-none leading-relaxed"
                                    placeholder="Detailed intelligence brief..."
                                    value={newNews.summary}
                                    onChange={(e) => setNewNews({ ...newNews, summary: e.target.value })}
                                    required
                                />
                                <button type="submit" className="self-end px-10 py-4 bg-brand-primary text-background font-bold rounded-full hover:bg-brand-secondary hover:text-foreground hover:-translate-y-0.5 hover:shadow-neon-brand transition-all text-[15px]">
                                    Broadcast Intelligence
                                </button>
                            </motion.form>
                        )}

                        <div className="flex flex-col gap-5">
                            {newsItems.length === 0 ? (
                                <div className="h-64 flex flex-col items-center justify-center text-muted-foreground font-medium border-2 border-dashed border-white/5 rounded-[2rem] bg-white/5 gap-4">
                                    <FiFileText className="text-4xl opacity-50" />
                                    No intelligence broadcasts available.
                                </div>
                            ) : (
                                <AnimatePresence>
                                    {newsItems.map(item => (
                                        <motion.div
                                            key={item.id}
                                            initial={{ opacity: 0, y: 15 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="glass-panel rounded-[1.5rem] border border-white/5 p-8 flex flex-col gap-3 hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)] hover:shadow-neon-brand transition-all group cursor-pointer relative"
                                        >
                                            <button onClick={() => handleDelete('news', item.id)} className="absolute top-4 right-4 text-red-500 hover:text-red-400 bg-red-500/10 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><FiX /></button>
                                            <div className="flex items-center gap-4 mb-2">
                                                <span className="text-[10px] px-3 py-1.5 rounded-full font-bold uppercase tracking-widest bg-brand-primary/20 text-brand-secondary border border-brand-primary/30">
                                                    {item.type}
                                                </span>
                                                <span className="text-muted-foreground text-xs font-bold uppercase tracking-widest">{item.date}</span>
                                            </div>
                                            <h4 className="font-extrabold text-2xl text-foreground group-hover:text-brand-secondary transition-colors">{item.title}</h4>
                                            <p className="text-[15px] text-muted-foreground font-medium leading-relaxed max-w-4xl">{item.summary}</p>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            )}
                        </div>
                    </div>
                ) : activeTab === 'ecosystem' ? (
                    <div className="flex flex-col gap-12">
                        {/* Partners Section */}
                        <div className="flex flex-col gap-6">
                            <h4 className="text-2xl font-bold text-foreground pb-2 border-b border-white/5">Enterprise Partners</h4>

                            <form onSubmit={handleAddPartner} className="flex flex-col md:flex-row gap-4 items-center">
                                <input
                                    className="flex-1 w-full px-5 py-4 rounded-xl glass-input focus:bg-white/5 focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/20 transition-all text-foreground outline-none font-medium placeholder-muted-foreground/40"
                                    placeholder="Enter Partner Name"
                                    value={newPartner.name}
                                    onChange={(e) => setNewPartner({ ...newPartner, name: e.target.value })}
                                    required
                                />
                                <input
                                    className="flex-1 w-full px-5 py-4 rounded-xl glass-input focus:bg-white/5 focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/20 transition-all text-foreground outline-none font-medium placeholder-muted-foreground/40"
                                    placeholder="Logo Image URL (Optional)"
                                    value={newPartner.logoUrl}
                                    onChange={(e) => setNewPartner({ ...newPartner, logoUrl: e.target.value })}
                                />
                                <button type="submit" className="w-full md:w-auto px-8 py-4 bg-brand-primary text-background font-bold rounded-xl hover:bg-brand-secondary hover:text-foreground transition-all">
                                    Add Partner
                                </button>
                            </form>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {partners.map(p => (
                                    <div key={p.id} className="glass-panel p-4 rounded-xl border border-white/5 flex justify-between items-center group">
                                        <div className="flex items-center gap-3">
                                            {p.logoUrl && <img src={p.logoUrl} alt="logo" className="w-8 h-8 object-contain bg-white/10 rounded overflow-hidden" />}
                                            <span className="font-semibold text-foreground truncate">{p.name}</span>
                                        </div>
                                        <button onClick={() => handleDelete('partners', p.id)} className="text-red-500 hover:text-red-400 bg-red-500/10 p-1.5 rounded-md opacity-50 group-hover:opacity-100 transition-opacity"><FiX /></button>
                                    </div>
                                ))}
                                {partners.length === 0 && <div className="col-span-full text-muted-foreground italic text-sm">No partners added yet.</div>}
                            </div>
                        </div>

                        {/* Testimonials Section */}
                        <div className="flex flex-col gap-6">
                            <h4 className="text-2xl font-bold text-foreground pb-2 border-b border-white/5">Customer Testimonials</h4>

                            <form onSubmit={handleAddTestimonial} className="glass-panel p-6 border border-white/5 rounded-2xl flex flex-col gap-4">
                                <textarea
                                    className="w-full px-5 py-4 rounded-xl glass-input focus:bg-white/5 transition-all text-foreground outline-none font-medium placeholder-muted-foreground/40 h-24 resize-none"
                                    placeholder="Testimonial Quote..."
                                    value={newTestimonial.text}
                                    onChange={(e) => setNewTestimonial({ ...newTestimonial, text: e.target.value })}
                                    required
                                />
                                <div className="flex gap-4">
                                    <input
                                        className="flex-1 px-5 py-3 rounded-xl glass-input focus:bg-white/5 transition-all text-foreground outline-none font-medium placeholder-muted-foreground/40"
                                        placeholder="Author Name"
                                        value={newTestimonial.author}
                                        onChange={(e) => setNewTestimonial({ ...newTestimonial, author: e.target.value })}
                                        required
                                    />
                                    <input
                                        className="flex-1 px-5 py-3 rounded-xl glass-input focus:bg-white/5 transition-all text-foreground outline-none font-medium placeholder-muted-foreground/40"
                                        placeholder="Author Role & Company"
                                        value={newTestimonial.role}
                                        onChange={(e) => setNewTestimonial({ ...newTestimonial, role: e.target.value })}
                                        required
                                    />
                                </div>
                                <button type="submit" className="self-end px-8 py-3 bg-brand-primary text-background font-bold rounded-xl hover:bg-brand-secondary hover:text-foreground transition-all">
                                    Add Testimonial
                                </button>
                            </form>

                            <div className="flex flex-col gap-4">
                                {testimonials.map(t => (
                                    <div key={t.id} className="glass-panel p-6 rounded-2xl border border-white/5 relative group">
                                        <button onClick={() => handleDelete('testimonials', t.id)} className="absolute top-4 right-4 text-red-500 hover:text-red-400 bg-red-500/10 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><FiX /></button>
                                        <p className="text-foreground font-medium italic mb-3">"{t.text}"</p>
                                        <p className="text-sm font-bold text-foreground">{t.author}</p>
                                        <p className="text-xs text-muted-foreground uppercase tracking-widest mt-1">{t.role}</p>
                                    </div>
                                ))}
                                {testimonials.length === 0 && <div className="text-muted-foreground italic text-sm">No testimonials added yet.</div>}
                            </div>
                        </div>

                    </div>
                ) : null}
            </motion.div>
        </div>
    );
};

export default Admin;
