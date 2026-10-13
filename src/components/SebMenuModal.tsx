import React from 'react';
import {
  Lock,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Maximize,
  ShieldCheck,
  Settings,
  Power,
  X
} from 'lucide-react';
import { SebConfig } from '../types/seb';

interface SebMenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: SebConfig;
  zoomLevel: number;
  onSetZoom: (zoom: number) => void;
  onReload: () => void;
  onOpenQuit: () => void;
  onOpenConfigTool: () => void;
}

export const SebMenuModal: React.FC<SebMenuModalProps> = ({
  isOpen,
  onClose,
  config,
  zoomLevel,
  onSetZoom,
  onReload,
  onOpenQuit,
  onOpenConfigTool
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-start p-3 sm:p-6 bg-black/60 backdrop-blur-xs select-none">
      <div className="w-full max-w-sm bg-[#1e222a] border border-[#3c4452] text-[#d6dee8] rounded-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#991717] to-[#bd2020] px-3.5 py-2.5 flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-white text-[#991717] rounded-[2px] flex items-center justify-center font-bold">
              <Lock className="w-3 h-3 stroke-[3]" />
            </div>
            <div>
              <div className="text-xs font-bold tracking-tight">Safe Exam Browser</div>
              <div className="text-[10px] text-white/80 font-mono">Version 3.7.0 (Chromium Core)</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded hover:bg-black/20"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Action Items List */}
        <div className="p-2 space-y-1 text-xs">
          <button
            onClick={() => {
              onReload();
              onClose();
            }}
            className="w-full flex items-center justify-between px-3 py-2 rounded hover:bg-[#2b313d] transition-colors text-left"
          >
            <span className="flex items-center gap-2.5">
              <RotateCw className="w-3.5 h-3.5 text-sky-400" />
              Reload Page
            </span>
            <span className="text-[10px] font-mono text-[#7e8d9f]">F5 / Ctrl+R</span>
          </button>

          {/* Zoom controls */}
          <div className="px-3 py-2 rounded bg-[#181b22] border border-[#282f3a] space-y-1.5">
            <div className="flex items-center justify-between text-[11px] text-[#9ba8b8]">
              <span>Page Zoom Level</span>
              <span className="font-mono text-white font-medium">{zoomLevel}%</span>
            </div>
            <div className="flex items-center gap-2 pt-0.5">
              <button
                onClick={() => onSetZoom(Math.max(75, zoomLevel - 10))}
                className="flex-1 py-1 px-2 bg-[#252b36] hover:bg-[#323947] rounded text-center border border-[#333b47] flex items-center justify-center gap-1"
              >
                <ZoomOut className="w-3 h-3" /> -10%
              </button>
              <button
                onClick={() => onSetZoom(100)}
                className="py-1 px-2 bg-[#252b36] hover:bg-[#323947] rounded text-center border border-[#333b47] text-[10px] font-mono"
              >
                Reset 100%
              </button>
              <button
                onClick={() => onSetZoom(Math.min(150, zoomLevel + 10))}
                className="flex-1 py-1 px-2 bg-[#252b36] hover:bg-[#323947] rounded text-center border border-[#333b47] flex items-center justify-center gap-1"
              >
                <ZoomIn className="w-3 h-3" /> +10%
              </button>
            </div>
          </div>

          {/* Fullscreen indicator */}
          <div className="px-3 py-2 text-[11px] text-[#8e9cae] flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Maximize className="w-3.5 h-3.5 text-emerald-400" />
              Kiosk Display Mode
            </span>
            <span className="font-mono text-emerald-400">ACTIVE LOCK</span>
          </div>

          {/* Security & BEK Details */}
          <div className="px-3 py-2 bg-[#181b22] rounded border border-[#282f3a] space-y-1">
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              Browser Exam Key (BEK) Verified
            </div>
            <div className="text-[10px] font-mono text-[#7e8d9f] break-all leading-tight">
              {config.browserExamKey.slice(0, 32)}...
            </div>
          </div>

          {/* SEB Configuration Tool Launcher */}
          <button
            onClick={() => {
              onOpenConfigTool();
              onClose();
            }}
            className="w-full flex items-center justify-between px-3 py-2 rounded hover:bg-[#2b313d] transition-colors text-left"
          >
            <span className="flex items-center gap-2.5">
              <Settings className="w-3.5 h-3.5 text-purple-400" />
              Open SEB Configuration Tool
            </span>
            <span className="text-[10px] font-mono text-purple-400">SEBConfig</span>
          </button>

          {/* Quit SEB Action */}
          <div className="pt-1 border-t border-[#2b313d]">
            <button
              onClick={() => {
                onClose();
                onOpenQuit();
              }}
              className="w-full flex items-center justify-between px-3 py-2 rounded text-rose-300 hover:bg-rose-950/60 hover:text-rose-100 transition-colors text-left"
            >
              <span className="flex items-center gap-2.5 font-medium">
                <Power className="w-3.5 h-3.5 text-rose-400" />
                Quit Safe Exam Browser...
              </span>
              <span className="text-[10px] font-mono text-rose-400">Ctrl+Q</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
