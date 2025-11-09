import * as vscode from 'vscode';
import { M6X11_FONT_BASE64 } from '../font';

const GRADIENT_COLORS = [
  '#fda0a5',
  '#ee8f8d',
  '#ff7269',
  '#ff6368',
  '#fd5f55',
  '#ec2d33',
  '#a61a1f',
  '#f6f0d5',
  '#fee9c6',
  '#fde486',
  '#fff4b4',
  '#fde4b3',
  '#fdcf51',
  '#fde700',
  '#da9a81',
  '#ca8466',
  '#fd7957',
  '#eb6b43',
  '#ca6430',
  '#ba5131',
  '#a24e34',
  '#f5a600',
  '#fd9e57',
  '#fda200',
  '#db9720',
  '#f2994b',
  '#fa8f0b',
  '#f28a3c',
  '#d66b1b',
  '#864b1c',
  '#ffd081',
  '#d9b672',
  '#b88828',
  '#a48447',
  '#f4f8f9',
  '#dcdcdc',
  '#bcbcbc',
  '#a6a6a6',
  '#bfc7d5',
  '#009cfd',
  '#d7f9fc',
  '#b5e8f2',
  '#b1fffd',
  '#bafee2',
  '#83e9f8',
  '#5aabdc',
  '#3cb4ff',
  '#0081d3',
  '#899ad1',
  '#718dbf',
  '#5d5e8e',
  '#d58ac0',
  '#e074a2',
  '#beb0e1',
  '#aa8ed4',
  '#9879cb',
  '#ae65ff',
  '#935adc',
  '#7d51ae',
  '#796e9e',
  '#634d84',
  '#4e3381',
  '#a0b29d',
  '#a0c5c3',
  '#86a367',
  '#64825c',
  '#5e7977',
  '#4f7869',
  '#4f6367',
  '#334461',
  '#74cca8',
  '#56a786',
  '#459373',
];

const SPECIAL_COLORS = [
  '#ff9690',
  '#c14139',
  '#008be3',
  '#ea9600',
  '#c88000',
  '#fdfdfd',
  '#f7f1e4',
  '#b7a88a',
  '#847f66',
];

let colorIndex = 0;

function getNextGradientColor(): string {
  const color = GRADIENT_COLORS[colorIndex % GRADIENT_COLORS.length];
  colorIndex++;
  return color;
}

function getRandomSpecialColor(): string {
  return SPECIAL_COLORS[Math.floor(Math.random() * SPECIAL_COLORS.length)];
}

// Interpolate between two hex colors
function interpolateColor(color1: string, color2: string, factor: number): string {
  const c1 = parseInt(color1.slice(1), 16);
  const c2 = parseInt(color2.slice(1), 16);
  
  const r1 = (c1 >> 16) & 0xff;
  const g1 = (c1 >> 8) & 0xff;
  const b1 = c1 & 0xff;
  
  const r2 = (c2 >> 16) & 0xff;
  const g2 = (c2 >> 8) & 0xff;
  const b2 = c2 & 0xff;
  
  const r = Math.round(r1 + (r2 - r1) * factor);
  const g = Math.round(g1 + (g2 - g1) * factor);
  const b = Math.round(b1 + (b2 - b1) * factor);
  
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

// Get color that transitions through gradient based on progress (0-1)
function getTransitionColor(baseColor: string, progress: number): string {
  // Cycle through rainbow colors based on progress
  const colorCount = GRADIENT_COLORS.length;
  const position = progress * (colorCount - 1);
  const index1 = Math.floor(position) % colorCount;
  const index2 = (index1 + 1) % colorCount;
  const factor = position - Math.floor(position);
  
  return interpolateColor(GRADIENT_COLORS[index1], GRADIENT_COLORS[index2], factor);
}

function createTextSvg(text: string, color: string, size: number = 26, offset: number = 0): string {
  const charWidth = size * 0.7;
  const width = text.length * charWidth + 16;
  const height = size + 20;
  
  // No fade - keep full opacity throughout
  const opacity = 1;
  
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <style>
        @font-face {
          font-family: 'HyperTypePixel';
          src: url("data:font/ttf;base64,${M6X11_FONT_BASE64}") format("truetype");
        }
        text {
          font-family: 'HyperTypePixel', monospace;
          font-size: ${size}px;
          fill: ${color};
          fill-opacity: ${opacity};
          font-weight: bold;
          letter-spacing: 2px;
        }
      </style>
      <text x="8" y="${size + 4}">${text}</text>
    </svg>
  `;
  
  return 'data:image/svg+xml;base64,' + Buffer.from(svg).toString('base64');
}

function createCornerBoxSvg(color: string, expansion: number = 0): string {
  const baseWidth = 14; // Slimmer width to fit single character
  const baseHeight = 16; // Height for character
  const expandedWidth = baseWidth + expansion * 1.5;
  const expandedHeight = baseHeight + expansion * 1.5;
  const cornerSize = 4 + expansion * 0.5;
  const cornerThickness = 3; // Thicker lines
  const opacity = Math.max(0, 1 - (expansion / 15));
  
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${expandedWidth}" height="${expandedHeight}" viewBox="0 0 ${expandedWidth} ${expandedHeight}">
      <style>
        .corner {
          stroke: ${color};
          stroke-opacity: ${opacity};
          stroke-width: ${cornerThickness};
          fill: none;
          stroke-linecap: square;
        }
      </style>
      
      <!-- Top-left corner -->
      <path class="corner" d="M ${cornerSize} 0 L 0 0 L 0 ${cornerSize}" />
      
      <!-- Top-right corner -->
      <path class="corner" d="M ${expandedWidth - cornerSize} 0 L ${expandedWidth} 0 L ${expandedWidth} ${cornerSize}" />
      
      <!-- Bottom-left corner -->
      <path class="corner" d="M 0 ${expandedHeight - cornerSize} L 0 ${expandedHeight} L ${cornerSize} ${expandedHeight}" />
      
      <!-- Bottom-right corner -->
      <path class="corner" d="M ${expandedWidth} ${expandedHeight - cornerSize} L ${expandedWidth} ${expandedHeight} L ${expandedWidth - cornerSize} ${expandedHeight}" />
    </svg>
  `;
  
  return 'data:image/svg+xml;base64,' + Buffer.from(svg).toString('base64');
}

export function cornerBoxDecoration(color: string, expansion: number = 0) {
  const svgDataUri = createCornerBoxSvg(color, expansion);
  
  // Calculate offset to keep box centered as it expands
  const expansionOffset = expansion * 1.5 / 2;
  const baseX = 0; // Shifted right (was -7)
  const baseY = 0; // Lower (was -9)
  const centeredX = baseX - expansionOffset;
  const centeredY = baseY - expansionOffset;
  
  return vscode.window.createTextEditorDecorationType({
    before: {
      contentIconPath: vscode.Uri.parse(svgDataUri),
      margin: `0; position: absolute; transform: translate(${centeredX}px, ${centeredY}px);`,
      width: '0px',
      height: '0px',
    },
    rangeBehavior: vscode.DecorationRangeBehavior.ClosedClosed
  });
}

export function pixelTextDecoration(text: string, size: number = 26, offset: number = 0, baseColor?: string, direction?: 'left' | 'right' | 'middle'): { decoration: vscode.TextEditorDecorationType, color: string } {
  const isSpecial = text === 'SPACE' || text === 'ENTER' || text === 'TAB' || text === 'BACKSPACE' || text === 'DELETE' || text.startsWith('SHIFT+');
  
  // If no baseColor provided, get initial color
  if (!baseColor) {
    baseColor = isSpecial ? getRandomSpecialColor() : getNextGradientColor();
  }
  
  // Use the same color throughout (no transition)
  const color = baseColor;
  
  const svgDataUri = createTextSvg(text, color, size, offset);
  
  // Calculate offsets based on direction
  let verticalOffset: number;
  let horizontalOffset: number;
  
  if (direction === 'middle') {
    // Enter key - go straight up (no horizontal movement)
    verticalOffset = size + 14 + offset;
    horizontalOffset = -4; // Centered
  } else if (direction === 'right') {
    // Backspace - go upper-right (positive offset moves right)
    verticalOffset = size + 14 + offset;
    horizontalOffset = offset * 0.5 - 4; // Positive offset moves right
  } else {
    // Default - go upper-left
    verticalOffset = size + 14 + offset;
    horizontalOffset = -offset * 0.5 - 4;
  }
  
  const decoration = vscode.window.createTextEditorDecorationType({
    before: {
      contentIconPath: vscode.Uri.parse(svgDataUri),
      margin: `0; position: absolute; transform: translateY(-${verticalOffset}px) translateX(${horizontalOffset}px);`,
    },
    rangeBehavior: vscode.DecorationRangeBehavior.ClosedClosed
  });
  
  return { decoration, color };
}

export function enterGutterDecoration(icon: vscode.Uri) {
  return vscode.window.createTextEditorDecorationType({
    gutterIconPath: icon,
    gutterIconSize: "contain"
  });
}

function createArrowSvg(): string {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="60" height="28" viewBox="0 0 60 28">
      <style>
        @font-face {
          font-family: 'HyperTypePixel';
          src: url("data:font/ttf;base64,${M6X11_FONT_BASE64}") format("truetype");
        }
        text {
          font-family: 'HyperTypePixel', monospace;
          font-size: 24px;
          fill: #0080ff;
          font-weight: bold;
          letter-spacing: 2px;
        }
      </style>
      <text x="2" y="22">&gt;&gt;&gt;</text>
    </svg>
  `;
  
  return 'data:image/svg+xml;base64,' + Buffer.from(svg).toString('base64');
}

export function createArrowGutterDecoration(): vscode.TextEditorDecorationType {
  const svgDataUri = createArrowSvg();
  
  return vscode.window.createTextEditorDecorationType({
    before: {
      contentIconPath: vscode.Uri.parse(svgDataUri),
      margin: '0; position: absolute; left: -65px; top: 0;',
      width: '0px',
      height: '0px',
    },
    isWholeLine: true,
  });
}

export function applyDecorations(context: vscode.ExtensionContext) {
    console.log('applyDecorations');
}
