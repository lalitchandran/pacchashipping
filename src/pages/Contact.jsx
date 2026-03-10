import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiMapPin, FiPhone, FiMail, FiSend } from 'react-icons/fi';
import { db } from '../firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { sendContactEmail } from '../services/emailService';

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
            // 1. Save to Firestore
            await addDoc(collection(db, 'queries'), {
                ...formData,
                status: 'New',
                createdAt: serverTimestamp()
            });

            // 2. Trigger EmailJS
            await sendContactEmail(formData);

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
        hidden: { opacity: 0, y: 40, scale: 0.98 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
    };

    return (
        <div className="w-full min-h-screen pt-32 pb-20 px-6 max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-16 relative bg-transparent">

            {/* Contact Info & Map */}
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={revealVariants}
                className="flex-[1.2] flex flex-col gap-10 relative z-10"
            >
                <div>
                    <span className="text-brand-highlight tracking-widest uppercase text-sm font-bold mb-4 block">Global Command Center</span>
                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight leading-tight">
                        Initialize Partnership.
                    </h1>
                    <p className="text-gray-400 text-xl leading-relaxed max-w-lg font-medium">
                        Engage with our enterprise architects to engineer the perfect global supply chain solution for your massive operations.
                    </p>
                </div>

                <div className="glass-panel-dark rounded-[2rem] p-10 flex flex-col gap-8 border border-white/5 shadow-[0_12px_40px_rgba(0,0,0,0.4)] hover:shadow-neon-brand hover:border-brand-primary/30 transition-shadow transition-all duration-500">
                    <div className="flex gap-6 items-center group">
                        <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center text-brand-highlight text-2xl shrink-0 group-hover:bg-brand-primary group-hover:text-white transition-colors duration-300">
                            <FiMapPin />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-lg text-white mb-1">Global Headquarters</h4>
                            <p className="text-gray-400 text-[15px] leading-relaxed font-medium">No.16, Dhanalakshmi Nagar, Kadappa Road, Puthagaram, Kolathur, Chennai - 600 099.</p>
                        </div>
                    </div>
                    <div className="flex gap-6 items-center group">
                        <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center text-brand-highlight text-2xl shrink-0 group-hover:bg-brand-primary group-hover:text-white transition-colors duration-300">
                            <FiPhone />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-lg text-white mb-1">Network Operations</h4>
                            <p className="text-gray-400 text-[15px] leading-relaxed font-medium">+91 98413 93916 / +91 9345021647</p>
                        </div>
                    </div>
                    <div className="flex gap-6 items-center group">
                        <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center text-brand-highlight text-2xl shrink-0 group-hover:bg-brand-primary group-hover:text-white transition-colors duration-300">
                            <FiMail />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-lg text-white mb-1">Enterprise Email</h4>
                            <p className="text-brand-primary text-[15px] font-semibold hover:text-brand-highlight transition-colors cursor-pointer">lsasudhamani@gmail.com</p>
                        </div>
                    </div>
                </div>

                {/* Map Container - Google Maps embed placeholder */}
                <div className="w-full h-80 rounded-[2rem] overflow-hidden glass-panel-dark border border-white/5 p-2 relative group hover:shadow-neon-brand transition-all">
                    <div className="absolute inset-0 z-10 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px] pointer-events-none">
                        <span className="px-6 py-2 rounded-full bg-brand-primary text-white font-bold tracking-widest text-[11px] shadow-lg">Access Map Feed</span>
                    </div>
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1m2!1s0x3a52642ebda01511%3A0x6bba59bb9cc5dc70!2sKolathur%2C%20Chennai%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                        width="100%"
                        height="100%"
                        className="rounded-[1.5rem]"
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Paccha HQ location"
                        style={{ filter: "invert(90%) hue-rotate(180deg) contrast(1.2)" }}
                    ></iframe>
                </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={{
                    hidden: { opacity: 0, x: 50, scale: 0.98 },
                    visible: { opacity: 1, x: 0, scale: 1, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 } }
                }}
                className="flex-[1.4] relative z-10"
            >
                <div className="glass-panel-dark rounded-[2.5rem] p-10 md:p-14 h-full flex flex-col justify-center shadow-[0_20px_60px_rgba(0,0,0,0.5)] border border-white/5">
                    <h3 className="text-4xl font-bold mb-10 text-white tracking-tight">System Request Form</h3>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                        <div className="flex flex-col gap-3 relative">
                            <label htmlFor="name" className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">Enterprise Representative</label>
                            <input
                                id="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                                placeholder="Sudhamani A"
                                className="w-full px-6 py-5 rounded-2xl glass-input border border-transparent focus:bg-white/10 focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/20 transition-all text-white outline-none font-medium text-lg placeholder-gray-500"
                            />
                        </div>

                        <div className="flex flex-col md:flex-row gap-8">
                            <div className="flex flex-col gap-3 flex-1 relative">
                                <label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">Secure Email</label>
                                <input
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="contact@enterprise.com"
                                    className="w-full px-6 py-5 rounded-2xl glass-input border border-transparent focus:bg-white/10 focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/20 transition-all text-white outline-none font-medium text-lg placeholder-gray-500"
                                />
                            </div>
                            <div className="flex flex-col gap-3 flex-1 relative">
                                <label htmlFor="phone" className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">Direct Line</label>
                                <input
                                    id="phone"
                                    type="tel"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="+91 99999 99999"
                                    className="w-full px-6 py-5 rounded-2xl glass-input border border-transparent focus:bg-white/10 focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/20 transition-all text-white outline-none font-medium text-lg placeholder-gray-500"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 relative">
                            <label htmlFor="message" className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">Logistics Architecture Request</label>
                            <textarea
                                id="message"
                                rows="6"
                                value={formData.message}
                                onChange={handleInputChange}
                                required
                                placeholder="Detail your massive capacity requirements..."
                                className="w-full px-6 py-5 rounded-2xl glass-input border border-transparent focus:bg-white/10 focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/20 transition-all text-white outline-none font-medium text-lg placeholder-gray-500 resize-none"
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            disabled={status === 'loading'}
                            className="mt-6 w-[240px] px-8 py-5 rounded-full bg-brand-primary text-white font-bold text-lg flex justify-center items-center gap-3 hover:bg-brand-highlight hover:shadow-[0_12px_30px_rgba(45,106,79,0.4)] hover:-translate-y-1 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed group"
                        >
                            {status === 'loading' ? (
                                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full" />
                            ) : status === 'success' ? (
                                <>Command Sent!</>
                            ) : (
                                <>Execute Request <FiSend className="group-hover:translate-x-1 transition-transform" /></>
                            )}
                        </button>
                        {status === 'success' && (
                            <p className="text-[#34C759] font-bold text-[15px] mt-4 tracking-wide animate-pulse">Request successfully executed. Enterprise architects will contact you shortly.</p>
                        )}
                        {status === 'error' && (
                            <p className="text-[#FF3B30] font-bold text-[15px] mt-4 tracking-wide animate-pulse">System error sending message. Please query again.</p>
                        )}
                    </form>
                </div>
            </motion.div>

        </div>
    );
};

export default Contact;
