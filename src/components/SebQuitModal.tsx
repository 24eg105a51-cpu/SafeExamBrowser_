import React, { useState } from 'react';
import { AlertCircle, Lock, Power, X } from 'lucide-react';
import { SebConfig } from '../types/seb';

interface SebQuitModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: SebConfig;
  onConfirmQuit: () => void;
  onLogQuitAttemptFailed: (entered: string) => void;
}

export const SebQuitModal: React.FC<SebQuitModalProps> = ({
  isOpen,
  onClose,
  config,
  onConfirmQuit,
  onLogQuitAttemptFailed
}) => {
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === config.quitPassword) {
      onConfirmQuit();
    } else {
      setErrorMsg('The quit password you entered is incorrect. This attempt has been logged in the SEB security audit log.');
      onLogQuitAttemptFailed(password);
    }
  };

  const handleUseDemoPassword = () => {
    setPassword(config.quitPassword);
    setErrorMsg(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs select-none">
      <div className="w-full max-w-md bg-[#222731] border border-[#3e4757] text-[#e0e6ed] rounded shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 font-sans">
        {/* Windows / macOS styled dialog titlebar */}
        <div className="bg-[#191c23] px-4 py-2.5 border-b border-[#303744] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 bg-[#cc2424] text-white rounded-[2px] flex items-center justify-center">
              <Power className="w-2.5 h-2.5" />
            </div>
            <span className="text-xs font-semibold tracking-tight text-[#d2dae5]">Quit Safe Exam Browser</span>
          </div>
          <button
            onClick={onClose}
            className="text-[#8e9cae] hover:text-white p-0.5 rounded hover:bg-[#2e3542]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Dialog Content */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 shrink-0 mt-0.5">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div className="space-y-1 text-xs text-[#a8b5c4] leading-relaxed">
              <p className="font-semibold text-white text-sm">
                Are you sure you want to quit Safe Exam Browser?
              </p>
              <p>
                Quitting will release the workstation kiosk lock and terminate your active examination session.
              </p>
            </div>
          </div>

          {/* Password Prompt */}
          <div className="bg-[#181b22] p-3 rounded border border-[#2b323e] space-y-2">
            <div className="flex items-center justify-between text-xs">
              <label htmlFor="seb-quit-pwd" className="text-[#a4b1c2] flex items-center gap-1.5 font-medium">
                <Lock className="w-3.5 h-3.5 text-rose-400" />
                Quit password:
              </label>
              <button
                type="button"
                onClick={handleUseDemoPassword}
                className="text-[11px] text-sky-400 hover:underline font-mono"
              >
                Auto-fill password: <span className="font-bold">"{config.quitPassword}"</span>
              </button>
            </div>

            <input
              id="seb-quit-pwd"
              type="password"
              autoFocus
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrorMsg(null);
              }}
              placeholder="Enter quit password..."
              className="w-full px-3 py-1.5 bg-[#12141a] border border-[#3b4453] rounded text-sm text-white placeholder-[#5d6878] focus:outline-none focus:border-rose-500 font-mono"
            />

            {errorMsg && (
              <p className="text-[11px] text-rose-400 leading-tight flex items-start gap-1 font-mono pt-1">
                <span>{errorMsg}</span>
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#303744]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 text-xs font-medium text-[#b0bdcc] bg-[#2a303c] hover:bg-[#343c4a] rounded border border-[#3b4454] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-semibold text-white bg-[#cc2424] hover:bg-[#dd2f2f] rounded border border-rose-500/50 shadow-sm transition-colors flex items-center gap-1.5"
            >
              <Power className="w-3.5 h-3.5" />
              Quit SEB
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
