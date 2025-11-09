# HyperType

Transform your typing experience with retro pixel-art effects inspired by Balatro! Watch every keystroke come alive with floating animations, vibrant color gradients, and satisfying visual feedback.

## Features

- 🎮 **Pixel Font Rendering**: Beautiful M6X11 Plus pixel font for all typing effects
- 🌈 **Color Gradients**: 74+ carefully curated colors that cycle through as you type
- ✨ **Floating Animations**: Characters float upward with smooth wind-drift effects
- 📦 **Corner Brackets**: Expanding corner boxes frame your keystrokes
- 🎯 **Directional Movement**: 
  - Regular typing floats upper-left
  - Backspace floats upper-right  
  - Enter/Tab float straight up
- 🔤 **Capitalized Display**: All typed characters appear in uppercase
- 📊 **Screen Shake**: Subtle screen shake on each keypress
- 🎨 **Special Key Colors**: Distinct colors for SPACE, ENTER, TAB, BACKSPACE, DELETE, and SHIFT combinations
- 📍 **Enter Markers**: Visual `>>>` markers appear in the gutter when pressing Enter

## Installation

### From Source
1. Clone this repository
2. Run `npm install`
3. Run `npm run compile`
4. Press F5 to open a new VS Code window with the extension loaded

### From VSIX (Coming Soon)
Install directly from the VS Code Marketplace or download the .vsix file and install manually.

## Usage

1. Open any file in VS Code
2. Start typing to see the effects!
3. The HyperType panel will appear in the Explorer sidebar showing recent keystrokes

No configuration needed - just install and type!

## Visual Effects

### Character Types
- **Regular Characters**: Float upper-left with gradient colors and corner brackets
- **SPACE**: Special color, corner brackets, floats upper-left
- **ENTER**: Floats straight up, no corner brackets, shows `>>>` marker in gutter
- **TAB**: Floats straight up, no corner brackets
- **BACKSPACE**: Floats upper-right, no corner brackets
- **DELETE**: Special color with corner brackets
- **SHIFT+Letter**: Special color with corner brackets

### Animation Details
- Initial delay: 150ms before floating begins
- Float distance: 12px maximum
- Float speed: 1.5px per 25ms interval
- Hold time: 150ms at final position before disappearing
- No fade - characters maintain full opacity until disappearing

## Known Issues

- Tab key detection may vary depending on VS Code settings
- Effects appear in all editors (currently no toggle to disable)

## Release Notes

### 0.0.1

Initial release of HyperType:
- Pixel font typing effects
- Color gradient system with 74 colors
- Directional floating animations
- Corner bracket animations
- Screen shake effects
- Enter key gutter markers
- Special key support (SPACE, TAB, ENTER, BACKSPACE, DELETE, SHIFT)

## Credits

- **M6X11 Plus Font**: Used for pixel-perfect rendering
- Inspired by the visual style of Balatro

## License

MIT

---

**Enjoy your enhanced typing experience!** 🎮✨
