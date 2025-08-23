export const dynamic = "force-dynamic";

type Report = {
  id: string;
  name: string;
};

export async function GET() {
  const reports: Report[] = [
    { id: "rpt-1", name: "Haldirams scam report" },
    { id: "rpt-2", name: "Vendor Risk Assessment Q2" },
    { id: "rpt-3", name: "MSA Redlines Summary" },
  ];

  return Response.json({ reports });
}
