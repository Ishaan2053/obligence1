import { useState, useEffect } from "react";
import useSWR from "swr";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Search as SearchIcon, Loader2, FileText, Clock, X, History } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Separator } from "../ui/separator";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

type Report = { id: string; name: string; date?: string; summary?: string };
type RecentDoc = { id: string; title: string; editedAt: string; summary?: string };

export function SearchDialog({ isOpen, onClose }: { isOpen: boolean; onClose: (open: boolean) => void }) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  const { data: reports, isLoading } = useSWR<Report[]>(
    debouncedQuery ? `/api/reports?search=${debouncedQuery}` : null,
    fetcher
  );

  // Recent documents when there is no query
  const { data: recentPayload, isLoading: recentLoading } = useSWR<{
    documents: RecentDoc[];
  }>(!debouncedQuery ? "/api/recent-documents" : null, fetcher);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [query]);

  const showEmptyHint = !query && !isLoading && !recentLoading;
  const hasResults = !!reports && reports.length > 0;
  const recentDocs = recentPayload?.documents ?? [];
  const hasRecent = !debouncedQuery && recentDocs.length > 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl h-fit">
        <div className="flex items-center gap-2 mb-2 h-fit sticky top-0 bg-background">
          <SearchIcon className="h-5 w-5 text-primary" />
          <DialogTitle className="text-lg font-light">Search Reports</DialogTitle>
          {/* <div className="ml-auto text-xs text-muted-foreground hidden sm:block">Press Esc to close</div> */}
        </div>
        <div className="relative flex items-center h-fit">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by report name or ID..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 pr-10"
            autoFocus
          />
          {query && !isLoading && (
            <button
              aria-label="Clear query"
              onClick={() => setQuery("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-muted transition"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          )}
          {isLoading && (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
          )}
        </div>

        {/* Content area */}
        <div className="mt-3 max-h-72 overflow-y-auto pr-1">
          {/* {showEmptyHint && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 text-sm text-muted-foreground"
            >
              <SearchIcon className="h-4 w-4" />
              Start typing to search your reports
            </motion.div>
          )} */}

          {/* Recent documents list */}
          {!debouncedQuery && (recentLoading || hasRecent) && (
            <div className="mt-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                <History className="h-3.5 w-3.5" /> Recent documents
              </div>
              {recentLoading && (
                <div className="space-y-2">
                  <Skeleton className="h-6" />
                  <Skeleton className="h-6" />
                </div>
              )}
              {!recentLoading && hasRecent && (
                <ul>
                  <AnimatePresence initial={false}>
                    {recentDocs.map((doc) => (
                      <motion.li
                        key={`recent-${doc.id}`}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.15 }}
                        className="my-2"
                      >
                        <Link
                          href={`/dashboard/results/${doc.id}`}
                          className="flex items-center gap-3 px-2 py-2 rounded-2xl hover:bg-accent/60 transition"
                          onClick={() => onClose(false)}
                        >
                          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-muted text-foreground">
                            <FileText className="h-4 w-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-sm font-medium truncate">{doc.title}</div>
                            <div className="text-xs text-muted-foreground truncate">
                              {doc.summary ?? `Last edited: ${new Date(doc.editedAt).toLocaleString()}`}
                            </div>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            {new Date(doc.editedAt).toLocaleDateString()}
                          </div>
                        </Link>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </div>
          )}

          {isLoading && (
            <div className="space-y-2 mt-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Loader2 className="h-3.5 w-3.5 animate-spin" /> Searching...
              </div>
              <Skeleton className="h-6" />
              <Skeleton className="h-6" />
              <Skeleton className="h-6" />
            </div>
          )}

          {!isLoading && hasResults && (
            <ul className="">
              <AnimatePresence initial={false}>
                {reports!.map((report) => (
                  <motion.li
                    key={report.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.15 }}
                    className="my-2"
                  >
                    <Link
                      href={`/dashboard/results/${report.id}`}
                      className="flex items-center gap-3 px-2 py-2 rounded-2xl hover:bg-accent/60 transition"
                      onClick={() => onClose(false)}
                    >
                      <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/10 text-primary">
                        <FileText className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium truncate">{report.name}</div>
                        <div className="text-xs text-muted-foreground truncate">
                          {report.summary ?? `ID: ${report.id}`}
                        </div>
                      </div>
                      {report.date && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground font-light ">
                          
                          {(() => {
                            const d = new Date(report.date as string);
                            return isNaN(d.getTime()) ? String(report.date) : d.toLocaleDateString();
                          })()}
                        </div>
                      )}
                    </Link>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          )}

          {!isLoading && !hasResults && !!query && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-muted-foreground"
            >
              No reports found.
            </motion.div>
          )}
        </div>

        <DialogClose className="sr-only" />
      </DialogContent>
    </Dialog>
  );
}