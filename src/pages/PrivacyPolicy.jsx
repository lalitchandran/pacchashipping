import React from 'react';
import { motion } from 'framer-motion';
import { FiLock } from 'react-icons/fi';
import { Helmet } from 'react-helmet-async';

const Section = ({ title, children }) => (
    <div className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-4 pb-3 border-b border-white/10">{title}</h2>
        <div className="text-gray-300 leading-relaxed space-y-4 text-[15px]">{children}</div>
    </div>
);

const PrivacyPolicy = () => {
    return (
        <div className="min-h-screen bg-[#061325] pt-32 pb-20 px-6 relative">
            <Helmet>
                <title>Privacy Policy | Sentron Global Logistics</title>
                <meta name="description" content="Privacy Policy of Sentron Global Logistics regarding commercial shipping data, client protection, and international data standards." />
                <link rel="canonical" href="https://sentronglobal.com/privacy" />
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
                        <FiLock />
                    </div>
                    <span className="text-brand-orange tracking-widest uppercase text-xs font-bold mb-3 block">Data Governance</span>
                    <h1 className="text-4xl md:text-5xl font-black text-white mb-4">Privacy & Data Policy</h1>
                    <p className="text-gray-300 text-lg max-w-2xl mx-auto font-normal">
                        Sentron Global Logistics adheres to international data protection principles for all client corporate, financial, and customs records.
                    </p>
                    <p className="text-gray-400 text-xs mt-3">Effective: 2026 | Compliant with International Maritime & Customs Laws</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="glass-panel-dark rounded-[2rem] p-8 md:p-14 border border-brand-accent/20"
                >
                    <Section title="1. Information We Collect">
                        <p>We collect data strictly required to execute international and domestic logistics services:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Corporate & Regulatory Credentials (IEC, GSTIN, EORI, Tax Identification Numbers)</li>
                            <li>Operational Contact Personnel (Logistics Directors, Dispatch Supervisors)</li>
                            <li>Consignment Documentation (Commercial Invoices, Bills of Lading, Packing Lists, HS Codes)</li>
                            <li>EDI Electronic Tracking & GPS Waypoint Records</li>
                        </ul>
                    </Section>

                    <Section title="2. Purpose of Processing">
                        <p>Data is used exclusively to facilitate compliant cargo movement:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Customs clearance filing at ICEGATE, port authorities, and foreign terminals</li>
                            <li>Carrier space allocation with shipping lines and international air cargo operators</li>
                            <li>Direct shipment tracking, status notifications, and Proof of Delivery (POD) execution</li>
                            <li>Compliance with statutory anti-smuggling and international trade sanctions checks</li>
                        </ul>
                    </Section>

                    <Section title="3. Data Sharing & Security">
                        <p>Sentron Global Logistics does not sell, lease, or monetize client trade data. Data is shared exclusively with designated terminal operators, customs authorities, and vetted carrier partners under strict confidentiality agreements.</p>
                    </Section>

                    <Section title="4. Contact Compliance Officer">
                        <p>For data privacy or record retention inquiries, contact:</p>
                        <div className="bg-white/5 border border-brand-accent/20 rounded-2xl p-6 mt-4">
                            <p className="text-white font-bold text-base">Sentron Global Logistics</p>
                            <p className="text-gray-300 text-sm mt-1">Data Protection & Regulatory Desk</p>
                            <p className="text-brand-highlight text-sm mt-1">✉️ sales@sentronglobal.com</p>
                            <p className="text-gray-400 text-sm mt-0.5">📞 +91 98413 93916</p>
                        </div>
                    </Section>
                </motion.div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
