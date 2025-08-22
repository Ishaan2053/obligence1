"use client"

import React, { useMemo, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import useSWR from "swr"
import { Users, Calendar, DollarSign, RefreshCw, FileDown, AlertTriangle, CheckCircle2, ChevronDown, Printer } from "lucide-react"
import { ReportSkeleton } from "./skeletons"

type Obligation = { party: string; text: string }
type Clarification = { id: string; status: "resolved" | "pending" | "ambiguous" }
type ContractReport = {
  contract_id: string
  status: string
  summary: string
  parties: string[]
  dates: { effective_date: string; termination_date?: string; renewal?: string }
  obligations: Obligation[]
  clarifications?: Clarification[]
}

// Demo fallback data until wired to API
const demoData: ContractReport = {
  contract_id: "64c0f9...",
  status: "completed",
  summary:
    "This contract is between ABC Corp and XYZ Ltd, effective 2024-01-01, renewable annually.",
  parties: ["ABC Corp", "XYZ Ltd"],
  dates: { effective_date: "2024-01-01", termination_date: "2025-01-01" },
  obligations: [
    { party: "ABC Corp", text: "Deliver monthly software updates" },
    { party: "XYZ Ltd", text: "Provide payment of $50,000 quarterly" },
  ],
  clarifications: [{ id: "clar123", status: "resolved" }],
}

function formatDate(d?: string) {
  if (!d) return "—"
  const date = new Date(d)
  if (Number.isNaN(date.getTime())) return d
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  })
}

function getStatusChip(data: ContractReport) {
  const term = data.dates.termination_date
  const now = new Date()
  const isActive = term ? new Date(term) > now : true
  if (data.status !== "completed") return { label: "Processing", variant: "secondary" as const }
  return isActive
    ? { label: `Active until ${formatDate(term)}`, variant: "default" as const }
    : { label: `Expired on ${formatDate(term)}`, variant: "outline" as const }
}

export default function Page() {
  return <Report />
}

// SWR fetcher scaffold – replace with real API call. Compatible with SWR suspense mode.
const fetchContract = async (_key: string, contractId: string): Promise<ContractReport> => {
  // TODO: replace with fetch(`/api/contracts/${contractId}`).then(r => r.json())
  await new Promise((r) => setTimeout(r, 800))
  return demoData
}

function Report() {
  // In production, get the id from route/search params
  const contractId = "64c0f9"
  const { data, isLoading, error } = useSWR(["contract", contractId], ([key, id]) => fetchContract(key, id), {
    revalidateOnFocus: false,
  })
  if (isLoading) return <ReportSkeleton />
  if (!data || error) return <ReportSkeleton />
  return <ReportView data={data} />
}

function ReportView({ data }: { data: ContractReport }) {
  const printRef = useRef<HTMLDivElement>(null)

  const obligationsByParty = useMemo(() => {
    const map = new Map<string, string[]>()
    for (const ob of data.obligations || []) {
      map.set(ob.party, [...(map.get(ob.party) || []), ob.text])
    }
    return Array.from(map.entries())
  }, [data.obligations])

  const unresolvedCount = (data.clarifications || []).filter((c) => c.status !== "resolved").length
  const statusChip = getStatusChip(data)
  const completion = data.status === "completed" ? 100 : 60
  const risk = unresolvedCount > 0 ? Math.min(20 + unresolvedCount * 20, 100) : 0

  function handleDownloadJSON() {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `contract-${data.contract_id}.json`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  function handleExportPDF() {
    const html = printRef.current?.innerHTML
    const w = window.open("", "_blank", "noopener,noreferrer")
    if (!w || !html) return
    w.document.write(`<!doctype html><html><head><title>Contract Report</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <style>
        :root{color-scheme:light dark;font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, sans-serif}
        body{margin:24px}
        h1,h2{margin:0 0 8px 0}
        .grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}
        .card{border:1px solid #e5e7eb;border-radius:16px;padding:16px}
        .muted{color:#6b7280}
        ul{margin:8px 0 0 16px}
      </style>
    </head><body>${html}</body></html>`)
    w.document.close()
    w.focus()
    w.print()
  }

  const renewalRule = useMemo(() => {
    if (data.dates.renewal) return data.dates.renewal
    if (/renewable/i.test(data.summary)) return "Renews annually unless terminated"
    return "No explicit renewal terms detected"
  }, [data])

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 md:py-10">
      <div className="mb-6 flex flex-col gap-3 md:mb-8 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">Contract Assessment Report</h1>
          <p className="text-muted-foreground mt-1 text-sm">Contract ID: {data.contract_id}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={statusChip.variant as any} className="rounded-full">{statusChip.label}</Badge>
          {risk > 0 ? (
            <Badge variant="destructive" className="rounded-full">
              <AlertTriangle className="mr-1" /> {risk}% risk
            </Badge>
          ) : (
            <Badge variant="secondary" className="rounded-full">
              <CheckCircle2 className="mr-1" /> No risk flags
            </Badge>
          )}
          <div className="h-6 w-px bg-border mx-2 hidden md:block" />
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" onClick={handleExportPDF}>
                <Printer /> Export PDF
              </Button>
            </TooltipTrigger>
            <TooltipContent>Print or save as PDF</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" onClick={handleDownloadJSON}>
                <FileDown /> JSON
              </Button>
            </TooltipTrigger>
            <TooltipContent>Download full structured JSON</TooltipContent>
          </Tooltip>
        </div>
      </div>

      <div ref={printRef} className="flex flex-col gap-6 md:gap-8">
        {/* Summary */}
        <Card className="transition-all hover:shadow-sm rounded-2xl">
          <CardHeader className="border-b">
            <CardTitle className="text-xl">Readable Summary</CardTitle>
            <CardDescription>At-a-glance overview and key dates</CardDescription>
          </CardHeader>
          <CardContent className="mt-4 grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Users className="text-muted-foreground" />
                <span className="text-sm font-medium">Parties</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {data.parties.map((p) => (
                  <Badge key={p} variant="outline" className="rounded-full">{p}</Badge>
                ))}
              </div>
              <div className="mt-4 grid gap-3">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="text-muted-foreground" />
                  <span className="text-muted-foreground">Effective</span>
                  <span className="font-medium">{formatDate(data.dates.effective_date)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="text-muted-foreground" />
                  <span className="text-muted-foreground">Termination</span>
                  <span className="font-medium">{formatDate(data.dates.termination_date)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <RefreshCw className="text-muted-foreground" />
                  <span className="text-muted-foreground">Renewal</span>
                  <span className="font-medium">{renewalRule}</span>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <p className="text-sm leading-6 text-foreground/90">{data.summary}</p>
              <div className="border rounded-2xl p-4">
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Assessment completion</span>
                  <span className="font-medium">{completion}%</span>
                </div>
                <Progress value={completion} />
                <div className="mt-3 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Risk indicator</span>
                  <span className="font-medium">{risk}%</span>
                </div>
                <Progress value={Math.max(risk, 4)} className="bg-destructive/15" />
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t justify-between">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <Badge variant="secondary" className="rounded-full">
                <DollarSign className="mr-1" /> Payments due quarterly
              </Badge>
              <Badge variant="outline" className="rounded-full">
                <Calendar className="mr-1" /> Key dates prioritized
              </Badge>
            </div>
          </CardFooter>
        </Card>

        {/* Highlights */}
        <Card className="transition-all hover:shadow-sm rounded-2xl">
          <CardHeader className="border-b">
            <CardTitle className="text-xl">Highlights & Drill‑down</CardTitle>
            <CardDescription>Important clauses surfaced first</CardDescription>
          </CardHeader>
        
          <CardContent className="mt-4 grid gap-6 md:grid-cols-2">
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Key clauses</h3>
              <div className="flex flex-wrap gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge className="rounded-full">
                      <Calendar className="mr-1" /> Effective: {formatDate(data.dates.effective_date)}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>Effective date of the agreement</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge className="rounded-full" variant="secondary">
                      <DollarSign className="mr-1" /> Payment terms: Quarterly
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>Based on obligations detected</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge className="rounded-full" variant="outline">
                      <RefreshCw className="mr-1" /> {renewalRule}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>Renewal/termination insights</TooltipContent>
                </Tooltip>
              </div>
              {unresolvedCount > 0 && (
                <div className="mt-2 text-sm text-destructive inline-flex items-center gap-2">
                  <AlertTriangle /> {unresolvedCount} clarification(s) pending
                </div>
              )}
            </div>
            <div>
              <details className="group rounded-2xl border p-4 transition-colors [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-medium">
                  Read full summary
                  <ChevronDown className="transition-transform group-open:rotate-180" />
                </summary>
                <p className="mt-3 text-sm leading-6 text-foreground/90">{data.summary}</p>
              </details>
            </div>
          </CardContent>
        </Card>

        {/* Obligations by party */}
        <Card className="transition-all hover:shadow-sm rounded-2xl">
          <CardHeader className="border-b">
            <CardTitle className="text-xl">Obligations by Party</CardTitle>
            <CardDescription>Concise breakdown per party</CardDescription>
          </CardHeader>
          <CardContent className="mt-4 grid gap-6 md:grid-cols-2">
            {obligationsByParty.map(([party, items]) => (
              <div key={party} className="rounded-2xl border p-4">
                <div className="mb-2 flex items-center gap-2">
                  <Badge variant="outline" className="rounded-full">{party}</Badge>
                </div>
                <ul className="list-disc pl-5 text-sm leading-6">
                  {items.map((t, i) => (
                    <li key={i}>{t}</li>
                  ))}
                </ul>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// moved to ./skeletons.tsx