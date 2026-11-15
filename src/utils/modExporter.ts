import { ModConfig } from '../types/mod';

export function buildConfigJson(config: ModConfig): string {
  return JSON.stringify(
    {
      _trademark: 'made by slazixot',
      modId: 'slazixot-visuals',
      version: '2.4.0',
      clientSideOnly: true,
      config,
    },
    null,
    2
  );
}

export function buildFabricModJson(): string {
  return JSON.stringify(
    {
      schemaVersion: 1,
      id: 'slazixot-visuals',
      version: '2.4.0',
      name: 'Slazixot Visuals',
      description:
        'Client-side only visual dispenser & map-art mod for Paper Game, Higher or Lower, Armor Game, Russian Roulette, 45/45/10, Odd or Even + Chat Payout Tracker. Made by slazixot.',
      authors: ['slazixot'],
      contact: {
        homepage: 'https://slazixot.dev',
      },
      license: 'MIT',
      environment: 'client',
      entrypoints: {
        client: ['dev.slazixot.visuals.SlazixotVisualsClient'],
      },
      mixins: ['slazixot-visuals.mixins.json'],
      depends: {
        fabricloader: '>=0.15.0',
        minecraft: '>=1.21',
        java: '>=21',
        'fabric-api': '*',
      },
    },
    null,
    2
  );
}

export function buildJavaClientClass(config: ModConfig): string {
  const openMenuKey =
    config.hotkeys.find((h) => h.id === 'open_menu')?.keyCombo || 'RightShift';
  const toggleModKey =
    config.hotkeys.find((h) => h.id === 'toggle_mod')?.keyCombo || 'F6';

  return `package dev.slazixot.visuals;

import net.fabricmc.api.ClientModInitializer;
import net.fabricmc.fabric.api.client.event.lifecycle.v1.ClientTickEvents;
import net.fabricmc.fabric.api.client.keybinding.v1.KeyBindingHelper;
import net.fabricmc.fabric.api.client.message.v1.ClientReceiveMessageEvents;
import net.fabricmc.fabric.api.client.rendering.v1.HudRenderCallback;
import net.minecraft.client.MinecraftClient;
import net.minecraft.client.option.KeyBinding;
import net.minecraft.client.util.InputUtil;
import net.minecraft.item.ItemStack;
import net.minecraft.item.Items;
import net.minecraft.text.Text;
import org.lwjgl.glfw.GLFW;

/**
 * Slazixot Visuals - Client-Side Only Mod
 * Trademark: made by slazixot
 * Visual overrides only: Dispenser Item/MapArt rendering + Chat Payout Tracker
 */
public class SlazixotVisualsClient implements ClientModInitializer {

    public static final String TRADEMARK = "made by slazixot";
    public static boolean visualOverrideEnabled = ${config.enabled};
    public static String activeGame = "${config.activeGame}";
    public static String playerIgn = "${config.playerIgn}";
    public static long sessionPayoutTotal = 0L;

    private static KeyBinding openMenuBinding;
    private static KeyBinding toggleOverrideBinding;

    @Override
    public void onInitializeClient() {
        // Bound Hotkeys from Slazixot Studio (${openMenuKey} / ${toggleModKey})
        openMenuBinding = KeyBindingHelper.registerKeyBinding(new KeyBinding(
            "key.slazixot.open_menu",
            InputUtil.Type.KEYSYM,
            GLFW.GLFW_KEY_RIGHT_SHIFT,
            "category.slazixot.visuals"
        ));

        toggleOverrideBinding = KeyBindingHelper.registerKeyBinding(new KeyBinding(
            "key.slazixot.toggle_visuals",
            InputUtil.Type.KEYSYM,
            GLFW.GLFW_KEY_F6,
            "category.slazixot.visuals"
        ));

        ClientTickEvents.END_CLIENT_TICK.register(client -> {
            while (toggleOverrideBinding.wasPressed()) {
                visualOverrideEnabled = !visualOverrideEnabled;
                if (client.player != null) {
                    client.player.sendMessage(
                        Text.literal("§d[Slazixot Visuals] §fClient Visuals: " +
                            (visualOverrideEnabled ? "§aENABLED" : "§cDISABLED") + " §7(" + TRADEMARK + ")"),
                        true
                    );
                }
            }
            while (openMenuBinding.wasPressed()) {
                // Opens rounded Slazixot Visuals Screen
                // client.setScreen(new SlazixotConfigScreen());
            }
        });

        // Client-Side Chat Money Tracker
        ClientReceiveMessageEvents.GAME.register((message, overlay) -> {
            if (!overlay) {
                ChatPayoutTracker.inspectChatLine(message.getString());
            }
        });

        // Sleek Rounded HUD Overlay
        HudRenderCallback.EVENT.register((drawContext, tickCounter) -> {
            MinecraftClient mc = MinecraftClient.getInstance();
            if (mc.player == null || mc.options.hudHidden) return;
            drawContext.drawTextWithShadow(
                mc.textRenderer,
                "§dSlazixot Visuals §8| §b" + activeGame + " §8| §a$" + sessionPayoutTotal + " §7(" + TRADEMARK + ")",
                12, 12, 0xFFFFFF
            );
        });
    }

    /**
     * Called by client-side ItemEntity / Dispenser visual renderer mixin ONLY.
     * Does not send any packets to the server.
     */
    public static ItemStack getClientVisualDispenserStack(ItemStack originalServerStack) {
        if (!visualOverrideEnabled) return originalServerStack;

        return switch (activeGame) {
            case "higher_lower" -> MapArtVisualFactory.createWinnerMapArt(
                playerIgn,
                ${config.games.higher_lower.myNumber},
                "${config.games.higher_lower.opponentName}",
                ${config.games.higher_lower.opponentNumber}
            );
            case "paper" -> new ItemStack(Items.PAPER);
            case "armor" -> ArmorVisualFactory.createPiece(
                "${config.games.armor.tier}",
                "${config.games.armor.piece}",
                ${config.games.armor.enchantedGlint}
            );
            default -> MapArtVisualFactory.createCustomGameMapArt(activeGame);
        };
    }
}
`;
}

export function downloadTextFile(filename: string, content: string) {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
