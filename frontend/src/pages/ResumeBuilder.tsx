import React, { useState, useEffect, useRef } from 'react';
import {
  FileText,
  Sparkles,
  Printer,
  Copy,
  Check,
  BrainCircuit,
  Briefcase,
  GraduationCap,
  Code2,
  FolderGit2,
  Plus,
  Trash2,
  ExternalLink,
  Award,
} from 'lucide-react';
import api from '../services/api';
import { ResumeData, ResumeWorkItem, ResumeProjectItem, ResumeEducationItem } from '../types';

export const ResumeBuilder: React.FC = () => {
  const [careerList, setCareerList] = useState<string[]>([]);
  const [targetCareer, setTargetCareer] = useState<string>('Machine Learning Engineer');
  const [rawExperience, setRawExperience] = useState<string>('');
  const [rawProjects, setRawProjects] = useState<string>('');

  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const printAreaRef = useRef<HTMLDivElement>(null);

  // Load career catalog and user profile
  useEffect(() => {
    api.get<any[]>('/careers')
      .then((res) => setCareerList(res.data.map((c) => c.name)))
      .catch((err) => console.warn('Could not load careers:', err));

    api.get<any>('/assessments/latest')
      .then((res) => {
        if (res.data?.top_career) {
          setTargetCareer(res.data.top_career);
        }
      })
      .catch(() => {});

    // Initial draft generation
    handleGenerate();
  }, []);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const res = await api.post<ResumeData>('/resumes/builder/generate', {
        target_career: targetCareer,
        raw_experience: rawExperience || undefined,
        raw_projects: rawProjects || undefined,
      });
      setResumeData(res.data);
    } catch (err) {
      console.error('Error generating resume:', err);
      alert('Failed to generate resume. Please check your network and try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyText = () => {
    if (!resumeData) return;
    const text = `
${resumeData.full_name.toUpperCase()}
${resumeData.target_career} | ${resumeData.location}
Email: ${resumeData.email} | Phone: ${resumeData.phone}
LinkedIn: ${resumeData.linkedin} | GitHub: ${resumeData.github}

PROFESSIONAL SUMMARY
${resumeData.summary}

TECHNICAL SKILLS
${Object.entries(resumeData.skills_grouped)
  .map(([k, v]) => `${k}: ${v.join(', ')}`)
  .join('\n')}

EXPERIENCE
${resumeData.experience
  .map(
    (exp) => `
${exp.role} - ${exp.company} (${exp.duration}) [${exp.location}]
${exp.bullets.map((b) => `• ${b}`).join('\n')}`
  )
  .join('\n')}

PROJECTS
${resumeData.projects
  .map(
    (proj) => `
${proj.title} [${proj.tech_stack}]
${proj.bullets.map((b) => `• ${b}`).join('\n')}`
  )
  .join('\n')}

EDUCATION
${resumeData.education
  .map((edu) => `${edu.degree} - ${edu.institution} (${edu.year}) ${edu.score || ''}`)
  .join('\n')}

CERTIFICATIONS
${resumeData.certifications.join(', ')}
    `.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-fade-up">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-5 border-b border-slate-800 print:hidden">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20 mb-2">
            <FileText className="w-3.5 h-3.5 text-emerald-400" />
            <span>1-Click ATS Resume Generator</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            ATS-Compliant Resume Builder
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Gemini transforms raw notes into high-impact recruiter bullets (Action Verb + Scope + Quantified Result) formatted for Applicant Tracking Systems.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3 self-start sm:self-auto">
          <button
            type="button"
            onClick={handleCopyText}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-all shadow-sm"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied ATS Text!' : 'Copy Plain Text'}</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-brand-600 text-white text-xs font-bold hover:bg-brand-500 shadow-lg shadow-brand-600/25 transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Export ATS PDF</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Control Panel + Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: AI Customization Controls */}
        <div className="lg:col-span-4 space-y-4 print:hidden">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md space-y-4">
            <h2 className="text-sm font-bold text-white flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-brand-400" />
              <span>AI Polish Parameters</span>
            </h2>

            {/* Target Career Dropdown */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Target Role Alignment
              </label>
              <select
                value={targetCareer}
                onChange={(e) => setTargetCareer(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
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

            {/* Raw Experience Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Raw Experience / Internships (Optional)
              </label>
              <textarea
                rows={3}
                value={rawExperience}
                onChange={(e) => setRawExperience(e.target.value)}
                placeholder="E.g. built rest api in fastapi, worked on database queries and docker containerization..."
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            {/* Raw Projects Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Raw Projects / Hackathons (Optional)
              </label>
              <textarea
                rows={3}
                value={rawProjects}
                onChange={(e) => setRawProjects(e.target.value)}
                placeholder="E.g. created e-commerce app with react and stripe, customer churn prediction ML model..."
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            {/* Generate Button */}
            <button
              type="button"
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full inline-flex items-center justify-center space-x-2 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 text-white text-xs font-bold hover:opacity-95 shadow-md shadow-brand-600/20 transition-all disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <BrainCircuit className="w-4 h-4 animate-spin" />
                  <span>Synthesizing ATS Resume with AI...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Regenerate with AI Polish</span>
                </>
              )}
            </button>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs text-slate-400 space-y-2">
            <span className="font-bold text-slate-200">ATS Compliance Standards:</span>
            <ul className="list-disc pl-4 space-y-1">
              <li>Single-column hierarchy (no tables or complex columns)</li>
              <li>Standard ATS headings: Summary, Skills, Experience, Projects, Education</li>
              <li>Quantified XYZ formula: Action Verb + Scope + Result</li>
              <li>Standard machine-readable fonts and clean margins</li>
            </ul>
          </div>
        </div>

        {/* Right Side: ATS Resume Preview (Printable) */}
        <div className="lg:col-span-8">
          {resumeData ? (
            <div
              ref={printAreaRef}
              id="resume-printable-area"
              className="bg-white text-slate-900 p-8 sm:p-12 rounded-2xl shadow-2xl border border-slate-200 font-sans leading-normal print:p-0 print:border-none print:shadow-none print:rounded-none"
              style={{ minHeight: '1050px' }}
            >
              {/* Header */}
              <div className="text-center pb-4 border-b border-slate-300 space-y-1">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 uppercase">
                  {resumeData.full_name}
                </h1>
                <p className="text-xs sm:text-sm font-semibold text-slate-700">
                  {resumeData.target_career}
                </p>
                <div className="flex flex-wrap items-center justify-center gap-x-2 text-xs text-slate-600 pt-1">
                  <span>{resumeData.location}</span>
                  <span>•</span>
                  <span>{resumeData.phone}</span>
                  <span>•</span>
                  <span>{resumeData.email}</span>
                  <span>•</span>
                  <span>{resumeData.linkedin}</span>
                  <span>•</span>
                  <span>{resumeData.github}</span>
                </div>
              </div>

              {/* Professional Summary */}
              <div className="pt-4 space-y-1">
                <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-300 pb-0.5">
                  Professional Summary
                </h2>
                <p className="text-xs text-slate-700 leading-relaxed text-justify">
                  {resumeData.summary}
                </p>
              </div>

              {/* Technical Skills */}
              <div className="pt-4 space-y-1.5">
                <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-300 pb-0.5">
                  Technical Skills & Competencies
                </h2>
                <div className="text-xs space-y-1 text-slate-800">
                  {Object.entries(resumeData.skills_grouped || {}).map(([category, skills]) => (
                    <div key={category} className="flex">
                      <span className="font-bold w-44 shrink-0">{category}:</span>
                      <span className="text-slate-700">{skills.join(', ')}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Experience */}
              <div className="pt-4 space-y-2">
                <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-300 pb-0.5">
                  Professional Experience
                </h2>
                {resumeData.experience.map((exp: ResumeWorkItem, idx: number) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-slate-900">{exp.role}</span>
                        <span className="text-slate-600"> — {exp.company}</span>
                      </div>
                      <div className="text-right text-slate-500 font-medium">
                        <span>{exp.duration}</span> | <span>{exp.location}</span>
                      </div>
                    </div>
                    <ul className="list-disc pl-5 text-xs text-slate-700 space-y-0.5">
                      {exp.bullets.map((b, bIdx) => (
                        <li key={bIdx} className="leading-relaxed">
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Projects */}
              <div className="pt-4 space-y-2">
                <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-300 pb-0.5">
                  Key Technical Projects
                </h2>
                {resumeData.projects.map((proj: ResumeProjectItem, idx: number) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-slate-900">{proj.title}</span>
                        <span className="text-slate-600 font-medium"> | {proj.tech_stack}</span>
                      </div>
                      {proj.link && <span className="text-slate-500 text-[11px]">{proj.link}</span>}
                    </div>
                    <ul className="list-disc pl-5 text-xs text-slate-700 space-y-0.5">
                      {proj.bullets.map((b, bIdx) => (
                        <li key={bIdx} className="leading-relaxed">
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Education */}
              <div className="pt-4 space-y-1.5">
                <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-300 pb-0.5">
                  Education
                </h2>
                {resumeData.education.map((edu: ResumeEducationItem, idx: number) => (
                  <div key={idx} className="flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-900">{edu.degree}</span>
                      <span className="text-slate-600"> — {edu.institution}</span>
                    </div>
                    <div className="text-right text-slate-500 font-medium">
                      <span>{edu.year}</span> {edu.score ? `| ${edu.score}` : ''}
                    </div>
                  </div>
                ))}
              </div>

              {/* Certifications */}
              {resumeData.certifications && resumeData.certifications.length > 0 && (
                <div className="pt-4 space-y-1">
                  <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-300 pb-0.5">
                    Certifications & Credentials
                  </h2>
                  <p className="text-xs text-slate-700">
                    {resumeData.certifications.join(' • ')}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="p-16 rounded-2xl bg-slate-900 border border-slate-800 text-center text-slate-400">
              Generating your tailored ATS resume...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
