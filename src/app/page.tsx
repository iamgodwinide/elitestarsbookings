import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Process from "@/components/Process";
import Celebrities from "@/components/Celebrities";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <main>
        <Hero />
        <Features />
        <Process />
        <Celebrities />
        <Testimonials />
        <FAQ />
        <Contact />
      </main>
      <Footer />
    </>
  );
}