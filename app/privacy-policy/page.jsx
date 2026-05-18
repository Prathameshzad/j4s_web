'use client';

import React, { useState, useEffect, useRef } from 'react';
import Navbar from '@/component/Navbar';
import Footer from '@/components/landing/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  Eye, 
  Lock, 
  Database, 
  Users, 
  UserCheck, 
  Globe, 
  Search,
  BookOpen, 
  Calendar,
  CheckCircle,
  AlertCircle,
  Mail,
  ChevronRight,
  Download
} from 'lucide-react';

const SECTIONS = [
  {
    id: 'introduction',
    title: '1. Introduction & Scope',
    icon: BookOpen,
    content: `Welcome to Shiksha Disha ("we," "our," or "us"). We are committed to protecting your privacy and ensuring the security of your personal data. 

This Privacy Policy explains how we collect, use, store, process, and protect your information when you use the Shiksha Disha web application, mobile applications, and academic management services (collectively, the "Services").

This policy applies to all users of our platform, including Institute Administrators, Teachers, Students, Parents, and Website Visitors. By accessing or using our Services, you consent to the collection and use of your data as described in this policy.`
  },
  {
    id: 'info-collect',
    title: '2. Information We Collect',
    icon: Database,
    content: `To provide our academic management services, we collect various categories of information. This is divided into information you provide directly, data generated through platform usage, and details provided by your Educational Institute.`,
    details: [
      {
        title: 'Institutional & Admin Data',
        desc: 'Institute details (name, address, logo, registration number), administrator names, work email addresses, and phone numbers required to set up the school tenant.'
      },
      {
        title: 'Teacher & Staff Profiles',
        desc: 'Names, employee IDs, email addresses, phone numbers, academic qualifications, subjects taught, and attendance logs managed by the school.'
      },
      {
        title: 'Student & Parent Information',
        desc: 'Student names, roll numbers, class/section, photos, and parental contact details (name, email, phone number, address) required for academic progress tracking and guardian communication.'
      },
      {
        title: 'Academic & Operational Records',
        desc: 'Grades, examination results, report cards, class attendance, homework assignments, timetable logs, and fee payment status/history.'
      },
      {
        title: 'Technical & Usage Data',
        desc: 'IP addresses, browser type, device information, operating system, log data, page response times, and cookies indicating how you navigate and interact with the platform.'
      }
    ]
  },
  {
    id: 'how-we-use',
    title: '3. How We Use Your Data',
    icon: Eye,
    content: `We use the collected information for specific, legitimate business and academic purposes. We never sell your personal data.`,
    uses: [
      'Facilitating core institute operations (grading, attendance, timetable scheduling).',
      'Enabling secure, real-time communications between teachers, students, parents, and admins.',
      'Processing fee payments and generating invoices securely.',
      'Providing technical support, diagnosing platform bugs, and optimizing user interface experience.',
      'Sending essential operational updates, notifications (e.g. attendance alerts, exam schedules), and security warnings.',
      'Complying with statutory reporting requirements and applicable educational guidelines.'
    ]
  },
  {
    id: 'data-security',
    title: '4. Data Security & Storage',
    icon: Lock,
    content: `The security of your academic and personal information is our absolute priority. We employ industry-standard administrative, physical, and technical safeguards to keep your data secure.`,
    features: [
      {
        title: 'Encryption Standards',
        desc: 'All data transmitted between your device and our servers is protected using TLS 1.3 encryption. At-rest data is encrypted using advanced AES-256 standard databases.'
      },
      {
        title: 'Tenant Isolation',
        desc: 'Each educational institution operates within a strictly isolated database container, ensuring no cross-contamination or unauthorized access between different schools.'
      },
      {
        title: 'Access Control',
        desc: 'Role-based access controls (RBAC) ensure that teachers, parents, and students can only access data relevant to their authorized profiles.'
      },
      {
        title: 'Regular Backups',
        desc: 'Automated, encrypted daily backups are securely maintained to prevent data loss due to unforeseen physical hardware or logical system failures.'
      }
    ]
  },
  {
    id: 'data-sharing',
    title: '5. Data Sharing & Disclosures',
    icon: Users,
    content: `We do not sell or rent your personal information to third parties. We share data only in the following controlled scenarios:`,
    details: [
      {
        title: 'With Your Institution',
        desc: 'All information provided under an institutional account is fully accessible to the designated school administrators, who manage roles and access rights.'
      },
      {
        title: 'Third-Party Service Providers',
        desc: 'We share necessary metrics with authorized vendors assisting in our operations, including secure cloud hosting (AWS), database backends, payment gateways, and SMS/Email dispatch tools under strict data processing agreements.'
      },
      {
        title: 'Legal Compliance',
        desc: 'If required by court order, law enforcement, or statutory government authorities to protect security, comply with legal obligations, or prevent fraud.'
      }
    ]
  },
  {
    id: 'user-rights',
    title: '6. User Rights & Control',
    icon: UserCheck,
    content: `We believe in providing full transparency and control over your data. Depending on your role, you have rights to manage your personal data:`,
    rights: [
      {
        title: 'Access & Rectification',
        desc: 'You can request to view and correct inaccuracies in your personal profile. For student/academic records, corrections are managed directly by your school administrator.'
      },
      {
        title: 'Data Portability',
        desc: 'School administrators can export student, staff, and transaction data in structured, machine-readable formats (Excel/CSV) at any time.'
      },
      {
        title: 'Deletion & Erasure',
        desc: 'You can request account deletion. Please note that academic records associated with an active enrollment are retained as required by local educational boards.'
      },
      {
        title: 'Notification Preferences',
        desc: 'You can manage email, SMS, and push notification preferences inside your account profile dashboard settings.'
      }
    ]
  },
  {
    id: 'children-privacy',
    title: "7. Children's Privacy",
    icon: Shield,
    content: `Given that our platform manages student profiles under 18, we adhere strictly to child privacy regulations, including the Digital Personal Data Protection (DPDP) Act in India and COPPA guidelines.

Student accounts are created solely at the direction and with the authorization of the respective educational institution and/or their parents or legal guardians. 

We do not collect personal information from minors independently. Parents and legal guardians retain the right to review their child's information, request corrections, or request deletion by coordinating with the school administration.`
  },
  {
    id: 'cookies',
    title: '8. Cookies & Tracking',
    icon: Globe,
    content: `We use cookies, tokens, and local storage technologies to keep you securely logged in, remember dashboard preferences, and understand website performance.`,
    features: [
      {
        title: 'Essential Session Cookies',
        desc: 'Required for secure authentication and navigating the dashboard without constantly re-entering login credentials.'
      },
      {
        title: 'Performance & Analytics',
        desc: 'Anonymized session analysis to identify platform latency, slow-loading assets, and interface interaction rates to refine usability.'
      }
    ]
  },
  {
    id: 'compliance',
    title: '9. Legal & Compliance',
    icon: Shield,
    content: `Shiksha Disha is structured to align with global security frameworks and localized Indian rules:`,
    compliancePoints: [
      'Full compliance with Section 43A of the Information Technology Act (India) for reasonable security practices.',
      'Architected in accordance with the Indian Digital Personal Data Protection (DPDP) Act requirements.',
      'Compliant with data residency guidelines, storing all core institutional and student records securely within Indian cloud server zones.'
    ]
  },
  {
    id: 'contact',
    title: '10. Updates & Contact Information',
    icon: Mail,
    content: `We may revise this Privacy Policy periodically to reflect technological adjustments, legal compliance, or changes in operational workflows. We will notify you of significant changes via email or system-wide dashboard banners.

If you have questions, grievances, or requests regarding this Privacy Policy or your data practices, please reach out to our designated Data Protection Officer:`,
    contactDetails: {
      email: 'privacy@shikshadisha.in',
      phone: '+91 98765 43210',
      address: 'Data Protection Officer, Shiksha Disha, 123 Tech Park, Hitech City, Hyderabad, India'
    }
  }
];

export default function PrivacyPolicy() {
  const [activeSection, setActiveSection] = useState('introduction');
  const [searchQuery, setSearchQuery] = useState('');
  const [highlightedText, setHighlightedText] = useState('');
  const sectionRefs = useRef({});

  // Setup observer to track active section while scrolling
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0
    };

    const handleIntersect = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);

    SECTIONS.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) {
        observer.observe(element);
        sectionRefs.current[section.id] = element;
      }
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100; // offset for the sticky navbar
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setActiveSection(id);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const filteredSections = SECTIONS.filter(section => {
    const matchesSearch = section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          section.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <Navbar />

      <main className="flex-grow">
        {/* Banner Section */}
        <section className="relative overflow-hidden bg-slate-900 py-24 text-white">
          {/* Subtle Background Glows */}
          <div className="absolute top-0 left-1/4 h-72 w-72 rounded-full bg-orange-500/20 blur-3xl" />
          <div className="absolute bottom-0 right-1/4 h-72 w-72 rounded-full bg-orange-600/10 blur-3xl" />
          
          <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 rounded-full bg-orange-500/10 px-4 py-1.5 text-sm font-semibold text-orange-400 border border-orange-500/20"
            >
              <Shield className="h-4 w-4" />
              <span>Trust & Security Portal</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mt-6 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl font-sans"
            >
              Privacy Policy
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mx-auto mt-6 max-w-2xl text-lg text-slate-350"
            >
              Learn how we manage, protect, and secure your personal and academic data inside the Shiksha Disha portal.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-8 flex flex-wrap items-center justify-center gap-4 text-sm text-slate-400"
            >
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-orange-500" />
                Last Updated: May 18, 2026
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-slate-700 hidden sm:inline" />
              <button 
                onClick={handlePrint}
                className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
              >
                <Download className="h-4 w-4 text-orange-500" />
                Print / Save PDF
              </button>
            </motion.div>
          </div>
        </section>

        {/* Interactive Content Grid */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-4">
            
            {/* Sidebar Table of Contents */}
            <aside className="lg:col-span-1 lg:sticky lg:top-28 lg:self-start hidden lg:block">
              {/* Search Bar */}
              <div className="relative mb-6">
                <input
                  type="text"
                  placeholder="Search policy..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 pl-11 text-sm text-slate-900 outline-none transition-all focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                />
                <Search className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
              </div>

              <div className="rounded-3xl border border-slate-250/50 bg-white p-6 shadow-xl shadow-slate-100/50 dark:border-slate-850/50 dark:bg-slate-900 dark:shadow-none">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Sections
                </h3>
                
                <ul className="mt-4 space-y-2">
                  {SECTIONS.map((section) => {
                    const Icon = section.icon;
                    const isActive = activeSection === section.id;
                    return (
                      <li key={section.id}>
                        <button
                          onClick={() => scrollToSection(section.id)}
                          className={`group flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold transition-all cursor-pointer ${
                            isActive
                              ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                              : 'text-slate-600 hover:bg-slate-100 hover:text-orange-500 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white'
                          }`}
                        >
                          <Icon className={`h-4.5 w-4.5 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-orange-500 dark:group-hover:text-white'}`} />
                          <span className="truncate">{section.title.split('. ')[1]}</span>
                          <ChevronRight className={`ml-auto h-4 w-4 transition-transform ${isActive ? 'rotate-90 text-white' : 'text-slate-300 dark:text-slate-700'}`} />
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </aside>

            {/* Privacy content Area */}
            <div className="lg:col-span-3">
              {/* Search Result Information */}
              {searchQuery && (
                <div className="mb-8 rounded-2xl bg-orange-50/50 border border-orange-200/50 p-4 text-sm text-orange-850 dark:bg-orange-950/20 dark:border-orange-900/30 dark:text-orange-300">
                  Showing results for <span className="font-bold">"{searchQuery}"</span>. ({filteredSections.length} sections found)
                </div>
              )}

              <div className="space-y-12">
                <AnimatePresence>
                  {filteredSections.map((section, idx) => {
                    const Icon = section.icon;
                    return (
                      <motion.section
                        key={section.id}
                        id={section.id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5, delay: idx * 0.05 }}
                        className="scroll-mt-28 rounded-3xl border border-slate-200/60 bg-white p-8 shadow-xl shadow-slate-100/50 dark:border-slate-800/60 dark:bg-slate-900 dark:shadow-none hover:shadow-2xl hover:shadow-orange-500/5 transition-all duration-300"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4 border-b border-slate-100 pb-6 dark:border-slate-800">
                          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-500">
                            <Icon className="h-6 w-6" />
                          </div>
                          <div>
                            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                              {section.title}
                            </h2>
                            <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">Shiksha Disha Platform Policy</p>
                          </div>
                        </div>

                        <div className="mt-6 text-base leading-relaxed text-slate-650 dark:text-slate-350 whitespace-pre-line">
                          {section.content}
                        </div>

                        {/* Custom visual rendering based on section variables */}
                        {section.details && (
                          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
                            {section.details.map((detail, dIdx) => (
                              <div 
                                key={dIdx} 
                                className="rounded-2xl border border-slate-100 bg-slate-50/50 p-5 dark:border-slate-800 dark:bg-slate-950/40"
                              >
                                <h4 className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                                  <span className="h-2 w-2 rounded-full bg-orange-500" />
                                  {detail.title}
                                </h4>
                                <p className="mt-3 text-sm text-slate-600 dark:text-slate-450 leading-relaxed">
                                  {detail.desc}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}

                        {section.uses && (
                          <ul className="mt-8 space-y-4">
                            {section.uses.map((use, uIdx) => (
                              <li key={uIdx} className="flex items-start gap-3">
                                <CheckCircle className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
                                <span className="text-base text-slate-600 dark:text-slate-350">{use}</span>
                              </li>
                            ))}
                          </ul>
                        )}

                        {section.features && (
                          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
                            {section.features.map((feat, fIdx) => (
                              <div key={fIdx} className="flex gap-4 p-2">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-500/10 text-orange-500">
                                  <CheckCircle className="h-5 w-5" />
                                </div>
                                <div>
                                  <h4 className="font-bold text-slate-900 dark:text-white text-base">
                                    {feat.title}
                                  </h4>
                                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                    {feat.desc}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {section.rights && (
                          <div className="mt-8 space-y-4">
                            {section.rights.map((right, rIdx) => (
                              <div key={rIdx} className="flex gap-4 rounded-2xl border border-slate-100 p-5 dark:border-slate-800 bg-slate-50/20">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                  <span className="font-bold text-sm">{rIdx + 1}</span>
                                </div>
                                <div>
                                  <h4 className="font-bold text-slate-900 dark:text-white text-base">
                                    {right.title}
                                  </h4>
                                  <p className="mt-2 text-sm text-slate-650 dark:text-slate-400 leading-relaxed">
                                    {right.desc}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {section.compliancePoints && (
                          <ul className="mt-8 space-y-4">
                            {section.compliancePoints.map((point, cIdx) => (
                              <li key={cIdx} className="flex items-start gap-3">
                                <CheckCircle className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
                                <span className="text-base text-slate-600 dark:text-slate-350">{point}</span>
                              </li>
                            ))}
                          </ul>
                        )}

                        {section.contactDetails && (
                          <div className="mt-8 rounded-2xl bg-orange-500/5 border border-orange-500/20 p-6 dark:bg-orange-500/5">
                            <h4 className="font-bold text-slate-900 dark:text-white">Data Protection Officer Contacts</h4>
                            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 text-sm">
                              <div>
                                <span className="block text-xs font-bold uppercase tracking-wider text-slate-400">Support Email</span>
                                <a href={`mailto:${section.contactDetails.email}`} className="mt-1 block text-base font-bold text-orange-500 hover:underline">
                                  {section.contactDetails.email}
                                </a>
                              </div>
                              <div>
                                <span className="block text-xs font-bold uppercase tracking-wider text-slate-400">Escalation Hotline</span>
                                <span className="mt-1 block text-base font-bold text-slate-800 dark:text-slate-200">
                                  {section.contactDetails.phone}
                                </span>
                              </div>
                              <div className="sm:col-span-2 mt-2">
                                <span className="block text-xs font-bold uppercase tracking-wider text-slate-400">Mailing Address</span>
                                <span className="mt-1 block text-slate-700 dark:text-slate-350 leading-relaxed">
                                  {section.contactDetails.address}
                                </span>
                              </div>
                            </div>
                          </div>
                        )}
                      </motion.section>
                    );
                  })}
                </AnimatePresence>

                {filteredSections.length === 0 && (
                  <div className="text-center py-16 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                    <AlertCircle className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-700" />
                    <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">No sections found</h3>
                    <p className="mt-2 text-slate-500 max-w-sm mx-auto text-sm">We couldn't find any policy sections matching your search query. Please try searching for keywords like "data", "encryption" or "cookie".</p>
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="mt-6 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-bold text-white shadow-xl shadow-orange-500/10 hover:bg-orange-600 transition-colors"
                    >
                      Reset Search
                    </button>
                  </div>
                )}
              </div>
            </div>

          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
