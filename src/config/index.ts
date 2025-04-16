import { DEFAULT_CONFIG, GuakeConfig } from './types';

/**
 * Merges user configuration with default configuration
 */
export function mergeConfig(userConfig: Partial<GuakeConfig> = {}): GuakeConfig {
    return {
        ...DEFAULT_CONFIG,
        ...userConfig,
    };
}

// Export the types
export * from './types'; 