import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
    FiArrowRight, 
    FiGlobe, 
    FiTruck, 
    FiAnchor, 
    FiPackage, 
    FiPhoneCall,
    FiCheck
} from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import QuickQuoteDrawer from '../components/QuickQuoteDrawer';

gsap.registerPlugin(ScrollTrigger);

const StatItem = ({ end, label, suffix = '+', prefix = '' }) => {
    const nodeRef = useRef();

    useEffect(() => {
        let obj = { val: 0 };
        const tl = gsap.to(obj, {
            val: end,
            duration: 1.8,
            ease: "power2.out",
            scrollTrigger: {
                trigger: nodeRef.current,
                start: "top 85%",
                toggleActions: "play none none reverse"
            },
            onUpdate: () => {
                if (nodeRef.current) {
                    nodeRef.current.innerHTML = prefix + Math.floor(obj.val) + suffix;
                }
            }
        });
        return () => tl.kill();
    }, [end, suffix, prefix]);

    return (
        <article className="hallmark-surface p-5 sm:p-6 md:p-8 flex flex-col items-start justify-center">
            <span ref={nodeRef} className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-1.5 tracking-tight">
                {prefix}0{suffix}
            </span>
            <p className="text-xs sm:text-sm text-gray-400 font-normal leading-snug">
                {label}
            </p>
        </article>
    );
};

const SERVICE_CARDS = [
    {
        title: "Ocean and sea freight",
        scope: "FCL and consolidated LCL cargo",
        description: "Scheduled maritime container transport connecting major international ports with committed vessel space, direct bill of lading issuance, and pre-arrival clearance.",
        image: "/sentron_ocean_freight.png",
        route: "/services/ocean",
        icon: FiAnchor
    },
    {
        title: "Air cargo express",
        scope: "Time-critical and priority flight corridors",
        description: "Expedited international air freight for high-value and temperature-controlled shipments. Direct airport handling, cold-chain monitoring, and swift customs release.",
        image: "/sentron_air_freight.png",
        route: "/services/air",
        icon: FiGlobe
    },
    {
        title: "Intermodal road haulage",
        scope: "Terminal drayage and factory distribution",
        description: "Container transport, GPS-monitored fleet movements, and overland drayage coordinating port gates with regional factories and logistics distribution hubs.",
        image: "/sentron_road_freight.png",
        route: "/services/road",
        icon: FiTruck
    },
    {
        title: "Smart warehousing",
        scope: "3PL storage and regional distribution",
        description: "Strategically positioned bonded and general warehousing facilities with inventory management, palletization, kitting, and rapid cross-docking.",
        image: "/sentron_warehouse.png",
        route: "/services/warehousing",
        icon: FiPackage
    }
];

const Home = () => {
    const { scrollYProgress } = useScroll();
    const yHeroText = useTransform(scrollYProgress, [0, 0.4], [0, 80]);
    const opacityHero = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
    const [isQuoteOpen, setIsQuoteOpen] = useState(false);

    return (
        <main className="w-full relative min-h-screen bg-[#061325]">
            <Helmet>
                <title>Sentron Global Logistics | Reliability That Moves The World</title>
                <meta 
                    name="description" 
                    content="Sentron Global Logistics (SGL) connects global commerce with precision Ocean Freight, Air Cargo Express, Customs Brokerage, and Multimodal Supply Chains across 65+ countries." 
                />
                <meta 
                    name="keywords" 
                    content="Sentron Global Logistics, SGL, global freight forwarder, ocean freight FCL LCL, air cargo express, customs clearance broker, container shipping India, supply chain solutions, Chennai freight forwarder" 
                />
                <link rel="canonical" href="https://sentronglobal.com/" />
                <link rel="alternate" type="text/plain" href="/llms.txt" title="LLM Agent Manifest" />

                <meta name="geo.region" content="IN-TN" />
                <meta name="geo.placename" content="Chennai, Tamil Nadu, India" />
                <meta name="geo.position" content="13.1277;80.2124" />
                <meta name="ICBM" content="13.1277, 80.2124" />

                <meta property="og:title" content="Sentron Global Logistics | Reliability That Moves The World" />
                <meta property="og:description" content="Precision freight forwarding, maritime shipping, and express air cargo connecting global supply chains across 65+ countries." />
                <meta property="og:url" content="https://sentronglobal.com/" />
                <meta property="og:image" content="/sentron_logo.png" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:image" content="/sentron_logo.png" />

                <script type="application/ld+json">
                    {`
                {
                    "@context": "https://schema.org",
                    "@type": "FAQPage",
                    "mainEntity": [
                        {
                            "@type": "Question",
                            "name": "What freight forwarding services does Sentron Global Logistics offer?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "Sentron Global Logistics (SGL) provides full-scope global freight services including Ocean Freight (FCL and LCL), Priority Air Cargo, Intermodal Road & Rail Haulage, Licensed Customs Brokerage (CHA), and Bonded Warehousing & 3PL Logistics."
                            }
                        },
                        {
                            "@type": "Question",
                            "name": "Can I speak directly with a human logistics coordinator?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "Yes. Every client is assigned a dedicated senior logistics coordinator who directly oversees your cargo, documentation, customs clearance, and delivery. Direct phone line: +91 98413 93916."
                            }
                        },
                        {
                            "@type": "Question",
                            "name": "How fast does Sentron Global Logistics provide freight rate quotes?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "Our commercial freight desk provides guaranteed all-inclusive spot and contract rate quotes within 18 minutes for major sea and air trade corridors."
                            }
                        },
                        {
                            "@type": "Question",
                            "name": "Where is Sentron Global Logistics headquartered?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "Sentron Global Logistics is headquartered in Chennai, Tamil Nadu, India (13.1277° N, 80.2124° E), with operational partner corridors across Singapore, Dubai (Jebel Ali), Rotterdam, Hamburg, and North America."
                            }
                        },
                        {
                            "@type": "Question",
                            "name": "Does Sentron handle Indian Customs House Brokerage (CHA)?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "Yes, Sentron has direct licensed CHA desk accreditation, achieving 96% pre-arrival clearance for imports and seamless export shipping bill processing with zero third-party demurrage delays."
                            }
                        }
                    ]
                }
                `}
                </script>
            </Helmet>

            {/* Video background layer */}
            <div className="fixed inset-0 w-full h-[100vh] z-0 pointer-events-none overflow-hidden opacity-35">
                <video autoPlay loop muted playsInline className="w-full h-full object-cover">
                    <source src="/introvideo.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-gradient-to-b from-[#061325]/85 via-[#061325]/75 to-[#061325]" />
            </div>

            {/* Hero Section — Mobile-first text alignment & touch-friendly ergonomics */}
            <section className="relative z-10 pt-28 pb-16 sm:pt-36 sm:pb-20 md:pt-44 md:pb-28">
                <div className="hallmark-container">
                    <motion.div style={{ y: yHeroText, opacity: opacityHero }} className="max-w-3xl text-left">
                        
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-300 font-medium mb-5">
                            <span>Licensed Customs Brokerage (CHA) and Multimodal Freight</span>
                        </div>

                        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.08] mb-5">
                            Reliability that moves the world.
                        </h1>

                        <p className="text-base sm:text-lg md:text-xl text-gray-300 font-normal leading-relaxed mb-8 max-w-2xl">
                            Multimodal ocean, air, and customs logistics engineered for enterprise supply chains across 65+ countries.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
                            <button
                                onClick={() => setIsQuoteOpen(true)}
                                className="btn-primary w-full sm:w-auto"
                            >
                                <span>Request freight quote</span>
                                <FiArrowRight className="text-base" />
                            </button>
                            <Link 
                                to="/services" 
                                className="btn-secondary w-full sm:w-auto"
                            >
                                Explore trade services
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Human Operations Desk — Personal Accountability Card */}
            <section className="relative z-10 py-8 sm:py-12">
                <div className="hallmark-container">
                    <div className="hallmark-surface p-6 sm:p-8 md:p-12">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center text-left">
                            <div className="lg:col-span-7">
                                <span className="text-xs sm:text-sm font-semibold text-brand-orange mb-2 block">
                                    Dedicated logistics coordination
                                </span>
                                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight mb-4">
                                    Direct human accountability behind every consignment.
                                </h2>
                                <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-6 font-normal">
                                    Every booking is coordinated by a named senior freight specialist who oversees route planning, vessel space, and customs filings. No automated phone trees or bot handoffs.
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-gray-300">
                                    <div className="flex items-center gap-2">
                                        <FiCheck className="text-brand-orange shrink-0" />
                                        <span>Named single-point account manager</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <FiCheck className="text-brand-orange shrink-0" />
                                        <span>18-minute guaranteed rate response</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <FiCheck className="text-brand-orange shrink-0" />
                                        <span>In-house customs house broker (CHA)</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <FiCheck className="text-brand-orange shrink-0" />
                                        <span>Zero hidden demurrage or surprise port fees</span>
                                    </div>
                                </div>
                            </div>

                            <div className="lg:col-span-5 flex flex-col gap-3 w-full">
                                <button
                                    onClick={() => setIsQuoteOpen(true)}
                                    className="btn-primary w-full py-3.5"
                                >
                                    Speak with a logistics director
                                </button>
                                <a
                                    href="tel:+919841393916"
                                    className="btn-secondary w-full py-3.5 text-center flex items-center justify-center gap-2"
                                >
                                    <FiPhoneCall className="text-brand-orange text-sm shrink-0" />
                                    <span>Call desk: +91 98413 93916</span>
                                </a>
                                <p className="text-xs text-gray-400 text-center mt-1">
                                    Commercial support: Monday to Saturday, 09:00 – 18:30 IST
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Performance Indicators */}
            <section className="relative z-10 py-6 sm:py-10">
                <div className="hallmark-container">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                        <StatItem end={15} suffix="+" label="Years of operations leadership" />
                        <StatItem end={50000} suffix="+" label="TEUs containers moved" />
                        <StatItem end={65} suffix="+" label="Global port gateways" />
                        <StatItem end={96} suffix="%" label="Pre-arrival customs clearance rate" />
                    </div>
                </div>
            </section>

            {/* Multimodal Freight Services — Compositions with Mass & Fresh Photography */}
            <section className="relative z-10 py-12 sm:py-16">
                <div className="hallmark-container">
                    <div className="max-w-2xl mb-8 sm:mb-12 text-left">
                        <span className="text-xs sm:text-sm font-semibold text-brand-orange mb-2 block">
                            Freight capabilities
                        </span>
                        <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
                            Global freight services built for scale.
                        </h2>
                    </div>

                    <div className="flex flex-col gap-8 sm:gap-12">
                        {SERVICE_CARDS.map((card) => {
                            const IconComponent = card.icon;
                            return (
                                <article 
                                    key={card.title}
                                    className="hallmark-surface overflow-hidden grid grid-cols-1 md:grid-cols-12 items-stretch text-left"
                                >
                                    <div className="md:col-span-6 p-6 sm:p-8 md:p-12 flex flex-col justify-between">
                                        <div>
                                            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-xl text-brand-orange mb-5">
                                                <IconComponent />
                                            </div>
                                            <span className="text-xs text-gray-400 font-medium block mb-1.5">
                                                {card.scope}
                                            </span>
                                            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-tight mb-3">
                                                {card.title}
                                            </h3>
                                            <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-6 font-normal">
                                                {card.description}
                                            </p>
                                        </div>
                                        <div>
                                            <Link 
                                                to={card.route}
                                                className="inline-flex items-center gap-2 text-sm font-semibold text-brand-highlight hover:text-white transition-colors"
                                            >
                                                <span>View specifications</span>
                                                <FiArrowRight className="text-sm" />
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="md:col-span-6 h-56 sm:h-72 md:h-auto min-h-[220px] relative overflow-hidden bg-[#07172C]">
                                        <img 
                                            src={card.image} 
                                            alt={card.title} 
                                            loading="lazy"
                                            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                                        />
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Industry Sectors */}
            <section className="relative z-10 py-10 sm:py-14">
                <div className="hallmark-container">
                    <div className="max-w-2xl mb-8 text-left">
                        <span className="text-xs sm:text-sm font-semibold text-brand-orange mb-2 block">
                            Industry expertise
                        </span>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight">
                            Cargo sectors moving with Sentron.
                        </h2>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3">
                        {[
                            'Automotive components',
                            'BioPharma & cold chain',
                            'Industrial machinery',
                            'Chemicals & IMO/DG',
                            'Renewable energy',
                            'Cross-border retail'
                        ].map((sector) => (
                            <div key={sector} className="p-3.5 sm:p-4 rounded-xl bg-white/5 border border-white/10 text-center flex items-center justify-center min-h-[60px]">
                                <span className="text-xs sm:text-sm text-gray-200 font-medium leading-snug">{sector}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Closing CTA */}
            <section className="relative z-10 py-14 sm:py-20">
                <div className="hallmark-container">
                    <div className="hallmark-surface p-6 sm:p-10 md:p-16 text-center max-w-3xl mx-auto">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight mb-3 sm:mb-4">
                            Ready for predictable global freight?
                        </h2>
                        <p className="text-gray-300 text-sm sm:text-base mb-6 sm:mb-8 max-w-xl mx-auto font-normal">
                            Consult with our commercial freight desk today. Guaranteed rate quotations delivered within 18 minutes.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                            <button
                                onClick={() => setIsQuoteOpen(true)}
                                className="btn-primary w-full sm:w-auto"
                            >
                                Request guaranteed quote
                            </button>
                            <a
                                href="tel:+919841393916"
                                className="btn-secondary w-full sm:w-auto flex items-center justify-center gap-2"
                            >
                                <FiPhoneCall className="text-brand-orange text-sm shrink-0" />
                                <span>Call desk: +91 98413 93916</span>
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            <div className="h-8" />

            <QuickQuoteDrawer isOpen={isQuoteOpen} onClose={() => setIsQuoteOpen(false)} />
        </main>
    );
};

export default Home;
