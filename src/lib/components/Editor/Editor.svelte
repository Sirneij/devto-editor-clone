<script lang="ts">
	import { showPreview } from '$lib/stores/editor.store';
	import { notification } from '$lib/stores/notification.store';
	import type { EditorContent } from '$lib/types/article.interface';
	import { greenColor, happyEmoji, redColor, sadEmoji } from '$lib/utils/contants';
	import {
		addBoldCommand,
		addCodeBlockCommand,
		addHeadingFiveCommand,
		addHeadingFourCommand,
		addHeadingSixCommand,
		addHeadingThreeCommand,
		addHeadingTwoCommand,
		addImageCommand,
		addItalicCommand,
		addLinkCommand,
		addNoteCommand,
		addOrderedListCommand,
		addTipCommand,
		addUnorderedListCommand,
		addWarningCommand,
		parseMarkdown,
		useKeyCombinations
	} from '$lib/utils/editor/editor.utils';

	let contentTextArea: HTMLTextAreaElement;
	export let contentValue: string;
	export let markup: string;

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
		<p
			on:click={() => {
				addBoldCommand(contentTextArea);
			}}
			class="tooltip"
		>
			<i class="fa-solid fa-bold" />
			<span class="tooltiptext">Bold command [Cmd/Ctrl(Shift) + B]</span>
		</p>
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<p
			class="tooltip"
			on:click={() => {
				addItalicCommand(contentTextArea);
			}}
		>
			<i class="fa-solid fa-italic" />
			<span class="tooltiptext"> Italics command [Cmd/Ctrl(Shift) + I] </span>
		</p>
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<p
			class="tooltip"
			on:click={() => {
				addLinkCommand(contentTextArea);
			}}
		>
			<i class="fa-solid fa-link" />
			<span class="tooltiptext">Add link command [Cmd/Ctrl(Shift) + K]</span>
		</p>
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<p
			class="tooltip"
			on:click={() => {
				addUnorderedListCommand(contentTextArea);
			}}
		>
			<i class="fa-solid fa-list" />
			<span class="tooltiptext">Add unordered list command</span>
		</p>
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<p
			class="tooltip"
			on:click={() => {
				addOrderedListCommand(contentTextArea);
			}}
		>
			<i class="fa-solid fa-list-ol" />
			<span class="tooltiptext">Add ordered list command</span>
		</p>
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<p class="dropdown">
			<i class="fa-solid fa-h dropbtn" />
			<span class="dropdown-content">
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<small
					on:click={() => {
						addHeadingTwoCommand(contentTextArea);
					}}><i class="fa-solid fa-h" /><sub>2</sub></small
				>
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<small
					on:click={() => {
						addHeadingThreeCommand(contentTextArea);
					}}><i class="fa-solid fa-h" /><sub>3</sub></small
				>
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<small
					on:click={() => {
						addHeadingFourCommand(contentTextArea);
					}}><i class="fa-solid fa-h" /><sub>4</sub></small
				>
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<small
					on:click={() => {
						addHeadingFiveCommand(contentTextArea);
					}}><i class="fa-solid fa-h" /><sub>5</sub></small
				>
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<small
					on:click={() => {
						addHeadingSixCommand(contentTextArea);
					}}><i class="fa-solid fa-h" /><sub>6</sub></small
				>
			</span>
		</p>

		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<p
			class="tooltip"
			on:click={() => {
				addImageCommand(contentTextArea);
			}}
		>
			<i class="fa-solid fa-image" />
			<span class="tooltiptext">Add image command</span>
		</p>
	</div>
	<div class="others">
		<p class="dropdown">
			<i class="fa-solid fa-ellipsis-vertical dropbtn" />
			<span class="dropdown-content">
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<small
					on:click={() => {
						addNoteCommand(contentTextArea);
					}}>Add note</small
				>
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<small
					on:click={() => {
						addTipCommand(contentTextArea);
					}}>Add tip</small
				>
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<small
					on:click={() => {
						addWarningCommand(contentTextArea);
					}}>Add warning</small
				>
			</span>
		</p>
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<p
			class="tooltip"
			on:click={() => {
				addCodeBlockCommand(contentTextArea);
			}}
		>
			<i class="fa-solid fa-code" />
			<span class="tooltiptext">Code block command</span>
		</p>
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<p class="tooltip" on:click={(e) => handlePreview(e)}>
			<i class="fa-solid fa-eye" />
			<span class="tooltiptext">Preview content</span>
		</p>
	</div>
</div>

<textarea
	bind:this={contentTextArea}
	bind:value={contentValue}
	on:focus={(event) => {
		if (event.target) {
			useKeyCombinations(event, contentTextArea);
		}
	}}
	name="content"
	class="input-field"
	id="textAreaContent"
	placeholder="Write your article content here (markdown supported)..."
	data-input-field
	required
/>
