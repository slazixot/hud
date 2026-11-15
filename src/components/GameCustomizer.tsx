import React from 'react';
import {
  Crown,
  FileText,
  Shield,
  Crosshair,
  PieChart,
  Hash,
  Sparkles,
  User,
} from 'lucide-react';
import { GAME_LIST, GameModeId, ModConfig } from '../types/mod';

interface GameCustomizerProps {
  config: ModConfig;
  onChange: (updater: (prev: ModConfig) => ModConfig) => void;
  onTestDispense: () => void;
}

const GAME_ICONS: Record<GameModeId, React.ReactNode> = {
  higher_lower: <Crown className="w-4 h-4" />,
  paper: <FileText className="w-4 h-4" />,
  armor: <Shield className="w-4 h-4" />,
  roulette: <Crosshair className="w-4 h-4" />,
  odds_45_45_10: <PieChart className="w-4 h-4" />,
  odd_even: <Hash className="w-4 h-4" />,
};

export const GameCustomizer: React.FC<GameCustomizerProps> = ({
  config,
  onChange,
  onTestDispense,
}) => {
  const { activeGame, games } = config;

  const setActiveGame = (id: GameModeId) =>
    onChange((prev) => ({ ...prev, activeGame: id }));

  return (
    <div className="glass-panel rounded-[2.25rem] p-5 sm:p-7">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="font-display text-xl font-bold text-white">
            Dispenser Outcome Customizer
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Choose exactly what visually pops out of the dispenser for each minigame.
          </p>
        </div>

        {/* Player IGN Input */}
        <div className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/5 border border-white/10">
          <User className="w-3.5 h-3.5 text-violet-300" />
          <span className="text-[11px] text-slate-400 font-medium">Your IGN:</span>
          <input
            type="text"
            value={config.playerIgn}
            maxLength={16}
            onChange={(e) =>
              onChange((prev) => ({ ...prev, playerIgn: e.target.value }))
            }
            placeholder="Slazixot"
            className="bg-transparent text-xs font-bold text-white focus:outline-none w-28"
          />
        </div>
      </div>

      {/* Rounded Selector Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 mb-6">
        {GAME_LIST.map((g) => {
          const active = g.id === activeGame;
          return (
            <button
              key={g.id}
              onClick={() => setActiveGame(g.id)}
              className={`rounded-3xl p-3 text-left transition-all cursor-pointer border flex flex-col gap-1.5 ${
                active
                  ? 'bg-gradient-to-br from-violet-500/25 to-cyan-500/20 border-violet-400/50 text-white shadow-[0_8px_25px_-8px_rgba(139,92,246,0.55)]'
                  : 'bg-white/[0.03] border-white/10 text-slate-400 hover:bg-white/[0.07] hover:text-slate-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={active ? 'text-violet-300' : 'text-slate-400'}>
                  {GAME_ICONS[g.id]}
                </span>
                <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/10">
                  {g.shortName}
                </span>
              </div>
              <div className="text-xs font-bold truncate">{g.name}</div>
            </button>
          );
        })}
      </div>

      {/* Active Game Config Controls */}
      <div className="rounded-[1.75rem] bg-[#080b16]/75 border border-white/10 p-5 space-y-5">
        {activeGame === 'higher_lower' && (
          <>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Crown className="w-4 h-4 text-amber-400" />
                  Higher or Lower — Winner Map Art
                </h3>
                <p className="text-xs text-slate-400">
                  Dispenser spawns a map art showing the higher number winner.
                </p>
              </div>
              <div className="flex gap-2">
                {(
                  [
                    { id: 'me', label: 'Force Me Winner' },
                    { id: 'opponent', label: 'Opponent Winner' },
                  ] as const
                ).map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() =>
                      onChange((prev) => ({
                        ...prev,
                        games: {
                          ...prev.games,
                          higher_lower: {
                            ...prev.games.higher_lower,
                            forceWinner: opt.id,
                          },
                        },
                      }))
                    }
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold cursor-pointer border transition-all ${
                      games.higher_lower.forceWinner === opt.id
                        ? 'bg-emerald-500/20 border-emerald-400/50 text-emerald-200'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-4">
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-slate-300 font-semibold">Your Number</span>
                  <span className="font-mono-code font-bold text-amber-300">
                    {games.higher_lower.myNumber}
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={100}
                  value={games.higher_lower.myNumber}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    onChange((prev) => ({
                      ...prev,
                      games: {
                        ...prev.games,
                        higher_lower: { ...prev.games.higher_lower, myNumber: val },
                      },
                    }));
                  }}
                  className="w-full accent-amber-400 cursor-pointer"
                />
              </div>

              <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-4">
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-slate-300 font-semibold">Opponent Number</span>
                  <span className="font-mono-code font-bold text-rose-300">
                    {games.higher_lower.opponentNumber}
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={100}
                  value={games.higher_lower.opponentNumber}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    onChange((prev) => ({
                      ...prev,
                      games: {
                        ...prev.games,
                        higher_lower: {
                          ...prev.games.higher_lower,
                          opponentNumber: val,
                        },
                      },
                    }));
                  }}
                  className="w-full accent-rose-400 cursor-pointer"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1.5">
                  Opponent Name
                </label>
                <input
                  type="text"
                  value={games.higher_lower.opponentName}
                  onChange={(e) =>
                    onChange((prev) => ({
                      ...prev,
                      games: {
                        ...prev.games,
                        higher_lower: {
                          ...prev.games.higher_lower,
                          opponentName: e.target.value,
                        },
                      },
                    }))
                  }
                  className="w-full px-3.5 py-2 rounded-full bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-violet-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1.5">
                  Map Art Theme
                </label>
                <div className="flex gap-1.5">
                  {(
                    [
                      { id: 'royal_gold', label: 'Gold' },
                      { id: 'cyber_neon', label: 'Cyber' },
                      { id: 'obsidian_crown', label: 'Obsidian' },
                    ] as const
                  ).map((st) => (
                    <button
                      key={st.id}
                      onClick={() =>
                        onChange((prev) => ({
                          ...prev,
                          games: {
                            ...prev.games,
                            higher_lower: {
                              ...prev.games.higher_lower,
                              mapArtStyle: st.id,
                            },
                          },
                        }))
                      }
                      className={`flex-1 py-2 rounded-full text-xs font-semibold cursor-pointer border ${
                        games.higher_lower.mapArtStyle === st.id
                          ? 'bg-violet-500/25 border-violet-400/50 text-white'
                          : 'bg-white/5 border-white/10 text-slate-400'
                      }`}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between rounded-full bg-white/5 border border-white/10 px-4 py-2 mt-4 sm:mt-5">
                <span className="text-xs text-slate-300">Show Opponent Score</span>
                <input
                  type="checkbox"
                  checked={games.higher_lower.showComparisonBadge}
                  onChange={(e) =>
                    onChange((prev) => ({
                      ...prev,
                      games: {
                        ...prev.games,
                        higher_lower: {
                          ...prev.games.higher_lower,
                          showComparisonBadge: e.target.checked,
                        },
                      },
                    }))
                  }
                  className="accent-violet-500 w-4 h-4 cursor-pointer"
                />
              </div>
            </div>
          </>
        )}

        {activeGame === 'paper' && (
          <>
            <div>
              <h3 className="text-sm font-bold text-white mb-1">
                Paper Game — Dispenser Paper Selector
              </h3>
              <p className="text-xs text-slate-400">
                Choose the exact visual paper & map art title ejected from the dispenser.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {(
                [
                  { id: 'win_gold', label: 'Gold Winning Paper' },
                  { id: 'win_emerald', label: 'Emerald Winning Paper' },
                  { id: 'lose_red', label: 'Red Lose Paper' },
                  { id: 'custom_label', label: 'Custom Colored Paper' },
                ] as const
              ).map((opt) => (
                <button
                  key={opt.id}
                  onClick={() =>
                    onChange((prev) => ({
                      ...prev,
                      games: {
                        ...prev.games,
                        paper: { ...prev.games.paper, outcome: opt.id },
                      },
                    }))
                  }
                  className={`px-4 py-2 rounded-full text-xs font-semibold cursor-pointer border transition-all ${
                    games.paper.outcome === opt.id
                      ? 'bg-violet-500/25 border-violet-400/50 text-white'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1.5">
                  Paper Item Title
                </label>
                <input
                  type="text"
                  value={games.paper.paperTitle}
                  onChange={(e) =>
                    onChange((prev) => ({
                      ...prev,
                      games: {
                        ...prev.games,
                        paper: { ...prev.games.paper, paperTitle: e.target.value },
                      },
                    }))
                  }
                  className="w-full px-3.5 py-2 rounded-full bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-violet-400"
                />
              </div>

              <div className="flex items-center justify-between rounded-full bg-white/5 border border-white/10 px-4 py-2 mt-4">
                <span className="text-xs text-slate-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-violet-300" />
                  Enchanted Glint
                </span>
                <input
                  type="checkbox"
                  checked={games.paper.enchantedGlint}
                  onChange={(e) =>
                    onChange((prev) => ({
                      ...prev,
                      games: {
                        ...prev.games,
                        paper: { ...prev.games.paper, enchantedGlint: e.target.checked },
                      },
                    }))
                  }
                  className="accent-violet-500 w-4 h-4 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between rounded-full bg-white/5 border border-white/10 px-4 py-2 mt-4">
                <span className="text-xs text-slate-300">Winner Tag</span>
                <input
                  type="checkbox"
                  checked={games.paper.showWinnerMapArt}
                  onChange={(e) =>
                    onChange((prev) => ({
                      ...prev,
                      games: {
                        ...prev.games,
                        paper: {
                          ...prev.games.paper,
                          showWinnerMapArt: e.target.checked,
                        },
                      },
                    }))
                  }
                  className="accent-emerald-500 w-4 h-4 cursor-pointer"
                />
              </div>
            </div>
          </>
        )}

        {activeGame === 'armor' && (
          <>
            <div>
              <h3 className="text-sm font-bold text-white mb-1">
                Armor Game — Tier & Piece Selector
              </h3>
              <p className="text-xs text-slate-400">
                Select which armor tier and piece visually dispenses on your client.
              </p>
            </div>

            <div>
              <span className="block text-[11px] font-semibold text-slate-400 mb-2">
                Armor Material Tier
              </span>
              <div className="flex flex-wrap gap-2">
                {(
                  ['netherite', 'diamond', 'iron', 'gold', 'chainmail', 'leather'] as const
                ).map((tier) => (
                  <button
                    key={tier}
                    onClick={() =>
                      onChange((prev) => ({
                        ...prev,
                        games: {
                          ...prev.games,
                          armor: { ...prev.games.armor, tier },
                        },
                      }))
                    }
                    className={`px-4 py-2 rounded-full text-xs font-bold capitalize cursor-pointer border transition-all ${
                      games.armor.tier === tier
                        ? 'bg-cyan-500/25 border-cyan-400/50 text-white'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    {tier}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="block text-[11px] font-semibold text-slate-400 mb-2">
                Armor Piece
              </span>
              <div className="flex flex-wrap gap-2">
                {(['helmet', 'chestplate', 'leggings', 'boots'] as const).map((piece) => (
                  <button
                    key={piece}
                    onClick={() =>
                      onChange((prev) => ({
                        ...prev,
                        games: {
                          ...prev.games,
                          armor: { ...prev.games.armor, piece },
                        },
                      }))
                    }
                    className={`px-4 py-2 rounded-full text-xs font-bold capitalize cursor-pointer border transition-all ${
                      games.armor.piece === piece
                        ? 'bg-violet-500/25 border-violet-400/50 text-white'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    {piece}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1.5">
                  Custom Item Display Name
                </label>
                <input
                  type="text"
                  value={games.armor.customName}
                  onChange={(e) =>
                    onChange((prev) => ({
                      ...prev,
                      games: {
                        ...prev.games,
                        armor: { ...prev.games.armor, customName: e.target.value },
                      },
                    }))
                  }
                  className="w-full px-3.5 py-2 rounded-full bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="flex items-center justify-between rounded-full bg-white/5 border border-white/10 px-4 py-2 mt-4">
                <span className="text-xs text-slate-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-fuchsia-300" />
                  Enchanted Purple Glint
                </span>
                <input
                  type="checkbox"
                  checked={games.armor.enchantedGlint}
                  onChange={(e) =>
                    onChange((prev) => ({
                      ...prev,
                      games: {
                        ...prev.games,
                        armor: { ...prev.games.armor, enchantedGlint: e.target.checked },
                      },
                    }))
                  }
                  className="accent-fuchsia-500 w-4 h-4 cursor-pointer"
                />
              </div>
            </div>
          </>
        )}

        {activeGame === 'roulette' && (
          <>
            <div>
              <h3 className="text-sm font-bold text-white mb-1">
                Russian Roulette — Cylinder Outcome
              </h3>
              <p className="text-xs text-slate-400">
                Choose the chamber slot and whether the dispenser shows a safe blank, golden win, or loaded shot.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {(
                [
                  { id: 'safe_blank', label: 'Safe Blank (Survive)' },
                  { id: 'golden_chamber', label: 'Golden Survivor' },
                  { id: 'loaded_shot', label: 'Loaded Chamber' },
                ] as const
              ).map((opt) => (
                <button
                  key={opt.id}
                  onClick={() =>
                    onChange((prev) => ({
                      ...prev,
                      games: {
                        ...prev.games,
                        roulette: { ...prev.games.roulette, outcome: opt.id },
                      },
                    }))
                  }
                  className={`px-4 py-2 rounded-full text-xs font-semibold cursor-pointer border ${
                    games.roulette.outcome === opt.id
                      ? 'bg-emerald-500/20 border-emerald-400/50 text-white'
                      : 'bg-white/5 border-white/10 text-slate-400'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
              <div>
                <span className="block text-[11px] font-semibold text-slate-400 mb-2">
                  Active Chamber (#1 – #6)
                </span>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5, 6].map((slot) => (
                    <button
                      key={slot}
                      onClick={() =>
                        onChange((prev) => ({
                          ...prev,
                          games: {
                            ...prev.games,
                            roulette: { ...prev.games.roulette, chamberSlot: slot },
                          },
                        }))
                      }
                      className={`w-9 h-9 rounded-full font-bold text-xs cursor-pointer border ${
                        games.roulette.chamberSlot === slot
                          ? 'bg-white text-slate-950 border-white'
                          : 'bg-white/5 border-white/10 text-slate-400'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1.5">
                  Map Art Banner Text
                </label>
                <input
                  type="text"
                  value={games.roulette.customBanner}
                  onChange={(e) =>
                    onChange((prev) => ({
                      ...prev,
                      games: {
                        ...prev.games,
                        roulette: {
                          ...prev.games.roulette,
                          customBanner: e.target.value,
                        },
                      },
                    }))
                  }
                  className="w-full px-3.5 py-2 rounded-full bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-emerald-400"
                />
              </div>
            </div>
          </>
        )}

        {activeGame === 'odds_45_45_10' && (
          <>
            <div>
              <h3 className="text-sm font-bold text-white mb-1">
                45 / 45 / 10 — Forced Wheel Slice
              </h3>
              <p className="text-xs text-slate-400">
                Lock the dispenser map art to Player 45%, Opponent 45%, or the 10% Jackpot slice.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {(
                [
                  { id: '45_player', label: '45% Your Win' },
                  { id: '10_jackpot', label: '10% Jackpot Hit' },
                  { id: '45_opponent', label: '45% Opponent' },
                ] as const
              ).map((opt) => (
                <button
                  key={opt.id}
                  onClick={() =>
                    onChange((prev) => ({
                      ...prev,
                      games: {
                        ...prev.games,
                        odds_45_45_10: {
                          ...prev.games.odds_45_45_10,
                          forcedSlice: opt.id,
                        },
                      },
                    }))
                  }
                  className={`px-4 py-2 rounded-full text-xs font-semibold cursor-pointer border ${
                    games.odds_45_45_10.forcedSlice === opt.id
                      ? 'bg-violet-500/25 border-violet-400/50 text-white'
                      : 'bg-white/5 border-white/10 text-slate-400'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1.5">
                  Your Slice Label
                </label>
                <input
                  type="text"
                  value={games.odds_45_45_10.playerLabel}
                  onChange={(e) =>
                    onChange((prev) => ({
                      ...prev,
                      games: {
                        ...prev.games,
                        odds_45_45_10: {
                          ...prev.games.odds_45_45_10,
                          playerLabel: e.target.value,
                        },
                      },
                    }))
                  }
                  className="w-full px-3.5 py-2 rounded-full bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-violet-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1.5">
                  Opponent Label
                </label>
                <input
                  type="text"
                  value={games.odds_45_45_10.opponentLabel}
                  onChange={(e) =>
                    onChange((prev) => ({
                      ...prev,
                      games: {
                        ...prev.games,
                        odds_45_45_10: {
                          ...prev.games.odds_45_45_10,
                          opponentLabel: e.target.value,
                        },
                      },
                    }))
                  }
                  className="w-full px-3.5 py-2 rounded-full bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-violet-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1.5">
                  10% Jackpot Multiplier
                </label>
                <input
                  type="text"
                  value={games.odds_45_45_10.jackpotMultiplier}
                  onChange={(e) =>
                    onChange((prev) => ({
                      ...prev,
                      games: {
                        ...prev.games,
                        odds_45_45_10: {
                          ...prev.games.odds_45_45_10,
                          jackpotMultiplier: e.target.value,
                        },
                      },
                    }))
                  }
                  className="w-full px-3.5 py-2 rounded-full bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
          </>
        )}

        {activeGame === 'odd_even' && (
          <>
            <div>
              <h3 className="text-sm font-bold text-white mb-1">
                Odd or Even — Parity & Number Lock
              </h3>
              <p className="text-xs text-slate-400">
                Force the dispensed map art to show your exact Odd or Even number.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {(['even', 'odd'] as const).map((parity) => (
                <button
                  key={parity}
                  onClick={() =>
                    onChange((prev) => ({
                      ...prev,
                      games: {
                        ...prev.games,
                        odd_even: {
                          ...prev.games.odd_even,
                          forcedParity: parity,
                        },
                      },
                    }))
                  }
                  className={`px-5 py-2 rounded-full text-xs font-bold uppercase cursor-pointer border ${
                    games.odd_even.forcedParity === parity
                      ? 'bg-cyan-500/25 border-cyan-400/50 text-white'
                      : 'bg-white/5 border-white/10 text-slate-400'
                  }`}
                >
                  Force {parity}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
              <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-4">
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-slate-300 font-semibold">Target Number</span>
                  <span className="font-mono-code font-bold text-cyan-300">
                    {games.odd_even.forcedNumber}
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={100}
                  value={games.odd_even.forcedNumber}
                  onChange={(e) => {
                    const num = Number(e.target.value);
                    onChange((prev) => ({
                      ...prev,
                      games: {
                        ...prev.games,
                        odd_even: { ...prev.games.odd_even, forcedNumber: num },
                      },
                    }));
                  }}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1.5">
                  Map Art Banner Label
                </label>
                <input
                  type="text"
                  value={games.odd_even.mapArtBanner}
                  onChange={(e) =>
                    onChange((prev) => ({
                      ...prev,
                      games: {
                        ...prev.games,
                        odd_even: {
                          ...prev.games.odd_even,
                          mapArtBanner: e.target.value,
                        },
                      },
                    }))
                  }
                  className="w-full px-3.5 py-2 rounded-full bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>
          </>
        )}

        <div className="pt-2 flex justify-end">
          <button
            onClick={onTestDispense}
            className="px-5 py-2 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 text-xs font-bold text-white cursor-pointer transition-all"
          >
            Apply & Fire Dispenser Visual →
          </button>
        </div>
      </div>
    </div>
  );
};
