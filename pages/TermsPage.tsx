import React from 'react';
import { Link } from 'react-router-dom';

const TermsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 animate-in fade-in duration-500">
      <div className="mb-12">
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white sm:text-5xl mb-6">Terms of Service</h1>
        <div className="w-20 h-1.5 bg-brand-600 rounded-full mb-4"></div>
        <p className="text-slate-500 dark:text-slate-400">Last updated: {new Date().toLocaleDateString()}</p>
      </div>

      <div className="prose prose-lg dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 space-y-8 leading-relaxed">
        <section>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">1. Acceptance of Terms</h2>
          <p>
            By accessing and using SimpleWriteGo ("the Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our Service. These terms apply to all visitors, users, and others who access or use the Service.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">2. Description of Service</h2>
          <p>
            SimpleWriteGo provides AI-powered text processing tools designed to rewrite and refine content ("Humanization"). We offer both free and paid subscription plans with varying limits and features as described on our Pricing page.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">3. User Accounts</h2>
          <p>
            When you create an account with us, you must provide information that is accurate, complete, and current. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account.
          </p>
          <p className="mt-4">
            You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password. You agree not to disclose your password to any third party.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">4. Acceptable Use & Ethics</h2>
          <p>
            You agree not to use the Service for any unlawful purpose or any purpose prohibited under this clause. You agree not to use the Service in any way that could damage the Service, the services of others, or the general business of SimpleWriteGo.
          </p>
          <p className="mt-4">
            <strong>Academic Integrity:</strong> We do not condone the use of our tools for academic dishonesty. Users are responsible for adhering to the academic integrity policies of their respective institutions. Please review our <Link to="/ethics" className="text-brand-600 hover:underline">Ethics Policy</Link> for more details.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">5. Intellectual Property</h2>
          <p>
            The Service and its original content (excluding content provided by users), features, and functionality are and will remain the exclusive property of SimpleWriteGo and its licensors.
          </p>
          <p className="mt-4">
            You retain rights to the text you input into the Service and the output generated for you. SimpleWriteGo does not claim ownership of your content.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">6. Subscription, Billing, and Usage Limits</h2>
          <p>
            Some parts of the Service are billed on a subscription basis. You will be billed in advance on a recurring and periodic basis (such as monthly). You may cancel your subscription at any time; however, there are no refunds for partial months of service.
          </p>
          <p className="mt-4">
            Service usage is subject to the limits of your selected plan. While standard plans may have monthly word processing quotas, Administrator and Enterprise plans generally enjoy unlimited word processing capabilities, subject to fair usage policies intended to prevent abuse of the API.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">7. Termination</h2>
          <p>
            We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the Service will immediately cease.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">8. Limitation of Liability</h2>
          <p>
            In no event shall SimpleWriteGo, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">9. Disclaimer</h2>
          <p>
            Your use of the Service is at your sole risk. The Service is provided on an "AS IS" and "AS AVAILABLE" basis. The Service is provided without warranties of any kind, whether express or implied. We do not guarantee that the results generated by our AI will be 100% undetectable by all AI detectors, as these technologies are constantly evolving.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">10. Contact Us</h2>
          <p>
            If you have any questions about these Terms, please contact us at <span className="text-brand-600 dark:text-brand-400 font-medium">legal@simplewritego.com</span>.
          </p>
        </section>
      </div>
    </div>
  );
};

export default TermsPage;