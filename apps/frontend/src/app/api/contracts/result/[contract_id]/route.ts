import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

function buildBackendUrl(contractId: string, userId: string) {
	return `${BACKEND_URL}/api/contracts/result/${encodeURIComponent(
		contractId
	)}?userid=${encodeURIComponent(userId)}`;
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ contract_id: string }> }) {
	try {
		if (!BACKEND_URL) {
			return NextResponse.json({ error: "Backend URL not configured" }, { status: 500 });
		}

		const session = await auth();
		if (!session?.user?._id) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { contract_id } = await params;
		if (!contract_id) {
			return NextResponse.json({ error: "contract_id is required" }, { status: 400 });
		}

		const url = buildBackendUrl(contract_id, session.user._id);
		const res = await fetch(url, { method: "GET" });
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
		console.error("GET /api/contracts/result/[contract_id] error", err);
		return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
	}
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ contract_id: string }> }) {
	try {
		if (!BACKEND_URL) {
			return NextResponse.json({ error: "Backend URL not configured" }, { status: 500 });
		}

		const session = await auth();
		if (!session?.user?._id) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { contract_id } = await params;
		if (!contract_id) {
			return NextResponse.json({ error: "contract_id is required" }, { status: 400 });
		}

		const url = buildBackendUrl(contract_id, session.user._id);
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
		console.error("DELETE /api/contracts/result/[contract_id] error", err);
		return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
	}
}

