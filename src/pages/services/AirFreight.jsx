import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FiArrowRight, FiCheckCircle, FiClock, FiPackage, FiGlobe, FiShield } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

gsap.registerPlugin(ScrollTrigger);

const features = [
    "Express & Scheduled Air Cargo",
    "Global Door-to-Door Aviation Delivery",
    "Electronic Air Waybill (e-AWB) Processing",
    "Priority Next-Flight-Out & Charter Space",
    "Dangerous Goods (DG/IATA) by Air",
    "Temperature-Controlled Pharma Logistics",
    "On-Airport Customs Brokerage Clearance",
    "IATA-Compliant Packing & Screening",
];

const procesSteps = [
    { step: '01', title: 'Booking & Flight Space Guarantee', desc: 'Direct confirmed space with Tier-1 airlines and immediate rate locking.' },
    { step: '02', title: 'Secure Terminal Gate & X-Ray Check', desc: 'Compliant cargo reception, weight verification, and IATA security scanning.' },
    { step: '03', title: 'Export Customs Pre-Clearance', desc: 'Electronic filing of shipping bills, e-AWB, and export approvals before aircraft loading.' },
    { step: '04', title: 'Flight Transit with Real-Time EDI', desc: 'Direct flight departure with real-time waypoint milestones and altitude updates.' },
    { step: '05', title: 'Destination Airport Clearance', desc: 'Local partner customs house clearance and de-consolidation without demurrage.' },
    { step: '06', title: 'Final Doorstep Handover', desc: 'GPS-monitored final delivery with digital signed Proof of Delivery (e-POD).' },
];

const AirFreight = () => {
    const planeRef = useRef(null);

    useEffect(() => {
        gsap.to(planeRef.current, {
            scale: 1.12,
            y: 20,
            x: 8,
            scrollTrigger: {
                trigger: ".air-hero",
                start: "top top",
                end: "bottom top",
                scrub: 1,
            }
        });
    }, []);

    return (
        <main className="min-h-screen bg-[#061325] pt-28 pb-16 sm:pt-32 sm:pb-20 overflow-hidden relative text-left">
            <Helmet>
                <title>Air Cargo Express & Priority | Sentron Global Logistics</title>
                <meta name="description" content="Time-critical international air cargo services connecting 100+ global airport hubs. IATA-compliant handling, temperature-controlled pharma flights, and express customs clearance." />
                <meta name="keywords" content="air freight services, express air cargo, air shipping international, IATA cargo agent, Sentron Global Logistics" />
                <link rel="canonical" href="https://sentronglobal.com/services/air" />
            </Helmet>
            <div className="absolute inset-0 bg-gradient-to-b from-brand-accent/15 via-transparent to-transparent pointer-events-none"></div>

            {/* Hero */}
            <section className="air-hero relative hallmark-container mb-20 z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-12 items-center">
                    <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
                        <span className="text-xs sm:text-sm font-semibold text-brand-orange mb-2 block">
                            Time-critical aviation logistics
                        </span>
                        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black pb-3 text-white tracking-tight leading-tight">
                            Priority air cargo. Worldwide precision.
                        </h1>
                        <p className="text-base sm:text-lg text-gray-300 max-w-lg mb-8 font-normal leading-relaxed">
                            When delivery timelines cannot be compromised. Sentron Global Logistics moves mission-critical freight across 100+ global air destinations with next-flight-out prioritization and guaranteed tarmac speed.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
                            <Link to="/contact" className="btn-primary w-full sm:w-auto">
                                <span>Get air freight quote</span>
                                <FiArrowRight className="text-base" />
                            </Link>
                            <a href="tel:+919841393916" className="btn-secondary w-full sm:w-auto flex items-center justify-center gap-2">
                                <FiClock className="text-brand-orange" />
                                <span>Call air desk: +91 98413 93916</span>
                            </a>
                        </div>
                    </motion.div>

                    <div className="relative h-[380px] md:h-[480px] w-full mt-10 lg:mt-0">
                        <div className="absolute inset-0 overflow-hidden rounded-3xl glass-panel-dark border border-brand-accent/30 shadow-2xl">
                            <div
                                ref={planeRef}
                                className="w-full h-full bg-cover bg-center origin-center"
                                style={{ backgroundImage: "url('/sentron_air_freight.png')" }}
                            ></div>
                            <div className="absolute inset-0 bg-gradient-to-t from-[#061325] via-transparent to-transparent opacity-85"></div>
                            <div className="absolute bottom-6 left-6 flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-brand-orange animate-ping shadow-neon-orange"></div>
                                <span className="text-white font-bold text-xs tracking-widest uppercase">Air Consignment Corridor: SG-AWB-902</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="max-w-7xl mx-auto px-6 relative z-10 mb-24">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-black mb-4 text-white">Full-Scope Aviation Capabilities</h2>
                        <p className="text-gray-300 mb-8 leading-relaxed text-base font-normal">
                            From factory-floor pickup to final customs gate-out at destination airports, our IATA-certified air freight specialists manage all documentation, cold-chain monitoring, and security verification.
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                            {features.map((feature, idx) => (
                                <div key={idx} className="flex items-center gap-3 text-gray-200 p-3 bg-[#07172C]/80 rounded-xl border border-brand-accent/20">
                                    <FiCheckCircle className="text-brand-orange text-lg shrink-0" />
                                    <span className="text-xs md:text-sm font-semibold">{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="glass-panel-dark p-6 flex flex-col justify-center items-center text-center rounded-2xl border border-brand-accent/20">
                            <FiClock className="text-brand-orange text-3xl mb-2" />
                            <span className="text-3xl font-black text-white mb-1">24/7</span>
                            <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">Flight Desk Support</span>
                        </div>
                        <div className="glass-panel-dark p-6 flex flex-col justify-center items-center text-center rounded-2xl border border-brand-accent/20">
                            <FiGlobe className="text-brand-highlight text-3xl mb-2" />
                            <span className="text-3xl font-black text-white mb-1">100+</span>
                            <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">Airport Gateways</span>
                        </div>
                        <div className="glass-panel-dark p-6 flex flex-col justify-center items-center text-center rounded-2xl border border-brand-accent/20">
                            <FiShield className="text-brand-orange text-3xl mb-2" />
                            <span className="text-2xl font-black text-white mb-1">IATA</span>
                            <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">Accredited Agent</span>
                        </div>
                        <div className="glass-panel-dark p-6 flex flex-col justify-center items-center text-center rounded-2xl border border-brand-accent/20">
                            <FiPackage className="text-brand-highlight text-3xl mb-2" />
                            <span className="text-2xl font-black text-white mb-1">IMO/DG</span>
                            <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">Dangerous Goods Approved</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Process */}
            <section className="max-w-7xl mx-auto px-6 relative z-10 mb-24">
                <h2 className="text-3xl md:text-5xl font-black text-white mb-12 text-center">Air Freight Execution Protocol</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {procesSteps.map(({ step, title, desc }) => (
                        <motion.div
                            key={step}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            className="glass-panel-dark rounded-2xl p-6 border border-brand-accent/20 hover:border-brand-highlight/40 transition-all"
                        >
                            <span className="text-3xl font-black text-brand-orange/60 block mb-2">{step}</span>
                            <h3 className="text-base font-bold text-white mb-2">{title}</h3>
                            <p className="text-gray-300 text-xs leading-relaxed">{desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="bg-gradient-to-br from-[#0B2545] via-[#07172C] to-[#050D1A] border border-brand-accent/30 rounded-[2.5rem] p-12 text-center shadow-2xl">
                    <h3 className="text-3xl md:text-4xl font-black text-white mb-4">Book Your Urgent Air Consignment</h3>
                    <p className="text-gray-300 text-base mb-8 max-w-xl mx-auto">Lock in airline space and receive verified departure schedules within 18 minutes.</p>
                    <Link to="/contact" className="inline-flex items-center gap-2 bg-brand-orange hover:bg-brand-orangeHover text-white font-bold px-10 py-4 rounded-full transition-all shadow-neon-orange hover:-translate-y-1">
                        Request Air Cargo Quote <FiArrowRight />
                    </Link>
                </div>
            </section>
        </main>
    );
};

export default AirFreight;

