import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FiBox, FiGlobe, FiSettings, FiArrowRight, FiTruck, FiShield, FiAnchor, FiPackage, FiFileText } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const ServiceCard = ({ icon: Icon, title, desc, imgSrc, to, badge }) => (
    <Link to={to || '/contact'} className="block h-full group">
        <div className="hallmark-surface p-8 h-full flex flex-col justify-between relative overflow-hidden">
            {imgSrc && (
                <div className="absolute top-0 right-0 w-44 h-44 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
                    <img src={imgSrc} alt="" className="w-full h-full object-cover rounded-bl-3xl" />
                </div>
            )}
            <div>
                {badge && (
                    <span className="text-xs text-brand-orange font-medium block mb-4">{badge}</span>
                )}
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-xl mb-6 text-brand-orange">
                    <Icon />
                </div>
                <h3 className="text-xl md:text-2xl font-bold mb-3 text-white tracking-tight">{title}</h3>
                <p className="text-gray-300 leading-relaxed text-sm font-normal">{desc}</p>
            </div>

            <div className="mt-8 flex items-center gap-2 text-brand-highlight text-sm font-semibold group-hover:text-white transition-colors">
                Learn more <FiArrowRight className="text-xs" />
            </div>
        </div>
    </Link>
);

const Services = () => {
    return (
        <main className="w-full min-h-screen pt-28 pb-16 sm:pt-32 sm:pb-24 bg-[#061325] text-left">
            <Helmet>
                <title>Global Logistics & Freight Solutions | Sentron Global Logistics</title>
                <meta name="description" content="Explore Sentron Global Logistics capabilities: Ocean Freight FCL/LCL, Express Air Cargo, Customs Brokerage, Warehousing, and Intermodal Transport." />
                <meta name="keywords" content="logistics services, freight forwarding solutions, export import freight, global trade logistics, Sentron Global Logistics" />
                <link rel="canonical" href="https://sentronglobal.com/services" />
            </Helmet>

            <div className="hallmark-container">
                <div className="max-w-3xl mb-12 sm:mb-16">
                    <span className="text-xs sm:text-sm font-semibold text-brand-orange mb-2 block">
                        Supply chain capabilities
                    </span>
                    <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-tight mb-4 sm:mb-6">
                        Complete logistics services for global trade.
                    </h1>
                    <p className="text-gray-300 text-base sm:text-lg font-normal leading-relaxed">
                        From licensed customs clearance and Tier-1 freight forwarding to door-to-door temperature-controlled delivery — Sentron Global Logistics orchestrates every leg of your international supply chain.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <ServiceCard
                            icon={FiAnchor}
                            title="Ocean and sea freight (FCL / LCL)"
                            desc="Comprehensive ocean container shipping for global manufacturers and commodity exporters. Full Container Load (FCL) and Less than Container Load (LCL) consolidation, direct bill of lading execution, and pre-arrival customs clearance across 65+ maritime corridors."
                            imgSrc="/sentron_ocean_freight.png"
                            to="/services/ocean"
                            badge="Core maritime freight"
                        />
                    </div>

                    <ServiceCard
                        icon={FiSettings}
                        title="Licensed customs brokerage"
                        desc="End-to-end import and export clearance by licensed Custom House Agents (CHA). Document filing, IEC compliance, HS tariff classification, and 96% pre-arrival clearance rate."
                        to="/contact"
                        badge="Customs & compliance"
                    />

                    <ServiceCard
                        icon={FiGlobe}
                        title="Air cargo express and priority"
                        desc="Expedited air freight for high-value and perishable industrial consignments. Next-flight-out prioritization, cold-chain monitoring, and express customs handover."
                        imgSrc="/sentron_air_freight.png"
                        to="/services/air"
                        badge="Time-critical"
                    />

                    <ServiceCard
                        icon={FiTruck}
                        title="Intermodal road and port haulage"
                        desc="GPS-monitored container trucking, port drayage, and pan-India road freight coordinating terminal gates directly with factory docks and distribution centers."
                        imgSrc="/sentron_road_freight.png"
                        to="/services/road"
                        badge="Overland distribution"
                    />

                    <ServiceCard
                        icon={FiPackage}
                        title="Smart warehousing and 3PL"
                        desc="Bonded and ambient hub facilities positioned near maritime and airport hubs. Inventory management, kitting, cargo palletization, and regional cross-docking."
                        imgSrc="/sentron_warehouse.png"
                        to="/services/warehousing"
                        badge="Storage & fulfillment"
                    />
                </div>
            </div>
        </main>
    );
};

export default Services;

