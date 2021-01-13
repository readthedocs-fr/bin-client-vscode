import { InputBoxOptions, window } from 'vscode';

export function input(options: InputBoxOptions): Thenable<string | undefined> {
  const valueEnd = options.value?.length ?? 0;
  return window.showInputBox({ valueSelection: [valueEnd, valueEnd], ...options });
}
