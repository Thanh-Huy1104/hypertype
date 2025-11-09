import * as vscode from 'vscode';
import { PixelViewProvider } from '../ui/pixelView';
import { pixelTextDecoration, enterGutterDecoration, cornerBoxDecoration, createArrowGutterDecoration } from './decorations';
import { pulseChar } from './pulse';

const recentBuffer: string[] = [];
let pitchLevel = 0; // Increments with each keystroke
let pitchResetTimer: NodeJS.Timeout | null = null;

async function onType(context: vscode.ExtensionContext, text: string, provider: PixelViewProvider) {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        return;
    }

    // Increment pitch level with each keystroke
    pitchLevel++;
    
    // Reset pitch level after 300ms of no typing
    if (pitchResetTimer) {
        clearTimeout(pitchResetTimer);
    }
    pitchResetTimer = setTimeout(() => {
        pitchLevel = 0;
    }, 300);
    
    // Calculate pitch based on consecutive keystrokes (0.95 to 1.3)
    // Each keystroke increases pitch by a small amount (0.01)
    const pitch = Math.min(1.3, Math.max(0.95, 1.0 + (pitchLevel * 0.01)));

    // First, let the default type command handle the actual text insertion
    await vscode.commands.executeCommand('default:type', { text });
    
    const cursor = editor.selection.active;
    
    // For Enter, the decoration should appear at the end of the previous line
    let charRange: vscode.Range;
    if (text === '\n') {
        // Cursor is now on new line, go back to end of previous line
        if (cursor.line > 0) {
            const prevLineEnd = editor.document.lineAt(cursor.line - 1).range.end;
            charRange = new vscode.Range(prevLineEnd, prevLineEnd);
        } else {
            // Shouldn't happen, but fallback
            charRange = new vscode.Range(cursor, cursor);
        }
    } else if (text === '\t') {
        // For tab, show at the position before the tab was inserted
        const tabStart = new vscode.Position(cursor.line, Math.max(0, cursor.character - 1));
        charRange = new vscode.Range(tabStart, cursor);
    } else {
        charRange = new vscode.Range(cursor.translate(0, -1), cursor);
    }

    let token =
        text === ' ' ? 'SPACE' :
        text === '\n' ? 'ENTER' :
        text === '\t' ? 'TAB' :
        text; // Capitalize all text

    if (text.length === 1 && /[A-Z]/.test(text)) {
        token = `SHIFT+${text}`;
    }
    
    if (token) {
        // Determine direction based on token type
        let direction: 'left' | 'right' | 'middle' = 'left';
        if (token === 'ENTER' || token === 'TAB') {
            direction = 'middle';
        }
        
        // Get the color once at the start - this will be used throughout the animation
        const { decoration: firstDeco, color: baseColor } = pixelTextDecoration(token, 26, 0, undefined, direction);
        
        // Floating text with wind effect - keeping the same color
        let offset = 0;
        const decorations: vscode.TextEditorDecorationType[] = [];
        const maxOffset = 12; // Reduced float distance
        
        // Show initial decoration
        editor.setDecorations(firstDeco, [{ range: charRange }]);
        decorations.push(firstDeco);
        
        // Wait before starting to float
        setTimeout(() => {
            const animationInterval = setInterval(() => {
                // Dispose previous decoration
                if (decorations.length > 0) {
                    decorations.shift()?.dispose();
                }
                
                offset += 1.5; // Slower animation
                // Pass baseColor to maintain the same color throughout
                const { decoration: windDeco } = pixelTextDecoration(token, 26, offset, baseColor, direction);
                
                decorations.push(windDeco);
                editor.setDecorations(windDeco, [{ range: charRange }]);
                
                if (offset >= maxOffset) {
                    clearInterval(animationInterval);
                    // Stay at end position for a moment before disappearing
                    setTimeout(() => {
                        decorations.forEach(d => d.dispose());
                    }, 150);
                }
            }, 25); // Slower interval
        }, 150); // Delay before starting to float
        
        // Small shake for each character
        provider.postMessage({ type: 'shake', intensity: 0.3 });
        
        // Play typing sound with pitch based on typing speed
        // Use 'enter' sound for ENTER key, 'normal' for everything else
        const soundType = token === 'ENTER' ? 'enter' : 'normal';
        provider.postMessage({ type: 'playSound', soundType, pitch });
        
        // Corner box expansion effect on the character itself (not for ENTER, TAB, or BACKSPACE)
        if (token !== 'ENTER' && token !== 'TAB' && token !== 'BACKSPACE') {
            let expansion = 0;
            const cornerDecorations: vscode.TextEditorDecorationType[] = [];
            const isSpecial = token === 'SPACE' || token === 'DELETE' || token.startsWith('SHIFT+');
            const cornerColor = isSpecial ? '#ff00ff' : '#00ffff';
            
            const cornerInterval = setInterval(() => {
                // Dispose previous corner decoration
                if (cornerDecorations.length > 0) {
                    cornerDecorations.shift()?.dispose();
                }
                
                expansion += 3; // Much faster expansion
                const cornerDeco = cornerBoxDecoration(cornerColor, expansion);
                cornerDecorations.push(cornerDeco);
                editor.setDecorations(cornerDeco, [{ range: charRange }]);
                
                if (expansion >= 30) { // Much bigger total expansion
                    clearInterval(cornerInterval);
                    setTimeout(() => {
                        cornerDecorations.forEach(d => d.dispose());
                    }, 50);
                }
            }, 16); // Faster interval (60fps)
        }
    }

    pulseChar(editor, charRange);

    if (token === 'ENTER') {
        // Add >>> arrow decoration in the gutter on the new line
        const arrowGutter = createArrowGutterDecoration();
        editor.setDecorations(arrowGutter, [{
            range: new vscode.Range(cursor.line, 0, cursor.line, 0)
        }]);
        setTimeout(() => arrowGutter.dispose(), 1500);
        
        provider.postMessage({ type: 'shake' });
    } else {
        // Small shake for regular characters
        provider.postMessage({ type: 'shake', intensity: 0.5 });
    }

    recentBuffer.push(text);
    if (recentBuffer.length > 50) {
        recentBuffer.shift(); // Keep buffer from growing too large
    }
    provider.update(recentBuffer);
}

export function startTypingEffect(context: vscode.ExtensionContext, provider: PixelViewProvider) {
    console.log('startTypingEffect');

    const typeDisposable = vscode.commands.registerCommand('type', async (args) => {
        await onType(context, args.text, provider);
    });

    const tabDisposable = vscode.commands.registerCommand('tab', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }
        
        // Increment pitch level
        pitchLevel++;
        
        if (pitchResetTimer) {
            clearTimeout(pitchResetTimer);
        }
        pitchResetTimer = setTimeout(() => {
            pitchLevel = 0;
        }, 300);
        
        const pitch = Math.min(1.3, Math.max(0.95, 1.0 + (pitchLevel * 0.01)));
        
        // Execute default tab behavior first
        await vscode.commands.executeCommand('default:type', { text: '\t' });
        
        const cursor = editor.selection.active;
        const tabStart = new vscode.Position(cursor.line, Math.max(0, cursor.character - 1));
        const charRange = new vscode.Range(tabStart, cursor);
        
        const token = 'TAB';
        const direction = 'middle';
        
        // Get the color once at the start
        const { decoration: firstDeco, color: baseColor } = pixelTextDecoration(token, 26, 0, undefined, direction);
        
        // Floating text with wind effect
        let offset = 0;
        const decorations: vscode.TextEditorDecorationType[] = [];
        const maxOffset = 12;
        
        // Show initial decoration
        editor.setDecorations(firstDeco, [{ range: charRange }]);
        decorations.push(firstDeco);
        
        // Wait before starting to float
        setTimeout(() => {
            const animationInterval = setInterval(() => {
                if (decorations.length > 0) {
                    decorations.shift()?.dispose();
                }
                
                offset += 1.5;
                const { decoration: windDeco } = pixelTextDecoration(token, 26, offset, baseColor, direction);
                
                decorations.push(windDeco);
                editor.setDecorations(windDeco, [{ range: charRange }]);
                
                if (offset >= maxOffset) {
                    clearInterval(animationInterval);
                    setTimeout(() => {
                        decorations.forEach(d => d.dispose());
                    }, 150);
                }
            }, 25);
        }, 150);
        
        // Small shake
        provider.postMessage({ type: 'shake', intensity: 0.3 });
        
        // Play typing sound with pitch
        provider.postMessage({ type: 'playSound', soundType: 'normal', pitch });
        
        recentBuffer.push('\t');
        if (recentBuffer.length > 50) {
            recentBuffer.shift();
        }
        provider.update(recentBuffer);
    });

    const deleteLeftDisposable = vscode.commands.registerCommand('deleteLeft', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }
        
        const cursor = editor.selection.active;
        
        // Only show decoration if there's a character to delete
        if (cursor.character > 0) {
            const charRange = new vscode.Range(cursor.translate(0, -1), cursor);
            
            // Get the color once at the start
            const { decoration: firstDeco, color: baseColor } = pixelTextDecoration('BACKSPACE', 26, 0, undefined, 'right');
            
            // Floating text with wind effect (towards top-right for backspace)
            let offset = 0;
            const decorations: vscode.TextEditorDecorationType[] = [];
            const maxOffset = 12;
            
            // Show initial decoration
            editor.setDecorations(firstDeco, [{ range: charRange }]);
            decorations.push(firstDeco);
            
            // Wait before starting to float
            setTimeout(() => {
                const animationInterval = setInterval(() => {
                    // Dispose previous decoration
                    if (decorations.length > 0) {
                        decorations.shift()?.dispose();
                    }
                    
                    offset += 1.5;
                    // Use 'right' direction to make it drift upper-right
                    const { decoration: windDeco } = pixelTextDecoration('BACKSPACE', 26, offset, baseColor, 'right');
                    
                    decorations.push(windDeco);
                    editor.setDecorations(windDeco, [{ range: charRange }]);
                    
                    if (offset >= maxOffset) {
                        clearInterval(animationInterval);
                        // Stay at end position for a moment before disappearing
                        setTimeout(() => {
                            decorations.forEach(d => d.dispose());
                        }, 150);
                    }
                }, 25);
            }, 150);
        }
        
        // Delete the character manually
        await editor.edit(editBuilder => {
            if (!editor.selection.isEmpty) {
                // Delete selection
                editBuilder.delete(editor.selection);
            } else {
                // Delete one character to the left
                const position = editor.selection.active;
                if (position.character > 0) {
                    const deleteRange = new vscode.Range(
                        position.translate(0, -1),
                        position
                    );
                    editBuilder.delete(deleteRange);
                } else if (position.line > 0) {
                    // Delete newline at beginning of line
                    const prevLineEnd = editor.document.lineAt(position.line - 1).range.end;
                    const deleteRange = new vscode.Range(prevLineEnd, position);
                    editBuilder.delete(deleteRange);
                }
            }
        });
        
        // Update buffer
        recentBuffer.pop();
        provider.update(recentBuffer);
        
        // Small shake for backspace
        provider.postMessage({ type: 'shake', intensity: 0.5 });
        
        // No sound for backspace
    });

    const deleteRightDisposable = vscode.commands.registerCommand('deleteRight', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }
        
        const cursor = editor.selection.active;
        const lineLength = editor.document.lineAt(cursor.line).text.length;
        
        // Only show decoration if there's a character to delete
        if (cursor.character < lineLength) {
            const charRange = new vscode.Range(cursor, cursor.translate(0, 1));
            
            // Get the color once at the start
            const { decoration: firstDeco, color: baseColor } = pixelTextDecoration('DELETE', 26, 0);
            
            // Floating text with wind effect
            let offset = 0;
            const decorations: vscode.TextEditorDecorationType[] = [];
            const maxOffset = 12;
            
            // Show initial decoration
            editor.setDecorations(firstDeco, [{ range: charRange }]);
            decorations.push(firstDeco);
            
            // Wait before starting to float
            setTimeout(() => {
                const animationInterval = setInterval(() => {
                    // Dispose previous decoration
                    if (decorations.length > 0) {
                        decorations.shift()?.dispose();
                    }
                    
                    offset += 1.5;
                    const { decoration: windDeco } = pixelTextDecoration('DELETE', 26, offset, baseColor);
                    
                    decorations.push(windDeco);
                    editor.setDecorations(windDeco, [{ range: charRange }]);
                    
                    if (offset >= maxOffset) {
                        clearInterval(animationInterval);
                        // Stay at end position for a moment before disappearing
                        setTimeout(() => {
                            decorations.forEach(d => d.dispose());
                        }, 150);
                    }
                }, 25);
            }, 150);
            
            // Corner box expansion effect
            let expansion = 0;
            const cornerDecorations: vscode.TextEditorDecorationType[] = [];
            const cornerColor = '#ff00ff';
            
            const cornerInterval = setInterval(() => {
                if (cornerDecorations.length > 0) {
                    cornerDecorations.shift()?.dispose();
                }
                
                expansion += 3; // Much faster expansion
                const cornerDeco = cornerBoxDecoration(cornerColor, expansion);
                cornerDecorations.push(cornerDeco);
                editor.setDecorations(cornerDeco, [{ range: charRange }]);
                
                if (expansion >= 30) { // Much bigger total expansion
                    clearInterval(cornerInterval);
                    setTimeout(() => {
                        cornerDecorations.forEach(d => d.dispose());
                    }, 50);
                }
            }, 16); // Faster interval (60fps)
        }
        
        // Delete the character manually
        await editor.edit(editBuilder => {
            if (!editor.selection.isEmpty) {
                // Delete selection
                editBuilder.delete(editor.selection);
            } else {
                // Delete one character to the right
                const position = editor.selection.active;
                const lineLength = editor.document.lineAt(position.line).text.length;
                if (position.character < lineLength) {
                    const deleteRange = new vscode.Range(
                        position,
                        position.translate(0, 1)
                    );
                    editBuilder.delete(deleteRange);
                } else if (position.line < editor.document.lineCount - 1) {
                    // Delete newline at end of line
                    const nextLineStart = editor.document.lineAt(position.line + 1).range.start;
                    const deleteRange = new vscode.Range(position, nextLineStart);
                    editBuilder.delete(deleteRange);
                }
            }
        });
        
        // Update buffer
        recentBuffer.pop();
        provider.update(recentBuffer);
        
        // Small shake for delete
        provider.postMessage({ type: 'shake', intensity: 0.5 });
        
        // No sound for delete
    });

    context.subscriptions.push(typeDisposable, tabDisposable, deleteLeftDisposable, deleteRightDisposable);
}
