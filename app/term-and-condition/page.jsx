'use client';

import React, { useState, useEffect, useRef } from 'react';
import Navbar from '@/component/Navbar';
import Footer from '@/components/landing/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  UserCheck, 
  CreditCard, 
  AlertTriangle, 
  HelpCircle, 
  Terminal, 
  ShieldCheck, 
  Scale, 
  Search,
  BookOpen, 
  Calendar,
  CheckCircle,
  AlertCircle,
  Mail,
  ChevronRight,
  Download,
  Flame
} from 'lucide-react';

const SECTIONS = [
  {
    id: 'agreement',
    title: '1. Agreement & Eligibility',
    icon: FileText,
    content: `Welcome to Shiksha Disha. These Terms & Conditions ("Terms", "Agreement") constitute a legally binding agreement between Shiksha Disha ("we," "our," or "us") and you, whether personally or on behalf of the educational institution you represent ("you", "Institution", "User").

By accessing or using our Services, you agree that you have read, understood, and agree to be bound by all of these Terms. If you do not agree with all of these terms, you are explicitly prohibited from using the platform and must discontinue use immediately.

To represent an institution and configure account levels, you must be a legally authorized administrator with the capacity to enter into binding agreements on behalf of your school, college, or university.`
  },
  {
    id: 'accounts',
    title: '2. Registration & Account Security',
    icon: UserCheck,
    content: `Access to our academic management dashboard requires registration. Educational institutions create a tenant space, under which accounts for Administrators, Teachers, Parents, and Students are provisioned.`,
    rules: [
      {
        title: 'Information Accuracy',
        desc: 'You must provide accurate, current, and complete registration details. You agree to update this information immediately to keep it accurate.'
      },
      {
        title: 'Credentials Protection',
        desc: 'You are responsible for safeguarding your account username, passwords, and security tokens. Any actions executed through your account are deemed your authorized actions.'
      },
      {
        title: 'Institutional Mandate',
        desc: 'Administrators are solely responsible for verifying the identity of staff members and students before issuing invitation tokens or creating logins.'
      },
      {
        title: 'Unauthorized Access Notification',
        desc: 'You must notify our technical support team immediately at security@shikshadisha.in upon detecting any breach of security or unauthorized access.'
      }
    ]
  },
  {
    id: 'saas-license',
    title: '3. SaaS License & Subscriptions',
    icon: ShieldCheck,
    content: `Subject to compliance with these Terms and receipt of due subscription fees, Shiksha Disha grants you a non-exclusive, non-transferable, revocable license to access and use our cloud-based educational management application.`,
    guidelines: [
      'The license is configured strictly for your registered educational institution; sharing credentials with external tutoring networks or affiliated branches without separate subscriptions is prohibited.',
      'You may not copy, reverse-engineer, modify, decompile, or extract the source code of our web or mobile interfaces.',
      'Shiksha Disha retains all proprietary intellectual property rights, database structures, and platform designs.',
      'Subject to active subscription standing, we guarantee standard data storage quotas and cloud accessibility to institutional databases.'
    ]
  },
  {
    id: 'acceptable-use',
    title: '4. Acceptable Use Policy',
    icon: AlertTriangle,
    content: `To ensure a secure environment for parents, teachers, and students, all users must adhere to strict acceptable conduct guidelines when interacting with our portal.`,
    rules: [
      {
        title: 'Prohibited Actions',
        desc: 'Do not upload, publish, or transmit any student data, homework files, or messages that contain malicious code, viruses, or defamatory, harassing, or legally obscene content.'
      },
      {
        title: 'System Protection',
        desc: 'Do not attempt to compromise system integrity, execute DDoS actions, perform SQL injections, bypass database role isolation, or scan system vulnerabilities.'
      },
      {
        title: 'No Bulk Scraping',
        desc: 'You are prohibited from using automated web scrapers, bots, spider tools, or data mining software to systematically extract profiles or educational content.'
      },
      {
        title: 'Accurate Representation',
        desc: 'Do not impersonate other teachers, institutional administrators, students, parents, or misrepresent school authorizations.'
      }
    ]
  },
  {
    id: 'ip-rights',
    title: '5. Intellectual Property Rights',
    icon: BookOpen,
    content: `Our intellectual property structure is designed to fully protect both our proprietary systems and your school's data assets.`,
    details: [
      {
        title: 'Shiksha Disha Property',
        desc: 'All source code, platform databases, visual layout systems, brand logos, custom vector graphics, and copywriting text remain the exclusive property of Shiksha Disha, protected by Indian and International trademark and copyright laws.'
      },
      {
        title: 'Your School Data Ownership',
        desc: 'Your institution retains absolute ownership of all content, grades, attendance reports, student names, fees transactions, and communication logs uploaded to your isolated database tenant. We hold no ownership claims over your proprietary records.'
      },
      {
        title: 'Limited Access Consent',
        desc: 'You grant us a limited, secure, system-level right to host, store, index, back up, and format your school data solely to deliver the requested Services to your users.'
      }
    ]
  },
  {
    id: 'billing-fees',
    title: '6. Fees, Billing & Refunds',
    icon: CreditCard,
    content: `Use of the Shiksha Disha academic management platform is subject to the pricing structures defined in your separate subscription invoice order sheet.`,
    guidelines: [
      'Billing Cycles: Subscription fees are billed in advance on a monthly, quarterly, or annual basis depending on your selected billing profile.',
      'Automatic Renewals: Subscriptions will renew automatically under the same pricing terms unless formally terminated in writing at least 30 days prior to the expiration of the current cycle.',
      'Late Payments: We reserve the right to temporarily restrict dashboard database write access or suspend logins if invoice payments remain overdue for more than 15 calendar days.',
      'Taxes: All fee amounts quoted on invoice orders are exclusive of standard Goods and Services Tax (GST) requirements, which will be computed at checkout.',
      'Refund Policy: Due to the high cloud-infrastructure provisioning cost of isolated database systems, all subscription fee payments are non-refundable.'
    ]
  },
  {
    id: 'sla-uptime',
    title: '7. Service Levels (SLA) & Uptime',
    icon: Terminal,
    content: `We strive to provide a highly reliable, high-speed experience to keep your school operating smoothly.`,
    features: [
      {
        title: 'Uptime Target',
        desc: 'We target a 99.9% uptime availability rate for the cloud portal, calculated monthly, excluding scheduled maintenance intervals.'
      },
      {
        title: 'Scheduled Maintenance',
        desc: 'Routine database tuning, security patches, and interface updates are scheduled between 12:00 AM and 04:00 AM IST to minimize impact, with 48-hour prior banner warnings.'
      },
      {
        title: 'Emergency Downtime',
        desc: 'In extreme security threat conditions (e.g. database intrusion threats), we reserve the right to temporarily suspend access to safeguard institution records.'
      }
    ]
  },
  {
    id: 'termination',
    title: '8. Suspension & Termination',
    icon: Flame,
    content: `This agreement remains active while you use the platform or maintain active subscription accounts.`,
    details: [
      {
        title: 'Termination for Convenience',
        desc: 'School administrators can request termination at the end of their current billing cycle by emailing accounts@shikshadisha.in at least 30 days in advance.'
      },
      {
        title: 'Termination for Cause',
        desc: 'We reserve the right to terminate or suspend your access immediately, without prior warning, for severe material breaches (e.g. non-payment, database hacking attempts, or uploading illegal content).'
      },
      {
        title: 'Data Retrieval Grace Period',
        desc: 'Upon formal subscription termination, school administrators have a 30-day grace period to export all student details, academic databases, and fee sheets. Following this period, all tenant databases are securely purged.'
      }
    ]
  },
  {
    id: 'disclaimers',
    title: '9. Limitation of Liability & Disclaimers',
    icon: Scale,
    content: `Please read this section carefully as it limits the legal liabilities of Shiksha Disha.

The Services are provided on an "AS IS" and "AS AVAILABLE" basis. We disclaim all warranties of any kind, whether express or implied, including fitness for a particular academic requirement, uninterrupted operations, or absence of localized network latency.

To the maximum extent permitted by applicable law, in no event shall Shiksha Disha or its parent entity be liable for any indirect, incidental, punitive, or consequential damages, or any loss of profits, records, or educational operational delays.

Our total aggregate liability for all claims arising out of or relating to this Agreement is strictly limited to the actual amount paid by your institution to us during the twelve (12) months preceding the event giving rise to liability.`
  },
  {
    id: 'governing-law',
    title: '10. Governing Law & Dispute Resolution',
    icon: Scale,
    content: `These Terms and Conditions shall be governed by, interpreted, and construed in accordance with the laws of India. 

Any dispute, conflict, or claim arising out of or in connection with these Terms, including validity, breach, or termination, shall be subject to exclusive mediation and arbitration.

The place of arbitration and legal jurisdiction shall be Hyderabad, Telangana, India, and court proceedings shall be heard in the competent courts of Hyderabad.`
  },
  {
    id: 'modifications',
    title: '11. Modifications & Support Channels',
    icon: HelpCircle,
    content: `We reserve the right to update or modify these Terms & Conditions at any time. Major modifications will be communicated with prominent banners on the administrator dashboard. Continued usage of the portal following updates indicates your acceptance.

For general policy queries, technical assistance, or institutional order modifications, please utilize our formal channels:`,
    contactDetails: {
      email: 'support@shikshadisha.in',
      phone: '+91 98765 43210',
      address: 'Legal Operations Division, Shiksha Disha, 123 Tech Park, Hitech City, Hyderabad, India'
    }
  }
];

export default function TermsAndConditions() {
  const [activeSection, setActiveSection] = useState('agreement');
  const [searchQuery, setSearchQuery] = useState('');
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
              <FileText className="h-4 w-4" />
              <span>Service Legal Agreement</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mt-6 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl font-sans"
            >
              Terms & Conditions
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mx-auto mt-6 max-w-2xl text-lg text-slate-350"
            >
              Please read these terms and conditions carefully before creating user accounts or using the academic dashboard.
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
                  placeholder="Search terms..."
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

            {/* Terms content Area */}
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
                            <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">Shiksha Disha Platform Terms</p>
                          </div>
                        </div>

                        <div className="mt-6 text-base leading-relaxed text-slate-650 dark:text-slate-350 whitespace-pre-line">
                          {section.content}
                        </div>

                        {/* Custom visual rendering based on section variables */}
                        {section.rules && (
                          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
                            {section.rules.map((rule, rIdx) => (
                              <div 
                                key={rIdx} 
                                className="rounded-2xl border border-slate-100 bg-slate-50/50 p-5 dark:border-slate-800 dark:bg-slate-950/40"
                              >
                                <h4 className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                                  <span className="h-2 w-2 rounded-full bg-orange-500" />
                                  {rule.title}
                                </h4>
                                <p className="mt-3 text-sm text-slate-600 dark:text-slate-450 leading-relaxed">
                                  {rule.desc}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}

                        {section.guidelines && (
                          <ul className="mt-8 space-y-4">
                            {section.guidelines.map((guideline, gIdx) => (
                              <li key={gIdx} className="flex items-start gap-3">
                                <CheckCircle className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
                                <span className="text-base text-slate-600 dark:text-slate-350">{guideline}</span>
                              </li>
                            ))}
                          </ul>
                        )}

                        {section.details && (
                          <div className="mt-8 space-y-4">
                            {section.details.map((detail, dIdx) => (
                              <div key={dIdx} className="flex gap-4 rounded-2xl border border-slate-100 p-5 dark:border-slate-800 bg-slate-50/20">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                  <span className="font-bold text-sm">{dIdx + 1}</span>
                                </div>
                                <div>
                                  <h4 className="font-bold text-slate-900 dark:text-white text-base">
                                    {detail.title}
                                  </h4>
                                  <p className="mt-2 text-sm text-slate-650 dark:text-slate-400 leading-relaxed">
                                    {detail.desc}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
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

                        {section.contactDetails && (
                          <div className="mt-8 rounded-2xl bg-orange-500/5 border border-orange-500/20 p-6 dark:bg-orange-500/5">
                            <h4 className="font-bold text-slate-900 dark:text-white">Legal & Compliance contacts</h4>
                            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 text-sm">
                              <div>
                                <span className="block text-xs font-bold uppercase tracking-wider text-slate-400">Support Desk</span>
                                <a href={`mailto:${section.contactDetails.email}`} className="mt-1 block text-base font-bold text-orange-500 hover:underline">
                                  {section.contactDetails.email}
                                </a>
                              </div>
                              <div>
                                <span className="block text-xs font-bold uppercase tracking-wider text-slate-400">Corporate Phone</span>
                                <span className="mt-1 block text-base font-bold text-slate-800 dark:text-slate-200">
                                  {section.contactDetails.phone}
                                </span>
                              </div>
                              <div className="sm:col-span-2 mt-2">
                                <span className="block text-xs font-bold uppercase tracking-wider text-slate-400">Postal Headquarters</span>
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
                    <p className="mt-2 text-slate-500 max-w-sm mx-auto text-sm">We couldn't find any terms sections matching your search query. Please try searching for keywords like "billing", "arbitration" or "suspension".</p>
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
