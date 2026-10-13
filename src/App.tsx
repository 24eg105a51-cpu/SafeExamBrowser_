import React, { useState, useEffect, useCallback } from 'react';
import { DEFAULT_SEB_CONFIG, MOCK_QUIZ_QUESTIONS } from './data/mockQuiz';
import { SebConfig, SecurityIncident, QuizQuestion } from './types/seb';
import { SebTaskbar } from './components/SebTaskbar';
import { SebMenuModal } from './components/SebMenuModal';
import { SebQuitModal } from './components/SebQuitModal';
import { SebCalculator } from './components/SebCalculator';
import { SebNotepad } from './components/SebNotepad';
import { SebPdfViewer } from './components/SebPdfViewer';
import { SebLockoutScreen } from './components/SebLockoutScreen';
import { SebConfigTool } from './components/SebConfigTool';
import { ThreatSimulatorDrawer } from './components/ThreatSimulatorDrawer';
import { LmsQuizViewport } from './components/LmsQuizViewport';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [config, setConfig] = useState<SebConfig>(DEFAULT_SEB_CONFIG);
  const [questions, setQuestions] = useState<QuizQuestion[]>(MOCK_QUIZ_QUESTIONS);
  const [incidents, setIncidents] = useState<SecurityIncident[]>([]);
  const [isLockedOut, setIsLockedOut] = useState<boolean>(false);

  // Active floating accessory windows
  const [activeApps, setActiveApps] = useState<{
    calculator: boolean;
    notepad: boolean;
    pdf: boolean;
    configTool: boolean;
  }>({
    calculator: false,
    notepad: false,
    pdf: false,
    configTool: false
  });

  // Modal dialog states
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isQuitOpen, setIsQuitOpen] = useState(false);
  const [isThreatDrawerOpen, setIsThreatDrawerOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);

  // Real-time clock for SEB taskbar
  const [currentTime, setCurrentTime] = useState(
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  );

  // Exam timer
  const [remainingSeconds, setRemainingSeconds] = useState(45 * 60);

  // Temporary toast notification (e.g. for right-click or clipboard blocks)
  const [notificationToast, setNotificationToast] = useState<{
    type: 'warn' | 'success' | 'danger';
    title: string;
    detail: string;
  } | null>(null);

  // Ticking clock & countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(
        new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );
      setRemainingSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const triggerSecurityViolation = useCallback(
    (
      type: 'BLUR' | 'CLIPBOARD' | 'CONTEXT_MENU' | 'DEVTOOLS' | 'URL_BLOCKED' | 'FULLSCREEN_EXIT',
      title: string,
      description: string,
      strikeCounted = true
    ) => {
      const nowStr = new Date().toLocaleTimeString();
      const newInc: SecurityIncident = {
        id: `inc-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        timestamp: nowStr,
        type,
        title,
        description,
        strikeCounted
      };

      setIncidents((prev) => {
        const next = [newInc, ...prev];
        const counted = next.filter((i) => i.strikeCounted).length;
        if (counted >= config.maxViolations) {
          setIsLockedOut(true);
        }
        return next;
      });

      setNotificationToast({
        type: strikeCounted ? 'danger' : 'warn',
        title,
        detail: description
      });

      setTimeout(() => {
        setNotificationToast((cur) => (cur?.title === title ? null : cur));
      }, 3500);
    },
    [config.maxViolations]
  );

  // Attach real DOM security event interceptors matching actual SEB behavior
  useEffect(() => {
    if (isLockedOut) return;

    // Right-Click Context Menu interceptor
    const handleContextMenu = (e: MouseEvent) => {
      if (config.blockContextMenu) {
        e.preventDefault();
        triggerSecurityViolation(
          'CONTEXT_MENU',
          'Right-Click Context Menu Prohibited',
          'SEB Security Policy suppresses right-click context menu actions.',
          false
        );
      }
    };

    // Clipboard interceptor
    const handleClipboard = (e: ClipboardEvent) => {
      if (config.blockClipboard) {
        e.preventDefault();
        triggerSecurityViolation(
          'CLIPBOARD',
          `Restricted Clipboard Operation (${e.type.toUpperCase()}) Blocked`,
          'Direct clipboard manipulation is blocked by Safe Exam Browser.',
          true
        );
      }
    };

    // Keyboard shortcut interceptor (DevTools F12, Ctrl+U, Ctrl+Shift+I)
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase();
      const isF12 = key === 'F12';
      const isDevToolsCombo =
        (e.ctrlKey || e.metaKey) && e.shiftKey && ['I', 'J', 'C'].includes(key);
      const isPrintOrViewSource =
        (e.ctrlKey || e.metaKey) && ['U', 'P', 'S'].includes(key);

      if (config.blockDevTools && (isF12 || isDevToolsCombo || isPrintOrViewSource)) {
        e.preventDefault();
        triggerSecurityViolation(
          'DEVTOOLS',
          'Prohibited Shortcut Intercepted (F12 / DevTools)',
          `The shortcut ${e.ctrlKey ? 'Ctrl+' : ''}${e.shiftKey ? 'Shift+' : ''}${key} is blocked by SEB.`,
          true
        );
      }

      // Ctrl+Q quits SEB
      if ((e.ctrlKey || e.metaKey) && key === 'Q') {
        e.preventDefault();
        setIsQuitOpen(true);
      }
    };

    // Window Blur / Tab Switch interceptor
    const handleVisibilityChange = () => {
      if (document.hidden && config.detectWindowBlur) {
        triggerSecurityViolation(
          'BLUR',
          'Window Focus Lost (Alt+Tab / Background Switch)',
          'The examination window lost primary OS focus or became hidden.',
          true
        );
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('copy', handleClipboard);
    document.addEventListener('cut', handleClipboard);
    document.addEventListener('paste', handleClipboard);
    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('copy', handleClipboard);
      document.removeEventListener('cut', handleClipboard);
      document.removeEventListener('paste', handleClipboard);
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [config, isLockedOut, triggerSecurityViolation]);

  const toggleApp = (app: 'calculator' | 'notepad' | 'pdf' | 'configTool') => {
    setActiveApps((prev) => ({
      ...prev,
      [app]: !prev[app]
    }));
  };

  const handleConfirmQuit = () => {
    setIsQuitOpen(false);
    setNotificationToast({
      type: 'success',
      title: 'Safe Exam Browser Quitted',
      detail: 'Lockdown released. Workstation returned to host desktop.'
    });
    // In a real desktop app, SEB terminates. Here we reset remaining state.
    setTimeout(() => {
      window.location.reload();
    }, 1200);
  };

  const handleReloadPage = () => {
    setNotificationToast({
      type: 'warn',
      title: 'Page Reloading',
      detail: 'Refreshing exam viewport from LMS server...'
    });
    setTimeout(() => {
      setNotificationToast(null);
    }, 1000);
  };

  const totalStrikes = incidents.filter((i) => i.strikeCounted).length;

  return (
    <div className="h-screen w-screen bg-[#14171f] flex flex-col overflow-hidden select-none relative">
      {/* SEB Taskbar Top (if position configured as 'top') */}
      {config.taskbarPosition === 'top' && (
        <SebTaskbar
          config={config}
          currentTime={currentTime}
          violationsCount={totalStrikes}
          isThreatDrawerOpen={isThreatDrawerOpen}
          onToggleThreatDrawer={() => setIsThreatDrawerOpen(!isThreatDrawerOpen)}
          onOpenMenu={() => setIsMenuOpen(true)}
          onOpenQuit={() => setIsQuitOpen(true)}
          onReloadPage={handleReloadPage}
          onToggleApp={toggleApp}
          activeApps={activeApps}
        />
      )}

      {/* Main Browser Viewport (The LMS Quiz) */}
      <LmsQuizViewport
        questions={questions}
        config={config}
        remainingSeconds={remainingSeconds}
        zoomLevel={zoomLevel}
        onOpenQuit={() => setIsQuitOpen(true)}
      />

      {/* SEB Taskbar Bottom (Standard default position) */}
      {config.taskbarPosition === 'bottom' && (
        <SebTaskbar
          config={config}
          currentTime={currentTime}
          violationsCount={totalStrikes}
          isThreatDrawerOpen={isThreatDrawerOpen}
          onToggleThreatDrawer={() => setIsThreatDrawerOpen(!isThreatDrawerOpen)}
          onOpenMenu={() => setIsMenuOpen(true)}
          onOpenQuit={() => setIsQuitOpen(true)}
          onReloadPage={handleReloadPage}
          onToggleApp={toggleApp}
          activeApps={activeApps}
        />
      )}

      {/* Real-time SEB Toast Notification Banner */}
      {notificationToast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          <div
            className={`px-4 py-2.5 rounded shadow-2xl border flex items-center gap-3 text-xs font-sans ${
              notificationToast.type === 'danger'
                ? 'bg-[#2a0e0e] border-[#cc2424] text-[#ffd6d6]'
                : notificationToast.type === 'success'
                ? 'bg-[#0e2a14] border-emerald-500 text-emerald-200'
                : 'bg-[#29220e] border-amber-500 text-amber-200'
            }`}
          >
            {notificationToast.type === 'danger' ? (
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            )}
            <div>
              <div className="font-bold text-white">{notificationToast.title}</div>
              <div className="text-[11px] opacity-90">{notificationToast.detail}</div>
            </div>
          </div>
        </div>
      )}

      {/* Permitted Floating Accessories */}
      <SebCalculator
        isOpen={activeApps.calculator}
        onClose={() => toggleApp('calculator')}
      />

      <SebNotepad
        isOpen={activeApps.notepad}
        onClose={() => toggleApp('notepad')}
      />

      <SebPdfViewer
        isOpen={activeApps.pdf}
        onClose={() => toggleApp('pdf')}
      />

      {/* Official SEB Configuration Tool */}
      <SebConfigTool
        isOpen={activeApps.configTool}
        onClose={() => toggleApp('configTool')}
        config={config}
        onUpdateConfig={(newCfg) => setConfig(newCfg)}
      />

      {/* Threat Simulator Drawer for Testing Security Rules */}
      <ThreatSimulatorDrawer
        isOpen={isThreatDrawerOpen}
        onClose={() => setIsThreatDrawerOpen(false)}
        incidents={incidents}
        maxViolations={config.maxViolations}
        onTriggerViolation={triggerSecurityViolation}
        onClearIncidents={() => {
          setIncidents([]);
          setIsLockedOut(false);
        }}
      />

      {/* SEB Start Menu Modal */}
      <SebMenuModal
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        config={config}
        zoomLevel={zoomLevel}
        onSetZoom={setZoomLevel}
        onReload={handleReloadPage}
        onOpenQuit={() => setIsQuitOpen(true)}
        onOpenConfigTool={() => toggleApp('configTool')}
      />

      {/* SEB Quit Dialog Modal */}
      <SebQuitModal
        isOpen={isQuitOpen}
        onClose={() => setIsQuitOpen(false)}
        config={config}
        onConfirmQuit={handleConfirmQuit}
        onLogQuitAttemptFailed={(entered) => {
          triggerSecurityViolation(
            'DEVTOOLS',
            'Failed SEB Quit Password Attempt',
            `Candidate entered incorrect password attempt "${entered}".`,
            false
          );
        }}
      />

      {/* SEB Kiosk Lockout Screen if Strikes Exceeded */}
      {isLockedOut && (
        <SebLockoutScreen
          incidents={incidents}
          unlockPassword={config.adminPassword}
          onUnlock={() => {
            setIsLockedOut(false);
            setIncidents([]);
          }}
        />
      )}
    </div>
  );
}
