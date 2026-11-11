import React, { useState, useEffect } from 'react';
import {
  FileText,
  Upload,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Sparkles,
  FileCheck,
  X,
  Clock,
} from 'lucide-react';
import api from '../services/api';
import { ResumeAnalysisResult } from '../types';

export const ResumeAnalysis: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [rawText, setRawText] = useState<string>('');
  const [targetCareer, setTargetCareer] = useState<string>('Machine Learning Engineer');
  const [careerList, setCareerList] = useState<string[]>([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<ResumeAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    api
      .get<any[]>('/careers')
      .then((res) => {
        setCareerList(res.data.map((c) => c.name));
      })
      .catch((err) => console.warn('Could not load careers:', err));

    api
      .get<any[]>('/resumes/history')
      .then((res) => {
        setHistory(res.data);
      })
      .catch((err) => console.warn('Could not load resume history:', err));
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!selectedFile && !rawText.trim()) {
      setError('Please upload a PDF/DOCX file or paste resume text to analyze.');
      return;
    }

    setAnalyzing(true);

    try {
      const formData = new FormData();
      if (selectedFile) {
        formData.append('file', selectedFile);
      }
      if (rawText.trim()) {
        formData.append('raw_text', rawText.trim());
      }
      formData.append('target_career', targetCareer);

      const res = await api.post<ResumeAnalysisResult>('/resumes/analyze', formData);

      setAnalysisResult(res.data);
      api
        .get<any[]>('/resumes/history')
        .then((h) => setHistory(h.data))
        .catch(() => {});
    } catch (err: any) {
      console.error('Resume analysis error:', err);
      const detail = err.response?.data?.detail;
      setError(
        typeof detail === 'string'
          ? detail
          : 'Failed to analyze resume. Please ensure the file contains readable text.'
      );
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fade-up">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-5 border-b border-slate-200/80">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold border border-amber-200 mb-2">
            <FileCheck className="w-3.5 h-3.5 text-amber-600" />
            <span>ATS Resume Scanner &amp; Keyword Matcher</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Resume Analysis &amp; Optimization
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Extract competencies, benchmark against target job roles, and optimize your ATS score (0–100).
          </p>
        </div>

        {/* Target Career Dropdown */}
        <div className="w-full sm:w-72">
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Target Job Title
          </label>
          <select
            value={targetCareer}
            onChange={(e) => setTargetCareer(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-medium text-slate-900 shadow-2xs focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
          >
            {careerList.length > 0 ? (
              careerList.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))
            ) : (
              <option value={targetCareer}>{targetCareer}</option>
            )}
          </select>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center space-x-2.5">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Upload & Paste Form Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-card">
        <form onSubmit={handleAnalyze} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Option A: File Upload Dropzone */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Option A: Upload Resume File (.pdf, .docx, .txt)
              </label>
              <div
                className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all relative flex flex-col items-center justify-center min-h-[168px] ${
                  selectedFile
                    ? 'border-brand-400 bg-brand-50/30'
                    : 'border-slate-300 hover:border-brand-500 bg-slate-50/50 hover:bg-brand-50/10'
                }`}
              >
                <input
                  type="file"
                  accept=".pdf,.docx,.txt"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />

                {selectedFile ? (
                  <div className="relative z-10 w-full max-w-xs space-y-2">
                    <div className="w-11 h-11 rounded-xl bg-brand-600 text-white flex items-center justify-center mx-auto shadow-sm">
                      <FileText className="w-5 h-5" />
                    </div>
                    <p className="text-sm font-bold text-slate-900 truncate">{selectedFile.name}</p>
                    <p className="text-xs text-slate-500">
                      {(selectedFile.size / 1024).toFixed(1)} KB • Ready to scan
                    </p>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setSelectedFile(null);
                      }}
                      className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-rose-600 hover:bg-rose-50 relative z-20"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Remove File</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2 pointer-events-none">
                    <div className="w-11 h-11 rounded-xl bg-brand-50 text-brand-600 border border-brand-100 flex items-center justify-center mx-auto">
                      <Upload className="w-5 h-5" />
                    </div>
                    <p className="text-sm font-semibold text-slate-800">
                      Drag &amp; drop resume, or <span className="text-brand-600">browse</span>
                    </p>
                    <p className="text-xs text-slate-500">Supports PDF, DOCX, TXT up to 10MB</p>
                  </div>
                )}
              </div>
            </div>

            {/* Option B: Paste Raw Text */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Option B: Or Paste Resume Text Directly
              </label>
              <textarea
                rows={6}
                value={rawText}
                onChange={(e) => {
                  setRawText(e.target.value);
                  if (e.target.value.trim()) setSelectedFile(null);
                }}
                placeholder="Paste your resume text here (Summary, Technical Skills, Experience, Projects, Education)..."
                className="w-full h-[168px] px-4 py-3 bg-white border border-slate-300 rounded-2xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 resize-none transition-all"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={analyzing}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-brand-600/20 transition-all disabled:opacity-50"
            >
              <Sparkles className={`w-4 h-4 ${analyzing ? 'animate-spin' : ''}`} />
              <span>{analyzing ? 'Scanning & Scoring ATS...' : 'Run ATS Resume Analysis'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Analysis Results Display */}
      {analysisResult && (
        <div className="space-y-6 animate-fade-up">
          {/* Top Score Banner */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-card">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="flex items-center space-x-5">
                <div
                  className={`w-20 h-20 rounded-2xl flex flex-col items-center justify-center font-mono font-extrabold text-2xl shrink-0 border tabular-nums ${
                    analysisResult.overall_score >= 80
                      ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                      : analysisResult.overall_score >= 60
                      ? 'bg-amber-50 text-amber-600 border-amber-200'
                      : 'bg-rose-50 text-rose-600 border-rose-200'
                  }`}
                >
                  <span>{analysisResult.overall_score}</span>
                  <span className="text-[9px] font-sans font-bold uppercase tracking-wider text-slate-500">
                    / 100 ATS
                  </span>
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-display text-xl font-bold text-slate-900">
                      ATS Readiness Score: {analysisResult.overall_score}%
                    </h3>
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                        analysisResult.overall_score >= 80
                          ? 'bg-emerald-100 text-emerald-800'
                          : analysisResult.overall_score >= 60
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {analysisResult.overall_score >= 80
                        ? 'Strong Match'
                        : analysisResult.overall_score >= 60
                        ? 'Needs Optimization'
                        : 'Low Match Score'}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 mt-1">
                    Benchmarked against target role: <strong className="text-slate-900">{targetCareer}</strong>
                  </p>
                </div>
              </div>

              <div className="sm:text-right">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Detected Education
                </span>
                <span className="inline-block px-3.5 py-1.5 bg-slate-100 text-slate-800 rounded-xl text-xs font-semibold border border-slate-200">
                  {analysisResult.education_level || 'Undergraduate'}
                </span>
              </div>
            </div>
          </div>

          {/* Keywords Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-card">
              <div className="flex items-center space-x-2 border-b border-slate-100 pb-3.5 mb-4">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <h3 className="font-display text-base font-bold text-slate-900">
                  Matched Keywords Found
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {analysisResult.keywords_found && analysisResult.keywords_found.length > 0 ? (
                  analysisResult.keywords_found.map((kw) => (
                    <span
                      key={kw}
                      className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200/80 inline-flex items-center"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mr-1.5" />
                      {kw}
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-slate-500">No industry keywords matched.</p>
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-card">
              <div className="flex items-center space-x-2 border-b border-slate-100 pb-3.5 mb-4">
                <XCircle className="w-5 h-5 text-rose-600" />
                <h3 className="font-display text-base font-bold text-slate-900">
                  Missing Role Keywords
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {analysisResult.missing_keywords && analysisResult.missing_keywords.length > 0 ? (
                  analysisResult.missing_keywords.map((kw) => (
                    <span
                      key={kw}
                      className="px-3 py-1 rounded-lg bg-rose-50 text-rose-800 text-xs font-semibold border border-rose-200/80 inline-flex items-center"
                    >
                      <XCircle className="w-3.5 h-3.5 text-rose-600 mr-1.5" />
                      {kw}
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-emerald-700 font-medium">
                    All primary target keywords are present!
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Strengths & Weaknesses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-card">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3.5">
                Key Strengths
              </h4>
              <ul className="space-y-2.5">
                {analysisResult.strengths?.map((str, i) => (
                  <li key={i} className="flex items-start text-sm text-slate-700 leading-relaxed">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mr-2.5 shrink-0 mt-1" />
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-card">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3.5">
                Areas for Improvement
              </h4>
              <ul className="space-y-2.5">
                {analysisResult.weaknesses?.map((weak, i) => (
                  <li key={i} className="flex items-start text-sm text-slate-700 leading-relaxed">
                    <AlertCircle className="w-4 h-4 text-amber-500 mr-2.5 shrink-0 mt-1" />
                    <span>{weak}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Actionable Optimization Plan */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-card">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3.5">
              Actionable ATS Optimization Plan
            </h4>
            <div className="space-y-2.5">
              {analysisResult.recommendations?.map((rec, i) => (
                <div
                  key={i}
                  className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 text-sm text-slate-700 flex items-start space-x-3"
                >
                  <span className="font-mono font-bold text-brand-600 shrink-0">#{i + 1}</span>
                  <span className="leading-relaxed">{rec}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Past Resume Scans Table */}
      {history.length > 0 && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-card">
          <div className="flex items-center space-x-2 mb-4">
            <Clock className="w-4 h-4 text-slate-400" />
            <h3 className="font-display text-base font-bold text-slate-900">Past Resume Scans</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-slate-200 text-xs text-slate-500 font-semibold uppercase tracking-wider">
                  <th className="pb-3 pr-4">File / Label</th>
                  <th className="pb-3 pr-4">ATS Score</th>
                  <th className="pb-3 pr-4">Education</th>
                  <th className="pb-3">Scanned On</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {history.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 pr-4 font-semibold text-slate-900">
                      {item.filename || 'Resume Text'}
                    </td>
                    <td className="py-3 pr-4">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-brand-50 text-brand-700 border border-brand-200 tabular-nums">
                        {item.overall_score}%
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-slate-600">{item.education_level || 'N/A'}</td>
                    <td className="py-3 text-slate-500 text-xs">
                      {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Recent'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
