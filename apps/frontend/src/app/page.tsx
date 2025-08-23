import Hero from "@/components/landing/hero";
import { CardCarousel } from "@/components/ui/card-carousel";
import CTA from "@/components/ui/cta";
import Footer from "@/components/ui/footer";
import Navbar from "@/components/ui/navbar";
import SmokeyCursor from "@/components/ui/smokey-cursor";
import { TextScroll } from "@/components/ui/text-scroll";
import { Timeline } from "@/components/ui/timeline";

export default function Home() {
  const images = [
    {
      src: "/test.jpg",
      alt: "/test.jpg",
      testimonial:
        "Obligence has drastically reduced our contract review time. The AI spots the details I care about before I even have to ask.",
    },
    {
      src: "/test.jpg",
      alt: "Image 1",
      testimonial:
        "As a non-lawyer, extracting obligations and deadlines from complex agreements used to take hours. Now, it’s minutes with Obligence.",
    },
    {
      src: "/test.jpg",
      alt: "Image 1",
      testimonial:
        "Our department manages hundreds of contracts a year. Obligence takes the guesswork out and brings peace of mind.",
    },
    {
      src: "/test.jpg",
      alt: "Image 1",
      testimonial:
        "Lease reviews have always been a bottleneck. Obligence’s clause extraction lets me close deals faster and protect our firm’s interests.",
    },
    {
      src: "/test.jpg",
      alt: "Image 1",
      testimonial:
        "It used to be daunting to review third-party agreements, but Obligence spotlights what matters and gives actionable summaries.",
    },
    {
      src: "/test.jpg",
      alt: "Image 1",
      testimonial:
        "From regulatory addenda to liability clauses, Obligence’s output is structured, clear, and always easy to audit.",
    },
    {
      src: "/test.jpg",
      alt: "Image 1",
      testimonial:
        "I love how quickly we can onboard new clients—Obligence automatically highlights IP and confidentiality points, saving our team countless hours.",
    },
    {
      src: "/test.jpg",
      alt: "Image 1",
      testimonial:
        "Now, I upload vendor and grant contracts and get an instant snapshot of obligations. Obligence helps our public office stay transparent and proactive.",
    },
  ];

  const data = [
    {
      title: "Step 1: Upload Your Document",
      content: (
        <div>
          <p className="mb-8 text-lg tracking-wide font-normal ">
            Drag and drop your contract or agreement as a PDF. Obligence accepts
            a variety of legal and business documents for instant processing.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <img
              src="https://images.unsplash.com/photo-1506744038136-46273834b3fb"
              alt="PDF upload"
              width={500}
              height={500}
              className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
            />
            <img
              src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6"
              alt="Document selection"
              width={500}
              height={500}
              className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
            />
          </div>
        </div>
      ),
    },
    {
      title: "Step 2: AI Analyzes Your Contract",
      content: (
        <div>
          <p className="mb-8 text-lg tracking-wide font-normal ">
            Our intelligent agent powered by Portia deeply scans the document,
            extracting key clauses, important dates, parties, and
            obligations—all in minutes.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <img
              src="https://images.unsplash.com/photo-1487014679447-9f8336841d58"
              alt="AI analysis"
              width={500}
              height={500}
              className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
            />
            <img
              src="https://images.unsplash.com/photo-1556742044-3c52d6e88c62"
              alt="Document processing"
              width={500}
              height={500}
              className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
            />
          </div>
        </div>
      ),
    },
    {
      title: "Step 3: Human Review (If Needed)",
      content: (
        <div>
          <p className="mb-8 text-lg tracking-wide font-normal ">
            If something in your contract is ambiguous or complex, Obligence
            automatically pauses and invites you to review
            flagged sections.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <img
              src="https://images.unsplash.com/photo-1515165562835-c1cf5c366d82"
              alt="Human review"
              width={500}
              height={500}
              className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
            />
            <img
              src="https://images.unsplash.com/photo-1465101178521-c1a9136a3e43"
              alt="Legal discussion"
              width={500}
              height={500}
              className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
            />
          </div>
        </div>
      ),
    },
    {
      title: "Step 4: Receive Structured Insights",
      content: (
        <div>
          <p className="mb-8 text-lg tracking-wide font-normal ">
            Download, or explore your contract’s extracted data—fully
            structured, searchable, and ready for business action or legal
            compliance.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <img
              src="https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5"
              alt="Contract insights"
              width={500}
              height={500}
              className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
            />
            <img
              src="https://images.unsplash.com/photo-1473187983305-f615310e7daa"
              alt="Dashboard view"
              width={500}
              height={500}
              className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
            />
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="font-sans ">
      <Navbar />
      <div className="space-y-20">
        <Hero />

        <Timeline data={data} />
        <TextScroll
          className="font-display text-center text-4xl font-semibold tracking-tighter md:text-7xl md:leading-[5rem]"
          text="Obligence is great"
          default_velocity={2}
        />
        <CardCarousel
          images={images}
          autoplayDelay={2000}
          showPagination={true}
          showNavigation={true}
        />
        {/* <Pricing /> */}
        <CTA />
        <Footer />
      </div>
      <SmokeyCursor
  splatRadius={0.1}
  splatForce={3000}
  densityDissipation={8}
  velocityDissipation={5}
  colorUpdateSpeed={20}
  simulationResolution={64}
   backgroundColor={{ r: 0.8, g: 0.1, b: 0 }}
/>
    </div>
  );
}
