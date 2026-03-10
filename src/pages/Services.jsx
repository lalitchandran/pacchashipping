import React from 'react';
import { motion } from 'framer-motion';
import { FiBox, FiGlobe, FiTarget, FiTrendingUp, FiSettings, FiArrowRight, FiTruck, FiShield, FiAnchor } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const ServiceCard = ({ icon: Icon, title, desc, delay, imgSrc, to }) => (
    <Link to={to || '/contact'} className="block h-full group">
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay }}
            className="glass-panel-dark p-8 h-full flex flex-col items-start min-h-[320px] relative overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.4)] hover:shadow-neon-brand border border-white/5 hover:border-brand-primary/40 transition-all duration-500 rounded-[1.5rem]"
        >
            {imgSrc && (
                <div className="absolute top-0 right-0 w-48 h-48 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
                    <img src={imgSrc} alt="" className="w-full h-full object-cover rounded-bl-full" />
                </div>
            )}

            <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-2xl mb-8 shadow-sm text-white group-hover:bg-brand-primary transition-all duration-300">
                <Icon />
            </div>

            <h3 className="text-2xl font-bold mb-3 text-white tracking-tight">{title}</h3>
            <p className="text-gray-400 leading-relaxed text-[15px] flex-grow font-medium">{desc}</p>

            <div className="mt-8 flex items-center gap-2 text-brand-highlight text-sm font-semibold opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300">
                Explore Capabilities <FiArrowRight />
            </div>
        </motion.div>
    </Link>
);

const Services = () => {
    return (
        <div className="w-full min-h-screen pt-32 pb-24 px-6 max-w-[1400px] mx-auto relative overflow-hidden bg-transparent">
            {/* Minimalist Background Accent */}
            <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-b from-brand-primary/10 to-transparent blur-3xl pointer-events-none"></div>

            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="text-center mb-24 relative z-10"
            >
                <span className="text-brand-highlight tracking-widest uppercase text-sm font-bold mb-4 block">Enterprise Operations</span>
                <h1 className="text-5xl md:text-[5.5rem] font-bold text-white mb-6 tracking-tight leading-tight">
                    Infrastructure for Global Trade.<br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">Engineered for scale.</span>
                </h1>
                <p className="max-w-3xl mx-auto text-gray-400 text-xl font-medium leading-relaxed">
                    Commanding a global network of ocean, air, and land assets. We orchestrate complex supply chains, break bulk projects, and hazmat compliance for the world's leading brands.
                </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">

                {/* Primary Large Tile */}
                <div className="lg:col-span-2">
                    <ServiceCard
                        icon={FiGlobe}
                        title="Ocean & Air Freight Networks"
                        desc="Commanding massive capacity across major sea and air corridors. As a Tier-1 NVOCC, we deploy vast networks to ensure resilient, high-volume cargo flow worldwide."
                        delay={0.1}
                        imgSrc="/shipping_port_containers_1772904872607.png"
                        to="/services/ocean"
                    />
                </div>

                <ServiceCard
                    icon={FiSettings}
                    title="Global Customs & Compliance"
                    desc="Automating cross-border friction. Our enterprise customs intelligence ensures zero-delay clearance, strict regulatory adherence, and optimized duty management."
                    delay={0.2}
                    to="/contact"
                />

                <ServiceCard
                    icon={FiTarget}
                    title="Temperature-Controlled Transit"
                    desc="End-to-end cold chain integrity. Deploying advanced reefer technology for pharmaceuticals and critical perishables with real-time telematics."
                    delay={0.3}
                    to="/services/air"
                />

                {/* Second Large Tile */}
                <div className="lg:col-span-2">
                    <ServiceCard
                        icon={FiBox}
                        title="Project Logistics & Infrastructure"
                        desc="Engineering the impossible. We architect multimodal solutions for immense out-of-gauge machinery, supporting the world's most ambitious industrial projects."
                        delay={0.4}
                        imgSrc="/railway_freight_train_1772904925601.png"
                        to="/services/road"
                    />
                </div>

                <ServiceCard
                    icon={FiShield}
                    title="Hazmat & Chemical Logistics"
                    desc="Rigorous global certification and specialized infrastructure for safely transporting complex, high-risk chemical and hazardous materials."
                    delay={0.5}
                    to="/contact"
                />

                <ServiceCard
                    icon={FiTrendingUp}
                    title="Enterprise Supply Chain Orchestration"
                    desc="Architecting resilient 4PL networks. We integrate strategic warehousing, predictive distribution, and agile inventory management at a global scale."
                    delay={0.6}
                    to="/services/warehousing"
                />

                <ServiceCard
                    icon={FiTruck}
                    title="Heavy Lift & Break Bulk"
                    desc="Deploying specialized vessels and heavy-lift equipment to command non-containerized, high-tonnage cargo across continents."
                    delay={0.7}
                    to="/services/road"
                />
            </div>
        </div>
    );
};

export default Services;
