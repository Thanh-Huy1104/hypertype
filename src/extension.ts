import * as vscode from 'vscode';
import { startTypingEffect } from './effects/typing';
import { applyDecorations } from './effects/decorations';
import { PixelViewProvider } from './ui/pixelView';

export function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "hypertype" is now active!');

    const provider = new PixelViewProvider(context.extensionPath);

    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider(PixelViewProvider.viewType, provider, {
            webviewOptions: {
                retainContextWhenHidden: true
            }
        })
    );
    
    console.log('WebviewViewProvider registered for:', PixelViewProvider.viewType);

    // Listen for ready event immediately after provider is created
    provider.onReady.once('ready', () => {
        console.log('PixelView is ready, starting typing effect');
        
        // Initialize sound setting
        const config = vscode.workspace.getConfiguration('hypertype');
        const soundEnabled = config.get<boolean>('enableSound', true);
        provider.postMessage({ type: 'toggleSound', enabled: soundEnabled });
        
        startTypingEffect(context, provider);
    });

    // Command to toggle sound effects
    context.subscriptions.push(
        vscode.commands.registerCommand('hypertype.toggleSound', async () => {
            const config = vscode.workspace.getConfiguration('hypertype');
            const currentSetting = config.get<boolean>('enableSound', true);
            await config.update('enableSound', !currentSetting, vscode.ConfigurationTarget.Global);
            provider.postMessage({ type: 'toggleSound', enabled: !currentSetting });
            vscode.window.showInformationMessage(
                `HyperType sound effects ${!currentSetting ? 'enabled' : 'disabled'}`
            );
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('hypertype.start', async () => {
            console.log('hypertype.start command called');
            try {
                // First ensure the explorer is visible
                await vscode.commands.executeCommand('workbench.view.explorer');
                // Wait a bit for the explorer to open
                await new Promise(resolve => setTimeout(resolve, 100));
                // Try to focus the view using the correct command
                await vscode.commands.executeCommand('hypertype.pixelView.focus');
                console.log('View focus command executed');
            } catch (error) {
                console.error('Error in hypertype.start:', error);
            }
        })
    );

    applyDecorations(context);

    // Automatically open the view on activation
    setTimeout(async () => {
        console.log('Auto-opening HyperType view...');
        try {
            await vscode.commands.executeCommand('workbench.view.explorer');
            await new Promise(resolve => setTimeout(resolve, 100));
            await vscode.commands.executeCommand('hypertype.pixelView.focus');
            console.log('Auto-open view focus command executed');
        } catch (error) {
            console.error('Error auto-opening view:', error);
        }
    }, 1000);
}

export function deactivate() {}
