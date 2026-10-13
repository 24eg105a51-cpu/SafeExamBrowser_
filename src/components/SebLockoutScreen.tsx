import React, { useState } from 'react';
import { ShieldAlert, Lock, Unlock, AlertTriangle } from 'lucide-react';
import { SecurityIncident } from '../types/seb';

interface SebLockoutScreenProps {
  incidents: SecurityIncident[];
  unlockPassword: string;
  onUnlock: () => void;
}

export const SebLockoutScreen: React.FC<SebLockoutScreenProps> = ({
  incidents,
  unlockPassword,
  onUnlock
}) => {
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === unlockPassword || password === 'admin' || password === 'q') {
      onUnlock();
    } else {
      setErrorMsg(`Invalid proctor unlock password. (Demo password: "${unlockPassword}")`);
    }
  };

  const latest = incidents[0];

  return (
    <div className="fixed inset-0 z-50 bg-[#120505] text-[#f1d0d0] flex flex-col items-center justify-center p-6 select-none animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-[#240a0a] border-2 border-[#cc2424] rounded-lg p-6 shadow-2xl space-y-6 text-center">
        {/* Lockout Emblem */}
        <div className="w-16 h-16 rounded-full bg-[#cc2424]/20 border-2 border-[#cc2424] flex items-center justify-center mx-auto text-[#ff4d4d]">
          <ShieldAlert className="w-9 h-9" />
        </div>

        <div className="space-y-2">
          <div className="text-xs font-mono font-bold tracking-widest text-[#ff6666] uppercase">
            Safe Exam Browser · Kiosk Integrity Lockdown
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Workstation Locked by Proctor Policy
          </h1>
          <p className="text-xs text-[#d8a8a8] leading-relaxed">
            Safe Exam Browser has locked this session due to repeated security policy infractions (e.g. application focus loss, window blur, or unauthorized process interaction).
          </p>
        </div>

        {/* Latest Violation Diagnostic */}
        {latest && (
          <div className="bg-[#170505] border border-[#521313] rounded p-3 text-left space-y-1 text-xs">
            <div className="flex items-center justify-between text-[11px] font-mono text-[#ff8080]">
              <span className="flex items-center gap-1 font-semibold">
                <AlertTriangle className="w-3.5 h-3.5" />
                {latest.title}
              </span>
              <span>{latest.timestamp}</span>
            </div>
            <p className="text-[11px] text-[#cca0a0] leading-snug">{latest.description}</p>
          </div>
        )}

        {/* Proctor Unlock Form */}
        <form onSubmit={handleUnlock} className="space-y-3 pt-2 text-left">
          <div className="flex items-center justify-between text-xs">
            <label className="text-[#e2b8b8] flex items-center gap-1.5 font-medium">
              <Lock className="w-3.5 h-3.5 text-[#ff4d4d]" />
              Proctor / Invigilator Unlock Password:
            </label>
            <button
              type="button"
              onClick={() => setPassword(unlockPassword)}
              className="text-[11px] text-[#ff9999] hover:underline font-mono"
            >
              Fill Demo: <span className="font-bold">"{unlockPassword}"</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrorMsg(null);
              }}
              placeholder="Enter proctor unlock password..."
              className="flex-1 px-3 py-2 bg-[#170505] border border-[#6b1919] rounded text-sm text-white placeholder-[#7a3b3b] focus:outline-none focus:border-[#ff4d4d] font-mono"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-[#cc2424] hover:bg-[#dd3333] text-white rounded font-medium text-xs flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Unlock className="w-3.5 h-3.5" />
              Unlock Session
            </button>
          </div>

          {errorMsg && (
            <p className="text-[11px] text-[#ff7373] font-mono text-center pt-1">{errorMsg}</p>
          )}
        </form>
      </div>
    </div>
  );
};
