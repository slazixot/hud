import React, { useEffect, useState } from 'react';
import { Keyboard, RotateCcw, Sparkles } from 'lucide-react';
import { HotkeyBinding } from '../types/mod';

interface HotkeyManagerProps {
  hotkeys: HotkeyBinding[];
  lastTriggeredId: string | null;
  onUpdateHotkey: (id: string, keyCombo: string) => void;
  onResetHotkeys: () => void;
}

export function formatKeyEvent(e: KeyboardEvent): string | null {
  const ignored = ['Control', 'Shift', 'Alt', 'Meta'];
  if (ignored.includes(e.key)) {
    // Allow binding RightShift specifically if user presses ShiftRight alone? Let's stick to standard combos + F-keys + single keys
    if (e.code === 'ShiftRight') return 'RightShift';
    return null;
  }

  const parts: string[] = [];
  if (e.ctrlKey) parts.push('Ctrl');
  if (e.altKey) parts.push('Alt');
  if (e.shiftKey) parts.push('Shift');

  let mainKey = e.key;
  if (mainKey === ' ') mainKey = 'Space';
  else if (mainKey.length === 1) mainKey = mainKey.toUpperCase();

  parts.push(mainKey);
  return parts.join('+');
}

export const HotkeyManager: React.FC<HotkeyManagerProps> = ({
  hotkeys,
  lastTriggeredId,
  onUpdateHotkey,
  onResetHotkeys,
}) => {
  const [listeningId, setListeningId] = useState<string | null>(null);

  useEffect(() => {
    if (!listeningId) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (e.key === 'Escape') {
        setListeningId(null);
        return;
      }

      const combo = formatKeyEvent(e);
      if (combo) {
        onUpdateHotkey(listeningId, combo);
        setListeningId(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [listeningId, onUpdateHotkey]);

  const categories: Array<'Core' | 'Games' | 'Tracker'> = ['Core', 'Games', 'Tracker'];

  return (
    <div className="glass-panel rounded-[2.25rem] p-5 sm:p-7">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="font-display text-xl font-bold text-white flex items-center gap-2">
            <Keyboard className="w-5 h-5 text-cyan-300" />
            Hotkey Studio
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Click any keybind pill and press any key or combo (e.g.{' '}
            <span className="font-mono-code text-slate-200">F6</span>,{' '}
            <span className="font-mono-code text-slate-200">Shift+G</span>). Works live in this studio!
          </p>
        </div>

        <button
          onClick={onResetHotkeys}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-300 cursor-pointer transition-all"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Defaults
        </button>
      </div>

      <div className="space-y-6">
        {categories.map((cat) => {
          const items = hotkeys.filter((h) => h.category === cat);
          if (items.length === 0) return null;

          return (
            <div key={cat}>
              <div className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-3 px-1">
                {cat} Controls
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {items.map((hk) => {
                  const isListening = listeningId === hk.id;
                  const justFired = lastTriggeredId === hk.id;

                  return (
                    <div
                      key={hk.id}
                      className={`rounded-3xl p-4 border transition-all flex items-center justify-between gap-4 ${
                        justFired
                          ? 'bg-emerald-500/15 border-emerald-400/50 shadow-[0_0_24px_rgba(16,185,129,0.2)]'
                          : 'bg-white/[0.03] border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="text-sm font-bold text-white flex items-center gap-1.5">
                          <span className="truncate">{hk.label}</span>
                          {justFired && (
                            <Sparkles className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 truncate mt-0.5">
                          {hk.description}
                        </p>
                      </div>

                      <button
                        onClick={() =>
                          setListeningId(isListening ? null : hk.id)
                        }
                        className={`shrink-0 min-w-[104px] px-4 py-2 rounded-full font-mono-code text-xs font-bold border transition-all cursor-pointer ${
                          isListening
                            ? 'bg-amber-500/25 border-amber-400 text-amber-200 animate-pulse'
                            : 'bg-slate-900/90 border-white/15 text-cyan-300 hover:border-cyan-400/50'
                        }`}
                      >
                        {isListening ? 'Press key...' : hk.keyCombo}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
