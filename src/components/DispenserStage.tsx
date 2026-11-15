import React from 'react';
import {
  Eye,
  Sparkles,
  Zap,
  Radio,
  ShieldCheck,
  RotateCw,
} from 'lucide-react';
import { GAME_LIST, ModConfig, GameModeId } from '../types/mod';
import { MapArtPreview } from './MapArtPreview';
import { formatMoney } from '../utils/chatParser';

interface DispenserStageProps {
  config: ModConfig;
  triggerCount: number;
  sessionTotal: number;
  onTriggerDispenser: () => void;
  onToggleEnabled: () => void;
  onSelectGame: (game: GameModeId) => void;
}

const ACCENT_GLOWS = {
  violet: 'from-violet-600/30 via-fuchsia-500/15 to-cyan-500/20',
  emerald: 'from-emerald-600/30 via-teal-500/15 to-cyan-500/20',
  cyan: 'from-cyan-600/30 via-sky-500/15 to-indigo-500/20',
  amber: 'from-amber-600/30 via-orange-500/15 to-rose-500/20',
  rose: 'from-rose-600/30 via-pink-500/15 to-violet-500/20',
};

export const DispenserStage: React.FC<DispenserStageProps> = ({
  config,
  triggerCount,
  sessionTotal,
  onTriggerDispenser,
  onToggleEnabled,
  onSelectGame,
}) => {
  const triggerHotkey =
    config.hotkeys.find((h) => h.id === 'trigger_dispenser')?.keyCombo || 'Space';
  const toggleHotkey =
    config.hotkeys.find((h) => h.id === 'toggle_mod')?.keyCombo || 'F6';

  const hudPositionClasses: Record<string, string> = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4',
  };

  const activeMeta = GAME_LIST.find((g) => g.id === config.activeGame)!;

  return (
    <div className="glass-panel rounded-[2.25rem] p-5 sm:p-7 relative overflow-hidden">
      {/* Ambient curved radial gradient backdrop */}
      <div
        className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${
          ACCENT_GLOWS[config.accentTheme]
        } opacity-70`}
      />

      {/* Top Status Bar */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-semibold text-white">
            <Eye className="w-3.5 h-3.5 text-cyan-300" />
            Client-Side Visuals Only
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-xs font-semibold text-emerald-300">
            <ShieldCheck className="w-3.5 h-3.5" />
            No Server Packets
          </span>
        </div>

        <button
          onClick={onToggleEnabled}
          className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer border ${
            config.enabled
              ? 'bg-emerald-500/20 border-emerald-400/50 text-emerald-200 shadow-[0_0_20px_rgba(16,185,129,0.28)]'
              : 'bg-rose-500/15 border-rose-400/40 text-rose-200'
          }`}
        >
          <Radio className={`w-3.5 h-3.5 ${config.enabled ? 'animate-pulse' : ''}`} />
          {config.enabled ? 'Visual Override: ARMED' : 'Visual Override: BYPASSED'}
          <span className="font-mono-code text-[10px] opacity-75 px-1.5 py-0.5 rounded-full bg-black/30">
            {toggleHotkey}
          </span>
        </button>
      </div>

      {/* Quick Game Switcher Pills */}
      <div className="relative z-10 flex flex-wrap gap-2 mb-6">
        {GAME_LIST.map((game) => {
          const active = config.activeGame === game.id;
          return (
            <button
              key={game.id}
              onClick={() => onSelectGame(game.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer border ${
                active
                  ? 'bg-white text-slate-950 border-white shadow-[0_6px_22px_rgba(255,255,255,0.25)] scale-[1.02]'
                  : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10 hover:text-white'
              }`}
            >
              {game.name}
            </button>
          );
        })}
      </div>

      {/* Main Interactive Dispenser & Map Art Viewport */}
      <div className="relative z-10 rounded-[2rem] bg-[#070913]/85 border border-white/10 min-h-[390px] sm:min-h-[420px] p-6 flex flex-col lg:flex-row items-center justify-around gap-8 overflow-hidden">
        {/* Soft grid curves in background */}
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.18) 1px, transparent 0)',
            backgroundSize: '26px 26px',
          }}
        />

        {/* Floating In-Game HUD Preview */}
        <div
          className={`hidden sm:flex absolute ${hudPositionClasses[config.hudPosition]} z-20 items-center gap-3 px-4 py-2 rounded-full border border-white/15 shadow-xl transition-all`}
          style={{
            backgroundColor: `rgba(10, 14, 28, ${config.hudOpacity / 100})`,
            backdropFilter: `blur(${config.glassBlur}px)`,
          }}
        >
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399]" />
          <div className="text-[11px] leading-tight">
            <div className="font-bold text-white flex items-center gap-1.5">
              <span>Slazixot HUD</span>
              <span className="text-white/35">•</span>
              <span className="text-violet-300">{activeMeta.shortName}</span>
            </div>
            <div className="text-[10px] text-slate-400">
              Chat Paid: <span className="text-emerald-300 font-semibold">{formatMoney(sessionTotal)}</span>
              <span className="mx-1.5 text-white/25">|</span>
              <span className="italic text-white/55">made by slazixot</span>
            </div>
          </div>
        </div>

        {/* Left Side: Sleek Futuristic Dispenser Nozzle */}
        <div className="relative z-10 flex flex-col items-center text-center max-w-xs">
          <div className="relative mb-4">
            {config.particleBurst && config.enabled && (
              <div className="absolute -inset-4 rounded-full bg-violet-500/20 animate-pulse-ring pointer-events-none" />
            )}
            <div className="w-36 h-36 rounded-[2.2rem] bg-gradient-to-b from-slate-700/60 via-slate-800/80 to-slate-950 border-2 border-white/15 shadow-2xl flex flex-col items-center justify-center relative overflow-hidden">
              <div className="absolute inset-x-4 top-2 h-1 rounded-full bg-white/15" />
              {/* Sleek rounded aperture */}
              <div className="w-16 h-16 rounded-full bg-[#05070e] border-4 border-slate-600/60 shadow-inner flex items-center justify-center relative">
                <div
                  className={`w-7 h-7 rounded-full transition-all ${
                    config.enabled
                      ? 'bg-gradient-to-tr from-violet-500 to-cyan-400 shadow-[0_0_24px_rgba(139,92,246,0.9)]'
                      : 'bg-slate-800'
                  }`}
                />
              </div>
              <span className="mt-2 text-[10px] font-mono-code uppercase tracking-widest text-slate-400">
                Dispenser Core
              </span>
            </div>
          </div>

          <h3 className="font-display text-lg font-bold text-white mb-1">
            {activeMeta.name}
          </h3>
          <p className="text-xs text-slate-400 mb-4 leading-relaxed">
            {activeMeta.tagline}
          </p>

          <button
            onClick={onTriggerDispenser}
            className="group inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-500 text-white font-bold text-sm shadow-[0_10px_30px_-6px_rgba(139,92,246,0.65)] hover:shadow-[0_14px_35px_-4px_rgba(34,211,238,0.65)] hover:scale-[1.03] active:scale-[0.98] transition-all cursor-pointer"
          >
            <Zap className="w-4 h-4 fill-white" />
            Dispense Visual
            <span className="font-mono-code text-[11px] px-2 py-0.5 rounded-full bg-black/25 border border-white/20">
              {triggerHotkey}
            </span>
          </button>
        </div>

        {/* Right Side: Ejected Map Art / Visual Outcome */}
        <div className="relative z-10 flex flex-col items-center">
          <div key={triggerCount} className="animate-dispense">
            {config.enabled ? (
              <div className="animate-float-slow">
                <MapArtPreview config={config} />
              </div>
            ) : (
              <div className="w-64 h-64 sm:w-72 sm:h-72 rounded-[2rem] border-2 border-dashed border-white/15 bg-white/[0.02] flex flex-col items-center justify-center p-6 text-center">
                <RotateCw className="w-10 h-10 text-slate-500 mb-3" />
                <p className="text-sm font-semibold text-slate-300">
                  Visual Override Bypassed
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Showing unmodified server dispenser item. Press{' '}
                  <span className="font-mono-code text-slate-300">{toggleHotkey}</span> to re-arm.
                </p>
              </div>
            )}
          </div>

          <div className="mt-4 flex items-center gap-2 text-[11px] text-slate-400">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>
              Dispense #{triggerCount} • Visuals rendered locally for{' '}
              <strong className="text-white">{config.playerIgn || 'Slazixot'}</strong>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
