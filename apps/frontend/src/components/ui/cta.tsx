import Link from "next/link";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
export default function CTA() {
  return (
    <div className="relative mx-auto w-full max-w-4xl overflow-hidden rounded-[40px] bg-background p-6 sm:p-10 md:p-20">
      <div className="absolute inset-0 hidden h-full w-full overflow-hidden md:block">
        <div className="absolute top-1/2 right-[-45%] aspect-square h-[800px] w-[800px] -translate-y-1/2">
          <div className="absolute inset-0 rounded-full bg-background/90 opacity-30"></div>
          <div className="absolute inset-0 scale-[0.8] rounded-full bg-orange-300 opacity-30"></div>
          <div className="absolute inset-0 scale-[0.6] rounded-full bg-orange-200 opacity-30"></div>
          <div className="absolute inset-0 scale-[0.4] rounded-full bg-orange-100 opacity-30"></div>
          <div className="absolute inset-0 scale-[0.2] rounded-full bg-orange-50 opacity-30"></div>
          <div className="absolute inset-0 scale-[0.1] rounded-full bg-white/50 opacity-30"></div>
        </div>
      </div>

      <div className="relative z-10">
        <h1 className="mb-3 text-3xl font-bold text-white sm:text-4xl md:mb-4 md:text-5xl">
          Let&apos;s Get In Touch.
        </h1>
        <p className="mb-6 max-w-md text-base text-white sm:text-lg md:mb-8">
          Your laboratory instruments should serve you, not the other way
          around. We&apos;re happy to help you.
        </p>

        <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
           <div className="flex items-center justify-center">
    
        <Link href='/signup'>
          <div
            className={cn(
              "group cursor-pointer group gap-2  h-[64px] flex items-center p-[11px] rounded-full",
              
            )}
          >
            <div className="border border-border bg-[#ff3f17]  h-[43px] rounded-full flex items-center justify-center text-white">
              <p className="font-medium tracking-tight mr-3 ml-2 flex items-center gap-2 justify-center ">
       Get started
              </p>
            </div>
            <div className="text-[#3b3a3a] group-hover:ml-2  ease-in-out transition-all size-[26px] flex items-center justify-center rounded-full border-2 border-[#3b3a3a]  ">
              <ArrowRight
                size={18}
                className="group-hover:-rotate-45 ease-in-out transition-all "
              />
            </div>
          </div>
        </Link>
     
    </div>

        </div>
      </div>
    </div>
  );
}
