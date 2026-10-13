import React, { useState } from 'react';
import {
  Save,
  Download,
  RotateCcw,
  Key,
  Shield,
  Monitor,
  Globe,
  Sliders,
  AppWindow,
  Lock,
  X,
  Check
} from 'lucide-react';
import { SebConfig } from '../types/seb';
import { computeBekHash } from '../utils/crypto';
import { DEFAULT_SEB_CONFIG } from '../data/mockQuiz';

interface SebConfigToolProps {
  isOpen: boolean;
  onClose: () => void;
  config: SebConfig;
  onUpdateConfig: (newConfig: SebConfig) => void;
}

export const SebConfigTool: React.FC<SebConfigToolProps> = ({
  isOpen,
  onClose,
  config,
  onUpdateConfig
}) => {
  const [activeTab, setActiveTab] = useState<
    'general' | 'ui' | 'browser' | 'exam' | 'apps' | 'security' | 'network'
  >('general');
  const [localConfig, setLocalConfig] = useState<SebConfig>(config);
  const [copiedKey, setCopiedKey] = useState(false);
  const [newWhitelistedUrl, setNewWhitelistedUrl] = useState('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const recomputeKeys = (cfg: SebConfig): SebConfig => {
    const raw = JSON.stringify({
      url: cfg.startUrl,
      quit: cfg.quitPassword,
      admin: cfg.adminPassword,
      kiosk: cfg.kioskMode,
      clip: cfg.blockClipboard,
      ctx: cfg.blockContextMenu,
      devtools: cfg.blockDevTools,
      filter: cfg.whitelistedUrls
    });
    return {
      ...cfg,
      browserExamKey: computeBekHash(`BEK_${raw}`),
      configKey: computeBekHash(`CK_${raw}`)
    };
  };

  const handleSaveAndApply = () => {
    const updated = recomputeKeys(localConfig);
    setLocalConfig(updated);
    onUpdateConfig(updated);
    setStatusMessage('SEB configuration applied successfully to active browser session.');
    setTimeout(() => setStatusMessage(null), 2500);
  };

  const handleResetDefaults = () => {
    setLocalConfig(DEFAULT_SEB_CONFIG);
    onUpdateConfig(DEFAULT_SEB_CONFIG);
    setStatusMessage('Reset to default SEB 3.7.0 configuration.');
    setTimeout(() => setStatusMessage(null), 2500);
  };

  const handleExportSeb = () => {
    const updated = recomputeKeys(localConfig);
    const sebPayload = {
      format: 'SafeExamBrowser-Settings-v3.7',
      origin: 'https://safeexambrowser.org',
      exportedAt: new Date().toISOString(),
      configuration: updated
    };
    const blob = new Blob([JSON.stringify(sebPayload, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'exam_policy.seb';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyBEK = () => {
    navigator.clipboard?.writeText(localConfig.browserExamKey).catch(() => {});
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleAddWhitelistUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWhitelistedUrl.trim()) return;
    const clean = newWhitelistedUrl.trim();
    if (!localConfig.whitelistedUrls.includes(clean)) {
      setLocalConfig((prev) => ({
        ...prev,
        whitelistedUrls: [...prev.whitelistedUrls, clean]
      }));
    }
    setNewWhitelistedUrl('');
  };

  const handleRemoveWhitelistUrl = (urlToRemove: string) => {
    setLocalConfig((prev) => ({
      ...prev,
      whitelistedUrls: prev.whitelistedUrls.filter((u) => u !== urlToRemove)
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-xs select-none">
      <div className="w-full max-w-4xl bg-[#1e232c] border border-[#3b4454] rounded shadow-2xl flex flex-col max-h-[90vh] overflow-hidden font-sans text-xs text-[#cbd5e1]">
        {/* Titlebar in classic Windows/macOS SEBConfig style */}
        <div className="bg-[#15181f] px-4 py-2 border-b border-[#2d3440] flex items-center justify-between text-[#cbd5e1] shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-[#6c4897] text-white rounded-[2px] flex items-center justify-center font-bold">
              <Sliders className="w-3 h-3" />
            </div>
            <span className="font-semibold text-white text-xs">
              Safe Exam Browser Configuration Tool (SEBConfigTool v3.7)
            </span>
            <span className="text-[10px] text-[#6d7e94] font-mono">· Active Profile: CS402_Final.seb</span>
          </div>
          <button
            onClick={onClose}
            className="text-[#8e9cae] hover:text-white p-1 rounded hover:bg-[#28303e]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action Toolbar */}
        <div className="bg-[#1a1e26] px-4 py-1.5 border-b border-[#2a313d] flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={handleSaveAndApply}
              className="px-3 py-1 bg-sky-600 hover:bg-sky-500 text-white rounded font-medium flex items-center gap-1.5 transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              Save & Apply to Session
            </button>
            <button
              onClick={handleExportSeb}
              className="px-3 py-1 bg-[#262c38] hover:bg-[#323a4a] text-white rounded border border-[#394254] font-medium flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-purple-400" />
              Export .seb File
            </button>
            <button
              onClick={handleResetDefaults}
              className="px-2.5 py-1 text-[#94a3b8] hover:text-white rounded hover:bg-[#252b36] flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              Revert Defaults
            </button>
          </div>

          {statusMessage && (
            <span className="text-emerald-400 text-[11px] font-mono animate-in fade-in">
              {statusMessage}
            </span>
          )}
        </div>

        {/* Classic SEB Tabs Navigation */}
        <div className="flex items-center gap-1 px-3 pt-2 bg-[#161921] border-b border-[#2d3440] overflow-x-auto shrink-0">
          {[
            { id: 'general', label: 'General', icon: Sliders },
            { id: 'ui', label: 'User Interface', icon: Monitor },
            { id: 'browser', label: 'Browser', icon: Globe },
            { id: 'exam', label: 'Exam & BEK', icon: Key },
            { id: 'apps', label: 'Applications', icon: AppWindow },
            { id: 'security', label: 'Security', icon: Shield },
            { id: 'network', label: 'Network Filter', icon: Globe }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-t border-t border-x transition-colors whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-[#1e232c] text-white border-[#3b4454] border-b-transparent shadow-xs'
                    : 'bg-[#14171e] text-[#8e9cae] border-transparent hover:text-white hover:bg-[#1a1e27]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-sky-400' : 'text-[#6f7e94]'}`} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content Panes */}
        <div className="p-5 flex-1 overflow-y-auto space-y-4 bg-[#1e232c]">
          {/* TAB: GENERAL */}
          {activeTab === 'general' && (
            <div className="space-y-4 max-w-2xl">
              <div>
                <label className="block text-[#a4b2c4] font-medium mb-1">
                  Start URL (LMS / Examination Entry Point)
                </label>
                <input
                  type="text"
                  value={localConfig.startUrl}
                  onChange={(e) =>
                    setLocalConfig({ ...localConfig, startUrl: e.target.value })
                  }
                  className="w-full px-3 py-1.5 bg-[#12151b] border border-[#2e3745] rounded text-white font-mono focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#a4b2c4] font-medium mb-1">
                    Quit Password (Required to exit SEB)
                  </label>
                  <input
                    type="text"
                    value={localConfig.quitPassword}
                    onChange={(e) =>
                      setLocalConfig({ ...localConfig, quitPassword: e.target.value })
                    }
                    className="w-full px-3 py-1.5 bg-[#12151b] border border-[#2e3745] rounded text-white font-mono focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-[#a4b2c4] font-medium mb-1">
                    Administrator / Proctor Unlock Password
                  </label>
                  <input
                    type="text"
                    value={localConfig.adminPassword}
                    onChange={(e) =>
                      setLocalConfig({ ...localConfig, adminPassword: e.target.value })
                    }
                    className="w-full px-3 py-1.5 bg-[#12151b] border border-[#2e3745] rounded text-white font-mono focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-[#2e3646] space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localConfig.allowUserToQuit}
                    onChange={(e) =>
                      setLocalConfig({ ...localConfig, allowUserToQuit: e.target.checked })
                    }
                    className="rounded bg-[#12151b] border-[#384355] text-sky-500"
                  />
                  <span>Allow candidate to initiate Quit dialog (with quit password)</span>
                </label>
              </div>
            </div>
          )}

          {/* TAB: USER INTERFACE */}
          {activeTab === 'ui' && (
            <div className="space-y-4 max-w-2xl">
              <div className="space-y-2">
                <div className="text-[11px] font-bold text-[#8ba0b8] uppercase tracking-wider">
                  SEB Taskbar Appearance
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#a4b2c4] font-medium mb-1">
                      Taskbar Position
                    </label>
                    <select
                      value={localConfig.taskbarPosition}
                      onChange={(e) =>
                        setLocalConfig({
                          ...localConfig,
                          taskbarPosition: e.target.value as 'bottom' | 'top'
                        })
                      }
                      className="w-full px-3 py-1.5 bg-[#12151b] border border-[#2e3745] rounded text-white focus:outline-none"
                    >
                      <option value="bottom">Bottom of Screen (Standard SEB Default)</option>
                      <option value="top">Top of Screen</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[#a4b2c4] font-medium mb-1">
                      Maximum Permitted Strikes Before Lockout
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={10}
                      value={localConfig.maxViolations}
                      onChange={(e) =>
                        setLocalConfig({
                          ...localConfig,
                          maxViolations: Math.max(1, Number(e.target.value))
                        })
                      }
                      className="w-full px-3 py-1.5 bg-[#12151b] border border-[#2e3745] rounded text-white font-mono focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-[#2e3646] space-y-2.5">
                <div className="text-[11px] font-bold text-[#8ba0b8] uppercase tracking-wider">
                  Taskbar System Tray Widgets
                </div>

                {[
                  { key: 'showReloadButton', label: 'Show Page Reload button on taskbar' },
                  { key: 'showClock', label: 'Show system digital clock' },
                  { key: 'showBattery', label: 'Show battery indicator' },
                  { key: 'showAudio', label: 'Show audio volume mixer control' },
                  { key: 'showKeyboardLayout', label: 'Show keyboard layout indicator (ENG)' }
                ].map((item) => (
                  <label key={item.key} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={(localConfig as any)[item.key]}
                      onChange={(e) =>
                        setLocalConfig({
                          ...localConfig,
                          [item.key]: e.target.checked
                        })
                      }
                      className="rounded bg-[#12151b] border-[#384355] text-sky-500"
                    />
                    <span>{item.label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* TAB: EXAM & BEK */}
          {activeTab === 'exam' && (
            <div className="space-y-4 max-w-2xl">
              <div className="p-4 bg-[#14171f] rounded border border-[#2d3544] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-sky-400 flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5" />
                    Browser Exam Key (BEK) 256-Bit Cryptographic Hash
                  </span>
                  <button
                    onClick={handleCopyBEK}
                    className="px-2 py-0.5 text-[10px] bg-[#262c38] hover:bg-[#343d4e] rounded border border-[#3b4759] text-white flex items-center gap-1"
                  >
                    {copiedKey ? <Check className="w-3 h-3 text-emerald-400" /> : null}
                    {copiedKey ? 'Copied Hash' : 'Copy BEK'}
                  </button>
                </div>
                <div className="p-2 bg-[#0d0f14] rounded border border-[#232834] font-mono text-xs text-[#a3b8cc] break-all">
                  {localConfig.browserExamKey}
                </div>
                <div className="text-[11px] text-[#718296] leading-tight">
                  Moodle, Canvas, and Inspera compare this hash on each request to verify that the student is accessing the quiz through an unmodified Safe Exam Browser instance with the exact designated policy settings.
                </div>
              </div>

              <div className="p-4 bg-[#14171f] rounded border border-[#2d3544] space-y-2">
                <span className="text-xs font-bold text-purple-400 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5" />
                  Configuration Key (CK)
                </span>
                <div className="p-2 bg-[#0d0f14] rounded border border-[#232834] font-mono text-xs text-[#a3b8cc] break-all">
                  {localConfig.configKey}
                </div>
              </div>
            </div>
          )}

          {/* TAB: APPLICATIONS */}
          {activeTab === 'apps' && (
            <div className="space-y-4 max-w-2xl">
              <div className="text-[11px] font-bold text-[#8ba0b8] uppercase tracking-wider">
                Permitted Additional Third-Party Applications
              </div>
              <p className="text-[#8495a8] leading-tight text-xs">
                In Safe Exam Browser, administrators can whitelist embedded accessories or external desktop binaries.
              </p>

              <div className="space-y-3 pt-1">
                {[
                  {
                    key: 'showCalculator',
                    title: 'Permit SEB Scientific Calculator',
                    desc: 'Enables the standard/scientific floating calculator accessory in the dock.'
                  },
                  {
                    key: 'showNotepad',
                    title: 'Permit SEB Text Editor / Scratchpad',
                    desc: 'Enables volatile rough scratchpad memory that wipes automatically upon exit.'
                  },
                  {
                    key: 'showPdfViewer',
                    title: 'Permit SEB PDF Formula & Reference Reader',
                    desc: 'Enables approved formulas and documentation viewer during the exam.'
                  }
                ].map((app) => (
                  <div
                    key={app.key}
                    className="p-3 bg-[#161a22] rounded border border-[#2a313e] flex items-center justify-between gap-4"
                  >
                    <div>
                      <div className="font-semibold text-white">{app.title}</div>
                      <div className="text-[11px] text-[#7d8fa3]">{app.desc}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setLocalConfig({
                          ...localConfig,
                          [app.key]: !(localConfig as any)[app.key]
                        })
                      }
                      className={`px-3 py-1 rounded text-xs font-mono font-bold transition-colors ${
                        (localConfig as any)[app.key]
                          ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/40'
                          : 'bg-[#222834] text-[#6b7b8e] border border-[#313a4a]'
                      }`}
                    >
                      {(localConfig as any)[app.key] ? 'ALLOWED' : 'BLOCKED'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: SECURITY */}
          {activeTab === 'security' && (
            <div className="space-y-3 max-w-2xl">
              <div className="text-[11px] font-bold text-[#8ba0b8] uppercase tracking-wider">
                Workstation Lockdown & Process Hooks
              </div>

              {[
                {
                  key: 'blockClipboard',
                  label: 'Block System Clipboard (Cut, Copy, Paste)',
                  desc: 'Suppresses Ctrl+C, Ctrl+V, and OS clipboard sharing.'
                },
                {
                  key: 'blockContextMenu',
                  label: 'Disable Right-Click Context Menu',
                  desc: 'Blocks contextmenu DOM actions across all web content.'
                },
                {
                  key: 'detectWindowBlur',
                  label: 'Detect Window Blur & Alt+Tab Focus Loss',
                  desc: 'Records security incidents whenever user switches tasks or clicks away.'
                },
                {
                  key: 'blockDevTools',
                  label: 'Block Developer Tools & Inspector (F12)',
                  desc: 'Suppresses F12, Ctrl+Shift+I, and print dialog hotkeys.'
                }
              ].map((sec) => (
                <div
                  key={sec.key}
                  className="p-3 bg-[#161a22] rounded border border-[#2a313e] flex items-center justify-between gap-4"
                >
                  <div>
                    <div className="font-semibold text-white">{sec.label}</div>
                    <div className="text-[11px] text-[#7d8fa3]">{sec.desc}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setLocalConfig({
                        ...localConfig,
                        [sec.key]: !(localConfig as any)[sec.key]
                      })
                    }
                    className={`px-3 py-1 rounded text-xs font-mono font-bold transition-colors ${
                      (localConfig as any)[sec.key]
                        ? 'bg-rose-600/20 text-rose-300 border border-rose-500/40'
                        : 'bg-[#222834] text-[#6b7b8e] border border-[#313a4a]'
                    }`}
                  >
                    {(localConfig as any)[sec.key] ? 'ENFORCED' : 'DISABLED'}
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* TAB: NETWORK FILTER */}
          {activeTab === 'network' && (
            <div className="space-y-4 max-w-2xl">
              <div>
                <div className="text-[11px] font-bold text-[#8ba0b8] uppercase tracking-wider mb-1">
                  SEB URL Filter Rules (Whitelist)
                </div>
                <p className="text-[#7d8fa3] text-xs">
                  Only web pages matching these wildcard expressions are permitted in SEB.
                </p>
              </div>

              <form onSubmit={handleAddWhitelistUrl} className="flex items-center gap-2">
                <input
                  type="text"
                  value={newWhitelistedUrl}
                  onChange={(e) => setNewWhitelistedUrl(e.target.value)}
                  placeholder="e.g. https://*.institution.edu/*"
                  className="flex-1 px-3 py-1.5 bg-[#12151b] border border-[#2e3745] rounded text-white font-mono focus:outline-none focus:border-sky-500"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded font-medium"
                >
                  Add Rule
                </button>
              </form>

              <div className="space-y-1.5 pt-1">
                {localConfig.whitelistedUrls.map((urlItem) => (
                  <div
                    key={urlItem}
                    className="p-2 bg-[#14171f] rounded border border-[#272e3a] flex items-center justify-between font-mono text-[11px]"
                  >
                    <span className="text-white truncate">{urlItem}</span>
                    <button
                      onClick={() => handleRemoveWhitelistUrl(urlItem)}
                      className="text-[#8494a5] hover:text-rose-400 ml-2"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
