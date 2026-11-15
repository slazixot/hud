import React, { useState } from 'react';
import {
  Palette,
  Download,
  Code2,
  Check,
  Copy,
  Layers,
} from 'lucide-react';
import { AccentTheme, HudPosition, ModConfig } from '../types/mod';
import {
  buildConfigJson,
  buildFabricModJson,
  buildJavaClientClass,
  downloadTextFile,
} from '../utils/modExporter';

interface AppearanceAndExportProps {
  config: ModConfig;
  onChange: (updater: (prev: ModConfig) => ModConfig) => void;
}

const THEMES: Array<{ id: AccentTheme; label: string; swatch: string }> = [
  { id: 'violet', label: 'Nebula Violet', swatch: 'bg-violet-500' },
  { id: 'emerald', label: 'Cyber Emerald', swatch: 'bg-emerald-500' },
  { id: 'cyan', label: 'Arctic Cyan', swatch: 'bg-cyan-400' },
  { id: 'amber', label: 'Royal Gold', swatch: 'bg-amber-400' },
  { id: 'rose', label: 'Crimson Rose', swatch: 'bg-rose-500' },
];

const POSITIONS: Array<{ id: HudPosition; label: string }> = [
  { id: 'top-left', label: 'Top Left' },
  { id: 'top-right', label: 'Top Right' },
  { id: 'bottom-left', label: 'Bottom Left' },
  { id: 'bottom-right', label: 'Bottom Right' },
];

export const AppearanceAndExport: React.FC<AppearanceAndExportProps> = ({
  config,
  onChange,
}) => {
  const [previewTab, setPreviewTab] = useState<'java' | 'json' | 'fabric'>('java');
  const [copied, setCopied] = useState(false);

  const codePreview =
    previewTab === 'java'
      ? buildJavaClientClass(config)
      : previewTab === 'json'
      ? buildConfigJson(config)
      : buildFabricModJson();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codePreview);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard fallback ignored
    }
  };

  return (
    <div className="space-y-6">
      {/* HUD & Visual Aesthetics Panel */}
      <div className="glass-panel rounded-[2.25rem] p-5 sm:p-7">
        <div className="mb-5">
          <h2 className="font-display text-xl font-bold text-white flex items-center gap-2">
            <Palette className="w-5 h-5 text-fuchsia-300" />
            HUD & Menu Aesthetics
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Tune the sleek glassmorphism, rounded HUD corner placement, and particle glow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Theme Swatches */}
          <div className="rounded-3xl bg-white/[0.03] border border-white/10 p-4">
            <span className="block text-xs font-bold text-slate-300 mb-3">
              Accent Glow Theme
            </span>
            <div className="flex flex-wrap gap-2">
              {THEMES.map((t) => (
                <button
                  key={t.id}
                  onClick={() =>
                    onChange((prev) => ({ ...prev, accentTheme: t.id }))
                  }
                  className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-semibold cursor-pointer border transition-all ${
                    config.accentTheme === t.id
                      ? 'bg-white/15 border-white/40 text-white'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  <span className={`w-3 h-3 rounded-full ${t.swatch}`} />
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* HUD Position */}
          <div className="rounded-3xl bg-white/[0.03] border border-white/10 p-4">
            <span className="block text-xs font-bold text-slate-300 mb-3">
              In-Game HUD Overlay Corner
            </span>
            <div className="grid grid-cols-2 gap-2">
              {POSITIONS.map((p) => (
                <button
                  key={p.id}
                  onClick={() =>
                    onChange((prev) => ({ ...prev, hudPosition: p.id }))
                  }
                  className={`py-2 rounded-full text-xs font-semibold cursor-pointer border transition-all ${
                    config.hudPosition === p.id
                      ? 'bg-cyan-500/20 border-cyan-400/50 text-cyan-200'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sliders */}
          <div className="rounded-3xl bg-white/[0.03] border border-white/10 p-4 space-y-4">
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-slate-300 font-semibold">HUD Glass Opacity</span>
                <span className="font-mono-code text-violet-300">{config.hudOpacity}%</span>
              </div>
              <input
                type="range"
                min={25}
                max={95}
                value={config.hudOpacity}
                onChange={(e) =>
                  onChange((prev) => ({ ...prev, hudOpacity: Number(e.target.value) }))
                }
                className="w-full accent-violet-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-slate-300 font-semibold">Backdrop Blur</span>
                <span className="font-mono-code text-cyan-300">{config.glassBlur}px</span>
              </div>
              <input
                type="range"
                min={4}
                max={32}
                value={config.glassBlur}
                onChange={(e) =>
                  onChange((prev) => ({ ...prev, glassBlur: Number(e.target.value) }))
                }
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>
          </div>

          {/* Toggles */}
          <div className="rounded-3xl bg-white/[0.03] border border-white/10 p-4 flex flex-col justify-center gap-3">
            <label className="flex items-center justify-between px-3 py-2 rounded-full bg-white/5 cursor-pointer">
              <span className="text-xs font-semibold text-slate-200">
                Dispenser Pulse Particle Ring
              </span>
              <input
                type="checkbox"
                checked={config.particleBurst}
                onChange={(e) =>
                  onChange((prev) => ({ ...prev, particleBurst: e.target.checked }))
                }
                className="accent-violet-500 w-4 h-4 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between px-3 py-2 rounded-full bg-white/5 cursor-pointer">
              <span className="text-xs font-semibold text-slate-200">
                Show Client-Side Only Badge
              </span>
              <input
                type="checkbox"
                checked={config.visualsOnlyBadge}
                onChange={(e) =>
                  onChange((prev) => ({
                    ...prev,
                    visualsOnlyBadge: e.target.checked,
                  }))
                }
                className="accent-emerald-500 w-4 h-4 cursor-pointer"
              />
            </label>
          </div>
        </div>
      </div>

      {/* Export Mod & Config Panel */}
      <div className="glass-panel rounded-[2.25rem] p-5 sm:p-7">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
          <div>
            <h2 className="font-display text-xl font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-cyan-300" />
              Export Client-Side Mod & Profile
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Download your configured <span className="font-mono-code text-slate-200">slazixot-visuals.json</span> or Fabric 1.21+ Java entrypoint with your hotkeys & <span className="text-violet-300 font-semibold">made by slazixot</span> trademark baked in.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() =>
                downloadTextFile('slazixot-visuals.json', buildConfigJson(config))
              }
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 text-xs font-bold text-white cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              Download Config JSON
            </button>
            <button
              onClick={() =>
                downloadTextFile(
                  'SlazixotVisualsClient.java',
                  buildJavaClientClass(config)
                )
              }
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 text-xs font-bold text-white cursor-pointer shadow-lg"
            >
              <Code2 className="w-3.5 h-3.5" />
              Download Fabric Java
            </button>
          </div>
        </div>

        {/* Code Tab Pills */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex gap-2">
            {(
              [
                { id: 'java', label: 'SlazixotVisualsClient.java' },
                { id: 'fabric', label: 'fabric.mod.json' },
                { id: 'json', label: 'slazixot-visuals.json' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setPreviewTab(tab.id)}
                className={`px-3.5 py-1.5 rounded-full font-mono-code text-[11px] font-semibold cursor-pointer border ${
                  previewTab === tab.id
                    ? 'bg-violet-500/25 border-violet-400/50 text-white'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-300 cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                Copy Code
              </>
            )}
          </button>
        </div>

        <pre className="rounded-3xl bg-[#05070e] border border-white/10 p-4 overflow-x-auto max-h-72 text-[11px] leading-relaxed font-mono-code text-slate-300">
          <code>{codePreview}</code>
        </pre>
      </div>
    </div>
  );
};
