import Navbar from "@/component/Navbar";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import QuoteSection from "@/components/landing/QuoteSection";
import PricingContact from "@/components/landing/PricingContact";
import Contact from "@/components/landing/Contact";
import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-slate-950">
      <Navbar />
      
      <main className="flex-grow">
        <Hero />
        <QuoteSection />
        <Features />
        <PricingContact />
        <Contact />
      </main>

      <Footer />
    </div>
  );
}
