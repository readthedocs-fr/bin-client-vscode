import { basename } from 'path';
import { window, commands, workspace, env, Uri, ExtensionContext } from 'vscode';
import { createBin, input } from './helpers';

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {};

export function activate(context: ExtensionContext): void {
	// eslint-disable-next-line sonarjs/cognitive-complexity
	const disposable = commands.registerCommand('rtdbin.createBin', async (_, selectedFiles?: Uri[]) => {
		const editor = selectedFiles
			? await window.showTextDocument(selectedFiles[0]).then(undefined, noop)
			: window.activeTextEditor;

		if (!editor) {
			window.showErrorMessage('There is no active text editor.');
			return;
		}

		const selection = editor.selection;
		const code = editor.document.getText(selection.isEmpty ? undefined : selection);

		if (!code) return;

		const configuration = workspace.getConfiguration('rtdbin');

		const lifeTime = await input({
			prompt: 'The lifetime of your bin (0 for never, else in this format: 1d1h1m1s)',
			placeHolder: 'Lifetime',
			value: configuration.get('defaultLifetime'),
			validateInput(value) {
				return !/^[\ddhms]+$/.test(value) ? 'Please enter a valid duration (0 or 1d1h1m1s).' : undefined;
			},
		});
		if (!lifeTime) return;

		const maxUses = await input({
			prompt: 'The max uses of your bin (0 for infinity)',
			placeHolder: 'Max uses',
			value: configuration.get('defaultMaxUses'),
			validateInput(value) {
				// eslint-disable-next-line @typescript-eslint/no-shadow
				const maxUses = parseInt(value, 10);
				return isNaN(maxUses) || maxUses < 0 ? 'Please enter a valid integer greater than or equal to 0.' : undefined;
			},
		});
		if (!maxUses) return;

		try {
			const binUrl = await createBin({
				code,
				fileName: basename(editor.document.fileName),
				maxUses: parseInt(maxUses),
				lifeTime: parseInt(lifeTime),
			});

			const action = await window.showInformationMessage(`[${binUrl}](${binUrl})`, 'Open', 'Copy');

			if (action === 'Open') {
				env.openExternal(Uri.parse(binUrl));
			} else {
				// action === 'Copy'
				env.clipboard.writeText(binUrl);
			}
		} catch (error) {
			window.showErrorMessage(error.toString());
		}
	});

	context.subscriptions.push(disposable);
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
export function deactivate(): void {}
