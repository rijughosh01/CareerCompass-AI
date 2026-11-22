import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Send,
  Sparkles,
  Award,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  RotateCcw,
  History,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  BrainCircuit,
  Volume2,
} from 'lucide-react';
import api from '../services/api';
import { InterviewSession, InterviewExchange } from '../types';

export const MockInterviewer: React.FC = () => {
  const [careerList, setCareerList] = useState<string[]>([]);
  const [selectedCareer, setSelectedCareer] = useState<string>('Machine Learning Engineer');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'Junior' | 'Mid-Level' | 'Senior'>('Mid-Level');
  
  const [session, setSession] = useState<InterviewSession | null>(null);
  const [currentExchange, setCurrentExchange] = useState<InterviewExchange | null>(null);
  const [userAnswer, setUserAnswer] = useState<string>('');
  
  const [isStarting, setIsStarting] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [lastEvaluation, setLastEvaluation] = useState<any | null>(null);
  const [showModelAnswer, setShowModelAnswer] = useState(false);
  
  // Voice Speech-to-Text State
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  // History Tab
  const [activeTab, setActiveTab] = useState<'interview' | 'history'>('interview');
  const [pastSessions, setPastSessions] = useState<InterviewSession[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // Fetch career list and check top assessment career
  useEffect(() => {
    api.get<any[]>('/careers')
      .then((res) => {
        setCareerList(res.data.map((c) => c.name));
      })
      .catch((err) => console.warn('Could not load careers:', err));

    api.get<any>('/assessments/latest')
      .then((res) => {
        if (res.data?.top_career) {
          setSelectedCareer(res.data.top_career);
        }
      })
      .catch(() => {});
  }, []);

  // Web Speech API initialization
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setUserAnswer((prev) => (prev ? `${prev.trim()} ${transcript.trim()}` : transcript.trim()));
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleSpeechRecognition = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser. Please type your answer.');
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.warn('Speech error:', err);
      }
    }
  };

  const handleStartInterview = async () => {
    setIsStarting(true);
    setLastEvaluation(null);
    setUserAnswer('');
    setShowModelAnswer(false);
    try {
      const res = await api.post<InterviewSession>('/interviews/start', {
        career: selectedCareer,
        difficulty: selectedDifficulty,
      });
      setSession(res.data);
      if (res.data.exchanges && res.data.exchanges.length > 0) {
        setCurrentExchange(res.data.exchanges[res.data.exchanges.length - 1]);
      }
    } catch (err) {
      console.error('Error starting interview:', err);
      alert('Failed to initiate interview session. Please try again.');
    } finally {
      setIsStarting(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!session || !currentExchange || !userAnswer.trim()) return;
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    setIsEvaluating(true);
    try {
      const res = await api.post<any>('/interviews/evaluate', {
        session_id: session.id,
        exchange_id: currentExchange.id,
        answer: userAnswer.trim(),
      });

      setLastEvaluation(res.data.evaluation);
      setSession((prev) =>
        prev
          ? {
              ...prev,
              status: res.data.session.status,
              total_score: res.data.session.total_score,
              questions_answered: res.data.session.questions_answered,
            }
          : null
      );

      if (res.data.next_exchange) {
        // Will advance on clicking "Next Question"
      }
    } catch (err) {
      console.error('Evaluation error:', err);
      alert('Evaluation failed. Please try again.');
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleNextQuestion = () => {
    if (!session) return;
    // Reload full session state to get the newly appended exchange
    api.get<InterviewSession>(`/interviews/${session.id}`).then((res) => {
      setSession(res.data);
      const exchanges = res.data.exchanges || [];
      const unscored = exchanges.find((ex) => ex.score === null || ex.score === undefined);
      if (unscored) {
        setCurrentExchange(unscored);
      } else {
        setCurrentExchange(exchanges[exchanges.length - 1]);
      }
      setLastEvaluation(null);
      setUserAnswer('');
      setShowModelAnswer(false);
    });
  };

  const loadPastHistory = async () => {
    setLoadingHistory(true);
    try {
      const res = await api.get<InterviewSession[]>('/interviews/history');
      setPastSessions(res.data);
    } catch (err) {
      console.warn('Could not load history:', err);
    } finally {
      setLoadingHistory(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 8.0) return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
    if (score >= 6.0) return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
    return 'text-rose-400 bg-rose-400/10 border-rose-400/20';
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fade-up">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-5 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-violet-500/10 text-violet-400 text-xs font-semibold border border-violet-500/20 mb-2">
            <Mic className="w-3.5 h-3.5 text-violet-400" />
            <span>Real-time AI Technical Mock Interviewer</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Role-Specific Mock Interview Studio
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Practice scenario questions evaluated on a 1–10 scale: Technical Depth, STAR Clarity, and actionable coaching.
          </p>
        </div>

        {/* Tab Toggle: Interview vs History */}
        <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('interview')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'interview'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Live Interview
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('history');
              loadPastHistory();
            }}
            className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'history'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Past Sessions</span>
          </button>
        </div>
      </div>

      {activeTab === 'history' ? (
        /* Past Sessions History Tab */
        <div className="space-y-4">
          <h2 className="text-base font-bold text-white flex items-center space-x-2">
            <Award className="w-4 h-4 text-brand-400" />
            <span>Your Completed Mock Interview Transcripts</span>
          </h2>
          {loadingHistory ? (
            <div className="py-16 text-center text-slate-400 text-sm">Loading interview transcripts...</div>
          ) : pastSessions.length === 0 ? (
            <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-3">
              <MessageSquare className="w-8 h-8 text-slate-500 mx-auto" />
              <p className="text-slate-300 text-sm font-medium">No past interview sessions recorded yet.</p>
              <button
                type="button"
                onClick={() => setActiveTab('interview')}
                className="px-4 py-2 rounded-xl bg-brand-600 text-white text-xs font-semibold hover:bg-brand-500"
              >
                Start Your First Interview
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {pastSessions.map((s) => (
                <div
                  key={s.id}
                  className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800/80">
                    <div className="flex items-center space-x-2.5">
                      <span className="font-bold text-white text-base">{s.career}</span>
                      <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-xs font-medium">
                        {s.difficulty}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-md text-xs font-bold ${
                          s.status === 'completed'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-amber-400/10 text-amber-300 border border-amber-400/20'
                        }`}
                      >
                        {s.status === 'completed' ? 'Completed' : 'In Progress'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-3 text-xs text-slate-400">
                      <span>{new Date(s.created_at).toLocaleDateString()}</span>
                      <div className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-brand-600/10 border border-brand-500/20 text-brand-300 font-bold">
                        <span>Avg Score:</span>
                        <span className="text-white text-sm">{s.total_score || 0} / 10</span>
                      </div>
                    </div>
                  </div>

                  {/* Exchanges summary */}
                  <div className="space-y-2 pt-1">
                    {s.exchanges?.map((ex, idx) => (
                      <div key={ex.id} className="text-xs space-y-1 bg-slate-950/60 p-3 rounded-xl border border-slate-850">
                        <p className="font-semibold text-slate-300">
                          Q{idx + 1}: {ex.question}
                        </p>
                        {ex.score !== null && (
                          <div className="flex items-center space-x-3 text-slate-400 pt-1">
                            <span className="font-bold text-emerald-400">Score: {ex.score}/10</span>
                            {ex.technical_accuracy && (
                              <span>Tech: {ex.technical_accuracy}/10</span>
                            )}
                            {ex.communication_clarity && (
                              <span>Clarity: {ex.communication_clarity}/10</span>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Live Interview Tab */
        <div className="space-y-6">
          {/* Configuration Banner if no active session */}
          {!session || session.status === 'completed' ? (
            <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 shadow-xl space-y-6">
              <div className="max-w-2xl">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-400">
                  Setup Your Session
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
                  Choose Your Target Role & Seniority
                </h2>
                <p className="text-sm text-slate-400 mt-1.5 leading-relaxed">
                  Our AI interviewer dynamically adapts question complexity, grading standard, and scenario constraints based on your seniority tier.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Target Career Dropdown */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Target Engineering Specialization
                  </label>
                  <select
                    value={selectedCareer}
                    onChange={(e) => setSelectedCareer(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    {careerList.length > 0 ? (
                      careerList.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))
                    ) : (
                      <option value={selectedCareer}>{selectedCareer}</option>
                    )}
                  </select>
                </div>

                {/* Difficulty Selector */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Interview Seniority Level
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['Junior', 'Mid-Level', 'Senior'] as const).map((diff) => (
                      <button
                        key={diff}
                        type="button"
                        onClick={() => setSelectedDifficulty(diff)}
                        className={`py-2.5 rounded-xl text-xs font-bold transition-all border ${
                          selectedDifficulty === diff
                            ? 'bg-brand-600 text-white border-brand-500 shadow-sm'
                            : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-900'
                        }`}
                      >
                        {diff}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleStartInterview}
                disabled={isStarting}
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 text-white text-sm font-bold shadow-lg shadow-brand-600/30 hover:opacity-95 transition-all disabled:opacity-50"
              >
                {isStarting ? (
                  <>
                    <BrainCircuit className="w-4 h-4 animate-spin" />
                    <span>Synthesizing Interview Question...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Start Mock Interview Session</span>
                  </>
                )}
              </button>
            </div>
          ) : null}

          {/* Active Interview Interface */}
          {session && currentExchange && session.status === 'active' && (
            <div className="space-y-6">
              {/* Question Card */}
              <div className="p-6 sm:p-7 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
                  <div className="flex items-center space-x-2.5">
                    <span className="px-2.5 py-1 rounded-md bg-brand-600/20 text-brand-300 border border-brand-500/30 text-xs font-bold">
                      {session.career}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-xs font-semibold">
                      {session.difficulty} Level
                    </span>
                  </div>
                  <div className="text-xs font-bold text-slate-400">
                    Question {session.questions_answered + 1} of 5
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Interviewer Scenario Prompt
                  </span>
                  <p className="text-base sm:text-lg font-semibold text-white leading-relaxed">
                    "{currentExchange.question}"
                  </p>
                </div>
              </div>

              {/* Answer Input Area (Only show if not yet evaluated or on next step) */}
              {!lastEvaluation && (
                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                      Your Answer (STAR Method Recommended)
                    </label>

                    {/* Speech to text button */}
                    <button
                      type="button"
                      onClick={toggleSpeechRecognition}
                      className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                        isListening
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
                          : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white hover:bg-slate-700'
                      }`}
                    >
                      {isListening ? (
                        <>
                          <MicOff className="w-3.5 h-3.5 text-rose-400" />
                          <span>Stop Listening</span>
                        </>
                      ) : (
                        <>
                          <Mic className="w-3.5 h-3.5 text-slate-400" />
                          <span>Voice Dictation (Mic)</span>
                        </>
                      )}
                    </button>
                  </div>

                  {isListening && (
                    <div className="flex items-center space-x-2 px-3 py-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                      <span>Listening... Speak your technical explanation clearly into your microphone.</span>
                    </div>
                  )}

                  <textarea
                    rows={6}
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="Structure your answer: Situation & Task -> Specific Technologies & Actions Taken -> Quantified Result / Metric..."
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 font-sans leading-relaxed"
                  />

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                    <span className="text-xs text-slate-500">
                      {userAnswer.trim().split(/\s+/).filter(Boolean).length} words entered
                    </span>

                    <button
                      type="button"
                      onClick={handleSubmitAnswer}
                      disabled={isEvaluating || !userAnswer.trim()}
                      className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-2.5 rounded-xl bg-brand-600 text-white text-xs font-bold hover:bg-brand-500 shadow-md shadow-brand-600/20 transition-all disabled:opacity-50"
                    >
                      {isEvaluating ? (
                        <>
                          <BrainCircuit className="w-4 h-4 animate-spin" />
                          <span>Evaluating STAR Depth & Technical Accuracy...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          <span>Submit & Evaluate Answer</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Real-time Evaluation Card */}
              {lastEvaluation && (
                <div className="p-6 sm:p-7 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-6 animate-fade-up">
                  {/* Top Scores Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-5 border-b border-slate-800">
                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center space-x-4">
                      <div
                        className={`w-14 h-14 rounded-2xl flex items-center justify-center font-extrabold text-xl border ${getScoreColor(
                          lastEvaluation.score
                        )}`}
                      >
                        {lastEvaluation.score}
                      </div>
                      <div>
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                          Overall Score
                        </span>
                        <p className="text-xs text-slate-300 font-medium">Out of 10.0</p>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="font-semibold text-slate-300">Technical Depth</span>
                        <span className="font-bold text-brand-400">{lastEvaluation.technical_accuracy}/10</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-brand-600 to-indigo-500 rounded-full"
                          style={{ width: `${(lastEvaluation.technical_accuracy / 10) * 100}%` }}
                        />
                      </div>
                      <p className="text-[11px] text-slate-500">Framework accuracy & tool concepts</p>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="font-semibold text-slate-300">STAR Clarity</span>
                        <span className="font-bold text-emerald-400">
                          {lastEvaluation.communication_clarity}/10
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                          style={{ width: `${(lastEvaluation.communication_clarity / 10) * 100}%` }}
                        />
                      </div>
                      <p className="text-[11px] text-slate-500">Structure, context, and metric focus</p>
                    </div>
                  </div>

                  {/* Constructive Feedback Box */}
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                    <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center space-x-1.5">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>Interviewer Coaching Feedback</span>
                    </span>
                    <p className="text-sm text-slate-300 leading-relaxed">{lastEvaluation.feedback}</p>
                  </div>

                  {/* Ideal Model Answer Accordion */}
                  <div className="rounded-xl border border-slate-800 overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setShowModelAnswer(!showModelAnswer)}
                      className="w-full px-4 py-3 bg-slate-950 flex items-center justify-between text-xs font-bold text-slate-300 hover:text-white"
                    >
                      <span className="flex items-center space-x-2">
                        <Sparkles className="w-4 h-4 text-brand-400" />
                        <span>View Ideal Model Answer (STAR Method)</span>
                      </span>
                      {showModelAnswer ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                    {showModelAnswer && (
                      <div className="p-4 bg-slate-950/70 border-t border-slate-800 text-sm text-slate-300 leading-relaxed font-sans italic">
                        {lastEvaluation.model_answer}
                      </div>
                    )}
                  </div>

                  {/* Action Button: Next or Complete */}
                  <div className="flex justify-end pt-2">
                    {session.questions_answered >= 5 ? (
                      <button
                        type="button"
                        onClick={() => {
                          setSession(null);
                          setLastEvaluation(null);
                          setActiveTab('history');
                          loadPastHistory();
                        }}
                        className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-500 transition-all shadow-md"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Finish & View Complete Summary</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleNextQuestion}
                        className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-brand-600 text-white text-xs font-bold hover:bg-brand-500 transition-all shadow-md"
                      >
                        <span>Next Question</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
