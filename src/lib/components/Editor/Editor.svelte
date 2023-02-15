<script lang="ts">
	import { showPreview } from '$lib/stores/editor.store';
	import { notification } from '$lib/stores/notification.store';
	import type { EditorContent } from '$lib/types/article.interface';
	import { greenColor, happyEmoji, redColor, sadEmoji } from '$lib/utils/contants';
	import {
		getCaretPosition,
		parseMarkdown,
		setCaretPosition
	} from '$lib/utils/editor/editor.utils';
	import { onMount } from 'svelte';

	let contentTextArea: HTMLTextAreaElement;
	export let contentValue: string;
	export let markup: string;

	let updateTexareaValue: any, useKeyCombinations: any;
	onMount(() => {
		updateTexareaValue = (text: string) => {
			const { selectionEnd, selectionStart } = contentTextArea;
			contentValue = `${contentValue.slice(0, selectionEnd)}${text}${contentValue.slice(
				selectionEnd
			)}`;
			setCaretPosition(contentTextArea, text.length);
		};

		useKeyCombinations = (event: Event) => {
			let keysPressed: Record<string, boolean> = {};
			event.target?.addEventListener('keydown', (e) => {
				const keyEvent = e as KeyboardEvent;
				keysPressed[keyEvent.key] = true;

				if (
					(keysPressed['Control'] || keysPressed['Meta'] || keysPressed['Shift']) &&
					keyEvent.key == 'b'
				) {
					updateTexareaValue(`****`);
				} else if (
					(keysPressed['Control'] || keysPressed['Meta'] || keysPressed['Shift']) &&
					keyEvent.key == 'i'
				) {
					updateTexareaValue(`**`);
				} else if (
					(keysPressed['Control'] || keysPressed['Meta'] || keysPressed['Shift']) &&
					keyEvent.key === 'k'
				) {
					updateTexareaValue(`[text](link)`);
					setCaretPosition(contentTextArea, text.length);
				}
			});

			event.target?.addEventListener('keyup', (e) => {
				delete keysPressed[(e as KeyboardEvent).key];
			});
		};
	});
	const addBoldCommand = () => {
		updateTexareaValue(`****`);
	};
	const addItalicCommand = () => {
		updateTexareaValue(`**`);
	};
	const addLinkCommand = () => {
		updateTexareaValue(`[text](link)`);
	};
	const addUnorderedListCommand = () => {
		updateTexareaValue(`\n- First item\n- Second item\n`);
	};
	const addOrderedListCommand = () => {
		updateTexareaValue(`\n1. First item\n2. Second item\n`);
	};
	const addHeadingOneCommand = () => {
		updateTexareaValue(`\n# Your heading one {#id-name .class-name}\n\n`);
	};
	const addHeadingTwoCommand = () => {
		updateTexareaValue(`\n## Your heading one {#id-name .class-name}\n\n`);
	};
	const addHeadingThreeCommand = () => {
		updateTexareaValue(`\n### Your heading one {#id-name .class-name}\n\n`);
	};
	const addImageCommand = () => {
		updateTexareaValue(`![alt text](url)`);
	};
	const addCodeBlockCommand = () => {
		updateTexareaValue('\n```language\n<code here>\n```');
	};
	const addNoteCommand = () => {
		updateTexareaValue(
			'\n<div class="admonition note">\n<span class="title"><b>Note:</b> </span>\n<p></p>\n</div>'
		);
	};
	const addTipCommand = () => {
		updateTexareaValue(
			'\n<div class="admonition tip">\n<span class="title"><b>Tip:</b> </span>\n<p></p>\n</div>'
		);
	};
	const addWarningCommand = () => {
		updateTexareaValue(
			'\n<div class="admonition warning">\n<span class="title"><b>Warning:</b> </span>\n<p></p>\n</div>'
		);
	};
	const handlePreview = async (event: Event) => {
		const bodyEditor: EditorContent = {
			content: contentValue
		};

		markup = parseMarkdown(bodyEditor.content);
		if (markup.length >= 20) {
			$showPreview = !$showPreview;
			$notification = {
				message: `See, below, your previewed content ${happyEmoji}...`,
				backgroundColor: `${greenColor}`
			};
		} else {
			(event.target as HTMLElement).title =
				'To preview, ensure your content is at least 19 characters.';

			$notification = {
				message: `To preview, ensure your content is at least 19 characters ${sadEmoji}...`,
				backgroundColor: `${redColor}`
			};
		}
	};
</script>

<div class="editor-icons">
	<div class="basic">
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<p on:click={addBoldCommand} class="tooltip">
			<i class="fa-solid fa-bold" />
			<span class="tooltiptext">Bold command [Cmd/Ctrl(Shift) + B]</span>
		</p>
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<p class="tooltip" on:click={addItalicCommand}>
			<i class="fa-solid fa-italic" />
			<span class="tooltiptext"> Italics command [Cmd/Ctrl(Shift) + I] </span>
		</p>
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<p class="tooltip" on:click={addLinkCommand}>
			<i class="fa-solid fa-link" />
			<span class="tooltiptext">Add link command [Cmd/Ctrl(Shift) + K]</span>
		</p>
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<p class="tooltip" on:click={addUnorderedListCommand}>
			<i class="fa-solid fa-list" />
			<span class="tooltiptext">Add unordered list command</span>
		</p>
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<p class="tooltip" on:click={addOrderedListCommand}>
			<i class="fa-solid fa-list-ol" />
			<span class="tooltiptext">Add ordered list command</span>
		</p>
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<p class="tooltip" on:click={addHeadingOneCommand}>
			<i class="fa-solid fa-h" /><sub>1</sub>
			<span class="tooltiptext">Heading 1 command</span>
		</p>
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<p class="tooltip" on:click={addHeadingTwoCommand}>
			<i class="fa-solid fa-h" /><sub>2</sub>
			<span class="tooltiptext">Heading 2 command</span>
		</p>
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<p class="tooltip" on:click={addHeadingThreeCommand}>
			<i class="fa-solid fa-h" /><sub>3</sub>
			<span class="tooltiptext">Heading 3 command</span>
		</p>
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<p class="tooltip" on:click={addImageCommand}>
			<i class="fa-solid fa-image" />
			<span class="tooltiptext">Add image command</span>
		</p>
	</div>
	<div class="others">
		<p class="dropdown">
			<i class="fa-solid fa-ellipsis-vertical dropbtn" />
			<span class="dropdown-content">
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<small on:click={addNoteCommand}>Add note</small>
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<small on:click={addTipCommand}>Add tip</small>
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<small on:click={addWarningCommand}>Add warning</small>
			</span>
		</p>
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<p class="tooltip" on:click={addCodeBlockCommand}>
			<i class="fa-solid fa-code" />
			<span class="tooltiptext">Code block command</span>
		</p>
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<p class="tooltip" on:click={(e) => handlePreview(e)}>
			<i class="fa-solid fa-eye" />
		</p>
	</div>
</div>

<textarea
	bind:this={contentTextArea}
	bind:value={contentValue}
	on:focus={(event) => {
		if (event.target) {
			useKeyCombinations(event);
		}
	}}
	name="content"
	class="input-field"
	id="textAreaContent"
	placeholder="Write your article content here (markdown supported)..."
	data-input-field
	required
/>
