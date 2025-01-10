import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Building2 } from "lucide-react";
import Image from "next/image";

export function Header() {
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
        <nav className="flex items-center gap-6">
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
    </header>
  );
}
