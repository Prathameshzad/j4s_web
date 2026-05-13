import Navbar from "@/component/Navbar";
import Features from "@/components/landing/Features";
import Footer from "@/components/landing/Footer";

export default function FeaturesPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-slate-950">
      <Navbar />
      
      <main className="flex-grow pt-16">
        <Features />
      </main>

      <Footer />
    </div>
  );
}
