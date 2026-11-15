import { useCallback, useEffect, useState } from 'react';
import {
  Sparkles,
  Gamepad2,
  Keyboard,
  DollarSign,
  Palette,
  Crown,
  PanelTop,
} from 'lucide-react';
import {
  GAME_LIST,
  GameModeId,
  HotkeyBinding,
  ModConfig,
  PayoutEntry,
} from './types/mod';
import { DispenserStage } from './components/DispenserStage';
import { GameCustomizer } from './components/GameCustomizer';
import { HotkeyManager, formatKeyEvent } from './components/HotkeyManager';
import { ChatMoneyTracker } from './components/ChatMoneyTracker';
import { AppearanceAndExport } from './components/AppearanceAndExport';
import { formatMoney, parseChatLine } from './utils/chatParser';

const DEFAULT_HOTKEYS: HotkeyBinding[] = [
  {
    id: 'open_menu',
    label: 'Toggle Mod Menu View',
    description: 'Switch between full customizer menu & stage-only HUD view',
    keyCombo: 'M',
    category: 'Core',
  },
  {
    id: 'toggle_mod',
    label: 'Arm / Bypass Visuals',
    description: 'Toggle client-side dispenser overrides on or off',
    keyCombo: 'F6',
    category: 'Core',
  },
  {
    id: 'trigger_dispenser',
    label: 'Fire Dispenser Preview',
    description: 'Eject configured Map Art / item from the dispenser',
    keyCombo: 'G',
    category: 'Core',
  },
  {
    id: 'cycle_game',
    label: 'Cycle Next Minigame',
    description: 'Rotate through all 6 casino & dispenser games',
    keyCombo: 'C',
    category: 'Core',
  },
  {
    id: 'game_higher_lower',
    label: 'Select Higher or Lower',
    description: 'Arm winner map art for Higher or Lower',
    keyCombo: '1',
    category: 'Games',
  },
  {
    id: 'game_paper',
    label: 'Select Paper Game',
    description: 'Arm chosen paper drop out of dispenser',
    keyCombo: '2',
    category: 'Games',
  },
  {
    id: 'game_armor',
    label: 'Select Armor Game',
    description: 'Arm chosen armor tier & piece drop',
    keyCombo: '3',
    category: 'Games',
  },
  {
    id: 'game_roulette',
    label: 'Select Russian Roulette',
    description: 'Arm chosen revolver chamber visual',
    keyCombo: '4',
    category: 'Games',
  },
  {
    id: 'game_454510',
    label: 'Select 45 / 45 / 10',
    description: 'Arm 45 / 45 / 10 odds wheel map art',
    keyCombo: '5',
    category: 'Games',
  },
  {
    id: 'game_odd_even',
    label: 'Select Odd or Even',
    description: 'Arm Odd or Even parity map art',
    keyCombo: '6',
    category: 'Games',
  },
  {
    id: 'clear_tracker',
    label: 'Clear Chat Tracker',
    description: 'Reset tracked chat payout session earnings',
    keyCombo: 'Shift+X',
    category: 'Tracker',
  },
];

const DEFAULT_CONFIG: ModConfig = {
  enabled: true,
  visualsOnlyBadge: true,
  playerIgn: 'Slazixot',
  activeGame: 'higher_lower',
  accentTheme: 'violet',
  hudPosition: 'top-right',
  hudOpacity: 78,
  glassBlur: 18,
  particleBurst: true,
  dispenserSoundCue: true,
  chatTrackerEnabled: true,
  customChatRegex: '',
  games: {
    paper: {
      outcome: 'win_gold',
      paperTitle: 'GOLD WINNER',
      paperColor: '#a78bfa',
      enchantedGlint: true,
      showWinnerMapArt: true,
    },
    higher_lower: {
      forceWinner: 'me',
      myNumber: 98,
      opponentNumber: 17,
      opponentName: 'xRival',
      mapArtStyle: 'royal_gold',
      showComparisonBadge: true,
    },
    armor: {
      tier: 'netherite',
      piece: 'chestplate',
      enchantedGlint: true,
      customName: 'Slazixot Victory Plate',
      showMapArtCard: true,
    },
    roulette: {
      outcome: 'safe_blank',
      chamberSlot: 3,
      revealInMapArt: true,
      customBanner: 'SAFE • BLANK',
    },
    odds_45_45_10: {
      forcedSlice: '45_player',
      playerLabel: 'Winner Side',
      opponentLabel: 'House / Rival',
      jackpotMultiplier: '10x',
    },
    odd_even: {
      forcedParity: 'even',
      forcedNumber: 88,
      mapArtBanner: 'EVEN WINNER',
    },
  },
  hotkeys: DEFAULT_HOTKEYS,
};

const INITIAL_PAYOUTS: PayoutEntry[] = [
  {
    id: 'seed-1',
    sender: 'Vexx',
    amount: 250000,
    rawMessage: '[Pay] Vexx paid you $250,000 (Higher or Lower)',
    gameTag: 'higher_lower',
    timestamp: Date.now() - 180000,
  },
  {
    id: 'seed-2',
    sender: 'Kairo',
    amount: 100000,
    rawMessage: 'You received $100,000 from Kairo (Paper Game)',
    gameTag: 'paper',
    timestamp: Date.now() - 420000,
  },
];

type StudioTab = 'games' | 'hotkeys' | 'tracker' | 'appearance';

export function App() {
  const [config, setConfig] = useState<ModConfig>(() => {
    try {
      const saved = localStorage.getItem('slazixot_visuals_config_v1');
      if (saved) return { ...DEFAULT_CONFIG, ...JSON.parse(saved) };
    } catch {
      // ignore storage errors
    }
    return DEFAULT_CONFIG;
  });

  const [payouts, setPayouts] = useState<PayoutEntry[]>(() => {
    try {
      const saved = localStorage.getItem('slazixot_visuals_payouts_v1');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore storage errors
    }
    return INITIAL_PAYOUTS;
  });

  const [activeTab, setActiveTab] = useState<StudioTab>('games');
  const [triggerCount, setTriggerCount] = useState<number>(1);
  const [menuCollapsed, setMenuCollapsed] = useState<boolean>(false);
  const [lastHotkeyId, setLastHotkeyId] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('slazixot_visuals_config_v1', JSON.stringify(config));
    } catch {
      // ignore
    }
  }, [config]);

  useEffect(() => {
    try {
      localStorage.setItem('slazixot_visuals_payouts_v1', JSON.stringify(payouts));
    } catch {
      // ignore
    }
  }, [payouts]);

  const showToast = useCallback((msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg((curr) => (curr === msg ? null : curr));
    }, 2200);
  }, []);

  const triggerDispenser = useCallback(() => {
    setTriggerCount((c) => c + 1);
  }, []);

  const injectChatLines = useCallback(
    (text: string): { added: number } => {
      if (!config.chatTrackerEnabled) return { added: 0 };
      const lines = text.split(/\r?\n/);
      const parsed: PayoutEntry[] = [];
      for (const line of lines) {
        const entry = parseChatLine(line, config.customChatRegex, config.activeGame);
        if (entry) parsed.push(entry);
      }
      if (parsed.length > 0) {
        setPayouts((prev) => [...parsed.reverse(), ...prev]);
        const sum = parsed.reduce((acc, p) => acc + p.amount, 0);
        showToast(`Chat Paid: +${formatMoney(sum)}`);
      }
      return { added: parsed.length };
    },
    [config.chatTrackerEnabled, config.customChatRegex, config.activeGame, showToast]
  );

  // Live Hotkey Listener
  useEffect(() => {
    const handleGlobalKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        return;
      }

      const pressed = formatKeyEvent(e);
      if (!pressed) return;

      const matched = config.hotkeys.find(
        (hk) => hk.keyCombo.toLowerCase() === pressed.toLowerCase()
      );
      if (!matched) return;

      e.preventDefault();
      setLastHotkeyId(matched.id);
      setTimeout(() => setLastHotkeyId(null), 1100);

      switch (matched.id) {
        case 'open_menu':
          setMenuCollapsed((m) => !m);
          showToast(`Hotkey [${matched.keyCombo}]: Toggled Mod Menu`);
          break;
        case 'toggle_mod':
          setConfig((prev) => {
            const next = !prev.enabled;
            showToast(
              `Hotkey [${matched.keyCombo}]: Visuals ${next ? 'ARMED' : 'BYPASSED'}`
            );
            return { ...prev, enabled: next };
          });
          break;
        case 'trigger_dispenser':
          triggerDispenser();
          showToast(`Hotkey [${matched.keyCombo}]: Dispenser Visual Fired`);
          break;
        case 'cycle_game': {
          const idx = GAME_LIST.findIndex((g) => g.id === config.activeGame);
          const nextGame = GAME_LIST[(idx + 1) % GAME_LIST.length];
          setConfig((prev) => ({ ...prev, activeGame: nextGame.id }));
          triggerDispenser();
          showToast(`Hotkey [${matched.keyCombo}]: Switched to ${nextGame.name}`);
          break;
        }
        case 'game_higher_lower':
          setConfig((prev) => ({ ...prev, activeGame: 'higher_lower' }));
          triggerDispenser();
          showToast('Armed: Higher or Lower');
          break;
        case 'game_paper':
          setConfig((prev) => ({ ...prev, activeGame: 'paper' }));
          triggerDispenser();
          showToast('Armed: Paper Game');
          break;
        case 'game_armor':
          setConfig((prev) => ({ ...prev, activeGame: 'armor' }));
          triggerDispenser();
          showToast('Armed: Armor Game');
          break;
        case 'game_roulette':
          setConfig((prev) => ({ ...prev, activeGame: 'roulette' }));
          triggerDispenser();
          showToast('Armed: Russian Roulette');
          break;
        case 'game_454510':
          setConfig((prev) => ({ ...prev, activeGame: 'odds_45_45_10' }));
          triggerDispenser();
          showToast('Armed: 45 / 45 / 10');
          break;
        case 'game_odd_even':
          setConfig((prev) => ({ ...prev, activeGame: 'odd_even' }));
          triggerDispenser();
          showToast('Armed: Odd or Even');
          break;
        case 'clear_tracker':
          setPayouts([]);
          showToast('Cleared Chat Payout Tracker');
          break;
      }
    };

    window.addEventListener('keydown', handleGlobalKey);
    return () => window.removeEventListener('keydown', handleGlobalKey);
  }, [config.hotkeys, config.activeGame, showToast, triggerDispenser]);

  const sessionTotal = payouts.reduce((acc, p) => acc + p.amount, 0);

  return (
    <div className="min-h-screen relative overflow-hidden pb-16">
      {/* Curved Ambient Background Orbs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <div className="absolute -top-40 -left-32 w-[520px] h-[520px] rounded-full bg-violet-600/20 blur-[120px]" />
        <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] rounded-full bg-cyan-500/15 blur-[120px]" />
        <div className="absolute -bottom-44 left-1/3 w-[540px] h-[540px] rounded-full bg-fuchsia-600/15 blur-[130px]" />
      </div>

      {/* Live Hotkey Toast */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-full glass-panel border border-violet-400/40 text-xs font-bold text-white flex items-center gap-2 shadow-2xl animate-dispense">
          <Sparkles className="w-4 h-4 text-cyan-300" />
          {toastMsg}
        </div>
      )}

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {/* Top Floating Pill Header */}
        <header className="glass-panel rounded-full px-5 sm:px-7 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-violet-500 via-fuchsia-500 to-cyan-400 flex items-center justify-center shadow-[0_0_25px_rgba(139,92,246,0.65)]">
              <Crown className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="font-display text-lg sm:text-xl font-extrabold tracking-tight text-white">
                  Slazixot Visuals
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-violet-500/25 to-cyan-500/25 border border-violet-400/40 text-[10px] font-bold tracking-wide text-violet-200">
                  made by slazixot ™
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Client-Side Only Dispenser & Map-Art Visual Mod Studio
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Live Chat Payout Pill */}
            <button
              onClick={() => {
                setMenuCollapsed(false);
                setActiveTab('tracker');
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-400/35 text-xs font-bold text-emerald-200 cursor-pointer transition-all"
            >
              <DollarSign className="w-3.5 h-3.5 text-emerald-300" />
              Chat Paid: {formatMoney(sessionTotal)}
            </button>

            <button
              onClick={() => setMenuCollapsed((c) => !c)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 text-xs font-bold text-white cursor-pointer transition-all"
            >
              <PanelTop className="w-3.5 h-3.5 text-cyan-300" />
              {menuCollapsed ? 'Open Menu' : 'HUD Only'}
            </button>
          </div>
        </header>

        {/* Dispenser Visual Stage (Always Visible) */}
        <DispenserStage
          config={config}
          triggerCount={triggerCount}
          sessionTotal={sessionTotal}
          onTriggerDispenser={triggerDispenser}
          onToggleEnabled={() =>
            setConfig((prev) => ({ ...prev, enabled: !prev.enabled }))
          }
          onSelectGame={(game: GameModeId) => {
            setConfig((prev) => ({ ...prev, activeGame: game }));
            triggerDispenser();
          }}
        />

        {/* Sleek Pill Tab Navigation + Active Menu Section */}
        {!menuCollapsed && (
          <>
            <nav className="flex flex-wrap items-center justify-center gap-2.5">
              {(
                [
                  {
                    id: 'games',
                    label: 'Games & Map Art',
                    icon: <Gamepad2 className="w-4 h-4" />,
                  },
                  {
                    id: 'hotkeys',
                    label: 'Hotkeys',
                    icon: <Keyboard className="w-4 h-4" />,
                  },
                  {
                    id: 'tracker',
                    label: `Chat Money Tracker (${payouts.length})`,
                    icon: <DollarSign className="w-4 h-4" />,
                  },
                  {
                    id: 'appearance',
                    label: 'HUD Style & Export Mod',
                    icon: <Palette className="w-4 h-4" />,
                  },
                ] as const
              ).map((tab) => {
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer border ${
                      active
                        ? 'bg-gradient-to-r from-violet-500/30 via-fuchsia-500/20 to-cyan-500/30 border-violet-400/60 text-white shadow-[0_8px_28px_-6px_rgba(139,92,246,0.55)]'
                        : 'glass-pill text-slate-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                );
              })}
            </nav>

            <main>
              {activeTab === 'games' && (
                <GameCustomizer
                  config={config}
                  onChange={setConfig}
                  onTestDispense={triggerDispenser}
                />
              )}

              {activeTab === 'hotkeys' && (
                <HotkeyManager
                  hotkeys={config.hotkeys}
                  lastTriggeredId={lastHotkeyId}
                  onUpdateHotkey={(id, keyCombo) =>
                    setConfig((prev) => ({
                      ...prev,
                      hotkeys: prev.hotkeys.map((h) =>
                        h.id === id ? { ...h, keyCombo } : h
                      ),
                    }))
                  }
                  onResetHotkeys={() =>
                    setConfig((prev) => ({ ...prev, hotkeys: DEFAULT_HOTKEYS }))
                  }
                />
              )}

              {activeTab === 'tracker' && (
                <ChatMoneyTracker
                  config={config}
                  payouts={payouts}
                  onInjectChatLines={injectChatLines}
                  onClearPayouts={() => setPayouts([])}
                  onUpdateRegex={(regex) =>
                    setConfig((prev) => ({ ...prev, customChatRegex: regex }))
                  }
                  onToggleTracker={(enabled) =>
                    setConfig((prev) => ({ ...prev, chatTrackerEnabled: enabled }))
                  }
                />
              )}

              {activeTab === 'appearance' && (
                <AppearanceAndExport config={config} onChange={setConfig} />
              )}
            </main>
          </>
        )}

        {/* Footer Trademark */}
        <footer className="pt-4 text-center">
          <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full glass-pill text-xs text-slate-400">
            <span className="w-2 h-2 rounded-full bg-violet-400" />
            <span>
              Client-Side Visuals Only •{' '}
              <strong className="text-white tracking-wide">made by slazixot ™</strong>
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
