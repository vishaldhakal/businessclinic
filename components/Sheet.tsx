import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface SheetProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sheet: React.FC<SheetProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bg-white shadow-lg z-50 transition-transform transform translate-y-0">
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-lg font-semibold">Menu</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-800 ml-auto"
        >
          Close
        </button>
      </div>
      <nav className="flex flex-col items-start p-4">
        <Link href="/register-issue">
          <Button variant="outline" size="sm" className="mb-2">
            Register New Issue
          </Button>
        </Link>
        <Link href="/admin">
          <Button size="sm" className="mb-2">
            Admin
          </Button>
        </Link>
        <Link href="/track-issue">
          <Button size="sm" className="mb-2">
            Track Issue
          </Button>
        </Link>
      </nav>
    </div>
  );
};

export default Sheet;
