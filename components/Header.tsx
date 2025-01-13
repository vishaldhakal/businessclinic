"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Sheet from "@/components/Sheet";

import Image from "next/image";

export function Header() {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="flex h-16 items-center justify-between px-6">
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src="/cim-logo.webp"
            alt="Business Clinic"
            className="h-8 w-8"
            width={500}
            height={300}
          />
          <span className="text-2xl font-normal text-gray-200">|</span>
          <Image
            src="/business-clinic.svg"
            alt="Business Clinic"
            className="h-48 w-48"
            width={500}
            height={300}
          />
        </Link>
        <div className="md:hidden">
          <button
            onClick={() => setIsSheetOpen(true)}
            className="text-gray-600"
          >
            ☰
          </button>
        </div>
        <nav
          className={`flex items-center gap-6 ${
            isNavOpen ? "block" : "hidden"
          } md:flex`}
        >
          <Link href="/register-issue">
            <Button
              variant="outline"
              size="sm"
              className="border-blue-100 text-blue-900 hover:bg-blue-900 hover:text-white"
            >
              Register New Issue
            </Button>
          </Link>
          <Link href="/admin">
            <Button size="sm">Admin</Button>
          </Link>
          <Link
            href="/track-issue"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Track Issue
          </Link>
        </nav>
      </div>
      <Sheet isOpen={isSheetOpen} onClose={() => setIsSheetOpen(false)} />
    </header>
  );
}
