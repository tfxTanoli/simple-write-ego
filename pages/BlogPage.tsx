import React from 'react';
import { Calendar, User, ArrowRight, Tag } from 'lucide-react';

const BlogPage: React.FC = () => {
  const posts = [
    {
      id: 1,
      title: "How to Humanize AI Text Effectively",
      excerpt: "Discover the secrets to making your AI-generated content sound natural, authentic, and undetectable by common checkers.",
      date: "Oct 24, 2023",
      author: "Sarah Smith",
      category: "Guides",
      image: "bg-blue-100 dark:bg-blue-900/30"
    },
    {
      id: 2,
      title: "The Ethics of Using AI in Academia",
      excerpt: "Exploring the fine line between using AI as a tool for learning and academic dishonesty. Where should students draw the line?",
      date: "Nov 05, 2023",
      author: "Dr. James Wilson",
      category: "Education",
      image: "bg-purple-100 dark:bg-purple-900/30"
    },
    {
      id: 3,
      title: "5 Tools Every Content Creator Needs in 2024",
      excerpt: "From AI writers to humanizers and SEO tools, here is the ultimate tech stack for modern content creation.",
      date: "Nov 12, 2023",
      author: "Alex Johnson",
      category: "Tech",
      image: "bg-green-100 dark:bg-green-900/30"
    },
    {
      id: 4,
      title: "Understanding Google's E-E-A-T Guidelines",
      excerpt: "How to ensure your content meets Google's standards for Experience, Expertise, Authoritativeness, and Trustworthiness.",
      date: "Nov 28, 2023",
      author: "Sarah Smith",
      category: "SEO",
      image: "bg-orange-100 dark:bg-orange-900/30"
    },
    {
      id: 5,
      title: "AI Detection: Fact vs Fiction",
      excerpt: "We debunk common myths about how AI detection software works and what you can do to write more original content.",
      date: "Dec 03, 2023",
      author: "Michael Brown",
      category: "Analysis",
      image: "bg-red-100 dark:bg-red-900/30"
    },
    {
      id: 6,
      title: "The Future of Writing with AI Assistants",
      excerpt: "Will AI replace writers? No, but writers who use AI might replace those who don't. Here's why.",
      date: "Dec 15, 2023",
      author: "Emily Davis",
      category: "Future",
      image: "bg-indigo-100 dark:bg-indigo-900/30"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 animate-in fade-in duration-500">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white sm:text-5xl mb-4">Latest Insights</h1>
        <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Tips, trends, and guides on AI writing, content creation, and technology.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <div key={post.id} className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col">
            <div className={`h-48 w-full ${post.image} flex items-center justify-center`}>
               {/* Placeholder for real images */}
               <span className="text-slate-400 dark:text-slate-500 font-medium opacity-50 flex items-center">
                 <Tag className="h-5 w-5 mr-2" /> {post.category} Image
               </span>
            </div>
            <div className="p-6 flex-1 flex flex-col">
              <div className="flex items-center text-xs font-medium text-slate-500 dark:text-slate-400 mb-3 space-x-3">
                 <span className="bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded text-slate-700 dark:text-slate-300">{post.category}</span>
                 <span className="flex items-center"><Calendar className="h-3 w-3 mr-1" /> {post.date}</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 line-clamp-2 hover:text-brand-600 dark:hover:text-brand-400 transition">
                {post.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 line-clamp-3 flex-1">
                {post.excerpt}
              </p>
              
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100 dark:border-slate-700">
                <div className="flex items-center text-xs font-medium text-slate-500 dark:text-slate-400">
                   <User className="h-3 w-3 mr-1" /> {post.author}
                </div>
                <button className="text-brand-600 dark:text-brand-400 text-sm font-bold flex items-center hover:underline">
                  Read More <ArrowRight className="h-4 w-4 ml-1" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-16 text-center">
         <button className="px-8 py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition">
            Load More Articles
         </button>
      </div>
    </div>
  );
};

export default BlogPage;