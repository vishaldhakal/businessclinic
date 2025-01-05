"use client";

import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { Process } from "@/components/Process";
import { Stats } from "@/components/Stats";
import { Testimonials } from "@/components/Testimonials";
import { DashboardCharts } from "@/components/DashboardCharts";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function Home() {
  const [statistics, setStatistics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/business_clinic/issues/statistics/`
        );
        if (!response.ok) throw new Error("Failed to fetch statistics");
        const data = await response.json();
        setStatistics(data);
      } catch (error) {
        console.error("Error fetching statistics:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  return (
    <main>
      <Hero />
      <div className="container py-16">
        <h2 className="text-3xl font-bold text-center mb-8">
          Issue Resolution Statistics
        </h2>
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : statistics ? (
          <DashboardCharts statistics={statistics} />
        ) : null}
      </div>
      <Features />
      <Process />
      <Stats />
      <Testimonials />
    </main>
  );
}
