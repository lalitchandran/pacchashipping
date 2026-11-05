import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FiArrowRight, FiCheckCircle, FiBox, FiPackage, FiShield, FiTrendingUp } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

gsap.registerPlugin(ScrollTrigger);

const features = [
    "Bonded & General Contract Warehousing",
    "CFS (Container Freight Station) Consolidation",
    "Cargo Stuffing, Destuffing & Lashing",
    "Custom Palletizing & Shrink Wrapping",
    "Real-Time EDI Warehouse Management System",
    "24/7 Monitored CCTV & Security Patrols",
    "LCL Multi-Vendor Cargo Consolidation",
    "Cross-Docking & Transshipment Staging",
    "Pre-Shipment Quality Inspection Facilities",
    "Customs Duty-Free Bonded Storage",
    "Temperature-Regulated Cold Rooms",
    "Last-Mile Pan-Regional Hub Distribution",
];

const Warehousing = () => {
    const warehouseRef = useRef(null);

    useEffect(() => {
        gsap.to(warehouseRef.current, {
            scale: 1.1,
            y: -15,
            scrollTrigger: {
                trigger: ".warehouse-hero",
                start: "top top",
                end: "bottom top",
                scrub: 1
            }
        });
    }, []);

    return (
        <main className="min-h-screen bg-[#061325] pt-28 pb-16 sm:pt-32 sm:pb-20 overflow-hidden relative text-left">
            <Helmet>
                <title>Hub Warehousing & 3PL Logistics | Sentron Global Logistics</title>
                <meta name="description" content="Secure bonded and general warehousing strategically positioned near major maritime and aviation terminals. CFS operations, real-time inventory management, and cross-docking." />
                <meta name="keywords" content="bonded warehousing, CFS logistics, 3PL distribution, cargo consolidation, Sentron Global Logistics" />
                <link rel="canonical" href="https://sentronglobal.com/services/warehousing" />
            </Helmet>
            <div className="absolute inset-0 bg-gradient-to-b from-brand-accent/15 via-transparent to-transparent pointer-events-none"></div>

            {/* Hero */}
            <section className="warehouse-hero relative hallmark-container mb-20 z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-12 items-center">
                    <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
                        <span className="text-xs sm:text-sm font-semibold text-brand-orange mb-2 block">
                            Contract logistics & storage
                        </span>
                        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black pb-3 text-white tracking-tight leading-tight">
                            Smart warehousing. Agile fulfillment.
                        </h1>
                        <p className="text-base sm:text-lg text-gray-300 max-w-lg mb-8 font-normal leading-relaxed">
                            Position your inventory at the nexus of global trade corridors. Sentron Global Logistics provides high-security bonded facilities, CFS container consolidation, and rapid cross-dock distribution.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
                            <Link to="/contact" className="btn-primary w-full sm:w-auto">
                                <span>Get warehousing quote</span>
                                <FiArrowRight className="text-base" />
                            </Link>
                            <a href="tel:+919841393916" className="btn-secondary w-full sm:w-auto flex items-center justify-center gap-2">
                                <span>Warehousing desk: +91 98413 93916</span>
                            </a>
                        </div>
                    </motion.div>

                    <div className="relative h-[380px] md:h-[480px] w-full mt-10 lg:mt-0">
                        <div className="absolute inset-0 overflow-hidden rounded-3xl glass-panel-dark border border-brand-accent/30 shadow-2xl">
                            <div
                                ref={warehouseRef}
                                className="w-full h-full bg-cover bg-center origin-center"
                                style={{ backgroundImage: "url('/sentron_warehouse.png')" }}
                            ></div>
                            <div className="absolute inset-0 bg-gradient-to-t from-[#061325] via-transparent to-transparent opacity-85"></div>
                            <div className="absolute bottom-6 left-6 flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-brand-orange animate-ping shadow-neon-orange"></div>
                                <span className="text-white font-bold text-xs tracking-widest uppercase">Sentron Logistics Center Hub</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="max-w-7xl mx-auto px-6 relative z-10 mb-24">
                <h2 className="text-3xl md:text-5xl font-black text-white mb-10 text-center">Hub Facilities & Technical Services</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
                    {features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-3 text-gray-200 p-4 bg-[#07172C]/80 rounded-2xl border border-brand-accent/20 hover:border-brand-highlight/40 transition-all">
                            <FiCheckCircle className="text-brand-orange text-lg shrink-0" />
                            <span className="text-xs md:text-sm font-semibold">{feature}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="bg-gradient-to-br from-[#0B2545] via-[#07172C] to-[#050D1A] border border-brand-accent/30 rounded-[2.5rem] p-12 text-center shadow-2xl">
                    <h3 className="text-3xl md:text-4xl font-black text-white mb-4">Optimize Your Distribution Hub</h3>
                    <p className="text-gray-300 text-base mb-8 max-w-xl mx-auto">Get flexible bonded or general storage proposals tailored to your freight cadence.</p>
                    <Link to="/contact" className="inline-flex items-center gap-2 bg-brand-orange hover:bg-brand-orangeHover text-white font-bold px-10 py-4 rounded-full transition-all shadow-neon-orange hover:-translate-y-1">
                        Request Warehousing Proposal <FiArrowRight />
                    </Link>
                </div>
            </section>
        </main>
    );
};

export default Warehousing;

