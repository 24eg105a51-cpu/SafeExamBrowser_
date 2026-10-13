import React, { useState } from 'react';
import { BookOpen, X, Minus, Search, ZoomIn, ZoomOut } from 'lucide-react';

interface SebPdfViewerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SebPdfViewer: React.FC<SebPdfViewerProps> = ({ isOpen, onClose }) => {
  const [zoom, setZoom] = useState(100);
  const [search, setSearch] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);

  if (!isOpen) return null;

  const formulas = [
    {
      title: 'Operating Systems: Amdahl’s Law & Multicore Speedup',
      formula: 'Speedup(S) = 1 / ((1 - P) + P / N)',
      notes: 'P = Parallelizable fraction of execution; N = Number of processing cores.'
    },
    {
      title: 'Memory Systems: Effective Access Time with TLB',
      formula: 'EAT = HitRate * TLB_Time + (1 - HitRate) * (TLB_Time + PageTableWalk_Time)',
      notes: 'KPTI adds ~20-50ns overhead on x86_64 system call ring transitions.'
    },
    {
      title: 'Networking: TCP Bandwidth-Delay Product (BDP)',
      formula: 'BDP = Bottleneck_Bandwidth * RoundTripTime (RTT)',
      notes: 'Maximum TCP window scale factor allowed is 14 bits (RFC 7323).'
    },
    {
      title: 'Cryptography: Ephemeral Elliptic Curve Diffie-Hellman (ECDHE)',
      formula: 'Shared_Secret = a * (b * G) = b * (a * G)',
      notes: 'Guarantees Forward Secrecy; ephemeral keys are discarded after session generation.'
    }
  ];

  const filtered = formulas.filter(
    (f) =>
      f.title.toLowerCase().includes(search.toLowerCase()) ||
      f.formula.toLowerCase().includes(search.toLowerCase()) ||
      f.notes.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed top-16 left-6 sm:left-32 z-40 w-80 sm:w-[480px] bg-[#1e232c] border border-[#394252] rounded shadow-2xl overflow-hidden font-sans select-none animate-in fade-in zoom-in-95 duration-100">
      {/* Titlebar */}
      <div className="bg-[#181b22] px-3 py-1.5 border-b border-[#2d3440] flex items-center justify-between text-[#cbd5e1] text-xs">
        <div className="flex items-center gap-2">
          <BookOpen className="w-3.5 h-3.5 text-amber-400" />
          <span className="font-semibold text-[11px]">SEB Reference Reader: CS402-Formulas.pdf</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="w-5 h-5 flex items-center justify-center rounded hover:bg-[#2d3440] text-[#94a3b8]"
          >
            <Minus className="w-3 h-3" />
          </button>
          <button
            onClick={onClose}
            className="w-5 h-5 flex items-center justify-center rounded hover:bg-[#991717] hover:text-white text-[#94a3b8]"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <div className="p-3 space-y-3">
          {/* Controls Bar */}
          <div className="flex items-center justify-between gap-2 bg-[#14161d] p-1.5 rounded border border-[#272e3a] text-xs">
            <div className="relative flex-1">
              <Search className="w-3 h-3 text-[#64748b] absolute left-2 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search formulas..."
                className="w-full pl-6 pr-2 py-1 bg-[#1c212a] border border-[#2d3542] rounded text-[11px] text-white placeholder-[#5d6b7c] focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>
            <div className="flex items-center gap-1 shrink-0 text-[#94a3b8]">
              <button
                onClick={() => setZoom(Math.max(75, zoom - 15))}
                className="p-1 hover:text-white rounded hover:bg-[#252b36]"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-[10px] font-mono w-10 text-center">{zoom}%</span>
              <button
                onClick={() => setZoom(Math.min(150, zoom + 15))}
                className="p-1 hover:text-white rounded hover:bg-[#252b36]"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* PDF Page Simulator */}
          <div
            style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top left' }}
            className="bg-[#2a2f3a] p-4 rounded border border-[#3b4352] space-y-3 max-h-72 overflow-y-auto"
          >
            <div className="border-b border-[#475163] pb-2 flex items-center justify-between">
              <span className="text-xs font-bold text-white tracking-wide uppercase">
                Approved Exam Formula Reference Sheet
              </span>
              <span className="text-[10px] font-mono text-amber-300">CONFIDENTIAL · PAGE 1/1</span>
            </div>

            {filtered.length === 0 ? (
              <div className="text-center py-6 text-xs text-[#8292a4]">No matching formulas found.</div>
            ) : (
              filtered.map((item, idx) => (
                <div key={idx} className="bg-[#1e232c] p-2.5 rounded border border-[#363f4f] space-y-1">
                  <div className="text-[11px] font-semibold text-sky-300">{item.title}</div>
                  <div className="text-xs font-mono font-bold text-amber-300 bg-[#14171f] px-2 py-1 rounded">
                    {item.formula}
                  </div>
                  <div className="text-[10px] text-[#94a3b8]">{item.notes}</div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
