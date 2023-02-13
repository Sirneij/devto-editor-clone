<script lang="ts">
	import { showPreview } from '$lib/stores/editor.store';
	import { scale } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	import type { CustomError } from '$lib/types/error.interface';
	import { afterUpdate, onMount } from 'svelte';
	import { customSelect } from '$lib/utils/custom/select.custom';
	import { tagsFromServer } from '$lib/utils/contants';
	import Editor from '$lib/components/Editor/Editor.svelte';
	import Preview from '$lib/components/Editor/Preview.svelte';
	import { tagList } from '$lib/stores/tag.store';

	let contentValue = '',
		titleValue = '',
		imageValue: string | Blob,
		spanElement: HTMLSpanElement,
		italicsElement: HTMLElement,
		foregroundImageLabel: HTMLLabelElement,
		markup = '',
		errors: Array<CustomError> = [],
		tagContainer: HTMLDivElement,
		suggestionPannel: HTMLDivElement,
		tagInput: HTMLInputElement,
		isPublished: boolean;

	onMount(() => {
		if ($tagList.length >= 1) {
			customSelect(tagsFromServer, suggestionPannel, tagInput, tagContainer, $tagList);
		} else {
			customSelect(tagsFromServer, suggestionPannel, tagInput, tagContainer);
		}
	});
	afterUpdate(() => {
		if (tagInput || suggestionPannel || tagContainer) {
			if ($tagList.length >= 1) {
				customSelect(tagsFromServer, suggestionPannel, tagInput, tagContainer, $tagList);
			} else {
				customSelect(tagsFromServer, suggestionPannel, tagInput, tagContainer);
			}
		}
	});

	const onFileSelected = (e: Event) => {
		const target = e.target as HTMLInputElement;
		if (target && target.files) {
			imageValue = target.files[0];
			if (imageValue) {
				spanElement.innerHTML = imageValue.name;
				let reader = new FileReader();
				reader.readAsDataURL(imageValue);
				reader.onload = (e) => {
					const imgElement = document.createElement('img');
					imgElement.src = e.target?.result as string;
					imgElement.classList.add('img-cover');
					imgElement.width = 1602;
					imgElement.height = 903;
					foregroundImageLabel.appendChild(imgElement);
				};
			}
		}
	};
</script>

<svelte:head>
	{#if $showPreview}
		<title>Article preview | JohnSpeaks</title>
	{:else}
		<title>Write an article | JohnSpeaks</title>
	{/if}
</svelte:head>

<section class="section feature" aria-label="feature">
	<div class="container">
		<h2 class="headline headline-2 section-title center">
			{#if $showPreview}
				<span class="span">Article preview</span>
			{:else}
				<span class="span">Write an article</span>
			{/if}
		</h2>

		<div class="card-wrapper">
			{#if $showPreview}
				<Preview {markup} />
			{:else}
				<form class="form" data-form enctype="multipart/form-data">
					{#if errors}
						{#each errors as error (error.id)}
							<p
								class="center error"
								transition:scale|local={{ start: 0.7 }}
								animate:flip={{ duration: 200 }}
							>
								{error.error}
							</p>
						{/each}
					{/if}
					<label for="file-input" bind:this={foregroundImageLabel}>
						<span bind:this={spanElement}>Add Cover Image</span>
						<i class="fa-solid fa-2x fa-camera" bind:this={italicsElement} />
						<input
							id="file-input"
							type="file"
							on:change={(e) => onFileSelected(e)}
							name="fore-ground"
							class="input-field"
							accept="images/*"
							placeholder="Add a cover image"
							required
							data-input-field
						/>
					</label>

					<input
						type="text"
						name="title"
						bind:value={titleValue}
						class="input-field"
						placeholder="New article title here..."
						maxlength="250"
						required
						data-input-field
					/>

					<div class="tags-and-suggestion-container">
						<div class="tag-container" bind:this={tagContainer}>
							<input
								bind:this={tagInput}
								type="text"
								id="tag-input"
								placeholder="Add up to 4 tags (atleast 1 is required)..."
							/>
						</div>
						<div class="suggestions" bind:this={suggestionPannel} />
					</div>

					<Editor bind:markup bind:contentValue />

					<div class="input-wrapper">
						<input type="checkbox" id="is-published" bind:checked={isPublished} />
						<label for="is-published">Publish</label>
					</div>

					<button
						class="btn btn-primary center"
						type="submit"
						title="Create article. Ensure you fill all the fields in this form."
					>
						<span class="span">Create article</span>

						<i class="fa-solid fa-file-pen" />
					</button>
				</form>
			{/if}
		</div>
	</div>
</section>

<style>
	.btn {
		margin-top: 1rem;
		margin-left: auto;
		margin-right: auto;
	}
	.input-wrapper {
		display: flex;
		gap: 0;
		align-items: center;
		justify-content: center;
	}
	.input-wrapper input {
		width: 3rem;
	}
</style>
