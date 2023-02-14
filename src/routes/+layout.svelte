<script lang="ts">
	import Footer from '$lib/components/Footer/Footer.svelte';
	import '$lib/dist/css/all.min.css';
	import '$lib/dist/css/style.min.css';
	import { notification } from '$lib/stores/notification.store';
	import { afterUpdate } from 'svelte';
	import { fly } from 'svelte/transition';

	let noficationElement: HTMLParagraphElement;

	afterUpdate(async () => {
		if (noficationElement && $notification.message !== '') {
			setTimeout(() => {
				noficationElement.classList.add('disappear');
				$notification = { message: '', backgroundColor: '' };
			}, 5000);
		}
	});
</script>

{#if $notification.message && $notification.backgroundColor}
	<p
		class="notification"
		bind:this={noficationElement}
		style="background: {$notification.backgroundColor}"
		in:fly={{ x: 200, duration: 500, delay: 500 }}
		out:fly={{ x: 200, duration: 500 }}
	>
		{$notification.message}
	</p>
{/if}

<main>
	<article>
		<slot />
	</article>
</main>

<Footer />
