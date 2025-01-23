"use client";

import { Hero } from "@/components/Hero";
import { MissionSection } from "@/components/MissionSection";
import { DashboardCharts } from "@/components/DashboardCharts";
import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";
import { Features } from "@/components/Features";
import { Process } from "@/components/Process";
import { Testimonials } from "@/components/Testimonials";
import { useEffect, useState } from "react";
import Container from "@/components/Container";

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
    <>
      <main>
        <Container>
          <Hero
            totalIssues={statistics?.total_issues || 0}
            openIssues={statistics?.open_issues || 0}
          />

          <MissionSection />

          <div className="container py-16">
            <Features />
            <Process />
            <Testimonials />
          </div>
          <ContactSection />
        </Container>
      </main>
      <Footer />
    </>
  );
}
