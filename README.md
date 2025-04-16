# Hyper-Guake

A Quake-style dropdown terminal plugin for [Hyper](https://hyper.is/).

This plugin enables a hotkey-activated dropdown terminal window similar to Quake console, Guake, Yakuake, and other dropdown terminals.

## Features

- Toggle terminal visibility with a customizable hotkey
- Configurable window position (top, middle, bottom, or custom)
- Adjustable window width and height
- Smooth fade animations when toggling
- Option to hide when focus is lost
- Customizable opacity
- Hide dock icon on macOS

## Installation

To install, edit your `~/.hyper.js` config file and add `'hyper-guake'` to the plugins list:

```js
plugins: [
  'hyper-guake'
]
```

Or use Hyper's CLI:

```
hyper i hyper-guake
```

## Configuration

Add a `guake` section to your `~/.hyper.js` config file:

```js
module.exports = {
  config: {
    // ... your other hyper config
    
    guake: {
      hotkey: 'Ctrl+`',          // Keyboard shortcut to toggle terminal
      width: 90,                 // Width as percentage of screen (1-100)
      height: 50,                // Height as percentage of screen (1-100)
      position: 'top',           // 'top', 'middle', 'bottom', or 'custom'
      customYPosition: 10,       // Custom position from top (percentage, only when position is 'custom')
      opacity: 0.9,              // Window opacity (0-1)
      animationDuration: 300,    // Animation duration in milliseconds (0 to disable)
      animationType: 'fade',     // Type of animation to use when showing/hiding the terminal
      hideOnBlur: true,          // Hide terminal when focus is lost
      hideDockIcon: false,       // Hide dock icon on macOS (requires restart)
    }
  },
  // ...
}
```

### Configuration Options

#### `hotkey`
- Type: `string`
- Default: `'Ctrl+`'
- Keyboard shortcut to toggle the terminal. Uses Electron's [Accelerator](https://www.electronjs.org/docs/latest/api/accelerator) format.

#### `width`
- Type: `number`
- Default: `90`
- Width of the terminal as a percentage of screen width (1-100).

#### `height`
- Type: `number`
- Default: `50`
- Height of the terminal as a percentage of screen height (1-100).

#### `position`
- Type: `string`
- Default: `'top'`
- Position of the terminal on the screen. Options:
  - `'top'`: Aligned to the top of the screen
  - `'middle'`: Centered vertically
  - `'bottom'`: Aligned to the bottom of the screen
  - `'custom'`: Custom position specified by `customYPosition`

#### `customYPosition`
- Type: `number`
- Default: `undefined`
- Position from the top of the screen as a percentage (0-100). Only used when `position` is set to `'custom'`.

#### `opacity`
- Type: `number`
- Default: `0.9`
- Window opacity (0-1). `1` is fully opaque, `0` is fully transparent.

#### `animationDuration`
- Type: `number`
- Default: `300`
- Duration of the fade in/out animation in milliseconds. Set to `0` to disable animation.

#### `animationType`
- Type: `string`
- Default: `'fade'`
- Type of animation to use when showing/hiding the terminal. Options:
  - `'fade'`: Fade in/out animation
  - `'slide'`: Slide in/out animation that moves the terminal window

#### `hideOnBlur`
- Type: `boolean`
- Default: `true`
- Whether to hide the terminal when it loses focus.

#### `hideDockIcon`
- Type: `boolean`
- Default: `false`
- Whether to hide the dock icon on macOS. Requires restarting Hyper after changing.

## License

MIT

## Development

### Building the Project

To build the project:

```bash
# Install dependencies
npm install

# Build the project
npm run build
```

This will compile the TypeScript files to JavaScript in the `dist` directory.

### Making a Release

To create a new release:

1. Make sure all your changes are committed and pushed to the repository.

2. Run the release script, which will:
   - Increment the version number in package.json
   - Create a git tag
   - Push changes and tags to GitHub
   - Publish to npm

```bash
npm run release
```

Alternatively, you can do it manually:

```bash
# Update version (patch, minor, or major)
npm version patch

# Push changes to GitHub
git push && git push --tags

# Publish to npm
npm publish
```

The GitHub workflow will automatically build and create a GitHub release when a new tag is pushed.