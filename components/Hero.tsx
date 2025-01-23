"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { PenLine, ArrowRight } from "lucide-react";
import Container from "@/components/Container";
import Image from "next/image";
import { motion } from "framer-motion";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  active?: boolean;
}

function NavLink({ href, children, active }: NavLinkProps) {
  return (
    <Link
      href={href}
      className={`text-sm font-medium transition-colors hover:text-blue-600 ${
        active
          ? "bg-blue-100 text-blue-600 px-3 py-1 rounded-full"
          : "text-gray-600"
      }`}
    >
      {children}
    </Link>
  );
}

interface HeroProps {
  totalIssues: number;
  openIssues: number;
}

export function Hero({ totalIssues, openIssues }: HeroProps) {
  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Hero Section */}
      <Container className="mt-12 sm:mt-16 md:mt-20 px-4 sm:px-6 lg:px-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Left side - Content */}
          <motion.div
            className="space-y-6 sm:space-y-8"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="space-y-4 sm:space-y-6 max-w-xl mx-auto lg:mx-0">
              <motion.h1
                className="text-[2.75rem] font-bold leading-tight text-[#1a2b3c]"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                BUSINESS ISSUE REGISTRATION
              </motion.h1>
              <motion.p
                className="text-gray-600 text-lg"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                Submit your business concerns directly to the Chamber of
                Industry, Morang. We streamline the process of connecting you
                with the right authorities for quick resolution.
              </motion.p>
              <motion.div
                className="pt-4 flex flex-col sm:flex-row gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <Link href="/register-issue" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto bg-blue-900 hover:bg-blue-800">
                    Register New Issue
                  </Button>
                </Link>
                <Link href="/track-issue" className="w-full sm:w-auto">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto border-blue-900 text-blue-900 hover:bg-blue-900 hover:text-white"
                  >
                    Track Issue
                  </Button>
                </Link>
              </motion.div>
              <motion.div
                className="flex gap-6 pt-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                <Link href="#" className="text-gray-400 hover:text-blue-600">
                  <PenLine className="h-6 w-6" />
                </Link>
                <Link href="#" className="text-gray-400 hover:text-blue-600">
                  <svg
                    className="h-6 w-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z"
                      strokeWidth="2"
                    />
                    <path d="M12 6v6l4 2" strokeWidth="2" />
                  </svg>
                </Link>
                <Link href="#" className="text-gray-400 hover:text-blue-600">
                  <svg
                    className="h-6 w-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <circle cx="12" cy="12" r="10" strokeWidth="2" />
                    <path d="M2 12h20" strokeWidth="2" />
                    <path
                      d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
                      strokeWidth="2"
                    />
                  </svg>
                </Link>
              </motion.div>
            </div>
          </motion.div>

          {/* Right side - Illustration */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <motion.div
              className="absolute top-0 right-0 w-4/5 h-4/5 bg-[#e6f3ff] rounded-[40px]"
              initial={{ rotate: 0 }}
              animate={{ rotate: 6 }}
              transition={{ delay: 0.5, duration: 0.5, type: "spring" }}
            ></motion.div>
            <motion.div
              className="relative z-10"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              <Image
                src="/dash.png"
                alt="Online Registration Illustration"
                className="w-full h-auto object-contain sm:hidden md:block hidden"
                width={500}
                height={500}
                priority
              />
            </motion.div>
          </motion.div>
        </div>
      </Container>

      {/* Stats Section */}
      <Container className="mt-12 sm:mt-16 md:mt-24 px-4 sm:px-6 lg:px-0">
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          {[
            { number: totalIssues, label: "Total Issues Registered" },
            { number: openIssues, label: "Active Cases" },
            { number: "24/7", label: "Support Available" },
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 + index * 0.1, duration: 0.5 }}
            >
              <motion.div
                className="text-4xl font-bold text-blue-900 mb-2"
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                transition={{
                  delay: 1.4 + index * 0.1,
                  duration: 0.3,
                  type: "spring",
                }}
              >
                {stat.number}
              </motion.div>
              <div className="text-gray-600">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </div>
  );
}
