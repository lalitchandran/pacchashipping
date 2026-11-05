import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiPhoneCall, FiChevronDown } from 'react-icons/fi';
import QuickQuoteDrawer from './QuickQuoteDrawer';
import SentronLogo from './SentronLogo';

const NavLinks = [
    { name: 'Home', path: '/' },
    {
        name: 'Services',
        path: '/services',
        dropdown: [
            { name: 'Ocean freight (FCL/LCL)', path: '/services/ocean' },
            { name: 'Air cargo express', path: '/services/air' },
            { name: 'Road & port haulage', path: '/services/road' },
            { name: 'Warehousing & 3PL', path: '/services/warehousing' }
        ]
    },
    { name: 'Trade updates', path: '/updates' },
    { name: 'Clients', path: '/customers' },
    { name: 'Contact', path: '/contact' },
];

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [isQuoteOpen, setIsQuoteOpen] = useState(false);
    const [mobileServicesOpen, setMobileServicesOpen] = useState(true);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 15);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        setIsOpen(false);
    }, [location]);

    return (
        <>
            <header
                className={`fixed top-0 left-0 w-full z-40 transition-colors duration-200 ${
                    scrolled
                        ? 'bg-[#061325]/95 backdrop-blur-md py-3 border-b border-white/10 shadow-lg'
                        : 'bg-transparent py-4 sm:py-5'
                }`}
            >
                <div className="hallmark-container flex justify-between items-center">
                    {/* Brand Logo */}
                    <Link to="/" className="flex items-center z-50 focus-visible:ring-2 focus-visible:ring-brand-orange rounded-lg">
                        <SentronLogo size="md" />
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-7" aria-label="Main Navigation">
                        <div className="flex gap-7 items-center">
                            {NavLinks.map((link) => (
                                <div key={link.name} className="relative group">
                                    <Link
                                        to={link.path}
                                        className={`text-sm font-medium transition-colors hover:text-white py-2 flex items-center gap-1 ${
                                            (location.pathname.startsWith(link.path) && link.path !== '/') || location.pathname === link.path
                                                ? 'text-brand-orange'
                                                : 'text-gray-300'
                                        }`}
                                    >
                                        {link.name}
                                        {link.dropdown && <FiChevronDown className="text-xs group-hover:rotate-180 transition-transform duration-150" />}
                                    </Link>

                                    {/* Desktop Dropdown Menu */}
                                    {link.dropdown && (
                                        <div className="absolute top-full left-0 mt-1 w-60 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-150 pt-2 z-50">
                                            <div className="bg-[#0A2240] border border-white/10 rounded-xl shadow-xl overflow-hidden flex flex-col py-1.5">
                                                {link.dropdown.map(sublink => (
                                                    <Link
                                                        key={sublink.name}
                                                        to={sublink.path}
                                                        className={`px-4 py-2.5 text-xs font-medium hover:bg-white/5 hover:text-white transition-colors block ${
                                                            location.pathname === sublink.path ? 'text-brand-orange bg-white/5' : 'text-gray-300'
                                                        }`}
                                                    >
                                                        {sublink.name}
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Direct Phone & Quote Action */}
                        <div className="flex items-center gap-4 pl-4 border-l border-white/10">
                            <a
                                href="tel:+919841393916"
                                className="hidden lg:flex items-center gap-1.5 text-xs font-medium text-gray-300 hover:text-white transition-colors"
                            >
                                <FiPhoneCall className="text-brand-orange text-sm" />
                                <span>+91 98413 93916</span>
                            </a>

                            <button
                                onClick={() => setIsQuoteOpen(true)}
                                className="btn-primary py-2 px-4 text-xs font-semibold"
                            >
                                Get quote
                            </button>
                        </div>
                    </nav>

                    {/* Accessible Mobile Menu Toggle Button (Min 48x48px touch target) */}
                    <button
                        className="md:hidden w-12 h-12 flex items-center justify-center rounded-lg text-white hover:text-brand-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange transition-colors z-50"
                        onClick={() => setIsOpen(!isOpen)}
                        aria-label={isOpen ? "Close menu" : "Open menu"}
                        aria-expanded={isOpen}
                    >
                        {isOpen ? <FiX className="text-2xl" /> : <FiMenu className="text-2xl" />}
                    </button>
                </div>
            </header>

            {/* Mobile Menu Drawer Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-30 bg-[#061325]/98 backdrop-blur-2xl md:hidden flex flex-col justify-between pt-24 pb-8 px-6 overflow-y-auto"
                    >
                        <div className="flex flex-col gap-5 max-w-sm mx-auto w-full">
                            <Link to="/" onClick={() => setIsOpen(false)} className="self-center mb-2">
                                <SentronLogo size="lg" />
                            </Link>

                            <div className="flex flex-col divide-y divide-white/5 border-t border-b border-white/10">
                                {NavLinks.map((link) => (
                                    <div key={link.name} className="py-2.5">
                                        {link.dropdown ? (
                                            <div>
                                                <button
                                                    onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                                                    className="w-full flex items-center justify-between text-base font-semibold text-white py-1.5"
                                                >
                                                    <span>{link.name}</span>
                                                    <FiChevronDown className={`text-sm transition-transform duration-200 ${mobileServicesOpen ? 'rotate-180 text-brand-orange' : 'text-gray-400'}`} />
                                                </button>
                                                {mobileServicesOpen && (
                                                    <div className="flex flex-col gap-2 pl-3 pt-2 pb-1">
                                                        {link.dropdown.map(sublink => (
                                                            <Link
                                                                key={sublink.name}
                                                                to={sublink.path}
                                                                onClick={() => setIsOpen(false)}
                                                                className="text-sm text-gray-300 hover:text-white py-1 flex items-center gap-2"
                                                            >
                                                                <span className="w-1.5 h-1.5 rounded-full bg-brand-orange" />
                                                                {sublink.name}
                                                            </Link>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <Link
                                                to={link.path}
                                                onClick={() => setIsOpen(false)}
                                                className="block text-base font-semibold text-white hover:text-brand-orange py-1.5"
                                            >
                                                {link.name}
                                            </Link>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Mobile Actions: Phone & Quote Button */}
                        <div className="flex flex-col gap-3 max-w-sm mx-auto w-full pt-4">
                            <button
                                onClick={() => { setIsOpen(false); setIsQuoteOpen(true); }}
                                className="btn-primary w-full py-3.5 text-sm font-semibold"
                            >
                                Request guaranteed quote
                            </button>
                            <a
                                href="tel:+919841393916"
                                className="btn-secondary w-full py-3 text-sm flex items-center justify-center gap-2"
                            >
                                <FiPhoneCall className="text-brand-orange text-sm" />
                                <span>Call desk: +91 98413 93916</span>
                            </a>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <QuickQuoteDrawer isOpen={isQuoteOpen} onClose={() => setIsQuoteOpen(false)} />
        </>
    );
};

export default Navbar;
