"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2, Copy, Home } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

function ThankYouContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const trackingId = searchParams.get("id");

  const copyToClipboard = () => {
    if (trackingId) {
      navigator.clipboard.writeText(trackingId);
      toast({
        title: "Copied!",
        description: "Tracking ID has been copied to clipboard",
        duration: 3000,
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-lg w-full p-8 text-center space-y-6">
        <div className="flex justify-center">
          <CheckCircle2 className="h-16 w-16 text-green-500" />
        </div>

        <h1 className="text-2xl font-bold tracking-tight">
          Thank You for Your Submission!
        </h1>

        <p className="text-muted-foreground">
          Your issue has been successfully registered. Please keep your tracking
          ID safe for future reference.
        </p>

        <div className="bg-muted/50 rounded-lg p-4 space-y-2">
          <p className="text-sm text-muted-foreground">Your Tracking ID</p>
          <div className="flex items-center justify-center gap-2">
            <code className="relative rounded bg-muted px-[0.5rem] py-[0.3rem] font-mono text-lg font-semibold">
              {trackingId}
            </code>
            <Button
              variant="ghost"
              size="icon"
              onClick={copyToClipboard}
              className="h-8 w-8"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Button
            variant="default"
            className="gap-2"
            onClick={() => router.push("/")}
          >
            <Home className="h-4 w-4" />
            Return Home
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push("/register-issue")}
          >
            Register Another Issue
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default function ThankYouPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ThankYouContent />
    </Suspense>
  );
}
