import { app, BrowserWindow } from 'electron';
import { GuakeService } from './lib/guake-service';
import { HotkeyManager } from './lib/hotkey-manager';
import { GuakeConfig, DEFAULT_CONFIG } from './config/types';
import { mergeConfig } from './config';

// Global variables
let guakeService: GuakeService | null = null;
let hotkeyManager: HotkeyManager | null = null;
// Initialize config with default values
let config: GuakeConfig = DEFAULT_CONFIG;

/**
 * Initialize services when the app is ready
 */
const initializeServices = (browserWindow: BrowserWindow) => {
    if (!guakeService) {
        guakeService = new GuakeService(config);
        guakeService.setWindow(browserWindow);

        if (!hotkeyManager) {
            hotkeyManager = new HotkeyManager(config, () => {
                guakeService?.toggle();
            });
            hotkeyManager.register();
        }
    }
};

/**
 * Clean up services when the app is unloaded
 */
const cleanupServices = () => {
    hotkeyManager?.cleanup();
    guakeService?.cleanup();
    hotkeyManager = null;
    guakeService = null;
};

/**
 * Update configuration
 */
const updateConfig = (userConfig: Partial<GuakeConfig>) => {
    config = mergeConfig(userConfig);
    // Update services with new config
    if (guakeService) {
        guakeService.updateConfig(config);
    }

    if (hotkeyManager) {
        hotkeyManager.updateConfig(config);
    }
};

/**
 * Hyper plugin API exports
 */
export const decorateConfig = (hyperConfig: any) => {
    // Initialize config with user settings
    const userGuakeConfig = hyperConfig.guake || {};
    console.log('[hyper-guake] Loading with config:', userGuakeConfig);
    updateConfig(userGuakeConfig);

    // Return the original config, we don't need to modify Hyper's config here
    return hyperConfig;
};

export const onWindow = (win: BrowserWindow) => {
    // Initialize our services when a window is created
    console.log('[hyper-guake] Window created');
    initializeServices(win);
};

export const onUnload = () => {
    // Clean up resources when plugin is unloaded
    console.log('[hyper-guake] Plugin unloading');
    cleanupServices();
};

export const onApp = (hyperApp: typeof app) => {
    // Additional app setup if needed
    console.log('[hyper-guake] App initialized');
};
