import { Building2 } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className="container py-8">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Logo and Description */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <img src="/cim-logo.webp" alt="CIM Logo" className="h-8 w-8" />
              <img
                src="/business-clinic.svg"
                alt="Business Clinic"
                className="h-48 w-48"
              />
            </div>
            <p className="text-sm text-gray-600 max-w-xs">
              A systematic policy advocacy framework of the Chamber of
              Industries Morang (CIM) for addressing industrial issues.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/register-issue"
                  className="text-gray-600 hover:text-blue-900"
                >
                  Register Issue
                </Link>
              </li>
              <li>
                <Link
                  href="/track-issue"
                  className="text-gray-600 hover:text-blue-900"
                >
                  Track Issue
                </Link>
              </li>
              <li>
                <a
                  href="https://cim.org.np"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-blue-900"
                >
                  Main Website
                </a>
              </li>
            </ul>
          </div>

          {/* Partnership */}
          <div>
            <h3 className="font-semibold mb-4">Partnership</h3>
            <p className="text-sm text-gray-600">
              Ministry of Industry Supply and Commerce
              <br />
              Government of Nepal
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t mt-8 pt-8 text-center text-sm text-gray-600">
          <p>
            © {new Date().getFullYear()} Chamber of Industries Morang. All
            rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
