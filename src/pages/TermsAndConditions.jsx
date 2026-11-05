import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiShield } from 'react-icons/fi';
import { Helmet } from 'react-helmet-async';

const Section = ({ title, children }) => (
    <div className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-4 pb-3 border-b border-white/10">{title}</h2>
        <div className="text-gray-300 leading-relaxed space-y-4 text-[15px]">{children}</div>
    </div>
);

const TermsAndConditions = () => {
    return (
        <div className="min-h-screen bg-[#061325] pt-32 pb-20 px-6 relative">
            <Helmet>
                <title>Standard Trading Conditions | Sentron Global Logistics</title>
                <meta name="description" content="Standard trading conditions and freight terms for Sentron Global Logistics. Governing multimodal transport, customs brokerage, and cargo carriage." />
                <link rel="canonical" href="https://sentronglobal.com/terms" />
            </Helmet>
            <div className="absolute inset-0 bg-gradient-to-b from-brand-accent/10 via-transparent to-transparent pointer-events-none" />

            <div className="max-w-4xl mx-auto relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <div className="w-16 h-16 rounded-2xl bg-brand-accent/20 border border-brand-accent/30 flex items-center justify-center text-3xl text-brand-orange mx-auto mb-6">
                        <FiShield />
                    </div>
                    <span className="text-brand-orange tracking-widest uppercase text-xs font-bold mb-3 block">Corporate Governance</span>
                    <h1 className="text-4xl md:text-5xl font-black text-white mb-4">Standard Trading Terms</h1>
                    <p className="text-gray-300 text-lg max-w-2xl mx-auto font-normal">
                        These standard trading terms govern all forwarding, customs brokerage, and logistics operations undertaken by Sentron Global Logistics.
                    </p>
                    <p className="text-gray-400 text-xs mt-3">Effective: 2026 | Compliant with FIATA & Indian Custom House Broker Regulations</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="glass-panel-dark rounded-[2rem] p-8 md:p-14 border border-brand-accent/20"
                >
                    <Section title="1. Definitions & Corporate Capacity">
                        <p><strong className="text-white">"Company"</strong> refers to Sentron Global Logistics, with registered offices at No.16, Dhanalakshmi Nagar, Kadappa Road, Puthagaram, Kolathur, Chennai – 600 099, India.</p>
                        <p><strong className="text-white">"Customer"</strong> refers to any commercial shipper, consignee, exporter, importer, or authorized agent contracting services with the Company.</p>
                        <p><strong className="text-white">"Services"</strong> includes Multimodal Ocean Freight (FCL/LCL), Express Air Cargo, Port Haulage, Customs Clearance, Warehousing, and Documentation.</p>
                    </Section>

                    <Section title="2. Scope of Operations">
                        <p>The Company acts as an accredited freight forwarder and licensed Custom House Agent. All bookings are executed in accordance with international maritime conventions (Hague-Visby Rules), international aviation conventions (Montreal Convention), and the Customs Act of India.</p>
                    </Section>

                    <Section title="3. Rates, Tariffs & Demurrage Shield">
                        <p>Quotations are issued based on prevailing freight market rates, bunker adjustment factors (BAF), currency adjustment factors (CAF), and terminal tariffs. The Company operates a transparent pricing framework with zero hidden administrative markups. Standard free time and container detention terms are communicated clearly on all booking confirmations.</p>
                    </Section>

                    <Section title="4. Governing Law & Legal Contact">
                        <p>These terms shall be governed by and construed in accordance with the laws of India, under the jurisdiction of the courts of Chennai, Tamil Nadu.</p>
                        <div className="bg-white/5 border border-brand-accent/20 rounded-2xl p-6 mt-4">
                            <p className="text-white font-bold text-lg">Sentron Global Logistics</p>
                            <p className="text-gray-300 text-sm mt-1">Legal & Regulatory Compliance Department</p>
                            <p className="text-gray-400 text-sm mt-1">No.16, Dhanalakshmi Nagar, Kadappa Road, Puthagaram, Kolathur, Chennai – 600 099, India</p>
                            <p className="text-brand-highlight text-sm mt-1">✉️ sales@sentronglobal.com | 📞 +91 98413 93916</p>
                        </div>
                    </Section>
                </motion.div>

                <div className="mt-12 text-center">
                    <Link to="/contact" className="inline-flex items-center gap-2 bg-brand-orange hover:bg-brand-orangeHover text-white font-bold px-10 py-4 rounded-full transition-all shadow-neon-orange hover:-translate-y-1">
                        Contact Legal & Freight Desk <FiArrowRight />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default TermsAndConditions;
