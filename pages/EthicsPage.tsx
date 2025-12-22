import React from 'react';

const EthicsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 animate-in fade-in duration-500">
      <div className="mb-12">
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white sm:text-5xl mb-6">Ethics Policy</h1>
        <div className="w-20 h-1.5 bg-brand-600 rounded-full"></div>
      </div>

      <div className="prose prose-lg dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 space-y-8 leading-relaxed">
        <p>
          SimpleWriteGo is designed to help you improve how your writing sounds — more natural, clear, and human. We believe AI tools should support your learning, creativity, and communication, not replace your own effort.
        </p>
        <p>
          Many students use SimpleWriteGo to polish drafts, rephrase ideas, and improve the overall flow of their writing — and that’s exactly how the tool is meant to be used. Whether you're working on a paper, project, or personal writing, SimpleWriteGo can help refine and elevate your work.
        </p>
        <p>
          However, we do not encourage using SimpleWriteGo to bypass AI detection systems or to submit humanized content as original academic work. Every school or university has its own academic integrity policies, and it’s important to respect them. If you’re unsure, check with your instructor or advisor.
        </p>
        <p>
          When used responsibly, SimpleWriteGo can be a powerful tool that helps you express your ideas more effectively — without crossing ethical lines. Our goal is to support honest, meaningful work that reflects your own voice and thinking.
        </p>
        <p>
          In addition to rewriting, SimpleWriteGo offers an AI Check feature, allowing you to quickly see whether your text might be flagged as AI-generated. This gives you added confidence in how your content may be evaluated.
        </p>
        <p>
          You can also use SimpleWriteGo to create helpful, trustworthy, and people-first content that aligns with Google’s E-E-A-T principles — ensuring your work is authentic, credible, and respected by both readers and systems.
        </p>
      </div>
    </div>
  );
};

export default EthicsPage;