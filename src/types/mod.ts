export type GameModeId =
  | 'paper'
  | 'higher_lower'
  | 'armor'
  | 'roulette'
  | 'odds_45_45_10'
  | 'odd_even';

export type AccentTheme = 'violet' | 'emerald' | 'cyan' | 'amber' | 'rose';
export type HudPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

export interface PaperGameConfig {
  outcome: 'win_gold' | 'win_emerald' | 'lose_red' | 'custom_label';
  paperTitle: string;
  paperColor: string;
  enchantedGlint: boolean;
  showWinnerMapArt: boolean;
}

export interface HigherLowerConfig {
  forceWinner: 'me' | 'opponent';
  myNumber: number;
  opponentNumber: number;
  opponentName: string;
  mapArtStyle: 'royal_gold' | 'cyber_neon' | 'obsidian_crown';
  showComparisonBadge: boolean;
}

export interface ArmorGameConfig {
  tier: 'netherite' | 'diamond' | 'iron' | 'gold' | 'chainmail' | 'leather';
  piece: 'helmet' | 'chestplate' | 'leggings' | 'boots';
  enchantedGlint: boolean;
  customName: string;
  showMapArtCard: boolean;
}

export interface RouletteConfig {
  outcome: 'safe_blank' | 'loaded_shot' | 'golden_chamber';
  chamberSlot: number; // 1 - 6
  revealInMapArt: boolean;
  customBanner: string;
}

export interface Odds454510Config {
  forcedSlice: '45_player' | '45_opponent' | '10_jackpot';
  playerLabel: string;
  opponentLabel: string;
  jackpotMultiplier: string;
}

export interface OddEvenConfig {
  forcedParity: 'odd' | 'even';
  forcedNumber: number; // 1 - 100
  mapArtBanner: string;
}

export interface HotkeyBinding {
  id: string;
  label: string;
  description: string;
  keyCombo: string;
  category: 'Core' | 'Games' | 'Tracker';
}

export interface PayoutEntry {
  id: string;
  sender: string;
  amount: number;
  rawMessage: string;
  gameTag: GameModeId | 'general';
  timestamp: number;
}

export interface ModConfig {
  enabled: boolean;
  visualsOnlyBadge: boolean;
  playerIgn: string;
  activeGame: GameModeId;
  accentTheme: AccentTheme;
  hudPosition: HudPosition;
  hudOpacity: number;
  glassBlur: number;
  particleBurst: boolean;
  dispenserSoundCue: boolean;
  chatTrackerEnabled: boolean;
  customChatRegex: string;
  games: {
    paper: PaperGameConfig;
    higher_lower: HigherLowerConfig;
    armor: ArmorGameConfig;
    roulette: RouletteConfig;
    odds_45_45_10: Odds454510Config;
    odd_even: OddEvenConfig;
  };
  hotkeys: HotkeyBinding[];
}

export interface GameMeta {
  id: GameModeId;
  name: string;
  shortName: string;
  tagline: string;
  badge: string;
}

export const GAME_LIST: GameMeta[] = [
  {
    id: 'higher_lower',
    name: 'Higher or Lower',
    shortName: 'Hi / Lo',
    tagline: 'Force high-number winner map art out of the dispenser',
    badge: 'Map Art Winner',
  },
  {
    id: 'paper',
    name: 'Paper Game',
    shortName: 'Paper',
    tagline: 'Choose exact colored / renamed winning paper dispensed',
    badge: 'Dispenser Pick',
  },
  {
    id: 'armor',
    name: 'Armor Game',
    shortName: 'Armor',
    tagline: 'Force Netherite, Diamond, or any tier & piece visually',
    badge: 'Tier Override',
  },
  {
    id: 'roulette',
    name: 'Russian Roulette',
    shortName: 'Roulette',
    tagline: 'Pick safe blank, loaded shot, or golden chamber map art',
    badge: '6-Chamber',
  },
  {
    id: 'odds_45_45_10',
    name: '45 / 45 / 10',
    shortName: '45·45·10',
    tagline: 'Select 45% P1, 45% P2, or 10% Jackpot dispenser result',
    badge: 'Odds Wheel',
  },
  {
    id: 'odd_even',
    name: 'Odd or Even',
    shortName: 'Odd / Even',
    tagline: 'Lock dispenser map art to your chosen Odd or Even number',
    badge: 'Parity Lock',
  },
];
