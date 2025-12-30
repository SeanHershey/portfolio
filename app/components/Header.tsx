"use client";

import Link from "next/link";
import Image from "next/image";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const navItems = [
  { href: "/projects", label: "Projects" },
  { href: "/demos", label: "Demos" },
  { href: "/blog", label: "Blog" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header 
      className="fixed top-0 left-0 right-0 z-50 p-6"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <nav className={`flex justify-between items-center max-w-5xl mx-auto bg-background/50 backdrop-blur-sm p-2 rounded-xl border transition-colors duration-300 ${scrolled ? "border-neutral-800" : "border-transparent"}`}>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link href="/" className="rounded-lg p-2 bg-neutral-900 block">
            <Image src="/icon.svg" alt="Sean Hershey" width={24} height={24} />
          </Link>
        </motion.div>
        <ul className="flex items-center gap-4 text-sm">
          {navItems.map((navItem, index) => (
            <motion.li
              key={navItem.href}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                delay: 0.1 + index * 0.05,
                duration: 0.4,
              }}
            >
              <Link 
                href={navItem.href} 
                className="hover:opacity-70 transition-opacity relative group"
              >
                {navItem.label}
                <motion.span 
                  className="absolute -bottom-1 left-0 w-0 h-0.5 bg-leaf group-hover:w-full transition-all duration-300"
                />
              </Link>
            </motion.li>
          ))}
          <motion.li
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.4 }}
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-1"
            >
              <MagnifyingGlassIcon className="w-4 h-4 hover:opacity-70 transition-opacity" />
            </motion.button>
          </motion.li>
          <motion.li
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href="/contact" className="rounded-lg p-1 mr-1 border border-foreground text-foreground font-semibold hover:opacity-70 transition-opacity text-sm flex items-center gap-1 w-22 justify-center">
                Contact
              </Link>
            </motion.div>
          </motion.li>
        </ul>
      </nav>
    </motion.header>
  );
}
