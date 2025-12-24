import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight, ShieldCheck, Zap, MessageCircle, Activity, PenTool, BookOpen, Globe, Layers, FileText, Sparkles, Code2 } from 'lucide-react';
import HumanizerTool from './HumanizerTool';

const LandingPage: React.FC = () => {
  const faqs = [
    {
      q: "1. How does SimpleWriteGo work?",
      a: "SimpleWriteGo uses advanced AI technology to rephrase and refine your text, making it sound more natural and human-like. It analyzes your writing and improves sentence structure, vocabulary, and flow, all while retaining the original meaning."
    },
    {
      q: "2. Does SimpleWriteGo bypass Turnitin and other AI checkers?",
      a: "SimpleWriteGo is designed to humanize your content, making it sound more natural and less likely to be flagged by AI detection tools. However, we can't guarantee that it will bypass all AI checkers like Turnitin, as these tools are constantly improving."
    },
    {
      q: "3. How much does SimpleWriteGo cost?",
      a: "SimpleWriteGo offers several pricing plans based on the features you need and the number of words you wish to process. You can check our subscription page for specific plans and pricing details."
    },
    {
      q: "4. What languages does SimpleWriteGo support?",
      a: "SimpleWriteGo currently supports English and a few other languages, including Spanish, French, German, and Italian. We’re always working to expand support for additional languages."
    },
    {
      q: "5. I want to humanize a long essay. Is it possible?",
      a: "Yes, you can humanize long essays! If your essay exceeds the word limit, you can process it in smaller sections or upgrade your plan to extend your word capacity."
    },
    {
      q: "6. I reached my word limit. How can I extend it?",
      a: "If you’ve reached your word limit, you can either upgrade your subscription to increase your word capacity or purchase additional credits to process more content."
    },
    {
      q: "7. Can I see previous humanizations?",
      a: "Yes, you can view your previously processed documents in your account dashboard. Just log in, and you’ll have access to your past work."
    },
    {
      q: "8. How do I cancel my subscription?",
      a: "To cancel your subscription, log into your account, go to the subscription settings, and select \"Cancel Subscription.\" You can cancel at any time before your next billing cycle. If you need help, feel free to contact our customer support team."
    }
  ];

  const trustedLogos = [
    { name: 'SecureTech', icon: ShieldCheck },
    { name: 'FastWriter', icon: Zap },
    { name: 'BlogMaster', icon: MessageCircle },
    { name: 'TextFlow', icon: Activity },
    { name: 'WordSmith', icon: PenTool },
    { name: 'EduGuard', icon: BookOpen },
    { name: 'GlobalPost', icon: Globe },
    { name: 'CopyScale', icon: Layers },
    { name: 'SmartDraft', icon: FileText },
    { name: 'DevStudio', icon: Code2 },
    { name: 'CreativeAI', icon: Sparkles },
    { name: 'ContentPro', icon: CheckCircle2 },
  ];

  return (
    <div className="flex flex-col">
      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: flex;
          width: max-content;
          animation: scroll 60s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32 lg:pt-32 lg:pb-40 bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-brand-50 to-white dark:from-slate-900 dark:to-slate-800 -z-10 transition-colors duration-300"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

          {/* Enhanced Badge */}
          <div className="inline-flex relative group mb-8 cursor-default">
            <div className="absolute transition-all duration-1000 opacity-40 -inset-px bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full blur-sm group-hover:opacity-80 group-hover:-inset-1 group-hover:duration-200 animate-tilt"></div>
            <div className="relative inline-flex items-center justify-center px-5 py-2 text-sm font-bold text-white transition-all duration-200 bg-white dark:bg-slate-900 font-pj rounded-full border border-slate-100 dark:border-slate-800 shadow-sm">
              <span className="relative flex h-2.5 w-2.5 mr-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-500"></span>
              </span>
              <span className="text-slate-600 dark:text-slate-300 font-medium mr-1.5">Now supporting</span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-600 via-purple-600 to-indigo-600 dark:from-brand-400 dark:via-purple-400 dark:to-indigo-400 font-extrabold flex items-center">
                Gemini 2.5 Flash <Zap className="h-3.5 w-3.5 ml-1 fill-current text-brand-500" />
              </span>
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-8">
            Humanize AI Text <br className="hidden md:block" /> to Sound <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-indigo-500 dark:from-brand-400 dark:to-indigo-400">Natural</span>
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-slate-600 dark:text-slate-300 mb-10">
            Transform robotic AI-generated content into authentic, human-like writing in seconds. Perfect for bloggers, students, and professionals.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/signup" className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-full text-white bg-brand-600 hover:bg-brand-700 shadow-lg hover:shadow-brand-500/30 transition-all duration-200">
              Start for Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link to="/pricing" className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-full text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-200">
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* Free Tool Preview Section */}
      <section className="py-16 bg-gradient-to-b from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 transition-colors duration-300" id="try-tool">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-brand-600 dark:text-brand-400 font-bold tracking-wider uppercase text-sm">Live Demo</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mt-2">See it in action</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 mt-4 max-w-2xl mx-auto">
              Paste your AI-generated text below and watch it transform into natural, human writing in seconds. No signup required.
            </p>
          </div>
          <HumanizerTool user={null} onUserUpdate={() => { }} embedded={true} />
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 bg-white dark:bg-slate-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl mb-6">Works in 3 simple steps</h2>
              <div className="space-y-8">
                {[
                  { step: '01', title: 'Paste your text', desc: 'Copy your AI-generated draft from ChatGPT, Claude, or Gemini.' },
                  { step: '02', title: 'Choose your tone', desc: 'Select the desired vibe: Professional, Casual, or Academic.' },
                  { step: '03', title: 'Get human results', desc: 'Click Humanize and get undetectable, natural text instantly.' }
                ].map((item, idx) => (
                  <div key={idx} className="flex">
                    <div className="flex-shrink-0 mr-4">
                      <div className="h-10 w-10 rounded-full bg-brand-600 text-white flex items-center justify-center font-bold">
                        {item.step}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-slate-900 dark:text-white">{item.title}</h4>
                      <p className="text-slate-600 dark:text-slate-400">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-10">
                <Link to="/signup" className="text-brand-600 dark:text-brand-400 font-semibold hover:text-brand-700 dark:hover:text-brand-300 flex items-center">
                  Try it now <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-brand-200 dark:bg-brand-900/30 rounded-3xl transform rotate-3 scale-105 opacity-20"></div>
              <div className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl rounded-2xl p-6">
                <div className="flex space-x-2 mb-4">
                  <div className="h-3 w-3 rounded-full bg-red-400"></div>
                  <div className="h-3 w-3 rounded-full bg-yellow-400"></div>
                  <div className="h-3 w-3 rounded-full bg-green-400"></div>
                </div>
                <div className="space-y-4">
                  <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg text-slate-400 dark:text-slate-500 text-sm">
                    AI: "The utilization of this methodology facilitates the optimization of workflow processes..."
                  </div>
                  <div className="flex justify-center">
                    <ArrowRight className="text-slate-300 dark:text-slate-600 transform rotate-90 md:rotate-0" />
                  </div>
                  <div className="p-4 bg-brand-50 dark:bg-brand-900/20 border border-brand-100 dark:border-brand-800 rounded-lg text-slate-800 dark:text-slate-200 text-sm">
                    Human: "Using this method helps streamline your workflow..."
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof - Infinite Scroll Marquee */}
      <section className="py-12 border-y border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 transition-colors duration-300 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 text-center mb-10">
          <p className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Trusted by 10,000+ writers and creators</p>
        </div>

        <div className="relative w-full overflow-hidden">
          {/* Fade Masks */}
          <div className="absolute top-0 left-0 h-full w-24 md:w-48 bg-gradient-to-r from-white dark:from-slate-800 to-transparent z-10 pointer-events-none"></div>
          <div className="absolute top-0 right-0 h-full w-24 md:w-48 bg-gradient-to-l from-white dark:from-slate-800 to-transparent z-10 pointer-events-none"></div>

          {/* Animated Track */}
          <div className="animate-marquee">
            {/* List 1 */}
            <div className="flex items-center gap-12 md:gap-24 px-12 shrink-0">
              {trustedLogos.map((logo, idx) => (
                <div key={`l1-${idx}`} className="flex items-center gap-3 group cursor-pointer opacity-60 hover:opacity-100 grayscale hover:grayscale-0 transition-all duration-300 transform hover:scale-105">
                  <div className="bg-slate-50 dark:bg-slate-700/50 p-2.5 rounded-xl border border-slate-100 dark:border-slate-700 group-hover:border-brand-200 dark:group-hover:border-brand-800 group-hover:bg-brand-50 dark:group-hover:bg-brand-900/20 text-slate-400 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                    <logo.icon className="h-6 w-6" />
                  </div>
                  <span className="text-xl font-bold text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors select-none whitespace-nowrap">
                    {logo.name}
                  </span>
                </div>
              ))}
            </div>
            {/* List 2 (Duplicate for seamless loop) */}
            <div className="flex items-center gap-12 md:gap-24 px-12 shrink-0">
              {trustedLogos.map((logo, idx) => (
                <div key={`l2-${idx}`} className="flex items-center gap-3 group cursor-pointer opacity-60 hover:opacity-100 grayscale hover:grayscale-0 transition-all duration-300 transform hover:scale-105">
                  <div className="bg-slate-50 dark:bg-slate-700/50 p-2.5 rounded-xl border border-slate-100 dark:border-slate-700 group-hover:border-brand-200 dark:group-hover:border-brand-800 group-hover:bg-brand-50 dark:group-hover:bg-brand-900/20 text-slate-400 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                    <logo.icon className="h-6 w-6" />
                  </div>
                  <span className="text-xl font-bold text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors select-none whitespace-nowrap">
                    {logo.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Institutions Section */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-10">Supporting writers at top institutions</p>
          <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-10 opacity-60 dark:opacity-40">
            <span className="text-2xl md:text-3xl font-serif font-bold text-slate-700 dark:text-slate-200 hover:text-brand-800 dark:hover:text-brand-400 transition cursor-default">Harvard</span>
            <span className="text-2xl md:text-3xl font-serif font-bold text-slate-700 dark:text-slate-200 hover:text-brand-800 dark:hover:text-brand-400 transition cursor-default">Stanford</span>
            <span className="text-2xl md:text-3xl font-serif font-bold text-slate-700 dark:text-slate-200 hover:text-brand-800 dark:hover:text-brand-400 transition cursor-default">MIT</span>
            <span className="text-2xl md:text-3xl font-serif font-bold text-slate-700 dark:text-slate-200 hover:text-brand-800 dark:hover:text-brand-400 transition cursor-default">Yale</span>
            <span className="text-2xl md:text-3xl font-serif font-bold text-slate-700 dark:text-slate-200 hover:text-brand-800 dark:hover:text-brand-400 transition cursor-default">Princeton</span>
            <span className="text-2xl md:text-3xl font-serif font-bold text-slate-700 dark:text-slate-200 hover:text-brand-800 dark:hover:text-brand-400 transition cursor-default">Columbia</span>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl mb-4">Why choose SimpleWriteGo?</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">We don't just spin text. We understand context, tone, and nuance to deliver truly human-quality results.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Bypass AI Detection', desc: 'Rewrites content to avoid flags from common AI detectors by altering sentence structure and vocabulary naturally.', icon: ShieldCheck },
              { title: 'Preserve Meaning', desc: 'Our advanced algorithms ensure the core message of your text remains 100% intact while improving flow.', icon: CheckCircle2 },
              { title: 'Multiple Tones', desc: 'Choose from Professional, Academic, Conversational, or Simple tones to match your audience perfectly.', icon: MessageCircle },
            ].map((feature, idx) => (
              <div key={idx} className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition">
                <div className="h-12 w-12 bg-brand-100 dark:bg-brand-900/40 text-brand-600 dark:text-brand-400 rounded-xl flex items-center justify-center mb-6">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{feature.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">SimpleWriteGo FAQ</h2>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">Common questions about our text humanization service.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-8 hover:shadow-md transition duration-200 border border-slate-100 dark:border-slate-700">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">{faq.q}</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-brand-600 dark:bg-brand-700 transition-colors duration-300">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to sound authentic?</h2>
          <p className="text-brand-100 text-lg mb-8">Join thousands of users enhancing their writing today. No credit card required for free plan.</p>
          <Link to="/signup" className="inline-block bg-white text-brand-600 font-bold px-8 py-4 rounded-full hover:bg-brand-50 transition shadow-lg">
            Start Humanizing for Free
          </Link>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;