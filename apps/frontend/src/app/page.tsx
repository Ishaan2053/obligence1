import Hero from "@/components/hero";
import { CardCarousel } from "@/components/ui/card-carousel";
import Footer from "@/components/ui/footer";
import Navbar from "@/components/ui/navbar";

export default function Home() {
  const images = [
    {
      src: "",
      alt: "Image 1",
      testimonial:
        "Obligence has drastically reduced our contract review time. The AI spots the details I care about before I even have to ask.",
    },
    {
      src: "/card/1.png",
      alt: "Image 1",
      testimonial:
        "As a non-lawyer, extracting obligations and deadlines from complex agreements used to take hours. Now, it’s minutes with Obligence.",
    },
    {
      src: "/card/1.png",
      alt: "Image 1",
      testimonial:
        "Our department manages hundreds of contracts a year. Obligence takes the guesswork out and brings peace of mind.",
    },
    {
      src: "/card/1.png",
      alt: "Image 1",
      testimonial:
        "Lease reviews have always been a bottleneck. Obligence’s clause extraction lets me close deals faster and protect our firm’s interests.",
    },
    {
      src: "/card/1.png",
      alt: "Image 1",
      testimonial:
        "It used to be daunting to review third-party agreements, but Obligence spotlights what matters and gives actionable summaries.",
    },
    {
      src: "/card/1.png",
      alt: "Image 1",
      testimonial:
        "From regulatory addenda to liability clauses, Obligence’s output is structured, clear, and always easy to audit.",
    },
    {
      src: "/card/1.png",
      alt: "Image 1",
      testimonial:
        "I love how quickly we can onboard new clients—Obligence automatically highlights IP and confidentiality points, saving our team countless hours.",
    },
    {
      src: "/card/1.png",
      alt: "Image 1",
      testimonial:
        "Now, I upload vendor and grant contracts and get an instant snapshot of obligations. Obligence helps our public office stay transparent and proactive.",
    },
  ];
  return (
    <div className="font-sans ">
      <Navbar />
      <Hero />
      <CardCarousel
        images={images}
        autoplayDelay={2000}
        showPagination={true}
        showNavigation={true}
      />
      <Footer />
    </div>
  );
}
