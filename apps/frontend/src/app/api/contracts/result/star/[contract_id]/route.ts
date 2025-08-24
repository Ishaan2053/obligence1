import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

function buildBackendUrl(contractId: string, userId: string) {
  return `${BACKEND_URL}/api/contracts/result/star/${encodeURIComponent(
    contractId
  )}?userid=${encodeURIComponent(userId)}`;
}

export async function POST(_req: NextRequest, { params }: { params: { contract_id: string } }) {
  try {
    if (!BACKEND_URL) {
      return NextResponse.json({ error: "Backend URL not configured" }, { status: 500 });
    }

    const session = await auth();
    if (!session?.user?._id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const contractId = params?.contract_id;
    if (!contractId) {
      return NextResponse.json({ error: "contract_id is required" }, { status: 400 });
    }

    const url = buildBackendUrl(contractId, session.user._id);
    const res = await fetch(url, { method: "POST" });
    const contentType = res.headers.get("content-type") || "";
    const body = contentType.includes("application/json") ? await res.json() : await res.text();
    return new NextResponse(
      typeof body === "string" ? body : JSON.stringify(body),
      {
        status: res.status,
        headers: {
          "content-type": contentType.includes("application/json") ? "application/json" : "text/plain",
        },
      }
    );
  } catch (err) {
    console.error("POST /api/contracts/result/star/[contract_id] error", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { contract_id: string } }) {
  try {
    if (!BACKEND_URL) {
      return NextResponse.json({ error: "Backend URL not configured" }, { status: 500 });
    }

    const session = await auth();
    if (!session?.user?._id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const contractId = params?.contract_id;
    if (!contractId) {
      return NextResponse.json({ error: "contract_id is required" }, { status: 400 });
    }

    const url = buildBackendUrl(contractId, session.user._id);
    const res = await fetch(url, { method: "DELETE" });
    const contentType = res.headers.get("content-type") || "";
    const body = contentType.includes("application/json") ? await res.json() : await res.text();
    return new NextResponse(
      typeof body === "string" ? body : JSON.stringify(body),
      {
        status: res.status,
        headers: {
          "content-type": contentType.includes("application/json") ? "application/json" : "text/plain",
        },
      }
    );
  } catch (err) {
    console.error("DELETE /api/contracts/result/star/[contract_id] error", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
