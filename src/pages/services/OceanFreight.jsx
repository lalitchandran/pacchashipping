import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FiArrowRight, FiCheckCircle, FiAnchor, FiPackage, FiGlobe, FiFileText, FiShield, FiClock } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

gsap.registerPlugin(ScrollTrigger);

const features = [
    "FCL (Full Container Load)",
    "LCL (Less than Container Load)",
    "Breakbulk & Heavy Lift Cargo",
    "RO-RO (Roll-on / Roll-off)",
    "Reefer / Cold-Chain Containers",
    "Over-Dimensional Project Cargo",
    "Port-to-Port & Door-to-Door",
    "Pre-Arrival Customs Clearance",
];

const tradelanes = [
    { from: 'Chennai / JNPT', to: 'Dubai / Jebel Ali (UAE)', transit: '10–14 days', freq: '3x Weekly' },
    { from: 'Chennai / JNPT', to: 'Singapore PSA Terminal', transit: '7–10 days', freq: 'Daily Direct' },
    { from: 'Chennai / JNPT', to: 'Rotterdam / Hamburg (Europe)', transit: '22–26 days', freq: 'Weekly Express' },
    { from: 'Chennai / JNPT', to: 'New York / Los Angeles (USA)', transit: '28–34 days', freq: '2x Weekly' },
    { from: 'Chennai / JNPT', to: 'Colombo Transshipment Hub', transit: '3–5 days', freq: 'Frequent Feeder' },
    { from: 'Chennai / JNPT', to: 'Dammam / Jeddah (Saudi Arabia)', transit: '14–18 days', freq: 'Weekly Direct' },
];

const OceanFreight = () => {
    const shipRef = useRef(null);

    useEffect(() => {
        gsap.to(shipRef.current, {
            scale: 1.12,
            x: -15,
            y: -8,
            scrollTrigger: {
                trigger: ".ocean-hero",
                start: "top top",
                end: "bottom top",
                scrub: 1
            }
        });
    }, []);

    return (
        <main className="min-h-screen bg-[#061325] pt-28 pb-16 sm:pt-32 sm:pb-20 overflow-hidden relative text-left">
            <Helmet>
                <title>Ocean Freight (FCL & LCL) | Sentron Global Logistics</title>
                <meta name="description" content="Tier-1 ocean freight forwarding connecting global ports. Full Container Load (FCL) and consolidated LCL services with guaranteed vessel space and real-time container tracking." />
                <meta name="keywords" content="ocean freight FCL LCL, container shipping, marine freight forwarder, sea freight Chennai, Sentron Global Logistics" />
                <link rel="canonical" href="https://sentronglobal.com/services/ocean" />
            </Helmet>
            <div className="absolute inset-0 bg-gradient-to-b from-brand-accent/15 via-transparent to-transparent pointer-events-none"></div>

            {/* Hero */}
            <section className="ocean-hero relative hallmark-container mb-20 z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-12 items-center">
                    <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
                        <span className="text-xs sm:text-sm font-semibold text-brand-orange mb-2 block">
                            Maritime freight solutions
                        </span>
                        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black pb-3 text-white tracking-tight leading-tight">
                            Global ocean freight. Engineered reliability.
                        </h1>
                        <p className="text-base sm:text-lg text-gray-300 max-w-lg mb-8 font-normal leading-relaxed">
                            Sentron Global Logistics moves high-volume containerized and breakbulk cargo across 65+ international trade lanes. Guaranteed vessel space, direct carrier partnerships, and pre-arrival customs clearance.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
                            <Link to="/contact" className="btn-primary w-full sm:w-auto">
                                <span>Get ocean freight quote</span>
                                <FiArrowRight className="text-base" />
                            </Link>
                            <a href="tel:+919841393916" className="btn-secondary w-full sm:w-auto flex items-center justify-center gap-2">
                                <span>Call freight desk: +91 98413 93916</span>
                            </a>
                        </div>
                    </motion.div>

                    <div className="relative h-[380px] md:h-[480px] w-full mt-10 lg:mt-0">
                        <div className="absolute inset-0 overflow-hidden rounded-3xl glass-panel-dark border border-brand-accent/30 shadow-2xl">
                            <div
                                ref={shipRef}
                                className="w-full h-full bg-cover bg-center origin-center"
                                style={{ backgroundImage: "url('/sentron_ocean_freight.png')" }}
                            ></div>
                            <div className="absolute inset-0 bg-gradient-to-t from-[#061325] via-transparent to-transparent opacity-85"></div>
                            <div className="absolute bottom-6 left-6 flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-brand-orange animate-ping shadow-neon-orange"></div>
                                <span className="text-white font-bold text-xs tracking-widest uppercase">Sentron Maritime Carrier Fleet</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FCL vs LCL */}
            <section className="max-w-7xl mx-auto px-6 relative z-10 mb-24">
                <h2 className="text-3xl md:text-5xl font-black text-white mb-8 text-center">FCL and LCL Cargo Mastery</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-14">
                    <div className="glass-panel-dark p-8 rounded-3xl border border-brand-accent/25">
                        <div className="w-14 h-14 rounded-2xl bg-brand-accent/20 border border-brand-accent/30 flex items-center justify-center text-2xl text-brand-orange mb-6">
                            <FiPackage />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-3">FCL — Full Container Load</h3>
                        <p className="text-gray-300 leading-relaxed mb-5 text-sm">
                            Dedicated 20ft, 40ft Standard, 40ft High Cube, Reefer, and Open Top containers. Direct shipping line allocation with priority gate-in at terminals.
                        </p>
                        <ul className="text-gray-300 text-xs sm:text-sm space-y-2.5">
                            <li className="flex items-center gap-2"><FiCheckCircle className="text-brand-orange shrink-0" /> Exclusive sealed container for single shipper cargo</li>
                            <li className="flex items-center gap-2"><FiCheckCircle className="text-brand-orange shrink-0" /> Express non-stop maritime transit corridors</li>
                            <li className="flex items-center gap-2"><FiCheckCircle className="text-brand-orange shrink-0" /> Tier-1 volume contracted freight rates</li>
                        </ul>
                    </div>

                    <div className="glass-panel-dark p-8 rounded-3xl border border-brand-highlight/25">
                        <div className="w-14 h-14 rounded-2xl bg-brand-highlight/20 border border-brand-highlight/30 flex items-center justify-center text-2xl text-brand-highlight mb-6">
                            <FiGlobe />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-3">LCL — Less than Container Load</h3>
                        <p className="text-gray-300 leading-relaxed mb-5 text-sm">
                            Smart consolidation for shipments that do not require an entire container. Pay only for the exact cubic volume (CBM) your cargo occupies.
                        </p>
                        <ul className="text-gray-300 text-xs sm:text-sm space-y-2.5">
                            <li className="flex items-center gap-2"><FiCheckCircle className="text-brand-highlight shrink-0" /> Scheduled weekly consolidation departures</li>
                            <li className="flex items-center gap-2"><FiCheckCircle className="text-brand-highlight shrink-0" /> Professional CFS palletization and shrink-wrapping</li>
                            <li className="flex items-center gap-2"><FiCheckCircle className="text-brand-highlight shrink-0" /> Zero minimum container volume penalty</li>
                        </ul>
                    </div>
                </div>

                {/* Features */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-3 text-gray-200 p-4 bg-[#07172C]/80 rounded-2xl border border-brand-accent/20 hover:border-brand-highlight/50 transition-all">
                            <FiCheckCircle className="text-brand-orange text-lg shrink-0" />
                            <span className="text-xs md:text-sm font-semibold">{feature}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* Trade Lanes */}
            <section className="max-w-7xl mx-auto px-6 relative z-10 mb-24">
                <h2 className="text-3xl font-black text-white mb-6 text-center">Active Maritime Corridors</h2>
                <div className="overflow-x-auto rounded-3xl border border-brand-accent/20 glass-panel-dark">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-white/5 text-gray-400 text-xs uppercase tracking-widest border-b border-white/10">
                                <th className="px-6 py-4">Origin Gateway</th>
                                <th className="px-6 py-4">Destination Hub</th>
                                <th className="px-6 py-4">Sailing Transit</th>
                                <th className="px-6 py-4">Frequency</th>
                                <th className="px-6 py-4">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tradelanes.map(({ from, to, transit, freq }, idx) => (
                                <tr key={idx} className="border-t border-white/5 hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4 text-white font-semibold text-sm">{from}</td>
                                    <td className="px-6 py-4 text-gray-300 text-sm">{to}</td>
                                    <td className="px-6 py-4 text-brand-highlight font-bold text-sm">{transit}</td>
                                    <td className="px-6 py-4 text-gray-400 text-xs">{freq}</td>
                                    <td className="px-6 py-4">
                                        <Link to="/contact" className="text-brand-orange hover:underline text-xs font-bold inline-flex items-center gap-1">
                                            Request Rate <FiArrowRight />
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* CTA */}
            <section className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="bg-gradient-to-br from-[#0B2545] via-[#07172C] to-[#050D1A] border border-brand-accent/30 rounded-[2.5rem] p-12 text-center shadow-2xl">
                    <h3 className="text-3xl md:text-5xl font-black text-white mb-4">Book Your Ocean Freight Container</h3>
                    <p className="text-gray-300 text-base md:text-lg mb-8 max-w-xl mx-auto font-normal">
                        Speak with our maritime routing team. Receive a locked-in container spot rate with zero hidden port surcharges.
                    </p>
                    <Link to="/contact" className="inline-flex items-center gap-2 bg-brand-orange hover:bg-brand-orangeHover text-white font-bold px-10 py-4 rounded-full transition-all shadow-neon-orange hover:-translate-y-1">
                        Request Ocean Freight Quote <FiArrowRight />
                    </Link>
                </div>
            </section>
        </main>
    );
};

export default OceanFreight;

