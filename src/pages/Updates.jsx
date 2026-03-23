import React, { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { FiClock, FiFileText, FiSearch, FiX, FiArrowRight, FiAlertTriangle, FiTrendingUp, FiGlobe, FiPackage } from 'react-icons/fi';
import { db } from '../firebase/config';
import { ref, onValue } from 'firebase/database';

const TYPE_META = {
    'Company News': { icon: <FiGlobe />, color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/20' },
    'Trade Advisory': { icon: <FiAlertTriangle />, color: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/20' },
    'Market Update': { icon: <FiTrendingUp />, color: 'text-brand-secondary', bg: 'bg-brand-primary/10', border: 'border-brand-primary/20' },
    'Shipping Alert': { icon: <FiPackage />, color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/20' },
    'Announcement': { icon: <FiFileText />, color: 'text-brand-secondary', bg: 'bg-brand-primary/10', border: 'border-brand-primary/20' },
};
const getType = (type) => TYPE_META[type] || TYPE_META['Announcement'];

const FILTERS = ['All', 'Company News', 'Trade Advisory', 'Market Update', 'Shipping Alert', 'Announcement'];

const Updates = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedId, setExpandedId] = useState(null);
    const [activeFilter, setActiveFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [featured, setFeatured] = useState(null);

    useEffect(() => {
        const newsRef = ref(db, 'news');
        const unsubscribe = onValue(newsRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                const newsData = Object.keys(data).map(key => ({
                    id: key,
                    ...data[key],
                    date: data[key].createdAt
                        ? new Date(data[key].createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })
                        : 'Recent'
                }));
                newsData.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
                setNews(newsData);
                if (newsData.length > 0) setFeatured(newsData[0]);
            } else {
                setNews([]);
            }
            setLoading(false);
        }, (error) => {
            console.error('Error fetching news:', error);
            setNews([]);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const filtered = useMemo(() => {
        let list = news.slice(1); // exclude featured (first item)
        if (activeFilter !== 'All') list = list.filter(n => n.type === activeFilter);
        if (searchQuery.trim()) list = list.filter(n =>
            n.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            n.summary?.toLowerCase().includes(searchQuery.toLowerCase())
        );
        return list;
    }, [news, activeFilter, searchQuery]);

    const revealVariants = {
        hidden: { opacity: 0, y: 40, scale: 0.98 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
    };

    return (
        <div className="w-full min-h-screen pt-24 pb-20 px-4 md:px-6 bg-background overflow-hidden relative">
            <Helmet>
                <title>Trade &amp; Shipping Updates | Latest Logistics News Paccha Shipping</title>
                <meta name="description" content="Stay updated with the latest trends in international trade, freight rates, and customs regulations. Announcements from Paccha Universal Shipping Line." />
                <meta name="keywords" content="logistics news India, shipping updates Chennai, trade announcements, freight rate trends" />
                <link rel="canonical" href="https://pacchashipping.in/updates" />
            </Helmet>

            {/* Background */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
                <div className="absolute top-[20%] left-[10%] w-[40vw] h-[40vw] rounded-full bg-brand-primary/10 blur-[100px] opacity-60"></div>
                <div className="absolute bottom-[20%] right-[10%] w-[35vw] h-[35vw] rounded-full bg-brand-secondary/10 blur-[80px] opacity-40"></div>
            </div>

            <div className="max-w-6xl mx-auto relative z-10">
                {/* Header */}
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={revealVariants} className="mb-14 text-center">
                    <span className="text-brand-highlight tracking-widest uppercase text-xs md:text-sm font-bold mb-3 block">News &amp; Announcements</span>
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-foreground mb-4 tracking-tight leading-tight">
                        Trade &amp; Shipping<br className="hidden md:block" /> Intelligence.
                    </h1>
                    <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed">
                        Freight rate trends, customs advisories, and company announcements — everything you need to ship smarter.
                    </p>
                </motion.div>

                {loading ? (
                    <div className="flex justify-center py-32">
                        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} className="w-10 h-10 border-4 border-muted border-t-brand-primary rounded-full" />
                    </div>
                ) : news.length === 0 ? (
                    <div className="text-center py-32">
                        <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center text-4xl text-gray-500 mx-auto mb-6"><FiFileText /></div>
                        <h3 className="text-2xl font-bold text-white mb-3">No Updates Yet</h3>
                        <p className="text-gray-500 text-lg">Check back soon for the latest trade news, shipping advisories, and company announcements.</p>
                    </div>
                ) : (
                    <>
                        {/* Featured / Hero Article */}
                        {featured && (
                            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={revealVariants} className="mb-14">
                                <div
                                    onClick={() => setExpandedId(expandedId === featured.id ? null : featured.id)}
                                    className="glass-panel rounded-[2.5rem] border border-white/5 overflow-hidden cursor-pointer group shadow-[0_12px_40px_rgba(0,0,0,0.5)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.7)] transition-shadow duration-500"
                                >
                                    {/* Top accent bar */}
                                    <div className={`h-1 w-full bg-gradient-to-r from-transparent ${getType(featured.type).color.replace('text-', 'via-')} to-transparent`}></div>
                                    <div className="flex flex-col md:flex-row">
                                        {featured.imageUrl && (
                                            <div className="md:w-2/5 h-56 md:h-auto overflow-hidden shrink-0">
                                                <img src={featured.imageUrl} alt={featured.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                            </div>
                                        )}
                                        <div className="p-8 md:p-12 flex flex-col justify-between flex-1">
                                            <div>
                                                <div className="flex flex-wrap items-center gap-3 mb-5">
                                                    <span className={`flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border ${getType(featured.type).bg} ${getType(featured.type).color} ${getType(featured.type).border}`}>
                                                        {getType(featured.type).icon} {featured.type || 'Announcement'}
                                                    </span>
                                                    <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5"><FiClock size={11} /> {featured.date}</span>
                                                    <span className="text-[11px] font-black uppercase tracking-wider text-brand-secondary bg-brand-primary/10 px-2 py-1 rounded border border-brand-primary/20">Featured</span>
                                                </div>
                                                <h2 className="text-2xl md:text-4xl font-black text-white tracking-tight leading-tight mb-4 group-hover:text-brand-secondary transition-colors">{featured.title}</h2>
                                                <AnimatePresence initial={false}>
                                                    <motion.div
                                                        initial={false}
                                                        animate={{ height: expandedId === featured.id ? 'auto' : '72px' }}
                                                        className="overflow-hidden relative"
                                                    >
                                                        <p className="text-muted-foreground text-base leading-relaxed">{featured.summary}</p>
                                                        {expandedId !== featured.id && (
                                                            <div className="absolute bottom-0 left-0 w-full h-10 bg-gradient-to-t from-[var(--color-background)] to-transparent"></div>
                                                        )}
                                                    </motion.div>
                                                </AnimatePresence>
                                            </div>
                                            <div className="mt-6 flex items-center gap-2 text-brand-secondary text-sm font-bold group-hover:gap-4 transition-all duration-300">
                                                {expandedId === featured.id ? 'Collapse' : 'Read Full Update'} <FiArrowRight className={`transition-transform duration-300 ${expandedId === featured.id ? 'rotate-90' : ''}`} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Search + Filter Bar */}
                        {news.length > 1 && (
                            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={revealVariants} className="flex flex-col md:flex-row gap-4 mb-10">
                                {/* Search */}
                                <div className="flex-1 relative">
                                    <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                                    <input
                                        value={searchQuery}
                                        onChange={e => setSearchQuery(e.target.value)}
                                        placeholder="Search updates..."
                                        className="w-full pl-11 pr-10 py-3.5 rounded-2xl glass-input text-white font-medium text-sm"
                                    />
                                    {searchQuery && (
                                        <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors">
                                            <FiX size={14} />
                                        </button>
                                    )}
                                </div>
                                {/* Filter pills */}
                                <div className="flex flex-wrap gap-2">
                                    {FILTERS.map(f => (
                                        <button
                                            key={f}
                                            onClick={() => setActiveFilter(f)}
                                            className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-200 border ${activeFilter === f
                                                    ? 'bg-brand-primary/20 text-brand-secondary border-brand-primary/40 scale-105'
                                                    : 'glass-panel text-gray-400 border-white/5 hover:border-white/10 hover:text-white'
                                                }`}
                                        >
                                            {f}
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* News Grid */}
                        <AnimatePresence mode="popLayout">
                            {filtered.length === 0 && searchQuery ? (
                                <motion.div key="no-results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                    className="text-center py-20 col-span-2">
                                    <p className="text-gray-500 text-lg">No updates match "<span className="text-white font-bold">{searchQuery}</span>"</p>
                                    <button onClick={() => setSearchQuery('')} className="mt-4 text-brand-secondary text-sm font-bold hover:underline">Clear search</button>
                                </motion.div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {filtered.map((item, idx) => {
                                        const meta = getType(item.type);
                                        const isExpanded = expandedId === item.id;
                                        return (
                                            <motion.div
                                                key={item.id}
                                                layout
                                                initial={{ opacity: 0, y: 30 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, scale: 0.95 }}
                                                transition={{ duration: 0.5, delay: idx * 0.07, ease: [0.16, 1, 0.3, 1] }}
                                                onClick={() => setExpandedId(isExpanded ? null : item.id)}
                                                className="glass-panel rounded-3xl border border-white/5 overflow-hidden cursor-pointer group hover:border-white/10 hover:shadow-[0_12px_40px_rgba(0,0,0,0.5)] transition-all duration-300 flex flex-col"
                                            >
                                                {/* Color top bar */}
                                                <div className={`h-0.5 w-full ${meta.bg}`}></div>

                                                {/* Image */}
                                                {item.imageUrl && (
                                                    <div className="w-full h-44 overflow-hidden shrink-0">
                                                        <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                                    </div>
                                                )}

                                                <div className="p-6 flex flex-col flex-1">
                                                    {/* Meta row */}
                                                    <div className="flex items-center gap-2 mb-4 flex-wrap">
                                                        <span className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${meta.bg} ${meta.color} ${meta.border}`}>
                                                            {meta.icon} {item.type || 'Announcement'}
                                                        </span>
                                                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wide flex items-center gap-1"><FiClock size={10} /> {item.date}</span>
                                                    </div>

                                                    {/* Title */}
                                                    <h3 className="text-lg font-black text-white tracking-tight leading-snug mb-3 group-hover:text-brand-secondary transition-colors">{item.title}</h3>

                                                    {/* Summary */}
                                                    <motion.div initial={false} animate={{ height: isExpanded ? 'auto' : '60px' }} className="relative overflow-hidden flex-1">
                                                        <p className="text-muted-foreground text-sm leading-relaxed">{item.summary}</p>
                                                        {!isExpanded && (
                                                            <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-[var(--color-background)] to-transparent"></div>
                                                        )}
                                                    </motion.div>

                                                    {/* CTA */}
                                                    <div className={`mt-5 flex items-center gap-2 text-xs font-bold uppercase tracking-widest transition-all duration-300 ${meta.color}`}>
                                                        {isExpanded ? 'Collapse' : 'Read More'} <FiArrowRight className={`transition-transform duration-200 ${isExpanded ? 'rotate-90' : 'group-hover:translate-x-1'}`} />
                                                    </div>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            )}
                        </AnimatePresence>
                    </>
                )}
            </div>
        </div>
    );
};

export default Updates;
