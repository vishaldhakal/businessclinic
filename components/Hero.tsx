import { Button } from "@/components/ui/button";
import Link from "next/link";

export function Hero() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
        Business Clinic Platform
      </h1>
      <p className="mx-auto mt-4 max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
        Register your business issues and get expert assistance. We help
        businesses overcome challenges and grow.
      </p>
      <div className="mt-8 flex gap-4">
        <Link href="/register-issue">
          <Button size="lg">Register Issue</Button>
        </Link>
        <Link href="/track-issue">
          <Button variant="outline" size="lg">
            Track Issue
          </Button>
        </Link>
      </div>
    </div>
  );
}
