import Navbar from "@/component/Navbar";
import Contact from "@/components/landing/Contact";
import Footer from "@/components/landing/Footer";

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-slate-950">
      <Navbar />
      
      <main className="flex-grow pt-16">
        <Contact />
      </main>

      <Footer />
    </div>
  );
}
