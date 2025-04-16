export interface GuakeConfig {
    /** Hotkey combinations to toggle the terminal */
    hotkey: string;

    /** Terminal width as percentage of screen width */
    width: number;

    /** Terminal height as percentage of screen height */
    height: number;

    /** Terminal position ('bottom', 'middle', 'top', 'custom') */
    position: 'bottom' | 'middle' | 'top' | 'custom';

    /** Custom y position if position is set to 'custom' (percentage from top) */
    customYPosition?: number;

    /** Terminal opacity (0-1) */
    opacity: number;

    /** Animation duration in ms */
    animationDuration: number;

    /** Animation type ('fade', 'slide') */
    animationType: 'fade' | 'slide';

    /** Hide when focus is lost */
    hideOnBlur: boolean;

    /** Hide dock icon (macOS only) */
    hideDockIcon: boolean;
}

export const DEFAULT_CONFIG: GuakeConfig = {
    hotkey: 'Ctrl+`',
    width: 90,
    height: 50,
    position: 'top',
    opacity: 0.9,
    animationDuration: 300,
    animationType: 'fade',
    hideOnBlur: true,
    hideDockIcon: false,
}; 