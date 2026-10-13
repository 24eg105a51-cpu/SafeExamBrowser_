export type QuestionType = 'choice' | 'multi_choice' | 'code' | 'essay';

export interface QuizQuestion {
  id: string;
  number: number;
  title: string;
  category: string;
  maxPoints: number;
  type: QuestionType;
  prompt: string;
  codeSnippet?: string;
  options?: { id: string; text: string }[];
  correctOptions?: string[];
  starterCode?: string;
  testCases?: { input: string; expected: string; label: string }[];
  minWords?: number;
}

export interface SebConfig {
  startUrl: string;
  quitPassword: string;
  adminPassword: string;
  allowUserToQuit: boolean;
  taskbarPosition: 'bottom' | 'top';
  showTaskbar: boolean;
  showReloadButton: boolean;
  showClock: boolean;
  showBattery: boolean;
  showAudio: boolean;
  showKeyboardLayout: boolean;
  showCalculator: boolean;
  showNotepad: boolean;
  showPdfViewer: boolean;
  kioskMode: 'full' | 'window';
  blockClipboard: boolean;
  blockContextMenu: boolean;
  detectWindowBlur: boolean;
  blockDevTools: boolean;
  maxViolations: number;
  browserExamKey: string;
  configKey: string;
  whitelistedUrls: string[];
}

export interface SecurityIncident {
  id: string;
  timestamp: string;
  type: 'BLUR' | 'CLIPBOARD' | 'CONTEXT_MENU' | 'DEVTOOLS' | 'URL_BLOCKED' | 'FULLSCREEN_EXIT';
  title: string;
  description: string;
  strikeCounted: boolean;
}
