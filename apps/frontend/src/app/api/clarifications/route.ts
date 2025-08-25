import { NextResponse } from "next/server"

// Mock data for clarifications across contracts
// Shape chosen to match the Clarifications page needs
// ContractEntry: { id, title, created_at, clarifications: Clarification[] }
// Clarification: { id, question, options, status, created_at }

export async function GET() {
  const contracts = [
    {
      id: "contract-a",
      title: "MSA - Acme Corp",
      created_at: "2025-08-18T09:00:00Z",
      clarifications: [
        {
          id: "clar123",
          question: "Which effective date should we use?",
          options: ["2024-01-01", "2024-02-01"],
          status: "pending",
          created_at: "2025-08-20T10:00:00Z",
        },
        {
          id: "clar124",
          question: "Confirm governing law?",
          options: ["Delaware", "California"],
          status: "resolved",
          created_at: "2025-08-19T08:30:00Z",
        },
      ],
    },
    {
      id: "contract-b",
      title: "NDA - Globex",
      created_at: "2025-08-10T14:32:00Z",
      clarifications: [
        {
          id: "clar200",
          question: "Disclosure period length?",
          options: ["1 year", "2 years"],
          status: "pending",
          created_at: "2025-08-21T11:00:00Z",
        },
      ],
    },
    {
      id: "contract-c",
      title: "SOW - Initech",
      created_at: "2025-08-05T12:00:00Z",
      clarifications: [
        {
          id: "clar300",
          question: "Payment terms confirmation?",
          options: ["Net 30", "Net 45", "Advance"],
          status: "pending",
          created_at: "2025-08-22T09:15:00Z",
        },
        {
          id: "clar301",
          question: "Delivery milestone dates?",
          options: ["Q3", "Q4"],
          status: "pending",
          created_at: "2025-08-23T16:20:00Z",
        },
      ],
    },
  ]

  return NextResponse.json({ contracts })
}
