<script lang="ts">
	import hljs from 'highlight.js';
	import 'highlight.js/styles/night-owl.css';

	import { showPreview } from '$lib/stores/editor.store';
	import { onMount } from 'svelte';

	let articleContainer: HTMLDivElement;

	onMount(() => {
		hljs.highlightAll();
		const blocks = articleContainer.querySelectorAll('pre code.hljs');
		Array.prototype.forEach.call(blocks, function (block) {
			const language = block.result.language;
			const small = document.createElement('small');
			small.classList.add('language', language);
			small.innerText = language;
			block.appendChild(small);
		});
	});

	export let markup: string;
</script>

<section class="section feature" aria-label="feature">
	<div class="container">
		<div class="preview full-text">
			<div class="main-text" bind:this={articleContainer}>
				<p>{@html markup}</p>
			</div>
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<div
				title="Continue editing"
				class="side-text"
				on:click={() => {
					$showPreview = !showPreview;
				}}
			>
				<i class="fa-solid fa-pen-to-square" />
			</div>
		</div>
	</div>
</section>

<style>
	.preview.full-text {
		grid-template-columns: 0.2fr 3.8fr;
	}

	.side-text i {
		cursor: pointer;
	}
	@media (min-width: 992px) {
		.preview.full-text .side-text {
			background: #011627;
			position: fixed;
		}
	}
</style>
