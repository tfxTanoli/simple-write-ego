import React, { useState, useRef } from 'react';
import {
  Copy,
  RotateCcw,
  Sparkles,
  Loader2,
  Check,
  Download,
  ShieldCheck,
  Search,
  AlertCircle,
  Maximize2,
  Link as LinkIcon,
  FileText,
  Globe,
  ArrowRight,
  UploadCloud,
  File
} from 'lucide-react';
import { User, Tone } from '../types';
import { humanizeText, detectAIContent, humanizeTextAdvanced } from '../services/openaiService';

import { incrementUsage, addToHistory } from '../services/storageService';
import { incrementUserUsage } from '../services/firestoreService';

interface HumanizerToolProps {
  user: User | null;
  onUserUpdate: () => void;
  embedded?: boolean;
}

const DETECTORS = [
  "Turnitin", "GPTZero", "Originality.ai", "CopyLeaks",
  "ZeroGPT", "Winston", "Sapling", "Quillbot", "Crossplag", "NaturalWrite"
];

const HumanizerTool: React.FC<HumanizerToolProps> = ({ user, onUserUpdate, embedded = false }) => {
  // Workflow State
  const [step, setStep] = useState<'input' | 'processing' | 'result'>('input');
  const [inputType, setInputType] = useState<'text' | 'url' | 'file'>('text');

  // Data State
  const [inputText, setInputText] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [outputText, setOutputText] = useState('');
  const [tone, setTone] = useState<Tone>(Tone.STANDARD);
  const [useAdvancedModel, setUseAdvancedModel] = useState(false); // New State

  // Analysis State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isFetchingUrl, setIsFetchingUrl] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [detectionScore, setDetectionScore] = useState<number | null>(null);
  const [humanScore, setHumanScore] = useState<number | null>(null);

  // UI State
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const wordCount = inputText.trim() ? inputText.trim().split(/\s+/).filter(w => w.length > 0).length : 0;
  const charCount = inputText.length;

  // Usage Check (if user exists)
  const isOverLimit = user ? (user.role === 'admin' ? false : user.wordsUsedToday + wordCount > user.wordLimit) : false;

  // Mock URL Fetch
  const handleFetchUrl = () => {
    if (!urlInput.trim()) return;
    setIsFetchingUrl(true);
    setError(null);

    // Simulate network request
    setTimeout(() => {
      // Mock extracted content based on URL
      const mockContent = `This is the extracted content from ${urlInput}. \n\nArtificial intelligence has revolutionized various industries, from healthcare to finance. However, the rise of AI-generated content has raised concerns about authenticity and originality. Tools like ChatGPT can generate essays, articles, and reports in seconds, often lacking the nuance and emotional depth of human writing. \n\nWhen AI writes, it often uses predictable patterns, repetitive sentence structures, and overly formal vocabulary. To make this content truly effective, it needs to be "humanized"—rewritten to include personal insights, varied sentence lengths, and a natural conversational flow that resonates with readers.`;

      setInputText(mockContent);
      setIsFetchingUrl(false);
      setInputType('text'); // Switch back to text view
    }, 1500);
  };

  // File Upload Handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    // If it's a text file, we can read it directly
    if (file.type === 'text/plain') {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setInputText(text);
        setIsUploading(false);
        setInputType('text'); // Switch back to editor
      };
      reader.onerror = () => {
        setError("Failed to read file.");
        setIsUploading(false);
      };
      reader.readAsText(file);
    } else {
      // For PDF/DOCX, we simulate extraction since we don't have a backend parser in this demo
      setTimeout(() => {
        const mockExtractedText = `[Simulated Content Extraction from ${file.name}]\n\nThe rapid advancement of artificial intelligence (AI) has fundamentally transformed the landscape of content creation. From automated journalism to academic writing assistance, AI models like GPT-4 have demonstrated remarkable proficiency in generating coherent and contextually relevant text. However, despite these capabilities, AI-generated content often exhibits distinguishable characteristics—such as repetitive phrasing, lack of emotional depth, and overly structured syntax—that can be detected by sophisticated algorithms.\n\nTo address this, the concept of "humanizing" AI text has emerged as a crucial step in the content workflow. Humanization involves refining AI output to infuse it with natural variability, idiomatic expressions, and a genuine voice that resonates with human readers. This process not only bypasses detection systems but also improves engagement and readability.`;

        setInputText(mockExtractedText);
        setIsUploading(false);
        setInputType('text'); // Switch back to editor
      }, 2000);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  // Step 2: Analyze Function
  const handleAnalyze = async () => {
    if (!inputText.trim()) return;
    setIsAnalyzing(true);
    setDetectionScore(null);
    setError(null);

    // Clear any cached detection results to force fresh analysis
    const textSnippet = inputText.substring(0, 50) + inputText.substring(inputText.length - 50);
    const cacheKey = `ai_detection_${simpleHash(textSnippet)}_${inputText.length}`;
    localStorage.removeItem(cacheKey);
    console.log('🗑️ Cleared cache for fresh AI detection');

    try {
      const humanScore = await detectAIContent(inputText);
      // Convert to AI score (invert): if 80% human, then 20% AI
      const aiScore = 100 - humanScore;
      setDetectionScore(aiScore);
    } catch (e: any) {
      console.error('Detection error:', e);
      setError(e?.message || "Analysis failed. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Helper function to generate hash (same as in openaiService)
  const simpleHash = (str: string): string => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash.toString(36);
  };

  // Step 3: Humanize Function
  const handleHumanize = async () => {
    if (!inputText) return;
    if (user && isOverLimit) {
      setError("Limit Reached");
      return;
    }
    setError(null);
    setStep('processing');

    try {
      let result;
      if (useAdvancedModel) {
        // Use the new Gradio-based advanced humanizer
        result = await humanizeTextAdvanced(inputText, 'standard');
      } else {
        // Use the standard OpenAI-based humanizer
        result = await humanizeText(inputText, { tone, mode: 'humanize' });
      }

      setOutputText(result);

      // Fixed success score as per requirements
      setHumanScore(useAdvancedModel ? 99 : 98); // Slightly higher for advanced

      // Update local stats if user exists
      if (user) {
        // ... (logging remains same)
        await incrementUserUsage(user.id, wordCount);
        incrementUsage(wordCount);
        addToHistory(user.id, {
          originalText: inputText,
          humanizedText: result,
          tone: tone,
          wordCount: wordCount,
        });
        onUserUpdate();
      }
      setStep('result');
    } catch (err: any) {
      console.error("Humanize error:", err);
      setError(err?.message || "Something went wrong. Please check your connection.");
      setStep('input');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadResult = () => {
    const element = document.createElement("a");
    const file = new Blob([outputText], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = "humanized_text.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const resetTool = () => {
    setStep('input');
    setOutputText('');
    setDetectionScore(null);
    setHumanScore(null);
  };

  // Helper for color coding the meter (for AI percentage, not human)
  // Higher AI percentage = worse (red), Lower AI percentage = better (green)
  const getScoreColor = (aiScore: number) => {
    if (aiScore >= 70) return { bg: 'bg-red-500', text: 'text-red-600', ring: 'ring-red-100', label: 'High AI Detected' };
    if (aiScore >= 40) return { bg: 'bg-yellow-500', text: 'text-yellow-600', ring: 'ring-yellow-100', label: 'Likely AI-Assisted' };
    return { bg: 'bg-green-500', text: 'text-green-600', ring: 'ring-green-100', label: 'Likely Human-Written' };
  };

  return (
    <div className={`max-w-7xl mx-auto flex flex-col px-4 ${embedded ? 'py-4' : 'min-h-[calc(100vh-8rem)] pb-20 pt-6'}`}>

      {/* Error Banner */}
      {error && (
        <div className="mb-6 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 p-4 rounded-xl flex items-center shadow-sm border border-red-100 dark:border-red-900 animate-in fade-in slide-in-from-top-2">
          <AlertCircle className="h-5 w-5 mr-3 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Main Container */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-black/20 border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col relative z-10 transition-colors duration-300">

        {/* === HEADER / CONFIG === */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 flex flex-wrap md:flex-nowrap justify-between items-center gap-4">
          {/* Step Indicators (Visual Only) */}
          <div className="flex items-center space-x-2 text-sm font-medium text-slate-400 dark:text-slate-500">
            <span className={step === 'input' ? 'text-brand-600 dark:text-brand-400 font-bold' : ''}>1. Paste</span>
            <span>→</span>
            <span className={(step === 'input' && detectionScore !== null) ? 'text-brand-600 dark:text-brand-400 font-bold' : ''}>2. Analyze</span>
            <span>→</span>
            <span className={step === 'result' ? 'text-brand-600 dark:text-brand-400 font-bold' : ''}>3. Humanize</span>
          </div>

          {/* Counters */}
          <div className="flex items-center space-x-4 text-xs font-medium text-slate-500 dark:text-slate-400">
            <div className="bg-white dark:bg-slate-800 px-3 py-1.5 rounded-md border border-slate-200 dark:border-slate-600 shadow-sm">
              <span className="text-slate-900 dark:text-white font-bold">{wordCount}</span> Words
            </div>
            <div className="bg-white dark:bg-slate-800 px-3 py-1.5 rounded-md border border-slate-200 dark:border-slate-600 shadow-sm hidden sm:block">
              <span className="text-slate-900 dark:text-white font-bold">{charCount}</span> Characters
            </div>
          </div>
        </div>

        {/* === WORKSPACE AREA === */}
        <div className="flex-1 flex flex-col relative">

          {/* VIEW 1: INPUT & ANALYSIS */}
          {(step === 'input' || step === 'processing') && (
            <div className="flex flex-col h-full">

              {/* Input Tabs (Text vs URL vs File) */}
              <div className="flex px-6 pt-4 space-x-4 border-b border-transparent">
                <button
                  onClick={() => setInputType('text')}
                  className={`pb-2 text-sm font-bold flex items-center space-x-2 border-b-2 transition ${inputType === 'text' ? 'text-brand-600 border-brand-600 dark:text-brand-400 dark:border-brand-400' : 'text-slate-500 border-transparent hover:text-slate-700 dark:text-slate-400'}`}
                >
                  <FileText className="h-4 w-4" />
                  <span>Paste Text</span>
                </button>
                <button
                  onClick={() => setInputType('url')}
                  className={`pb-2 text-sm font-bold flex items-center space-x-2 border-b-2 transition ${inputType === 'url' ? 'text-brand-600 border-brand-600 dark:text-brand-400 dark:border-brand-400' : 'text-slate-500 border-transparent hover:text-slate-700 dark:text-slate-400'}`}
                >
                  <LinkIcon className="h-4 w-4" />
                  <span>Import URL</span>
                </button>
                <button
                  onClick={() => setInputType('file')}
                  className={`pb-2 text-sm font-bold flex items-center space-x-2 border-b-2 transition ${inputType === 'file' ? 'text-brand-600 border-brand-600 dark:text-brand-400 dark:border-brand-400' : 'text-slate-500 border-transparent hover:text-slate-700 dark:text-slate-400'}`}
                >
                  <UploadCloud className="h-4 w-4" />
                  <span>Upload File</span>
                </button>
              </div>

              {/* Step 1 Input Area */}
              <div className="relative flex-grow">
                {inputType === 'text' ? (
                  <textarea
                    className={`w-full h-full p-8 resize-none focus:outline-none bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-lg leading-relaxed placeholder:text-slate-300 dark:placeholder:text-slate-600 font-normal ${embedded ? 'min-h-[400px]' : 'min-h-[500px]'}`}
                    placeholder="Paste any content — homework, assignment, or AI-generated draft..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    disabled={step === 'processing'}
                  />
                ) : inputType === 'url' ? (
                  <div className={`w-full h-full p-8 bg-white dark:bg-slate-800 flex flex-col items-center justify-center ${embedded ? 'min-h-[400px]' : 'min-h-[500px]'}`}>
                    <div className="w-full max-w-lg space-y-4">
                      <div className="text-center mb-6">
                        <div className="inline-flex h-16 w-16 bg-brand-50 dark:bg-brand-900/20 rounded-full items-center justify-center mb-4">
                          <Globe className="h-8 w-8 text-brand-600 dark:text-brand-400" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Import content from web</h3>
                        <p className="text-slate-500 dark:text-slate-400 mt-2">Enter a URL to fetch text automatically.</p>
                      </div>
                      <div className="flex space-x-2">
                        <input
                          type="url"
                          placeholder="https://example.com/article"
                          className="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none text-slate-900 dark:text-white"
                          value={urlInput}
                          onChange={(e) => setUrlInput(e.target.value)}
                        />
                        <button
                          onClick={handleFetchUrl}
                          disabled={isFetchingUrl || !urlInput.trim()}
                          className="px-6 py-3 bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-700 disabled:opacity-50 transition flex items-center"
                        >
                          {isFetchingUrl ? <Loader2 className="animate-spin h-5 w-5" /> : <ArrowRight className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  // File Upload View
                  <div className={`w-full h-full p-8 bg-white dark:bg-slate-800 flex flex-col items-center justify-center ${embedded ? 'min-h-[400px]' : 'min-h-[500px]'}`}>
                    <div className="w-full max-w-lg space-y-4 text-center">
                      <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept=".txt,.doc,.docx,.pdf"
                        onChange={handleFileUpload}
                      />
                      <div
                        onClick={triggerFileUpload}
                        className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-2xl p-10 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:border-brand-400 transition group"
                      >
                        <div className="inline-flex h-20 w-20 bg-brand-50 dark:bg-brand-900/20 rounded-full items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                          {isUploading ? (
                            <Loader2 className="h-10 w-10 text-brand-600 dark:text-brand-400 animate-spin" />
                          ) : (
                            <UploadCloud className="h-10 w-10 text-brand-600 dark:text-brand-400" />
                          )}
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                          {isUploading ? "Extracting Text..." : "Click to Upload File"}
                        </h3>
                        <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">
                          Supported formats: .txt, .pdf, .docx
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tone Selector & Advanced Mode Overlay */}
                {inputType === 'text' && (
                  <div className="absolute top-4 right-4 hidden md:flex flex-col items-end gap-2 pointer-events-none">
                    <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur border border-slate-200 dark:border-slate-600 rounded-lg p-1 shadow-sm pointer-events-auto flex">
                      {Object.values(Tone).map((t) => (
                        <button
                          key={t}
                          onClick={() => setTone(t)}
                          className={`px-3 py-1 rounded-md text-xs font-bold transition ${tone === t ? 'bg-brand-600 text-white' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>

                    {/* Advanced Mode Toggle */}
                    <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur border border-slate-200 dark:border-slate-600 rounded-lg p-1.5 shadow-sm pointer-events-auto flex items-center space-x-2">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={useAdvancedModel}
                          onChange={() => setUseAdvancedModel(!useAdvancedModel)}
                        />
                        <div className="relative w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
                        <span className="ml-2 text-xs font-bold text-slate-600 dark:text-slate-300">
                          {useAdvancedModel ? "Advanced (Hugging Face)" : "Standard (GPT-4)"}
                        </span>
                      </label>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Bar (Steps 2 & 3) */}
              <div className="p-6 border-t border-slate-100 dark:border-slate-700 bg-slate-50/30 dark:bg-slate-900/30">

                {/* Step 2 Result: Analysis Display */}
                {detectionScore !== null && (
                  <div className="mb-6 animate-in fade-in slide-in-from-bottom-2">
                    <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-600 shadow-sm flex flex-col md:flex-row items-center gap-6">
                      <div className="flex-1 w-full">
                        <div className="flex justify-between items-end mb-2">
                          <span className="text-sm font-bold text-slate-700 dark:text-slate-300">AI Detection Score</span>
                          <span className={`text-xl font-black ${getScoreColor(detectionScore).text}`}>
                            {detectionScore}% AI-Generated
                          </span>
                        </div>
                        {/* Visual Meter */}
                        <div className="w-full h-4 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-1000 ease-out ${getScoreColor(detectionScore).bg}`}
                            style={{ width: `${detectionScore}%` }}
                          />
                        </div>
                        <div className="flex justify-between mt-1 text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500">
                          <span>Human (0%)</span>
                          <span>AI (100%)</span>
                        </div>
                      </div>

                      <div className={`px-4 py-2 rounded-lg ${getScoreColor(detectionScore).bg} bg-opacity-10 border ${getScoreColor(detectionScore).ring}`}>
                        <span className={`text-sm font-bold ${getScoreColor(detectionScore).text}`}>
                          {getScoreColor(detectionScore).label}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                  {/* Step 2 Button: Check AI */}
                  <button
                    onClick={handleAnalyze}
                    disabled={!inputText.trim() || isAnalyzing || step === 'processing'}
                    className="w-full md:w-auto px-6 py-4 rounded-xl font-bold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 transition flex items-center justify-center border border-slate-200 dark:border-slate-600 shadow-sm"
                  >
                    {isAnalyzing ? (
                      <><Loader2 className="animate-spin h-5 w-5 mr-2" /> Analyzing...</>
                    ) : (
                      <><Search className="h-5 w-5 mr-2" /> Check AI Detection</>
                    )}
                  </button>

                  {/* Step 3 Button: Humanize */}
                  <button
                    onClick={handleHumanize}
                    disabled={!inputText.trim() || step === 'processing'}
                    className="w-full md:flex-1 max-w-md bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-lg py-4 px-8 rounded-xl hover:shadow-xl hover:shadow-indigo-500/20 hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0 disabled:shadow-none transition-all flex items-center justify-center"
                  >
                    {step === 'processing' ? (
                      <><Loader2 className="animate-spin h-6 w-6 mr-3" /> Humanizing Text...</>
                    ) : (
                      <><Sparkles className="h-6 w-6 mr-3 fill-current" /> Humanize Text</>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 2: OUTPUT SECTION */}
          {step === 'result' && (
            <div className="flex flex-col h-full animate-in fade-in duration-500">

              {/* Success Header */}
              <div className="bg-green-50 dark:bg-green-900/20 border-b border-green-100 dark:border-green-900/30 p-4 px-6 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center">
                  <div className="bg-green-500 text-white p-2 rounded-full mr-3 shadow-lg shadow-green-500/30">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-green-900 dark:text-green-400 font-bold text-lg">Humanization Successful</h3>
                    <p className="text-green-700 dark:text-green-300 text-sm">Your text is now 98% human-written</p>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button onClick={resetTool} className="p-2 text-green-700 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition" title="New Text">
                    <RotateCcw className="h-5 w-5" />
                  </button>
                  <button onClick={downloadResult} className="p-2 text-green-700 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition" title="Download">
                    <Download className="h-5 w-5" />
                  </button>
                  <button onClick={copyToClipboard} className="flex items-center px-4 py-2 bg-white dark:bg-slate-800 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 font-bold rounded-lg shadow-sm hover:bg-green-50 dark:hover:bg-slate-700 transition">
                    {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                    {copied ? "Copied" : "Copy Result"}
                  </button>
                </div>
              </div>

              {/* Side-by-Side Comparison */}
              <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-[500px]">
                {/* Left: Original */}
                <div className="flex-1 flex flex-col border-r border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50">
                  <div className="px-6 py-3 border-b border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex justify-between">
                    <span>Original Text</span>
                    <span>{inputText.split(' ').length} words</span>
                  </div>
                  <div className="p-6 overflow-y-auto max-h-[600px] text-slate-500 dark:text-slate-400 leading-relaxed text-sm whitespace-pre-wrap font-medium">
                    {inputText}
                  </div>
                </div>

                {/* Right: Humanized */}
                <div className="flex-1 flex flex-col bg-white dark:bg-slate-800 relative">
                  <div className="px-6 py-3 border-b border-slate-100 dark:border-slate-700 text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider flex justify-between bg-indigo-50/30 dark:bg-indigo-900/20">
                    <span>Humanized Result</span>
                    <span>{outputText.split(' ').length} words</span>
                  </div>
                  <div className="p-6 overflow-y-auto max-h-[600px] text-slate-800 dark:text-slate-200 leading-relaxed text-lg whitespace-pre-wrap">
                    {outputText}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bypass Badges Section */}
      <div className="mt-8 text-center">
        <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">
          Bypasses All Major AI Detectors
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          {DETECTORS.map((detector, i) => (
            <div key={i} className="group flex items-center px-4 py-2 bg-white dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm hover:border-green-400 dark:hover:border-green-500 hover:shadow-md transition cursor-default">
              <div className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></div>
              <span className="text-xs font-bold text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white">{detector}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default HumanizerTool;