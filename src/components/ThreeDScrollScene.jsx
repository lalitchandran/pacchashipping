import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float, ContactShadows, RoundedBox, Cylinder, Cone } from '@react-three/drei';
import { motion } from 'framer-motion-3d';
import { useTransform } from 'framer-motion';

// Premium Apple-style Glass/Metal Material
const PremiumMaterial = () => (
    <meshPhysicalMaterial
        color="#e5e7eb"
        metalness={0.9}
        roughness={0.05}
        clearcoat={1}
        clearcoatRoughness={0.1}
        envMapIntensity={1.5}
    />
);

const PremiumDarkMaterial = () => (
    <meshPhysicalMaterial
        color="#1f2937"
        metalness={0.8}
        roughness={0.2}
        clearcoat={0.5}
        clearcoatRoughness={0.2}
        envMapIntensity={1}
    />
);

const PremiumAccentMaterial = () => (
    <meshPhysicalMaterial
        color="#0066CC"
        metalness={0.6}
        roughness={0.1}
        clearcoat={1}
        envMapIntensity={1.2}
    />
);

function ApplePlane({ scrollYProgress }) {
    const groupRef = useRef();

    // Plane enters from top right, flies across, scales up and rotates
    const x = useTransform(scrollYProgress, [0, 0.3], [15, -2]);
    const y = useTransform(scrollYProgress, [0, 0.3], [10, 2]);
    const z = useTransform(scrollYProgress, [0, 0.3], [-20, 0]);

    // Complex rotation mimicking a banking turn
    const rotX = useTransform(scrollYProgress, [0, 0.3], [Math.PI / 8, Math.PI / 12]);
    const rotY = useTransform(scrollYProgress, [0, 0.3], [-Math.PI / 4, Math.PI / 6]);
    const rotZ = useTransform(scrollYProgress, [0, 0.3], [Math.PI / 4, -Math.PI / 16]);

    const scale = useTransform(scrollYProgress, [0, 0.3, 0.4], [0.1, 1, 1.2]);
    const opacity = useTransform(scrollYProgress, [0.3, 0.4], [1, 0]);

    return (
        <motion.group
            ref={groupRef}
            position-x={x} position-y={y} position-z={z}
            rotation-x={rotX} rotation-y={rotY} rotation-z={rotZ}
            scale={scale}
            visible={useTransform(scrollYProgress, p => p < 0.41)}
        >
            <Float floatIntensity={0.5} speed={2}>
                <group>
                    {/* Fuselage */}
                    <RoundedBox args={[1.5, 1.5, 8]} radius={0.7} smoothness={8}>
                        <PremiumMaterial />
                    </RoundedBox>
                    {/* Main Wings */}
                    <RoundedBox args={[12, 0.2, 2]} position={[0, -0.2, 0]} radius={0.1}>
                        <PremiumMaterial />
                    </RoundedBox>
                    {/* Engines */}
                    <Cylinder args={[0.4, 0.4, 1.5, 32]} rotation={[Math.PI / 2, 0, 0]} position={[3, -0.8, 0.5]}>
                        <PremiumDarkMaterial />
                    </Cylinder>
                    <Cylinder args={[0.4, 0.4, 1.5, 32]} rotation={[Math.PI / 2, 0, 0]} position={[-3, -0.8, 0.5]}>
                        <PremiumDarkMaterial />
                    </Cylinder>
                    {/* Tail */}
                    <RoundedBox args={[0.2, 2, 1.5]} position={[0, 1.2, -3.5]} radius={0.1}>
                        <PremiumAccentMaterial />
                    </RoundedBox>
                    <RoundedBox args={[4, 0.1, 1]} position={[0, 0, -3.8]} radius={0.05}>
                        <PremiumMaterial />
                    </RoundedBox>
                    {/* Cockpit */}
                    <RoundedBox args={[1.2, 0.5, 1]} position={[0, 0.6, 2.5]} radius={0.2}>
                        <PremiumDarkMaterial />
                    </RoundedBox>
                </group>
            </Float>
        </motion.group>
    );
}

function AppleShip({ scrollYProgress }) {
    const groupRef = useRef();

    // Ship enters from bottom left, majestically slides into center
    const x = useTransform(scrollYProgress, [0.3, 0.6], [-15, 2]);
    const y = useTransform(scrollYProgress, [0.3, 0.6], [-5, -1]);
    const z = useTransform(scrollYProgress, [0.3, 0.6], [-15, -2]);

    const rotY = useTransform(scrollYProgress, [0.3, 0.6], [Math.PI / 4, -Math.PI / 8]);
    const scale = useTransform(scrollYProgress, [0.3, 0.5, 0.7], [0.2, 1.2, 1.5]);

    return (
        <motion.group
            ref={groupRef}
            position-x={x} position-y={y} position-z={z}
            rotation-y={rotY}
            scale={scale}
            visible={useTransform(scrollYProgress, p => p > 0.25 && p < 0.71)}
        >
            <Float floatIntensity={0.2} speed={1} rotationIntensity={0.1}>
                <group>
                    {/* Hull */}
                    <RoundedBox args={[3, 2, 12]} position={[0, -1, 0]} radius={0.5} smoothness={4}>
                        <PremiumDarkMaterial />
                    </RoundedBox>
                    {/* Bridge/Command Center */}
                    <RoundedBox args={[2.5, 2, 2]} position={[0, 1, -4]} radius={0.2}>
                        <PremiumMaterial />
                    </RoundedBox>
                    <RoundedBox args={[1.5, 1, 1]} position={[0, 2.5, -4]} radius={0.1}>
                        <PremiumAccentMaterial />
                    </RoundedBox>

                    {/* Container Stacks (Abstracted as blocks) */}
                    <RoundedBox args={[2.8, 2, 1.5]} position={[0, 0.5, 0]} radius={0.05}>
                        <PremiumAccentMaterial />
                    </RoundedBox>
                    <RoundedBox args={[2.8, 1.5, 1.5]} position={[0, 0.25, 2]} radius={0.05}>
                        <meshPhysicalMaterial color="#3b82f6" metalness={0.5} roughness={0.2} />
                    </RoundedBox>
                    <RoundedBox args={[2.8, 2.5, 1.5]} position={[0, 0.75, 4]} radius={0.05}>
                        <PremiumMaterial />
                    </RoundedBox>
                    <RoundedBox args={[2.8, 1.5, 1.5]} position={[0, 0.25, -2]} radius={0.05}>
                        <meshPhysicalMaterial color="#94a3b8" metalness={0.7} roughness={0.1} />
                    </RoundedBox>
                </group>
            </Float>
        </motion.group>
    );
}

function AppleTruck({ scrollYProgress }) {
    const groupRef = useRef();

    // Truck hurtles from right screen, scales up to full size
    const x = useTransform(scrollYProgress, [0.6, 1], [20, -1]);
    const y = useTransform(scrollYProgress, [0.6, 1], [-2, -2]);
    const z = useTransform(scrollYProgress, [0.6, 1], [-10, 4]);

    const rotY = useTransform(scrollYProgress, [0.6, 1], [-Math.PI / 2, -Math.PI / 6]);
    const scale = useTransform(scrollYProgress, [0.6, 0.9, 1], [0.5, 1.8, 2.2]);

    return (
        <motion.group
            ref={groupRef}
            position-x={x} position-y={y} position-z={z}
            rotation-y={rotY}
            scale={scale}
            visible={useTransform(scrollYProgress, p => p > 0.55)}
        >
            <group>
                {/* Cab */}
                <RoundedBox args={[2, 2.5, 2]} position={[0, 1.25, 4]} radius={0.3}>
                    <PremiumAccentMaterial />
                </RoundedBox>
                {/* Front Hood */}
                <RoundedBox args={[2, 1.5, 1.5]} position={[0, 0.75, 5.5]} radius={0.4}>
                    <PremiumAccentMaterial />
                </RoundedBox>
                {/* Windshield */}
                <RoundedBox args={[1.8, 1, 0.2]} position={[0, 1.8, 5.05]} rotation={[-0.2, 0, 0]} radius={0.05}>
                    <PremiumDarkMaterial />
                </RoundedBox>
                {/* Grill */}
                <RoundedBox args={[1.5, 1, 0.1]} position={[0, 0.8, 6.25]} radius={0.05}>
                    <PremiumMaterial />
                </RoundedBox>

                {/* Trailer */}
                <RoundedBox args={[2.2, 3, 8]} position={[0, 1.5, -1]} radius={0.1}>
                    <PremiumMaterial />
                </RoundedBox>

                {/* Wheels - Cab */}
                <Cylinder args={[0.5, 0.5, 0.4, 32]} rotation={[0, 0, Math.PI / 2]} position={[1.1, 0.5, 5]}>
                    <PremiumDarkMaterial />
                </Cylinder>
                <Cylinder args={[0.5, 0.5, 0.4, 32]} rotation={[0, 0, Math.PI / 2]} position={[-1.1, 0.5, 5]}>
                    <PremiumDarkMaterial />
                </Cylinder>
                <Cylinder args={[0.5, 0.5, 0.4, 32]} rotation={[0, 0, Math.PI / 2]} position={[1.1, 0.5, 3]}>
                    <PremiumDarkMaterial />
                </Cylinder>
                <Cylinder args={[0.5, 0.5, 0.4, 32]} rotation={[0, 0, Math.PI / 2]} position={[-1.1, 0.5, 3]}>
                    <PremiumDarkMaterial />
                </Cylinder>

                {/* Wheels - Trailer */}
                <Cylinder args={[0.5, 0.5, 0.4, 32]} rotation={[0, 0, Math.PI / 2]} position={[1.1, 0.5, -3]}>
                    <PremiumDarkMaterial />
                </Cylinder>
                <Cylinder args={[0.5, 0.5, 0.4, 32]} rotation={[0, 0, Math.PI / 2]} position={[-1.1, 0.5, -3]}>
                    <PremiumDarkMaterial />
                </Cylinder>
                <Cylinder args={[0.5, 0.5, 0.4, 32]} rotation={[0, 0, Math.PI / 2]} position={[1.1, 0.5, -4.2]}>
                    <PremiumDarkMaterial />
                </Cylinder>
                <Cylinder args={[0.5, 0.5, 0.4, 32]} rotation={[0, 0, Math.PI / 2]} position={[-1.1, 0.5, -4.2]}>
                    <PremiumDarkMaterial />
                </Cylinder>
            </group>
        </motion.group>
    );
}

const ThreeDScrollScene = ({ scrollYProgress }) => {
    return (
        <div className="absolute inset-0 z-0 pointer-events-none" style={{ height: '100%' }}>
            {/* The canvas sits in fixed position covering the viewport while the page scrolls */}
            <div className="sticky top-0 w-full h-screen">
                <Canvas camera={{ position: [0, 0, 15], fov: 45 }}>
                    <ambientLight intensity={0.8} />
                    <directionalLight position={[10, 20, 15]} intensity={2} />
                    <directionalLight position={[-10, -10, -5]} intensity={0.5} />
                    <Environment preset="city" />

                    {/* Sequential Apple-Style 3D Vehicles */}
                    <ApplePlane scrollYProgress={scrollYProgress} />
                    <AppleShip scrollYProgress={scrollYProgress} />
                    <AppleTruck scrollYProgress={scrollYProgress} />

                    <ContactShadows position={[0, -4, 0]} opacity={0.6} scale={40} blur={2.5} far={10} />
                </Canvas>
            </div>
        </div>
    );
};

export default ThreeDScrollScene;
