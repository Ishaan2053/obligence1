"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Loader2, ArrowRight } from "lucide-react";
import useSWR from "swr";

export default function Page() {
  const params = useParams();
  const router = useRouter();
  const raw = (params as any)?.id;
  const id = typeof raw === "string" ? raw : Array.isArray(raw) ? raw[0] : "";

  // Poll for processing completion every 5 seconds using existing results API
  const fetcher = React.useCallback(async () => {
    if (!id) return null;
    const res = await fetch(`/api/contracts/result/${encodeURIComponent(id)}`);
    if (res.ok) {
      try {
        return await res.json();
      } catch {
        return {} as any;
      }
    }
    // Treat non-200 as not-ready; don't throw to keep SWR calm
    return null;
  }, [id]);
  const { data } = useSWR(id ? ["processing", id] : null, fetcher, {
    refreshInterval: 5000,
    revalidateOnFocus: false,
  });
  const isCompleted = Boolean(data);

  // Mock step progression: 1..5; advance every 10s up to step 4; move to 5 when completed
  const steps = React.useMemo(
    () => [
      "Extracting text & structure",
      "Analyzing entities & clauses",
      "Preparing readable report",
      "Finalizing & saving",
    ],
    []
  );
  const [currentStep, setCurrentStep] = React.useState(1); // 1..5
  React.useEffect(() => {
    if (isCompleted) {
      setCurrentStep(4); // final step reached
      return;
    }
    // While not completed, tick every 10s up to step 4
    const iv = setInterval(() => {
      setCurrentStep((s) => (s < 4 ? s + 1 : 4));
    }, 10000);
    return () => clearInterval(iv);
  }, [isCompleted]);

  const progressVal = isCompleted ? 100 : Math.min(((currentStep - 1) / 4) * 95 + 5, 95);

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10">
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <CheckCircle2 className="text-green-500" /> PDF uploaded successfully
          </CardTitle>
          <CardDescription>
            Your document has been queued for processing. This may take up to a minute.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-sm text-muted-foreground">Contract ID</div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="rounded-full font-mono">{id || "unknown"}</Badge>
          </div>

          <div className="mt-4">
            <div className="mb-2 flex items-center gap-2 text-sm">
              {!isCompleted ? (
                <>
                  <Loader2 className="animate-spin" /> Processing...
                </>
              ) : (
                <>
                  <CheckCircle2 className="text-green-500" /> Processing complete
                </>
              )}
            </div>
            <Progress value={progressVal} aria-label="Processing" />
            <p className="mt-2 text-xs text-muted-foreground">
              We’re extracting entities and obligations, and preparing your report.
            </p>
        
          </div>

          {/* Stepper */}
          <div className="mt-4 space-y-2">
            {steps.map((label, i) => {
              const idx = i + 1;
              const isDone = isCompleted || idx < currentStep;
              const isActive = idx === currentStep && !isCompleted;
              return (
                <div key={idx} className="flex items-center gap-3 rounded-xl border p-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full border">
                    {isDone ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    ) : isActive ? (
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    ) : (
                      <span className="block h-1.5 w-1.5 rounded-full bg-muted-foreground/40" />
                    )}
                  </div>
                  <div className="text-sm">
                    <span className={isDone ? "text-foreground" : isActive ? "text-foreground" : "text-muted-foreground"}>{label}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 flex items-center gap-2">
            <Button className="cursor-pointer"  variant="outline" onClick={() => router.push("/dashboard")}>Back to dashboard</Button>
            <Button className="cursor-pointer" onClick={() => router.push(`/dashboard/results/${encodeURIComponent(id)}`)} disabled={!id || !isCompleted}>
              View report <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
