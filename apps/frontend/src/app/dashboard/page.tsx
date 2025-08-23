"use client";
import React from "react";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { Separator } from "@/components/ui/separator";
import { FilePlus, Sheet } from "lucide-react";
import GlowingCards, { GlowingCard } from "@/components/dashboard/glowing-cards";
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
        <h2 className="font-semibold text-2xl">Welcome, <span className="from-primary/10 via-foreground/85 to-foreground/50 bg-gradient-to-tl bg-clip-text text-balance text-transparent ">{user?.name}!</span></h2>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -24 }}
        transition={{ duration: 0.22, ease: "easeOut", delay: 0.05 }}
      >
        {/* cards with glowing effect */}
        <GlowingCards
          enableGlow
          glowRadius={30}
          glowOpacity={1}
          animationDuration={350}
          // enableHover
          gap="1rem"
          maxWidth="64rem"
          padding="0"
          borderRadius="1rem"
          className="mt-2"
       >
          {[
            { title: "New Document", link: "/document1", icon: FilePlus, glowColor: "#737373" },
            { title: "Document 2", link: "/document2", icon: Sheet, glowColor: "#f97316" },
            { title: "Document 3", link: "/document3", icon: Sheet, glowColor: "#737373" },
     
          ].map((document, i) => {
            const Icon = (document.icon ?? Sheet) as React.ElementType;
            return (
              <GlowingCard
                key={i}
                glowColor={document.glowColor as string}
                className="group cursor-pointer select-none flex items-center justify-center min-h-32 md:min-h-48"
              >
                <motion.a
                  href={document.link}
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 30, mass: 0.6 }}
                  className="flex flex-col items-center outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:border-ring"
                >
                  <motion.span>
                    <Icon className=" group-hover:rotate-6 transition-all text-foreground h-10 w-10 md:h-20 md:w-20" />
                  </motion.span>
                  <h3 className="mt-2 text-xs text-foreground md:text-base text-center font-semibold">{document.title}</h3>
                </motion.a>
              </GlowingCard>
            );
          })}
        </GlowingCards>
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
