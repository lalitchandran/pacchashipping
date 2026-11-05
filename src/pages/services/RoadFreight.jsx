import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FiArrowRight, FiCheckCircle, FiTruck, FiMapPin, FiClock, FiShield } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

gsap.registerPlugin(ScrollTrigger);

const features = [
    "Port Haulage & Container Trucking",
    "Factory Stuffing & De-stuffing On-Site",
    "Over-Dimensional Project Cargo Transport",
    "Bonded CFS / ICD Movement",
    "Intermodal Road-Rail Solutions",
    "Cross-Border Transit Management",
    "Door-to-Door Inland Delivery",
    "24/7 Active GPS-Tracked Fleet",
];

const vehicleTypes = [
    { type: '20ft Container Chassis', desc: 'Standard ISO container transport between ports, CFSs, and factories.' },
    { type: '40ft Multi-Axle Trailer', desc: 'Heavy payload chassis engineered for high-cube container haulage.' },
    { type: 'Low-Bed & Hydraulic Axles', desc: 'For heavy industrial machinery, turbines, and over-dimensional project freight.' },
    { type: 'Dedicated LCV Distribution Fleet', desc: 'Fast, secure last-mile delivery and localized urban parcel dispatch.' },
    { type: 'Temperature-Monitored Reefer Trucks', desc: 'Continuous multi-temp monitoring for pharmaceuticals and perishable food cargo.' },
    { type: 'Hazmat & Liquid Tankers', desc: 'Certified transport for specialty chemicals and non-hazardous bulk liquids.' },
];

const RoadFreight = () => {
    const truckRef = useRef(null);

    useEffect(() => {
        gsap.to(truckRef.current, {
            scale: 1.1,
            x: 18,
            scrollTrigger: {
                trigger: ".road-hero",
                start: "top top",
                end: "bottom top",
                scrub: 1
            }
        });
    }, []);

    return (
        <main className="min-h-screen bg-[#061325] pt-28 pb-16 sm:pt-32 sm:pb-20 overflow-hidden relative text-left">
            <Helmet>
                <title>Intermodal Road & Port Drayage | Sentron Global Logistics</title>
                <meta name="description" content="Reliable container trucking, port drayage, and nationwide road freight across industrial corridors. GPS-tracked multi-axle trailers and zero demurrage transport." />
                <meta name="keywords" content="container trucking, port drayage, road haulage India, intermodal freight forwarder, Sentron Global Logistics" />
                <link rel="canonical" href="https://sentronglobal.com/services/road" />
            </Helmet>
            <div className="absolute inset-0 bg-gradient-to-b from-brand-accent/15 via-transparent to-transparent pointer-events-none"></div>

            {/* Hero */}
            <section className="road-hero relative hallmark-container mb-20 z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-12 items-center">
                    <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
                        <span className="text-xs sm:text-sm font-semibold text-brand-orange mb-2 block">
                            Intermodal overland haulage
                        </span>
                        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black pb-3 text-white tracking-tight leading-tight">
                            Precision road freight. Zero port demurrage.
                        </h1>
                        <p className="text-base sm:text-lg text-gray-300 max-w-lg mb-8 font-normal leading-relaxed">
                            Connecting seaport container docks and airport complexes directly to industrial production plants. Sentron Global Logistics operates modern GPS-monitored trailer fleets with guaranteed port evacuation schedules.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
                            <Link to="/contact" className="btn-primary w-full sm:w-auto">
                                <span>Get road freight quote</span>
                                <FiArrowRight className="text-base" />
                            </Link>
                            <a href="tel:+919841393916" className="btn-secondary w-full sm:w-auto flex items-center justify-center gap-2">
                                <span>Haulage desk: +91 98413 93916</span>
                            </a>
                        </div>
                    </motion.div>

                    <div className="relative h-[380px] md:h-[480px] w-full mt-10 lg:mt-0">
                        <div className="absolute inset-0 overflow-hidden rounded-3xl glass-panel-dark border border-brand-accent/30 shadow-2xl">
                            <div
                                ref={truckRef}
                                className="w-full h-full bg-cover bg-center origin-center"
                                style={{ backgroundImage: "url('/sentron_road_freight.png')" }}
                            ></div>
                            <div className="absolute inset-0 bg-gradient-to-t from-[#061325] via-transparent to-transparent opacity-85"></div>
                            <div className="absolute bottom-6 left-6 flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-brand-orange animate-ping shadow-neon-orange"></div>
                                <span className="text-white font-bold text-xs tracking-widest uppercase">Fleet GPS Monitored Active</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Fleet Types */}
            <section className="max-w-7xl mx-auto px-6 relative z-10 mb-24">
                <h2 className="text-3xl md:text-5xl font-black text-white mb-10 text-center">Trailer & Fleet Specifications</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-14">
                    {vehicleTypes.map(({ type, desc }, idx) => (
                        <div key={idx} className="glass-panel-dark p-7 rounded-2xl border border-brand-accent/20 hover:border-brand-highlight/40 transition-all">
                            <div className="w-12 h-12 rounded-xl bg-brand-accent/20 border border-brand-accent/30 flex items-center justify-center text-xl text-brand-orange mb-4">
                                <FiTruck />
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">{type}</h3>
                            <p className="text-gray-300 text-xs leading-relaxed">{desc}</p>
                        </div>
                    ))}
                </div>

                {/* Features */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-3 text-gray-200 p-4 bg-[#07172C]/80 rounded-2xl border border-brand-accent/20">
                            <FiCheckCircle className="text-brand-orange text-lg shrink-0" />
                            <span className="text-xs md:text-sm font-semibold">{feature}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="bg-gradient-to-br from-[#0B2545] via-[#07172C] to-[#050D1A] border border-brand-accent/30 rounded-[2.5rem] p-12 text-center shadow-2xl">
                    <h3 className="text-3xl md:text-4xl font-black text-white mb-4">Schedule Container Drayage</h3>
                    <p className="text-gray-300 text-base mb-8 max-w-xl mx-auto">Eliminate terminal demurrage with pre-booked port haulage trailers.</p>
                    <Link to="/contact" className="inline-flex items-center gap-2 bg-brand-orange hover:bg-brand-orangeHover text-white font-bold px-10 py-4 rounded-full transition-all shadow-neon-orange hover:-translate-y-1">
                        Request Road Freight Schedule <FiArrowRight />
                    </Link>
                </div>
            </section>
        </main>
    );
};

export default RoadFreight;

