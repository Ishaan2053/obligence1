"use client";
import React from "react";
import { useSession } from "next-auth/react";
import { Separator } from "@/components/ui/separator";
import { Sheet } from "lucide-react";
type Props = {};

function page({}: Props) {
  const { data: session } = useSession();
  const user = session?.user;
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <section>
        <h1 className="font-light text-sm text-muted-foreground">
          My Workspace
        </h1>
        <h2 className="font-semibold text-2xl">Welcome, {user?.name}!</h2>
      </section>

      <section>
        {/* cards */}
        <div className="grid grid-cols-5 gap-4">
          {[
            {
              title: "Document 1",
              imageUrl: "URL1",
              link: "/document1",
            },
            {
              title: "Document 2",
              imageUrl: "URL2",
              link: "/document2",
            },
            {
              title: "Document 3",
              imageUrl: "URL3",
              link: "/document3",
            },
            {
              title: "Document 4",
              imageUrl: "URL4",
              link: "/document4",
            },
            {
              title: "Document 5",
              imageUrl: "URL5",
              link: "/document5",
            },
          ].map((document, i) => (
            <div key={i} className="flex flex-col items-center">
              <a href={document.link}>
                <img
                  src={document.imageUrl}
                  alt={document.title}
                  className="border rounded-2xl h-40 w-40"
                />
                <h3 className="text-center font-semibold">{document.title}</h3>
              </a>
            </div>
          ))}
        </div>
      </section>
      <Separator className="my-6" />

      <section className="flex flex-col md:flex">
        <div className="w-1/2 space-y-6">
          <h2 className="font-semibold text-2xl">Recent Activity</h2>
          <div className="space-y-4">
            {
              [
              {
                title: "Document 1",
                editedTime: "2 hours ago",
              },
              {
                title: "Document 2",
                editedTime: "5 hours ago",
              },
              {
                title: "Document 3",
                editedTime: "1 day ago",
              },
              {
                title: "Document 4",
                editedTime: "3 days ago",
              },
              {
                title: "Document 5",
                editedTime: "1 week ago",
              },
              ].map((activity, i) => (
              <div
                key={i}
                className="flex items-center gap-2 text-sm text-muted-foreground"
              >
                <Sheet className="text-foreground rounded-full h-8 w-8" />
                <div className="flex flex-col">
                <h4 className="font-semibold">{activity.title}</h4>
                <p className="text-xs text-muted-foreground italic">
                  Edited {activity.editedTime}
                </p>
                </div>
              </div>
              ))
            }
          </div>{" "}
        </div>

        <div className="w-1/2"></div>
      </section>
    </div>
  );
}

export default page;
