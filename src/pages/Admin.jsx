import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiLock,
    FiLogOut,
    FiMessageSquare,
    FiFileText,
    FiPlus,
    FiX,
    FiShield,
    FiCheckCircle,
    FiActivity,
    FiTrendingUp,
    FiUsers,
    FiCalendar,
    FiClock,
    FiStar,
    FiSearch,
    FiEye,
    FiTrash2,
    FiMail,
    FiPhone,
    FiCheck,
    FiAlertCircle,
    FiRefreshCw
} from 'react-icons/fi';
import { auth, db } from '../firebase/config';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { ref, onValue, push, set, remove } from 'firebase/database';

// Accessible star rating display
const GoldStars = ({ rating = 5, size = 16 }) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
        const fill = Math.min(Math.max(rating - (i - 1), 0), 1);
        stars.push(
            <span
                key={i}
                className="relative inline-block shrink-0"
                style={{ width: size + 2, height: size + 2 }}
            >
                <FiStar size={size} className="text-amber-900/40" />
                <span
                    className="absolute top-0 left-0 overflow-hidden block h-full"
                    style={{ width: fill === 0 ? 0 : fill >= 1 ? '100%' : '50%' }}
                >
                    <FiStar size={size} className="text-amber-400 fill-amber-400" />
                </span>
            </span>
        );
    }
    return <span className="inline-flex items-center gap-1">{stars}</span>;
};

// Touch & mouse friendly Star Picker (supports whole and half stars)
const StarPicker = ({ value, onChange }) => {
    const [hover, setHover] = useState(null);
    const displayed = hover ?? value;

    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-300">Client Rating</label>
            <div className="flex items-center gap-1.5 py-1" onMouseLeave={() => setHover(null)}>
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        aria-label={`Rate ${star} star`}
                        className="relative cursor-pointer p-1 rounded hover:bg-white/5 transition-colors"
                        style={{ width: 36, height: 36 }}
                        onMouseMove={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            const half = e.clientX - rect.left < rect.width / 2;
                            setHover(half ? star - 0.5 : star);
                        }}
                        onClick={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            const half = e.clientX - rect.left < rect.width / 2;
                            onChange(half ? star - 0.5 : star);
                        }}
                    >
                        <FiStar size={26} className="text-slate-600 absolute top-1 left-1" />
                        {displayed >= star - 0.5 && (
                            <span
                                className="absolute top-1 left-1 overflow-hidden inline-block"
                                style={{ width: displayed >= star ? '100%' : '50%' }}
                            >
                                <FiStar size={26} className="text-amber-400 fill-amber-400" />
                            </span>
                        )}
                    </button>
                ))}
                <span className="ml-3 text-amber-400 font-bold text-sm">
                    {displayed ?? value} / 5
                </span>
            </div>
        </div>
    );
};

const Admin = () => {
    const [authLoading, setAuthLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currentUserEmail, setCurrentUserEmail] = useState('');
    const [isDemoMode, setIsDemoMode] = useState(false);

    // Form states
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginSubmitting, setLoginSubmitting] = useState(false);
    const [toastMessage, setToastMessage] = useState(null);

    // Active tab
    const [activeTab, setActiveTab] = useState('overview'); // overview, queries, news, testimonials, partners

    // Data lists
    const [queriesList, setQueriesList] = useState([]);
    const [newsItems, setNewsItems] = useState([]);
    const [partners, setPartners] = useState([]);
    const [testimonials, setTestimonials] = useState([]);
    const [loadingData, setLoadingData] = useState(false);

    // Modals & new entries
    const [isAddingNews, setIsAddingNews] = useState(false);
    const [newNews, setNewNews] = useState({ title: '', summary: '', type: 'Company News', imageUrl: '' });
    const [newPartner, setNewPartner] = useState({ name: '', logoUrl: '' });
    const [newTestimonial, setNewTestimonial] = useState({ text: '', author: '', role: '', rating: 5 });
    const [selectedInquiry, setSelectedInquiry] = useState(null);

    // Search and filters
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [filterCategory, setFilterCategory] = useState('All');

    const showToast = (message, type = 'info') => {
        setToastMessage({ message, type });
        setTimeout(() => setToastMessage(null), 4000);
    };

    // Listen to Firebase Auth state
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setIsAuthenticated(true);
                setCurrentUserEmail(user.email || 'Admin');
                setIsDemoMode(false);
            } else if (!isDemoMode) {
                setIsAuthenticated(false);
                setCurrentUserEmail('');
            }
            setAuthLoading(false);
        });

        return () => unsubscribe();
    }, [isDemoMode]);

    // Reset filters on tab switch
    useEffect(() => {
        setSearchQuery('');
        setFilterStatus('All');
        setFilterCategory('All');
    }, [activeTab]);

    // Subscribe to Firebase RTDB data when authenticated
    useEffect(() => {
        if (!isAuthenticated) return;
        setLoadingData(true);

        let completed = 0;
        const total = 4;
        const checkDone = () => {
            completed++;
            if (completed >= total) setLoadingData(false);
        };

        const unsubQueries = onValue(ref(db, 'queries'), (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                const list = Object.keys(data).map((key) => ({
                    id: key,
                    ...data[key],
                    date: data[key].createdAt ? new Date(data[key].createdAt).toLocaleDateString() : 'Recent'
                }));
                list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
                setQueriesList(list);
            } else {
                setQueriesList([]);
            }
            checkDone();
        });

        const unsubNews = onValue(ref(db, 'news'), (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                const list = Object.keys(data).map((key) => ({
                    id: key,
                    ...data[key],
                    date: data[key].createdAt ? new Date(data[key].createdAt).toLocaleDateString() : 'Recent'
                }));
                list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
                setNewsItems(list);
            } else {
                setNewsItems([]);
            }
            checkDone();
        });

        const unsubPartners = onValue(ref(db, 'partners'), (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                const list = Object.keys(data).map((key) => ({ id: key, ...data[key] }));
                list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
                setPartners(list);
            } else {
                setPartners([]);
            }
            checkDone();
        });

        const unsubTestimonials = onValue(ref(db, 'testimonials'), (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                const list = Object.keys(data).map((key) => ({
                    id: key,
                    ...data[key],
                    rating: typeof data[key].rating === 'number' ? data[key].rating : 5
                }));
                list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
                setTestimonials(list);
            } else {
                setTestimonials([]);
            }
            checkDone();
        });

        return () => {
            unsubQueries();
            unsubNews();
            unsubPartners();
            unsubTestimonials();
        };
    }, [isAuthenticated]);

    // Authentication Handlers
    const handleLogin = async (e) => {
        e.preventDefault();
        setLoginSubmitting(true);
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            setIsAuthenticated(true);
            setCurrentUserEmail(userCredential.user.email || email);
            setIsDemoMode(false);
            showToast('Signed in successfully.', 'success');
        } catch (error) {
            console.error('Login error:', error);
            let msg = 'Authentication failed. Please verify credentials.';
            if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password') {
                msg = 'Invalid email or password.';
            } else if (error.code === 'auth/user-not-found') {
                msg = 'No user account found with this email.';
            } else if (error.code === 'auth/network-request-failed') {
                msg = 'Network connection error. Check your internet connectivity.';
            }
            showToast(msg, 'error');
        } finally {
            setLoginSubmitting(false);
        }
    };

    const handleDemoLogin = () => {
        setIsDemoMode(true);
        setIsAuthenticated(true);
        setCurrentUserEmail('demo.officer@sentronlogistics.com');
        showToast('Entered demo preview mode (Read-only view).', 'info');
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error(error);
        }
        setIsAuthenticated(false);
        setIsDemoMode(false);
        setCurrentUserEmail('');
        showToast('Signed out of admin portal.', 'info');
    };

    // Firebase Mutation Handlers
    const handleAddNews = async (e) => {
        e.preventDefault();
        if (isDemoMode || !auth.currentUser) {
            showToast('Write operations require a live Firebase authenticated user.', 'warning');
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
            showToast('Advisory published to global updates.', 'success');
        } catch (error) {
            showToast('Failed to publish advisory: ' + error.message, 'error');
        }
    };

    const handleAddPartner = async (e) => {
        e.preventDefault();
        if (!newPartner.name.trim()) return;
        if (isDemoMode || !auth.currentUser) {
            showToast('Write operations require a live Firebase authenticated user.', 'warning');
            return;
        }
        const partnerData = { ...newPartner };
        setNewPartner({ name: '', logoUrl: '' });
        try {
            const newRef = push(ref(db, 'partners'));
            await set(newRef, {
                name: partnerData.name,
                logoUrl: partnerData.logoUrl || '',
                createdAt: Date.now()
            });
            showToast('Partner added successfully.', 'success');
        } catch (error) {
            showToast('Failed to add partner: ' + error.message, 'error');
        }
    };

    const handleAddTestimonial = async (e) => {
        e.preventDefault();
        if (!newTestimonial.text || !newTestimonial.author) return;
        if (isDemoMode || !auth.currentUser) {
            showToast('Write operations require a live Firebase authenticated user.', 'warning');
            return;
        }
        const testimonialData = { ...newTestimonial };
        setNewTestimonial({ text: '', author: '', role: '', rating: 5 });
        try {
            const newRef = push(ref(db, 'testimonials'));
            await set(newRef, { ...testimonialData, createdAt: Date.now() });
            showToast('Testimonial published.', 'success');
        } catch (error) {
            showToast('Failed to publish testimonial: ' + error.message, 'error');
        }
    };

    const handleDelete = async (collectionName, id) => {
        if (!window.confirm(`Are you sure you want to delete this record from ${collectionName}?`)) return;
        if (isDemoMode || !auth.currentUser) {
            showToast('Write operations require a live Firebase authenticated user.', 'warning');
            return;
        }
        try {
            await remove(ref(db, `${collectionName}/${id}`));
            showToast('Item deleted successfully.', 'info');
        } catch (error) {
            showToast('Failed to delete item: ' + error.message, 'error');
        }
    };

    const handleUpdateStatus = async (collectionName, id, newStatus) => {
        if (isDemoMode || !auth.currentUser) {
            showToast('Write operations require a live Firebase authenticated user.', 'warning');
            return;
        }
        try {
            await set(ref(db, `${collectionName}/${id}/status`), newStatus);
            showToast(`Status updated to "${newStatus}".`, 'success');
            if (selectedInquiry && selectedInquiry.id === id) {
                setSelectedInquiry((prev) => ({ ...prev, status: newStatus }));
            }
        } catch (error) {
            showToast('Failed to update status: ' + error.message, 'error');
        }
    };

    // Filtered collections
    const filteredQueries = queriesList.filter((q) => {
        const matchesSearch =
            (q.name && q.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (q.email && q.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (q.message && q.message.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (q.phone && q.phone.includes(searchQuery));
        const status = q.status || 'New';
        const matchesFilter = filterStatus === 'All' || status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    const filteredNews = newsItems.filter((item) => {
        const matchesSearch =
            (item.title && item.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (item.summary && item.summary.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesCategory = filterCategory === 'All' || item.type === filterCategory;
        return matchesSearch && matchesCategory;
    });

    // Statistics
    const newInquiriesCount = queriesList.filter((q) => !q.status || q.status === 'New').length;
    const completedCount = queriesList.filter((q) => q.status === 'Completed').length;
    const completionRate = queriesList.length > 0 ? Math.round((completedCount / queriesList.length) * 100) : 0;

    // Loading screen during Firebase auth resolution
    if (authLoading) {
        return (
            <div className="w-full min-h-screen flex items-center justify-center bg-[#070b12] text-slate-300">
                <div className="flex flex-col items-center gap-4">
                    <FiRefreshCw className="animate-spin text-3xl text-brand-orange" />
                    <p className="text-sm font-medium">Connecting to Sentron Portal...</p>
                </div>
            </div>
        );
    }

    // LOGIN SCREEN
    if (!isAuthenticated) {
        return (
            <div className="w-full min-h-screen flex items-center justify-center px-4 py-20 bg-[#070b12] relative overflow-hidden">
                {/* Subtle background glow */}
                <div
                    aria-hidden="true"
                    className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-primary/10 rounded-full blur-[140px] pointer-events-none"
                />

                {/* Toast Notification */}
                <AnimatePresence>
                    {toastMessage && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl border text-sm font-medium shadow-xl backdrop-blur-md ${
                                toastMessage.type === 'error'
                                    ? 'bg-rose-950/80 border-rose-500/40 text-rose-200'
                                    : toastMessage.type === 'success'
                                    ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-200'
                                    : 'bg-slate-900/90 border-slate-700 text-slate-200'
                            }`}
                        >
                            {toastMessage.type === 'error' ? (
                                <FiAlertCircle className="text-lg text-rose-400 shrink-0" />
                            ) : toastMessage.type === 'success' ? (
                                <FiCheck className="text-lg text-emerald-400 shrink-0" />
                            ) : (
                                <FiAlertCircle className="text-lg text-brand-orange shrink-0" />
                            )}
                            <span>{toastMessage.message}</span>
                        </motion.div>
                    )}
                </AnimatePresence>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full max-w-md bg-[#0d1420]/90 backdrop-blur-xl border border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl relative z-10"
                >
                    {/* Header */}
                    <div className="flex flex-col items-center text-center mb-8">
                        <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center p-3 mb-4 shadow-inner">
                            <img
                                src="/logo.png"
                                alt="Sentron Global Logistics"
                                className="w-full h-full object-contain"
                            />
                        </div>
                        <h1 className="text-2xl font-bold text-white tracking-tight">Admin Portal</h1>
                        <p className="text-xs text-slate-400 mt-1">
                            Sentron Global Logistics Management Console
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleLogin} className="flex flex-col gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                                Account Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="name@sentronlogistics.com"
                                className="w-full h-12 px-4 rounded-xl bg-slate-900/80 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="••••••••"
                                className="w-full h-12 px-4 rounded-xl bg-slate-900/80 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-all"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loginSubmitting}
                            className="mt-2 w-full h-12 rounded-xl bg-brand-primary text-slate-950 font-bold text-sm hover:bg-brand-secondary transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                        >
                            {loginSubmitting ? (
                                <>
                                    <FiRefreshCw className="animate-spin text-base" />
                                    <span>Verifying credentials...</span>
                                </>
                            ) : (
                                <>
                                    <FiLock className="text-base" />
                                    <span>Sign In to Dashboard</span>
                                </>
                            )}
                        </button>
                    </form>

                    {/* Demo fallback */}
                    <div className="mt-6 pt-6 border-t border-white/10 flex flex-col items-center">
                        <button
                            type="button"
                            onClick={handleDemoLogin}
                            className="text-xs font-medium text-slate-400 hover:text-white transition-colors underline underline-offset-4 cursor-pointer"
                        >
                            Preview dashboard in demo mode
                        </button>
                        <p className="text-[11px] text-slate-500 mt-2 text-center">
                            Authorized personnel only. All access attempts are recorded.
                        </p>
                    </div>
                </motion.div>
            </div>
        );
    }

    // MAIN DASHBOARD LAYOUT
    return (
        <div className="w-full min-h-screen pt-24 sm:pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-[1560px] mx-auto bg-[#070b12] text-slate-200">
            {/* Toast Notifications */}
            <AnimatePresence>
                {toastMessage && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl border text-sm font-medium shadow-2xl backdrop-blur-md ${
                            toastMessage.type === 'error'
                                ? 'bg-rose-950/90 border-rose-500/40 text-rose-200'
                                : toastMessage.type === 'success'
                                ? 'bg-emerald-950/90 border-emerald-500/40 text-emerald-200'
                                : 'bg-slate-900/90 border-slate-700 text-slate-200'
                        }`}
                    >
                        {toastMessage.type === 'error' ? (
                            <FiAlertCircle className="text-lg text-rose-400 shrink-0" />
                        ) : toastMessage.type === 'success' ? (
                            <FiCheck className="text-lg text-emerald-400 shrink-0" />
                        ) : (
                            <FiAlertCircle className="text-lg text-brand-orange shrink-0" />
                        )}
                        <span>{toastMessage.message}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Demo Banner */}
            {isDemoMode && (
                <div className="mb-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-4 text-xs sm:text-sm text-amber-200">
                    <div className="flex items-center gap-2">
                        <FiAlertCircle className="text-lg text-amber-400 shrink-0" />
                        <span>
                            <strong>Demo Preview Mode:</strong> You are browsing with read-only privileges. Direct database modifications require signing in with a registered Firebase user.
                        </span>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-100 font-semibold shrink-0 cursor-pointer"
                    >
                        Switch to Live Auth
                    </button>
                </div>
            )}

            {/* Mobile Tab Navigation Bar (Swipeable / Scrollable) */}
            <div className="lg:hidden mb-6 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-white/10">
                {[
                    { id: 'overview', label: 'Overview', icon: <FiActivity /> },
                    { id: 'queries', label: `Inquiries (${queriesList.length})`, icon: <FiMessageSquare />, badge: newInquiriesCount > 0 ? newInquiriesCount : null },
                    { id: 'news', label: `Advisories (${newsItems.length})`, icon: <FiFileText /> },
                    { id: 'testimonials', label: `Reviews (${testimonials.length})`, icon: <FiStar /> },
                    { id: 'partners', label: `Partners (${partners.length})`, icon: <FiUsers /> }
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                            activeTab === tab.id
                                ? 'bg-brand-primary text-slate-950 shadow-md'
                                : 'bg-white/[0.04] text-slate-400 hover:text-white border border-white/5'
                        }`}
                    >
                        {tab.icon}
                        <span>{tab.label}</span>
                        {tab.badge && (
                            <span className="w-5 h-5 rounded-full bg-brand-orange text-white text-[10px] font-bold flex items-center justify-center">
                                {tab.badge}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            <div className="flex flex-col lg:flex-row gap-8 items-start">
                {/* Desktop Left Sidebar */}
                <aside className="hidden lg:flex w-72 shrink-0 flex-col gap-6 bg-[#0d1420]/80 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-xl sticky top-28">
                    <div>
                        <div className="flex items-center gap-3 pb-5 border-b border-white/10">
                            <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/10 p-2 flex items-center justify-center">
                                <img src="/logo.png" alt="Sentron" className="w-full h-full object-contain" />
                            </div>
                            <div>
                                <h2 className="text-base font-bold text-white tracking-tight">Sentron Console</h2>
                                <p className="text-[11px] text-slate-400">Logistics Administration</p>
                            </div>
                        </div>

                        {/* User info */}
                        <div className="mt-4 px-3 py-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">Logged in as</span>
                            <span className="text-xs font-semibold text-slate-300 truncate block mt-0.5" title={currentUserEmail}>
                                {currentUserEmail}
                            </span>
                        </div>
                    </div>

                    {/* Navigation buttons */}
                    <nav className="flex flex-col gap-1.5" aria-label="Admin Navigation">
                        <button
                            onClick={() => setActiveTab('overview')}
                            className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                                activeTab === 'overview'
                                    ? 'bg-brand-primary text-slate-950 shadow-md font-bold'
                                    : 'text-slate-400 hover:bg-white/[0.04] hover:text-white'
                            }`}
                        >
                            <span className="flex items-center gap-3">
                                <FiActivity className="text-lg" />
                                <span>Overview</span>
                            </span>
                        </button>

                        <button
                            onClick={() => setActiveTab('queries')}
                            className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                                activeTab === 'queries'
                                    ? 'bg-brand-primary text-slate-950 shadow-md font-bold'
                                    : 'text-slate-400 hover:bg-white/[0.04] hover:text-white'
                            }`}
                        >
                            <span className="flex items-center gap-3">
                                <FiMessageSquare className="text-lg" />
                                <span>Inquiries & Quotes</span>
                            </span>
                            {newInquiriesCount > 0 && (
                                <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                                    activeTab === 'queries' ? 'bg-slate-950 text-brand-primary' : 'bg-brand-orange text-white'
                                }`}>
                                    {newInquiriesCount}
                                </span>
                            )}
                        </button>

                        <button
                            onClick={() => setActiveTab('news')}
                            className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                                activeTab === 'news'
                                    ? 'bg-brand-primary text-slate-950 shadow-md font-bold'
                                    : 'text-slate-400 hover:bg-white/[0.04] hover:text-white'
                            }`}
                        >
                            <span className="flex items-center gap-3">
                                <FiFileText className="text-lg" />
                                <span>News & Advisories</span>
                            </span>
                            <span className="text-xs text-slate-500 font-normal">{newsItems.length}</span>
                        </button>

                        <button
                            onClick={() => setActiveTab('testimonials')}
                            className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                                activeTab === 'testimonials'
                                    ? 'bg-brand-primary text-slate-950 shadow-md font-bold'
                                    : 'text-slate-400 hover:bg-white/[0.04] hover:text-white'
                            }`}
                        >
                            <span className="flex items-center gap-3">
                                <FiStar className="text-lg" />
                                <span>Client Reviews</span>
                            </span>
                            <span className="text-xs text-slate-500 font-normal">{testimonials.length}</span>
                        </button>

                        <button
                            onClick={() => setActiveTab('partners')}
                            className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                                activeTab === 'partners'
                                    ? 'bg-brand-primary text-slate-950 shadow-md font-bold'
                                    : 'text-slate-400 hover:bg-white/[0.04] hover:text-white'
                            }`}
                        >
                            <span className="flex items-center gap-3">
                                <FiUsers className="text-lg" />
                                <span>Strategic Partners</span>
                            </span>
                            <span className="text-xs text-slate-500 font-normal">{partners.length}</span>
                        </button>
                    </nav>

                    {/* Sign out */}
                    <div className="pt-4 border-t border-white/10 mt-auto">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-semibold transition-colors cursor-pointer"
                        >
                            <FiLogOut className="text-base" />
                            <span>Sign Out</span>
                        </button>
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 w-full bg-[#0d1420]/80 backdrop-blur-xl p-6 sm:p-8 lg:p-10 rounded-3xl border border-white/10 shadow-xl min-w-0">
                    {/* Header bar of the active tab */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10 mb-8">
                        <div>
                            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                                {activeTab === 'overview' && 'Dashboard Overview'}
                                {activeTab === 'queries' && 'Logistics Inquiries & Rate Quotes'}
                                {activeTab === 'news' && 'Global Advisories & Updates'}
                                {activeTab === 'testimonials' && 'Client Testimonials & Feedback'}
                                {activeTab === 'partners' && 'Strategic Carrier Alliances'}
                            </h2>
                            <p className="text-xs text-slate-400 mt-1">
                                {activeTab === 'overview' && 'Live metrics, operational inquiry stream, and database status.'}
                                {activeTab === 'queries' && 'Review incoming rate requests, update processing states, and reply directly.'}
                                {activeTab === 'news' && 'Publish operational announcements, market bulletins, and advisories.'}
                                {activeTab === 'testimonials' && 'Manage authenticated corporate client reviews and ratings.'}
                                {activeTab === 'partners' && 'Manage global maritime, air, and freight alliance partner logos.'}
                            </p>
                        </div>

                        {/* Top action button according to tab */}
                        {activeTab === 'news' && (
                            <button
                                onClick={() => setIsAddingNews(!isAddingNews)}
                                className="px-5 py-2.5 rounded-xl bg-brand-primary text-slate-950 text-xs font-bold hover:bg-brand-secondary transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer shadow-md"
                            >
                                <FiPlus className="text-base" />
                                <span>{isAddingNews ? 'Close Form' : 'Publish New Advisory'}</span>
                            </button>
                        )}
                    </div>

                    {loadingData ? (
                        <div className="flex flex-col items-center justify-center py-24 gap-4 text-slate-400">
                            <FiRefreshCw className="animate-spin text-3xl text-brand-orange" />
                            <p className="text-sm">Fetching real-time records from Firebase...</p>
                        </div>
                    ) : (
                        <>
                            {/* OVERVIEW TAB */}
                            {activeTab === 'overview' && (
                                <div className="space-y-8">
                                    {/* Metric Cards Grid */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                                        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors">
                                            <div className="flex items-center justify-between mb-4">
                                                <span className="text-xs font-semibold text-slate-400">Total Inquiries</span>
                                                <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center text-lg">
                                                    <FiMessageSquare />
                                                </div>
                                            </div>
                                            <p className="text-3xl font-extrabold text-white">{queriesList.length}</p>
                                            <span className="text-[11px] text-slate-500 mt-1 block">Customer quote submissions</span>
                                        </div>

                                        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors">
                                            <div className="flex items-center justify-between mb-4">
                                                <span className="text-xs font-semibold text-slate-400">Pending Action</span>
                                                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center text-lg">
                                                    <FiClock />
                                                </div>
                                            </div>
                                            <p className="text-3xl font-extrabold text-amber-300">{newInquiriesCount}</p>
                                            <span className="text-[11px] text-slate-500 mt-1 block">Awaiting operational follow-up</span>
                                        </div>

                                        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors">
                                            <div className="flex items-center justify-between mb-4">
                                                <span className="text-xs font-semibold text-slate-400">Resolved Rate</span>
                                                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-lg">
                                                    <FiCheckCircle />
                                                </div>
                                            </div>
                                            <p className="text-3xl font-extrabold text-emerald-400">{completionRate}%</p>
                                            <span className="text-[11px] text-slate-500 mt-1 block">{completedCount} of {queriesList.length} inquiries resolved</span>
                                        </div>

                                        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors">
                                            <div className="flex items-center justify-between mb-4">
                                                <span className="text-xs font-semibold text-slate-400">Active Partners</span>
                                                <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center text-lg">
                                                    <FiUsers />
                                                </div>
                                            </div>
                                            <p className="text-3xl font-extrabold text-white">{partners.length}</p>
                                            <span className="text-[11px] text-slate-500 mt-1 block">{newsItems.length} published advisories</span>
                                        </div>
                                    </div>

                                    {/* Operational Status & Recent Activity */}
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                        {/* Recent inquiries */}
                                        <div className="lg:col-span-2 p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                                            <div className="flex items-center justify-between mb-5">
                                                <h3 className="text-base font-bold text-white flex items-center gap-2">
                                                    <FiActivity className="text-brand-orange" />
                                                    <span>Recent Inquiries</span>
                                                </h3>
                                                <button
                                                    onClick={() => setActiveTab('queries')}
                                                    className="text-xs text-brand-primary hover:underline font-semibold cursor-pointer"
                                                >
                                                    View all ({queriesList.length})
                                                </button>
                                            </div>

                                            {queriesList.length === 0 ? (
                                                <p className="text-sm text-slate-500 py-8 text-center">No inquiries logged yet.</p>
                                            ) : (
                                                <div className="space-y-3">
                                                    {queriesList.slice(0, 5).map((q) => (
                                                        <div
                                                            key={q.id}
                                                            onClick={() => setSelectedInquiry(q)}
                                                            className="p-3.5 rounded-xl bg-slate-900/50 hover:bg-slate-900/80 border border-white/5 flex items-center justify-between gap-4 cursor-pointer transition-colors"
                                                        >
                                                            <div className="min-w-0">
                                                                <div className="flex items-center gap-2">
                                                                    <p className="text-sm font-semibold text-white truncate">{q.name}</p>
                                                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                                                                        q.status === 'Completed'
                                                                            ? 'bg-emerald-500/15 text-emerald-300'
                                                                            : q.status === 'In Progress'
                                                                            ? 'bg-blue-500/15 text-blue-300'
                                                                            : 'bg-amber-500/15 text-amber-300'
                                                                    }`}>
                                                                        {q.status || 'New'}
                                                                    </span>
                                                                </div>
                                                                <p className="text-xs text-slate-400 truncate mt-0.5">{q.email} • {q.message}</p>
                                                            </div>
                                                            <span className="text-[11px] text-slate-500 shrink-0 font-medium">{q.date}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {/* System Connectivity Info */}
                                        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col justify-between">
                                            <div>
                                                <h3 className="text-base font-bold text-white flex items-center gap-2 mb-4">
                                                    <FiShield className="text-brand-orange" />
                                                    <span>System Status</span>
                                                </h3>
                                                <div className="space-y-3 text-xs">
                                                    <div className="flex items-center justify-between py-2 border-b border-white/5">
                                                        <span className="text-slate-400">Firebase Realtime DB</span>
                                                        <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-400 font-semibold">Live & Connected</span>
                                                    </div>
                                                    <div className="flex items-center justify-between py-2 border-b border-white/5">
                                                        <span className="text-slate-400">Authentication</span>
                                                        <span className={`px-2 py-0.5 rounded-md font-semibold ${isDemoMode ? 'bg-amber-500/15 text-amber-300' : 'bg-emerald-500/15 text-emerald-400'}`}>
                                                            {isDemoMode ? 'Demo Read-Only' : 'Active (Firebase)'}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center justify-between py-2 border-b border-white/5">
                                                        <span className="text-slate-400">Database Records</span>
                                                        <span className="text-slate-200 font-semibold">
                                                            {queriesList.length + newsItems.length + partners.length + testimonials.length} items
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center justify-between py-2">
                                                        <span className="text-slate-400">Global Deployment</span>
                                                        <span className="text-slate-200 font-semibold">Sentron Global Logistics</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mt-6 pt-4 border-t border-white/5 text-[11px] text-slate-500">
                                                To configure additional administrative users, manage them via the Firebase Authentication console.
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* INQUIRIES TAB */}
                            {activeTab === 'queries' && (
                                <div className="space-y-6">
                                    {/* Search & Filter Toolbar */}
                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <div className="relative flex-1">
                                            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                            <input
                                                type="text"
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                placeholder="Search inquiries by name, email, phone, message..."
                                                className="w-full h-11 pl-11 pr-4 rounded-xl bg-slate-900/80 border border-white/10 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-brand-primary"
                                            />
                                        </div>

                                        <div className="flex items-center gap-2 shrink-0">
                                            {['All', 'New', 'In Progress', 'Completed'].map((status) => (
                                                <button
                                                    key={status}
                                                    onClick={() => setFilterStatus(status)}
                                                    className={`px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                                                        filterStatus === status
                                                            ? 'bg-brand-primary text-slate-950 font-bold'
                                                            : 'bg-white/[0.04] text-slate-400 hover:text-white border border-white/5'
                                                    }`}
                                                >
                                                    {status}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Inquiries List */}
                                    {filteredQueries.length === 0 ? (
                                        <div className="p-12 text-center rounded-2xl bg-white/[0.01] border border-dashed border-white/10 text-slate-400">
                                            <FiMessageSquare className="text-4xl mx-auto mb-3 opacity-40" />
                                            <p className="text-sm font-semibold">No logistics inquiries match your current filter.</p>
                                            <p className="text-xs text-slate-500 mt-1">Try clearing the search query or status filter.</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {filteredQueries.map((q) => (
                                                <div
                                                    key={q.id}
                                                    className="p-5 sm:p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/15 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
                                                >
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex flex-wrap items-center gap-3 mb-2">
                                                            <h3 className="text-lg font-bold text-white tracking-tight">{q.name}</h3>
                                                            <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                                                                q.status === 'Completed'
                                                                    ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/20'
                                                                    : q.status === 'In Progress'
                                                                    ? 'bg-blue-500/15 text-blue-300 border border-blue-500/20'
                                                                    : 'bg-amber-500/15 text-amber-300 border border-amber-500/20'
                                                            }`}>
                                                                {q.status || 'New'}
                                                            </span>
                                                            <span className="text-xs text-slate-500 flex items-center gap-1.5 ml-auto md:ml-0">
                                                                <FiCalendar size={13} /> {q.date}
                                                            </span>
                                                        </div>

                                                        {/* Contact Details */}
                                                        <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-slate-400 mb-3">
                                                            <a href={`mailto:${q.email}`} className="hover:text-brand-primary flex items-center gap-1.5">
                                                                <FiMail size={13} /> {q.email}
                                                            </a>
                                                            {q.phone && (
                                                                <a href={`tel:${q.phone}`} className="hover:text-brand-primary flex items-center gap-1.5">
                                                                    <FiPhone size={13} /> {q.phone}
                                                                </a>
                                                            )}
                                                        </div>

                                                        {/* Message preview */}
                                                        <p className="text-xs sm:text-sm text-slate-300 bg-slate-900/60 p-3 rounded-xl border border-white/5 line-clamp-2">
                                                            {q.message}
                                                        </p>
                                                    </div>

                                                    {/* Actions */}
                                                    <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                                                        <button
                                                            onClick={() => setSelectedInquiry(q)}
                                                            className="px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 border border-white/5 transition-colors cursor-pointer"
                                                        >
                                                            <FiEye size={14} />
                                                            <span>Details</span>
                                                        </button>

                                                        {q.status !== 'Completed' ? (
                                                            <button
                                                                onClick={() => handleUpdateStatus('queries', q.id, 'Completed')}
                                                                className="px-3.5 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 text-xs font-semibold flex items-center gap-1.5 border border-emerald-500/20 transition-colors cursor-pointer"
                                                                title="Mark as completed"
                                                            >
                                                                <FiCheck size={14} />
                                                                <span>Resolve</span>
                                                            </button>
                                                        ) : (
                                                            <button
                                                                onClick={() => handleUpdateStatus('queries', q.id, 'In Progress')}
                                                                className="px-3.5 py-2 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 text-xs font-semibold flex items-center gap-1.5 border border-blue-500/20 transition-colors cursor-pointer"
                                                                title="Re-open inquiry"
                                                            >
                                                                <FiClock size={14} />
                                                                <span>Re-open</span>
                                                            </button>
                                                        )}

                                                        <button
                                                            onClick={() => handleDelete('queries', q.id)}
                                                            className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-semibold border border-rose-500/20 transition-colors cursor-pointer"
                                                            title="Delete inquiry"
                                                        >
                                                            <FiTrash2 size={15} />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* NEWS & ADVISORIES TAB */}
                            {activeTab === 'news' && (
                                <div className="space-y-6">
                                    {/* New Advisory Form Modal/Block */}
                                    {isAddingNews && (
                                        <motion.form
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            onSubmit={handleAddNews}
                                            className="p-6 sm:p-8 rounded-2xl bg-white/[0.03] border border-brand-primary/30 flex flex-col gap-4 shadow-xl mb-6"
                                        >
                                            <div className="flex items-center justify-between pb-3 border-b border-white/10">
                                                <h3 className="text-base font-bold text-white">Compose Global Advisory</h3>
                                                <button
                                                    type="button"
                                                    onClick={() => setIsAddingNews(false)}
                                                    className="text-slate-400 hover:text-white p-1"
                                                >
                                                    <FiX size={18} />
                                                </button>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div className="sm:col-span-2">
                                                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                                                        Advisory Headline
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={newNews.title}
                                                        onChange={(e) => setNewNews({ ...newNews, title: e.target.value })}
                                                        required
                                                        placeholder="e.g., Red Sea Maritime Route Optimization & Schedule Notice"
                                                        className="w-full h-11 px-4 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-brand-primary"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                                                        Category
                                                    </label>
                                                    <select
                                                        value={newNews.type}
                                                        onChange={(e) => setNewNews({ ...newNews, type: e.target.value })}
                                                        className="w-full h-11 px-4 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-brand-primary"
                                                    >
                                                        <option value="Company News">Company News</option>
                                                        <option value="Global Directive">Global Directive</option>
                                                        <option value="Regulatory Intel">Regulatory Intel</option>
                                                        <option value="Network Status">Network Status</option>
                                                    </select>
                                                </div>

                                                <div>
                                                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                                                        Banner Image URL (Optional)
                                                    </label>
                                                    <input
                                                        type="url"
                                                        value={newNews.imageUrl}
                                                        onChange={(e) => setNewNews({ ...newNews, imageUrl: e.target.value })}
                                                        placeholder="https://images.unsplash.com/..."
                                                        className="w-full h-11 px-4 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-brand-primary"
                                                    />
                                                </div>

                                                <div className="sm:col-span-2">
                                                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                                                        Advisory Summary / Details
                                                    </label>
                                                    <textarea
                                                        value={newNews.summary}
                                                        onChange={(e) => setNewNews({ ...newNews, summary: e.target.value })}
                                                        required
                                                        rows={4}
                                                        placeholder="Detailed brief of operational changes, port delays, or new service routes..."
                                                        className="w-full p-4 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-brand-primary"
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex justify-end gap-3 pt-2">
                                                <button
                                                    type="button"
                                                    onClick={() => setIsAddingNews(false)}
                                                    className="px-5 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.08] text-slate-300 text-xs font-semibold cursor-pointer"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    type="submit"
                                                    className="px-6 py-2.5 rounded-xl bg-brand-primary text-slate-950 text-xs font-bold hover:bg-brand-secondary transition-all cursor-pointer shadow-md"
                                                >
                                                    Publish Advisory
                                                </button>
                                            </div>
                                        </motion.form>
                                    )}

                                    {/* Filter categories */}
                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <div className="relative flex-1">
                                            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                            <input
                                                type="text"
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                placeholder="Search advisories..."
                                                className="w-full h-11 pl-11 pr-4 rounded-xl bg-slate-900/80 border border-white/10 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-brand-primary"
                                            />
                                        </div>

                                        <select
                                            value={filterCategory}
                                            onChange={(e) => setFilterCategory(e.target.value)}
                                            className="h-11 px-4 rounded-xl bg-slate-900 border border-white/10 text-white text-xs font-semibold focus:outline-none focus:border-brand-primary cursor-pointer"
                                        >
                                            <option value="All">All Categories</option>
                                            <option value="Company News">Company News</option>
                                            <option value="Global Directive">Global Directive</option>
                                            <option value="Regulatory Intel">Regulatory Intel</option>
                                            <option value="Network Status">Network Status</option>
                                        </select>
                                    </div>

                                    {/* News Grid */}
                                    {filteredNews.length === 0 ? (
                                        <div className="p-12 text-center rounded-2xl bg-white/[0.01] border border-dashed border-white/10 text-slate-400">
                                            <FiFileText className="text-4xl mx-auto mb-3 opacity-40" />
                                            <p className="text-sm font-semibold">No advisories found.</p>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 gap-4">
                                            {filteredNews.map((item) => (
                                                <div
                                                    key={item.id}
                                                    className="p-5 sm:p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/15 transition-all flex flex-col md:flex-row gap-6 items-start"
                                                >
                                                    {item.imageUrl && (
                                                        <div className="w-full md:w-48 h-32 rounded-xl overflow-hidden bg-slate-900 shrink-0 border border-white/5">
                                                            <img
                                                                src={item.imageUrl}
                                                                alt={item.title}
                                                                className="w-full h-full object-cover"
                                                                onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                                            />
                                                        </div>
                                                    )}

                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider bg-brand-primary/15 text-brand-secondary border border-brand-primary/20">
                                                                {item.type || 'Advisory'}
                                                            </span>
                                                            <span className="text-xs text-slate-500 flex items-center gap-1.5">
                                                                <FiClock size={12} /> {item.date}
                                                            </span>
                                                        </div>

                                                        <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                                                        <p className="text-xs sm:text-sm text-slate-400 line-clamp-2 leading-relaxed">
                                                            {item.summary}
                                                        </p>
                                                    </div>

                                                    <button
                                                        onClick={() => handleDelete('news', item.id)}
                                                        className="px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-semibold flex items-center gap-1.5 border border-rose-500/20 transition-colors shrink-0 cursor-pointer self-end md:self-center"
                                                    >
                                                        <FiTrash2 size={14} />
                                                        <span>Delete</span>
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* TESTIMONIALS TAB */}
                            {activeTab === 'testimonials' && (
                                <div className="space-y-8">
                                    {/* Create Form */}
                                    <form
                                        onSubmit={handleAddTestimonial}
                                        className="p-6 sm:p-8 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col gap-5"
                                    >
                                        <h3 className="text-base font-bold text-white">Add Client Endorsement</h3>

                                        <div>
                                            <label className="block text-xs font-semibold text-slate-300 mb-1">
                                                Testimonial / Feedback Quote
                                            </label>
                                            <textarea
                                                value={newTestimonial.text}
                                                onChange={(e) => setNewTestimonial({ ...newTestimonial, text: e.target.value })}
                                                required
                                                rows={3}
                                                placeholder="e.g. Sentron restructured our supply chain from Shanghai to Rotterdam, saving 18% in transit time..."
                                                className="w-full p-4 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-brand-primary"
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-semibold text-slate-300 mb-1">
                                                    Executive / Client Name
                                                </label>
                                                <input
                                                    type="text"
                                                    value={newTestimonial.author}
                                                    onChange={(e) => setNewTestimonial({ ...newTestimonial, author: e.target.value })}
                                                    required
                                                    placeholder="e.g., Jonathan Vance"
                                                    className="w-full h-11 px-4 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-brand-primary"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-xs font-semibold text-slate-300 mb-1">
                                                    Title & Enterprise
                                                </label>
                                                <input
                                                    type="text"
                                                    value={newTestimonial.role}
                                                    onChange={(e) => setNewTestimonial({ ...newTestimonial, role: e.target.value })}
                                                    required
                                                    placeholder="e.g., VP of Logistics, Atlas Global Tech"
                                                    className="w-full h-11 px-4 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-brand-primary"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                                            <StarPicker
                                                value={newTestimonial.rating}
                                                onChange={(val) => setNewTestimonial({ ...newTestimonial, rating: val })}
                                            />

                                            <button
                                                type="submit"
                                                className="px-6 py-3 rounded-xl bg-brand-primary text-slate-950 text-xs font-bold hover:bg-brand-secondary transition-all cursor-pointer shadow-md self-end sm:self-auto"
                                            >
                                                Publish Review
                                            </button>
                                        </div>
                                    </form>

                                    {/* Testimonials List */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {testimonials.map((t) => (
                                            <div
                                                key={t.id}
                                                className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all flex flex-col justify-between relative group"
                                            >
                                                <div>
                                                    <div className="flex items-center justify-between mb-3">
                                                        <GoldStars rating={t.rating ?? 5} size={16} />
                                                        <button
                                                            onClick={() => handleDelete('testimonials', t.id)}
                                                            className="text-slate-500 hover:text-rose-400 p-1 rounded-lg hover:bg-rose-500/10 transition-colors"
                                                            title="Delete review"
                                                        >
                                                            <FiTrash2 size={15} />
                                                        </button>
                                                    </div>
                                                    <p className="text-sm text-slate-300 italic mb-4 leading-relaxed">
                                                        "{t.text}"
                                                    </p>
                                                </div>

                                                <div className="pt-3 border-t border-white/5">
                                                    <p className="text-xs font-bold text-white">{t.author}</p>
                                                    <p className="text-[11px] text-slate-500">{t.role}</p>
                                                </div>
                                            </div>
                                        ))}

                                        {testimonials.length === 0 && (
                                            <div className="col-span-full p-12 text-center rounded-2xl bg-white/[0.01] border border-dashed border-white/10 text-slate-400">
                                                <FiStar className="text-4xl mx-auto mb-3 opacity-40" />
                                                <p className="text-sm font-semibold">No client testimonials published yet.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* STRATEGIC PARTNERS TAB */}
                            {activeTab === 'partners' && (
                                <div className="space-y-8">
                                    {/* Add Partner Form */}
                                    <form
                                        onSubmit={handleAddPartner}
                                        className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col sm:flex-row gap-4 items-end"
                                    >
                                        <div className="flex-1 w-full">
                                            <label className="block text-xs font-semibold text-slate-300 mb-1">
                                                Partner / Alliance Name
                                            </label>
                                            <input
                                                type="text"
                                                value={newPartner.name}
                                                onChange={(e) => setNewPartner({ ...newPartner, name: e.target.value })}
                                                required
                                                placeholder="e.g., Maersk Line, Emirates SkyCargo"
                                                className="w-full h-11 px-4 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-brand-primary"
                                            />
                                        </div>

                                        <div className="flex-1 w-full">
                                            <label className="block text-xs font-semibold text-slate-300 mb-1">
                                                Logo Image URL (Optional)
                                            </label>
                                            <input
                                                type="url"
                                                value={newPartner.logoUrl}
                                                onChange={(e) => setNewPartner({ ...newPartner, logoUrl: e.target.value })}
                                                placeholder="https://...logo.png"
                                                className="w-full h-11 px-4 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-brand-primary"
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            className="h-11 px-6 rounded-xl bg-brand-primary text-slate-950 text-xs font-bold hover:bg-brand-secondary transition-all cursor-pointer shadow-md shrink-0 w-full sm:w-auto"
                                        >
                                            Add Partner
                                        </button>
                                    </form>

                                    {/* Partner Cards Grid */}
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                        {partners.map((p) => (
                                            <div
                                                key={p.id}
                                                className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 flex flex-col items-center justify-between gap-3 text-center relative group transition-all"
                                            >
                                                <button
                                                    onClick={() => handleDelete('partners', p.id)}
                                                    className="absolute top-2.5 right-2.5 p-1 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    title="Delete partner"
                                                >
                                                    <FiTrash2 size={14} />
                                                </button>

                                                <div className="w-16 h-16 rounded-xl bg-white/[0.04] p-2 flex items-center justify-center border border-white/5">
                                                    {p.logoUrl ? (
                                                        <img
                                                            src={p.logoUrl}
                                                            alt={p.name}
                                                            className="max-h-full max-w-full object-contain filter grayscale group-hover:grayscale-0 transition-all"
                                                            onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                                        />
                                                    ) : (
                                                        <FiUsers className="text-2xl text-slate-500" />
                                                    )}
                                                </div>

                                                <p className="text-xs font-bold text-white truncate w-full" title={p.name}>
                                                    {p.name}
                                                </p>
                                            </div>
                                        ))}

                                        {partners.length === 0 && (
                                            <div className="col-span-full p-12 text-center rounded-2xl bg-white/[0.01] border border-dashed border-white/10 text-slate-400">
                                                <FiUsers className="text-4xl mx-auto mb-3 opacity-40" />
                                                <p className="text-sm font-semibold">No strategic partners added yet.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </main>
            </div>

            {/* INQUIRY DETAIL MODAL */}
            <AnimatePresence>
                {selectedInquiry && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
                        onClick={() => setSelectedInquiry(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 15 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: 15 }}
                            className="w-full max-w-2xl bg-[#0d1420] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl relative"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Close button */}
                            <button
                                onClick={() => setSelectedInquiry(null)}
                                className="absolute top-6 right-6 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                            >
                                <FiX size={18} />
                            </button>

                            {/* Header */}
                            <div className="mb-6">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-orange block mb-1">
                                    Logistics Rate Inquiry
                                </span>
                                <h3 className="text-2xl font-bold text-white">{selectedInquiry.name}</h3>
                                <div className="flex items-center gap-3 mt-2">
                                    <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase ${
                                        selectedInquiry.status === 'Completed'
                                            ? 'bg-emerald-500/15 text-emerald-300'
                                            : selectedInquiry.status === 'In Progress'
                                            ? 'bg-blue-500/15 text-blue-300'
                                            : 'bg-amber-500/15 text-amber-300'
                                    }`}>
                                        {selectedInquiry.status || 'New'}
                                    </span>
                                    <span className="text-xs text-slate-400 flex items-center gap-1.5">
                                        <FiCalendar size={13} /> {selectedInquiry.date}
                                    </span>
                                </div>
                            </div>

                            {/* Contact Details */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5">
                                    <span className="text-[11px] font-semibold text-slate-400 block mb-0.5">Contact Email</span>
                                    <a
                                        href={`mailto:${selectedInquiry.email}`}
                                        className="text-xs sm:text-sm font-semibold text-brand-primary hover:underline flex items-center gap-1.5"
                                    >
                                        <FiMail size={13} /> {selectedInquiry.email}
                                    </a>
                                </div>
                                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5">
                                    <span className="text-[11px] font-semibold text-slate-400 block mb-0.5">Phone Number</span>
                                    {selectedInquiry.phone ? (
                                        <a
                                            href={`tel:${selectedInquiry.phone}`}
                                            className="text-xs sm:text-sm font-semibold text-white hover:underline flex items-center gap-1.5"
                                        >
                                            <FiPhone size={13} /> {selectedInquiry.phone}
                                        </a>
                                    ) : (
                                        <span className="text-xs text-slate-500">Not provided</span>
                                    )}
                                </div>
                            </div>

                            {/* Message body */}
                            <div className="mb-6">
                                <span className="text-[11px] font-semibold text-slate-400 block mb-1.5">Inquiry Message / Request Scope</span>
                                <div className="p-4 rounded-xl bg-slate-950/80 border border-white/5 max-h-60 overflow-y-auto">
                                    <p className="text-xs sm:text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">
                                        {selectedInquiry.message}
                                    </p>
                                </div>
                            </div>

                            {/* Action footer */}
                            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/10">
                                <button
                                    onClick={() => {
                                        handleDelete('queries', selectedInquiry.id);
                                        setSelectedInquiry(null);
                                    }}
                                    className="px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-semibold flex items-center gap-1.5 border border-rose-500/20 transition-colors cursor-pointer"
                                >
                                    <FiTrash2 size={14} />
                                    <span>Delete Record</span>
                                </button>

                                <div className="flex items-center gap-2">
                                    {selectedInquiry.status !== 'In Progress' && (
                                        <button
                                            onClick={() => handleUpdateStatus('queries', selectedInquiry.id, 'In Progress')}
                                            className="px-4 py-2.5 rounded-xl bg-blue-500/15 hover:bg-blue-500/25 text-blue-300 text-xs font-semibold flex items-center gap-1.5 border border-blue-500/30 transition-colors cursor-pointer"
                                        >
                                            <span>Mark In Progress</span>
                                        </button>
                                    )}

                                    {selectedInquiry.status !== 'Completed' ? (
                                        <button
                                            onClick={() => handleUpdateStatus('queries', selectedInquiry.id, 'Completed')}
                                            className="px-5 py-2.5 rounded-xl bg-emerald-500 text-slate-950 text-xs font-bold hover:bg-emerald-400 transition-colors flex items-center gap-1.5 cursor-pointer shadow-md"
                                        >
                                            <FiCheck size={14} />
                                            <span>Mark as Resolved</span>
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleUpdateStatus('queries', selectedInquiry.id, 'New')}
                                            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
                                        >
                                            <span>Reset to New</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Admin;
