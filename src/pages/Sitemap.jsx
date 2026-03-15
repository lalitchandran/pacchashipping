import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiMap, FiArrowRight } from 'react-icons/fi';

const SitemapSection = ({ title, links }) => (
    <div className="mb-10">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="w-2 h-2 bg-brand-primary rounded-full"></span>
            {title}
        </h2>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {links.map((link, idx) => (
                <li key={idx}>
                    <Link
                        to={link.to}
                        className="text-gray-400 hover:text-brand-highlight transition-colors flex items-center gap-2 group text-[15px]"
                    >
                        <FiArrowRight className="text-brand-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                        {link.label}
                    </Link>
                </li>
            ))}
        </ul>
    </div>
);

const Sitemap = () => {
    const sections = [
        {
            title: "Main Navigation",
            links: [
                { label: "Home", to: "/" },
                { label: "Our Services", to: "/services" },
                { label: "Trade News & Updates", to: "/updates" },
                { label: "Our Clients", to: "/customers" },
                { label: "Contact Us", to: "/contact" },
            ]
        },
        {
            title: "Logistics Services",
            links: [
                { label: "Ocean & Sea Freight", to: "/services/ocean" },
                { label: "Air Freight Solutions", to: "/services/air" },
                { label: "Road & Inland Transport", to: "/services/road" },
                { label: "Warehousing & Distribution", to: "/services/warehousing" },
                { label: "Customs Clearance", to: "/services" },
                { label: "Cargo Insurance", to: "/contact" },
            ]
        },
        {
            title: "Legal & Information",
            links: [
                { label: "Terms & Conditions", to: "/terms" },
                { label: "Privacy Policy", to: "/privacy" },
                { label: "Visual Sitemap", to: "/sitemap" },
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-[#050a07] pt-32 pb-20 px-6 relative">
            <div className="absolute inset-0 bg-gradient-to-b from-brand-primary/8 via-transparent to-transparent pointer-events-none" />

            <div className="max-w-4xl mx-auto relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="mb-16"
                >
                    <div className="w-16 h-16 rounded-2xl bg-brand-primary/15 flex items-center justify-center text-3xl text-brand-primary mb-6">
                        <FiMap />
                    </div>
                    <span className="text-brand-highlight tracking-widest uppercase text-sm font-bold mb-4 block">Navigation</span>
                    <h1 className="text-4xl md:text-5xl font-black text-white mb-4">Sitemap</h1>
                    <p className="text-gray-400 text-lg">
                        Find your way around our global logistics network and service offerings.
                    </p>
                </motion.div>

                <div className="glass-panel-dark rounded-[2rem] p-10 md:p-14 border border-white/5">
                    {sections.map((section, idx) => (
                        <SitemapSection key={idx} {...section} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Sitemap;
