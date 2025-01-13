import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { PenLine, Eye, EyeOff, CheckCircle2, Clock } from "lucide-react";
import Container from "@/components/Container";

interface StatCardProps {
  value: string | number;
  label: string;
  icon: React.ReactNode;
  color: string;
}

function StatCard({ value, label, icon, color }: StatCardProps) {
  return (
    <Card className="p-6 flex flex-col items-center justify-center text-center hover:shadow-lg transition-shadow">
      <div className={`${color} rounded-full p-3 mb-3`}>{icon}</div>
      <span className="text-xl font-bold mb-1">{value}</span>
      <span className="text-sm text-muted-foreground">{label}</span>
    </Card>
  );
}

export function Hero() {
  return (
    <div className="relative">
      <Container className="py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left side - Content */}
          <div className="space-y-6">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-blue-900">
              Business Clinic Platform
            </h1>
            <p className="text-lg text-blue-900 font-medium">
              <i>
                an initiative by the{" "}
                <span className="text-blue-700">
                  CIM (Chamber of Industry, Morang)
                </span>
              </i>
            </p>
            <p className="text-gray-600 text-lg leading-relaxed">
              We will help you to resolve your business issues and try to solve
              your problems by sending your common issues directly to the
              concerned authority.
            </p>
            <div className="flex gap-4 pt-4 flex-col md:flex-row">
              <Link href="/register-issue">
                <Button size="lg" className="bg-blue-900 hover:bg-blue-800">
                  Register New Issue
                </Button>
              </Link>
              <Link href="/track-issue">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-blue-900 text-blue-900 hover:bg-blue-900 hover:text-white"
                >
                  Track Your Issue
                </Button>
              </Link>
            </div>
          </div>

          {/* Right side - Statistics */}
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <StatCard
                value="813"
                label="Total Issues"
                icon={<PenLine className="h-6 w-6 text-blue-600" />}
                color="bg-blue-100"
              />
              <StatCard
                value="787"
                label="Registered Issues"
                icon={<CheckCircle2 className="h-6 w-6 text-red-600" />}
                color="bg-red-100"
              />
              <StatCard
                value="182"
                label="Processing"
                icon={<Clock className="h-6 w-6 text-amber-600" />}
                color="bg-amber-100"
              />
              <StatCard
                value="605"
                label="Closed"
                icon={<CheckCircle2 className="h-6 w-6 text-green-600" />}
                color="bg-green-100"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <StatCard
                value="0"
                label="Seen"
                icon={<Eye className="h-6 w-6 text-blue-600" />}
                color="bg-blue-100"
              />
              <StatCard
                value="26"
                label="Unseen"
                icon={<EyeOff className="h-6 w-6 text-blue-600" />}
                color="bg-blue-100"
              />
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
