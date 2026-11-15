import React from 'react';
import { Crown, Shield, Sparkles, Trophy, Flame, CheckCircle2, Skull } from 'lucide-react';
import { ModConfig } from '../types/mod';

interface MapArtPreviewProps {
  config: ModConfig;
  compact?: boolean;
}

const ARMOR_COLORS: Record<string, { primary: string; secondary: string; glow: string; label: string }> = {
  netherite: {
    primary: '#4b4453',
    secondary: '#7a6f85',
    glow: 'rgba(168, 85, 247, 0.45)',
    label: 'Netherite',
  },
  diamond: {
    primary: '#22d3ee',
    secondary: '#67e8f9',
    glow: 'rgba(34, 211, 238, 0.45)',
    label: 'Diamond',
  },
  iron: {
    primary: '#cbd5e1',
    secondary: '#f1f5f9',
    glow: 'rgba(203, 213, 225, 0.35)',
    label: 'Iron',
  },
  gold: {
    primary: '#facc15',
    secondary: '#fef08a',
    glow: 'rgba(250, 204, 21, 0.45)',
    label: 'Gold',
  },
  chainmail: {
    primary: '#94a3b8',
    secondary: '#cbd5e1',
    glow: 'rgba(148, 163, 184, 0.35)',
    label: 'Chainmail',
  },
  leather: {
    primary: '#b45309',
    secondary: '#d97706',
    glow: 'rgba(217, 119, 6, 0.35)',
    label: 'Leather',
  },
};

export const MapArtPreview: React.FC<MapArtPreviewProps> = ({ config, compact = false }) => {
  const { activeGame, playerIgn, games } = config;
  const sizeClass = compact ? 'w-48 h-48' : 'w-64 h-64 sm:w-72 sm:h-72';

  // 1. HIGHER OR LOWER MAP ART
  if (activeGame === 'higher_lower') {
    const hl = games.higher_lower;
    const iWin = hl.forceWinner === 'me';
    const winnerName = iWin ? playerIgn || 'Slazixot' : hl.opponentName || 'Opponent';
    const winnerNum = iWin
      ? Math.max(hl.myNumber, hl.opponentNumber)
      : Math.max(hl.myNumber, hl.opponentNumber);
    const loserName = iWin ? hl.opponentName || 'Opponent' : playerIgn || 'Slazixot';
    const loserNum = Math.min(hl.myNumber, hl.opponentNumber);

    const styleThemes = {
      royal_gold: {
        bg: 'from-amber-950/90 via-[#1a132b] to-indigo-950/90',
        border: 'border-amber-400/50',
        numGrad: 'from-amber-200 via-yellow-400 to-orange-400',
        badge: 'bg-amber-400/20 text-amber-200 border-amber-400/40',
      },
      cyber_neon: {
        bg: 'from-cyan-950/90 via-[#0d142b] to-violet-950/90',
        border: 'border-cyan-400/50',
        numGrad: 'from-cyan-200 via-sky-300 to-violet-400',
        badge: 'bg-cyan-400/20 text-cyan-200 border-cyan-400/40',
      },
      obsidian_crown: {
        bg: 'from-fuchsia-950/85 via-[#100d1c] to-slate-950/95',
        border: 'border-fuchsia-400/50',
        numGrad: 'from-fuchsia-200 via-violet-300 to-pink-400',
        badge: 'bg-fuchsia-400/20 text-fuchsia-200 border-fuchsia-400/40',
      },
    };
    const theme = styleThemes[hl.mapArtStyle];

    return (
      <div
        className={`relative ${sizeClass} rounded-[2rem] bg-gradient-to-br ${theme.bg} border-2 ${theme.border} p-4 flex flex-col justify-between overflow-hidden shadow-2xl`}
      >
        {/* Subtle curved light flare */}
        <div className="pointer-events-none absolute -top-12 -right-12 w-36 h-36 rounded-full bg-amber-400/20 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-10 -left-10 w-36 h-36 rounded-full bg-violet-500/20 blur-2xl" />
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[2rem]">
          <div className="w-1/2 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
        </div>

        {/* Top Map Art Header */}
        <div className="relative z-10 flex items-center justify-between gap-2">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${theme.badge}`}>
            <Crown className="w-3 h-3" />
            Map Art • Hi/Lo
          </span>
          <span className="text-[10px] font-mono-code text-emerald-300 bg-emerald-500/15 border border-emerald-400/30 px-2 py-0.5 rounded-full">
            HIGHER WINS
          </span>
        </div>

        {/* Center Winner Display */}
        <div className="relative z-10 flex flex-col items-center text-center my-auto py-1">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 mb-0.5">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span className="truncate max-w-[140px]">{winnerName}</span>
          </div>
          <div
            className={`font-display font-extrabold leading-none tracking-tight bg-gradient-to-b ${theme.numGrad} bg-clip-text text-transparent drop-shadow-[0_4px_20px_rgba(251,191,36,0.35)] ${
              compact ? 'text-5xl' : 'text-6xl'
            }`}
          >
            {winnerNum}
          </div>
          <div className="mt-1.5 px-3 py-0.5 rounded-full bg-gradient-to-r from-emerald-500/25 to-teal-500/25 border border-emerald-400/40 text-[11px] font-bold text-emerald-200 tracking-wide">
            ★ WINNER ★
          </div>
        </div>

        {/* Bottom Comparison Strip */}
        <div className="relative z-10 flex items-center justify-between pt-2 border-t border-white/10 text-[10px]">
          {hl.showComparisonBadge ? (
            <span className="text-slate-400 truncate max-w-[125px]">
              vs {loserName}: <strong className="text-rose-300">{loserNum}</strong>
            </span>
          ) : (
            <span className="text-slate-400">Client Map Art</span>
          )}
          <span className="font-mono-code text-[9px] text-white/45">slazixot™</span>
        </div>
      </div>
    );
  }

  // 2. PAPER GAME
  if (activeGame === 'paper') {
    const p = games.paper;
    const outcomeMap = {
      win_gold: { bg: 'from-amber-400/25 via-yellow-500/15 to-amber-900/40', accent: '#fbbf24', tag: 'GOLD WIN PAPER' },
      win_emerald: { bg: 'from-emerald-400/25 via-teal-500/15 to-emerald-950/40', accent: '#34d399', tag: 'EMERALD WIN PAPER' },
      lose_red: { bg: 'from-rose-500/25 via-red-500/15 to-rose-950/40', accent: '#fb7185', tag: 'ELIMINATION PAPER' },
      custom_label: { bg: 'from-violet-500/25 via-fuchsia-500/15 to-indigo-950/40', accent: p.paperColor || '#a78bfa', tag: 'CUSTOM PAPER' },
    };
    const st = outcomeMap[p.outcome];

    return (
      <div
        className={`relative ${sizeClass} rounded-[2rem] bg-gradient-to-br ${st.bg} border-2 border-white/15 p-4 flex flex-col justify-between overflow-hidden shadow-2xl`}
      >
        {p.enchantedGlint && (
          <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[2rem]">
            <div className="w-1/2 h-full bg-gradient-to-r from-transparent via-violet-300/25 to-transparent animate-shimmer" />
          </div>
        )}

        <div className="relative z-10 flex items-center justify-between">
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/10 border border-white/15 text-white">
            Paper Game
          </span>
          {p.enchantedGlint && (
            <span className="inline-flex items-center gap-1 text-[10px] text-violet-200 bg-violet-500/25 border border-violet-400/40 px-2 py-0.5 rounded-full">
              <Sparkles className="w-3 h-3" /> Glint
            </span>
          )}
        </div>

        {/* Sleek Curved Paper Sheet Icon */}
        <div className="relative z-10 my-auto flex flex-col items-center">
          <div
            className="w-28 h-24 rounded-3xl flex flex-col items-center justify-center border border-white/25 shadow-xl relative overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${st.accent}35, rgba(255,255,255,0.12))`,
              boxShadow: `0 12px 30px -8px ${st.accent}66`,
            }}
          >
            <div className="w-14 h-1.5 rounded-full bg-white/50 mb-2" />
            <div className="w-10 h-1.5 rounded-full bg-white/35 mb-2" />
            <span className="text-[11px] font-extrabold text-white tracking-wide px-2 text-center truncate max-w-full">
              {p.paperTitle || 'WINNER'}
            </span>
          </div>
          {p.showWinnerMapArt && (
            <span className="mt-2.5 text-xs font-bold text-emerald-300 tracking-wide">
              {playerIgn} • {st.tag}
            </span>
          )}
        </div>

        <div className="relative z-10 flex items-center justify-between pt-2 border-t border-white/10 text-[10px] text-slate-300">
          <span>Dispenser Visual</span>
          <span className="font-mono-code text-[9px] text-white/45">slazixot™</span>
        </div>
      </div>
    );
  }

  // 3. ARMOR GAME
  if (activeGame === 'armor') {
    const a = games.armor;
    const tier = ARMOR_COLORS[a.tier];

    return (
      <div
        className={`relative ${sizeClass} rounded-[2rem] bg-gradient-to-br from-slate-900/95 via-[#13172b] to-slate-950 border-2 border-white/15 p-4 flex flex-col justify-between overflow-hidden shadow-2xl`}
        style={{ boxShadow: `0 20px 45px -12px ${tier.glow}` }}
      >
        {a.enchantedGlint && (
          <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[2rem]">
            <div className="w-1/2 h-full bg-gradient-to-r from-transparent via-fuchsia-400/25 to-transparent animate-shimmer" />
          </div>
        )}

        <div className="relative z-10 flex items-center justify-between">
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/10 border border-white/15 text-slate-200">
            Armor Game
          </span>
          <span
            className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border"
            style={{
              color: tier.secondary,
              borderColor: `${tier.primary}66`,
              backgroundColor: `${tier.primary}22`,
            }}
          >
            {tier.label}
          </span>
        </div>

        {/* Sleek Vector Armor Piece */}
        <div className="relative z-10 my-auto flex flex-col items-center">
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center border border-white/15"
            style={{
              background: `radial-gradient(circle at 30% 30%, ${tier.secondary}40, ${tier.primary}15 70%)`,
              boxShadow: `0 0 35px ${tier.glow}`,
            }}
          >
            <Shield className="w-12 h-12" style={{ color: tier.secondary }} />
          </div>
          <p className="mt-2.5 text-sm font-bold text-white capitalize">
            {tier.label} {a.piece}
          </p>
          <p className="text-[11px] text-slate-400 truncate max-w-[180px]">
            {a.customName || `${playerIgn}'s Chosen Drop`}
          </p>
        </div>

        <div className="relative z-10 flex items-center justify-between pt-2 border-t border-white/10 text-[10px] text-slate-400">
          <span>{a.enchantedGlint ? '✦ Enchanted Visual' : 'Standard Visual'}</span>
          <span className="font-mono-code text-[9px] text-white/45">slazixot™</span>
        </div>
      </div>
    );
  }

  // 4. RUSSIAN ROULETTE
  if (activeGame === 'roulette') {
    const r = games.roulette;
    const isSafe = r.outcome === 'safe_blank';
    const isGold = r.outcome === 'golden_chamber';

    return (
      <div
        className={`relative ${sizeClass} rounded-[2rem] bg-gradient-to-br ${
          isSafe
            ? 'from-emerald-950/90 via-[#0e1924] to-slate-950 border-emerald-400/40'
            : isGold
            ? 'from-amber-950/90 via-[#1d1424] to-slate-950 border-amber-400/45'
            : 'from-rose-950/90 via-[#1e0f1c] to-slate-950 border-rose-500/45'
        } border-2 p-4 flex flex-col justify-between overflow-hidden shadow-2xl`}
      >
        <div className="relative z-10 flex items-center justify-between">
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/10 border border-white/15">
            Russian Roulette
          </span>
          <span className="text-[10px] font-mono-code text-slate-300">
            Chamber #{r.chamberSlot}
          </span>
        </div>

        {/* 6-Chamber Revolver Cylinder SVG */}
        <div className="relative z-10 my-auto flex flex-col items-center">
          <svg viewBox="0 0 120 120" className="w-28 h-28 drop-shadow-xl">
            <circle cx="60" cy="60" r="52" fill="rgba(15,23,42,0.85)" stroke="rgba(255,255,255,0.18)" strokeWidth="2.5" />
            <circle cx="60" cy="60" r="10" fill="rgba(255,255,255,0.14)" />
            {[1, 2, 3, 4, 5, 6].map((slot, idx) => {
              const angle = (idx * 60 - 90) * (Math.PI / 180);
              const cx = 60 + 30 * Math.cos(angle);
              const cy = 60 + 30 * Math.sin(angle);
              const active = slot === r.chamberSlot;
              const fill = active
                ? isSafe
                  ? '#34d399'
                  : isGold
                  ? '#fbbf24'
                  : '#fb7185'
                : 'rgba(255,255,255,0.08)';
              return (
                <g key={slot}>
                  <circle
                    cx={cx}
                    cy={cy}
                    r="11.5"
                    fill={fill}
                    stroke={active ? '#ffffff' : 'rgba(255,255,255,0.2)'}
                    strokeWidth={active ? '2' : '1'}
                  />
                  <text
                    x={cx}
                    y={cy + 3.5}
                    textAnchor="middle"
                    fontSize="9"
                    fontWeight="700"
                    fill={active ? '#090d16' : '#94a3b8'}
                  >
                    {slot}
                  </text>
                </g>
              );
            })}
          </svg>
          <div className="mt-1 flex items-center gap-1.5 text-xs font-bold">
            {isSafe ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-300">{r.customBanner || 'SAFE • BLANK'}</span>
              </>
            ) : isGold ? (
              <>
                <Flame className="w-4 h-4 text-amber-400" />
                <span className="text-amber-300">{r.customBanner || 'GOLDEN SURVIVOR'}</span>
              </>
            ) : (
              <>
                <Skull className="w-4 h-4 text-rose-400" />
                <span className="text-rose-300">{r.customBanner || 'LOADED CHAMBER'}</span>
              </>
            )}
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-between pt-2 border-t border-white/10 text-[10px] text-slate-400">
          <span>{r.revealInMapArt ? 'Map Art Reveal' : 'Item Visual'}</span>
          <span className="font-mono-code text-[9px] text-white/45">slazixot™</span>
        </div>
      </div>
    );
  }

  // 5. 45 / 45 / 10
  if (activeGame === 'odds_45_45_10') {
    const o = games.odds_45_45_10;
    const isP1 = o.forcedSlice === '45_player';
    const isJackpot = o.forcedSlice === '10_jackpot';

    return (
      <div
        className={`relative ${sizeClass} rounded-[2rem] bg-gradient-to-br from-violet-950/90 via-[#12132a] to-slate-950 border-2 border-violet-400/40 p-4 flex flex-col justify-between overflow-hidden shadow-2xl`}
      >
        <div className="relative z-10 flex items-center justify-between">
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-violet-500/20 border border-violet-400/35 text-violet-200">
            45 / 45 / 10
          </span>
          <span className="text-[10px] font-bold text-amber-300">
            {isJackpot ? `10% • ${o.jackpotMultiplier}` : '45% SLICE'}
          </span>
        </div>

        {/* Sleek Odds Donut Visual */}
        <div className="relative z-10 my-auto flex flex-col items-center">
          <div className="relative w-28 h-28 rounded-full p-2 flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              {/* 45% Player */}
              <circle
                cx="50"
                cy="50"
                r="38"
                fill="none"
                stroke={isP1 ? '#34d399' : 'rgba(52,211,153,0.22)'}
                strokeWidth="14"
                strokeDasharray="107.4 238.76"
                strokeDashoffset="0"
              />
              {/* 45% Opponent */}
              <circle
                cx="50"
                cy="50"
                r="38"
                fill="none"
                stroke={o.forcedSlice === '45_opponent' ? '#fb7185' : 'rgba(251,113,133,0.22)'}
                strokeWidth="14"
                strokeDasharray="107.4 238.76"
                strokeDashoffset="-107.4"
              />
              {/* 10% Jackpot */}
              <circle
                cx="50"
                cy="50"
                r="38"
                fill="none"
                stroke={isJackpot ? '#fbbf24' : 'rgba(251,191,36,0.28)'}
                strokeWidth="14"
                strokeDasharray="23.9 238.76"
                strokeDashoffset="-214.8"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-lg font-extrabold text-white">
                {isJackpot ? '10%' : '45%'}
              </span>
              <span className="text-[9px] uppercase tracking-wider text-slate-300">
                {isJackpot ? 'Jackpot' : 'Forced'}
              </span>
            </div>
          </div>
          <span className="mt-1 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-bold text-white truncate max-w-[190px]">
            {isP1
              ? `${playerIgn} (${o.playerLabel})`
              : isJackpot
              ? `★ JACKPOT ${o.jackpotMultiplier} ★`
              : o.opponentLabel}
          </span>
        </div>

        <div className="relative z-10 flex items-center justify-between pt-2 border-t border-white/10 text-[10px] text-slate-400">
          <span>Wheel Map Art</span>
          <span className="font-mono-code text-[9px] text-white/45">slazixot™</span>
        </div>
      </div>
    );
  }

  // 6. ODD OR EVEN
  const oe = games.odd_even;
  const isEven = oe.forcedParity === 'even';
  const displayNum =
    oe.forcedNumber % 2 === (isEven ? 0 : 1)
      ? oe.forcedNumber
      : oe.forcedNumber === 100
      ? 99
      : oe.forcedNumber + 1;

  return (
    <div
      className={`relative ${sizeClass} rounded-[2rem] bg-gradient-to-br ${
        isEven
          ? 'from-cyan-950/90 via-[#0e192b] to-indigo-950 border-cyan-400/45'
          : 'from-fuchsia-950/90 via-[#1b102b] to-violet-950 border-fuchsia-400/45'
      } border-2 p-4 flex flex-col justify-between overflow-hidden shadow-2xl`}
    >
      <div className="relative z-10 flex items-center justify-between">
        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/10 border border-white/15">
          Odd or Even
        </span>
        <span
          className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
            isEven
              ? 'bg-cyan-400/20 text-cyan-200 border border-cyan-400/40'
              : 'bg-fuchsia-400/20 text-fuchsia-200 border border-fuchsia-400/40'
          }`}
        >
          {oe.forcedParity}
        </span>
      </div>

      <div className="relative z-10 my-auto flex flex-col items-center text-center">
        <div
          className={`font-display font-extrabold leading-none ${
            compact ? 'text-5xl' : 'text-6xl'
          } bg-gradient-to-b ${
            isEven ? 'from-cyan-200 to-sky-400' : 'from-fuchsia-200 to-violet-400'
          } bg-clip-text text-transparent`}
        >
          {displayNum}
        </div>
        <span className="mt-2 px-3 py-0.5 rounded-full bg-white/10 border border-white/15 text-[11px] font-bold text-white">
          {oe.mapArtBanner || `${playerIgn} • ${oe.forcedParity.toUpperCase()} WIN`}
        </span>
      </div>

      <div className="relative z-10 flex items-center justify-between pt-2 border-t border-white/10 text-[10px] text-slate-400">
        <span>Parity Map Art</span>
        <span className="font-mono-code text-[9px] text-white/45">slazixot™</span>
      </div>
    </div>
  );
};
