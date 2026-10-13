import React, { useState } from 'react';
import {
  Shield,
  RotateCw,
  ChevronLeft,
  ChevronRight,
  Lock,
  Calculator,
  FileText,
  BookOpen,
  Volume2,
  Wifi,
  BatteryCharging,
  Power,
  Settings,
  AlertTriangle
} from 'lucide-react';
import { SebConfig } from '../types/seb';

interface SebTaskbarProps {
  config: SebConfig;
  currentTime: string;
  violationsCount: number;
  isThreatDrawerOpen: boolean;
  onToggleThreatDrawer: () => void;
  onOpenMenu: () => void;
  onOpenQuit: () => void;
  onReloadPage: () => void;
  onToggleApp: (app: 'calculator' | 'notepad' | 'pdf' | 'configTool') => void;
  activeApps: {
    calculator: boolean;
    notepad: boolean;
    pdf: boolean;
    configTool: boolean;
  };
}

export const SebTaskbar: React.FC<SebTaskbarProps> = ({
  config,
  currentTime,
  violationsCount,
  isThreatDrawerOpen,
  onToggleThreatDrawer,
  onOpenMenu,
  onOpenQuit,
  onReloadPage,
  onToggleApp,
  activeApps
}) => {
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [volume, setVolume] = useState(75);

  return (
    <footer
      className="h-10 bg-[#1e222a] border-t border-[#333a46] text-[#c4cdd8] select-none flex items-center justify-between px-2 text-xs z-50 shrink-0 font-sans shadow-lg relative"
      role="region"
      aria-label="Safe Exam Browser Taskbar"
    >
      {/* Left: SEB Start Button & Browser Navigation */}
      <div className="flex items-center gap-1.5 shrink-0">
        {/* SEB Start Button (Iconic Red Square Shield Emblem) */}
        <button
          onClick={onOpenMenu}
          title="Safe Exam Browser Menu (About, Zoom, Reload, Quit)"
          className="h-7 px-2 bg-gradient-to-b from-[#cc2424] to-[#991717] hover:from-[#dd2f2f] hover:to-[#aa1b1b] text-white rounded-[3px] border border-[#ff4d4d]/40 flex items-center gap-1.5 shadow-sm active:translate-y-[1px] transition-all font-semibold"
        >
          <div className="w-3.5 h-3.5 bg-white text-[#991717] rounded-[2px] flex items-center justify-center">
            <Lock className="w-2.5 h-2.5 stroke-[3]" />
          </div>
          <span className="text-[11px] font-bold tracking-tight">SEB</span>
        </button>

        {/* Back and Forward navigation buttons */}
        <div className="flex items-center gap-0.5 ml-1">
          <button
            title="Back (disabled by policy)"
            disabled
            className="w-7 h-7 flex items-center justify-center rounded-[3px] text-[#5d6778] cursor-not-allowed hover:bg-[#282e39]"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            title="Forward (disabled by policy)"
            disabled
            className="w-7 h-7 flex items-center justify-center rounded-[3px] text-[#5d6778] cursor-not-allowed hover:bg-[#282e39]"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Reload button (if enabled) */}
        {config.showReloadButton && (
          <button
            onClick={onReloadPage}
            title="Reload Page (F5)"
            className="w-7 h-7 flex items-center justify-center rounded-[3px] text-[#a4b0c0] hover:text-white hover:bg-[#282e39] active:bg-[#343b48] transition-colors"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Locked URL Address Display */}
        <div
          title={config.startUrl}
          className="hidden md:flex items-center gap-1.5 px-2.5 py-1 bg-[#15181e] border border-[#2b313d] rounded-[3px] text-[11px] text-[#8e9cae] max-w-xs xl:max-w-md truncate"
        >
          <Lock className="w-3 h-3 text-emerald-400 shrink-0" />
          <span className="font-mono text-emerald-400 font-medium">https://</span>
          <span className="truncate">{config.startUrl.replace('https://', '')}</span>
        </div>
      </div>

      {/* Center: Permitted Additional Applications Dock */}
      <div className="flex items-center gap-1">
        {config.showCalculator && (
          <button
            onClick={() => onToggleApp('calculator')}
            title="Permitted Application: SEB Scientific Calculator"
            className={`h-7 px-2.5 rounded-[3px] border flex items-center gap-1.5 transition-colors ${
              activeApps.calculator
                ? 'bg-[#313845] border-[#4b5568] text-white shadow-inner'
                : 'bg-[#252a34] border-[#2f3542] text-[#abb7c7] hover:bg-[#2c3340] hover:text-white'
            }`}
          >
            <Calculator className="w-3.5 h-3.5 text-sky-400" />
            <span className="text-[11px] hidden sm:inline">Calculator</span>
          </button>
        )}

        {config.showNotepad && (
          <button
            onClick={() => onToggleApp('notepad')}
            title="Permitted Application: SEB Scratchpad & Text Editor"
            className={`h-7 px-2.5 rounded-[3px] border flex items-center gap-1.5 transition-colors ${
              activeApps.notepad
                ? 'bg-[#313845] border-[#4b5568] text-white shadow-inner'
                : 'bg-[#252a34] border-[#2f3542] text-[#abb7c7] hover:bg-[#2c3340] hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[11px] hidden sm:inline">Scratchpad</span>
          </button>
        )}

        {config.showPdfViewer && (
          <button
            onClick={() => onToggleApp('pdf')}
            title="Permitted Application: SEB Exam Reference & Formula Sheet"
            className={`h-7 px-2.5 rounded-[3px] border flex items-center gap-1.5 transition-colors ${
              activeApps.pdf
                ? 'bg-[#313845] border-[#4b5568] text-white shadow-inner'
                : 'bg-[#252a34] border-[#2f3542] text-[#abb7c7] hover:bg-[#2c3340] hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[11px] hidden sm:inline">Formulas</span>
          </button>
        )}

        {/* SEB Configuration Tool Toggle Button */}
        <button
          onClick={() => onToggleApp('configTool')}
          title="SEB Configuration Tool (SEBConfigTool.exe)"
          className={`h-7 px-2.5 rounded-[3px] border flex items-center gap-1.5 transition-colors ${
            activeApps.configTool
              ? 'bg-[#3b2d54] border-[#6b4fa3] text-purple-200'
              : 'bg-[#252a34] border-[#2f3542] text-[#a094b8] hover:bg-[#2c3340] hover:text-white'
          }`}
        >
          <Settings className="w-3.5 h-3.5 text-purple-400" />
          <span className="text-[11px] hidden lg:inline">SEB Config Tool</span>
        </button>

        {/* Security Diagnostics & Testing Button */}
        <button
          onClick={onToggleThreatDrawer}
          title="Simulate Security Threats & Violations"
          className={`h-7 px-2 rounded-[3px] border flex items-center gap-1 text-[11px] transition-colors ${
            violationsCount > 0
              ? 'bg-rose-950/70 border-rose-800 text-rose-300'
              : isThreatDrawerOpen
              ? 'bg-[#313845] border-[#4b5568] text-white'
              : 'bg-[#252a34] border-[#2f3542] text-[#abb7c7] hover:bg-[#2c3340]'
          }`}
        >
          <AlertTriangle className={`w-3.5 h-3.5 ${violationsCount > 0 ? 'text-rose-400' : 'text-amber-400'}`} />
          <span className="hidden md:inline">Lockdown Test</span>
          {violationsCount > 0 && (
            <span className="font-mono bg-rose-600 text-white rounded px-1 text-[10px] ml-0.5">
              {violationsCount}
            </span>
          )}
        </button>
      </div>

      {/* Right: System Tray & Iconic SEB Quit Button */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Audio Volume Button & Popup */}
        {config.showAudio && (
          <div className="relative">
            <button
              onClick={() => setShowVolumeSlider(!showVolumeSlider)}
              title="SEB Master Audio Control"
              className="w-7 h-7 flex items-center justify-center rounded-[3px] text-[#a4b0c0] hover:text-white hover:bg-[#282e39]"
            >
              <Volume2 className="w-3.5 h-3.5" />
            </button>
            {showVolumeSlider && (
              <div className="absolute bottom-9 right-0 bg-[#1e222a] border border-[#3a4250] rounded p-3 shadow-xl z-50 w-44 space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span>System Volume</span>
                  <span className="font-mono">{volume}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={(e) => setVolume(Number(e.target.value))}
                  className="w-full accent-rose-600 h-1.5 bg-[#12151a] rounded cursor-pointer"
                />
              </div>
            )}
          </div>
        )}

        {/* Wi-Fi Indicator */}
        <div title="Network: Connected (Campus Eduroam 5GHz)" className="text-[#8e9cae]">
          <Wifi className="w-3.5 h-3.5 text-emerald-400" />
        </div>

        {/* Battery Indicator */}
        {config.showBattery && (
          <div title="Power: AC Power Online · Battery 98%" className="flex items-center text-[#8e9cae]">
            <BatteryCharging className="w-3.5 h-3.5 text-emerald-400" />
          </div>
        )}

        {/* Keyboard Layout */}
        {config.showKeyboardLayout && (
          <div
            title="Keyboard Layout: United States English (QWERTY)"
            className="text-[11px] font-mono text-[#8e9cae] bg-[#161920] px-1.5 py-0.5 rounded border border-[#2b313d]"
          >
            ENG
          </div>
        )}

        {/* Digital Clock */}
        {config.showClock && (
          <div
            title="System Time"
            className="text-[11px] font-mono text-[#e1e7ef] tabular-nums font-semibold px-1"
          >
            {currentTime}
          </div>
        )}

        {/* Iconic SEB Red Power / Quit Button */}
        <button
          onClick={onOpenQuit}
          title="Quit Safe Exam Browser (Ctrl+Q)"
          className="h-7 px-2.5 bg-gradient-to-b from-[#cc2424] to-[#991717] hover:from-[#dd2f2f] hover:to-[#aa1b1b] text-white rounded-[3px] border border-[#ff4d4d]/40 flex items-center gap-1.5 shadow-sm active:translate-y-[1px] transition-all ml-1 font-semibold"
        >
          <Power className="w-3.5 h-3.5" />
          <span className="text-[11px] font-bold">Quit</span>
        </button>
      </div>
    </footer>
  );
};
