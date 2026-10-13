import React from 'react';
import {
  AlertTriangle,
  X,
  ExternalLink,
  Copy,
  MousePointer,
  Maximize,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';
import { SecurityIncident } from '../types/seb';

interface ThreatSimulatorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  incidents: SecurityIncident[];
  maxViolations: number;
  onTriggerViolation: (
    type: 'BLUR' | 'CLIPBOARD' | 'CONTEXT_MENU' | 'DEVTOOLS' | 'URL_BLOCKED' | 'FULLSCREEN_EXIT',
    title: string,
    desc: string,
    strikeCounted: boolean
  ) => void;
  onClearIncidents: () => void;
}

export const ThreatSimulatorDrawer: React.FC<ThreatSimulatorDrawerProps> = ({
  isOpen,
  onClose,
  incidents,
  maxViolations,
  onTriggerViolation,
  onClearIncidents
}) => {
  if (!isOpen) return null;

  const totalStrikes = incidents.filter((i) => i.strikeCounted).length;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-[#181c24] border-l border-[#2e3746] text-[#cbd5e1] shadow-2xl flex flex-col font-sans select-none animate-in slide-in-from-right duration-150">
      {/* Header */}
      <div className="bg-[#12151b] px-4 py-3 border-b border-[#28303e] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-bold text-white uppercase tracking-wider">
            SEB Security & Threat Simulator
          </span>
        </div>
        <button
          onClick={onClose}
          className="text-[#8e9cae] hover:text-white p-1 rounded hover:bg-[#202632]"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4 flex-1 overflow-y-auto text-xs">
        {/* Status Card */}
        <div className="bg-[#1e232d] p-3 rounded border border-[#2d3644] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-[#94a3b8]">Active Security Strikes:</span>
            <span
              className={`font-mono font-bold text-sm ${
                totalStrikes >= maxViolations
                  ? 'text-rose-400'
                  : totalStrikes > 0
                  ? 'text-amber-400'
                  : 'text-emerald-400'
              }`}
            >
              {totalStrikes} / {maxViolations} Strikes
            </span>
          </div>
          <div className="text-[11px] text-[#78889b] leading-tight">
            Triggering {maxViolations} counted strikes will automatically engage the workstation lockdown screen.
          </div>
          {incidents.length > 0 && (
            <button
              onClick={onClearIncidents}
              className="w-full mt-1 py-1 text-[11px] bg-[#28303d] hover:bg-[#343e4f] text-[#cbd5e1] rounded border border-[#3b4759] flex items-center justify-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3 h-3 text-sky-400" />
              Reset Strikes to 0
            </button>
          )}
        </div>

        {/* Simulation Actions */}
        <div className="space-y-2">
          <div className="text-[11px] font-bold text-[#8ba0b8] uppercase tracking-wider">
            Simulate Proctor Violations
          </div>

          <button
            onClick={() =>
              onTriggerViolation(
                'BLUR',
                'Application Switch (Alt+Tab / Window Blur)',
                'SEB detected that another application window gained focus or the exam window lost primary OS focus.',
                true
              )
            }
            className="w-full text-left p-2.5 rounded bg-[#202632] hover:bg-[#28303f] border border-[#2d3647] transition-colors space-y-0.5 group"
          >
            <div className="flex items-center justify-between text-xs font-semibold text-rose-300 group-hover:text-rose-200">
              <span className="flex items-center gap-1.5">
                <ExternalLink className="w-3.5 h-3.5 text-rose-400" />
                Simulate Alt+Tab / Window Blur
              </span>
              <span className="text-[10px] font-mono text-rose-400">+1 Strike</span>
            </div>
            <div className="text-[10px] text-[#8292a4]">Tests focus loss & OS task switching detection.</div>
          </button>

          <button
            onClick={() =>
              onTriggerViolation(
                'CLIPBOARD',
                'Clipboard Injection Intercepted (Ctrl+V)',
                'Candidate attempted to paste unauthorized external clipboard content into the exam question.',
                true
              )
            }
            className="w-full text-left p-2.5 rounded bg-[#202632] hover:bg-[#28303f] border border-[#2d3647] transition-colors space-y-0.5 group"
          >
            <div className="flex items-center justify-between text-xs font-semibold text-rose-300 group-hover:text-rose-200">
              <span className="flex items-center gap-1.5">
                <Copy className="w-3.5 h-3.5 text-rose-400" />
                Simulate Prohibited Paste (Ctrl+V)
              </span>
              <span className="text-[10px] font-mono text-rose-400">+1 Strike</span>
            </div>
            <div className="text-[10px] text-[#8292a4]">Tests system clipboard isolation hook.</div>
          </button>

          <button
            onClick={() =>
              onTriggerViolation(
                'DEVTOOLS',
                'DevTools Key Shortcut Blocked (F12)',
                'Candidate pressed F12 or Ctrl+Shift+I to open browser developer tools inspection.',
                true
              )
            }
            className="w-full text-left p-2.5 rounded bg-[#202632] hover:bg-[#28303f] border border-[#2d3647] transition-colors space-y-0.5 group"
          >
            <div className="flex items-center justify-between text-xs font-semibold text-rose-300 group-hover:text-rose-200">
              <span className="flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                Simulate DevTools Launch (F12)
              </span>
              <span className="text-[10px] font-mono text-rose-400">+1 Strike</span>
            </div>
            <div className="text-[10px] text-[#8292a4]">Tests prohibited key interceptor filter.</div>
          </button>

          <button
            onClick={() =>
              onTriggerViolation(
                'CONTEXT_MENU',
                'Right-Click Context Menu Intercepted',
                'Right-click context menu was intercepted and suppressed across the DOM viewport.',
                false
              )
            }
            className="w-full text-left p-2.5 rounded bg-[#202632] hover:bg-[#28303f] border border-[#2d3647] transition-colors space-y-0.5 group"
          >
            <div className="flex items-center justify-between text-xs font-semibold text-amber-300 group-hover:text-amber-200">
              <span className="flex items-center gap-1.5">
                <MousePointer className="w-3.5 h-3.5 text-amber-400" />
                Test Right-Click Block
              </span>
              <span className="text-[10px] font-mono text-amber-400">Warning</span>
            </div>
            <div className="text-[10px] text-[#8292a4]">Shows context menu suppression banner.</div>
          </button>

          <button
            onClick={() =>
              onTriggerViolation(
                'FULLSCREEN_EXIT',
                'Kiosk Fullscreen Exited',
                'Candidate attempted to escape fullscreen containment mode.',
                true
              )
            }
            className="w-full text-left p-2.5 rounded bg-[#202632] hover:bg-[#28303f] border border-[#2d3647] transition-colors space-y-0.5 group"
          >
            <div className="flex items-center justify-between text-xs font-semibold text-rose-300 group-hover:text-rose-200">
              <span className="flex items-center gap-1.5">
                <Maximize className="w-3.5 h-3.5 text-rose-400" />
                Test Fullscreen Exit Violation
              </span>
              <span className="text-[10px] font-mono text-rose-400">+1 Strike</span>
            </div>
            <div className="text-[10px] text-[#8292a4]">Simulates kiosk breakout attempt.</div>
          </button>
        </div>

        {/* Security Audit Log */}
        <div className="space-y-2 pt-2 border-t border-[#28303e]">
          <div className="flex items-center justify-between text-[11px] font-bold text-[#8ba0b8] uppercase tracking-wider">
            <span>Incident Audit Log</span>
            <span className="font-mono text-white">{incidents.length} events</span>
          </div>

          {incidents.length === 0 ? (
            <div className="p-3 bg-[#12141a] rounded border border-[#252a36] text-[11px] text-[#6b7b8f] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Zero security incidents recorded. Workstation nominal.</span>
            </div>
          ) : (
            <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
              {incidents.map((inc) => (
                <div
                  key={inc.id}
                  className="p-2 bg-[#14171f] border border-[#262c38] rounded space-y-0.5"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-rose-300">{inc.title}</span>
                    <span className="font-mono text-[#6e7d90] text-[10px]">{inc.timestamp}</span>
                  </div>
                  <div className="text-[10px] text-[#94a3b8] leading-tight">{inc.description}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
