"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform, useAnimation, useInView } from "framer-motion";

export default function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const heroRef = useRef(null);
  const isInView = useInView(heroRef, { once: false, amount: 0.3 });
  const controls = useAnimation();
  
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 100]);
  const y2 = useTransform(scrollY, [0, 500], [0, -100]);
  const scale = useTransform(scrollY, [0, 300], [1, 0.8]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener("mousemove", handleMouseMove);
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const calcParallaxPosition = (multiplier = 0.02) => {
    if (typeof window === "undefined") return { x: 0, y: 0 };
    
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    const x = (centerX - mousePosition.x) * multiplier;
    const y = (centerY - mousePosition.y) * multiplier;
    
    return { x, y };
  };

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    } else {
      controls.start("hidden");
    }
  }, [isInView, controls]);

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6,
        staggerChildren: 0.2
      }
    }
  };

  const staggerItems = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="space-y-24 overflow-hidden">
      {/* Hero Section */}
      <section 
        ref={heroRef} 
        className="relative overflow-hidden py-16 sm:py-24"
      >
        <motion.div 
          style={{ y: y1 }}
          className="absolute top-[-10%] right-[-5%] w-[300px] h-[300px] rounded-full bg-primary/10 blur-3xl z-0" 
        />
        <motion.div 
          style={{ y: y2 }}
          className="absolute bottom-[-10%] left-[-5%] w-[250px] h-[250px] rounded-full bg-primary/15 blur-3xl z-0" 
        />

        <div className="relative flex flex-col md:flex-row items-center gap-8 md:gap-16 z-10">
          <motion.div 
            className="flex-1 text-center md:text-left space-y-6"
            initial="hidden"
            animate={controls}
            variants={fadeInUp}
          >
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight"
              variants={staggerItems}
            >
              <motion.span 
                className="block text-primary"
                variants={staggerItems}
              >
                PaneraTech
              </motion.span>
              <motion.span 
                className="block"
                variants={staggerItems}
              >
                QR Management
              </motion.span>
            </motion.h1>
            
            <motion.p 
              className="text-lg md:text-xl max-w-2xl text-gray-600 mt-6"
              variants={staggerItems}
            >
              Create, manage, and track tag-based professional QR codes.
              A single platform for all your digital QR code needs.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 mt-8"
              variants={staggerItems}
            >
              <Link
                href="/create"
                className="btn btn-primary btn-lg group relative inline-flex items-center justify-center overflow-hidden rounded-lg bg-primary px-8 py-3 font-medium text-white transition duration-300 ease-out hover:bg-primary/90"
                aria-label="Get Started"
              >
                <span className="relative flex items-center">
                  Get Started
                  <motion.svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="ml-2"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <path d="M5 12h14"></path>
                    <path d="m12 5 7 7-7 7"></path>
                  </motion.svg>
                </span>
              </Link>
            </motion.div>
          </motion.div>

          <motion.div 
            className="flex-1 relative h-64 sm:h-72 md:h-[450px] w-full max-w-md"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            style={{ 
              scale,
              x: calcParallaxPosition(0.01).x,
              y: calcParallaxPosition(0.01).y
            }}
          >
            {/* Decorative element */}
            <motion.div 
              className="absolute top-0 left-0 z-10 w-full h-full bg-gradient-to-br from-primary/30 to-primary/5 rounded-2xl" 
              animate={{ rotate: 3 }}
              transition={{ duration: 0.6 }}
            />
            
            {/* Main QR code box */}
            <motion.div 
              className="absolute top-0 left-0 w-full h-full bg-gray-100 rounded-2xl shadow-xl overflow-hidden"
              animate={{ rotate: -3 }}
              transition={{ duration: 0.6 }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.svg
                  className="w-36 h-36 md:w-48 md:h-48 text-primary/70"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ 
                    duration: 0.8, 
                    delay: 0.6, 
                    type: "spring", 
                    stiffness: 200 
                  }}
                >
                  <rect
                    x="3"
                    y="3"
                    width="7"
                    height="7"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <rect
                    x="14"
                    y="3"
                    width="7"
                    height="7"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <rect
                    x="3"
                    y="14"
                    width="7"
                    height="7"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <rect
                    x="14"
                    y="14"
                    width="7"
                    height="7"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path d="M7 7L17 17" stroke="currentColor" strokeWidth="2" />
                  <path d="M17 7L7 17" stroke="currentColor" strokeWidth="2" />
                </motion.svg>
              </div>
            </motion.div>

            {/* Mobile device image */}
            <motion.div
              className="absolute -bottom-10 -right-10 w-48 md:w-60 h-auto z-20"
              initial={{ opacity: 0, y: 80 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              style={{ 
                x: calcParallaxPosition(0.03).x,
                y: calcParallaxPosition(-0.02).y 
              }}
            >
            </motion.div>
          </motion.div>
        </div>

        {/* Wave animation */}
        <motion.div 
          className="absolute bottom-0 left-0 w-full h-24 pointer-events-none select-none"
          style={{ y: y1 }}
        >
          <svg className="w-full h-full" viewBox="0 0 1440 80" fill="none" preserveAspectRatio="none">
            <path 
              d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" 
              fill="url(#wave-gradient)" 
            />
            <defs>
              <linearGradient id="wave-gradient" x1="0" y1="0" x2="1440" y2="0" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#d6e3f3" />
                <stop offset="50%" stopColor="#c4d8ef" />
                <stop offset="100%" stopColor="#b1ccea" />
              </linearGradient>
            </defs>
          </svg>
        </motion.div>
      </section>

      {/* Features Section */}
      <motion.section 
        className="relative py-16"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="container mx-auto px-4">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <span className="text-primary">QR Code</span> Solution Features
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                ),
                title: "Secure QR Codes",
                description: "Create and manage tag-based secure QR codes"
              },
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                ),
                title: "Analytics Tracking",
                description: "Monitor usage data with real-time scan statistics"
              },
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                ),
                title: "Mobile Friendly",
                description: "Platform accessible and manageable from all devices"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true, amount: 0.3 }}
                whileHover={{ y: -5 }}
              >
                <div className="text-primary mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>
    </div>
  );
} 