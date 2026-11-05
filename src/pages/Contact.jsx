import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FiMapPin, FiPhone, FiMail, FiSend, FiClock, FiGlobe, FiShield, FiCheckCircle } from 'react-icons/fi';
import { db } from '../firebase/config';
import { ref, push, set } from 'firebase/database';

const Contact = () => {
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
    const [status, setStatus] = useState('idle'); // idle, loading, success, error

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');

        try {
            const newQueryRef = push(ref(db, 'queries'));
            await set(newQueryRef, {
                ...formData,
                status: 'New',
                createdAt: Date.now()
            });

            setStatus('success');
            setFormData({ name: '', email: '', phone: '', message: '' });
            setTimeout(() => setStatus('idle'), 5000);
        } catch (error) {
            console.error("Error submitting form:", error);
            setStatus('error');
            setTimeout(() => setStatus('idle'), 3000);
        }
    };

    const revealVariants = {
        hidden: { opacity: 0, y: 30, scale: 0.98 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }
    };

    return (
        <div className="w-full min-h-screen pt-24 pb-12 md:pt-32 md:pb-20 hallmark-container relative bg-transparent">
            <Helmet>
                <title>Contact Freight Desk | Sentron Global Logistics</title>
                <meta name="description" content="Connect with our licensed logistics directors and freight specialists for instant rate quotations, container booking, customs clearance, and global supply chain support." />
                <meta name="keywords" content="contact Sentron Global Logistics, freight quote, container shipping rates, Chennai customs clearance, air cargo inquiry" />
                <link rel="canonical" href="https://sentronglobal.com/contact" />
                <meta property="og:title" content="Contact Freight Desk | Sentron Global Logistics" />
                <meta property="og:description" content="Get an instant freight quote. Multimodal logistics, ocean freight, air cargo, and licensed customs brokerage." />
                <meta property="og:image" content="/sentron_logo.png" />
            </Helmet>

            {/* Page Header */}
            <motion.div
                initial="hidden"
                animate="visible"
                variants={revealVariants}
                className="max-w-2xl mb-12"
            >
                <span className="text-sm font-semibold text-brand-orange mb-2 block">Trade desk and commercial office</span>
                <h1 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tight leading-tight">
                    Connect with our freight directors.
                </h1>
                <p className="text-gray-300 text-base md:text-lg font-normal leading-relaxed">
                    Direct access to licensed logistics coordinators. Reach us by phone, email, or submit shipment specifications below for an 18-minute guaranteed quotation.
                </p>
            </motion.div>

            {/* Quick Info Banner */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
            >
                {[
                    { icon: FiPhone, title: 'Direct Desk Line', value: '+91 98413 93916', sub: 'Alternate: +91 93450 21647', href: 'tel:+919841393916' },
                    { icon: FiMail, title: 'Commercial Desk', value: 'sales@sentronglobal.com', sub: 'Guaranteed 18-minute response', href: 'mailto:sales@sentronglobal.com' },
                    { icon: FiClock, title: 'Operational Hours', value: 'Mon–Sat: 9:00 AM – 6:30 PM', sub: '24/7 Active Consignment Monitoring', href: null },
                ].map(({ icon: Icon, title, value, sub, href }) => (
                    <div key={title} className="glass-panel-dark rounded-[1.75rem] p-6 flex items-center gap-5 border border-brand-accent/20 hover:border-brand-highlight/40 transition-all duration-300">
                        <div className="w-14 h-14 rounded-2xl bg-brand-accent/20 border border-brand-accent/30 flex items-center justify-center text-brand-orange text-2xl shrink-0">
                            <Icon />
                        </div>
                        <div>
                            <p className="text-brand-orange text-[11px] font-bold uppercase tracking-widest mb-1">{title}</p>
                            {href ? (
                                <a href={href} className="text-white font-bold text-base hover:text-brand-highlight transition-colors">{value}</a>
                            ) : (
                                <p className="text-white font-bold text-base">{value}</p>
                            )}
                            <p className="text-gray-400 text-xs mt-0.5">{sub}</p>
                        </div>
                    </div>
                ))}
            </motion.div>

            <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">

                {/* Contact Info & Map */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    variants={revealVariants}
                    className="flex-[1.2] flex flex-col gap-6 lg:gap-10 relative z-10"
                >
                    <div>
                        <h2 className="text-3xl md:text-4xl font-black text-white mb-4 tracking-tight">
                            Headquarters & Regional Office
                        </h2>
                        <p className="text-gray-300 text-base leading-relaxed font-normal">
                            Centrally positioned in Chennai with strategic proximity to both Chennai Port Container Terminals and Chennai International Air Cargo Complex.
                        </p>
                    </div>

                    <div className="glass-panel-dark rounded-[2rem] p-6 md:p-8 flex flex-col gap-6 border border-brand-accent/20 shadow-xl">
                        <div className="flex gap-5 items-start group">
                            <div className="w-14 h-14 rounded-2xl bg-brand-accent/20 border border-brand-accent/30 flex items-center justify-center text-brand-orange text-2xl shrink-0 group-hover:scale-105 transition-transform">
                                <FiMapPin />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-base text-white mb-1">Corporate Address</h4>
                                <p className="text-gray-300 text-sm leading-relaxed">No.16, Dhanalakshmi Nagar, Kadappa Road, Puthagaram, Kolathur, Chennai - 600 099, Tamil Nadu, India.</p>
                            </div>
                        </div>

                        <div className="flex gap-5 items-center group">
                            <div className="w-14 h-14 rounded-2xl bg-brand-accent/20 border border-brand-accent/30 flex items-center justify-center text-brand-orange text-2xl shrink-0 group-hover:scale-105 transition-transform">
                                <FiPhone />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-base text-white mb-1">Direct Lines</h4>
                                <a href="tel:+919841393916" className="text-gray-300 text-sm hover:text-white transition-colors block">+91 98413 93916</a>
                                <a href="tel:+919345021647" className="text-gray-400 text-xs hover:text-white transition-colors block mt-0.5">+91 93450 21647</a>
                            </div>
                        </div>

                        <div className="flex gap-5 items-center group">
                            <div className="w-14 h-14 rounded-2xl bg-brand-accent/20 border border-brand-accent/30 flex items-center justify-center text-brand-orange text-2xl shrink-0 group-hover:scale-105 transition-transform">
                                <FiMail />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-base text-white mb-1">General & Commercial Inquiries</h4>
                                <a href="mailto:sales@sentronglobal.com" className="text-brand-highlight text-sm font-semibold hover:underline">sales@sentronglobal.com</a>
                            </div>
                        </div>

                        <div className="flex gap-5 items-center group">
                            <div className="w-14 h-14 rounded-2xl bg-brand-accent/20 border border-brand-accent/30 flex items-center justify-center text-brand-orange text-2xl shrink-0 group-hover:scale-105 transition-transform">
                                <FiGlobe />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-base text-white mb-1">Accreditations & Licenses</h4>
                                <p className="text-gray-300 text-xs">Custom House Agent (CHA) · IATA Accredited · DGFT Registered · AEO-T2 Compliant</p>
                            </div>
                        </div>
                    </div>

                    {/* Map */}
                    <a 
                        href="https://www.google.com/maps/dir/?api=1&destination=No.16,+Dhanalakshmi+Nagar,+Kadappa+Road,+Puthagaram,+Kolathur,+Chennai+-+600+099" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="hidden md:block w-full h-72 rounded-[2rem] overflow-hidden glass-panel-dark border border-brand-accent/20 p-2 relative group hover:shadow-neon-brand transition-all cursor-pointer"
                    >
                        <div className="absolute inset-0 z-10 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px]">
                            <span className="px-6 py-2.5 rounded-full bg-brand-orange text-white font-bold tracking-widest text-[11px] shadow-lg flex items-center gap-2">
                                Open Google Navigation <FiMapPin />
                            </span>
                        </div>
                        <iframe
                            src="https://maps.google.com/maps?q=No.16,+Dhanalakshmi+Nagar,+Kadappa+Road,+Puthagaram,+Kolathur,+Chennai+-+600+099&t=&z=15&ie=UTF8&iwloc=&output=embed"
                            width="100%"
                            height="100%"
                            className="rounded-[1.5rem] pointer-events-none"
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Sentron Global Logistics HQ location"
                            style={{ filter: "invert(90%) hue-rotate(180deg) contrast(1.2)" }}
                        ></iframe>
                    </a>
                </motion.div>

                {/* Contact Form */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    variants={{
                        hidden: { opacity: 0, x: 40, scale: 0.98 },
                        visible: { opacity: 1, x: 0, scale: 1, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.15 } }
                    }}
                    className="flex-[1.4] relative z-10"
                >
                    <div className="glass-panel-dark rounded-[2.5rem] p-6 md:p-12 h-full flex flex-col justify-center shadow-2xl border border-brand-accent/25">
                        <span className="text-brand-orange uppercase tracking-widest text-xs font-bold mb-2">Priority Freight Dispatch</span>
                        <h3 className="text-3xl md:text-4xl font-black mb-2 text-white tracking-tight">Request an Instant Quote</h3>
                        <p className="text-gray-300 mb-8 text-sm">Direct allocation to a specialized route officer. Response guaranteed within 18 minutes.</p>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                            <div className="flex flex-col gap-2">
                                <label htmlFor="name" className="text-xs font-bold uppercase tracking-widest text-gray-300">Your Full Name *</label>
                                <input
                                    id="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="E.g., Arvind Narayanan"
                                    className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 focus:border-brand-highlight focus:bg-white/10 transition-all text-white outline-none font-medium text-base placeholder-gray-500"
                                />
                            </div>

                            <div className="flex flex-col gap-5 sm:flex-row">
                                <div className="flex flex-col gap-2 flex-1">
                                    <label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-gray-300">Corporate Email *</label>
                                    <input
                                        id="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="arvind@company.com"
                                        className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 focus:border-brand-highlight focus:bg-white/10 transition-all text-white outline-none font-medium text-base placeholder-gray-500"
                                    />
                                </div>
                                <div className="flex flex-col gap-2 flex-1">
                                    <label htmlFor="phone" className="text-xs font-bold uppercase tracking-widest text-gray-300">Phone / WhatsApp *</label>
                                    <input
                                        id="phone"
                                        type="tel"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="+91 98413 93916"
                                        className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 focus:border-brand-highlight focus:bg-white/10 transition-all text-white outline-none font-medium text-base placeholder-gray-500"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label htmlFor="message" className="text-xs font-bold uppercase tracking-widest text-gray-300">Shipment Details & Corridor Parameters *</label>
                                <textarea
                                    id="message"
                                    rows="5"
                                    value={formData.message}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Cargo description, origin port, destination port, container type (20ft/40ft) or weight/volume (kg/cbm)..."
                                    className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 focus:border-brand-highlight focus:bg-white/10 transition-all text-white outline-none font-medium text-base placeholder-gray-500 resize-none"
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                disabled={status === 'loading'}
                                className="mt-4 w-full sm:w-auto px-10 py-4 rounded-full bg-brand-orange text-white font-bold text-base flex justify-center items-center gap-3 hover:bg-brand-orangeHover shadow-neon-orange hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {status === 'loading' ? (
                                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
                                ) : status === 'success' ? (
                                    <>Request Sent Successfully ✓</>
                                ) : (
                                    <>Send Freight Inquiry <FiSend /></>
                                )}
                            </button>

                            {status === 'success' && (
                                <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 flex items-center gap-3 text-emerald-300 text-sm font-semibold">
                                    <FiCheckCircle className="text-emerald-400 text-xl shrink-0" />
                                    <span>Inquiry received! A Sentron logistics director is preparing your rate schedule.</span>
                                </div>
                            )}

                            {status === 'error' && (
                                <p className="text-red-400 font-bold text-sm tracking-wide">Error submitting form. Please call our direct desk at +91 98413 93916.</p>
                            )}
                        </form>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Contact;
