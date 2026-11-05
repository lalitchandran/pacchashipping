import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiSend, FiCheckCircle } from 'react-icons/fi';
import { db } from '../firebase/config';
import { ref, push, set } from 'firebase/database';

const QuickQuoteDrawer = ({ isOpen, onClose }) => {
    const [status, setStatus] = useState('idle');
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        service: '',
        message: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');

        try {
            const newQueryRef = push(ref(db, 'queries'));
            await set(newQueryRef, {
                name: formData.name,
                email: 'N/A (Quick Quote)',
                phone: formData.phone,
                message: `[Service: ${formData.service}] ${formData.message}`,
                status: 'New',
                createdAt: Date.now()
            });

            setStatus('success');
            setTimeout(() => {
                setStatus('idle');
                setFormData({ name: '', phone: '', service: '', message: '' });
                onClose();
            }, 2000);
        } catch (error) {
            console.error("Error submitting quote:", error);
            setStatus('idle');
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 28, stiffness: 220 }}
                        className="fixed top-0 right-0 h-full w-full max-w-md z-50 p-6 sm:p-8 bg-[#0A2240] text-white border-l border-white/10 overflow-y-auto shadow-2xl flex flex-col justify-between"
                    >
                        <div>
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <span className="text-xs font-semibold text-brand-orange mb-1 block">
                                        Commercial freight desk
                                    </span>
                                    <h2 className="text-2xl font-bold text-white tracking-tight">
                                        Request rate quotation
                                    </h2>
                                    <p className="text-gray-300 text-xs mt-1">
                                        Guaranteed all-inclusive quote response within 18 minutes.
                                    </p>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-3 min-w-[44px] min-h-[44px] rounded-lg bg-white/5 text-gray-300 hover:text-white hover:bg-white/10 transition-colors flex items-center justify-center"
                                    aria-label="Close quote drawer"
                                >
                                    <FiX className="text-xl" />
                                </button>
                            </div>

                            {status === 'success' ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="flex flex-col items-center justify-center py-16 text-center gap-4 p-6 bg-white/5 rounded-2xl border border-white/10"
                                >
                                    <FiCheckCircle className="text-5xl text-brand-orange" />
                                    <h3 className="text-xl font-bold text-white">Inquiry received</h3>
                                    <p className="text-gray-300 text-sm max-w-xs">
                                        A dedicated Sentron freight specialist is reviewing your route parameters and will reply shortly.
                                    </p>
                                </motion.div>
                            ) : (
                                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                                    <div className="flex flex-col gap-1.5">
                                        <label htmlFor="qq-name" className="text-xs font-medium text-gray-300">
                                            Full name
                                        </label>
                                        <input
                                            id="qq-name"
                                            name="name"
                                            required
                                            type="text"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/15 focus:border-brand-highlight focus:bg-white/10 transition-colors text-white outline-none text-base placeholder-gray-500 min-h-[48px]"
                                            placeholder="E.g., David Miller"
                                        />
                                    </div>

                                    <div className="flex flex-col gap-1.5">
                                        <label htmlFor="qq-phone" className="text-xs font-medium text-gray-300">
                                            Phone or WhatsApp number
                                        </label>
                                        <input
                                            id="qq-phone"
                                            name="phone"
                                            required
                                            type="tel"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/15 focus:border-brand-highlight focus:bg-white/10 transition-colors text-white outline-none text-base placeholder-gray-500 min-h-[48px]"
                                            placeholder="+91 98413 93916"
                                        />
                                    </div>

                                    <div className="flex flex-col gap-1.5">
                                        <label htmlFor="qq-service" className="text-xs font-medium text-gray-300">
                                            Required freight service
                                        </label>
                                        <select
                                            id="qq-service"
                                            name="service"
                                            required
                                            value={formData.service}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-lg bg-[#081B33] border border-white/15 focus:border-brand-highlight transition-colors text-white outline-none text-base min-h-[48px]"
                                        >
                                            <option value="" disabled>Select freight mode...</option>
                                            <option value="ocean-fcl">Ocean Freight (FCL Full Container)</option>
                                            <option value="ocean-lcl">Ocean Freight (LCL Consolidated)</option>
                                            <option value="air-cargo">Air Cargo Express & Priority</option>
                                            <option value="customs">Customs Brokerage & Clearance (CHA)</option>
                                            <option value="road-haulage">Intermodal Road & Port Drayage</option>
                                            <option value="warehousing">Smart Warehousing & 3PL</option>
                                        </select>
                                    </div>

                                    <div className="flex flex-col gap-1.5">
                                        <label htmlFor="qq-details" className="text-xs font-medium text-gray-300">
                                            Cargo and trade lane details
                                        </label>
                                        <textarea
                                            id="qq-details"
                                            name="message"
                                            required
                                            rows="3"
                                            value={formData.message}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/15 focus:border-brand-highlight focus:bg-white/10 transition-colors text-white outline-none text-base resize-none placeholder-gray-500"
                                            placeholder="Origin port, destination port, commodity type, weight or container count..."
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={status === 'loading'}
                                        className="btn-primary w-full py-3.5 mt-2 text-base font-semibold"
                                    >
                                        {status === 'loading' ? (
                                            <span>Submitting inquiry...</span>
                                        ) : (
                                            <>
                                                <span>Submit for guaranteed quote</span>
                                                <FiSend className="text-sm" />
                                            </>
                                        )}
                                    </button>
                                    <p className="text-[11px] text-center text-gray-400 mt-1">
                                        Zero hidden surcharges. Direct senior coordinator assignment.
                                    </p>
                                </form>
                            )}
                        </div>

                        <div className="pt-6 border-t border-white/10 text-xs text-gray-400 flex justify-between items-center">
                            <span>Direct desk hotline:</span>
                            <a href="tel:+919841393916" className="text-white hover:text-brand-orange font-medium">
                                +91 98413 93916
                            </a>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default QuickQuoteDrawer;
