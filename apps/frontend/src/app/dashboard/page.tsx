"use client";
import React from "react";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { Separator } from "@/components/ui/separator";
import { Sheet } from "lucide-react";
type Props = {};

function page({}: Props) {
  const { data: session } = useSession();
  const user = session?.user;
  return (
    <div className="max-w-5xl mx-auto space-y-6 justify-center">
      <motion.section
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -24 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
      >
        <h1 className="font-light text-sm text-muted-foreground">
          My Workspace
        </h1>
        <h2 className="font-semibold text-2xl">Welcome, {user?.name}!</h2>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -24 }}
        transition={{ duration: 0.22, ease: "easeOut", delay: 0.05 }}
      >
        {/* cards */}
        <div className="grid grid-cols-3 md:grid-cols-5 gap-2 md:gap-4">
          {[
            {
              title: "Document 1",
              imageUrl: "/test.jpg",
              link: "/document1",
            },
            {
              title: "Document 2",
              imageUrl: "/test.jpg",
              link: "/document2",
            },
            {
              title: "Document 3",
              imageUrl: "/test.jpg",
              link: "/document3",
            },
            {
              title: "Document 4",
              imageUrl: "/test.jpg",
              link: "/document4",
            },
            {
              title: "Document 5",
              imageUrl: "/test.jpg",
              link: "/document5",
            },
          ].map((document, i) => (
            <motion.a
              key={i}
              href={document.link}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 30, mass: 0.6 }}
              className="flex flex-col items-center rounded-2xl outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:border-ring"
            >
              <div className="border rounded-2xl size-20 md:h-40 md:w-40 overflow-hidden bg-card">
                <motion.img
                  src={document.imageUrl}
                  alt={document.title}
                  className="size-full object-cover"
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                />
              </div>
              <h3 className="mt-2 text xs md:text-base text-center font-semibold">{document.title}</h3>
            </motion.a>
          ))}
        </div>
      </motion.section>
      <Separator className="my-6" />

      <motion.section
        className="flex flex-col md:flex"
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -24 }}
        transition={{ duration: 0.22, ease: "easeOut", delay: 0.1 }}
      >
        <div className="w-full md:w-1/2 space-y-6">
          <h2 className="font-semibold text-2xl">Recent Activity</h2>
          <div className="space-y-4">
            {[
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
              <motion.div
                key={i}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.99 }}
                transition={{ type: "spring", stiffness: 500, damping: 35, mass: 0.6 }}
                className="flex items-center gap-2 text-sm text-muted-foreground rounded-full p-2 hover:bg-accent/30"
              >
                <motion.span whileHover={{ rotate: 3 }} className="inline-flex">
                  <Sheet className="text-foreground rounded-full h-8 w-8" />
                </motion.span>
                <div className="flex flex-col">
                  <h4 className="font-semibold text-foreground">{activity.title}</h4>
                  <p className="text-xs text-muted-foreground italic">
                    Edited {activity.editedTime}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>{" "}
        </div>

        <div className="w-1/2"></div>
  </motion.section>
    </div>
  );
}

export default page;
