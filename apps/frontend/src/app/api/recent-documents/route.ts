export const dynamic = "force-dynamic";

type RecentDocument = {
  id: string;
  title: string;
  editedAt: string; // ISO date string
};

export async function GET() {
  // Dummy payload: replace with your real data source later
  const now = Date.now();
  const documents: RecentDocument[] = [
    {
      id: "1",
      title: "Master Service Agreement",
      editedAt: new Date(now - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    },
    {
      id: "2",
      title: "NDA - Vendor XYZ",
      editedAt: new Date(now - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
    },
    {
      id: "3",
      title: "Lease Agreement Draft v3",
      editedAt: new Date(now - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    },
  ];

  return Response.json({ documents });
}
