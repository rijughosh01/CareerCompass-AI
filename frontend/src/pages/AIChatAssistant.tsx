import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import {
  Bot,
  Send,
  User,
  RefreshCw,
  Lightbulb,
  Copy,
  Check,
  Trash2,
  TrendingUp,
  Briefcase,
  Compass,
  FileText,
  HelpCircle,
  Code2,
  CheckCircle2,
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ChatMessage } from '../types';

interface SuggestionItem {
  icon: React.ReactNode;
  label: string;
  prompt: string;
}

const SUGGESTIONS: SuggestionItem[] = [
  {
    icon: <TrendingUp className="w-3.5 h-3.5 text-indigo-500" />,
    label: 'Transition Blueprint',
    prompt: 'How do I transition into Machine Learning with a CSE degree?',
  },
  {
    icon: <Briefcase className="w-3.5 h-3.5 text-emerald-500" />,
    label: 'Standout Projects',
    prompt: 'What portfolio projects should I build to impress recruiters in Data Science?',
  },
  {
    icon: <HelpCircle className="w-3.5 h-3.5 text-amber-500" />,
    label: 'Mock Interview',
    prompt: 'Give me mock interview questions for Machine Learning Engineer',
  },
  {
    icon: <CheckCircle2 className="w-3.5 h-3.5 text-purple-500" />,
    label: 'Skill Gap Review',
    prompt: 'Analyze my profile and tell me what skills I am missing for my top career',
  },
  {
    icon: <Compass className="w-3.5 h-3.5 text-blue-500" />,
    label: 'Compare Roles',
    prompt: 'What is the difference between Data Scientist and Machine Learning Engineer?',
  },
  {
    icon: <FileText className="w-3.5 h-3.5 text-rose-500" />,
    label: 'Resume ATS Tips',
    prompt: 'How should I structure my resume for high ATS pass rates?',
  },
  {
    icon: <Code2 className="w-3.5 h-3.5 text-teal-500" />,
    label: '2026 Salary Trends',
    prompt: 'What are the 2026 tech salary and market outlook trends?',
  },
];

export const AIChatAssistant: React.FC = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const contextCareer = searchParams.get('context');

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [clearing, setClearing] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, sending]);

  const getWelcomeMessage = (): ChatMessage => ({
    id: 'welcome',
    sender: 'assistant',
    content: `### 👋 Welcome to CareerCompass AI Counselor!\n\nHello **${user?.full_name || 'Student'}**! I am your AI career mentor, grounded in your academic credentials, technical skills, and target career goals.\n\nHere is how I can assist you:\n- 🚀 **Transition Blueprints:** Step-by-step roadmaps to break into AI, Engineering, or Analytics\n- 💼 **Standout Projects:** Production portfolio architectures to impress recruiters\n- 🎯 **Technical Interview Coaching:** High-frequency questions and answer strategies\n- 📊 **Skill Gap Review:** Direct audit of your skills against industry standards\n- 📝 **ATS Resume Advice:** Keyword targeting and formatting best practices\n\n*Select a quick prompt above or ask any question below!*`,
    timestamp: new Date().toISOString(),
  });

  useEffect(() => {
    api
      .get<ChatMessage[]>('/chatbot/history')
      .then((res) => {
        if (res.data && res.data.length > 0) {
          setMessages(res.data);
        } else {
          setMessages([getWelcomeMessage()]);
        }
      })
      .catch((err) => {
        console.warn('Could not load chat history:', err);
        setMessages([getWelcomeMessage()]);
      })
      .finally(() => setLoadingHistory(false));
  }, [user]);

  useEffect(() => {
    if (contextCareer) {
      setInputMessage(`Can you tell me how to prepare for a career as a ${contextCareer}?`);
    }
  }, [contextCareer]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || sending) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setSending(true);

    try {
      const res = await api.post<ChatMessage>('/chatbot/message', {
        message: text,
      });

      setMessages((prev) => [...prev, res.data]);
    } catch (err) {
      console.error('Chat error:', err);
      const fallbackMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        content:
          'I apologize, but I encountered a momentary connection issue. Please ensure the backend server is running and try again!',
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setSending(false);
    }
  };

  const handleClearHistory = async () => {
    if (clearing) return;
    setClearing(true);
    try {
      await api.delete('/chatbot/history');
      setMessages([getWelcomeMessage()]);
    } catch (err) {
      console.warn('Failed to clear backend chat history:', err);
      setMessages([getWelcomeMessage()]);
    } finally {
      setClearing(false);
    }
  };

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto h-[calc(100vh-8rem)] flex flex-col bg-white rounded-2xl border border-slate-200/80 shadow-card overflow-hidden animate-fade-up">
      {/* Chat Header */}
      <div className="px-6 py-4 border-b border-slate-200/80 bg-white flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-brand-600/20">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="font-display text-base font-bold text-slate-900">
                CareerCompass AI Counselor
              </h2>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>
                Active
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Grounded in your academic credentials, technical skills, and career matches
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleClearHistory}
          disabled={clearing}
          title="Start a fresh conversation"
          className="inline-flex items-center space-x-1.5 px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 rounded-xl transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>New Chat</span>
        </button>
      </div>

      {/* Quick Prompt Bar */}
      <div className="px-6 py-3 bg-slate-50 border-b border-slate-200/70 flex items-center gap-2 overflow-x-auto shrink-0 scrollbar-none">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center mr-1">
          <Lightbulb className="w-3.5 h-3.5 text-amber-500 mr-1" />
          Prompts:
        </span>
        {SUGGESTIONS.map((item, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSendMessage(item.prompt)}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-white hover:bg-brand-50 hover:border-brand-300 text-slate-700 hover:text-brand-700 text-xs font-medium rounded-full border border-slate-200 whitespace-nowrap transition-all shadow-2xs shrink-0"
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      {/* Message Feed */}
      <div className="flex-1 p-5 sm:p-6 overflow-y-auto space-y-5 bg-slate-50/40">
        {loadingHistory ? (
          <div className="flex items-center justify-center py-16 text-sm text-slate-500">
            <RefreshCw className="w-4 h-4 animate-spin mr-2 text-brand-600" />
            Loading counselor history...
          </div>
        ) : (
          messages.map((msg) => {
            const isUser = msg.sender === 'user';
            const isCopied = copiedId === msg.id;

            return (
              <div
                key={msg.id}
                className={`flex items-start space-x-3 group ${
                  isUser ? 'flex-row-reverse space-x-reverse' : ''
                }`}
              >
                {/* Avatar */}
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
                    isUser
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-gradient-to-tr from-brand-600 to-indigo-600 text-white shadow-sm'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* Bubble */}
                <div
                  className={`relative max-w-[85%] rounded-2xl px-5 py-4 text-sm shadow-2xs transition-all ${
                    isUser
                      ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-brand-600/15'
                      : 'bg-white text-slate-800 border border-slate-200/80 shadow-card'
                  }`}
                >
                  {!isUser && (
                    <button
                      type="button"
                      onClick={() => handleCopyText(msg.id, msg.content)}
                      title="Copy response"
                      className="absolute top-3 right-3 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      {isCopied ? (
                        <span className="flex items-center text-[11px] text-emerald-600 font-semibold">
                          <Check className="w-3.5 h-3.5 mr-1" />
                          Copied
                        </span>
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  )}

                  {isUser ? (
                    <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                  ) : (
                    <div className="markdown-body pr-6">
                      <ReactMarkdown
                        components={{
                          h1: ({ ...props }) => (
                            <h1 className="font-display text-base font-bold text-slate-900 mt-2 mb-2" {...props} />
                          ),
                          h2: ({ ...props }) => (
                            <h2 className="font-display text-sm font-bold text-slate-900 mt-3 mb-1.5" {...props} />
                          ),
                          h3: ({ ...props }) => (
                            <h3
                              className="font-display text-sm font-bold text-brand-700 mt-2.5 mb-1.5 flex items-center gap-1.5"
                              {...props}
                            />
                          ),
                          h4: ({ ...props }) => (
                            <h4 className="font-display text-sm font-semibold text-slate-800 mt-2 mb-1" {...props} />
                          ),
                          p: ({ ...props }) => (
                            <p className="mb-2.5 last:mb-0 leading-relaxed text-slate-700 text-sm" {...props} />
                          ),
                          ul: ({ ...props }) => (
                            <ul className="list-disc list-outside pl-5 space-y-1.5 mb-2.5 text-slate-700 text-sm" {...props} />
                          ),
                          ol: ({ ...props }) => (
                            <ol className="list-decimal list-outside pl-5 space-y-1.5 mb-2.5 text-slate-700 text-sm" {...props} />
                          ),
                          li: ({ ...props }) => <li className="leading-relaxed" {...props} />,
                          code: ({ inline, children, ...props }: any) => {
                            if (inline) {
                              return (
                                <code
                                  className="px-1.5 py-0.5 bg-slate-100 text-brand-700 font-mono text-xs rounded border border-slate-200"
                                  {...props}
                                >
                                  {children}
                                </code>
                              );
                            }
                            return (
                              <pre className="p-3.5 my-2.5 bg-slate-900 text-slate-100 font-mono text-xs rounded-xl overflow-x-auto">
                                <code {...props}>{children}</code>
                              </pre>
                            );
                          },
                          table: ({ ...props }) => (
                            <div className="overflow-x-auto my-3 rounded-xl border border-slate-200">
                              <table className="w-full text-left text-xs border-collapse" {...props} />
                            </div>
                          ),
                          thead: ({ ...props }) => (
                            <thead className="bg-slate-100 text-slate-800 border-b border-slate-200 font-semibold" {...props} />
                          ),
                          tbody: ({ ...props }) => <tbody className="divide-y divide-slate-100" {...props} />,
                          th: ({ ...props }) => (
                            <th className="px-3.5 py-2.5 text-xs font-semibold text-slate-800" {...props} />
                          ),
                          td: ({ ...props }) => <td className="px-3.5 py-2.5 text-xs text-slate-700" {...props} />,
                          blockquote: ({ ...props }) => (
                            <blockquote
                              className="border-l-4 border-brand-500 pl-3.5 italic my-2.5 text-slate-600 bg-brand-50/40 py-1.5 rounded-r-lg text-sm"
                              {...props}
                            />
                          ),
                          strong: ({ ...props }) => <strong className="font-semibold text-slate-900" {...props} />,
                        }}
                      >
                        {msg.content}
                      </ReactMarkdown>
                    </div>
                  )}

                  <span
                    className={`block text-[10px] mt-2 ${
                      isUser ? 'text-indigo-200 text-right' : 'text-slate-400'
                    }`}
                  >
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>
            );
          })
        )}

        {sending && (
          <div className="flex items-start space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-white rounded-2xl px-4 py-3 border border-slate-200 text-sm text-slate-500 flex items-center space-x-3 shadow-2xs">
              <span className="flex space-x-1">
                <span className="w-2 h-2 rounded-full bg-brand-500 animate-bounce"></span>
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-2 h-2 rounded-full bg-purple-500 animate-bounce [animation-delay:0.4s]"></span>
              </span>
              <span>Counselor is synthesizing advice...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Module Links Bar */}
      <div className="px-6 py-2 bg-slate-50 border-t border-slate-200/70 flex items-center justify-between text-xs text-slate-500">
        <span className="font-semibold text-slate-400 hidden sm:inline">Jump to Module:</span>
        <div className="flex items-center space-x-3 mx-auto sm:mx-0">
          <Link to="/predictions" className="hover:text-brand-600 font-medium transition-colors">
            Predictions
          </Link>
          <span className="text-slate-300">•</span>
          <Link to="/skill-gap" className="hover:text-brand-600 font-medium transition-colors">
            Skill Gap
          </Link>
          <span className="text-slate-300">•</span>
          <Link to="/roadmap" className="hover:text-brand-600 font-medium transition-colors">
            Roadmap
          </Link>
          <span className="text-slate-300">•</span>
          <Link to="/resume" className="hover:text-brand-600 font-medium transition-colors">
            Resume Analyzer
          </Link>
        </div>
      </div>

      {/* Input Form Area */}
      <div className="p-4 bg-white border-t border-slate-200/80 shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center space-x-3"
        >
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask about career transitions, portfolio projects, interview questions, or skill gaps..."
            className="flex-1 px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:bg-white transition-all"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || sending}
            className="px-5 py-3 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white font-semibold text-sm rounded-xl shadow-md shadow-brand-600/20 transition-all disabled:opacity-40 flex items-center space-x-2"
          >
            <span>Send</span>
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
