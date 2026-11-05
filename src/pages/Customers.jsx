import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiChevronRight, FiStar } from 'react-icons/fi';
import { db } from '../firebase/config';
import { ref, onValue } from 'firebase/database';

const DEFAULT_TESTIMONIALS = [
    {
        author: 'Marcus Vance',
        role: 'Global Supply Chain Director, AutoTech Dynamics',
        text: 'Sentron Global Logistics transformed our trans-Pacific component routing. Their pre-arrival customs clearance reduced our port dwell times by 42% across Chennai and Rotterdam terminals.',
        rating: 5
    },
    {
        author: 'Dr. Priya Sundaram',
        role: 'Head of International Logistics, Apex BioPharma',
        text: 'The temperature-controlled cold chain reliability Sentron provides for our sensitive pharmaceutical air cargo has been flawless. 24/7 human dispatch with zero blind spots.',
        rating: 5
    },
    {
        author: 'Henrik Lindqvist',
        role: 'Procurement Vice President, NordKraft Industrial',
        text: 'Reliability that moves the world is not just their tagline—it is how their team operates. We booked over 800 TEUs with Sentron this year with 99.4% on-time vessel delivery.',
        rating: 5
    }
];

// Renders gold half/full stars for a given 0-5 rating
const GoldStars = ({ rating = 5, size = 22 }) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
        const fill = Math.min(Math.max(rating - (i - 1), 0), 1);
        stars.push(
            <span key={i} style={{ position: 'relative', display: 'inline-block', width: size + 2, height: size + 2, flexShrink: 0 }}>
                <FiStar size={size} style={{ color: '#92400e' }} />
                <span style={{ position: 'absolute', top: 0, left: 0, width: fill === 0 ? 0 : fill >= 1 ? '100%' : '50%', overflow: 'hidden', display: 'block', height: '100%' }}>
                    <FiStar size={size} style={{ color: '#F37021', fill: '#F37021', flexShrink: 0 }} />
                </span>
            </span>
        );
    }
    return <span style={{ display: 'inline-flex', gap: 3, alignItems: 'center', lineHeight: 1 }}>{stars}</span>;
};

const Customers = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [partners, setPartners] = useState([]);
    const [testimonials, setTestimonials] = useState(DEFAULT_TESTIMONIALS);
    const [loading, setLoading] = useState(true);
    const [direction, setDirection] = useState(1);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        if (testimonials.length <= 1 || isPaused) return;
        const timer = setInterval(() => {
            setDirection(1);
            setCurrentIndex(prev => (prev + 1) % testimonials.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [testimonials.length, isPaused, currentIndex]);

    const dragStart = useRef(null);

    useEffect(() => {
        let loaded = 0;
        const checkDone = () => { loaded++; if (loaded >= 2) setLoading(false); };

        const unsubPartners = onValue(ref(db, 'partners'), (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                let arr = Object.keys(data).map(key => ({ id: key, ...data[key] }));
                arr.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
                setPartners(arr);
            } else { setPartners([]); }
            checkDone();
        }, (err) => { console.error(err); checkDone(); });

        const unsubTestimonials = onValue(ref(db, 'testimonials'), (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                let arr = Object.keys(data).map(key => ({
                    id: key,
                    ...data[key],
                    rating: typeof data[key].rating === 'number' ? data[key].rating : 5
                }));
                arr.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
                setTestimonials(arr.length > 0 ? arr : DEFAULT_TESTIMONIALS);
            } else { 
                setTestimonials(DEFAULT_TESTIMONIALS); 
            }
            checkDone();
        }, (err) => { console.error(err); checkDone(); });

        return () => { unsubPartners(); unsubTestimonials(); };
    }, []);

    const goNext = () => {
        if (testimonials.length > 0) {
            setDirection(1);
            setCurrentIndex(prev => (prev + 1) % testimonials.length);
        }
    };
    const goPrev = () => {
        if (testimonials.length > 0) {
            setDirection(-1);
            setCurrentIndex(prev => (prev - 1 + testimonials.length) % testimonials.length);
        }
    };

    const handlePointerDown = (e) => { dragStart.current = e.clientX; };
    const handlePointerUp = (e) => {
        if (dragStart.current === null) return;
        const delta = dragStart.current - e.clientX;
        if (Math.abs(delta) > 50) { delta > 0 ? goNext() : goPrev(); }
        dragStart.current = null;
    };

    const revealVariants = {
        hidden: { opacity: 0, y: 30, scale: 0.98 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
    };

    const slideVariants = {
        enter: (dir) => ({ opacity: 0, x: dir > 0 ? 80 : -80 }),
        center: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
        exit: (dir) => ({ opacity: 0, x: dir > 0 ? -80 : 80, transition: { duration: 0.45, ease: [0.7, 0, 0.84, 0] } }),
    };

    const t = testimonials[currentIndex] || DEFAULT_TESTIMONIALS[0];
    const initials = t?.author ? t.author.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() : 'SG';

    return (
        <div className="w-full min-h-screen pt-24 md:pt-32 pb-12 md:pb-20 overflow-hidden relative bg-[#061325]">
            <Helmet>
                <title>Client Case Studies & Partners | Sentron Global Logistics</title>
                <meta name="description" content="Discover why global exporters and importers trust Sentron Global Logistics for precision supply chain orchestration, ocean freight, and air cargo solutions." />
                <meta name="keywords" content="logistics testimonials, trusted shipping forwarder, Sentron Global Logistics clients" />
                <link rel="canonical" href="https://sentronglobal.com/customers" />
            </Helmet>

            {/* Background */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
                <div className="absolute top-[20%] right-[10%] w-[40vw] h-[40vw] rounded-full bg-brand-accent/15 blur-[100px] opacity-60"></div>
                <div className="absolute bottom-[20%] left-[10%] w-[35vw] h-[35vw] rounded-full bg-brand-orange/10 blur-[80px] opacity-40"></div>
            </div>

            {/* Hero */}
            <motion.div
                initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}
                variants={revealVariants}
                className="hallmark-container mb-16 relative z-10"
            >
                <span className="text-sm font-semibold text-brand-orange mb-2 block">Client experiences</span>
                <h1 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tight leading-tight">
                    Trusted by global shippers.
                </h1>
                <p className="max-w-2xl text-gray-300 text-base md:text-lg font-normal leading-relaxed">
                    Multinational enterprises and industrial exporters rely on Sentron Global Logistics to execute international trade corridors without disruption.
                </p>
            </motion.div>

            {/* Market Validation Carousel */}
            <motion.div
                initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }}
                variants={revealVariants}
                className="max-w-4xl mx-auto px-6 relative z-10 mb-16"
            >
                <div className="text-center mb-10">
                    <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-brand-orange mb-2 block">Enterprise Testimonials</span>
                    <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">Verified Client Feedback</h2>
                </div>

                <div
                    className="relative select-none cursor-grab active:cursor-grabbing"
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                    onPointerDown={handlePointerDown}
                    onPointerUp={handlePointerUp}
                    onPointerLeave={(e) => { if (dragStart.current !== null) handlePointerUp(e); }}
                >
                    <div className="glass-panel-dark rounded-[2.5rem] border border-brand-accent/25 overflow-hidden shadow-2xl">
                        <div className="h-1.5 w-full bg-gradient-to-r from-brand-accent via-brand-orange to-brand-highlight"></div>

                        <div className="p-8 md:p-14">
                            <AnimatePresence mode="wait" custom={direction}>
                                <motion.div
                                    key={currentIndex}
                                    custom={direction}
                                    variants={slideVariants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    className="flex flex-col items-center text-center"
                                >
                                    <div className="mb-6">
                                        <GoldStars rating={t?.rating ?? 5} size={24} />
                                    </div>

                                    <p className="text-xl md:text-2xl font-medium text-white leading-relaxed mb-8 max-w-2xl font-sans">
                                        "{t?.text}"
                                    </p>

                                    <div className="flex flex-col items-center gap-2">
                                        <div className="w-12 h-12 rounded-full bg-brand-accent/25 border border-brand-highlight/30 flex items-center justify-center text-brand-orange font-black text-sm">
                                            {initials}
                                        </div>
                                        <div>
                                            <p className="font-bold text-white text-base tracking-tight">{t?.author}</p>
                                            <p className="text-xs text-gray-400 font-semibold mt-0.5">{t?.role}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-6 mt-8">
                    <button
                        onClick={goPrev}
                        className="w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:border-brand-orange hover:text-brand-orange transition-all duration-200"
                        aria-label="Previous testimonial"
                    >
                        <FiChevronLeft size={20} />
                    </button>

                    <div className="flex items-center gap-2">
                        {testimonials.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => { setDirection(i > currentIndex ? 1 : -1); setCurrentIndex(i); }}
                                className={`rounded-full transition-all duration-300 ${i === currentIndex ? 'w-6 h-2 bg-brand-orange' : 'w-2 h-2 bg-white/20 hover:bg-white/40'}`}
                                aria-label={`Go to slide ${i + 1}`}
                            />
                        ))}
                    </div>

                    <button
                        onClick={goNext}
                        className="w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:border-brand-orange hover:text-brand-orange transition-all duration-200"
                        aria-label="Next testimonial"
                    >
                        <FiChevronRight size={20} />
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default Customers;
