import { globalShortcut } from 'electron';
import { GuakeConfig } from '../config/types';

export class HotkeyManager {
    private config: GuakeConfig;
    private toggleCallback: () => void;
    private registeredHotkeys: string[] = [];

    constructor(config: GuakeConfig, toggleCallback: () => void) {
        this.config = config;
        this.toggleCallback = toggleCallback;
    }

    /**
     * Registers the hotkey for toggling the terminal
     */
    register(): void {
        this.unregister(); // Unregister any existing hotkeys first

        // Register the main hotkey
        try {
            const success = globalShortcut.register(this.config.hotkey, this.toggleCallback);
            if (success) {
                this.registeredHotkeys.push(this.config.hotkey);
            } else {
                console.error(`[hyper-guake] Failed to register hotkey '${this.config.hotkey}'`);
            }
        } catch (error) {
            console.error(`[hyper-guake] Error registering hotkey '${this.config.hotkey}':`, error);
        }
    }

    /**
     * Unregisters all hotkeys
     */
    unregister(): void {
        // Unregister all previously registered hotkeys
        this.registeredHotkeys.forEach(hotkey => {
            try {
                globalShortcut.unregister(hotkey);
            } catch (error) {
                console.error(`[hyper-guake] Error unregistering hotkey '${hotkey}':`, error);
            }
        });

        this.registeredHotkeys = [];
    }

    /**
     * Updates the hotkey configuration
     */
    updateConfig(newConfig: GuakeConfig): void {
        this.config = newConfig;
        this.register(); // Re-register with the new config
    }

    /**
     * Cleans up by unregistering all shortcuts
     */
    cleanup(): void {
        this.unregister();
    }
} 