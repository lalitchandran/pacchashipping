import React from 'react';
import { Link } from 'react-router-dom';
import { FiPhone, FiMail, FiMapPin, FiLinkedin, FiFacebook, FiTwitter, FiShield, FiCheck } from 'react-icons/fi';
import SentronLogo from './SentronLogo';

const Footer = () => {
    return (
        <footer className="relative mt-16 sm:mt-20 pt-12 sm:pt-16 pb-10 sm:pb-12 bg-[#050D1A] border-t border-white/10 z-20 text-left">
            <div className="hallmark-container grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10 mb-10 sm:mb-12">

                {/* Brand Info */}
                <div className="col-span-1 md:col-span-1">
                    <Link to="/" className="inline-block mb-4">
                        <SentronLogo size="md" />
                    </Link>
                    <p className="text-gray-400 text-sm mb-5 leading-relaxed font-normal">
                        Enterprise freight forwarding, customs brokerage, and multimodal supply chains across 65+ countries.
                    </p>

                    <div className="flex flex-col gap-2 mb-6 text-xs text-gray-300">
                        <span className="flex items-center gap-1.5">
                            <FiCheck className="text-brand-orange" /> Licensed Customs Broker (CHA)
                        </span>
                        <span className="flex items-center gap-1.5">
                            <FiShield className="text-brand-orange" /> AEO-T2 and IATA Accredited
                        </span>
                    </div>

                    <div className="flex gap-2.5">
                        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
                            <FiLinkedin />
                        </a>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
                            <FiTwitter />
                        </a>
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
                            <FiFacebook />
                        </a>
                    </div>
                </div>

                {/* Navigation Links */}
                <div>
                    <h4 className="font-semibold text-sm mb-4 text-white">
                        Navigation
                    </h4>
                    <ul className="flex flex-col gap-2.5 text-sm text-gray-400">
                        <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
                        <li><Link to="/services" className="hover:text-white transition-colors">Freight services</Link></li>
                        <li><Link to="/updates" className="hover:text-white transition-colors">Trade updates</Link></li>
                        <li><Link to="/customers" className="hover:text-white transition-colors">Clients and reviews</Link></li>
                        <li><Link to="/contact" className="hover:text-white transition-colors">Contact desk</Link></li>
                    </ul>
                </div>

                {/* Services */}
                <div>
                    <h4 className="font-semibold text-sm mb-4 text-white">
                        Freight solutions
                    </h4>
                    <ul className="flex flex-col gap-2.5 text-sm text-gray-400">
                        <li><Link to="/services/ocean" className="hover:text-white transition-colors">Ocean freight (FCL / LCL)</Link></li>
                        <li><Link to="/services/air" className="hover:text-white transition-colors">Air cargo express</Link></li>
                        <li><Link to="/services/road" className="hover:text-white transition-colors">Intermodal road haulage</Link></li>
                        <li><Link to="/services/warehousing" className="hover:text-white transition-colors">Warehousing and distribution</Link></li>
                        <li><Link to="/services" className="hover:text-white transition-colors">Customs clearance (CHA)</Link></li>
                        <li><Link to="/services" className="hover:text-white transition-colors">Project cargo logistics</Link></li>
                    </ul>
                </div>

                {/* Direct Contact info */}
                <div>
                    <h4 className="font-semibold text-sm mb-4 text-white">
                        Commercial office
                    </h4>
                    <ul className="flex flex-col gap-3.5 text-sm text-gray-400">
                        <li className="flex gap-2.5 items-start">
                            <FiMapPin className="text-brand-orange mt-1 shrink-0" />
                            <span>No.16, Dhanalakshmi Nagar, Kadappa Road, Puthagaram, Kolathur, Chennai - 600 099, India</span>
                        </li>
                        <li className="flex gap-2.5 items-center">
                            <FiPhone className="text-brand-orange shrink-0" />
                            <div>
                                <a href="tel:+919841393916" className="hover:text-white transition-colors block">+91 98413 93916</a>
                                <a href="tel:+919345021647" className="hover:text-white transition-colors text-xs text-gray-500 block">+91 93450 21647</a>
                            </div>
                        </li>
                        <li className="flex gap-2.5 items-center">
                            <FiMail className="text-brand-orange shrink-0" />
                            <a href="mailto:sales@sentronglobal.com" className="hover:text-white transition-colors">sales@sentronglobal.com</a>
                        </li>
                    </ul>
                </div>

            </div>

            <div className="hallmark-container pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
                <p>© {new Date().getFullYear()} Sentron Global Logistics. All rights reserved.</p>
                <div className="flex gap-6">
                    <Link to="/privacy" className="hover:text-gray-300 transition-colors">Privacy policy</Link>
                    <Link to="/terms" className="hover:text-gray-300 transition-colors">Terms of trading</Link>
                    <Link to="/sitemap-page" className="hover:text-gray-300 transition-colors">Sitemap</Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
