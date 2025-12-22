import React from 'react';
import { Sparkles, Users, Heart, Target, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

const AboutPage: React.FC = () => {
  return (
    <div className="bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      {/* Hero Section */}
      <div className="relative py-20 bg-white dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white mb-6">
            We are <span className="text-brand-600 dark:text-brand-400">SimpleWriteGo</span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Bridging the gap between artificial intelligence and human connection. We believe technology should enhance your voice, not replace it.
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 text-sm font-bold uppercase tracking-wider mb-6">
              Our Mission
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6">
              To make AI-generated content truly accessible and authentic for everyone.
            </h2>
            <div className="space-y-4 text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
              <p>
                As AI writing tools became ubiquitous, we noticed a problem: the internet was becoming flooded with robotic, generic, and soulless text. The human element—the nuance, the emotion, the unique flow—was getting lost.
              </p>
              <p>
                SimpleWriteGo was born from a simple idea: what if we could use AI to fix AI? We built a platform that understands the subtleties of human language, helping students, creators, and professionals polish their work without losing its meaning.
              </p>
            </div>
          </div>
          <div className="relative">
             <div className="absolute inset-0 bg-gradient-to-tr from-brand-200 to-indigo-200 dark:from-brand-900/40 dark:to-indigo-900/40 rounded-3xl transform rotate-3"></div>
             <img 
               src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
               alt="Team working together" 
               className="relative rounded-3xl shadow-xl w-full h-auto object-cover border border-slate-200 dark:border-slate-700"
             />
          </div>
        </div>
      </div>

      {/* Values Grid */}
      <div className="bg-white dark:bg-slate-800 py-20 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Our Core Values</h2>
            <p className="mt-4 text-slate-600 dark:text-slate-400">The principles that guide every feature we build.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                icon: Heart, 
                title: 'Authenticity First', 
                desc: 'We prioritize natural, human-sounding results over simple keyword stuffing. Your voice matters.' 
              },
              { 
                icon: Users, 
                title: 'User Empowerment', 
                desc: 'We build tools that help you learn and improve, fostering creativity rather than replacing it.' 
              },
              { 
                icon: Sparkles, 
                title: 'Continuous Innovation', 
                desc: 'AI is changing fast. We work tirelessly to keep our models ahead of the curve.' 
              }
            ].map((value, idx) => (
              <div key={idx} className="bg-slate-50 dark:bg-slate-900 p-8 rounded-2xl border border-slate-100 dark:border-slate-700 hover:shadow-lg transition duration-300">
                <div className="h-12 w-12 bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 rounded-xl flex items-center justify-center mb-6">
                  <value.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{value.title}</h3>
                <p className="text-slate-600 dark:text-slate-400">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-20 border-y border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { label: 'Words Humanized', value: '10M+' },
              { label: 'Active Users', value: '50k+' },
              { label: 'Countries', value: '120+' },
              { label: 'Uptime', value: '99.9%' },
            ].map((stat, idx) => (
              <div key={idx}>
                <div className="text-4xl font-extrabold text-brand-600 dark:text-brand-400 mb-2">{stat.value}</div>
                <div className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-brand-600 dark:bg-brand-700 py-20 transition-colors duration-300">
         <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-white mb-6">Join us on this journey</h2>
            <p className="text-brand-100 text-lg mb-8 max-w-2xl mx-auto">
              Ready to experience the difference? Start humanizing your content today and see why thousands trust SimpleWriteGo.
            </p>
            <div className="flex justify-center space-x-4">
               <Link to="/signup" className="px-8 py-4 bg-white text-brand-600 font-bold rounded-full shadow-lg hover:bg-brand-50 transition">
                 Get Started Free
               </Link>
               <Link to="/contact" className="px-8 py-4 bg-transparent border border-white text-white font-bold rounded-full hover:bg-white/10 transition">
                 Contact Us
               </Link>
            </div>
         </div>
      </div>
    </div>
  );
};

export default AboutPage;