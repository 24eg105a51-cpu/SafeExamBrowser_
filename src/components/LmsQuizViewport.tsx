import React, { useState } from 'react';
import {
  Clock,
  Flag,
  CheckCircle2,
  XCircle,
  Play,
  Send,
  Lock,
  Download,
  RotateCcw,
  AlertCircle
} from 'lucide-react';
import { QuizQuestion, SebConfig } from '../types/seb';
import { formatTimeSeconds, computeBekHash } from '../utils/crypto';

interface LmsQuizViewportProps {
  questions: QuizQuestion[];
  config: SebConfig;
  remainingSeconds: number;
  zoomLevel: number;
  onOpenQuit: () => void;
}

export const LmsQuizViewport: React.FC<LmsQuizViewportProps> = ({
  questions,
  config,
  remainingSeconds,
  zoomLevel,
  onOpenQuit
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [flagged, setFlagged] = useState<Record<string, boolean>>({});
  const [answers, setAnswers] = useState<Record<string, string[]>>({
    q1: ['opt1']
  });
  const [codeAnswer, setCodeAnswer] = useState<string>(
    questions.find((q) => q.type === 'code')?.starterCode || ''
  );
  const [essayAnswer, setEssayAnswer] = useState<string>(
    'Forward Secrecy ensures that past session keys cannot be compromised even if the server private key is leaked in the future. In Ephemeral Diffie-Hellman (ECDHE), new key pairs are generated per handshake and immediately discarded after deriving the symmetric session key.'
  );
  const [codeResults, setCodeResults] = useState<
    { input: string; expected: string; actual: string; passed: boolean; label: string }[] | null
  >(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [receiptData, setReceiptData] = useState<any | null>(null);

  const currentQ = questions[currentIdx] || questions[0];

  const handleSelectOption = (qId: string, optId: string, isMulti: boolean) => {
    setAnswers((prev) => {
      const existing = prev[qId] || [];
      if (!isMulti) {
        return { ...prev, [qId]: [optId] };
      }
      const has = existing.includes(optId);
      const next = has ? existing.filter((id) => id !== optId) : [...existing, optId];
      return { ...prev, [qId]: next };
    });
  };

  const handleRunCodeTests = () => {
    if (!currentQ.testCases) return;
    const results = currentQ.testCases.map((tc) => {
      try {
        const fn = new Function(
          `"use strict"; ${codeAnswer}; return String(evaluateRequests${tc.input});`
        );
        const actual = fn();
        return {
          input: tc.input,
          expected: tc.expected,
          actual,
          passed: actual === tc.expected,
          label: tc.label
        };
      } catch (err: any) {
        return {
          input: tc.input,
          expected: tc.expected,
          actual: err.message || 'Error',
          passed: false,
          label: tc.label
        };
      }
    });
    setCodeResults(results);
  };

  const handleSubmitQuiz = () => {
    let earned = 0;
    let total = 0;

    questions.forEach((q) => {
      total += q.maxPoints;
      if (q.type === 'choice' || q.type === 'multi_choice') {
        const picked = answers[q.id] || [];
        const correct = q.correctOptions || [];
        const isMatch =
          picked.length === correct.length && correct.every((c) => picked.includes(c));
        if (isMatch) earned += q.maxPoints;
      } else if (q.type === 'code') {
        try {
          const fn = new Function(
            `"use strict"; ${codeAnswer}; return evaluateRequests([0, 0, 0, 1, 2], 1, 2);`
          );
          if (fn() === 4) earned += q.maxPoints;
        } catch {}
      } else if (q.type === 'essay') {
        if (essayAnswer.trim().split(/\s+/).length >= 25) {
          earned += q.maxPoints;
        }
      }
    });

    const receipt = {
      receiptNumber: `SEB-${Date.now().toString(36).toUpperCase()}`,
      examTitle: 'CS402: Systems Architecture & Cybersecurity Final',
      candidateName: 'Aarav Sharma',
      candidateId: '24EG105A51',
      seatCode: 'LAB-304',
      submittedAt: new Date().toLocaleTimeString(),
      autoGradedScore: earned,
      maxPoints: total,
      browserExamKey: config.browserExamKey,
      payloadDigest: computeBekHash(
        JSON.stringify({ answers, codeAnswer, essayAnswer, configKey: config.configKey })
      )
    };

    setReceiptData(receipt);
    setIsSubmitted(true);
  };

  const handleDownloadReceipt = () => {
    if (!receiptData) return;
    const blob = new Blob([JSON.stringify(receiptData, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SEB_Receipt_${receiptData.receiptNumber}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // If Quiz is Submitted, show the authentic Moodle/Canvas SEB submission confirmation screen
  if (isSubmitted && receiptData) {
    return (
      <div className="flex-1 bg-[#12151c] text-[#d6dee8] p-6 overflow-y-auto">
        <div className="max-w-3xl mx-auto bg-[#1b1f29] border border-[#2e3747] rounded-lg p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#2d3646]">
            <div>
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono">
                <CheckCircle2 className="w-4 h-4" />
                <span>EXAM ATTEMPT SUBMITTED & SEALED BY SAFE EXAM BROWSER</span>
              </div>
              <h1 className="text-xl font-bold text-white mt-1">{receiptData.examTitle}</h1>
              <div className="text-xs text-[#8a9bb0] font-mono mt-0.5">
                CANDIDATE: {receiptData.candidateName} ({receiptData.candidateId}) · SEAT: {receiptData.seatCode}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleDownloadReceipt}
                className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                Download Receipt
              </button>
              <button
                onClick={onOpenQuit}
                className="px-3 py-1.5 bg-[#cc2424] hover:bg-[#dd2f2f] text-white rounded text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                Quit SEB
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 bg-[#14171f] rounded border border-[#272f3d]">
              <div className="text-[11px] text-[#8697aa]">Assessment Result</div>
              <div className="text-xl font-mono font-bold text-emerald-400 mt-1">
                {receiptData.autoGradedScore} / {receiptData.maxPoints} pts
              </div>
            </div>
            <div className="p-3.5 bg-[#14171f] rounded border border-[#272f3d]">
              <div className="text-[11px] text-[#8697aa]">Receipt Number</div>
              <div className="text-sm font-mono font-bold text-white mt-1">
                {receiptData.receiptNumber}
              </div>
            </div>
            <div className="p-3.5 bg-[#14171f] rounded border border-[#272f3d]">
              <div className="text-[11px] text-[#8697aa]">Submission Timestamp</div>
              <div className="text-sm font-mono font-bold text-[#cbd5e1] mt-1">
                {receiptData.submittedAt}
              </div>
            </div>
          </div>

          <div className="p-3 bg-[#13161d] rounded border border-[#252c38] space-y-1 text-xs font-mono">
            <div className="text-[#7e8fxa2] text-[11px]">CRYPTOGRAPHIC BEK VERIFICATION SEAL:</div>
            <div className="text-sky-300 break-all">{receiptData.payloadDigest}</div>
          </div>

          <div className="pt-2 flex justify-between items-center text-xs">
            <span className="text-[#8495a8]">Your answers have been stored in the institutional LMS.</span>
            <button
              onClick={() => {
                setIsSubmitted(false);
                setReceiptData(null);
              }}
              className="px-3 py-1 bg-[#242b37] hover:bg-[#303949] text-white rounded flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Retake / Preview Mode
            </button>
          </div>
        </div>
      </div>
    );
  }

  const essayWords = essayAnswer.trim() ? essayAnswer.trim().split(/\s+/).length : 0;

  return (
    <div
      style={{ zoom: `${zoomLevel}%` }}
      className="flex-1 bg-[#14171f] text-[#cbd5e1] flex flex-col overflow-hidden font-sans select-none"
    >
      {/* University & Course LMS Header (Moodle / Canvas Exam Portal Style) */}
      <header className="bg-[#1b202a] border-b border-[#2d3544] px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-[#8a1515] text-white flex items-center justify-center font-bold text-sm tracking-wider shadow-sm">
            STU
          </div>
          <div>
            <div className="text-xs font-bold text-white tracking-tight">
              State Technical University · Department of Computer Science
            </div>
            <div className="text-[11px] text-[#8495a8]">
              CS402: Systems Architecture & Cybersecurity — Final Examination
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="hidden sm:flex items-center gap-1.5 text-emerald-400 bg-[#12161f] px-2.5 py-1 rounded border border-[#262f3e]">
            <Lock className="w-3.5 h-3.5" />
            <span>BEK VERIFIED (SEB 3.7)</span>
          </div>

          <div className="flex items-center gap-1.5 bg-[#12161f] px-3 py-1 rounded border border-[#262f3e] text-white font-bold">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[11px] text-[#93a2b4]">Time left:</span>
            <span className="tabular-nums text-amber-300">{formatTimeSeconds(remainingSeconds)}</span>
          </div>
        </div>
      </header>

      {/* Main 2-Column Assessment Viewport */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left / Top: Active Question Canvas */}
        <div className="flex-1 p-5 overflow-y-auto space-y-5">
          {/* Question Title & Meta Header */}
          <div className="bg-[#1b202a] border border-[#2b3341] rounded-lg p-4 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-sky-400 font-semibold">
                Question {currentQ.number} of {questions.length} · {currentQ.category}
              </span>
              <button
                onClick={() =>
                  setFlagged((prev) => ({ ...prev, [currentQ.id]: !prev[currentQ.id] }))
                }
                className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] transition-colors ${
                  flagged[currentQ.id]
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'text-[#8495a8] hover:text-white bg-[#222835]'
                }`}
              >
                <Flag className="w-3 h-3" />
                {flagged[currentQ.id] ? 'Flagged for review' : 'Flag question'}
              </button>
            </div>
            <h2 className="text-base font-bold text-white">{currentQ.title}</h2>
            <div className="text-xs text-[#8e9eb2] font-mono">
              Points: {currentQ.maxPoints}.00 · Single response scoring
            </div>
          </div>

          {/* Question Prompt */}
          <div className="bg-[#1b202a] border border-[#2b3341] rounded-lg p-5 space-y-4">
            <p className="text-sm text-[#e2e8f0] leading-relaxed select-text">{currentQ.prompt}</p>

            {currentQ.codeSnippet && (
              <pre className="p-3.5 bg-[#12141a] border border-[#262c38] rounded font-mono text-xs text-sky-300 overflow-x-auto select-text leading-relaxed">
                {currentQ.codeSnippet}
              </pre>
            )}

            {/* Multiple Choice Options */}
            {(currentQ.type === 'choice' || currentQ.type === 'multi_choice') && currentQ.options && (
              <div className="space-y-2.5 pt-2">
                <div className="text-xs font-semibold text-[#8b9cb0] uppercase tracking-wide">
                  {currentQ.type === 'multi_choice'
                    ? 'Select all statements that apply:'
                    : 'Select one option:'}
                </div>
                {currentQ.options.map((opt) => {
                  const picked = (answers[currentQ.id] || []).includes(opt.id);
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() =>
                        handleSelectOption(currentQ.id, opt.id, currentQ.type === 'multi_choice')
                      }
                      className={`w-full text-left p-3.5 rounded border transition-colors flex items-start gap-3 select-none ${
                        picked
                          ? 'bg-sky-600/15 border-sky-500 text-white shadow-xs'
                          : 'bg-[#151821] border-[#29303d] text-[#c0ccd9] hover:bg-[#1a1e28]'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 mt-0.5 rounded flex items-center justify-center shrink-0 text-[10px] font-mono border ${
                          picked
                            ? 'bg-sky-500 border-sky-400 text-white'
                            : 'border-[#434e60] bg-[#1a1e26]'
                        }`}
                      >
                        {picked ? '✓' : ''}
                      </div>
                      <span className="text-xs leading-relaxed">{opt.text}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Code Implementation Sandbox */}
            {currentQ.type === 'code' && (
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#8b9cb0] uppercase">
                    JavaScript / Algorithm Workspace
                  </span>
                  <button
                    type="button"
                    onClick={handleRunCodeTests}
                    className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <Play className="w-3 h-3" />
                    Run Automated Tests
                  </button>
                </div>

                <textarea
                  rows={12}
                  value={codeAnswer}
                  onChange={(e) => setCodeAnswer(e.target.value)}
                  className="w-full p-3 bg-[#111319] border border-[#2b323e] rounded font-mono text-xs text-white placeholder-[#515e70] focus:outline-none focus:border-sky-500 leading-relaxed select-text"
                />

                {codeResults && (
                  <div className="space-y-1.5 pt-1">
                    <div className="text-xs font-mono text-[#8a9bb0]">TEST VERIFICATION RESULTS:</div>
                    {codeResults.map((res, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 bg-[#12151c] border border-[#272e3a] rounded flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="text-white font-medium">{res.label}</div>
                          <div className="font-mono text-[11px] text-[#7a8b9e]">
                            Input: {res.input} · Expected: {res.expected} · Actual: {res.actual}
                          </div>
                        </div>
                        <span
                          className={`font-mono font-bold flex items-center gap-1 ${
                            res.passed ? 'text-emerald-400' : 'text-rose-400'
                          }`}
                        >
                          {res.passed ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5" /> PASS
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3.5 h-3.5" /> FAIL
                            </>
                          )}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Essay Question */}
            {currentQ.type === 'essay' && (
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between text-xs font-mono text-[#8b9cb0]">
                  <span>Analytical Technical Response (Clipboard Isolated)</span>
                  <span className="tabular-nums">
                    Word count: {essayWords} {currentQ.minWords ? `/ Min ${currentQ.minWords}` : ''}
                  </span>
                </div>
                <textarea
                  rows={7}
                  value={essayAnswer}
                  onChange={(e) => setEssayAnswer(e.target.value)}
                  placeholder="Type your response here..."
                  className="w-full p-3 bg-[#111319] border border-[#2b323e] rounded text-xs text-white placeholder-[#515e70] focus:outline-none focus:border-sky-500 leading-relaxed select-text"
                />
              </div>
            )}
          </div>

          {/* Bottom Question Step Navigation */}
          <div className="flex items-center justify-between pt-2">
            <button
              disabled={currentIdx === 0}
              onClick={() => setCurrentIdx((i) => Math.max(0, i - 1))}
              className="px-4 py-2 bg-[#1b202a] hover:bg-[#252c3a] disabled:opacity-40 text-white rounded text-xs font-medium border border-[#2b3341] transition-colors"
            >
              Previous page
            </button>

            {currentIdx < questions.length - 1 ? (
              <button
                onClick={() => setCurrentIdx((i) => Math.min(questions.length - 1, i + 1))}
                className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded text-xs font-semibold transition-colors"
              >
                Next page
              </button>
            ) : (
              <button
                onClick={handleSubmitQuiz}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                Finish attempt...
              </button>
            )}
          </div>
        </div>

        {/* Right: Moodle / Canvas "Quiz Navigation" Sidebar */}
        <aside className="w-full md:w-64 bg-[#191d26] border-l border-[#29313f] p-4 space-y-4 shrink-0">
          <div className="text-xs font-bold text-white tracking-wide uppercase">
            Quiz Navigation
          </div>

          {/* Grid buttons 1, 2, 3, 4 */}
          <div className="grid grid-cols-4 gap-2">
            {questions.map((q, idx) => {
              const isCurrent = idx === currentIdx;
              const isFlag = !!flagged[q.id];
              const isDone =
                q.type === 'code'
                  ? codeAnswer.trim().length > 30
                  : q.type === 'essay'
                  ? essayAnswer.trim().length > 20
                  : (answers[q.id] || []).length > 0;

              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentIdx(idx)}
                  className={`h-10 rounded border flex flex-col items-center justify-center relative transition-colors ${
                    isCurrent
                      ? 'border-sky-400 bg-sky-500/20 text-white font-bold'
                      : 'border-[#303947] bg-[#141720] text-[#a4b2c4] hover:bg-[#1e232f]'
                  }`}
                >
                  <span className="text-xs font-mono">{q.number}</span>
                  {isFlag && (
                    <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-amber-400" />
                  )}
                  <span className="text-[8px] font-mono leading-tight">
                    {isDone ? '✓' : ''}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="text-[11px] text-[#7d8fa3] space-y-1 font-mono pt-2 border-t border-[#272f3d]">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-[#141720] border border-[#303947]" />
              <span>Not yet answered</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-sky-500/40 border border-sky-400" />
              <span>Answer saved</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <span>Flagged for review</span>
            </div>
          </div>

          <button
            onClick={handleSubmitQuiz}
            className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
            Finish attempt...
          </button>
        </aside>
      </div>
    </div>
  );
};
