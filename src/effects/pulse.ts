import * as vscode from "vscode";

export function pulseChar(editor: vscode.TextEditor, range: vscode.Range) {
  const frames = [
    { border: "1px solid rgba(255,255,255,0.4)" },
    { border: "2px solid rgba(255,255,255,0.8)" },
    { border: "1px solid rgba(255,255,255,0.4)" }
  ];

  let i = 0;
  const step = () => {
    if (i >= frames.length) {
        return;
    }
    const deco = vscode.window.createTextEditorDecorationType({
      border: frames[i].border,
      borderRadius: "4px",
      backgroundColor: "rgba(255,255,255,0.07)"
    });
    editor.setDecorations(deco, [range]);

    setTimeout(() => {
      deco.dispose();
      i++;
      if (i < frames.length) {
          step();
      }
    }, 55);
  };
  step();
}
