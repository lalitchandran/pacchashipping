import React from 'react';

/**
 * SentronLogo Component
 * Renders the official Sentron Global Logistics logo (logo.png)
 * Pure transparent logo design without any background, paired with crisp typography.
 */
const SentronLogo = ({
    className = '',
    size = 'md', // 'sm' | 'md' | 'lg' | 'hero'
    showTagline = false,
    markOnly = false
}) => {
    const sizeMap = {
        sm: { img: 'h-8 md:h-9', text: 'text-base', sub: 'text-[9px]' },
        md: { img: 'h-10 md:h-11', text: 'text-lg md:text-xl', sub: 'text-[10px]' },
        lg: { img: 'h-12 md:h-14', text: 'text-xl md:text-2xl', sub: 'text-xs' },
        hero: { img: 'h-16 md:h-20', text: 'text-3xl md:text-4xl', sub: 'text-sm' },
    };

    const current = sizeMap[size] || sizeMap.md;

    return (
        <div className={`inline-flex items-center gap-3 select-none group ${className}`}>
            <img
                src="/logo.png"
                alt="Sentron Global Logistics emblem"
                className={`${current.img} w-auto object-contain shrink-0 filter drop-shadow-[0_2px_10px_rgba(0,119,200,0.3)] transition-transform duration-300 group-hover:scale-105`}
                loading="eager"
            />
            {!markOnly && (
                <div className="flex flex-col justify-center leading-none">
                    <span className={`font-black tracking-tight text-white ${current.text} transition-colors group-hover:text-brand-highlight`}>
                        SENTRON
                    </span>
                    <span className={`font-semibold text-brand-orange uppercase tracking-wider mt-1 ${current.sub}`}>
                        Global Logistics
                    </span>
                </div>
            )}
        </div>
    );
};

export default SentronLogo;
