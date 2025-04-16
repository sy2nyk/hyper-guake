import { BrowserWindow, app, screen } from 'electron';
import { GuakeConfig } from '../config/types';

export class GuakeService {
    private config: GuakeConfig;
    private window: BrowserWindow | null = null;
    private isVisible = false;
    private originalBounds: Electron.Rectangle | null = null;
    private animationFrame: NodeJS.Timeout | null = null;

    constructor(config: GuakeConfig) {
        this.config = config;
    }

    /**
     * Initializes the terminal window
     */
    setWindow(window: BrowserWindow): void {
        this.window = window;
        this.originalBounds = window.getBounds();
        this.setupWindow();
    }

    /**
     * Configure window settings based on config
     */
    private setupWindow(): void {
        if (!this.window) {
            return;
        }

        // Save original window settings before modifying
        this.originalBounds = this.window.getBounds();

        // Configure window for guake-style
        this.window.setAlwaysOnTop(true);
        this.window.setVisibleOnAllWorkspaces(true);
        this.window.setOpacity(this.config.opacity);

        // Set up event handlers
        if (this.config.hideOnBlur) {
            this.window.on('blur', () => {
                this.hide();
            });
        }

        // Initialize window position
        this.positionWindow();

        // Hide dock icon on macOS if configured
        if (process.platform === 'darwin' && this.config.hideDockIcon && app.dock) {
            app.dock.hide();
        }

        // Initially hide the window
        if (!this.isVisible) {
            this.window.hide();
        }
    }

    /**
     * Positions the window according to the config
     */
    private positionWindow(): void {
        if (!this.window) {
            return;
        }

        const displayBounds = screen.getPrimaryDisplay().workArea;

        const width = Math.round((displayBounds.width * this.config.width) / 100);
        const height = Math.round((displayBounds.height * this.config.height) / 100);

        let y = 0;
        switch (this.config.position) {
            case 'top':
                y = displayBounds.y;
                break;
            case 'middle':
                y = displayBounds.y + Math.round((displayBounds.height - height) / 2);
                break;
            case 'bottom':
                // The workArea already accounts for the dock
                y = displayBounds.y + displayBounds.height - height;
                break;
            case 'custom':
                if (typeof this.config.customYPosition === 'number') {
                    y = displayBounds.y + Math.round((displayBounds.height * this.config.customYPosition) / 100);
                } else {
                    y = displayBounds.y;
                }
                break;
        }

        const x = displayBounds.x + Math.round((displayBounds.width - width) / 2);
        const newBounds = { x, y, width, height };
        this.window.setBounds(newBounds);
    }

    /**
     * Toggles the visibility of the window
     */
    toggle(): void {
        if (!this.window) {
            return;
        }

        if (this.isVisible) {
            this.hide();
        } else {
            this.show();
        }
    }

    /**
     * Shows the window with animation
     */
    show(): void {
        if (!this.window) {
            return;
        }

        if (this.isVisible) {
            return;
        }

        this.stopAnimation();
        this.positionWindow();
        this.window.show();
        this.window.focus();

        if (this.config.animationDuration > 0) {
            this.animateShow();
        } else {
            this.completeShow();
        }
    }

    /**
     * Hides the window with animation
     */
    hide(): void {
        if (!this.window) {
            return;
        }

        if (!this.isVisible) {
            return;
        }

        this.stopAnimation();

        if (this.config.animationDuration > 0) {
            this.animateHide();
        } else {
            this.completeHide();
        }
    }

    /**
     * Finalizes the show operation
     */
    private completeShow(): void {
        this.isVisible = true;
    }

    /**
     * Finalizes the hide operation
     */
    private completeHide(): void {
        this.isVisible = false;
        if (this.window) {
            this.window.blur();
            this.window.hide();
        }
    }

    /**
     * Stops any ongoing animation
     */
    private stopAnimation(): void {
        if (this.animationFrame) {
            clearInterval(this.animationFrame);
            this.animationFrame = null;
        }
    }

    /**
     * Animates the window sliding in
     */
    private animateShow(): void {
        if (!this.window) {
            return;
        }

        const windowBounds = this.window.getBounds();
        const displayBounds = screen.getPrimaryDisplay().workArea;
        const steps = Math.max(5, Math.floor(this.config.animationDuration / 16)); // ~60fps
        let currentStep = 0;

        if (this.config.animationType === 'slide') {
            // For slide animation, we'll move the window from off-screen to its final position
            const startOpacity = this.config.opacity;
            let startY = 0;
            let endY = windowBounds.y;

            // Calculate start position based on terminal position
            if (this.config.position === 'top' || this.config.position === 'custom') {
                startY = displayBounds.y - windowBounds.height;
            } else if (this.config.position === 'bottom') {
                startY = displayBounds.y + displayBounds.height;
            } else { // middle
                endY = windowBounds.y;
                startY = endY - windowBounds.height;
            }

            const yIncrement = (endY - startY) / steps;

            // Set initial position and opacity
            this.window.setOpacity(startOpacity);
            this.window.setBounds({ ...windowBounds, y: startY });

            this.animationFrame = setInterval(() => {
                currentStep++;

                if (!this.window) {
                    this.stopAnimation();
                    return;
                }

                const newY = startY + (yIncrement * currentStep);
                this.window.setBounds({ ...windowBounds, y: Math.round(newY) });

                if (currentStep >= steps) {
                    this.stopAnimation();
                    this.window.setBounds({ ...windowBounds, y: endY });
                    this.completeShow();
                }
            }, 16);
        } else {
            // Default fade animation
            const startOpacity = 0;
            const endOpacity = this.config.opacity;
            const opacityIncrement = (endOpacity - startOpacity) / steps;

            // Start with zero opacity
            this.window.setOpacity(startOpacity);

            this.animationFrame = setInterval(() => {
                currentStep++;

                if (!this.window) {
                    this.stopAnimation();
                    return;
                }

                const newOpacity = startOpacity + (opacityIncrement * currentStep);
                this.window.setOpacity(newOpacity);

                if (currentStep >= steps) {
                    this.stopAnimation();
                    this.window.setOpacity(endOpacity);
                    this.completeShow();
                }
            }, 16);
        }
    }

    /**
     * Animates the window sliding out
     */
    private animateHide(): void {
        if (!this.window) {
            return;
        }

        const windowBounds = this.window.getBounds();
        const displayBounds = screen.getPrimaryDisplay().workArea;
        const steps = Math.max(5, Math.floor(this.config.animationDuration / 16)); // ~60fps
        let currentStep = 0;

        if (this.config.animationType === 'slide') {
            // For slide animation, we'll move the window to off-screen from its current position
            const startY = windowBounds.y;
            let endY = 0;

            // Calculate end position based on terminal position
            if (this.config.position === 'top' || this.config.position === 'custom') {
                endY = displayBounds.y - windowBounds.height;
            } else if (this.config.position === 'bottom') {
                endY = displayBounds.y + displayBounds.height;
            } else { // middle
                endY = startY - windowBounds.height;
            }

            const yIncrement = (endY - startY) / steps;

            this.animationFrame = setInterval(() => {
                currentStep++;

                if (!this.window) {
                    this.stopAnimation();
                    return;
                }

                const newY = startY + (yIncrement * currentStep);
                this.window.setBounds({ ...windowBounds, y: Math.round(newY) });

                if (currentStep >= steps) {
                    this.stopAnimation();
                    this.completeHide();
                }
            }, 16);
        } else {
            // Default fade animation
            const startOpacity = this.window.getOpacity();
            const endOpacity = 0;
            const opacityDecrement = (startOpacity - endOpacity) / steps;

            this.animationFrame = setInterval(() => {
                currentStep++;

                if (!this.window) {
                    this.stopAnimation();
                    return;
                }

                const newOpacity = startOpacity - (opacityDecrement * currentStep);
                const finalOpacity = Math.max(0, newOpacity);
                this.window.setOpacity(finalOpacity);

                if (currentStep >= steps) {
                    this.stopAnimation();
                    this.completeHide();
                }
            }, 16);
        }
    }

    /**
     * Updates the config and refreshes window settings
     */
    updateConfig(newConfig: GuakeConfig): void {
        this.config = newConfig;
        this.setupWindow();
    }

    /**
     * Cleans up resources when plugin is unloaded
     */
    cleanup(): void {
        this.stopAnimation();

        if (this.window) {

            if (this.originalBounds) {
                this.window.setBounds(this.originalBounds);
            }

            // Restore window properties
            this.window.setAlwaysOnTop(false);
            this.window.setVisibleOnAllWorkspaces(false);
            this.window.setOpacity(1.0);

            // Remove event listeners
            this.window.removeAllListeners('blur');

            // Make sure window is visible
            if (!this.window.isVisible()) {
                this.window.show();
            }
        }

        // Show dock icon if it was hidden
        if (process.platform === 'darwin' && this.config.hideDockIcon && app.dock) {
            app.dock.show();
        }

    }
} 