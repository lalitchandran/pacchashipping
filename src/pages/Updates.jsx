import React, { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { FiClock, FiFileText, FiSearch, FiX, FiArrowRight, FiAlertTriangle, FiTrendingUp, FiGlobe, FiPackage } from 'react-icons/fi';
import { db } from '../firebase/config';
import { ref, onValue } from 'firebase/database';

const TYPE_META = {
    'Company News': { icon: <FiGlobe />, color: 'text-brand-highlight', bg: 'bg-brand-highlight/10', border: 'border-brand-highlight/25' },
    'Trade Advisory': { icon: <FiAlertTriangle />, color: 'text-brand-orange', bg: 'bg-brand-orange/10', border: 'border-brand-orange/25' },
    'Market Update': { icon: <FiTrendingUp />, color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/25' },
    'Shipping Alert': { icon: <FiPackage />, color: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/25' },
    'Announcement': { icon: <FiFileText />, color: 'text-brand-highlight', bg: 'bg-brand-highlight/10', border: 'border-brand-highlight/25' },
};
const getType = (type) => TYPE_META[type] || TYPE_META['Announcement'];

const FILTERS = ['All', 'Company News', 'Trade Advisory', 'Market Update', 'Shipping Alert', 'Announcement'];

const DEFAULT_NEWS = [
    {
        id: 'advisory-01',
        type: 'Trade Advisory',
        title: 'New European Union Import Control System (ICS2) Release 3 Compliance Guide',
        summary: 'All maritime and inland freight entering the EU now requires pre-loading advance cargo information. Sentron Global Logistics has completed full electronic gateway integration to ensure zero customs dwell times for our exporter partners.',
        date: 'Recent',
        createdAt: Date.now() - 86400000 * 2,
    },
    {
        id: 'advisory-02',
        type: 'Market Update',
        title: 'Q4 Global Container Freight Index & Capacity Outlook',
        summary: 'Spot ocean container rates on Asia-Europe and Trans-Pacific trade lanes stabilize with expanded vessel allocations. Sentron secures dedicated capacity contracts to protect client landed costs.',
        date: 'Recent',
        createdAt: Date.now() - 86400000 * 5,
    },
    {
        id: 'advisory-03',
        type: 'Company News',
        title: 'Sentron Global Logistics Expands Reefer Cold-Chain Corridors to Gulf Ports',
        summary: 'To support pharmaceutical and perishables trade, Sentron has inaugurated active temperature-monitored consolidation routes connecting Chennai and JNPT directly to Jebel Ali and Dammam.',
        date: 'Recent',
        createdAt: Date.now() - 86400000 * 8,
    }
];

const Updates = () => {
    const [news, setNews] = useState(DEFAULT_NEWS);
    const [loading, setLoading] = useState(true);
    const [expandedId, setExpandedId] = useState(null);
    const [activeFilter, setActiveFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [featured, setFeatured] = useState(DEFAULT_NEWS[0]);

    useEffect(() => {
        const newsRef = ref(db, 'news');
        const unsubscribe = onValue(newsRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                const newsData = Object.keys(data).map(key => ({
                    id: key,
                    ...data[key],
                    date: data[key].createdAt
                        ? new Date(data[key].createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                        : 'Recent'
                }));
                newsData.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
                setNews(newsData.length > 0 ? newsData : DEFAULT_NEWS);
                if (newsData.length > 0) setFeatured(newsData[0]);
            } else {
                setNews(DEFAULT_NEWS);
                setFeatured(DEFAULT_NEWS[0]);
            }
            setLoading(false);
        }, (error) => {
            console.error('Error fetching news:', error);
            setNews(DEFAULT_NEWS);
            setFeatured(DEFAULT_NEWS[0]);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const filtered = useMemo(() => {
        let list = news.slice(1);
        if (activeFilter !== 'All') list = list.filter(n => n.type === activeFilter);
        if (searchQuery.trim()) list = list.filter(n =>
            n.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            n.summary?.toLowerCase().includes(searchQuery.toLowerCase())
        );
        return list;
    }, [news, activeFilter, searchQuery]);

    const revealVariants = {
        hidden: { opacity: 0, y: 30, scale: 0.98 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
    };

    return (
        <div className="w-full min-h-screen pt-24 pb-20 px-4 md:px-6 bg-[#061325] overflow-hidden relative">
            <Helmet>
                <title>Trade Intelligence & Global Shipping Updates | Sentron Global Logistics</title>
                <meta name="description" content="Stay informed with regulatory advisories, global freight index trends, customs developments, and company milestones from Sentron Global Logistics." />
                <meta name="keywords" content="logistics news, shipping advisories, trade updates, freight rate trends, Sentron Global Logistics" />
                <link rel="canonical" href="https://sentronglobal.com/updates" />
            </Helmet>

            {/* Background */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
                <div className="absolute top-[20%] left-[10%] w-[40vw] h-[40vw] rounded-full bg-brand-accent/15 blur-[100px] opacity-60"></div>
                <div className="absolute bottom-[20%] right-[10%] w-[35vw] h-[35vw] rounded-full bg-brand-orange/10 blur-[80px] opacity-40"></div>
            </div>

            <div className="hallmark-container relative z-10">
                {/* Header */}
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={revealVariants} className="mb-12 max-w-2xl">
                    <span className="text-sm font-semibold text-brand-orange mb-2 block">Industry advisories</span>
                    <h1 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tight leading-tight">
                        Trade and shipping intelligence.
                    </h1>
                    <p className="text-gray-300 text-base md:text-lg font-normal leading-relaxed">
                        Carrier schedule analyses, customs regulatory changes, and lane advisories curated by Sentron logistics specialists.
                    </p>
                </motion.div>

                {/* Featured / Hero Article */}
                {featured && (
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={revealVariants} className="mb-14">
                        <div
                            onClick={() => setExpandedId(expandedId === featured.id ? null : featured.id)}
                            className="glass-panel-dark rounded-[2.5rem] border border-brand-accent/25 overflow-hidden cursor-pointer group shadow-2xl transition-all duration-300"
                        >
                            <div className="h-1.5 w-full bg-gradient-to-r from-brand-orange via-brand-highlight to-brand-accent"></div>
                            <div className="p-8 md:p-12 flex flex-col justify-between flex-1">
                                <div>
                                    <div className="flex flex-wrap items-center gap-3 mb-5">
                                        <span className={`flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border ${getType(featured.type).bg} ${getType(featured.type).color} ${getType(featured.type).border}`}>
                                            {getType(featured.type).icon} {featured.type || 'Announcement'}
                                        </span>
                                        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5"><FiClock size={11} /> {featured.date}</span>
                                        <span className="text-[11px] font-bold uppercase tracking-wider text-brand-orange bg-brand-orange/15 px-2.5 py-1 rounded border border-brand-orange/30">Priority Advisory</span>
                                    </div>
                                    <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight leading-tight mb-4 group-hover:text-brand-highlight transition-colors">{featured.title}</h2>
                                    <p className="text-gray-300 text-base leading-relaxed">{featured.summary}</p>
                                </div>
                                <div className="mt-6 flex items-center gap-2 text-brand-orange text-sm font-bold group-hover:gap-3 transition-all duration-300">
                                    <span>Read Full Briefing</span> <FiArrowRight />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Search + Filter Bar */}
                <div className="flex flex-col md:flex-row gap-4 mb-10">
                    <div className="flex-1 relative">
                        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            placeholder="Search advisories and announcements..."
                            className="w-full pl-11 pr-10 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white font-medium text-sm focus:border-brand-highlight outline-none"
                        />
                        {searchQuery && (
                            <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors">
                                <FiX size={14} />
                            </button>
                        )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {FILTERS.map(f => (
                            <button
                                key={f}
                                onClick={() => setActiveFilter(f)}
                                className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-200 border ${activeFilter === f
                                        ? 'bg-brand-orange text-white border-brand-orange shadow-neon-orange'
                                        : 'bg-white/5 text-gray-300 border-white/10 hover:border-white/20 hover:text-white'
                                    }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                {/* News Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filtered.map((item, idx) => {
                        const meta = getType(item.type);
                        const isExpanded = expandedId === item.id;
                        return (
                            <motion.div
                                key={item.id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.4, delay: idx * 0.05 }}
                                onClick={() => setExpandedId(isExpanded ? null : item.id)}
                                className="glass-panel-dark rounded-3xl border border-brand-accent/20 overflow-hidden cursor-pointer group hover:border-brand-highlight/40 transition-all duration-300 flex flex-col p-6"
                            >
                                <div className="flex items-center gap-2 mb-4 flex-wrap">
                                    <span className={`flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border ${meta.bg} ${meta.color} ${meta.border}`}>
                                        {meta.icon} {item.type || 'Announcement'}
                                    </span>
                                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wide flex items-center gap-1"><FiClock size={10} /> {item.date}</span>
                                </div>

                                <h3 className="text-base font-bold text-white tracking-tight leading-snug mb-3 group-hover:text-brand-highlight transition-colors">{item.title}</h3>
                                <p className="text-gray-300 text-xs leading-relaxed flex-1">{item.summary}</p>

                                <div className={`mt-5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest ${meta.color}`}>
                                    <span>Learn Details</span> <FiArrowRight />
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Updates;
