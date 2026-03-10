import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FiArrowRight, FiGlobe, FiTruck, FiAnchor, FiTarget } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const StatItem = ({ end, label, suffix = '+' }) => {
    const nodeRef = useRef();

    useEffect(() => {
        let obj = { val: 0 };
        const tl = gsap.to(obj, {
            val: end,
            duration: 2,
            ease: "power2.out",
            scrollTrigger: {
                trigger: nodeRef.current,
                start: "top 85%",
                toggleActions: "play none none reverse"
            },
            onUpdate: () => {
                if (nodeRef.current) {
                    nodeRef.current.innerHTML = Math.floor(obj.val) + suffix;
                }
            }
        });
        return () => tl.kill();
    }, [end, suffix]);

    return (
        <div className="flex flex-col items-center p-8 bg-black/40 backdrop-blur-2xl rounded-[2rem] border border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_12px_40px_rgba(45,106,79,0.3)] hover:border-brand-primary/40 transition-all duration-500">
            <h3 ref={nodeRef} className="text-5xl md:text-7xl font-extrabold text-white mb-3 tracking-tighter">0{suffix}</h3>
            <p className="text-gray-400 font-bold tracking-widest uppercase text-xs md:text-sm text-center">{label}</p>
        </div>
    );
};

const SERVICE_ROUTES = {
    'Airfreight Logistics': '/services/air',
    'Ocean Freight Networks': '/services/ocean',
    'Road & Trucking Terminals': '/services/road',
    'Global Customs Intelligence': '/services/warehousing',
};

const ServiceCard = ({ title, description, image, Icon }) => {
    const route = SERVICE_ROUTES[title] || '/services';
    return (
        <motion.div
            initial={{ opacity: 0, y: 150 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-7xl mx-auto my-32 relative overflow-hidden rounded-[2.5rem] glass-panel-dark border border-white/10 flex flex-col md:flex-row group shadow-[0_10px_50px_rgba(0,0,0,0.8)]"
        >
            <div className="md:w-[45%] p-12 md:p-16 flex flex-col justify-center border-b md:border-b-0 md:border-r border-white/5 relative z-10 bg-[#050a07]/80 backdrop-blur-2xl">
                <div className="w-20 h-20 rounded-[1.5rem] bg-gradient-to-br from-brand-primary/30 to-black/50 flex items-center justify-center text-4xl text-brand-primary mb-10 border border-brand-primary/40 shadow-inner">
                    <Icon />
                </div>
                <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-white tracking-tight leading-[1.1]">{title}</h2>
                <p className="text-gray-300 text-lg md:text-xl leading-relaxed mb-12 font-medium">{description}</p>
                <Link to={route} className="inline-flex w-fit items-center gap-3 text-background font-bold bg-brand-primary hover:bg-brand-secondary px-8 py-4 rounded-full transition-all shadow-[0_4px_20px_rgba(45,106,79,0.4)] hover:shadow-neon-brand hover:-translate-y-1">
                    Explore Capability <FiArrowRight className="text-xl" />
                </Link>
            </div>
            <div className="md:w-[55%] h-[400px] md:h-auto relative overflow-hidden bg-[#050a07]">
                <img src={image} alt={title} loading="lazy" decoding="async" className="w-full h-full object-cover opacity-70 group-hover:scale-105 group-hover:opacity-100 transition-all duration-[2s] ease-out mix-blend-luminosity group-hover:mix-blend-normal" />
                <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-l from-[#050a07]/90 via-[#050a07]/20 to-transparent"></div>
            </div>
        </motion.div>
    );
};

const Home = () => {
    const { scrollYProgress } = useScroll();
    const yHeroText = useTransform(scrollYProgress, [0, 1], [0, 300]);
    const opacityHero = useTransform(scrollYProgress, [0, 0.4], [1, 0]);

    return (
        <div className="w-full relative bg-transparent min-h-screen">

            {/* FULL SCREEN VIDEO BACKGROUND */}
            <div className="fixed inset-0 w-full h-[100vh] z-[-1] pointer-events-none">
                <video autoPlay loop muted playsInline className="w-full h-full object-cover opacity-[0.75]">
                    <source src="/introvideo.mp4" type="video/mp4" />
                </video>
                {/* Dark gradient overlay to ensure text readability */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-[#050a07]/80"></div>
            </div>

            {/* HERO TEXT OVER VIDEO */}
            <div className="h-screen w-full flex flex-col items-center justify-center pt-20 relative z-10 px-6">
                <motion.div style={{ y: yHeroText, opacity: opacityHero }} className="text-center w-full max-w-7xl mx-auto flex flex-col items-center">
                    <motion.h1
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 1, ease: 'easeOut', delay: 0.1 }}
                        className="text-6xl md:text-[9rem] lg:text-[11rem] font-black pb-6 leading-[0.85] tracking-tighter text-white drop-shadow-2xl"
                    >
                        Velocity.<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-highlight to-brand-primary">Redefined.</span>
                    </motion.h1>
                    <motion.p
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
                        className="mt-8 text-lg md:text-2xl text-gray-300 font-medium max-w-2xl mx-auto leading-relaxed"
                    >
                        Global Integrator of Container Logistics — Engineering precision at every port, every mile.
                    </motion.p>
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 1, ease: 'easeOut', delay: 0.5 }}
                        className="mt-10 flex gap-4"
                    >
                        <Link to="/services" className="inline-flex items-center gap-2 bg-brand-primary hover:bg-brand-highlight text-white font-bold px-8 py-4 rounded-full transition-all shadow-[0_4px_20px_rgba(45,106,79,0.5)] hover:-translate-y-1">
                            Explore Services <FiArrowRight />
                        </Link>
                        <Link to="/contact" className="inline-flex items-center gap-2 border border-white/20 hover:border-brand-primary/60 text-white font-bold px-8 py-4 rounded-full transition-all hover:bg-white/5 hover:-translate-y-1">
                            Get in Touch
                        </Link>
                    </motion.div>
                </motion.div>
            </div>

            {/* STATS SECTION */}
            <section className="py-20 relative z-10 bg-transparent scroll-mt-32">
                <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
                    <StatItem end={15} label="Years Defining Trade" />
                    <StatItem end={500} label="Global Enterprise Partners" />
                    <StatItem end={20} suffix="M+" label="TEUs Moved Annually" />
                    <StatItem end={120} label="Ports Connected Worldwide" />
                </div>
            </section>

            {/* SMOOTH SCROLL SERVICES */}
            <section className="py-32 px-6 relative z-10 bg-transparent">
                <div className="text-center md:text-left md:ml-[5%] mb-24 max-w-4xl">
                    <span className="text-brand-highlight tracking-widest uppercase text-sm font-bold mb-6 block">Core Infrastructure</span>
                    <h2 className="text-5xl md:text-8xl font-black text-white tracking-tight drop-shadow-2xl leading-[1]">Engineered<br />for Scale.</h2>
                </div>

                <ServiceCard
                    title="Airfreight Logistics"
                    description="Commanding the world's largest air corridors. We provide dedicated charter flights and priority cargo space to guarantee your high-value shipments arrive with absolute velocity."
                    image="/airport_cargo_board_1772904791588.png"
                    Icon={FiTarget}
                />

                <ServiceCard
                    title="Ocean Freight Networks"
                    description="Connecting 120+ global ports. From massive container vessels to specialized bulk carriers, our ocean networks deliver your cargo with unparalleled safety & volume capacity."
                    image="/shipping_port_containers_1772904872607.png"
                    Icon={FiAnchor}
                />

                <ServiceCard
                    title="Road & Trucking Terminals"
                    description="Engineering massive lifts and out-of-gauge machinery transport via extensive road networks. We build ground infrastructure for the world's largest industrial projects."
                    image="/logistics_truck_highway_1772904827988.png"
                    Icon={FiTruck}
                />

                <ServiceCard
                    title="Global Customs Intelligence"
                    description="Navigating complex cross-border compliance with zero-delay automated clearing. Our agents ensure seamless transit across all international jurisdictions."
                    image="/railway_freight_train_1772904925601.png"
                    Icon={FiGlobe}
                />
            </section>

            <div className="h-20"></div>
        </div>
    );
};

export default Home;
