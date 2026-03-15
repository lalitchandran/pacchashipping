import React from 'react';
import { motion } from 'framer-motion';
import { FiLock, FiShield, FiEye } from 'react-icons/fi';

const Section = ({ title, children }) => (
    <div className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-4 pb-3 border-b border-white/10">{title}</h2>
        <div className="text-gray-400 leading-relaxed space-y-4 text-[15px]">{children}</div>
    </div>
);

const PrivacyPolicy = () => {
    return (
        <div className="min-h-screen bg-[#050a07] pt-32 pb-20 px-6 relative">
            <div className="absolute inset-0 bg-gradient-to-b from-brand-primary/8 via-transparent to-transparent pointer-events-none" />

            <div className="max-w-4xl mx-auto relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <div className="w-16 h-16 rounded-2xl bg-brand-primary/15 flex items-center justify-center text-3xl text-brand-primary mx-auto mb-6">
                        <FiLock />
                    </div>
                    <span className="text-brand-highlight tracking-widest uppercase text-sm font-bold mb-4 block">Privacy</span>
                    <h1 className="text-4xl md:text-5xl font-black text-white mb-4">Privacy Policy</h1>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Your privacy is critical to us. This policy outlines how Paccha Universal Shipping Line Pvt. Ltd. handles your personal and business data.
                    </p>
                    <p className="text-gray-500 text-sm mt-4">Last updated: March 2026 | Compliant with IT Act 2000 (India)</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="glass-panel-dark rounded-[2rem] p-10 md:p-14 border border-white/5"
                >
                    <Section title="1. Information We Collect">
                        <p>We collect information necessary to provide logistics services, including:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Business details (Company name, GST, IEC number)</li>
                            <li>Contact information (Names, email addresses, phone numbers)</li>
                            <li>Shipping data (Origin, destination, cargo descriptions, value)</li>
                            <li>Communication records (Inquiries through our website or email)</li>
                        </ul>
                    </Section>

                    <Section title="2. How We Use Your Data">
                        <p>Your information is used solely for the purpose of executing logistics services:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Filing customs documentation and shipping bills</li>
                            <li>Booking space with carriers (Airlines and Ocean liners)</li>
                            <li>Providing freight rate quotations and tracking updates</li>
                            <li>Complying with regulatory requirements from CBIC and DGFT</li>
                        </ul>
                    </Section>

                    <Section title="3. Data Sharing & Disclosure">
                        <p>We do not sell your data. We share information only with trusted third parties essential to the shipping process:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Customs authorities and government portals (ICEGATE)</li>
                            <li>Shipping lines and airlines for cargo booking</li>
                            <li>Warehousing and inland transport partners</li>
                            <li>Insurance providers for cargo coverage</li>
                        </ul>
                    </Section>

                    <Section title="4. Data Security">
                        <p>We implement industry-standard security measures to protect your digital and physical records. Access to sensitive trade data is restricted to authorized personnel managing your specific shipments.</p>
                    </Section>

                    <Section title="5. Your Rights">
                        <p>You have the right to access, correct, or request the deletion of your personal contact data provided through our website. For regulatory shipping records, retention is mandated by Indian Customs Law for a period of up to 5 years.</p>
                    </Section>

                    <Section title="6. Cookies">
                        <p>Our website uses minimal cookies to enhance your browsing experience and for basic analytics to improve our service offerings.</p>
                    </Section>

                    <Section title="7. Contact Us">
                        <p>For any privacy-related concerns, please contact our data officer at:</p>
                        <div className="bg-white/5 border border-white/10 rounded-xl p-6 mt-4">
                            <p className="text-white font-bold">Paccha Universal Shipping Line Private Limited</p>
                            <p>✉️ admin@pacchashipping.in</p>
                            <p>📞 +91 98413 93916</p>
                        </div>
                    </Section>
                </motion.div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
