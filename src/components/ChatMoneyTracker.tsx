import React, { useState } from 'react';
import {
  DollarSign,
  TrendingUp,
  MessageSquareText,
  Trash2,
  Send,
  Sparkles,
  Award,
  SlidersHorizontal,
} from 'lucide-react';
import { ModConfig, PayoutEntry } from '../types/mod';
import { formatExactMoney, formatMoney } from '../utils/chatParser';

interface ChatMoneyTrackerProps {
  config: ModConfig;
  payouts: PayoutEntry[];
  onInjectChatLines: (text: string) => { added: number };
  onClearPayouts: () => void;
  onUpdateRegex: (regex: string) => void;
  onToggleTracker: (enabled: boolean) => void;
}

const SAMPLE_MESSAGES = [
  { label: '+$50K Pay', line: '[Pay] xShadow paid you $50,000' },
  { label: '+$250K Hi/Lo', line: 'You received $250,000 from Vexx (Higher or Lower)' },
  { label: '+$1.5M Jackpot', line: '[Pay] HighRoller paid you $1.5M' },
  { label: '+$5M Roulette', line: '+$5,000,000 has been added to your balance from Kairo (Roulette)' },
];

export const ChatMoneyTracker: React.FC<ChatMoneyTrackerProps> = ({
  config,
  payouts,
  onInjectChatLines,
  onClearPayouts,
  onUpdateRegex,
  onToggleTracker,
}) => {
  const [chatInput, setChatInput] = useState('');
  const [statusFeedback, setStatusFeedback] = useState<string | null>(null);
  const [showRegex, setShowRegex] = useState(false);

  const totalEarned = payouts.reduce((acc, p) => acc + p.amount, 0);
  const biggestWin = payouts.reduce((max, p) => Math.max(max, p.amount), 0);
  const latest = payouts[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const { added } = onInjectChatLines(chatInput);
    if (added > 0) {
      setStatusFeedback(`Tracked ${added} payout${added > 1 ? 's' : ''} from chat!`);
      setChatInput('');
    } else {
      setStatusFeedback('No payout amount matched in that message.');
    }
    setTimeout(() => setStatusFeedback(null), 2600);
  };

  return (
    <div className="glass-panel rounded-[2.25rem] p-5 sm:p-7">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="font-display text-xl font-bold text-white flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-400" />
            Chat Money & Payout Tracker
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Automatically listens to in-game chat for <span className="font-mono-code text-emerald-300">/pay</span> & balance messages.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onToggleTracker(!config.chatTrackerEnabled)}
            className={`px-4 py-2 rounded-full text-xs font-bold cursor-pointer border transition-all ${
              config.chatTrackerEnabled
                ? 'bg-emerald-500/20 border-emerald-400/50 text-emerald-200'
                : 'bg-white/5 border-white/10 text-slate-400'
            }`}
          >
            {config.chatTrackerEnabled ? 'Listener: ACTIVE' : 'Listener: PAUSED'}
          </button>

          <button
            onClick={() => setShowRegex((s) => !s)}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 cursor-pointer"
            title="Custom Chat Regex"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>

          <button
            onClick={onClearPayouts}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-rose-500/10 hover:bg-rose-500/20 border border-rose-400/30 text-xs font-semibold text-rose-200 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear
          </button>
        </div>
      </div>

      {/* Stat Pills */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-6">
        <div className="rounded-3xl bg-gradient-to-br from-emerald-500/20 to-teal-500/5 border border-emerald-400/30 p-4">
          <div className="flex items-center justify-between text-xs text-emerald-200/80 mb-1">
            <span>Session Paid Total</span>
            <TrendingUp className="w-4 h-4 text-emerald-300" />
          </div>
          <div className="font-display text-2xl sm:text-3xl font-extrabold text-white">
            {formatMoney(totalEarned)}
          </div>
          <div className="text-[11px] font-mono-code text-emerald-300/80 mt-0.5">
            {formatExactMoney(totalEarned)}
          </div>
        </div>

        <div className="rounded-3xl bg-white/[0.04] border border-white/10 p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Biggest Payout</span>
            <Award className="w-4 h-4 text-amber-300" />
          </div>
          <div className="font-display text-2xl sm:text-3xl font-extrabold text-amber-200">
            {formatMoney(biggestWin)}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            Across {payouts.length} chat payout{payouts.length === 1 ? '' : 's'}
          </div>
        </div>

        <div className="rounded-3xl bg-white/[0.04] border border-white/10 p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Latest Sender</span>
            <Sparkles className="w-4 h-4 text-cyan-300" />
          </div>
          <div className="font-display text-xl sm:text-2xl font-bold text-white truncate">
            {latest ? latest.sender : 'Waiting...'}
          </div>
          <div className="text-[11px] text-cyan-300 mt-0.5">
            {latest ? `+${formatMoney(latest.amount)}` : 'No chat payouts yet'}
          </div>
        </div>
      </div>

      {/* Optional Custom Regex Drawer */}
      {showRegex && (
        <div className="mb-5 rounded-3xl bg-[#080b16]/85 border border-cyan-400/30 p-4">
          <label className="block text-xs font-bold text-cyan-200 mb-1.5">
            Custom Server Pay Regex (Optional)
          </label>
          <p className="text-[11px] text-slate-400 mb-2">
            Built-in rules already match <span className="font-mono-code">[Pay] Player paid you $50k</span>,{' '}
            <span className="font-mono-code">You received $1.5M from Player</span>, and <span className="font-mono-code">+$250k</span>. Add a custom regex with capture groups for amount & sender if needed.
          </p>
          <input
            type="text"
            value={config.customChatRegex}
            onChange={(e) => onUpdateRegex(e.target.value)}
            placeholder="e.g. ([A-Za-z0-9_]+) sent you \$([\d,.]+[kmbt]?)"
            className="w-full px-4 py-2 rounded-full bg-white/5 border border-white/15 font-mono-code text-xs text-white focus:outline-none focus:border-cyan-400"
          />
        </div>
      )}

      {/* Chat Input & Quick Test Pills */}
      <div className="rounded-[1.75rem] bg-[#080b16]/80 border border-white/10 p-4 sm:p-5 mb-5">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="text-[11px] font-semibold text-slate-400 mr-1">
            Simulate Chat Pay:
          </span>
          {SAMPLE_MESSAGES.map((s) => (
            <button
              key={s.label}
              onClick={() => onInjectChatLines(s.line)}
              className="px-3 py-1 rounded-full bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-400/30 text-[11px] font-semibold text-emerald-200 cursor-pointer transition-all"
            >
              {s.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <MessageSquareText className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder='Paste Minecraft chat line, e.g. "[Pay] Notch paid you $1.2M"'
              className="w-full pl-11 pr-4 py-2.5 rounded-full bg-white/5 border border-white/10 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-400"
            />
          </div>
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs cursor-pointer hover:brightness-110 transition-all"
          >
            <Send className="w-3.5 h-3.5" />
            Parse Chat
          </button>
        </form>
        {statusFeedback && (
          <p className="text-[11px] text-emerald-300 mt-2 px-2">{statusFeedback}</p>
        )}
      </div>

      {/* Payout Feed */}
      <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
        {payouts.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-500">
            No chat payouts recorded yet. Click a quick-simulate pill or paste a chat line above.
          </div>
        ) : (
          payouts.map((entry) => (
            <div
              key={entry.id}
              className="rounded-3xl bg-white/[0.03] border border-white/10 px-4 py-3 flex flex-wrap items-center justify-between gap-3"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white">{entry.sender}</span>
                  <span className="px-2 py-0.5 rounded-full bg-white/10 text-[10px] font-semibold text-slate-300 uppercase">
                    {entry.gameTag.replace(/_/g, ' ')}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {new Date(entry.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <p className="font-mono-code text-[11px] text-slate-400 truncate mt-0.5">
                  {entry.rawMessage}
                </p>
              </div>
              <div className="px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-400/35 text-xs font-extrabold text-emerald-300">
                +{formatMoney(entry.amount)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
