"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowRightCircle,
  UploadIcon,
  FileText,
  BookText,
  Presentation,
  Code2,
  CheckCircle,
  ArrowLeft,
} from "lucide-react";
import React from "react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";

type Props = {};

function Page({}: Props) {
  type Template = {
    id: string;
    name: string;
    icon: React.ReactNode;
    short: string;
    long: string;
  };

  const templates: Template[] = [
    {
      id: "report",
      name: "Report",
      icon: <FileText className="h-5 w-5" />,
      short: "Structured summary with sections.",
      long: "A concise, structured document ideal for status updates, research summaries, and analytical write-ups. Includes headings for overview, findings, and recommendations.",
    },
    {
      id: "article",
      name: "Article",
      icon: <BookText className="h-5 w-5" />,
      short: "Narrative format with flow.",
      long: "A reader-friendly narrative format suitable for blogs, knowledge base entries, and editorial content. Emphasizes clarity, subheadings, and scannability.",
    },
    {
      id: "presentation",
      name: "Presentation",
      icon: <Presentation className="h-5 w-5" />,
      short: "Slide-like bullet structure.",
      long: "Slide-oriented outline designed for decks and talks. Focuses on bullet points, key takeaways, and visual pacing across sections.",
    },
    {
      id: "technical",
      name: "Technical Spec",
      icon: <Code2 className="h-5 w-5" />,
      short: "API, schema, and constraints.",
      long: "A detailed specification template for technical documentation, including context, requirements, API shapes, edge cases, and acceptance criteria.",
    },
  ];

  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const selected = templates.find((t) => t.id === selectedId) || null;
  const [step, setStep] = React.useState<1 | 2>(1);
  const totalSteps = 2;
  const progressValue = ((step - 1) / totalSteps) * 100; // show progress after completing a step
  return (
    <div className="space-y-6">
      {/* HEADER */}
      <section className="">
        <div className="flex items-center gap-3">
          {step === 2 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setStep(1)}
              aria-label="Go back to previous step"
            >
              <ArrowLeft /> Back
            </Button>
          )}
          <h1 className="text-2xl font-semibold">Create New Document</h1>
        </div>
      </section>
      {/* PROGRESS */}
      <div>
        <Progress value={progressValue} aria-label="Progress" />
      </div>
      <Separator />
      <AnimatePresence mode="wait" initial={false}>
        {step === 1 ? (
          <motion.section
            key="step-1"
            className="flex flex-col space-y-6"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            <h2 className="text-xl font-light">
              Start by uploading your document, giving it a name and a
              description
            </h2>
            <div className="flex gap-6 items-start">
              <div className="w-1/2 space-y-4">
                <Label>Document Name</Label>
                <Input
                  type="text"
                  placeholder="Enter document name"
                  className="mb-4"
                />
                <Label>Document Description</Label>
                <Textarea
                  placeholder="Enter document description"
                  className="mb-4"
                />
              </div>
              <div className="w-1/2">
                <div className="border-2 border-dashed border-border rounded-2xl p-6 flex flex-col items-center justify-center h-72 mt-4">
                  <div
                    className="w-full h-full flex flex-col items-center justify-center space-y-4 cursor-pointer"
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.currentTarget.classList.add("bg-gray-50");
                    }}
                    onDragLeave={(e) => {
                      e.preventDefault();
                      e.currentTarget.classList.remove("bg-gray-50");
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.currentTarget.classList.remove("bg-gray-50");
                      const files = e.dataTransfer.files;
                      console.log("Files dropped:", files);
                    }}
                    onClick={() =>
                      document.getElementById("file-upload")?.click()
                    }
                  >
                    <UploadIcon className="text-muted-foreground h-24 w-24" />
                    <p className="text-sm font-medium text-muted-foreground">
                      Drag and drop your document here
                    </p>
                    <p className="text-xs text-muted-foreground">
                      or click to browse files
                    </p>
                  </div>
                  <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    onChange={(e) => {
                      const files = e.target.files;
                      console.log("Files selected:", files);
                    }}
                  />
                </div>
              </div>
            </div>
            <Button onClick={() => setStep(2)}>
              Next <ArrowRightCircle />
            </Button>
          </motion.section>
        ) : (
          <motion.section
            key="step-2"
            className="flex flex-col space-y-6"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            <h2 className="text-xl font-light">
              Select from a variety of templates to suit your document type
            </h2>
            <LayoutGroup>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left: template list */}
                <div className="md:col-span-1 space-y-3">
                  {templates.map((t) => (
                    <motion.div
                      layout
                      key={t.id}
                      role="button"
                      aria-pressed={selectedId === t.id}
                      aria-selected={selectedId === t.id}
                      tabIndex={0}
                      onClick={() => setSelectedId(t.id)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ")
                          setSelectedId(t.id);
                      }}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                        mass: 0.6,
                      }}
                      className="focus:outline-none"
                    >
                      <Card
                        className={
                          "cursor-pointer transition-colors bg-transparent rounded-2xl border-border hover:bg-accent/30" +
                          (selectedId === t.id
                            ? " border-primary ring-1 ring-ring bg-accent/40"
                            : "")
                        }
                      >
                        <CardHeader className="flex flex-row items-start gap-3">
                          <div className="shrink-0 rounded-md bg-secondary p-2 text-primary">
                            <AnimatePresence mode="wait" initial={false}>
                              {selectedId === t.id ? (
                                <motion.span
                                  key="check"
                                  initial={{ scale: 0.6, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  exit={{ scale: 0.6, opacity: 0 }}
                                  transition={{ duration: 0.15 }}
                                  aria-hidden
                                >
                                  <CheckCircle className="h-5 w-5" />
                                </motion.span>
                              ) : (
                                <motion.span
                                  key="icon"
                                  layoutId={`icon-${t.id}`}
                                  aria-hidden
                                >
                                  {t.icon}
                                </motion.span>
                              )}
                            </AnimatePresence>
                          </div>
                          <div className="min-w-0">
                            <CardTitle className="text-base">
                              {t.name}
                            </CardTitle>
                            <CardDescription className="truncate">
                              {t.short}
                            </CardDescription>
                          </div>
                        </CardHeader>
                      </Card>
                    </motion.div>
                  ))}
                </div>

                {/* Right: template detail */}
                <div className="md:col-span-2">
                  <Card className="min-h-[16rem] rounded-2xl bg-transparent h-full">
                    <AnimatePresence mode="wait">
                      {selected ? (
                        <motion.div
                          key={selected.id}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={{ duration: 0.18, ease: "easeOut" }}
                          className="space-y-4"
                        >
                          <CardHeader className="flex flex-row items-center gap-3">
                            <div className="rounded-md bg-secondary p-2 text-primary">
                              <motion.span layoutId={`icon-${selected.id}`}>
                                {selected.icon}
                              </motion.span>
                            </div>
                            <div>
                              <CardTitle>{selected.name}</CardTitle>
                              <CardDescription>
                                {selected.short}
                              </CardDescription>
                            </div>
                          </CardHeader>
                          <Separator />
                          <CardContent className="text-sm text-muted-foreground">
                            {selected.long}
                          </CardContent>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="empty"
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={{ duration: 0.18, ease: "easeOut" }}
                          className="h-64"
                        >
                          <CardContent className="h-full flex items-center justify-center text-muted-foreground">
                            Select a template to see details
                          </CardContent>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Card>
                </div>
              </div>
            </LayoutGroup>

            <div>
              <Button>
                Submit <ArrowRightCircle />
              </Button>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Page;
