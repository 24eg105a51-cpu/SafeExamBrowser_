import React, { useState } from 'react';
import { FileText, X, Minus, Trash2 } from 'lucide-react';

interface SebNotepadProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SebNotepad: React.FC<SebNotepadProps> = ({ isOpen, onClose }) => {
  const [content, setContent] = useState(
    'SEB Scratchpad Notes:\n- Q1: KPTI isolates kernel CR3 from user page tables\n- Q2: TCP Window scale shifted up to 14 bits\n- Q3: Token bucket capacity check'
  );
  const [isMinimized, setIsMinimized] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed top-20 right-4 sm:right-16 z-40 w-80 sm:w-96 bg-[#1e232c] border border-[#394252] rounded shadow-2xl overflow-hidden font-sans select-none animate-in fade-in zoom-in-95 duration-100">
      {/* Titlebar */}
      <div className="bg-[#181b22] px-3 py-1.5 border-b border-[#2d3440] flex items-center justify-between text-[#cbd5e1] text-xs">
        <div className="flex items-center gap-2">
          <FileText className="w-3.5 h-3.5 text-emerald-400" />
          <span className="font-semibold text-[11px]">SEB Notepad (Volatile Exam RAM)</span>
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
        <div className="p-3 space-y-2">
          <div className="flex items-center justify-between text-[11px] text-[#94a3b8]">
            <span>Rough draft notes will automatically be wiped upon SEB exit.</span>
            <button
              onClick={() => setContent('')}
              title="Clear scratchpad"
              className="text-[#94a3b8] hover:text-rose-400 p-1 rounded hover:bg-[#28303e]"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
          <textarea
            rows={8}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Type notes or scratch calculations here..."
            className="w-full p-2.5 bg-[#12141a] border border-[#2b313d] rounded text-xs font-mono text-white placeholder-[#546274] focus:outline-none focus:border-emerald-500 leading-relaxed resize-y select-text"
          />
        </div>
      )}
    </div>
  );
};
