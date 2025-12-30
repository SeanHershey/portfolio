"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import Hero from "./components/Hero";

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const }
  },
};

const projects = [
  {
    title: "Manifold",
    description: "Democratizing access to AI with the most efficient compute marketplace in the world.",
    tags: ["Targon", "Sybil", "Tao"],
    link: "https://manifold.inc",
    color: "#8FA0FE",
    image: "/logos/manifold.png",
  },
  {
    title: "fEMR",
    description: "A fast EMR solution for remote clinics who depend on speed and ease of use.",
    tags: ["Non-Profit", "Open Source"],
    link: "/projects",
    color: "#C60001",
    image: "/logos/femr.png",
  },
  {
    title: "CalPoly",
    description: "A degree in computer science focuses on systems, websites, and artificial intelligence suites",
    tags: ["Computer Science"],
    link: "/blog",
    color: "#164734",
    image: "/logos/calpoly.png",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      <Hero />
      
      <motion.section 
        className="w-full max-w-4xl px-6 py-24"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        variants={{
          hidden: { opacity: 0 },
          show: { 
            opacity: 1,
            transition: { staggerChildren: 0.15 }
          }
        }}
      >
        <motion.h3 
          className="text-2xl font-bold mb-12 text-center"
          variants={fadeIn}
        >
          What I&apos;ve Worked On
        </motion.h3>
        
        <div className="grid md:grid-cols-3 gap-6">
          {projects.map((project) => (
            <motion.div
              key={project.title}
              variants={fadeIn}
              whileHover={{ y: -4, borderColor: project.color, transition: { duration: 0.2 } }}
              className="rounded-xl border border-neutral-800 bg-neutral-900/50 transition-colors h-full"
            >
              <Link 
                href={project.link}
                target={project.link.startsWith("http") ? "_blank" : undefined}
                className="block p-6 h-full"
              >
                <div className="flex gap-2 mb-2 items-center">
                  <div className="flex justify-center items-center h-8 w-8 bg-neutral-800 rounded-lg">
                    <Image src={project.image} alt={project.title} width={18} height={18} className={`${project.image === "/logos/femr.png" ? "scale-180" : ""}`} />
                  </div>
                  <h4 className="font-semibold text-lg">{project.title}</h4>
                </div>
                <p className="text-neutral-400 text-sm mb-4 leading-relaxed">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span 
                      key={tag} 
                      className="text-xs px-2 py-1 rounded-md bg-neutral-800 text-neutral-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.section>

      <motion.section 
        className="w-full max-w-4xl px-6 pb-24 text-center"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeIn}
      >
        <div className="flex flex-col items-center gap-6">
          <div className="flex items-center gap-6 mt-4">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Link 
                href="https://github.com/seanhershey" 
                target="_blank"
                className="flex w-12 h-12 justify-center items-center rounded-full bg-neutral-800/50 border border-neutral-700 hover:border-neutral-500 transition-colors"
              >
                <Image 
                  src="/logos/github.svg" 
                  alt="GitHub" 
                  width={28} 
                  height={28}
                />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Link 
                href="https://linkedin.com/in/seanhershey" 
                target="_blank"
                className="flex w-12 h-12 justify-center items-center rounded-full bg-neutral-800/50 border border-neutral-700 hover:border-neutral-500 transition-colors"
              >
                <Image 
                  src="/logos/linkedin.png" 
                  alt="LinkedIn" 
                  width={28} 
                  height={28}
                  className="translate-x-0.5"
                />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Link 
                href="https://linkedin.com/in/seanhershey" 
                target="_blank"
                className="flex w-12 h-12 justify-center items-center rounded-full bg-neutral-800/50 border border-neutral-700 hover:border-neutral-500 transition-colors"
              >
                <Image 
                  src="/logos/x.png" 
                  alt="LinkedIn" 
                  width={22} 
                  height={22}
                />
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
