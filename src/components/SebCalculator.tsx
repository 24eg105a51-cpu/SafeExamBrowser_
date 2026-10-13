import React, { useState } from 'react';
import { Calculator, X, Minus } from 'lucide-react';

interface SebCalculatorProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SebCalculator: React.FC<SebCalculatorProps> = ({ isOpen, onClose }) => {
  const [display, setDisplay] = useState('0');
  const [memory, setMemory] = useState<number | null>(null);
  const [isMinimized, setIsMinimized] = useState(false);

  if (!isOpen) return null;

  const handleInput = (token: string) => {
    if (token === 'C') {
      setDisplay('0');
      return;
    }
    if (token === 'CE') {
      setDisplay('0');
      return;
    }
    if (token === 'DEL') {
      setDisplay((prev) => (prev.length <= 1 ? '0' : prev.slice(0, -1)));
      return;
    }
    if (token === '=') {
      try {
        const sanitized = display
          .replace(/×/g, '*')
          .replace(/÷/g, '/')
          .replace(/\^/g, '**')
          .replace(/[^0-9+\-*/().%\s]/g, '');
        const res = Function(`"use strict"; return (${sanitized})`)();
        setDisplay(Number.isFinite(res) ? String(Number(res.toPrecision(10))) : 'Error');
      } catch {
        setDisplay('Error');
      }
      return;
    }
    if (token === 'sqrt') {
      try {
        const val = Math.sqrt(parseFloat(display));
        setDisplay(String(val));
      } catch {
        setDisplay('Error');
      }
      return;
    }
    if (token === 'sqr') {
      try {
        const val = Math.pow(parseFloat(display), 2);
        setDisplay(String(val));
      } catch {
        setDisplay('Error');
      }
      return;
    }

    setDisplay((prev) => (prev === '0' || prev === 'Error' ? token : prev + token));
  };

  const buttons = [
    ['MC', 'MR', 'M+', 'C', 'CE'],
    ['(', ')', 'sqrt', 'sqr', '÷'],
    ['7', '8', '9', '×', '%'],
    ['4', '5', '6', '-', 'DEL'],
    ['1', '2', '3', '+', '1/x'],
    ['±', '0', '.', '=', 'Ans']
  ];

  return (
    <div className="fixed top-12 left-4 sm:left-12 z-40 w-72 bg-[#1e232c] border border-[#394252] rounded shadow-2xl overflow-hidden font-sans select-none animate-in fade-in zoom-in-95 duration-100">
      {/* Titlebar */}
      <div className="bg-[#181b22] px-3 py-1.5 border-b border-[#2d3440] flex items-center justify-between text-[#cbd5e1] text-xs">
        <div className="flex items-center gap-2">
          <Calculator className="w-3.5 h-3.5 text-sky-400" />
          <span className="font-semibold text-[11px]">SEB Calculator (Standard / Sci)</span>
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
          {/* Output screen */}
          <div className="bg-[#12141a] border border-[#2b313d] rounded p-2 text-right">
            <div className="text-[10px] font-mono text-[#64748b] h-3.5">
              {memory !== null ? `M=${memory}` : ''}
            </div>
            <div className="text-xl font-mono text-white font-semibold truncate tracking-wider">
              {display}
            </div>
          </div>

          {/* Grid buttons */}
          <div className="grid grid-cols-5 gap-1 text-xs">
            {buttons.map((row, rIdx) =>
              row.map((btn) => (
                <button
                  key={`${rIdx}-${btn}`}
                  onClick={() => {
                    if (btn === 'MC') setMemory(null);
                    else if (btn === 'M+') setMemory((prev) => (prev || 0) + parseFloat(display || '0'));
                    else if (btn === 'MR') setDisplay(memory !== null ? String(memory) : '0');
                    else if (btn === '1/x') setDisplay(String(1 / parseFloat(display || '1')));
                    else if (btn === '±') setDisplay(String(-1 * parseFloat(display || '0')));
                    else if (btn === 'Ans') setDisplay((prev) => prev + '0');
                    else handleInput(btn);
                  }}
                  className={`py-2 rounded font-mono text-[11px] font-medium border transition-colors ${
                    btn === '='
                      ? 'bg-sky-600 hover:bg-sky-500 text-white border-sky-500'
                      : btn === 'C' || btn === 'CE'
                      ? 'bg-rose-950/50 hover:bg-rose-900/60 text-rose-300 border-rose-900/60'
                      : ['+', '-', '×', '÷'].includes(btn)
                      ? 'bg-[#28303d] hover:bg-[#343e4f] text-sky-300 border-[#384355]'
                      : 'bg-[#222833] hover:bg-[#2b3342] text-[#d1dbe5] border-[#2f3747]'
                  }`}
                >
                  {btn}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
