import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import { EventEmitter } from "events";

export class PixelViewProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = "hypertype.pixelView";

  private _view?: vscode.WebviewView;
  private _isReady = false;
  private _messageQueue: any[] = [];

  private _onReady: EventEmitter = new EventEmitter();
  public onReady = this._onReady;

  constructor(private readonly _extensionPath: string) {}

  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ) {
    console.log('PixelView: resolveWebviewView called');
    this._view = webviewView;

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [
        vscode.Uri.file(path.join(this._extensionPath, "media")),
      ],
    };

    try {
      webviewView.webview.html = this._getHtmlForWebview(webviewView);
      console.log('PixelView: HTML set successfully');
    } catch (error) {
      console.error('PixelView: Error setting HTML:', error);
    }

    webviewView.webview.onDidReceiveMessage((message) => {
      console.log('PixelView: received message', message);
      if (message.command === "ready") {
        console.log('PixelView: ready event received');
        this._isReady = true;
        this._onReady.emit("ready");
        this._processMessageQueue();
      }
    });
  }

  public update(buffer: string[]) {
    if (this._isReady && this._view) {
      this._view.webview.postMessage({ command: "update", buffer });
    } else {
      this._messageQueue.push({ command: "update", buffer });
    }
  }

  public postMessage(message: any) {
    if (this._isReady && this._view) {
      this._view.webview.postMessage(message);
    } else {
      this._messageQueue.push(message);
    }
  }

  private _processMessageQueue() {
    if (this._view) {
      while (this._messageQueue.length > 0) {
        const message = this._messageQueue.shift();
        this._view.webview.postMessage(message);
      }
    }
  }

  private _getHtmlForWebview(webviewView: vscode.WebviewView) {
    const htmlPath = path.join(
      this._extensionPath,
      "media",
      "pixelview",
      "index.html"
    );
    console.log('PixelView: Loading HTML from:', htmlPath);
    
    let html = fs.readFileSync(htmlPath, "utf8");
    console.log('PixelView: HTML loaded, length:', html.length);

    const mediaPath = vscode.Uri.file(
      path.join(this._extensionPath, "media", "pixelview")
    );

    return html.replace(/(src|href)="(.+?)"/g, (_, attr, p) => {
      const full = vscode.Uri.file(
        path.join(this._extensionPath, "media", "pixelview", p)
      );
      return `${attr}="${webviewView.webview.asWebviewUri(full)}"`;
    });
  }
}
