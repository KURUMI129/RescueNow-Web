import { RexWidget } from "@/components/chatbot/rex-widget";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { About } from "@/components/sections/about";
import { Contact } from "@/components/sections/contact";
import { Faq } from "@/components/sections/faq";
import { Features } from "@/components/sections/features";
import { Hero } from "@/components/sections/hero";
import { Pricing } from "@/components/sections/pricing";
import { Services } from "@/components/sections/services";
import { Testimonials } from "@/components/sections/testimonials";

export default function HomePage() {
  return (
    <main className="relative min-h-screen">
      <Navbar />
      <Hero />
      <About />
      <Features />
      <Services />
      <Testimonials />
      <Pricing />
      <Faq />
      <Contact />
      <Footer />
      <RexWidget />
    </main>
  );
}
