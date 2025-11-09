# HyperType

Transform your coding experience into a retro arcade adventure! HyperType adds satisfying pixel-art effects, dynamic sound feedback, and mesmerizing visual animations to every keystroke. Inspired by the addictive visual style of Balatro, HyperType makes typing code feel like playing a game.

![HyperType Demo](https://raw.githubusercontent.com/Thanh-Huy1104/hypertype/main/demo.mp4)

## ✨ Features

### � Visual Effects
- **Pixel Font Animations**: Beautiful M6X11 Plus pixel font with floating character effects
- **Color Gradients**: 74+ carefully curated colors that cycle through as you type
- **Expanding Corner Brackets**: Dynamic corner boxes that expand and frame your keystrokes
- **Directional Movement**: 
  - Regular typing floats upper-left with a gentle drift
  - Backspace floats upper-right
  - Enter/Tab float straight up
- **Screen Shake**: Satisfying screen shake on each keypress
- **Enter Markers**: Visual `>>>` markers appear in the gutter when pressing Enter

### 🔊 Sound Effects
- **Dynamic Pitch System**: Pitch rises gradually as you type faster, creating a rewarding flow state
- **Retro Sound Effects**: Satisfying chip-tune style sounds for typing
- **Special Sounds**: Unique sound for Enter key presses
- **Configurable**: Toggle sounds on/off via command palette

### 🎮 Special Keys
- **SPACE**: Special color with corner brackets
- **ENTER**: Floats straight up with unique sound effect
- **TAB**: Floats straight up with visual feedback
- **BACKSPACE/DELETE**: Silent feedback (visual only)
- **SHIFT+Letter**: Special color treatment

## 🚀 Installation

1. Open VS Code
2. Go to Extensions (Ctrl+Shift+X / Cmd+Shift+X)
3. Search for "HyperType"
4. Click Install
5. **If effects don't appear immediately**: Open Command Palette (Ctrl+Shift+P / Cmd+Shift+P) and run `Start Hypertype`
6. Start typing to see the magic! ✨

## 🎯 Usage

Once installed, HyperType works automatically:

1. Open any file in VS Code
2. Start typing to see floating pixel text and hear satisfying sounds
3. The more you type consecutively, the higher the pitch rises (resets after a brief pause)
4. Watch the expanding corner brackets frame your keystrokes
5. Feel the subtle screen shake with each character

### Commands

Access via Command Palette (Ctrl+Shift+P / Cmd+Shift+P):
- `HyperType: Toggle Sound` - Enable/disable sound effects

### Configuration

Open Settings and search for "HyperType":
- `hypertype.enableSound` - Enable or disable sound effects (default: true)

## 🎬 How It Works

### Visual Animations
- **Initial delay**: 150ms before floating begins
- **Float distance**: 12px upward movement with directional drift
- **Float speed**: Smooth 60fps animation
- **Corner brackets**: Expand from small to 30px with fast animation
- **Characters**: Rendered in uppercase with full opacity (no fade)

### Sound System
- **Pitch modulation**: Real frequency-based pitch shifting (not playback speed)
- **Range**: Subtle 0.95x to 1.3x pitch variation
- **Reset timer**: 300ms pause resets pitch to baseline
- **Web Audio API**: High-quality, low-latency audio playback

## 🎨 Color System

HyperType cycles through 74 vibrant colors including:
- Classic primaries (red, blue, green, yellow)
- Neon accents (cyan, magenta, lime, orange)
- Deep tones (navy, purple, burgundy, teal)
- Special colors for specific keys

## 🔧 Technical Details

- Uses VS Code's Decoration API for performant visual effects
- Web Audio API for true pitch shifting without speed changes
- M6X11 Plus pixel font rendered as SVG for crisp scaling
- Zero performance impact on typing - all effects are non-blocking
- Works with all file types and languages

## 💡 Tips

- **Flow State**: Type consistently to build up the pitch and create a rhythm
- **Visual Clarity**: Effects disappear quickly to avoid cluttering your code
- **Sound Customization**: Toggle sounds off if you prefer visual-only feedback
- **Distraction-Free**: All effects are subtle enough to enhance without distracting

## 🐛 Known Issues

- Tab key behavior may vary based on VS Code editor settings
- Effects appear in all text editors (file-type filtering coming soon)

## 📝 Release Notes

### 0.0.1

Initial release of HyperType:
- ✨ Pixel font typing effects with directional animations
- 🌈 Color gradient system with 74+ colors
- 🔊 Dynamic pitch-shifting sound system
- 📦 Expanding corner bracket animations
- 📺 Screen shake effects
- ⚡ Enter key gutter markers
- 🎹 Special key support (SPACE, TAB, ENTER, BACKSPACE, DELETE, SHIFT)
- 🎚️ Configurable sound toggle

## 🙏 Credits

- **M6X11 Plus Font**: Daniel Linssen - pixel-perfect retro font
- **Inspiration**: Balatro's addictive visual feedback design
- **Sound Effects**: Retro chip-tune style effects

## 📄 License

MIT License - See LICENSE file for details

---

**Make coding feel like an arcade game!** 🎮✨ 

Found a bug or have a feature request? [Open an issue on GitHub](https://github.com/Thanh-Huy1104/hypertype/issues)
