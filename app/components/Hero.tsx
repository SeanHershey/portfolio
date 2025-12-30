"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import Books from "./Books";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  },
};

const languages = [
  { name: "TypeScript", color: "#3278C5" },
  { name: "Go", color: "#02ADD8" },
  { name: "Python", color: "#3671A4" },
  { name: "Java", color: "#AF7119" },
  { name: "C", color: "#555555" },
];

function HeroContent() {
  return (
    <motion.div 
      className="items-center flex flex-col gap-5 relative px-12 py-8"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <motion.div className="flex flex-col items-center gap-2" variants={item}>
        <motion.div 
          className="rounded-lg p-1 bg-leaf w-fit"
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <Image src="/icon-dark.svg" alt="Sean Hershey" width={32} height={32} />
        </motion.div>
        <h1 className="text-3xl md:text-[2.5rem] font-extrabold text-leaf font-bakbak scale-x-110">SEAN HERSHEY</h1>
      </motion.div>

      <motion.h2 
        className="text-2xl md:text-4xl font-bold text-center text-white"
        variants={item}
      >
        Building apps <br/> that help people.
      </motion.h2>

      <motion.p className="text-center text-neutral-400" variants={item}>
        I&apos;m working at 
        <Link href="https://manifold.inc" target="_blank" className="text-white hover:opacity-70 transition-opacity">
          {" "} Manifold Labs
        </Link>
        . Currently building with 
        <Link href="https://nextjs.org" target="_blank" className="text-white hover:opacity-70 transition-opacity">
          {" "} Next.js
        </Link>
        ,
        <Link href="https://tailwindcss.com" target="_blank" className="text-white hover:opacity-70 transition-opacity">
          {" "} Tailwind
        </Link>
        , and
        <Link href="https://docker.com" target="_blank" className="text-white hover:opacity-70 transition-opacity">
          {" "} Docker
        </Link>
        .
      </motion.p>

      <motion.div className="flex items-center gap-2" variants={item}>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link href="/blog" className="rounded-lg px-6 py-2 border border-white text-white font-semibold hover:opacity-70 transition-opacity text-sm flex items-center gap-1 justify-center">
            Blog
          </Link>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link href="/projects" className="rounded-lg px-6 py-2 bg-white text-black font-semibold hover:opacity-70 transition-opacity text-sm flex items-center gap-1 justify-center">
            Projects
          </Link>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default function Hero() {
  return (
    <div className="flex flex-col items-center relative w-full border-b border-neutral-800">
      {/* Books carousel with hero content */}
      <div className="absolute inset-0 z-0 mt-12">
        <Books heroContent={<HeroContent />} />
      </div>
      <div 
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-1/2 pointer-events-none z-1"
        style={{
          background: 'radial-gradient(ellipse at center bottom, rgba(100, 100, 100, 0.15) 0%, rgba(100, 100, 100, 0.05) 40%, transparent 70%)',
        }}
      />
      
      {/* Languages at bottom - stays fixed */}
      <motion.div 
        className="flex items-center gap-4 flex-wrap justify-center text-sm text-neutral-300 mt-auto mb-6 z-10 absolute bottom-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        {languages.map((lang, index) => (
          <motion.div 
            key={lang.name}
            className="flex items-center gap-1.5"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ 
              delay: 0.8 + index * 0.1,
              duration: 0.4,
              ease: "easeOut"
            }}
            whileHover={{ scale: 1.1 }}
          >
            <motion.span 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: lang.color }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: index * 0.2,
              }}
            />
            <span>{lang.name}</span>
          </motion.div>
        ))}
      </motion.div>
      
      {/* Spacer to maintain section height */}
      <div className="h-[600px] md:h-[700px]" />
    </div>
  );
}
