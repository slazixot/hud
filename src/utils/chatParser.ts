import { GameModeId, PayoutEntry } from '../types/mod';

export function parseShorthandAmount(raw: string): number | null {
  const cleaned = raw.replace(/[$,\s]/g, '').toLowerCase();
  const match = cleaned.match(/^(\d+(?:\.\d+)?)([kmbt])?$/);
  if (!match) return null;

  const base = parseFloat(match[1]);
  if (Number.isNaN(base)) return null;

  const suffix = match[2];
  const multipliers: Record<string, number> = {
    k: 1_000,
    m: 1_000_000,
    b: 1_000_000_000,
    t: 1_000_000_000_000,
  };

  return Math.round(base * (suffix ? multipliers[suffix] : 1));
}

export function formatMoney(amount: number): string {
  if (amount >= 1_000_000_000) {
    return `$${(amount / 1_000_000_000).toFixed(2).replace(/\.00$/, '')}B`;
  }
  if (amount >= 1_000_000) {
    return `$${(amount / 1_000_000).toFixed(2).replace(/\.00$/, '')}M`;
  }
  if (amount >= 1_000) {
    return `$${(amount / 1_000).toFixed(1).replace(/\.0$/, '')}K`;
  }
  return `$${amount.toLocaleString()}`;
}

export function formatExactMoney(amount: number): string {
  return `$${amount.toLocaleString('en-US')}`;
}

const DEFAULT_PATTERNS: RegExp[] = [
  // [Pay] Notch paid you $50,000
  /(?:\[Pay\]|\bPay\b)?\s*([A-Za-z0-9_]{2,16})\s+(?:has\s+)?paid\s+you\s+\$?([\d,.]+[kmbtKMBT]?)/i,
  // You received $250,000 from Notch
  /You\s+received\s+\$?([\d,.]+[kmbtKMBT]?)\s+from\s+([A-Za-z0-9_]{2,16})/i,
  // +$1.5M from Notch (or +$1.5M)
  /\+\s*\$?([\d,.]+[kmbtKMBT]?)(?:\s+from\s+([A-Za-z0-9_]{2,16}))?/i,
  // $100,000 has been added to your balance (from Player)
  /\$?([\d,.]+[kmbtKMBT]?)\s+has\s+been\s+added\s+to\s+your\s+balance(?:\s+from\s+([A-Za-z0-9_]{2,16}))?/i,
];

export function parseChatLine(
  line: string,
  customRegex?: string,
  fallbackGame: GameModeId | 'general' = 'general'
): PayoutEntry | null {
  const trimmed = line.trim();
  if (!trimmed) return null;

  // Try custom user regex first if provided
  if (customRegex && customRegex.trim().length > 0) {
    try {
      const rx = new RegExp(customRegex, 'i');
      const m = trimmed.match(rx);
      if (m) {
        // Expect capture groups: either amount in group 1 or sender + amount
        const g1 = m[1] || '';
        const g2 = m[2] || '';
        const amtFrom1 = parseShorthandAmount(g1);
        const amtFrom2 = parseShorthandAmount(g2);

        if (amtFrom1 !== null) {
          return {
            id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            sender: g2 || 'Server',
            amount: amtFrom1,
            rawMessage: trimmed,
            gameTag: detectGameTag(trimmed, fallbackGame),
            timestamp: Date.now(),
          };
        }
        if (amtFrom2 !== null) {
          return {
            id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            sender: g1 || 'Server',
            amount: amtFrom2,
            rawMessage: trimmed,
            gameTag: detectGameTag(trimmed, fallbackGame),
            timestamp: Date.now(),
          };
        }
      }
    } catch {
      // Ignore invalid custom regex gracefully
    }
  }

  for (let i = 0; i < DEFAULT_PATTERNS.length; i++) {
    const match = trimmed.match(DEFAULT_PATTERNS[i]);
    if (!match) continue;

    if (i === 0) {
      const amount = parseShorthandAmount(match[2]);
      if (amount !== null && amount > 0) {
        return {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          sender: match[1],
          amount,
          rawMessage: trimmed,
          gameTag: detectGameTag(trimmed, fallbackGame),
          timestamp: Date.now(),
        };
      }
    } else {
      const amount = parseShorthandAmount(match[1]);
      if (amount !== null && amount > 0) {
        return {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          sender: match[2] || 'Server',
          amount,
          rawMessage: trimmed,
          gameTag: detectGameTag(trimmed, fallbackGame),
          timestamp: Date.now(),
        };
      }
    }
  }

  return null;
}

function detectGameTag(text: string, fallback: GameModeId | 'general'): GameModeId | 'general' {
  const lower = text.toLowerCase();
  if (lower.includes('higher') || lower.includes('lower') || lower.includes('hi/lo')) return 'higher_lower';
  if (lower.includes('paper')) return 'paper';
  if (lower.includes('armor') || lower.includes('netherite')) return 'armor';
  if (lower.includes('roulette')) return 'roulette';
  if (lower.includes('45') || lower.includes('jackpot')) return 'odds_45_45_10';
  if (lower.includes('odd') || lower.includes('even')) return 'odd_even';
  return fallback;
}
